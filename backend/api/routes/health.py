from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_health():
    """
    Health check endpoint returning service status and per-model load state.
    """
    from main import pipeline
    if pipeline is None or pipeline.registry is None:
        return {
            "status": "unhealthy",
            "mock_mode": True,
            "models": {}
        }
    
    model_status = pipeline.registry.get_status()
    loaded_count = sum(1 for m in model_status.values() if m["loaded"])
    total_models = len(model_status)
    
    # Check if there are any runtime load exceptions (i.e. file exists but failed to initialize)
    has_load_failures = any(m.get("error") is not None for m in model_status.values())
    
    if has_load_failures:
        status = "unhealthy"
    elif loaded_count == total_models:
        status = "ok"
    else:
        # Some or all model files are missing, which is the expected development mock mode fallback
        status = "mock_mode"
        
    return {
        "status": status,
        "mock_mode": loaded_count < total_models,
        "models": model_status
    }
