from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
from typing import Optional
import os
import bcrypt

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

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    modules = list(db["modules"].find(query))
    # Convert ObjectId to string for frontend compatibility
    for module in modules:
        module["_id"] = str(module["_id"])
    return modules

@app.get("/dashboard")
def dashboard(idNumber: str):
    # In real app, you'd check authentication here
    return {"message": f"Welcome to the dashboard, {idNumber}!"}