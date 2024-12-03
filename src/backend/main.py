from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette.middleware.trustedhost import TrustedHostMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi import APIRouter
import bcrypt
import os
import random
import smtplib
from email.mime.text import MIMEText
import shutil
from typing import List,Dict
from fastapi.staticfiles import StaticFiles
import logging
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId 
from typing import Any

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


# User management endpoints
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
        return {"success": True, "message": "Login successful!"}
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
    video: UploadFile = File(...),
    picture: UploadFile = File(...),
):
    """
    Create a new module with associated video and image uploads.
    """
    try:
        # Save files to the "uploads" directory
        video_path = f"uploads/{video.filename}"
        picture_path = f"uploads/{picture.filename}"
        os.makedirs("uploads", exist_ok=True)
        with open(video_path, "wb") as video_file:
            shutil.copyfileobj(video.file, video_file)
        with open(picture_path, "wb") as picture_file:
            shutil.copyfileobj(picture.file, picture_file)
        
        # Prepare module data
        module_data = {
            "title": title,
            "topic": topic,
            "description": description,
            "program": program,
            "id_number": id_number,
            "video_url": video_path,
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
async def get_modules():
    """
    Fetch all modules.
    """
    modules = modules_collection.find()
    return [{"_id": str(module["_id"]), "title": module["title"], "image_url": module["image_url"]} for module in modules]


@app.get("/api/modules/{module_id}")
async def get_module(module_id: str):
    """
    Fetch a specific module by its ID.
    """
    try:
        module = modules_collection.find_one({"_id": ObjectId(module_id)})
        if module:
            return {
                "_id": str(module["_id"]),  # Convert ObjectId to string
                "title": module["title"],
                "description": module.get("description", ""),
                "topic": module.get("topic", ""),
                "program": module.get("program", ""),
                "image_url": module["image_url"],
                "video_url": module["video_url"]
            }
        else:
            raise HTTPException(status_code=404, detail="Module not found")
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid module ID format")
    except Exception as e:
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
@router.get("/api/post-test/{module_id}")
async def get_post_test(module_id: str):
    """
    Fetch the post-test for the given module_id.
    """
    try:
        post_test = post_test_collection.find_one({"module_id": module_id})
        if not post_test:
            raise HTTPException(status_code=404, detail="Post-test not found for this module")
        
        return {
            "post_test_id": str(post_test["_id"]),
            "module_id": post_test["module_id"],
            "title": post_test["title"],
            "questions": post_test["questions"]
        }
    except Exception as e:
        logging.error(f"Error fetching post-test for module {module_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching post-test")

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

# Include the router
app.include_router(router)

@app.get("/api/dashboard/{id_number}")
async def get_dashboard(id_number: str):
    # Fetch user profile details
    user = collection.find_one({"id_number": id_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch modules the user is associated with
    modules = modules_collection.find({"program": user["program"]})
    modules_list = [{"_id": str(module["_id"]), "title": module["title"], "image_url": module["image_url"]} for module in modules]

    # Fetch post-tests and scores (if applicable)
    post_tests = post_test_collection.find({"module_id": {"$in": [module["_id"] for module in modules]}})
    post_tests_list = [{"_id": str(post_test["_id"]), "title": post_test["title"]} for post_test in post_tests]

    # Example: Assuming you want to return user info, modules, and post-tests
    return {
        "user": {
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "program": user["program"],
            "hoursActivity": user.get("hoursActivity", 0),
        },
        "modules": modules_list,
        "post_tests": post_tests_list,
    }
