import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings

# Configure logging based on LOG_LEVEL
log_level = getattr(logging, settings.log_level.upper(), logging.INFO)
logging.basicConfig(
    level=log_level,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("sentinel.main")

from api.routes import inference, stream, fleet, health
from core.pipeline import InferencePipeline

pipeline = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pipeline
    logger.info("Initializing SENTINEL inference pipeline...")
    pipeline = InferencePipeline()
    pipeline.load_all_models()
    yield
    logger.info("Shutting down SENTINEL API...")
    if pipeline is not None:
        pipeline.cleanup()

app = FastAPI(
    title="SENTINEL API",
    description="Edge-AI ADAS Co-Pilot Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware allowing all origins for hackathon simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes with appropriate prefixes
app.include_router(health.router, prefix="/health")
app.include_router(inference.router, prefix="/api")
app.include_router(stream.router, prefix="/ws")
app.include_router(fleet.router, prefix="/api/fleet")
