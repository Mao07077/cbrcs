from fastapi import (
    FastAPI, HTTPException, Query, Body, WebSocket, WebSocketDisconnect, UploadFile, File, Form
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv

from typing import Optional, List, Dict
from bson import ObjectId
from datetime import datetime
import bcrypt
import ollama
import logging
import json
import os


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
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

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

@app.websocket("/ws/{call_id}")
async def websocket_endpoint(websocket: WebSocket, call_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Instead of sending plain text, send JSON
            response = {
                "type": "echo",
                "message": data
            }
            await websocket.send_text(json.dumps(response))
    except WebSocketDisconnect:
        print(f"WebSocket disconnected: {call_id}")
        
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