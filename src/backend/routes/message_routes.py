from fastapi import APIRouter, HTTPException
from database import messages_collection, users_collection

router = APIRouter()

@router.get("/messages/{sender}/{receiver}")
def get_messages(sender: str, receiver: str):
    filtered = [
        msg for msg in messages_collection.find({
            "$or": [
                {"sender": sender, "receiver": receiver},
                {"sender": receiver, "receiver": sender}
            ]
        })
    ]
    return filtered

@router.post("/send-message")
def send_message(message: dict):
    if not all(k in message for k in ("sender", "receiver", "text")):
        raise HTTPException(status_code=400, detail="Missing fields")
    messages_collection.insert_one(message)
    return {"success": True}

@router.get("/instructor-chats/{instructor_name}")
def get_instructor_chats(instructor_name: str):
    students = list(users_collection.find({"role": {"$regex": "^student$", "$options": "i"}}))
    student_ids = [
        f"{student.get('firstname', '')} {student.get('lastname', '')}".strip().lower()
        for student in students
    ]
    return {"student_ids": student_ids}

@router.get("/instructors")
def get_instructors():
    instructors = list(users_collection.find({"role": "instructor"}))
    return [
        {
            "firstname": instructor.get("firstname", ""),
            "lastname": instructor.get("lastname", ""),
            "id_number": instructor.get("id_number", "")
        }
        for instructor in instructors
    ]