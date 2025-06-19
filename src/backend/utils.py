import bcrypt
import smtplib
from email.mime.text import MIMEText
import pdfplumber
from io import BytesIO
from pptx import Presentation
from PyPDF2 import PdfReader
import os
import re
import random
import asyncio
import ollama
import logging
from datetime import datetime
from fastapi import HTTPException
from config import EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, logger
from models import Flashcard
from typing import List

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return password == hashed

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
        logger.info(f"Email sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")

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
        logger.error(f"Error extracting text from PDF: {e}")
        raise HTTPException(status_code=500, detail="Failed to extract text from PDF")

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

def generate_flashcards_from_text(text: str, module_id: str) -> List[Flashcard]:
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    flashcards = []
    candidate_sentences = [
        s for s in sentences
        if len(s) > 30 and any(keyword in s.lower() for keyword in [
            'law', 'theory', 'principle', 'definition', 'rule', 'stage', 'category'
        ])
    ]
    for i in range(10):
        if i < len(candidate_sentences):
            sentence = candidate_sentences[i]
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
        flashcards_data = eval(response['response'])
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
    except asyncio.TimeoutError:
        logger.error("Ollama request timed out after 30 seconds")
        return None
    except Exception as e:
        logger.error(f"Error generating flashcards with ollama: {e}")
        return None

def send_reminder_email(user_id, task, current_time, current_day, users_collection, schedule_collection):
    user = users_collection.find_one({"id_number": user_id})
    if not user:
        return
    user_email = user["email"]
    subject = f"Reminder: Task '{task}' at {current_time} on {current_day}"
    body = f"Dear {user['firstname']} {user['lastname']},\n\nThis is a reminder for your task '{task}' scheduled for {current_time} on {current_day}.\n\nBest regards,\nYour Study Schedule App"
    message = MIMEText(body)
    message['From'] = EMAIL_HOST_USER
    message['To'] = user_email
    message['Subject'] = subject
    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            server.sendmail(EMAIL_HOST_USER, user_email, message.as_string())
        logger.info(f"Reminder sent to {user_email}")
    except Exception as e:
        logger.error(f"Error sending email: {e}")

def check_schedule_and_notify(users_collection, schedule_collection):
    current_time = datetime.now().strftime('%I:%M %p')
    current_day = datetime.now().strftime('%a').upper()
    schedules = schedule_collection.find()
    daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    for schedule in schedules:
        user_id = schedule["id_number"]
        times = schedule["times"]
        schedule_data = schedule["schedule"]
        for i, time in enumerate(times):
            if time == current_time:
                for j, day in enumerate(schedule_data[i]):
                    if day and day != '0' and daysOfWeek[j] == current_day:
                        send_reminder_email(user_id, day, current_time, current_day, users_collection, schedule_collection)