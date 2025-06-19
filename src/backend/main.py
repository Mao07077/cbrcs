from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from apscheduler.schedulers.background import BackgroundScheduler
from config import logger
from database import users_collection, schedule_collection
from utils import check_schedule_and_notify
import os

# FastAPI app setup
app = FastAPI()

# Mount static files
app.mount("/uploads", StaticFiles(directory=os.path.abspath("uploads")), name="uploads")

# CORS middleware
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

# Scheduler setup
scheduler = BackgroundScheduler()
scheduler.add_job(lambda: check_schedule_and_notify(users_collection, schedule_collection), 'interval', minutes=1)

# Import and register routes
from routes.auth_routes import router as auth_router
from routes.profile_routes import router as profile_router
from routes.module_routes import router as module_router
from routes.test_routes import router as test_router
from routes.dashboard_routes import router as dashboard_router
from routes.note_routes import router as note_router
from routes.report_routes import router as report_router
from routes.flashcard_routes import router as flashcard_router
from routes.survey_routes import router as survey_router
from routes.message_routes import router as message_router
from routes.account_routes import router as account_router
from routes.schedule_routes import router as schedule_router
from routes.post_routes import router as post_router
from routes.websocket_routes import router as websocket_router
from routes.misc_routes import router as misc_router

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(module_router)
app.include_router(test_router)
app.include_router(dashboard_router)
app.include_router(note_router)
app.include_router(report_router)
app.include_router(flashcard_router)
app.include_router(survey_router)
app.include_router(message_router)
app.include_router(account_router)
app.include_router(schedule_router)
app.include_router(post_router)
app.include_router(websocket_router)
app.include_router(misc_router)

@app.on_event("startup")
async def startup_event():
    if not scheduler.running:
        logger.info("FastAPI app has started. Scheduler will now check schedules every minute.")
        scheduler.start()
    else:
        logger.info("Scheduler is already running.")