from fastapi import FastAPI, HTTPException, File, UploadFile, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from starlette.middleware.trustedhost import TrustedHostMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi import APIRouter
from datetime import datetime
import bcrypt
import os
import random
import pdfplumber
import smtplib
from fastapi import FastAPI, UploadFile, File
from io import BytesIO
from pptx import Presentation
from PyPDF2 import PdfReader
from email.mime.text import MIMEText
import shutil
from typing import List, Dict
from fastapi.staticfiles import StaticFiles
import logging
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId
from typing import Any
import ollama
import certifi  # Import certifi to enable SSL
from fastapi import APIRouter
from typing import List
from pydantic import BaseModel
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import BackgroundTasks
import asyncio
import json  # Import json if not already imported
from fastapi import WebSocket, WebSocketDisconnect 
import re
import hashlib  # For PDF hash
import uuid 
import traceback
import logging
load_dotenv()

# Fetch MongoDB URI, Database Name, Collection Name, and Email credentials from environment variables
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))  # Default to 587 if not provided
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

# Check if essential environment variables are loaded
if not MONGO_URI or not DATABASE_NAME or not COLLECTION_NAME:
    logging.error("Missing necessary MongoDB environment variables: MONGO_URI, DATABASE_NAME, or COLLECTION_NAME.")
if not EMAIL_HOST or not EMAIL_PORT or not EMAIL_HOST_USER or not EMAIL_HOST_PASSWORD:
    logging.error("Missing necessary email environment variables: EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, or EMAIL_HOST_PASSWORD.")

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
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

# Configure logging
logging.basicConfig(level=logging.INFO)

app = FastAPI()
router = APIRouter()
router = APIRouter(prefix="/api")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup with SSL enabled
try:
    client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())  # Enable SSL
    client.admin.command('ping')  # Test the connection
    logging.info("MongoDB connection successful")
except Exception as e:
    logging.error(f"Failed to connect to MongoDB: {e}")

# Set up database and collections
db = client[DATABASE_NAME]
modules_collection = db["modules"]
post_test_collection = db.get_collection("post_tests")
pre_test_collection = db["pre_tests"]
collection = db[COLLECTION_NAME]
scores_collection = db["scores"]
users_collection = db[COLLECTION_NAME]
request_collection = db["requests"]
messages_collection = db["messages"]  # Added 'messages' collection
schedule_collection = db["schedules"]
notes_collection = db["notes"]
Flashcards_collection = db["flashcards"]
calls_collection = db["calls"]
posts_collection = db["posts"]  
reports_collection = db["reports"]# New collection for posts

# Serve static files for images and videos
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
participant_states: Dict[str, Dict] = {}
Flashcards_collection.create_index("module_id")
# Models for requests
class SignupData(BaseModel):
    firstname: str
    middlename: str = None
    lastname: str
    suffix: str = None
    birthdate: str
    gender: str
    email: str
    password: str
    program: str
    id_number: str
    role: str

class FormatResponse(BaseModel):
  ReviseQuestion: str
  correctAnswer: str
  wrongAnswerFirst: str
  wrongAnswerSecond: str
  wrongAnswerThird: str
  
class LoginData(BaseModel):
    idNumber: str
    password: str


class ForgotPasswordData(BaseModel):
    id_number: str
    email: str

class ConfirmResetCodeData(BaseModel):
    id_number: str
    email: str
    reset_code: str

class ResetPasswordData(BaseModel):
    id_number: str
    reset_code: str
    new_password: str

class ProfileData(BaseModel):
    firstname: str
    lastname: str
    id_number: str
    program: str
    hoursActivity: int = None

class Question(BaseModel):
    question: str
    options: List[str]
    correctAnswer: str

class PostTestRequest(BaseModel):
    title: str
    questions: List[Question]

class PostTestResponse(BaseModel):
    post_test_id: str
    module_id: str
    title: str
    questions: List[Question]

class PostTestSubmission(BaseModel):
    answers: Dict[str, str]
    user_id: str
    time_spent: int  # New field for time spent in seconds

class PostTestData(BaseModel):
    question_id: str
    user_id: str
    answers: list[str]

class ScoreData(BaseModel):
    module_id: str
    user_id: str
    correct: int
    incorrect: int
    total_questions: int
    user_answers: Dict[str, str]
    time_spent: int  # New field for time spent in seconds
    test_type: str = "posttest"  # Default to posttest
class UserSettings(BaseModel):
  firstname: Optional[str] = None
  middlename: Optional[str] = None
  lastname: Optional[str] = None
  suffix: Optional[str] = None
  birthdate: Optional[str] = None
  email: Optional[str] = None
  program: Optional[str] = None
  username: Optional[str] = None
  password: Optional[str] = None
class Module(BaseModel):
    id: str
    title: str
    image_url: str
    instructor_id: str    
    file : str
class Account(BaseModel):
    id: str
    profile: str
    accountNo: str
    name: str
    role: str
class AccountResponse(BaseModel):
    id: str
    profile: str
    accountNo: str
    name: str
    role: str  

class AccountResponses(BaseModel):
    id: str
    profile: str
     
    studentNo: str
    name: str
    role: str  
    program: str
     
class ParaphraseRequest(BaseModel):
    input: str

class ParaphraseResponse(BaseModel):
    paraphrased: str

class QuestionWithAnswers(BaseModel):
    question: str
    options: List[str]
    correctAnswer: str
    wrongAnswers: List[str]  # Add wrong answers

class PostTestResponse(BaseModel):
    post_test_id: str
    module_id: str
    title: str
    questions: List[QuestionWithAnswers]  
# Update to use the new model
class PreTestResponse(BaseModel):
    pre_test_id: str
    module_id: str
    title: str
    questions: List[QuestionWithAnswers]

class SurveyData(BaseModel):
    id_number: str
    categoryScores: Dict[str, int]
    top3Habits: List[str]
    surveyCompleted: bool
class Message(BaseModel):
    sender: str
    receiver: str
    text: str

class Instructor(BaseModel):
    id_number: str
    firstname: str
    lastname: str
    email: str

# Pydantic model for schedule
class ScheduleEntry(BaseModel):
    id_number: str
    schedule: List[List[str]]
    times: List[str]

class NoteModel(BaseModel):
    title: str
    content: str

class SaveNoteRequest(BaseModel):
    id_number: str
    note: NoteModel

class UpdateNoteRequest(BaseModel):
    id_number: str
    index: int
    note: NoteModel

class DeleteNoteRequest(BaseModel):
    id_number: str
    index: int

class Flashcard(BaseModel):
    module_id: str
    content: str
    answer: str
    unique: str
# Helper functions
class IntroData(BaseModel):
    header: str
    subHeader: str
    introImage: Optional[str] = None

class NewsData(BaseModel):
    content: str
    newsImage: Optional[str] = None

class CourseImageData(BaseModel):
    images: List[Optional[str]]

class ChatMessage(BaseModel):
    call_id: str
    sender_id: str
    sender_name: str
    message: str
    timestamp: datetime

class PostData(BaseModel):
    intro: Optional[IntroData] = None
    news: Optional[NewsData] = None
    courseImages: Optional[CourseImageData] = None

class ReportCreate(BaseModel):
    id_number: str
    title: str
    content: str

class ReportStatusUpdate(BaseModel):
    status: str

class ReportResponse(BaseModel):
    id: str
    student: str
    issue: str
    date: str
    status: str
    content: Optional[str] = None
    screenshot: Optional[str] = None
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def send_email(to_email: str, subject: str, body: str):
    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = EMAIL_HOST_USER
        msg['To'] = to_email

        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            server.send_message(msg)
        logging.info(f"Email sent to {to_email}")
    except Exception as e:
        logging.error(f"Failed to send email to {to_email}: {e}")

def get_posttest_by_id(post_test_id: str):
    try:
        if not ObjectId.is_valid(post_test_id):
            raise HTTPException(status_code=400, detail="Invalid post-test ID format")
        post_test = post_test_collection.find_one({"_id": ObjectId(post_test_id)})
        return post_test
    except Exception as e:
        logging.error(f"Error fetching post-test by ID {post_test_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch post-test")

def get_current_user(id_number: str):
    """Simulates user authentication by ID."""
    user = users_collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
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
def save_posttest(posttest: dict):
    try:
        post_test_collection.update_one(
            {"_id": ObjectId(posttest["_id"])},
            {"$set": {"questions": posttest["questions"]}}
        )
    except Exception as e:
        logging.error(f"Error saving post-test: {e}")
        raise HTTPException(status_code=500, detail="Failed to save post-test")
    
def get_wrong_answers(correct_answer: str, question: str) -> List[str]:
    try:
        prompt = (
            f"Generate three plausible but incorrect answers for the following question: {question}\n"
            f"The correct answer is '{correct_answer}'. Ensure the wrong answers are distinct and do not include the correct answer.\n"
            f"Return the answers as a list, one per line."
        )
        response = ollama.generate(model='llama3:latest', prompt=prompt)
        wrong_answers = response['response'].strip().split("\n")
        return wrong_answers[:3]  # Ensure only three wrong answers are returned
    except Exception as e:
        logging.error(f"Failed to generate wrong answers: {e}")
        return ["Option A", "Option B", "Option C"]  # Default wrong answers
# User management endpoints
def compute_file_hash(file_path: str) -> str:
    try:
        with open(file_path, "rb") as file:
            return hashlib.md5(file.read()).hexdigest()
    except Exception as e:
        logging.error(f"Error computing file hash: {e}")
        return ""

# Helper function to extract text from PDF
def extract_text_from_pdf(file_path: str) -> str:
    try:
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"PDF file not found at {file_path}")
        
        with open(file_path, "rb") as file:
            reader = PdfReader(file)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
    except Exception as e:
        logging.error(f"Error extracting text from PDF: {e}")
        raise HTTPException(status_code=500, detail="Failed to extract text from PDF")

# Helper function to generate flashcards using ollama
async def generate_flashcards_with_ollama(text: str, module_id: str) -> List[Flashcard]:
    try:
        text = text[:2000]
        prompt = (
            f"Generate 10 flashcard questions from the following text. "
            f"Each question must start with 'What', 'Where', 'When', 'Who', 'Why', or 'How', "
            f"and focus on a specific concept, law, theory, or rule. "
            f"Ensure questions and the answer are unique, factual, and concise. "
            f"Answers should be brief and accurate. "
            f"Dont use What is a key concept from the module"
            f"Format as a JSON list of objects with 'question' and 'answer' fields.\n\n"
            f"Text: {text}\n\n"
            f"Example: "
            f'[{{"question": "What law mandates Rizal’s life study?", "answer": "RA 1425"}}, '
            f'{{"question": "What are Kolb’s learning stages?", "answer": "Concrete Experience, Reflective Observation, Abstract Conceptualization, Active Experimentation"}}]'
        )

        async def run_ollama_with_timeout():
            loop = asyncio.get_event_loop()
            return await asyncio.wait_for(
                loop.run_in_executor(None, lambda: ollama.generate(model='llama3:latest', prompt=prompt)),
                timeout=30
            )

        response = await run_ollama_with_timeout()
        # Use json.loads instead of eval
        flashcards_data = json.loads(response['response'])  # Parse JSON safely

        flashcards = []
        for i, item in enumerate(flashcards_data[:10]):
            flashcard = Flashcard(
                module_id=module_id,
                content=item['question'],
                answer=item['answer'],
                unique=f"flashcard-{module_id}-{i}"
            )
            flashcards.append(flashcard)
        
        return flashcards
    except json.JSONDecodeError as e:
        logging.error(f"Failed to parse Ollama response as JSON: {e}")
        return None
    except asyncio.TimeoutError:
        logging.error("Ollama request timed out after 30 seconds")
        return None
    except Exception as e:
        logging.error(f"Error generating flashcards with ollama: {e}")
        return None

# Helper function to generate flashcards from text (fallback)
def generate_flashcards_from_text(text: str, module_id: str) -> List[Flashcard]:
    # Split text into sentences and filter for meaningful content
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    flashcards = []
    
    # Prioritize sentences with key terms
    candidate_sentences = [
        s for s in sentences
        if len(s) > 30 and any(keyword in s.lower() for keyword in [
            'law', 'theory', 'principle', 'definition', 'rule', 'stage', 'category'
        ])
    ]
    
    # Ensure at least 10 flashcards
    for i in range(10):
        if i < len(candidate_sentences):
            sentence = candidate_sentences[i]
            # Extract a key term for the question
            words = sentence.split()
            key_term = next(
                (word for word in words if word[0].isupper() or word in [
                    'Cephalocaudal', 'Proximodistal', 'Oral', 'Anal', 'Phallic'
                ]),
                words[0]
            )
            question = f"What is {key_term}?"
            answer = sentence.strip()
        else:
            # Fallback for insufficient sentences
            sentence = candidate_sentences[i % len(candidate_sentences)] if candidate_sentences else "No content available."
            question = f"What is a key concept from the module (part {i+1})?"
            answer = sentence.strip()
        
        flashcard = Flashcard(
            module_id=module_id,
            content=question,
            answer=answer,
            unique=f"flashcard-{module_id}-{i}"
        )
        flashcards.append(flashcard)
    
    return flashcards

# Flashcard generation endpoint

def check_schedule_and_notify():
    current_time = datetime.now().strftime('%I:%M %p')  # Get current time in 12-hour format
    current_day = datetime.now().strftime('%a').upper()  # Get current day in 3-letter abbreviation

    # Query for all schedules in the collection
    schedules = schedule_collection.find()

    for schedule in schedules:
        user_id = schedule["id_number"]
        times = schedule["times"]
        schedule_data = schedule["schedule"]

        # Loop through each time and day to check if it matches the current time and day
        for i, time in enumerate(times):
            if time == current_time:  # If times match
                for j, day in enumerate(schedule_data[i]):
                    if day and day != '0' and daysOfWeek[j] == current_day:
                        # Send email or notification
                        send_reminder_email(user_id, day, current_time, current_day)

# Function to send the reminder email
def send_reminder_email(user_id, task, current_time, current_day):
    # Fetch user email from the database
    user = users_collection.find_one({"id_number": user_id})
    if not user:
        return

    user_email = user["email"]
    subject = f"Reminder: Task '{task}' at {current_time} on {current_day}"
    body = f"Dear {user['firstname']} {user['lastname']},\n\nThis is a reminder for your task '{task}' scheduled for {current_time} on {current_day}.\n\nBest regards,\nYour Study Schedule App"

    # Set up the email content
    message = MIMEText(body)
    message['From'] = EMAIL_HOST_USER
    message['To'] = user_email
    message['Subject'] = subject

    # Send email using SMTP
    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            server.sendmail(EMAIL_HOST_USER, user_email, message.as_string())
        logging.info(f"Reminder sent to {user_email}")
    except Exception as e:
        logging.error(f"Error sending email: {e}")

# Set up the background scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(check_schedule_and_notify, 'interval', minutes=1)  # Run every minute
scheduler.start()

# WebSocket endpoint for video calls
@app.websocket("/ws/{identifier}")
async def websocket_endpoint(websocket: WebSocket, identifier: str):
    await websocket.accept()

    # Authenticate user
    try:
        auth_data = await websocket.receive_json()
        id_number = auth_data.get("id_number")
        user = get_current_user(id_number)
    except Exception:
        await websocket.close(code=1008, reason="Authentication failed")
        return

    student_id = f"user_{id_number}"
    call_id = identifier
    student_name = f"{user['firstname']} {user['lastname']}"

    # Participant state
    participant_states = {}
    participant_states[student_id] = {"muted": False, "camera_off": False, "name": student_name, "call_id": call_id}

    # Handle call creation/joining
    if identifier == "random":
        call_id = str(uuid.uuid4())
        calls_collection.insert_one({"call_id": call_id, "students": [student_id], "created_at": datetime.utcnow()})
    else:
        call = calls_collection.find_one({"call_id": call_id})
        if not call:
            await websocket.close(code=1008, reason="Invalid call ID")
            return
        calls_collection.update_one({"call_id": call_id}, {"$addToSet": {"students": student_id}})

    # In-memory student data
    students = {student_id: {"id": student_id, "name": student_name, "ws": websocket, "call_id": call_id}}

    # Send student ID and call ID
    await websocket.send_text(json.dumps({"type": "student_id", "studentId": student_id, "callId": call_id}))

    # Broadcast active students
    async def broadcast_students():
        call = calls_collection.find_one({"call_id": call_id})
        if not call:
            return
        active_students = []
        for sid in call.get("students", []):
            s_user = users_collection.find_one({"id_number": sid.replace("user_", "")})
            if s_user:
                state = participant_states.get(sid, {"muted": False, "camera_off": False})
                active_students.append({
                    "id": sid,
                    "name": f"{s_user['firstname']} {s_user['lastname']}",
                    "muted": state["muted"],
                    "camera_off": state["camera_off"]
                })
        message = json.dumps({"type": "active_students", "students": active_students})
        for sid in call.get("students", []):
            student = students.get(sid)
            if student and student["ws"].client_state == 1:
                await student["ws"].send_text(message)

    await broadcast_students()

    # Send chat history
    async def send_chat_history():
        messages = calls_collection.find_one({"call_id": call_id}, {"messages": 1})
        if messages and "messages" in messages:
            for msg in messages["messages"]:
                await websocket.send_text(json.dumps({
                    "type": "chat",
                    "message": {
                        "sender_id": msg["sender_id"],
                        "sender_name": msg["sender_name"],
                        "message": msg["message"],
                        "timestamp": msg["timestamp"].isoformat()
                    }
                }))

    await send_chat_history()

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            if message["type"] == "offer":
                target_student = students.get(message["target"])
                if target_student and target_student["ws"].client_state == 1:
                    await target_student["ws"].send_text(
                        json.dumps({"type": "offer", "offer": message["offer"], "from": student_id})
                    )
            elif message["type"] == "answer":
                target_student = students.get(message["target"])
                if target_student and target_student["ws"].client_state == 1:
                    await target_student["ws"].send_text(
                        json.dumps({"type": "answer", "answer": message["answer"], "from": student_id})
                    )
            elif message["type"] == "ice-candidate":
                target_student = students.get(message["target"])
                if target_student and target_student["ws"].client_state == 1:
                    await target_student["ws"].send_text(
                        json.dumps({"type": "ice-candidate", "candidate": message["candidate"], "from": student_id})
                    )
            elif message["type"] == "chat":
                chat_message = {
                    "sender_id": student_id,
                    "sender_name": student_name,
                    "message": message["message"],
                    "timestamp": datetime.utcnow()
                }
                calls_collection.update_one(
                    {"call_id": call_id},
                    {"$push": {"messages": chat_message}}
                )
                call = calls_collection.find_one({"call_id": call_id})
                for sid in call.get("students", []):
                    student = students.get(sid)
                    if student and student["ws"].client_state == 1:
                        await student["ws"].send_text(json.dumps({"type": "chat", "message": chat_message}))
            elif message["type"] == "status_update":
                participant_states[student_id].update({
                    "muted": message.get("muted", participant_states[student_id]["muted"]),
                    "camera_off": message.get("camera_off", participant_states[student_id]["camera_off"])
                })
                await broadcast_students()
            elif message["type"] == "leave":
                call = calls_collection.find_one({"call_id": call_id})
                for sid in call.get("students", []):
                    if sid != student_id:
                        student = students.get(sid)
                        if student and student["ws"].client_state == 1:
                            await student["ws"].send_text(
                                json.dumps({"type": "notification", "message": f"{student_name} has left the meeting"})
                            )
                break
    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        calls_collection.update_one({"call_id": call_id}, {"$pull": {"students": student_id}})
        call = calls_collection.find_one({"call_id": call_id})
        if call and not call.get("students"):
            calls_collection.delete_one({"call_id": call_id})
        students.pop(student_id, None)
        participant_states.pop(student_id, None)
        if call:
            for sid in call.get("students", []):
                student = students.get(sid)
                if student and student["ws"].client_state == 1:
                    await student["ws"].send_text(
                        json.dumps({"type": "notification", "message": f"{student_name} has left the meeting"})
                    )
        await broadcast_students()



@app.get("/")
async def root():
    content = {"message": "FastAPI Backend is Running!"}
    headers = {
        "Content-Security-Policy": "default-src 'self'; script-src 'self'; object-src 'none';"
    }
    return JSONResponse(content=content, headers=headers)

@app.post("/api/signup")
async def signup(data: SignupData):
    hashed_password = hash_password(data.password)
    user_data = data.dict()
    user_data["password"] = hashed_password
    result = collection.insert_one(user_data)
    if result.inserted_id:
        return {"success": True, "message": "Signup successful!"}
    else:
        raise HTTPException(status_code=500, detail="Signup failed")

@router.post("/login")
async def login(data: LoginData):
    logging.info(f"Received login request for idNumber: {data.idNumber}")
    user = collection.find_one({"id_number": data.idNumber})
    if user and verify_password(data.password, user["password"]):
        logging.info(f"Login successful for idNumber: {data.idNumber}")
        return JSONResponse({
            "success": True,
            "message": "Login successful!",
            "role": user.get("role", "unknown").lower(),
            "surveyCompleted": user.get("surveyCompleted", False),
            "firstname": user.get("firstname", ""),
            "lastname": user.get("lastname", ""),
            "id_number": user.get("id_number", ""),
            "program": user.get("program", ""),
            "hoursActivity": user.get("hoursActivity", 0)
        })
    else:
        logging.info(f"Login failed for idNumber: {data.idNumber}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
@app.post("/api/forgot_password")
async def forgot_password(data: ForgotPasswordData):
    user = collection.find_one({"id_number": data.id_number, "email": data.email})
    if user:
        reset_code = str(random.randint(100000, 999999))
        collection.update_one({"id_number": data.id_number}, {"$set": {"reset_code": reset_code}})
        send_email(data.email, "Password Reset Code", f"Your reset code is: {reset_code}")
        return {"success": True, "message": "Reset email has been sent."}
    else:
        raise HTTPException(status_code=404, detail="User not found with the provided ID number and email")

@app.post("/api/confirm_reset_code")
async def confirm_reset_code(data: ConfirmResetCodeData):
    user = collection.find_one({"id_number": data.id_number, "email": data.email})
    if user:
        if user.get("reset_code") == data.reset_code:
            return {"success": True, "message": "Reset code confirmed. You can now reset your password."}
        else:
            raise HTTPException(status_code=400, detail="Invalid reset code")
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.post("/api/reset_password")
async def reset_password(data: ResetPasswordData):
    user = collection.find_one({"id_number": data.id_number})
    if user:
        if user.get("reset_code") == data.reset_code:
            hashed_password = hash_password(data.new_password)
            collection.update_one({"id_number": data.id_number}, {"$set": {"password": hashed_password, "reset_code": None}})
            return {"success": True, "message": "Password has been reset successfully."}
        else:
            raise HTTPException(status_code=400, detail="Invalid reset code")
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.get("/api/profile/{id_number}", response_model=ProfileData)
async def get_profile(id_number: str):
    logging.info(f"Fetching profile for id_number: {id_number}")
    user = collection.find_one({"id_number": id_number})
    if user:
        return {
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "id_number": user["id_number"],
            "program": user["program"],
            "hoursActivity": user.get("hoursActivity", 0)
        }
    else:
        logging.error("User not found")
        raise HTTPException(status_code=404, detail="User not found")

# Module creation endpoint
@app.post("/api/create_module")
async def create_module(
    title: str = Form(...),
    topic: str = Form(...),
    description: str = Form(...),
    program: str = Form(...),
    id_number: str = Form(...),
    document: UploadFile = File(...),  # Change from video to document
    picture: UploadFile = File(...),
):
    """
    Create a new module with associated document and image uploads.
    """
    try:
        # Save files to the "uploads" directory
        document_path = f"uploads/{document.filename}"
        picture_path = f"uploads/{picture.filename}"
        os.makedirs("uploads", exist_ok=True)
        with open(document_path, "wb") as document_file:
            shutil.copyfileobj(document.file, document_file)
        with open(picture_path, "wb") as picture_file:
            shutil.copyfileobj(picture.file, picture_file)
        
        # Prepare module data
        module_data = {
            "title": title,
            "topic": topic,
            "description": description,
            "program": program,
            "id_number": id_number,
            "document_url": document_path,  # Change from video_url to document_url
            "image_url": picture_path,
        }

        # Insert module into the database
        result = modules_collection.insert_one(module_data)
        if result.inserted_id:
            return {
                "success": True,
                "message": "Module created successfully!",
                "module_id": str(result.inserted_id)  # Return the string version of the ObjectId
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to create module")
    except Exception as e:
        logging.error(f"Error creating module: {e}")
        raise HTTPException(status_code=500, detail="Module creation failed")

@app.get("/api/modules")
async def get_modules(id_number: str = Query(None), program: str = Query(None)):
    query = {}
    if id_number:
        query["id_number"] = id_number
    if program:
        query["program"] = {"$regex": f"^{program}$", "$options": "i"}  # Case-insensitive match
    logging.info(f"Fetching modules with query: {query}")
    modules = modules_collection.find(query)
    modules_list = [{"_id": str(module["_id"]), "title": module["title"], "image_url": module["image_url"], "id_number": module["id_number"], "program": module["program"]} for module in modules]
    logging.info(f"Found {len(modules_list)} modules: {modules_list}")
    return modules_list

@app.get("/api/modules/{module_id}")
async def get_module(module_id: str):
    try:
        if not ObjectId.is_valid(module_id):
            raise HTTPException(status_code=400, detail="Invalid module ID format")

        module = modules_collection.find_one({"_id": ObjectId(module_id)})
        if not module:
            raise HTTPException(status_code=404, detail="Module not found")

        module["_id"] = str(module["_id"])  # Convert ObjectId to string for JSON
        return {
            "title": module["title"],
            "topic": module["topic"],
            "description": module["description"],
            "program": module["program"],
            "image_url": module["image_url"],  # Ensure frontend can access this path
            "document_url": module["document_url"],  # PDF file
            "id_number": module["id_number"],
        }
    except Exception as e:
        print(f"Error fetching module: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching module: {e}")


@app.delete("/api/modules/{module_id}")
async def delete_module(module_id: str):
    """
    Delete a specific module by its ID.
    """
    logging.info(f"Attempting to delete module with ID: {module_id}")
    try:
        if not ObjectId.is_valid(module_id):
            logging.error(f"Invalid module ID format: {module_id}")
            raise HTTPException(status_code=400, detail="Invalid module ID format.")

        # Delete the module and related post-tests
        delete_result = modules_collection.delete_one({"_id": ObjectId(module_id)})
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Module not found.")
        
        # Delete associated post-tests
        post_test_collection.delete_many({"module_id": module_id})
        return {"success": True, "message": "Module and associated post-tests deleted successfully!"}
    except Exception as e:
        logging.error(f"Error deleting module with ID {module_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete module.")


# Utility route to check database status
@app.get("/api/status")
async def health_check():
    """
    Health check endpoint to verify API and database connection.
    """
    try:
        client.admin.command('ping')  # Verifies MongoDB connection
        return {"success": True, "message": "API and database are operational."}
    except Exception as e:
        logging.error(f"Database connection issue: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed.")

@app.post("/createposttest/{module_id}")
async def create_posttest(module_id: str, post_test_request: PostTestRequest):
    logging.info(f"Creating post-test for module_id: {module_id}")
    
    # Validate module_id format
    if not ObjectId.is_valid(module_id):
        raise HTTPException(status_code=400, detail="Invalid module ID format")
    
    # Check if module exists
    module = modules_collection.find_one({"_id": ObjectId(module_id)})
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Check if post-test already exists for this module
    if post_test_collection.find_one({"module_id": module_id}):
        raise HTTPException(status_code=400, detail="Post-test already exists")
    
    # Ensure at least one question is provided
    if not post_test_request.questions:
        raise HTTPException(status_code=400, detail="At least one question required")
    
    # Prepare post-test data
    post_test_data = {
        "module_id": module_id,
        "title": post_test_request.title,
        "questions": [
            {
                "question": q.question,
                "options": q.options,
                "correctAnswer": q.correctAnswer
            } for q in post_test_request.questions
        ],
        "created_at": datetime.utcnow()
    }
    
    # Insert post-test into database
    post_test_result = post_test_collection.insert_one(post_test_data)
    post_test_id = str(post_test_result.inserted_id)
    
    # Prepare pre-test data (using same questions as post-test)
    pre_test_data = {
        "module_id": module_id,
        "title": f"Pre-Test for {post_test_request.title}",
        "questions": post_test_data["questions"],  # Use same questions
        "created_at": datetime.utcnow()
    }
    
    # Insert pre-test into database
    pre_test_result = pre_test_collection.insert_one(pre_test_data)
    pre_test_id = str(pre_test_result.inserted_id)
    
    logging.info(f"Post-test created with ID: {post_test_id}")
    logging.info(f"Pre-test created with ID: {pre_test_id}")
    
    return {
        "success": True,
        "post_test_id": post_test_id,
        "pre_test_id": pre_test_id
    }
@app.get("/api/post-test/{module_id}", response_model=PostTestResponse)
async def get_post_test(module_id: str):
    logging.info(f"Fetching post-test for module_id: {module_id}")
    
    post_test = post_test_collection.find_one({"module_id": module_id})
    if not post_test:
        logging.error(f"Post test not found for module_id: {module_id}")
        raise HTTPException(status_code=404, detail="Post test not found")

    questions_with_answers = []
    for question in post_test['questions']:
        wrong_answers = [opt for opt in question['options'] if opt != question['correctAnswer']]
        questions_with_answers.append(QuestionWithAnswers(
            question=question['question'],
            options=question['options'],
            correctAnswer=question['correctAnswer'],
            wrongAnswers=wrong_answers
        ))

    logging.info(f"Successfully fetched post-test: {post_test['title']}")
    
    return PostTestResponse(
        post_test_id=str(post_test['_id']),
        module_id=post_test['module_id'],
        title=post_test['title'],
        questions=questions_with_answers
    )
@app.post("/api/post-test/submit/{module_id}")
async def submit_post_test(module_id: str, submission: PostTestSubmission):
    logging.info(f"Received submission for module_id: {module_id} with answers: {submission.answers}")
    if not module_id:
        raise HTTPException(status_code=400, detail="Module ID is required")
    post_test = post_test_collection.find_one({"module_id": module_id})
    if not post_test:
        raise HTTPException(status_code=404, detail="Post-test not found for this module")
    correct_answers = {str(index): question["correctAnswer"] for index, question in enumerate(post_test["questions"])}
    logging.info(f"Correct answers: {correct_answers}")
    correct_count = 0
    incorrect_count = 0
    for question, user_answer in submission.answers.items():
        correct_answer = correct_answers.get(question)
        logging.info(f"Comparing question: {question}, User answer: {user_answer}, Correct answer: {correct_answer}")
        if correct_answer is not None:
            if user_answer == correct_answer:
                correct_count += 1
            else:
                incorrect_count += 1
    score_data = ScoreData(
        module_id=module_id,
        user_id=submission.user_id,
        correct=correct_count,
        incorrect=incorrect_count,
        total_questions=len(post_test["questions"]),
        user_answers=submission.answers,
        time_spent=submission.time_spent,  # Added: Include time_spent from submission
        test_type="posttest"
    )
    logging.info(f"Score data to be saved: {score_data.dict()}")
    scores_collection.insert_one(score_data.dict())
    return {
        "success": True,
        "message": "Post-test submitted successfully!",
        "correct": correct_count,
        "incorrect": incorrect_count,
        "total_questions": len(post_test["questions"])
    }
@router.get("/api/post-test/results/{user_id}")
async def get_post_test_results(user_id: str):
    try:
        results = scores_collection.find({"user_id": user_id, "test_type": "posttest"})
        results_list = [
            {
                "module_id": result["module_id"],
                "correct": result["correct"],
                "incorrect": result["incorrect"],
                "total_questions": result["total_questions"],
                "score": result["correct"] / result["total_questions"] * 100,
                "time_spent": result["time_spent"]
            }
            for result in results
        ]
        logging.info(f"Post-test results for user {user_id}: {results_list}")
        return results_list
    except Exception as e:
        logging.error(f"Error fetching post-test results for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching post-test results")
app.include_router(router)


@app.get("/api/dashboard/{id_number}")
async def get_dashboard(id_number: str):
    # Validate user existence
    user = collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch modules for the user's program
    modules = modules_collection.find({"program": user["program"]})
    modules_list = [{"_id": str(module["_id"]), "title": module["title"], "image_url": module["image_url"]} for module in modules]

    # Fetch all scores for the user
    scores = scores_collection.find({"user_id": id_number})
    pre_tests = []
    post_tests = []

    # Process scores
    for score in scores:
        module_id = score["module_id"]
        # Fetch module title
        module = modules_collection.find_one({"_id": ObjectId(module_id)})
        module_title = module["title"] if module else "Unknown Module"

        if score.get("test_type") == "pretest":
            # Fetch pre-test title
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
            # Fetch post-test title
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
@app.get("/user/settings/{id_number}")
async def get_user_settings(id_number: str):
  user = collection.find_one({"id_number": id_number})
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

@app.post("/user/settings/request/{id_number}")
async def request_user_settings_update(id_number: str, user_settings: UserSettings):
    update_data = user_settings.dict(exclude_unset=True)  # Extract only the fields that have been updated

    # If password is provided, hash it (you can add your hashing logic here)
    if "password" in update_data and update_data["password"]:
        update_data["password"] = hash_password(update_data["password"])  # Make sure to implement hash_password
    else:
        update_data.pop("password", None)  # Remove the password if it is not provided or is empty

    # Create the request document
    request_data = {
        "id_number": id_number,
        "update_data": update_data,
        "status": "pending",  # Mark as pending until admin processes it
        "created_at": datetime.utcnow(),  # Add a timestamp of when the request was made
    }

    # Insert the request into the 'requests' collection
    result = request_collection.insert_one(request_data)
    
    if result.inserted_id:
        return {"success": True, "message": "Your request has been sent to the admin for review."}
    else:
        raise HTTPException(status_code=500, detail="Error submitting the request")
    
    return {
        "success": True,
        "message": "User settings update request sent successfully",
        "changes": changes  # Return the changes made
    }
@app.get("/admin/requests")
async def get_requests():
    requests = list(request_collection.find({}, {"_id": 1, "id_number": 1, "update_data": 1}))
    for request in requests:
        request["_id"] = str(request["_id"])  # Convert ObjectId to string for frontend compatibility
    return {"success": True, "data": requests} 

@app.post("/admin/requests/accept/{request_id}")
async def accept_request(request_id: str):
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(request_id):
            raise HTTPException(status_code=400, detail="Invalid request ID")

        # Fetch the request details
        request = request_collection.find_one({"_id": ObjectId(request_id)})
        if not request:
            raise HTTPException(status_code=404, detail="Request not found")

        # Extract the firstname and lastname from the 'update_data' field
        firstname = request.get("update_data", {}).get("firstname", "Unknown")
        lastname = request.get("update_data", {}).get("lastname", "Unknown")

        # Combine firstname and lastname for full name
        full_name = f"{firstname} {lastname}".strip()

        # Debugging: Log the full name
        print(f"Full Name: {full_name}")

        # Update user information based on the request
        id_number = request.get("id_number")
        update_data = {field: request["update_data"][field] for field in request["update_data"] if field not in ["_id", "id_number"]}
        users_collection.update_one({"id_number": id_number}, {"$set": update_data})

        # Remove the request after applying changes
        request_collection.delete_one({"_id": ObjectId(request_id)})

        return {
            "success": True,
            "detail": "Changes applied successfully",
            "updated_name": full_name,
        }
    except Exception as e:
        return {"success": False, "detail": str(e)}


@app.delete("/admin/requests/decline/{request_id}")
async def decline_request(request_id: str):
    request = request_collection.find_one({"_id": ObjectId(request_id)})
    if not request:
        return {"success": False, "detail": "Request not found"}

    # Remove the request without applying changes
    request_collection.delete_one({"_id": ObjectId(request_id)})
    return {"success": True, "detail": "Request declined"}


@app.post("/api/accounts", response_model=AccountResponse)
async def create_account(account: Account):
    """Create a new account in the userinfo collection."""
    new_user = {
        "profile": account.profile,
        "id_number": account.accountNo,
        "firstname": account.name.split(" ")[0],
        "lastname": " ".join(account.name.split(" ")[1:]),
        "role": account.role,
    }
    result = users_collection.insert_one(new_user)
    return {**account.dict(), "id": str(result.inserted_id)}

@app.get("/api/accounts")
async def get_accounts():
    try:
        users = users_collection.find()
        accounts = []
        for user in users:
            # Safely access id_number with a fallback
            id_number = user.get("id_number", "Unknown")
            if id_number == "Unknown":
                logging.warning(f"User document missing id_number: {user}")
                continue  # Skip users without id_number
            accounts.append({
                "accountNo": id_number,
                "name": f"{user.get('firstname', '')} {user.get('lastname', '')}".strip(),
                "email": user.get("email", ""),
                "role": user.get("role", "student"),
                # Add other fields as needed
            })
        return {"accounts": accounts}
    except Exception as e:
        logging.error(f"Error fetching accounts: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
# Route to delete an account
@app.delete("/api/accounts/{account_id}")
async def delete_account(account_id: str):
    try:
        result = users_collection.delete_one({"_id": ObjectId(account_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Account not found")
        return {"message": "Account deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting account: {e}")
    
@app.get("/students", response_model=List[AccountResponses])
async def get_students():
    """Fetch accounts with the role 'Student'."""
    try:
        students = list(users_collection.find({"role": {"$regex": "^student$", "$options": "i"}}))
        result = []
        for student in students:
            result.append({
                "id": str(student["_id"]),
                "profile": student.get("profile", "N/A"),
                "studentNo": student.get("id_number", "N/A"),
                "name": f"{student.get('firstname', '')} {student.get('lastname', '')}".strip(),
                "program": student.get("program", "N/A"),
                "role": str(student["role"]),
            })
        return result
    except Exception as e:
        logging.error(f"Error fetching students: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@app.post("/api/paraphrase", response_model=ParaphraseResponse)
async def paraphrase(request: ParaphraseRequest):
    try:
        prompt = create_prompt(request.input)
        response = ollama.generate(model='llama3:latest', prompt=prompt)
        return {"paraphrased": response.response.strip()}
    except Exception as e:
        logging.error(f"Paraphrase error: {e}")
        raise HTTPException(status_code=500, detail="Failed to paraphrase input")

@app.post("/extract-text/")
async def extract_text(file: UploadFile = File(...)):
  file_content = await file.read()
  if file.filename.endswith('.pptx'):
    text = extract_text_from_ppt(BytesIO(file_content))
  elif file.filename.endswith('.pdf'):
    text = extract_text_from_pdf(BytesIO(file_content))
  else:
    return {"error": "Unsupported file type"}
  return {"extracted_text": text}

@app.post("/submit-survey")
async def submit_survey(survey_data: SurveyData):
    # Check if user exists
    user = collection.find_one({"id_number": survey_data.id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get top 3 habits and map to pages
    recommended_pages = []
    added_pages = set()

    # Add pages from top3Habits, avoiding duplicates
    for habit in survey_data.top3Habits:
        page = habit_to_page.get(habit)
        if page and page not in added_pages:
            recommended_pages.append(page)
            added_pages.add(page)

    # Add extra pages if needed to reach 3 unique pages
    for habit, page in habit_to_page.items():
        if page not in added_pages:
            recommended_pages.append(page)
            added_pages.add(page)
        if len(recommended_pages) == 3:
            break

    # Update the user's survey data
    result = collection.update_one(
        {"id_number": survey_data.id_number},
        {"$set": {
            "categoryScores": survey_data.categoryScores,
            "top3Habits": survey_data.top3Habits,
            "recommendedPages": recommended_pages,
            "surveyCompleted": survey_data.surveyCompleted
        }}
    )

    # Check if the update worked
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update survey data")

    return {
        "success": True,
        "message": "Survey submitted successfully!",
        "recommendedPages": recommended_pages
    }

@app.get("/students/{id_number}/recommended-pages", response_model=Dict[str, List[str]])
async def get_recommended_pages(id_number: str):
    user = collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get the top 3 habits from the user's data
    top3_habits = user.get("top3Habits", [])

    # Map habits to corresponding pages, avoiding duplicates
    recommended_pages = []
    for habit in top3_habits:
        page = habit_to_page.get(habit)
        if page and page not in recommended_pages:
            recommended_pages.append(page)

    return {"recommendedPages": recommended_pages}


@app.get("/messages/{user_name}/{selected_user}", response_model=List[Message])
def get_messages(user_name: str, selected_user: str):
    user_name = user_name.lower()
    selected_user = selected_user.lower()

    messages = list(messages_collection.find(
        {"$or": [
            {"receiver": user_name, "sender": selected_user},
            {"receiver": selected_user, "sender": user_name}
        ]}, 
        {"_id": 0}
    ))
    return messages

@app.post("/send-message")
async def send_message(message: Message):
    message_dict = message.model_dump()
    message_dict["sender"] = message_dict["sender"].lower()
    message_dict["receiver"] = message_dict["receiver"].lower()
    messages_collection.insert_one(message_dict)
    return {"success": True, "message": "Message sent successfully!"}

@app.get("/instructor-chats/{instructor_name}")
async def get_instructor_chats(instructor_name: str):
    print(f"🔍 Fetching chats for instructor: {instructor_name}")

    messages = list(messages_collection.find({"receiver": instructor_name}, {"_id": 0}))
    print(f"📜 Raw MongoDB Messages: {messages}")

    if not messages:
        return {"student_ids": [], "messages": []}

    student_names = {msg.get("sender") for msg in messages if "sender" in msg}
    print(f"👥 Extracted student names: {student_names}")

    return {"student_ids": list(student_names), "messages": messages}

@app.get("/instructors", response_model=List[Instructor])
def get_instructors():
    instructors = list(users_collection.find(
        {"role": "Instructor"},
        {"_id": 0, "id_number": 1, "firstname": 1, "lastname": 1, "email": 1}
    ))
    return instructors 

@app.post("/save_schedule")
def save_schedule(data: ScheduleEntry):
    existing = schedule_collection.find_one({"id_number": data.id_number})
    if existing:
        schedule_collection.update_one(
            {"id_number": data.id_number},
            {"$set": {"schedule": data.schedule, "times": data.times}}
        )
    else:
        schedule_collection.insert_one(data.dict())
    return {"success": True, "message": "Schedule saved successfully"}

# Get schedule
@app.get("/get_schedule/{id_number}")
def get_schedule(id_number: str):
    schedule = schedule_collection.find_one({"id_number": id_number})
    if not schedule:
        raise HTTPException(status_code=404, detail="No schedule found.")
    return {
        "schedule": schedule["schedule"],
        "times": schedule["times"]
    }
@app.get("/get_notes/{id_number}")
async def get_notes(id_number: str):
    user = notes_collection.find_one({"id_number": id_number})
    if user:
        return {"notes": user.get("notes", [])}
    return {"notes": []}

@app.post("/save_note")
async def save_note(req: SaveNoteRequest):
    data = req.dict()
    id_number = data["id_number"]
    note = data["note"]

    user = notes_collection.find_one({"id_number": id_number})
    if user:
        notes_collection.update_one(
            {"id_number": id_number},
            {"$push": {"notes": note}}
        )
    else:
        notes_collection.insert_one({
            "id_number": id_number,
            "notes": [note]
        })
    return {"success": True}

@app.post("/update_note")
async def update_note(req: UpdateNoteRequest):
    id_number = req.id_number
    index = req.index
    note = req.note

    user = notes_collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    notes = user.get("notes", [])
    if index < 0 or index >= len(notes):
        raise HTTPException(status_code=400, detail="Invalid note index")

    notes[index] = note
    notes_collection.update_one(
        {"id_number": id_number},
        {"$set": {"notes": notes}}
    )
    return {"success": True}

@app.post("/delete_note")
async def delete_note(req: DeleteNoteRequest):
    id_number = req.id_number
    index = req.index

    user = notes_collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    notes = user.get("notes", [])
    if index < 0 or index >= len(notes):
        raise HTTPException(status_code=400, detail="Invalid note index")

    notes.pop(index)
    notes_collection.update_one(
        {"id_number": id_number},
        {"$set": {"notes": notes}}
    )
    return {"success": True}

@app.on_event("startup")
async def startup_event():
    # Check if the scheduler is already running
    if not scheduler.running:
        logging.info("FastAPI app has started. Scheduler will now check schedules every minute.")
        scheduler.start()
    else:
        logging.info("Scheduler is already running.")

@app.post("/api/generate-flashcards/{module_id}")
async def generate_flashcards(module_id: str):
    if not ObjectId.is_valid(module_id):
        raise HTTPException(status_code=400, detail="Invalid module ID format")

    # Check for existing flashcards
    existing_flashcards = list(Flashcards_collection.find({"module_id": module_id}))
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
        Flashcards_collection.insert_many(flashcard_dicts)

        # Fetch saved flashcards
        saved_flashcards = list(Flashcards_collection.find({"module_id": module_id}))
        return {
            "success": True,
            "flashcards": [{**flashcard, "_id": str(flashcard["_id"])} for flashcard in saved_flashcards]
        }

    except Exception as e:
        logging.error(f"Error generating flashcards for module {module_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating flashcards: {str(e)}")
    
@app.post("/api/save_post")
async def save_post(
    intro_header: Optional[str] = Form(None),
    intro_subHeader: Optional[str] = Form(None),
    intro_image: Optional[UploadFile] = File(None),
    news_content: Optional[str] = Form(None),
    news_image: Optional[UploadFile] = File(None),
    course_image_1: Optional[UploadFile] = File(None),
    course_image_2: Optional[UploadFile] = File(None),
    course_image_3: Optional[UploadFile] = File(None)
):
    try:
        post_data = {}
        
        # Log received files
        logging.info(f"Received intro_image: {intro_image.filename if intro_image else None}")
        logging.info(f"Received news_image: {news_image.filename if news_image else None}")
        logging.info(f"Received course_image_1: {course_image_1.filename if course_image_1 else None}")
        logging.info(f"Received course_image_2: {course_image_2.filename if course_image_2 else None}")
        logging.info(f"Received course_image_3: {course_image_3.filename if course_image_3 else None}")

        # Handle intro data
        if intro_header and intro_subHeader:
            intro_data = {"header": intro_header, "subHeader": intro_subHeader}
            if intro_image:
                intro_image_path = f"uploads/{intro_image.filename}"
                os.makedirs("uploads", exist_ok=True)
                with open(intro_image_path, "wb") as f:
                    shutil.copyfileobj(intro_image.file, f)
                intro_data["introImage"] = intro_image_path
                logging.info(f"Saved intro image to: {intro_image_path}")
            post_data["intro"] = intro_data
        
        # Handle news data
        if news_content:
            news_data = {"content": news_content}
            if news_image:
                news_image_path = f"uploads/{news_image.filename}"
                os.makedirs("uploads", exist_ok=True)
                with open(news_image_path, "wb") as f:
                    shutil.copyfileobj(news_image.file, f)
                news_data["newsImage"] = news_image_path
                logging.info(f"Saved news image to: {news_image_path}")
            post_data["news"] = news_data
        
        # Handle course images
        course_images = []
        for img, idx in [(course_image_1, 1), (course_image_2, 2), (course_image_3, 3)]:
            if img:
                img_path = f"uploads/{img.filename}"
                os.makedirs("uploads", exist_ok=True)
                with open(img_path, "wb") as f:
                    shutil.copyfileobj(img.file, f)
                course_images.append(img_path)
                logging.info(f"Saved course image {idx} to: {img_path}")
            else:
                course_images.append(None)
        post_data["courseImages"] = {"images": course_images}
        
        # Update or insert post data
        existing_post = posts_collection.find_one()
        if existing_post:
            posts_collection.update_one({}, {"$set": post_data})
            logging.info("Updated existing post in MongoDB")
        else:
            posts_collection.insert_one(post_data)
            logging.info("Inserted new post in MongoDB")
        
        return {"success": True, "message": "Post saved successfully!"}
    except Exception as e:
        logging.error(f"Error saving post: {e}")
        raise HTTPException(status_code=500, detail="Failed to save post")

@app.get("/api/get_post")
async def get_post():
    logging.info("Received request for /api/get_post")
    try:
        post = posts_collection.find_one()
        if not post:
            logging.info("No post found, returning default data")
            return {
                "success": True,
                "data": {
                    "intro": {"header": "", "subHeader": "", "introImage": None},
                    "news": {"content": "", "newsImage": None},
                    "courseImages": {"images": [None, None, None]}
                }
            }
        post["_id"] = str(post["_id"])
        logging.info(f"Fetched post: {post}")
        return {"success": True, "data": post}
    except Exception as e:
        logging.error(f"Error fetching post: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch post")

@app.get("/api/pre-test/{module_id}", response_model=PreTestResponse)
async def get_pre_test(module_id: str):
    logging.info(f"Fetching pre-test for module_id: {module_id}")
    
    pre_test = pre_test_collection.find_one({"module_id": module_id})
    if not pre_test:
        logging.error(f"Pre-test not found for module_id: {module_id}")
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

    logging.info(f"Successfully fetched pre-test: {pre_test['title']}")
    
    return PreTestResponse(
        pre_test_id=str(pre_test['_id']),
        module_id=pre_test['module_id'],
        title=pre_test['title'],
        questions=questions_with_answers
    )

@app.post("/api/pre-test/submit/{module_id}")
async def submit_pre_test(module_id: str, answers: PostTestSubmission):
    logging.info(f"Submitting pre-test for module_id: {module_id}, user_id: {answers.user_id}, answers: {answers.answers}")
    if not ObjectId.is_valid(module_id):
        logging.error(f"Invalid module_id format: {module_id}")
        raise HTTPException(status_code=400, detail="Invalid module ID format")
    module = modules_collection.find_one({"_id": ObjectId(module_id)})
    if not module:
        logging.error(f"Module not found for module_id: {module_id}")
        raise HTTPException(status_code=404, detail="Module not found")
    pre_test = pre_test_collection.find_one({"module_id": module_id})
    if not pre_test:
        available_tests = list(pre_test_collection.find({}, {"module_id": 1, "title": 1}))
        logging.error(f"Pre-test not found for module_id: {module_id}. Available pre-tests: {available_tests}")
        raise HTTPException(status_code=404, detail="Pre-test not found for this module")
    logging.info(f"Pre-test found: {pre_test['title']} with {len(pre_test['questions'])} questions")
    correct_answers = {str(index): question["correctAnswer"] for index, question in enumerate(pre_test["questions"])}
    logging.info(f"Correct answers: {correct_answers}")
    correct_count = 0
    incorrect_count = 0
    for question, user_answer in answers.answers.items():
        correct_answer = correct_answers.get(question)
        if correct_answer and user_answer == correct_answer:
            correct_count += 1
        elif user_answer:
            incorrect_count += 1
    score_data = {
        "module_id": module_id,
        "user_id": answers.user_id,
        "correct": correct_count,
        "incorrect": incorrect_count,
        "total_questions": len(pre_test["questions"]),
        "user_answers": answers.answers,
        "test_type": "pretest",
        "time_spent": answers.time_spent,  # Added: Include time_spent for pretest submission
        "submitted_at": datetime.utcnow()
    }
    result = scores_collection.insert_one(score_data)
    logging.info(f"Score saved with ID: {result.inserted_id}")
    return {
        "success": True,
        "message": "Pre-test submitted successfully!",
        "correct": correct_count,
        "incorrect": incorrect_count,
        "total_questions": len(pre_test["questions"])
    }
@app.get("/api/module-status/{module_id}/{user_id}")
async def get_module_status(module_id: str, user_id: str):
    pre_test_score = scores_collection.find_one({"module_id": module_id, "user_id": user_id, "test_type": "pretest"})
    post_test_score = scores_collection.find_one({"module_id": module_id, "user_id": user_id, "test_type": {"$ne": "pretest"}})
    
    return {
        "pre_test_completed": bool(pre_test_score),
        "post_test_completed": bool(post_test_score)
    }
@app.post("/api/reports", response_model=ReportResponse)
async def create_report(
    id_number: str = Form(...),
    title: str = Form(...),
    content: str = Form(...),
    screenshot: Optional[UploadFile] = File(None)
):
    try:
        logger.debug(f"Received report submission: id_number={id_number}, title={title}, content={content}, screenshot={screenshot}")
        
        # Fetch user to get student name
        user = users_collection.find_one({"id_number": id_number})
        if not user:
            logger.warning(f"User not found for id_number: {id_number}")
            raise HTTPException(status_code=404, detail="User not found")
        
        student_name = f"{user['firstname']} {user['lastname']}".strip()
        logger.debug(f"Found user: {student_name}")
        
        # Prepare report data
        report_data = {
            "id_number": id_number,
            "student": student_name,
            "issue": title,
            "content": content,
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "status": "Pending",
            "screenshot": None
        }
        
        # Handle screenshot upload
        if screenshot:
            try:
                screenshot_path = f"uploads/{screenshot.filename}"
                os.makedirs("uploads", exist_ok=True)
                with open(screenshot_path, "wb") as f:
                    shutil.copyfileobj(screenshot.file, f)
                report_data["screenshot"] = screenshot_path
                logger.debug(f"Screenshot saved to: {screenshot_path}")
            except Exception as e:
                logger.error(f"Failed to save screenshot: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Failed to save screenshot: {str(e)}")
        
        # Insert report into database
        result = reports_collection.insert_one(report_data)
        report_data["id"] = str(result.inserted_id)
        logger.debug(f"Report inserted with ID: {report_data['id']}")
        
        return ReportResponse(**report_data)
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error creating report: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/reports", response_model=List[ReportResponse])
async def get_reports(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None)
):
    try:
        query = {}
        if search:
            query["$or"] = [
                {"student": {"$regex": search, "$options": "i"}},
                {"issue": {"$regex": search, "$options": "i"}},
                {"content": {"$regex": search, "$options": "i"}}
            ]
        if status and status != "All":
            query["status"] = status
        
        reports = list(reports_collection.find(query))
        return [
            ReportResponse(
                id=str(report["_id"]),
                student=report["student"],
                issue=report["issue"],
                date=report["date"],
                status=report["status"],
                content=report.get("content"),
                screenshot=report.get("screenshot")
            ) for report in reports
        ]
    except Exception as e:
        logger.error(f"Error fetching reports: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Failed to fetch reports")

# Endpoint to delete a report (used when resolving)
@app.delete("/api/reports/{report_id}", response_model=dict)
async def delete_report(report_id: str):
    try:
        if not ObjectId.is_valid(report_id):
            raise HTTPException(status_code=400, detail="Invalid report ID")
        
        report = reports_collection.find_one({"_id": ObjectId(report_id)})
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Delete screenshot file if it exists
        if report.get("screenshot"):
            screenshot_path = report["screenshot"]
            try:
                if os.path.exists(screenshot_path):
                    os.remove(screenshot_path)
                    logger.debug(f"Deleted screenshot: {screenshot_path}")
            except Exception as e:
                logger.error(f"Failed to delete screenshot {screenshot_path}: {str(e)}")
        
        # Delete report from database
        delete_result = reports_collection.delete_one({"_id": ObjectId(report_id)})
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {"message": "Report resolved and deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting report: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Failed to delete report")

# Endpoint to update report status

@app.get("/api/attendance")
async def get_attendance(program: str = Query(None)):
    """
    Fetch attendance data for students in a specific program.
    """
    try:
        query = {}
        if program:
            query["program"] = program

        # Example: Derive attendance from scores or user activity
        # Replace this with your actual attendance logic
        scores = scores_collection.find(query)
        attendance_data = []
        for score in scores:
            user = users_collection.find_one({"id_number": score["user_id"]})
            if user:
                attendance_data.append({
                    "student_id": score["user_id"],
                    "name": f"{user['firstname']} {user['lastname']}",
                    "module_id": score["module_id"],
                    "attendance_percentage": random.randint(50, 100),  # Placeholder: Replace with real data
                })

        return attendance_data
    except Exception as e:
        logging.error(f"Error fetching attendance data: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch attendance data")
    
@router.get("/api/instructor/dashboard/{instructor_id}")
async def get_instructor_dashboard(instructor_id: str, program: Optional[str] = Query(None)):
    """
    Fetch aggregated data for the instructor dashboard.
    """
    try:
        # Validate instructor exists
        instructor = users_collection.find_one({"id_number": instructor_id, "role": {"$regex": "^instructor$", "$options": "i"}})
        if not instructor:
            logging.error(f"Instructor not found: {instructor_id}")
            raise HTTPException(status_code=404, detail="Instructor not found")

        # Fetch modules created by the instructor
        modules_query = {"id_number": instructor_id}
        if program:
            modules_query["program"] = program
        modules = list(modules_collection.find(modules_query))
        modules_list = [
            {
                "_id": str(module["_id"]),
                "title": module["title"],
                "image_url": module.get("image_url", ""),
                "program": module.get("program", ""),
            } for module in modules
        ]

        # Fetch students in the same program
        students_query = {"role": {"$regex": "^student$", "$options": "i"}}
        if program:
            students_query["program"] = program
        students = list(users_collection.find(students_query))
        total_students = len(students)

        # Calculate engagement rate (example: based on post-test submissions)
        scores = scores_collection.find({"test_type": "posttest"})
        total_submissions = 0
        total_questions = 0
        for score in scores:
            total_submissions += score["correct"] + score["incorrect"]
            total_questions += score["total_questions"]
        engagement_rate = (total_submissions / total_questions * 100) if total_questions > 0 else 0

        # Fetch attendance data (placeholder: replace with actual logic)
        attendance_data = []
        for student in students:
            student_scores = scores_collection.find_one({"user_id": student["id_number"], "test_type": "posttest"})
            attendance_percentage = student_scores["correct"] / student_scores["total_questions"] * 100 if student_scores else 0
            attendance_data.append({
                "studentName": f"{student.get('firstname', '')} {student.get('lastname', '')}".strip(),
                "percentage": round(attendance_percentage, 2),
            })

        return {
            "stats": {
                "totalStudents": total_students,
                "engagementRate": round(engagement_rate, 2),
            },
            "modules": modules_list,
            "attendance": attendance_data,
        }
    except Exception as e:
        logging.error(f"Error fetching instructor dashboard data: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard data")
    
@app.get("/api/engagement-rate")
async def get_engagement_rate(instructor_id: str = Query(None), program: str = Query(None)):
    """
    Calculate engagement rate based on post-test completions for modules.
    """
    try:
        # Fetch modules for the instructor or program
        query = {}
        if instructor_id:
            query["id_number"] = instructor_id
        if program:
            query["program"] = program
        modules = list(modules_collection.find(query))
        total_modules = len(modules)

        # Fetch students
        students_query = {"role": {"$regex": "^student$", "$options": "i"}}
        if program:
            students_query["program"] = program
        students = list(users_collection.find(students_query))
        total_students = len(students)

        # Count completed post-tests
        completed_post_tests = 0
        for student in students:
            post_test_results = scores_collection.find({
                "user_id": student["id_number"],
                "test_type": "posttest",
                "module_id": {"$in": [str(module["_id"]) for module in modules]}
            })
            completed_post_tests += len(list(post_test_results))

        # Calculate engagement rate
        total_possible_completions = total_students * total_modules
        engagement_rate = (completed_post_tests / total_possible_completions * 100) if total_possible_completions > 0 else 0

        return {
            "engagementRate": round(engagement_rate, 1),
            "totalStudents": total_students,
            "totalModules": total_modules,
            "completedPostTests": completed_post_tests
        }
    except Exception as e:
        logging.error(f"Error calculating engagement rate: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate engagement rate")
    
@app.get("/api/progress/{user_id}")
async def get_progress(user_id: str):
    try:
        user = users_collection.find_one({"id_number": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        program = user["program"]
        modules = list(modules_collection.find({"program": program}))
        total_modules = len(modules)
        post_test_results = list(scores_collection.find({"user_id": user_id, "test_type": "posttest"}))
        completed_post_tests = len(post_test_results)
        progress = (completed_post_tests / total_modules * 100) if total_modules > 0 else 0
        return {
            "progress": round(progress, 0),
            "totalModules": total_modules,
            "completedPostTests": completed_post_tests
        }
    except Exception as e:
        logging.error(f"Error calculating progress for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate progress")