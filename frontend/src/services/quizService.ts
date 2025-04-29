import { toast } from "sonner";

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct_answer: string;
    frame_time: number;
}

export interface QuizSession {
    sessionId: string;
    questions: QuizQuestion[];
    currentQuestion: number;
    timeLeft: number;
    score: number;
}

export interface QuizAnswer {
    sessionId: string;
    questionIndex: number;
    selectedAnswer: number;
    selectedOption: string;
}

export const quizService = {
    startQuiz: async (): Promise<QuizSession> => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/quiz/start",
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `API request failed with status ${response.status}: ${errorText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error("Error starting quiz:", error);
            toast.error("Error starting quiz. Please try again.");
            throw error;
        }
    },

    submitAnswer: async (
        answer: QuizAnswer
    ): Promise<{
        correct: boolean;
        score: number;
    }> => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/quiz/submit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        session_id: answer.sessionId,
                        question_id: `q${answer.questionIndex + 1}`,
                        answer: answer.selectedOption,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `API request failed with status ${response.status}: ${errorText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error("Error submitting answer:", error);
            toast.error("Error submitting answer. Please try again.");
            throw error;
        }
    },

    getQuizResults: async (
        sessionId: string
    ): Promise<{
        finalScore: number;
        totalQuestions: number;
    }> => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/quiz/results/${sessionId}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `API request failed with status ${response.status}: ${errorText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error("Error getting quiz results:", error);
            toast.error("Error getting quiz results. Please try again.");
            throw error;
        }
    },
};
