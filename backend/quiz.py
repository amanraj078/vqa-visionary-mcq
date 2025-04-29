# quiz.py
import os
import json
import uuid
import time
from typing import List, Dict, Optional
from pydantic import BaseModel
import openai

# Configure OpenRouter once here
openai.api_key = os.getenv("OPENROUTER_API_KEY")
openai.api_base = "https://openrouter.ai/api/v1"
openai.api_type = "open_router"

class QuizQuestion(BaseModel):
    id: str
    question: str
    correct_answer: str
    options: List[str]
    frame_time: float

class QuizSession(BaseModel):
    session_id: str
    video_id: str
    questions: List[QuizQuestion]
    current_question: int
    start_time: float
    time_limit: int
    score: int

async def ask_maverick_for_mcq(description: str) -> Dict:
    prompt = f"""
Scene description:
\"{description}\"

Generate a JSON with keys:
- "question": concise MCQ about this scene
- "correct_answer": the right answer
- "options": list of four answers (1 correct + 3 plausible wrong)
"""
    resp = await openai.ChatCompletion.acreate(
        model="meta-llama/llama-4-maverick:free",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=150
    )
    return json.loads(resp.choices[0].message.content)

class QuizManager:
    def __init__(self):
        self.sessions: Dict[str, QuizSession] = {}

    async def generate_questions(
        self,
        video_frames: List[Dict],
        num_questions: int = 5
    ) -> List[QuizQuestion]:
        questions: List[QuizQuestion] = []
        for frame in video_frames[:num_questions]:
            desc = frame["description"]
            try:
                data = await ask_maverick_for_mcq(desc)
                q_text = data["question"]
                correct = data["correct_answer"]
                opts = data["options"]
            except Exception as e:
                print(f"MCQ generation failed for frame at {frame.get('timestamp')}: {e}")
                q_text = "What is happening in this scene?"
                correct = "cannot determine"
                opts = [correct, "nothing notable", "multiple activities", "scene unclear"]

            questions.append(QuizQuestion(
                id=str(uuid.uuid4()),
                question=q_text,
                correct_answer=correct,
                options=opts,
                frame_time=frame.get('timestamp', 0.0)
            ))
        return questions

    def create_session(self, video_id: str, questions: List[QuizQuestion], time_limit: int = 300) -> QuizSession:
        session = QuizSession(
            session_id=str(uuid.uuid4()),
            video_id=video_id,
            questions=questions,
            current_question=0,
            start_time=time.time(),
            time_limit=time_limit,
            score=0
        )
        self.sessions[session.session_id] = session
        return session

    def get_session(self, session_id: str) -> Optional[QuizSession]:
        session = self.sessions.get(session_id)
        if not session:
            return None
        # auto-cleanup expired sessions
        if time.time() - session.start_time > session.time_limit:
            del self.sessions[session_id]
            return None
        return session

    def submit_answer(self, session_id: str, question_id: str, answer: str) -> bool:
        session = self.get_session(session_id)
        if not session:
            return False
        for q in session.questions:
            if q.id == question_id and answer == q.correct_answer:
                session.score += 1
                return True
        return False

    def get_results(self, session_id: str) -> Dict:
        session = self.get_session(session_id)
        if not session:
            return {}
        return {
            "session_id": session.session_id,
            "video_id": session.video_id,
            "score": session.score,
            "total_questions": len(session.questions),
            "time_taken": time.time() - session.start_time
        }



# import os
# import json
# import uuid
# import time
# from typing import List, Dict, Optional
# from pydantic import BaseModel
# import openai

# # Configure OpenRouter in quiz module
# openai.api_key = os.getenv("OPENROUTER_API_KEY")
# openai.api_base = "https://openrouter.ai/api/v1"
# openai.api_type = "open_router"

# class QuizQuestion(BaseModel):
#     id: str
#     question: str
#     correct_answer: str
#     options: List[str]
#     frame_time: float

# class QuizSession(BaseModel):
#     session_id: str
#     video_id: str
#     questions: List[QuizQuestion]
#     current_question: int
#     start_time: float
#     time_limit: int
#     score: int

# async def ask_maverick_for_mcq(description: str) -> Dict:
#     prompt = f"""
# Scene description:
# "{description}"

# Generate a JSON with keys:
# - "question": concise MCQ about this scene
# - "correct_answer": the right answer
# - "options": list of four answers (1 correct + 3 plausible wrong)
# """
#     resp = await openai.ChatCompletion.acreate(
#         model="meta-llama/llama-4-maverick:free",
#         messages=[{"role": "user", "content": prompt}],
#         temperature=0.7,
#         max_tokens=150
#     )
#     return json.loads(resp.choices[0].message.content)

# class QuizManager:
#     def __init__(self):
#         self.sessions: Dict[str, QuizSession] = {}

#     async def generate_questions(
#         self,
#         video_frames: List[Dict],
#         num_questions: int = 5
#     ) -> List[QuizQuestion]:
#         questions: List[QuizQuestion] = []
#         for frame in video_frames[:num_questions]:
#             desc = frame["description"]
#             try:
#                 data = await ask_maverick_for_mcq(desc)
#                 q_text = data["question"]
#                 correct = data["correct_answer"]
#                 opts = data["options"]
#             except Exception:
#                 q_text = "What is happening in this scene?"
#                 correct = "cannot determine"
#                 opts = [correct, "nothing notable", "multiple activities", "scene unclear"]

#             questions.append(QuizQuestion(
#                 id=str(uuid.uuid4()),
#                 question=q_text,
#                 correct_answer=correct,
#                 options=opts,
#                 frame_time=frame.get('timestamp', 0.0)
#             ))
#         return questions

#     def create_session(self, video_id: str, questions: List[QuizQuestion], time_limit: int = 300) -> QuizSession:
#         session = QuizSession(
#             session_id=str(uuid.uuid4()),
#             video_id=video_id,
#             questions=questions,
#             current_question=0,
#             start_time=time.time(),
#             time_limit=time_limit,
#             score=0
#         )
#         self.sessions[session.session_id] = session
#         return session

#     def get_session(self, session_id: str) -> Optional[QuizSession]:
#         return self.sessions.get(session_id)

#     def submit_answer(self, session_id: str, question_id: str, answer: str) -> bool:
#         session = self.get_session(session_id)
#         if not session or (time.time() - session.start_time) > session.time_limit:
#             return False
#         for q in session.questions:
#             if q.id == question_id and answer == q.correct_answer:
#                 session.score += 1
#                 return True
#         return False

#     def get_results(self, session_id: str) -> Dict:
#         session = self.get_session(session_id)
#         if not session:
#             return {}
#         return {
#             "session_id": session.session_id,
#             "video_id": session.video_id,
#             "score": session.score,
#             "total_questions": len(session.questions),
#             "time_taken": time.time() - session.start_time
#         }