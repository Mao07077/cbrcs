from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from collections import defaultdict
import json
import uuid
from datetime import datetime
from config import logger

router = APIRouter()

rooms = defaultdict(list)
student_info = defaultdict(dict)

@router.websocket("/ws/{call_id}")
async def websocket_endpoint(websocket: WebSocket, call_id: str):
    await websocket.accept()
    student_id = str(uuid.uuid4())
    data = await websocket.receive_text()
    try:
        msg = json.loads(data)
        id_number = msg.get("id_number", "")
        name = msg.get("firstname", "Anonymous")
    except Exception:
        id_number = ""
        name = "Anonymous"
    rooms[call_id].append(websocket)
    student_info[call_id][websocket] = {
        "id": student_id,
        "name": name,
        "muted": False,
        "camera_off": False,
        "id_number": id_number,
    }

    async def broadcast_active_students():
        students = [
            {
                "id": info["id"],
                "name": info["name"],
                "muted": info.get("muted", False),
                "camera_off": info.get("camera_off", False),
            }
            for info in student_info[call_id].values()
        ]
        for ws in rooms[call_id]:
            await ws.send_text(json.dumps({
                "type": "active_students",
                "students": students,
            }))

    try:
        await websocket.send_text(json.dumps({
            "type": "student_id",
            "studentId": student_id,
            "callId": call_id
        }))
        await broadcast_active_students()
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
            except Exception:
                msg = {"type": "unknown", "message": data}
            
            if msg.get("type") == "status_update":
                info = student_info[call_id][websocket]
                info["muted"] = msg.get("muted", False)
                info["camera_off"] = msg.get("camera_off", False)
                await broadcast_active_students()
                continue
            elif msg.get("type") == "chat":
                chat_message = {
                    "type": "chat",
                    "message": {
                        "sender_name": student_info[call_id][websocket]["name"],
                        "timestamp": datetime.utcnow().isoformat(),
                        "message": msg.get("message", "")
                    }
                }
                for ws in rooms[call_id]:
                    await ws.send_text(json.dumps(chat_message))
            elif msg.get("type") in ["offer", "answer", "ice-candidate"]:
                target_id = msg.get("target")
                if target_id:
                    for ws in rooms[call_id]:
                        if student_info[call_id][ws]["id"] == target_id:
                            await ws.send_text(json.dumps({
                                "type": msg["type"],
                                "from": student_id,
                                msg["type"]: msg.get(msg["type"]),
                            }))
                            break
            else:
                for ws in rooms[call_id]:
                    if ws != websocket:
                        await ws.send_text(json.dumps(msg))
    except WebSocketDisconnect:
        rooms[call_id].remove(websocket)
        student_info[call_id].pop(websocket, None)
        await broadcast_active_students()
        logger.info(f"WebSocket disconnected: {call_id}")