from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
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
    allow_origins=["http://localhost:3000"],  # Allow the frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class LoginData(BaseModel):
    idNumber: str
    password: str

@app.post("/api/login")
async def login(data: LoginData):
    user = collection.find_one({"idNumber": data.idNumber, "password": data.password})
    if user:
        return {"success": True, "message": "Login successful!"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")
