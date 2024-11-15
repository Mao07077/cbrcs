from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
import os
import random
import smtplib
from email.mime.text import MIMEText
import shutil
from typing import List
from fastapi.staticfiles import StaticFiles
import logging
from bson import ObjectId  # Import ObjectId for MongoDB

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

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow any headers
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
collection = db[COLLECTION_NAME]  # Define the collection variable

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

class Module(BaseModel):
    _id: str
    title: str
    image_url: str
    video_url: str

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def send_email(to_email: str, subject: str, body: str):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = EMAIL_HOST_USER
    msg['To'] = to_email

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
        server.send_message(msg)

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
    video_path = f"uploads/{video.filename}"
    picture_path = f"uploads/{picture.filename}"
    os.makedirs("uploads", exist_ok=True)
    with open(video_path, "wb") as video_file:
        shutil.copyfileobj(video.file, video_file)
    with open(picture_path, "wb") as picture_file:
        shutil.copyfileobj(picture.file, picture_file)
    module_data = {
        "title": title,
        "topic": topic,
        "description": description,
        "program": program,
        "id_number": id_number,
        "video_url": video_path,
        "image_url": picture_path,
    }
    result = modules_collection.insert_one(module_data)
    if result.inserted_id:
        return {"success": True, "message": "Module created successfully!"}
    else:
        raise HTTPException(status_code=500, detail="Failed to create module")

# Module retrieval endpoint
@app.get("/api/modules", response_model=List[Module])
async def get_modules():
    try:
        modules_cursor = modules_collection.find()
        modules = [
            {
                "_id": str(module["_id"]),
                "title": module["title"],
                "image_url": module["image_url"],
                "video_url": module["video_url"]
            }
            for module in modules_cursor
        ]
        return modules
    except Exception as e:
        logging.error(f"Error fetching modules: {e}")
        return JSONResponse(status_code=500, content={"message": str(e)})

@app.get("/api/modules/{module_id}")
async def get_module(module_id: str):
    module = modules_collection.find_one({"_id": ObjectId(module_id)})
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module
