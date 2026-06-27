from fastapi import APIRouter, Depends
from schemas.sensor_input import SensorPayload
from schemas.inference_output import InferenceResult
from core.pipeline import InferencePipeline

router = APIRouter()

def get_pipeline() -> InferencePipeline:
    from main import pipeline
    return pipeline

@router.post("/infer", response_model=InferenceResult)
async def run_inference(payload: SensorPayload, pipeline: InferencePipeline = Depends(get_pipeline)):
    """
    Main single-frame inference endpoint. Accepts sensor payload,
    orchestrates 4 models, and returns the structured ADAS result.
    """
    # Use Pydantic v2 model_dump with dict fallback
    data = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
    result = pipeline.run(data, session_id="rest_default")
    return result
