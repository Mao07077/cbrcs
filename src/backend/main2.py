from fastapi import (
    FastAPI, HTTPException, Query, Body, WebSocket, WebSocketDisconnect, UploadFile, File, Form, status, BackgroundTasks, Path
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv

from collections import defaultdict

from typing import Optional, List, Dict
from bson import ObjectId
from datetime import datetime
import bcrypt
import ollama
import logging
import json
import os
import uuid



# Load environment variables from .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

if not all([MONGO_URI, DATABASE_NAME, COLLECTION_NAME]):
    raise RuntimeError("Missing MongoDB environment variables.")

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
users_collection = db[COLLECTION_NAME]
modules_collection = db["modules"]
pre_test_collection = db["pre_tests"]
post_test_collection = db["post_tests"]
scores_collection = db["scores"]
flashcards_collection = db["flashcards"]


app = FastAPI()

# Mount static files for uploads
app.mount(
    "/uploads",
    StaticFiles(directory=os.path.abspath("../uploads")),
    name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cbrcs.vercel.app",
        "https://cbrcs-git-aaron-maos-projects-a7ae5dee.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://g28s4zdq-8000.asse.devtunnels.ms/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    idNumber: str
    password: str

class ProfileData(BaseModel):
    firstname: str
    lastname: str
    id_number: str
    program: str
    hoursActivity: int = 0

def verify_password(password: str, hashed: str) -> bool:
    try:
        # Try bcrypt first
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        # If bcrypt fails, fallback to plain text comparison (for testing only)
        return password == hashed

@app.get("/")
def root():
    return {"message": "FastAPI Backend is Running!"}

@app.post("/api/login")
def login(data: LoginRequest):
    user = users_collection.find_one({"id_number": data.idNumber})
    if user and verify_password(data.password, user["password"]):
        return {
            "success": True,
            "id_number": user.get("id_number", ""),
            "role": user.get("role", ""),
            "program": user.get("program", ""),
            "firstname": user.get("firstname", ""),
            "lastname": user.get("lastname", ""),
            "hoursActivity": user.get("hoursActivity", 0),
            "surveyCompleted": user.get("surveyCompleted", False)
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/profile/{id_number}", response_model=ProfileData)
def get_profile(id_number: str):
    user = users_collection.find_one({"id_number": id_number})
    if user:
        return {
            "firstname": user.get("firstname", ""),
            "lastname": user.get("lastname", ""),
            "id_number": user.get("id_number", ""),
            "program": user.get("program", ""),
            "hoursActivity": user.get("hoursActivity", 0)
        }
    raise HTTPException(status_code=404, detail="User not found")

@app.get("/api/modules")
def get_modules(program: Optional[str] = Query(None)):
    query = {}
    if program and program != "All Programs":
        query["program"] = program
    modules = list(modules_collection.find(query))
    for module in modules:
        module["_id"] = str(module["_id"])
    return modules

@app.get("/api/dashboard/{id_number}")
def dashboard(id_number: str):
    # Fetch user profile
    user = users_collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    program = user.get("program", "All Programs")

    # Fetch modules for the user's program
    query = {}
    if program and program != "All Programs":
        query["program"] = program
    modules = list(modules_collection.find(query))
    modules_list = [{"_id": str(module["_id"]), "title": module["title"], "image_url": module.get("image_url", "")} for module in modules]

    # Fetch all scores for the user
    scores = scores_collection.find({"user_id": id_number})
    pre_tests = []
    post_tests = []

    for score in scores:
        module_id = score["module_id"]
        module = modules_collection.find_one({"_id": ObjectId(module_id)})
        module_title = module["title"] if module else "Unknown Module"

        if score.get("test_type") == "pretest":
            pre_test = pre_test_collection.find_one({"module_id": module_id})
            pre_test_title = pre_test["title"] if pre_test else f"Pre-Test for {module_title}"
            pre_tests.append({
                "pre_test_title": pre_test_title,
                "correct": score["correct"],
                "incorrect": score["incorrect"],
                "total_questions": score["total_questions"],
                "time_spent": score.get("time_spent", 0)
            })
        else:
            post_test = post_test_collection.find_one({"module_id": module_id})
            post_test_title = post_test["title"] if post_test else f"Post-Test for {module_title}"
            post_tests.append({
                "post_test_title": post_test_title,
                "correct": score["correct"],
                "incorrect": score["incorrect"],
                "total_questions": score["total_questions"],
                "time_spent": score.get("time_spent", 0)
            })

    return {
        "modules": modules_list,
        "pre_tests": pre_tests,
        "post_tests": post_tests
    }

@app.get("/students/{id_number}/recommended-pages", response_model=Dict[str, List[str]])
def get_recommended_pages(id_number: str):
    user = users_collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get the top 3 habits from the user's data
    top3_habits = user.get("top3Habits", [])

    # Map habits to corresponding pages, avoiding duplicates
    habit_to_page = {
        "Study with Friends": "learn-together",
        "Asking for Help": "instructor-chat",
        "Test Yourself Periodically": "modules",
        "Creating a Study Schedule": "scheduler",
        "Setting Study Goals": "notes",
        "Organizing Notes": "notes",
        "Teach What You've Learned": "learn-together",
        "Use of Flashcards": "flashcard",
        "Using Aromatherapy, Plants, or Music": "music"
    }
    recommended_pages = []
    for habit in top3_habits:
        page = habit_to_page.get(habit)
        if page and page not in recommended_pages:
            recommended_pages.append(page)

    return {"recommendedPages": recommended_pages}

@app.get("/user/settings/{id_number}")
async def get_user_settings(id_number: str):
    user = users_collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "success": True,
        "data": {
            "firstname": user.get("firstname", ""),
            "middlename": user.get("middlename", ""),
            "lastname": user.get("lastname", ""),
            "suffix": user.get("suffix", ""),
            "birthdate": user.get("birthdate", ""),
            "email": user.get("email", ""),
            "program": user.get("program", ""),
            "username": user.get("username", ""),
        },
    }

# ------------------- PRE-TEST ENDPOINTS -------------------

class QuestionWithAnswers(BaseModel):
    question: str
    options: List[str]
    correctAnswer: str
    wrongAnswers: List[str] = []

class PreTestResponse(BaseModel):
    pre_test_id: str
    module_id: str
    title: str
    questions: List[QuestionWithAnswers]

class PostTestSubmission(BaseModel):
    answers: Dict[str, str]
    user_id: str
    time_spent: int  # seconds

@app.get("/api/pre-test/{module_id}", response_model=PreTestResponse)
def get_pre_test(module_id: str):
    pre_test = pre_test_collection.find_one({"module_id": module_id})
    if not pre_test:
        raise HTTPException(status_code=404, detail="Pre-test not found")
    questions_with_answers = []
    for question in pre_test['questions']:
        wrong_answers = [opt for opt in question['options'] if opt != question['correctAnswer']]
        questions_with_answers.append(QuestionWithAnswers(
            question=question['question'],
            options=question['options'],
            correctAnswer=question['correctAnswer'],
            wrongAnswers=wrong_answers
        ))
    return PreTestResponse(
        pre_test_id=str(pre_test['_id']),
        module_id=pre_test['module_id'],
        title=pre_test['title'],
        questions=questions_with_answers
    )

@app.post("/api/pre-test/submit/{module_id}")
def submit_pre_test(module_id: str, submission: PostTestSubmission):
    pre_test = pre_test_collection.find_one({"module_id": module_id})
    if not pre_test:
        raise HTTPException(status_code=404, detail="Pre-test not found for this module")
    correct_answers = {str(index): question["correctAnswer"] for index, question in enumerate(pre_test["questions"])}
    correct_count = 0
    incorrect_count = 0
    for question, user_answer in submission.answers.items():
        correct_answer = correct_answers.get(question)
        if correct_answer and user_answer == correct_answer:
            correct_count += 1
        elif user_answer:
            incorrect_count += 1
    score_data = {
        "module_id": module_id,
        "user_id": submission.user_id,
        "correct": correct_count,
        "incorrect": incorrect_count,
        "total_questions": len(pre_test["questions"]),
        "user_answers": submission.answers,
        "test_type": "pretest",
        "time_spent": submission.time_spent,
        "submitted_at": datetime.utcnow()
    }
    scores_collection.insert_one(score_data)
    return {
        "success": True,
        "message": "Pre-test submitted successfully!",
        "correct": correct_count,
        "incorrect": incorrect_count,
        "total_questions": len(pre_test["questions"])
    }

@app.get("/api/module-status/{module_id}/{user_id}")
def get_module_status(module_id: str, user_id: str):
    # Check if pre-test is completed
    pre_test_score = scores_collection.find_one({
        "module_id": module_id,
        "user_id": user_id,
        "test_type": "pretest"
    })
    pre_test_completed = pre_test_score is not None

    # Check if post-test is completed
    post_test_score = scores_collection.find_one({
        "module_id": module_id,
        "user_id": user_id,
        "test_type": "posttest"
    })
    post_test_completed = post_test_score is not None

    return {
        "pre_test_completed": pre_test_completed,
        "post_test_completed": post_test_completed
    }

@app.get("/api/modules/{module_id}")
def get_module_by_id(module_id: str):
    try:
        module = modules_collection.find_one({"_id": ObjectId(module_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid module ID format")
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    module["_id"] = str(module["_id"])
    return module

class PostTestResponse(BaseModel):
    post_test_id: str
    module_id: str
    title: str
    questions: List[QuestionWithAnswers]

@app.get("/api/post-test/{module_id}", response_model=PostTestResponse)
def get_post_test(module_id: str):
    post_test = post_test_collection.find_one({"module_id": module_id})
    if not post_test:
        raise HTTPException(status_code=404, detail="Post-test not found")
    questions_with_answers = []
    for question in post_test['questions']:
        wrong_answers = [opt for opt in question['options'] if opt != question['correctAnswer']]
        questions_with_answers.append(QuestionWithAnswers(
            question=question['question'],
            options=question['options'],
            correctAnswer=question['correctAnswer'],
            wrongAnswers=wrong_answers
        ))
    return PostTestResponse(
        post_test_id=str(post_test['_id']),
        module_id=post_test['module_id'],
        title=post_test['title'],
        questions=questions_with_answers
    )



class ParaphraseRequest(BaseModel):
    input: str

class ParaphraseResponse(BaseModel):
    paraphrased: str

def create_prompt(input_text: str, correct_answer: str = None, wrong_answers: List[str] = None) -> str:
    prompt = (
        f"You are a helpful assistant. Please paraphrase the following question. "
        f"REMOVE ANY INTRODUCTION THAT SAYS IT'S A PARAPHRASE, REMOVE NUMBERING, AND REMOVE ANY NOTES. "
        f"DO NOT INCLUDE THE CORRECT ANSWER ('{correct_answer}') IN THE QUESTION TEXT. "
        f"Keep the meaning intact and maintain proper grammar.\n\n"
        f"Original question: {input_text}\n"
    )
    if wrong_answers:
        prompt += f"Wrong answers: {', '.join(wrong_answers)}\n"
    return prompt

@app.post("/api/paraphrase", response_model=ParaphraseResponse)
async def paraphrase(request: ParaphraseRequest):
    try:
        prompt = create_prompt(request.input)
        response = ollama.generate(model='llama3:latest', prompt=prompt)
        return {"paraphrased": response.response.strip()}
    except Exception as e:
        logging.error(f"Paraphrase error: {e}")
        raise HTTPException(status_code=500, detail="Failed to paraphrase input")
    
@app.get("/get_notes/{id_number}")
def get_notes(id_number: str):
    user = users_collection.find_one({"id_number": id_number})
    if not user:
            raise HTTPException(status_code=404, detail="User not found")
    notes = user.get("notes", [])
    return {"notes": notes} 


@app.post("/save_note")
def save_note(
    id_number: str = Body(...),
    note: dict = Body(...)
):
    user = users_collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    notes = user.get("notes", [])
    notes.insert(0, note)  # Add new note at the beginning
    users_collection.update_one({"id_number": id_number}, {"$set": {"notes": notes}})
    return {"success": True, "message": "Note saved successfully!"}

@app.get("/instructors")
def get_instructors():
    # Adjust the query as needed for your schema
    instructors = list(users_collection.find({"role": "instructor"}))
    # Return only the fields you need (e.g., firstname, lastname, id_number)
    return [
        {
            "firstname": instructor.get("firstname", ""),
            "lastname": instructor.get("lastname", ""),
            "id_number": instructor.get("id_number", "")
        }
        for instructor in instructors
    ]

@app.post("/api/reports")
async def submit_report(
    id_number: str = Form(...),
    title: str = Form(...),
    content: str = Form(...),
    screenshot: UploadFile = File(None)
):
    # Save the report to the database or handle as needed
    # Example: save to a "reports" collection
    report = {
        "id_number": id_number,
        "title": title,
        "content": content,
        "created_at": datetime.utcnow()
    }
    if screenshot:
        # Save the file or its path as needed
        report["screenshot_filename"] = screenshot.filename
        # You can save the file to disk if you want:
        # with open(f"uploads/{screenshot.filename}", "wb") as f:
        #     f.write(await screenshot.read())

    db["reports"].insert_one(report)
    return {"message": "Report submitted successfully!"}

@app.post("/user/settings/request/{id_number}")
async def request_settings_change(id_number: str, data: dict = Body(...)):
    # You can save the request to a collection for admin review
    db["settings_requests"].insert_one({
        "id_number": id_number,
        "requested_changes": data,
        "created_at": datetime.utcnow()
    })
    return {"success": True, "message": "Request sent to admin."}

@app.get("/api/flashcards/{module_id}")
def get_flashcards(module_id: str):
    # TODO: Replace with real flashcard fetching logic from your database
    # Example dummy data:
    flashcards = [

    ]
    return {"success": True, "flashcards": flashcards}

@app.post("/api/generate-flashcards/{module_id}")
async def generate_flashcards(module_id: str):
    if not ObjectId.is_valid(module_id):
        raise HTTPException(status_code=400, detail="Invalid module ID format")

    # Check for existing flashcards
    existing_flashcards = list(flashcards_collection.find({"module_id": module_id}))
    if existing_flashcards:
        return {
            "success": True,
            "flashcards": [{**flashcard, "_id": str(flashcard["_id"])} for flashcard in existing_flashcards]
        }

    try:
        # Fetch module
        module = modules_collection.find_one({"_id": ObjectId(module_id)})
        if not module:
            raise HTTPException(status_code=404, detail="Module not found")
        
        document_url = module.get("document_url")
        if not document_url or not document_url.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="No valid PDF found for this module")

        # Check for cached text
        pdf_text = module.get("cached_text")
        if not pdf_text:
            pdf_text = extract_text_from_pdf(document_url)
            if not pdf_text.strip():
                raise HTTPException(status_code=400, detail="No text extracted from PDF")
            # Cache text in module document
            modules_collection.update_one(
                {"_id": ObjectId(module_id)},
                {"$set": {"cached_text": pdf_text}}
            )

        # Generate flashcards with ollama
        new_flashcards = await generate_flashcards_with_ollama(pdf_text, module_id)
        if not new_flashcards:
            logging.warning(f"Ollama failed, falling back to text-based flashcard generation for module {module_id}")
            new_flashcards = generate_flashcards_from_text(pdf_text, module_id)

        if not new_flashcards or len(new_flashcards) < 10:
            raise HTTPException(status_code=400, detail="Could not generate 10 flashcards")

        # Save flashcards
        flashcard_dicts = [flashcard.dict() for flashcard in new_flashcards]
        flashcards_collection.insert_many(flashcard_dicts)

        # Fetch saved flashcards
        saved_flashcards = list(flashcards_collection.find({"module_id": module_id}))
        return {
            "success": True,
            "flashcards": [{**flashcard, "_id": str(flashcard["_id"])} for flashcard in saved_flashcards]
        }

    except Exception as e:
        logging.error(f"Error generating flashcards for module {module_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating flashcards: {str(e)}")
    
    
class SignupRequest(BaseModel):
        firstname: str
        middlename: str = ""
        lastname: str
        suffix: str = ""
        birthdate: str
        gender: str
        email: str
        password: str
        program: str = ""
        id_number: str
        role: str
    
@app.post("/api/signup")
def signup(data: SignupRequest):
        # Check if user already exists
        if users_collection.find_one({"id_number": data.id_number}):
            return {"success": False, "message": "ID number already registered."}
        if users_collection.find_one({"email": data.email}):
            return {"success": False, "message": "Email already registered."}
    
        hashed_pw = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user_doc = data.dict()
        user_doc["password"] = hashed_pw
        del user_doc["password"]  # Remove plain password
        user_doc["password"] = hashed_pw  # Store hashed password
    
        # Default values
        user_doc["hoursActivity"] = 0
        user_doc["surveyCompleted"] = False
        user_doc["notes"] = []
    
        users_collection.insert_one(user_doc)
        return {"success": True, "message": "Signup successful!"}

@app.post("/api/forgot_password")
def forgot_password(data: dict, background_tasks: BackgroundTasks):
    id_number = data.get("id_number")
    email = data.get("email")
    user = users_collection.find_one({"id_number": id_number, "email": email})
    if not user:
        return {"success": False, "message": "No user found with that ID number and email."}

    # Generate a simple reset code (for demo, use a better method in production)
    import random
    reset_code = str(random.randint(100000, 999999))
    users_collection.update_one(
        {"id_number": id_number},
        {"$set": {"reset_code": reset_code, "reset_code_created": datetime.utcnow()}}
    )

    # TODO: Send the reset code to the user's email.
    # For now, just print it (replace with real email sending in production)
    print(f"Password reset code for {email}: {reset_code}")

    return {"success": True, "message": "Reset code sent to your email."}

@app.get("/students")
def get_students():
    students = list(users_collection.find({"role": {"$regex": "^student$", "$options": "i"}}))
    mapped_students = []
    for student in students:
        mapped_students.append({
            "studentNo": student.get("id_number", ""),
            "name": f"{student.get('firstname', '')} {student.get('lastname', '')}".strip(),
            "profile": student.get("profile", ""),  # or provide a default image URL if needed
            "program": student.get("program", ""),
        })
    return mapped_students

@app.get("/instructor-chats/{instructor_name}")
def get_instructor_chats(instructor_name: str):
    students = list(users_collection.find({"role": {"$regex": "^student$", "$options": "i"}}))
    student_ids = [
        f"{student.get('firstname', '')} {student.get('lastname', '')}".strip().lower()
        for student in students
    ]
    return {"student_ids": student_ids}

chat_messages = []

@app.get("/messages/{sender}/{receiver}")
def get_messages(sender: str, receiver: str):
    # Return all messages between sender and receiver
    filtered = [
        msg for msg in chat_messages
        if (msg["sender"] == sender and msg["receiver"] == receiver) or
           (msg["sender"] == receiver and msg["receiver"] == sender)
    ]
    return filtered

@app.post("/send-message")
def send_message(message: dict):
    # message: { sender, receiver, text }
    if not all(k in message for k in ("sender", "receiver", "text")):
        raise HTTPException(status_code=400, detail="Missing fields")
    chat_messages.append(message)
    return {"success": True}

@app.get("/api/accounts")
def get_all_accounts():
    # Return all users with their role, id_number, firstname, lastname, and program
    accounts = list(users_collection.find({}, {
        "_id": 0,  # Exclude MongoDB's internal _id
        "role": 1,
        "id_number": 1,
        "firstname": 1,
        "lastname": 1,
        "program": 1,
        "email": 1,
    }))
    return {"accounts": accounts}

@app.get("/api/attendance")
def get_attendance():
    # Dummy data for now
    return []

@app.get("/api/reports")
def get_reports(
    search: str = Query("", alias="search"),
    status: str = Query("All", alias="status")
):
    query = {}
    if search:
        query["$or"] = [
            {"id_number": {"$regex": search, "$options": "i"}},
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}},
        ]
    if status != "All":
        query["status"] = status

    reports = list(db["reports"].find(query))
    result = []
    for report in reports:
        result.append({
            "id": str(report.get("_id", "")),
            "student": report.get("id_number", ""),
            "issue": report.get("title", ""),
            "content": report.get("content", ""),
            "date": report.get("created_at", "").strftime("%Y-%m-%d %H:%M") if report.get("created_at") else "",
            "status": report.get("status", "Pending"),
            "screenshot": f"uploads/{report['screenshot_filename']}" if report.get("screenshot_filename") else None,
        })
    return result

@app.delete("/api/reports/{report_id}")
def delete_report(report_id: str = Path(...)):
    result = db["reports"].delete_one({"_id": ObjectId(report_id)})
    if result.deleted_count == 1:
        return {"success": True, "message": "Report deleted successfully."}
    else:
        raise HTTPException(status_code=404, detail="Report not found")
    
@app.get("/admin/requests")
def get_settings_requests():
    requests = list(db["settings_requests"].find())
    result = []
    for req in requests:
        result.append({
            "_id": str(req.get("_id", "")),
            "id_number": req.get("id_number", ""),
            "firstname": req.get("requested_changes", {}).get("firstname", ""),
            "lastname": req.get("requested_changes", {}).get("lastname", ""),
            "program": req.get("requested_changes", {}).get("program", ""),
            "update_data": req.get("requested_changes", {}),
        })
    return {"success": True, "data": result}

@app.post("/admin/requests/accept/{request_id}")
def accept_settings_request(request_id: str = Path(...), update_data: dict = Body(...)):
    req = db["settings_requests"].find_one({"_id": ObjectId(request_id)})
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    id_number = req.get("id_number")
    # Update user profile
    users_collection.update_one({"id_number": id_number}, {"$set": update_data})
    # Remove the request after applying
    db["settings_requests"].delete_one({"_id": ObjectId(request_id)})
    return {"success": True, "message": "Request accepted and changes applied."}

@app.delete("/admin/requests/decline/{request_id}")
def decline_settings_request(request_id: str = Path(...)):
    result = db["settings_requests"].delete_one({"_id": ObjectId(request_id)})
    if result.deleted_count == 1:
        return {"success": True, "message": "Request declined and removed."}
    else:
        raise HTTPException(status_code=404, detail="Request not found")
    
@app.post("/submit-survey")
def submit_survey(data: dict = Body(...)):
    id_number = data.get("id_number")
    categoryScores = data.get("categoryScores", {})
    top3Habits = data.get("top3Habits", [])
    surveyCompleted = data.get("surveyCompleted", False)

    user = users_collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    users_collection.update_one(
        {"id_number": id_number},
        {
            "$set": {
                "surveyCompleted": surveyCompleted,
                "categoryScores": categoryScores,
                "top3Habits": top3Habits,
            }
        }
    )
    return {"success": True, "message": "Survey submitted successfully!"}


rooms = defaultdict(list)  # {call_id: [websocket, ...]}
student_info = defaultdict(dict)  # {call_id: {websocket: {"id": ..., "name": ..., "muted": ..., "camera_off": ...}}}

@app.websocket("/ws/{call_id}")
async def websocket_endpoint(websocket: WebSocket, call_id: str):
    await websocket.accept()
    student_id = str(uuid.uuid4())
    # Wait for the client to send their id_number and name
    data = await websocket.receive_text()
    try:
        msg = json.loads(data)
        id_number = msg.get("id_number", "")
        name = msg.get("firstname", "Anonymous")
    except Exception:
        id_number = ""
        name = "Anonymous"

    # Add to room and store info
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
            await broadcast_active_students()  # <--- Only call here, not inside itself!
            while True:
                data = await websocket.receive_text()
                try:
                    msg = json.loads(data)
                except Exception:
                    msg = {"type": "unknown", "message": data}
    
                # Update mute/camera status if needed
                if msg.get("type") == "status_update":
                    info = student_info[call_id][websocket]
                    info["muted"] = msg.get("muted", False)
                    info["camera_off"] = msg.get("camera_off", False)
                    await broadcast_active_students()
                    continue
    
                # --- NEW LOGIC: Broadcast chat to all, signaling to others only ---
                if msg.get("type") == "chat":
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
                else:
                    for ws in rooms[call_id]:
                        if ws != websocket:
                            await ws.send_text(json.dumps(msg))
    except WebSocketDisconnect:
            rooms[call_id].remove(websocket)
            student_info[call_id].pop(websocket, None)
            await broadcast_active_students()
            print(f"WebSocket disconnected: {call_id}")

        