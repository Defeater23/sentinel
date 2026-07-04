import os
import shutil
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from core.config import settings

logger = logging.getLogger("sentinel.fleet")
router = APIRouter()

@router.post("/upload-gradients")
async def upload_gradients(vehicle_id: str, file: UploadFile = File(...)):
    """
    Fleet vehicles upload local gradient updates (Model 5 federated learning).
    Saved as fl_updates/{vehicle_id}_gradients.npz
    """
    fl_dir = "fl_updates"
    os.makedirs(fl_dir, exist_ok=True)
    save_path = os.path.join(fl_dir, f"{vehicle_id}_gradients.npz")
    
    try:
        with open(save_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        logger.info(f"Gradients uploaded successfully for vehicle {vehicle_id} to {save_path}")
        return {
            "status": "received",
            "vehicle_id": vehicle_id,
            "filename": file.filename
        }
    except Exception as e:
        logger.error(f"Failed to save gradients for vehicle {vehicle_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save gradients: {e}")

@router.get("/global-model/{model_name}")
async def get_global_model(model_name: str):
    """
    Fleet vehicles download updated global model weights.
    Looks for {model_name}_global.onnx in the model weight directory.
    """
    # Standard names: fusion, classifier, risk
    # Map model_name to weights path
    file_path = os.path.join(settings.model_dir, f"{model_name}_global.onnx")
    
    if not os.path.exists(file_path):
        # Fallback to returning the local base weight if the global aggregated weight doesn't exist yet
        # standard fallback paths:
        fallback_map = {
            "fusion": "model1_fusion.onnx",
            "classifier": "model2_classifier.onnx",
            "risk": "model3_risk.onnx",
        }
        fallback_name = fallback_map.get(model_name)
        if fallback_name:
            fallback_path = os.path.join(settings.model_dir, fallback_name)
            if os.path.exists(fallback_path):
                logger.info(f"Global model {model_name}_global.onnx not found. Falling back to local model: {fallback_path}")
                return FileResponse(fallback_path, filename=f"{model_name}_global.onnx")
                
        logger.warning(f"Requested global model weights {model_name} not found at {file_path}")
        raise HTTPException(
            status_code=404,
            detail=f"Global model file for '{model_name}' not found. Ensure models are trained and aggregated."
        )
        
    return FileResponse(file_path, media_type="application/octet-stream", filename=f"{model_name}_global.onnx")
