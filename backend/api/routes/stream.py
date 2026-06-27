import json
import uuid
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

logger = logging.getLogger("sentinel.stream")
router = APIRouter()

@router.websocket("/stream")
async def websocket_stream(websocket: WebSocket):
    """
    Real-time streaming WebSocket endpoint. Receives sensor frames,
    runs the sequential inference pipeline, and pushes results back.
    Cleans up session rolling buffers upon disconnect.
    """
    from main import pipeline
    await websocket.accept()
    
    # Generate unique session identifier for this connection
    session_id = f"ws_{uuid.uuid4().hex[:8]}"
    logger.info(f"WebSocket client connected: {session_id}")
    
    try:
        while True:
            # Receive frame data as JSON text
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
            except json.JSONDecodeError:
                logger.warning(f"Session {session_id} sent invalid JSON.")
                await websocket.send_text(json.dumps({
                    "error": "Invalid JSON format received."
                }))
                continue

            # Run inference pipeline with session-isolated rolling history
            result = pipeline.run(payload, session_id=session_id)
            
            # Send result back to frontend
            await websocket.send_text(json.dumps(result))
            
    except WebSocketDisconnect:
        logger.info(f"WebSocket client disconnected: {session_id}")
    except Exception as e:
        logger.error(f"Error in stream session {session_id}: {e}", exc_info=True)
    finally:
        # Prevent memory leaks by cleaning up the rolling buffer deque
        if pipeline is not None:
            pipeline.cleanup_session(session_id)
