import { motion } from "framer-motion";
import { useEffect } from "react";
import { QuizQuestion as QuizQuestionType } from "@/services/quizService";

interface QuizQuestionProps {
    question: QuizQuestionType;
    onAnswerSelect: (answerIndex: number) => void;
    selectedAnswer: number | null;
    timeLeft: number;
    questionNumber: number;
    totalQuestions: number;
    loading: boolean;
}

export const QuizQuestion = ({
    question,
    onAnswerSelect,
    selectedAnswer,
    timeLeft,
    questionNumber,
    totalQuestions,
    loading,
}: QuizQuestionProps) => {
    useEffect(() => {
        const progressBar = document.querySelector(".progress-bar");
        if (progressBar) {
            progressBar.classList.remove("animate-progress");
            void progressBar.offsetWidth;
            progressBar.classList.add("animate-progress");
        }
    }, [timeLeft]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">
                    Question {questionNumber} of {totalQuestions}
                </span>
                <span className="text-sm font-medium">Time: {timeLeft}s</span>
            </div>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="progress-bar h-full bg-accent transition-all duration-1000"
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-semibold mb-6"
            >
                {question.question}
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
                {question.options.map((option, index) => (
                    <motion.button
                        key={index}
                        onClick={() => !loading && onAnswerSelect(index)}
                        disabled={loading || selectedAnswer !== null}
                        className={`p-4 rounded-lg text-left transition-all ${
                            loading
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-accent/10"
                        } ${
                            selectedAnswer === index
                                ? option === question.correct_answer
                                    ? "bg-green-500/20 border-green-500"
                                    : "bg-red-500/20 border-red-500"
                                : "border-gray-200 dark:border-gray-700"
                        } border-2`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <span className="font-medium">{option}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
