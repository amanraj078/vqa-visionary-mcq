# from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
# from moviepy import VideoFileClip
# import torch
# from transformers import BlipProcessor, BlipForQuestionAnswering
# import io
# import os
# import time
# from typing import Optional, List
# from pydantic import BaseModel
# import uuid
# from fastapi.middleware.cors import CORSMiddleware
# from typing import Optional, List
# from quiz import QuizManager
# import openai

# # Configure OpenRouter (Meta: Llama 4 Maverick free)
# openai.api_key = os.getenv("OPENROUTER_API_KEY")
# openai.api_base = "https://openrouter.ai/api/v1"
# openai.api_type = "open_router"

# class QuizRequest(BaseModel):
#     video_id: str
#     num_questions: Optional[int] = 5
#     time_limit: Optional[int] = 300

# class AnswerSubmission(BaseModel):
#     session_id: str
#     question_id: str
#     answer: str

# app = FastAPI()
# quiz_manager = QuizManager()

# # Constants
# MAX_VIDEO_SIZE = 50 * 1024 * 1024  # 50MB
# ALLOWED_VIDEO_TYPES = ["video/mp4", "video/mpeg", "video/quicktime"]
# TEMP_DIR = "temp"

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load BLIP model
# processor = BlipProcessor.from_pretrained("Salesforce/blip-vqa-base")
# model = BlipForQuestionAnswering.from_pretrained("Salesforce/blip-vqa-base").to("cpu")

# @app.post("/api/ask")
# async def ask_question(video: UploadFile = File(...), question: str = Form(...)):
#     if not os.path.exists("temp"):
#         os.makedirs("temp")
#     temp_path = os.path.join("temp", "temp_video.mp4")

#     try:
#         # Validate file size
#         content = await video.read()
#         file_size = len(content)
#         if file_size > MAX_VIDEO_SIZE:
#             raise HTTPException(status_code=413, detail="Video file too large. Maximum size is 50MB.")

#         # Validate file type
#         if video.content_type not in ALLOWED_VIDEO_TYPES:
#             raise HTTPException(status_code=415, detail=f"Unsupported video format. Allowed types: {', '.join(ALLOWED_VIDEO_TYPES)}")

#         # Write video file
#         with open(temp_path, "wb") as f:
#             f.write(content)

#         try:
#             # Extract a keyframe with error handling
#             try:
#                 clip = VideoFileClip(temp_path)
#                 if clip.duration < 0.1:
#                     raise ValueError("Video is too short or corrupted")
#                 frame_time = min(clip.duration / 2, 5.0)  # Take middle frame or 5 seconds, whichever is shorter
#                 frame = clip.get_frame(frame_time)
#             except Exception as e:
#                 raise HTTPException(status_code=400, detail=f"Error extracting video frame: {str(e)}")
#             finally:
#                 if 'clip' in locals():
#                     clip.close()

#             # Validate frame
#             if frame is None or frame.size == 0:
#                 raise HTTPException(status_code=400, detail="Failed to extract valid frame from video")

#             # Process image with BLIP with error handling
#             try:
#                 inputs = processor(images=frame, text=question, return_tensors="pt").to("cpu")
#                 with torch.no_grad():
#                     output = model.generate(**inputs)
#                     answer = processor.batch_decode(output, skip_special_tokens=True)[0]
#                     if not answer or answer.isspace():
#                         raise HTTPException(status_code=400, detail="Model failed to generate a valid answer")

#                     return {
#                         "answer": answer,
#                         "confidence": 1.0
#                     }
#             except Exception as e:
#                 raise HTTPException(status_code=500, detail=f"Error processing with BLIP model: {str(e)}")

#         finally:
#             # Cleanup temporary file
#             if os.path.exists(temp_path):
#                 os.remove(temp_path)

#     except HTTPException:
#         # Re-raise HTTP exceptions
#         raise
#     except Exception as e:
#         # Log unexpected errors and cleanup
#         print(f"Unexpected error in ask_question: {str(e)}")
#         if os.path.exists(temp_path):
#             os.remove(temp_path)
#         raise HTTPException(status_code=500, detail="An unexpected error occurred while processing your request")

# def extract_keyframes(video_path: str, num_frames: int) -> List[dict]:
#     """
#     Extract keyframes and generate a text description per frame using BLIP.
#     Returns list of dicts: {timestamp: float, description: str}
#     """
#     frames = []
#     clip = VideoFileClip(video_path)
#     duration = clip.duration
#     interval = duration / num_frames

#     for i in range(num_frames):
#         t = min(interval * i, duration - 0.01)
#         try:
#             image = clip.get_frame(t)
#             # Generate description via BLIP
#             inputs = processor(images=image, text="Describe this scene.", return_tensors="pt")
#             inputs = {k: v.to("cpu") for k, v in inputs.items()}
#             with torch.no_grad():
#                 out_ids = model.generate(**inputs)
#             desc = processor.batch_decode(out_ids, skip_special_tokens=True)[0]
#             frames.append({"timestamp": t, "description": desc})
#         except Exception as e:
#             print(f"Error at {t}s: {e}")
#     clip.close()

#     if not frames:
#         raise ValueError("Failed to extract any valid frames.")
#     return frames

# @app.post("/api/quiz/create")
# async def create_quiz(
#     video: UploadFile = File(...),
#     num_questions: int = Form(5),
#     time_limit: int = Form(300),
# ):
#     os.makedirs(TEMP_DIR, exist_ok=True)
#     temp_path = os.path.join(TEMP_DIR, f"quiz_{int(time.time())}.mp4")

#     content = await video.read()
#     if len(content) > MAX_VIDEO_SIZE:
#         raise HTTPException(413, "Video file too large")
#     if video.content_type not in ALLOWED_VIDEO_TYPES:
#         raise HTTPException(415, f"Unsupported format: {video.content_type}")

#     with open(temp_path, "wb") as f:
#         f.write(content)

#     try:
#         # 1) Extract frames & descriptions
#         video_frames = extract_keyframes(temp_path, num_questions)

#         # 2) Generate MCQs via remote LLM
#         questions = await quiz_manager.generate_questions(video_frames, num_questions)

#         # 3) Create and return session
#         session = quiz_manager.create_session(video.filename, questions, time_limit)
#         return {
#             "session_id": session.session_id,
#             "questions": questions,
#             "time_limit": time_limit
#         }

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(500, str(e))

#     finally:
#         if os.path.exists(temp_path):
#             os.remove(temp_path)

# @app.post("/api/quiz/submit")
# async def submit_answer(submission: AnswerSubmission):
#     correct = quiz_manager.submit_answer(
#         submission.session_id, submission.question_id, submission.answer
#     )
#     return {"correct": correct}

# @app.get("/api/quiz/{session_id}/results")
# async def get_quiz_results(session_id: str):
#     results = quiz_manager.get_results(session_id)
#     if not results:
#         raise HTTPException(404, "Quiz session not found")
#     return results
#     results = quiz_manager.get_results(session_id)
#     if not results:
#         raise HTTPException(404, "Quiz session not found")
#     return results

# main.py
import os
import time
from typing import Optional, List

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from moviepy import VideoFileClip
import torch
from transformers import BlipProcessor, BlipForQuestionAnswering
import openai

from pydantic import BaseModel
from quiz import QuizManager



# Configure OpenRouter once
openai.api_key = os.getenv("OPENROUTER_API_KEY")
openai.api_base = "https://openrouter.ai/api/v1"
openai.api_type = "open_router"

# FastAPI setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

quiz_manager = QuizManager()

# Constants
MAX_VIDEO_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_VIDEO_TYPES = ["video/mp4", "video/mpeg", "video/quicktime"]
TEMP_DIR = "temp"

# Load BLIP model onto GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
processor = BlipProcessor.from_pretrained("Salesforce/blip-vqa-base")
model = BlipForQuestionAnswering.from_pretrained("Salesforce/blip-vqa-base").to(device)


class QuizRequest(BaseModel):
    video_id: str
    num_questions: Optional[int] = 5
    time_limit: Optional[int] = 300

class AnswerSubmission(BaseModel):
    session_id: str
    question_id: str
    answer: str

@app.post("/api/ask")
async def ask_question(video: UploadFile = File(...), question: str = Form(...)):
    if not os.path.exists("temp"):
        os.makedirs("temp")
    temp_path = os.path.join("temp", "temp_video.mp4")

    try:
        # Validate file size
        content = await video.read()
        file_size = len(content)
        if file_size > MAX_VIDEO_SIZE:
            raise HTTPException(status_code=413, detail="Video file too large. Maximum size is 50MB.")

        # Validate file type
        if video.content_type not in ALLOWED_VIDEO_TYPES:
            raise HTTPException(status_code=415, detail=f"Unsupported video format. Allowed types: {', '.join(ALLOWED_VIDEO_TYPES)}")

        # Write video file
        with open(temp_path, "wb") as f:
            f.write(content)

        try:
            # Extract a keyframe with error handling
            try:
                clip = VideoFileClip(temp_path)
                if clip.duration < 0.1:
                    raise ValueError("Video is too short or corrupted")
                frame_time = min(clip.duration / 2, 5.0)  # Take middle frame or 5 seconds, whichever is shorter
                frame = clip.get_frame(frame_time)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error extracting video frame: {str(e)}")
            finally:
                if 'clip' in locals():
                    clip.close()

            # Validate frame
            if frame is None or frame.size == 0:
                raise HTTPException(status_code=400, detail="Failed to extract valid frame from video")

            # Process image with BLIP with error handling
            try:
                inputs = processor(images=frame, text=question, return_tensors="pt").to("cpu")
                with torch.no_grad():
                    output = model.generate(**inputs)
                    answer = processor.batch_decode(output, skip_special_tokens=True)[0]
                    if not answer or answer.isspace():
                        raise HTTPException(status_code=400, detail="Model failed to generate a valid answer")

                    return {
                        "answer": answer,
                        "confidence": 1.0
                    }
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error processing with BLIP model: {str(e)}")

        finally:
            # Cleanup temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log unexpected errors and cleanup
        print(f"Unexpected error in ask_question: {str(e)}")
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail="An unexpected error occurred while processing your request")

def extract_keyframes(video_path: str, num_frames: int) -> List[dict]:
    frames = []
    clip = VideoFileClip(video_path)
    duration = clip.duration
    interval = duration / num_frames

    for i in range(num_frames):
        t = min(interval * i, duration - 0.01)
        try:
            image = clip.get_frame(t)
            inputs = processor(images=image, text="Describe this scene.", return_tensors="pt")
            inputs = {k: v.to(device) for k, v in inputs.items()}
            with torch.no_grad():
                out_ids = model.generate(**inputs)
            desc = processor.batch_decode(out_ids, skip_special_tokens=True)[0]
            frames.append({"timestamp": t, "description": desc})
        except Exception as e:
            print(f"Error at {t}s: {e}")
    clip.close()

    if not frames:
        raise ValueError("Failed to extract any valid frames.")
    return frames


@app.post("/api/quiz/create")
async def create_quiz(
    video: UploadFile = File(...),
    num_questions: int = Form(5),
    time_limit: int = Form(300),
):
    os.makedirs(TEMP_DIR, exist_ok=True)
    temp_path = os.path.join(TEMP_DIR, f"quiz_{int(time.time())}.mp4")

    content = await video.read()
    if len(content) > MAX_VIDEO_SIZE:
        raise HTTPException(413, "Video file too large")
    if video.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(415, f"Unsupported format: {video.content_type}")

    with open(temp_path, "wb") as f:
        f.write(content)

    try:
        # 1) Extract frames & descriptions
        video_frames = extract_keyframes(temp_path, num_questions)

        # 2) Generate MCQs via QuizManager
        questions = await quiz_manager.generate_questions(video_frames, num_questions)

        # 3) Create session
        session = quiz_manager.create_session(video.filename, questions, time_limit)

        return {
            "session_id": session.session_id,
            "questions": [q.dict() for q in questions],
            "time_limit": time_limit
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/api/quiz/submit")
async def submit_answer(submission: AnswerSubmission):
    correct = quiz_manager.submit_answer(
        submission.session_id, submission.question_id, submission.answer
    )
    if not correct:
        raise HTTPException(400, "Invalid answer or session expired")
    return {"correct": True}


@app.get("/api/quiz/results/{session_id}")
async def get_quiz_results(session_id: str):
    results = quiz_manager.get_results(session_id)
    if not results:
        raise HTTPException(404, "Quiz session not found")
    return results
