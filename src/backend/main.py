from fastapi import FastAPI, HTTPException, File, UploadFile,Query, Form
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
import smtplib
from fastapi import FastAPI, UploadFile, File
from io import BytesIO
from pptx import Presentation
from PyPDF2 import PdfReader
from email.mime.text import MIMEText
import shutil
from typing import List,Dict
from fastapi.staticfiles import StaticFiles
import logging
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId 
from typing import Any
import ollama



 # Import InvalidId to handle ObjectId errors

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
COLLECTION_NAME = "userinfo"

# Configure logging
logging.basicConfig(level=logging.INFO)

app = FastAPI()
router = APIRouter()


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify specific origins
    allow_credentials=True,
    allow_methods=["*"],  # or specify methods like ["GET", "POST"]
    allow_headers=["*"],  # or specify headers
)

# MongoDB setup
try:
    client = MongoClient(MONGO_URI)
    client.admin.command('ping')
    logging.info("MongoDB connection successful")
except Exception as e:
    logging.error(f"Failed to connect to MongoDB: {e}")

db = client[DATABASE_NAME]
modules_collection = db["modules"]  # Use 'modules' collection specifically
post_test_collection = db.get_collection("post_tests")  # Define 'posttests' collection
collection = db[COLLECTION_NAME]  # Define the collection variable
scores_collection = db["scores"]
users_collection = db[COLLECTION_NAME]
request_collection = db["requests"]


# Serve static files for images and videos
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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
    questions: List[QuestionWithAnswers]  # Update to use the new model

# Helper functions
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

def get_current_user(id_number: str):
    """Simulates user authentication by ID."""
    user = users_collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
def create_prompt(input_text: str) -> str:
    return (
        f"You are a helpful assistant. Please paraphrase the following question REMOVE THE INTRODUCTION THATS SAYING ITS PARAPHRASE I KNOW IT IS,    REMOVE THE NUMBERING REMOVE THE NOTE I DONT NEED THAT:, DONT SAY THE WORD IN THE CORRECT ANSWER IN THE QUESTIONS\n"
        f"{input_text}\n"
        f"Keep the meaning intact and maintain proper grammar."
 
    )

def get_wrong_answers(correct_answer: str) -> List[str]:
     
    try:
        response = ollama.generate(model='llama3.2', prompt=prompt)
        wrong_answers = response.response.strip().split("\n")
        return wrong_answers[:3]  # Ensure only three wrong answers are returned
    except Exception as e:
        logging.error(f"Failed to generate wrong answers: {e}")
        return ["Option A", "Option B", "Option C"]  # Default wrong answers
# User management endpoints
def extract_text_from_ppt(file):
  presentation = Presentation(file)
  text = ''
  for slide in presentation.slides:
    for shape in slide.shapes:
      if hasattr(shape, "text"):
        text += shape.text
  return text

def extract_text_from_pdf(file):
  reader = PdfReader(file)
  text = ''
  for page in reader.pages:
    text += page.extract_text()
  return text
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

@app.post("/api/login")
async def login(data: LoginData):
 
    user = collection.find_one({"id_number": data.idNumber})
    if user and verify_password(data.password, user["password"]):
        # Retrieve user's role for frontend redirection
        role = user.get("role", "unknown").lower()
        return JSONResponse({"success": True, "message": "Login successful!", "role": role})
    else:
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
  """
  Fetch all modules with optional filters.
  """
  query = {}
  if id_number:
    query["id_number"] = id_number
  if program:
    query["program"] = program

  modules = modules_collection.find(query)
  return [{"_id": str(module["_id"]), "title": module["title"], "image_url": module["image_url"], "id_number": module["id_number"], "program": module["program"]} for module in modules]



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


@app.post("/api/post-tests")
async def create_post_test(post_test: PostTestRequest):
    try:
        # Ensure the module exists by checking its ID
        module = modules_collection.find_one({"_id": ObjectId(post_test.module_id)})
        if not module:
            raise HTTPException(status_code=404, detail="Module not found.")
        
        # Prepare post-test data
        post_test_data = post_test.dict()
        post_test_collection.insert_one(post_test_data)
        
        return {"success": True, "message": "Post-test created successfully!"}
    
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid module ID.")
    except Exception as e:
        logging.error(f"Error creating post-test: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


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
    # Check if the module exists
    module = modules_collection.find_one({"_id": ObjectId(module_id)})
    if not module:
        raise HTTPException(status_code=404, detail="Module not found.")

    # Prepare post-test data
    post_test_data = {
        "module_id": module_id,
        "title": post_test_request.title,
        "questions": [
            {
                "question": question.question,
                "options": question.options,
                "correctAnswer": question.correctAnswer
            }
            for question in post_test_request.questions
        ],
    }

    # Insert post-test data into the database
    result = post_test_collection.insert_one(post_test_data)

    return {
        "success": True,
        "message": "Post-test created successfully!",
        "post_test_id": str(result.inserted_id)  # Return the inserted post-test's ID
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
        wrong_answers = get_wrong_answers(question['correctAnswer'])
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

# Submit Post-Test
@router.post("/api/post-test/submit/{module_id}")
async def submit_post_test(module_id: str, answers: PostTestSubmission):
    logging.info(f"Received submission for module_id: {module_id} with answers: {answers.answers}")

    if not module_id:
        raise HTTPException(status_code=400, detail="Module ID is required")

    # Fetch the post-test associated with the module_id
    post_test = post_test_collection.find_one({"module_id": module_id})
    if not post_test:
        raise HTTPException(status_code=404, detail="Post-test not found for this module")

    # Get the list of questions and the correct answers from the post-test
    correct_answers = {str(index): question["correctAnswer"] for index, question in enumerate(post_test["questions"])}
    logging.info(f"Correct answers: {correct_answers}")

    # Initialize score counters
    correct_count = 0
    incorrect_count = 0

    # Compare provided answers with correct answers
    for question, user_answer in answers.answers.items():
        correct_answer = correct_answers.get(question)
        logging.info(f"Comparing question: {question}, User answer: {user_answer}, Correct answer: {correct_answer}")
        
        if correct_answer is not None:  # Ensure correct_answer exists
            if user_answer == correct_answer:
                correct_count += 1
            else:
                incorrect_count += 1

    # Prepare score data
    score_data = ScoreData(
        module_id=module_id,
        user_id=answers.user_id,
        correct=correct_count,
        incorrect=incorrect_count,
        total_questions=len(post_test["questions"]),
        user_answers=answers.answers
    )

    # Log the score data before saving
    logging.info(f"Score data to be saved: {score_data.dict()}")

    # Save the score to the database
    scores_collection.insert_one(score_data.dict())

    # Return the score (correct and incorrect answers count)
    return {
        "success": True,
        "message": "Post-test submitted successfully!",
        "correct": correct_count,
        "incorrect": incorrect_count,
        "total_questions": len(post_test["questions"])
    }
@router.get("/api/post-test/results/{user_id}")
async def get_post_test_results(user_id: str):
    """
    Fetch all post-test results for the given user_id.
    """
    try:
        results = scores_collection.find({"user_id": user_id})
        results_list = [
            {
                "module_id": result["module_id"],
                "correct": result["correct"],
                "incorrect": result["incorrect"],
                "total_questions": result["total_questions"],
                "score": result["correct"] / result["total_questions"] * 100
            }
            for result in results
        ]
        return results_list
    except Exception as e:
        logging.error(f"Error fetching post-test results for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching post-test results")

# Include the router
app.include_router(router)

@app.get("/api/dashboard/{id_number}")
async def get_dashboard(id_number: str):
    # Fetch user details
    user = collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch all modules the user is associated with
    modules = modules_collection.find({"program": user["program"]})
    modules_list = [{"_id": str(module["_id"]), "title": module["title"], "image_url": module["image_url"]} for module in modules]

    # Fetch pretest and post-test scores for the user
    scores = scores_collection.find({"user_id": id_number})
    post_test_scores = []
    pretest_scores = []

    for score in scores:
        module_id = score["module_id"]
        module_title = next((module["title"] for module in modules if str(module["_id"]) == module_id), "Unknown Module")
        
        # Fetch post-test title from post_tests collection
        post_test = post_test_collection.find_one({"module_id": module_id})
        post_test_title = post_test["title"] if post_test else "Unknown Post-Test"

        if score.get("test_type") == "pretest":
            pretest_scores.append({"subject": module_title, "score": score["correct"]})
        else:  # Assuming post-test by default
            post_test_scores.append({
                "post_test_title": post_test_title,  # Add post-test title
                "correct": score["correct"],
                "incorrect": score["incorrect"],
                "total_questions": score["total_questions"]
            })

    return {
        "modules": modules_list,
        "pretest_scores": pretest_scores,
        "post_tests": post_test_scores,
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

@app.get("/api/accounts", response_model=List[AccountResponse])
async def get_accounts(
    search_query: str = Query("", alias="searchQuery"),
    role_filter: str = Query("", alias="roleFilter"),
):
    """Fetch accounts from the userinfo collection with optional search and filtering."""
    query = {}
    if search_query:
        query["$or"] = [
            {"id_number": {"$regex": search_query, "$options": "i"}},
            {"firstname": {"$regex": search_query, "$options": "i"}},
            {"lastname": {"$regex": search_query, "$options": "i"}},
        ]
    if role_filter:
        query["role"] = {"$regex": role_filter, "$options": "i"}

    users = users_collection.find(query)
    return [
        {
            "id": str(user["_id"]),
            "profile": user.get("profile", "N/A"),
            "accountNo": user["id_number"],
            "name": f"{user['firstname']} {user['lastname']}",
            "role": user["role"],
        }
        for user in users
    ]

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

@app.get("/api/accounts", response_model=list[Account])
async def get_accounts():
    try:
        accounts = []
        for user in users_collection.find():
            account = {
                "id": str(user["_id"]),
                "profile": user.get("profile", ""),
                "accountNo": user.get("id_number", ""),  # Assuming id_number is the account number
                "name": f"{user.get('firstname', '')} {user.get('lastname', '')}",
                "role": user.get("role", ""),
            }
            accounts.append(account)
        return accounts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching accounts: {e}")

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
        response = ollama.generate(model='llama3.2', prompt=prompt)
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