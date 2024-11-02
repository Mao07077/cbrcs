from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
import os

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

app = FastAPI()

# MongoDB setup
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if your frontend runs on a different port
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

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

def hash_password(password: str) -> str:
    """Hash a password for storing."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify a stored password against a hash."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

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
