import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from typing import List, Tuple, Optional
from app.models.schemas import ServiceModel
from app.services.dataset_service import load_services
import logging

logger = logging.getLogger(__name__)

MODEL_NAME = "all-MiniLM-L6-v2"


class SearchEngine:
    def __init__(self):
        self.model: Optional[SentenceTransformer] = None
        self.index: Optional[faiss.IndexFlatIP] = None
        self.services: List[ServiceModel] = []
        self.embeddings: Optional[np.ndarray] = None

    def initialize(self):
        """Load model, build embeddings and FAISS index."""
        logger.info("Loading sentence transformer model...")
        self.model = SentenceTransformer(MODEL_NAME)
        self.services = load_services()

        logger.info(f"Building embeddings for {len(self.services)} services...")
        texts = [self._build_text(svc) for svc in self.services]
        raw_embeddings = self.model.encode(texts, show_progress_bar=False)

        # Normalize for cosine similarity
        norms = np.linalg.norm(raw_embeddings, axis=1, keepdims=True)
        self.embeddings = (raw_embeddings / norms).astype("float32")

        # Build FAISS index (Inner Product = cosine after normalization)
        dim = self.embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dim)
        self.index.add(self.embeddings)
        logger.info("Search engine initialized successfully.")

    def _build_text(self, svc: ServiceModel) -> str:
        """Build a rich text representation for embedding."""
        return (
            f"{svc.service_name}. {svc.description}. "
            f"Category: {svc.category}. Ministry: {svc.ministry}. "
            f"Tags: {', '.join(svc.tags)}. "
            f"Documents required: {', '.join(svc.documents)}."
        )

    def search(self, query: str, top_k: int = 6) -> List[ServiceModel]:
        """Semantic search with keyword fallback."""
        if self.model is None or self.index is None:
            raise RuntimeError("Search engine not initialized.")

        # Semantic search
        query_embedding = self.model.encode([query], show_progress_bar=False)
        norm = np.linalg.norm(query_embedding, axis=1, keepdims=True)
        query_embedding = (query_embedding / norm).astype("float32")

        scores, indices = self.index.search(query_embedding, top_k)
        scores = scores[0]
        indices = indices[0]

        results: List[Tuple[ServiceModel, float]] = []
        for score, idx in zip(scores, indices):
            if idx < 0 or float(score) < 0.1:
                continue
            svc = self.services[idx].model_copy()
            svc.relevance_score = round(float(score), 4)
            results.append((svc, float(score)))

        # Keyword fallback if semantic results are sparse
        if len(results) < 3:
            query_lower = query.lower()
            keyword_hits = []
            for svc in self.services:
                combined = f"{svc.service_name} {svc.description} {' '.join(svc.tags)}".lower()
                if any(word in combined for word in query_lower.split()):
                    if not any(r.id == svc.id for r, _ in results):
                        hit = svc.model_copy()
                        hit.relevance_score = 0.5
                        keyword_hits.append((hit, 0.5))
            results.extend(keyword_hits[:top_k - len(results)])

        # Sort by score descending
        results.sort(key=lambda x: x[1], reverse=True)
        return [r for r, _ in results[:top_k]]


# Singleton instance
_search_engine = SearchEngine()


def get_search_engine() -> SearchEngine:
    return _search_engine
