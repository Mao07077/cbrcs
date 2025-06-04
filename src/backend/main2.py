from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
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

@app.get("/dashboard")
def dashboard(idNumber: str):
    # In real app, you'd check authentication here
    return {"message": f"Welcome to the dashboard, {idNumber}!"}