from fastapi import APIRouter, HTTPException
from models import PostTestRequest, PostTestSubmission, PreTestResponse, PostTestResponse, ScoreData, QuestionWithAnswers
from database import modules_collection, pre_test_collection, post_test_collection, scores_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/createposttest/{module_id}")
async def create_posttest(module_id: str, post_test_request: PostTestRequest):
    if not ObjectId.is_valid(module_id):
        raise HTTPException(status_code=400, detail="Invalid module ID format")
    module = modules_collection.find_one({"_id": ObjectId(module_id)})
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    if post_test_collection.find_one({"module_id": module_id}):
        raise HTTPException(status_code=400, detail="Post-test already exists")
    if not post_test_request.questions:
        raise HTTPException(status_code=400, detail="At least one question required")
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
    post_test_result = post_test_collection.insert_one(post_test_data)
    pre_test_data = {
        "module_id": module_id,
        "title": f"Pre-Test for {post_test_request.title}",
        "questions": post_test_data["questions"],
        "created_at": datetime.utcnow()
    }
    pre_test_result = pre_test_collection.insert_one(pre_test_data)
    return {
        "success": True,
        "post_test_id": str(post_test_result.inserted_id),
        "pre_test_id": str(pre_test_result.inserted_id)
    }

@router.get("/api/pre-test/{module_id}", response_model=PreTestResponse)
def get_pre_test(module_id: str):
    pre_test = pre_test_collection.find_one({"module_id": module_id})
    if not pre_test:
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
    return PreTestResponse(
        pre_test_id=str(pre_test['_id']),
        module_id=pre_test['module_id'],
        title=pre_test['title'],
        questions=questions_with_answers
    )

@router.post("/api/pre-test/submit/{module_id}")
def submit_pre_test(module_id: str, submission: PostTestSubmission):
    pre_test = pre_test_collection.find_one({"module_id": module_id})
    if not pre_test:
        raise HTTPException(status_code=404, detail="Pre-test not found for this module")
    correct_answers = {str(index): question["correctAnswer"] for index, question in enumerate(pre_test["questions"])}
    correct_count = 0
    incorrect_count = 0
    for question, user_answer in submission.answers.items():
        correct_answer = correct_answers.get(question)
        if correct_answer and user_answer == correct_answer:
            correct_count += 1
        elif user_answer:
            incorrect_count += 1
    score_data = {
        "module_id": module_id,
        "user_id": submission.user_id,
        "correct": correct_count,
        "incorrect": incorrect_count,
        "total_questions": len(pre_test["questions"]),
        "user_answers": submission.answers,
        "test_type": "pretest",
        "time_spent": submission.time_spent,
        "submitted_at": datetime.utcnow()
    }
    scores_collection.insert_one(score_data)
    return {
        "success": True,
        "message": "Pre-test submitted successfully!",
        "correct": correct_count,
        "incorrect": incorrect_count,
        "total_questions": len(pre_test["questions"])
    }

@router.get("/api/post-test/{module_id}", response_model=PostTestResponse)
def get_post_test(module_id: str):
    post_test = post_test_collection.find_one({"module_id": module_id})
    if not post_test:
        raise HTTPException(status_code=404, detail="Post-test not found")
    questions_with_answers = []
    for question in post_test['questions']:
        wrong_answers = [opt for opt in question['options'] if opt != question['correctAnswer']]
        questions_with_answers.append(QuestionWithAnswers(
            question=question['question'],
            options=question['options'],
            correctAnswer=question['correctAnswer'],
            wrongAnswers=wrong_answers
        ))
    return PostTestResponse(
        post_test_id=str(post_test['_id']),
        module_id=post_test['module_id'],
        title=post_test['title'],
        questions=questions_with_answers
    )

@router.post("/api/post-test/submit/{module_id}")
async def submit_post_test(module_id: str, submission: PostTestSubmission):
    post_test = post_test_collection.find_one({"module_id": module_id})
    if not post_test:
        raise HTTPException(status_code=404, detail="Post-test not found for this module")
    correct_answers = {str(index): question["correctAnswer"] for index, question in enumerate(post_test["questions"])}
    correct_count = 0
    incorrect_count = 0
    for question, user_answer in submission.answers.items():
        correct_answer = correct_answers.get(question)
        if correct_answer and user_answer == correct_answer:
            correct_count += 1
        elif user_answer:
            incorrect_count += 1
    score_data = ScoreData(
        module_id=module_id,
        user_id=submission.user_id,
        correct=correct_count,
        incorrect=incorrect_count,
        total_questions=len(post_test["questions"]),
        user_answers=submission.answers,
        time_spent=submission.time_spent,
        test_type="posttest"
    )
    scores_collection.insert_one(score_data.dict())
    return {
        "success": True,
        "message": "Post-test submitted successfully!",
        "correct": correct_count,
        "incorrect": incorrect_count,
        "total_questions": len(post_test["questions"])
    }

@router.get("/api/module-status/{module_id}/{user_id}")
def get_module_status(module_id: str, user_id: str):
    pre_test_score = scores_collection.find_one({
        "module_id": module_id,
        "user_id": user_id,
        "test_type": "pretest"
    })
    post_test_score = scores_collection.find_one({
        "module_id": module_id,
        "user_id": user_id,
        "test_type": "posttest"
    })
    return {
        "pre_test_completed": bool(pre_test_score),
        "post_test_completed": bool(post_test_score)
    }