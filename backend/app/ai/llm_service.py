import httpx
import os
import asyncio
import logging
from typing import List, Optional
from app.models.schemas import ChatMessage

logger = logging.getLogger(__name__)

LM_STUDIO_BASE_URL = os.getenv("LM_STUDIO_URL", "http://localhost:1234")
LM_STUDIO_TIMEOUT  = int(os.getenv("LM_STUDIO_TIMEOUT", "180"))  # 3 min default

SYSTEM_PROMPT = """You are GovSaathi, an expert AI assistant for Indian Government Services.

Your responsibilities:
1. Help users understand which government service they need
2. Provide clear step-by-step guidance on how to apply
3. List required documents for any application
4. Explain fees, timelines, and eligibility criteria
5. Guide users to the correct official portals

STRICT RULES:
- NEVER invent or hallucinate government website URLs
- ONLY refer to official portals ending in .gov.in, .nic.in, .org.in, or .ac.in
- Use simple, clear language accessible to all citizens including rural users
- If you are unsure, say so honestly and suggest the official portal
- Be empathetic, patient, and thorough

FORMAT GUIDELINES:
- Use numbered lists for step-by-step instructions
- Use bullet points for documents and requirements
- Use **bold** for important terms
- Keep responses concise but complete
- Always end with the official portal link if available
"""

# ── Model ID cache ─────────────────────────────────────────────────────────
# We cache the model ID for 60 seconds so we don't hammer /v1/models on
# every single chat request. This also prevents the race where health-check
# gets the model but the chat call a second later times out.
_cached_model_id: Optional[str] = None
_cache_ts: float = 0.0
_CACHE_TTL = 60.0  # seconds


async def _get_model_id() -> Optional[str]:
    """
    Return the first loaded LM Studio model ID.
    Uses a 60-second cache so /v1/models is not called on every message.
    If /v1/models fails or returns nothing, falls back to 'local-model'
    (LM Studio accepts this string when any model is loaded).
    """
    global _cached_model_id, _cache_ts
    import time

    now = time.monotonic()
    if _cached_model_id and (now - _cache_ts) < _CACHE_TTL:
        return _cached_model_id

    # Try to get the real model name
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(f"{LM_STUDIO_BASE_URL}/v1/models")
            if resp.status_code == 200:
                data = resp.json().get("data", [])
                if data:
                    model_id = data[0].get("id", "local-model")
                    logger.info(f"LM Studio model detected: {model_id}")
                    _cached_model_id = model_id
                    _cache_ts = now
                    return model_id
                else:
                    # Server is up but no model listed yet — use generic name
                    logger.warning("LM Studio running but /v1/models returned empty list. "
                                   "Trying 'local-model'.")
                    _cached_model_id = "local-model"
                    _cache_ts = now
                    return "local-model"
    except httpx.ConnectError:
        logger.warning("LM Studio not reachable at %s", LM_STUDIO_BASE_URL)
    except httpx.TimeoutException:
        logger.warning("LM Studio /v1/models timed out")
    except Exception as e:
        logger.warning("LM Studio model-fetch error: %s", e)

    # Clear cache on failure
    _cached_model_id = None
    _cache_ts = 0.0
    return None


async def check_lm_studio_connection() -> bool:
    """Used by /health endpoint. Tests if LM Studio is reachable."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{LM_STUDIO_BASE_URL}/v1/models")
            return resp.status_code == 200
    except Exception:
        return False


async def get_ai_response(
    message: str,
    history: Optional[List[ChatMessage]] = None,
    service_context: Optional[str] = None,
) -> str:
    """
    Send a message to LM Studio and return the model's reply.
    Automatically detects the loaded model — no config needed.
    Falls back to keyword responses only if LM Studio is completely unreachable.
    """
    model_id = await _get_model_id()

    if model_id is None:
        logger.warning("LM Studio unreachable — using built-in fallback.")
        return _fallback_response(message)

    # Build OpenAI-compatible messages array
    messages: list = [{"role": "system", "content": SYSTEM_PROMPT}]

    if service_context:
        messages.append({
            "role": "system",
            "content": (
                f"The user is asking about this specific service:\n{service_context}\n"
                "Use this context to give a focused, accurate answer."
            ),
        })

    if history:
        for msg in history[-10:]:
            role    = msg.role    if hasattr(msg, "role")    else msg.get("role", "user")
            content = msg.content if hasattr(msg, "content") else msg.get("content", "")
            messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": message})

    # ── Attempt 1: use detected model ID ──────────────────────────────────
    result = await _call_lm_studio(model_id, messages)

    # ── Attempt 2: some LM Studio versions only accept "local-model" ──────
    if result is None and model_id != "local-model":
        logger.info("Retrying with model='local-model'")
        result = await _call_lm_studio("local-model", messages)

    if result is not None:
        return result

    # Both attempts failed — fall back
    logger.error("Both LM Studio attempts failed. Using keyword fallback.")
    return _fallback_response(message)


async def _call_lm_studio(model_id: str, messages: list) -> Optional[str]:
    """
    Make one POST request to LM Studio /v1/chat/completions.
    Returns the content string on success, None on any failure.
    Logs the actual error so you can see it in the backend console.
    """
    try:
        async with httpx.AsyncClient(timeout=LM_STUDIO_TIMEOUT) as client:
            payload = {
                "model": model_id,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 1024,
                "stream": False,
            }
            logger.info("POST /v1/chat/completions  model=%s  timeout=%ss",
                        model_id, LM_STUDIO_TIMEOUT)

            resp = await client.post(
                f"{LM_STUDIO_BASE_URL}/v1/chat/completions",
                json=payload,
            )

            if resp.status_code != 200:
                # Log the full error body so you can diagnose it
                logger.error(
                    "LM Studio returned HTTP %s:\n%s",
                    resp.status_code,
                    resp.text[:500],
                )
                return None

            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            logger.info("LM Studio response OK  (%d chars)", len(content))
            return content

    except httpx.ConnectError:
        logger.error("LM Studio connection refused — is it running on %s?",
                     LM_STUDIO_BASE_URL)
    except httpx.TimeoutException:
        logger.error(
            "LM Studio request timed out after %ss. "
            "Try a smaller model or increase LM_STUDIO_TIMEOUT in backend/.env",
            LM_STUDIO_TIMEOUT,
        )
    except (KeyError, IndexError) as e:
        logger.error("Unexpected LM Studio response format: %s", e)
    except Exception as e:
        logger.error("LM Studio unexpected error: %s", e, exc_info=True)

    return None


# ── Diagnostic endpoint helper ─────────────────────────────────────────────

async def diagnose_lm_studio() -> dict:
    """
    Called by GET /api/chat/diagnose to give the user a detailed status report.
    """
    import time
    result = {
        "base_url": LM_STUDIO_BASE_URL,
        "timeout_setting": LM_STUDIO_TIMEOUT,
        "server_reachable": False,
        "models_endpoint_ok": False,
        "loaded_models": [],
        "chat_test_ok": False,
        "chat_test_error": None,
        "recommendation": "",
    }

    # 1. TCP reachability
    try:
        async with httpx.AsyncClient(timeout=4.0) as c:
            r = await c.get(f"{LM_STUDIO_BASE_URL}/v1/models")
            result["server_reachable"] = True
            if r.status_code == 200:
                result["models_endpoint_ok"] = True
                data = r.json().get("data", [])
                result["loaded_models"] = [m.get("id") for m in data]
    except httpx.ConnectError:
        result["recommendation"] = (
            "LM Studio server is NOT running. "
            "Open LM Studio → Local Server tab → click Start Server."
        )
        return result
    except Exception as e:
        result["recommendation"] = f"Unexpected error reaching LM Studio: {e}"
        return result

    if not result["loaded_models"]:
        result["recommendation"] = (
            "LM Studio server is running but NO model is loaded. "
            "Go to the Local Server tab, select a model from the dropdown, then click Start Server."
        )
        return result

    # 2. Test a real chat completion
    model_id = result["loaded_models"][0]
    t0 = time.monotonic()
    try:
        async with httpx.AsyncClient(timeout=30.0) as c:
            r = await c.post(
                f"{LM_STUDIO_BASE_URL}/v1/chat/completions",
                json={
                    "model": model_id,
                    "messages": [
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user",   "content": "Reply with exactly: OK"},
                    ],
                    "max_tokens": 10,
                    "temperature": 0,
                    "stream": False,
                },
            )
            elapsed = round(time.monotonic() - t0, 2)
            if r.status_code == 200:
                result["chat_test_ok"] = True
                result["chat_test_latency_s"] = elapsed
                result["recommendation"] = (
                    f"Everything is working correctly! "
                    f"Model: {model_id}  |  Test latency: {elapsed}s"
                )
            else:
                result["chat_test_error"] = f"HTTP {r.status_code}: {r.text[:300]}"
                result["recommendation"] = (
                    "LM Studio server is running and a model is loaded, but "
                    f"the chat completions endpoint returned HTTP {r.status_code}. "
                    "Try restarting the LM Studio server."
                )
    except httpx.TimeoutException:
        result["chat_test_error"] = "Chat completions request timed out after 30s"
        result["recommendation"] = (
            "Model is loaded but responding very slowly. "
            "Try enabling GPU acceleration in LM Studio settings, "
            "or use a smaller model (Phi-3 Mini / Gemma 2B)."
        )
    except Exception as e:
        result["chat_test_error"] = str(e)

    return result


# ── Keyword fallback ───────────────────────────────────────────────────────

def _fallback_response(message: str) -> str:
    """
    Only used when LM Studio is completely offline.
    Does NOT appear when LM Studio is running — real AI response is used instead.
    """
    msg = message.lower()

    if any(w in msg for w in ["passport", "psk", "tatkal passport"]):
        return (
            "**Passport Application Guide** 🛂\n\n"
            "1. Visit **https://passportindia.gov.in** and register\n"
            "2. Fill Form 1 online\n"
            "3. Pay fee: ₹1,500 (Normal) / ₹2,000 (Tatkal)\n"
            "4. Book PSK appointment and visit with originals\n\n"
            "**Documents:** Aadhaar, Birth/Class 10 cert, Address proof, Photos\n\n"
            "_⚠️ LM Studio is offline — start it for full AI responses._"
        )
    if any(w in msg for w in ["aadhaar", "aadhar", "uid"]):
        return (
            "**Aadhaar Services**\n\n"
            "• New enrollment: Visit nearest Aadhaar centre\n"
            "• Update online: **https://myaadhaar.uidai.gov.in**\n\n"
            "_⚠️ LM Studio is offline — start it for full AI responses._"
        )
    if any(w in msg for w in ["pan card", "pan number", "e-pan"]):
        return (
            "**PAN Card**\n\n"
            "• Instant e-PAN (free): **https://www.incometax.gov.in** → Instant e-PAN\n"
            "• Physical card: ₹107 — same portal\n\n"
            "_⚠️ LM Studio is offline — start it for full AI responses._"
        )
    if any(w in msg for w in ["itr", "income tax return", "tax filing"]):
        return (
            "**Income Tax Return**\n\n"
            "File at **https://www.incometax.gov.in** → File Income Tax Return\n"
            "Need: PAN, Form 16, bank statements, Aadhaar\n\n"
            "_⚠️ LM Studio is offline — start it for full AI responses._"
        )
    if any(w in msg for w in ["driving licence", "driving license", "dl ", "learner"]):
        return (
            "**Driving Licence**\n\n"
            "Apply at **https://sarathi.parivahan.gov.in**\n"
            "Learner → theory test → 30 days → driving test → DL\n\n"
            "_⚠️ LM Studio is offline — start it for full AI responses._"
        )
    if any(w in msg for w in ["voter id", "epic card", "election card"]):
        return (
            "**Voter ID**\n\n"
            "Register at **https://voterportal.eci.gov.in** → Form 6\n\n"
            "_⚠️ LM Studio is offline — start it for full AI responses._"
        )
    if any(w in msg for w in ["pm kisan", "kisan samman", "farmer subsidy"]):
        return (
            "**PM Kisan Samman Nidhi**\n\n"
            "Register at **https://pmkisan.gov.in** → New Farmer Registration\n"
            "Benefit: ₹6,000/year in 3 installments\n\n"
            "_⚠️ LM Studio is offline — start it for full AI responses._"
        )
    if any(w in msg for w in ["ayushman", "pmjay", "health insurance", "abha"]):
        return (
            "**Ayushman Bharat**\n\n"
            "Check eligibility at **https://pmjay.gov.in** → Am I Eligible?\n"
            "Coverage: ₹5 lakh/family/year\n\n"
            "_⚠️ LM Studio is offline — start it for full AI responses._"
        )
    if any(w in msg for w in ["pf ", "provident fund", "epfo", "uan"]):
        return (
            "**EPFO / PF Withdrawal**\n\n"
            "Login at **https://www.epfindia.gov.in** → Online Services → Claim\n"
            "Need: UAN activated, Aadhaar linked, bank seeded\n\n"
            "_⚠️ LM Studio is offline — start it for full AI responses._"
        )
    if any(w in msg for w in ["msme", "udyam", "small business"]):
        return (
            "**MSME Udyam Registration (Free, Instant)**\n\n"
            "Register at **https://udyamregistration.gov.in**\n"
            "Need: Aadhaar + PAN only\n\n"
            "_⚠️ LM Studio is offline — start it for full AI responses._"
        )
    if any(w in msg for w in ["scholarship", "nsp", "student"]):
        return (
            "**National Scholarship Portal**\n\n"
            "Apply at **https://scholarships.gov.in**\n"
            "100+ scholarships for SC/ST/OBC/Minority/EWS students\n\n"
            "_⚠️ LM Studio is offline — start it for full AI responses._"
        )

    return (
        "Namaste! 🙏 I'm GovSaathi.\n\n"
        "I can help with Passport, Aadhaar, PAN, Voter ID, Driving Licence, "
        "PM Kisan, Ayushman Bharat, EPFO, MSME, Scholarships, and 150+ more services.\n\n"
        "Please describe what you need!\n\n"
        "_⚠️ LM Studio is currently offline. Start it for full AI-powered responses._"
    )
