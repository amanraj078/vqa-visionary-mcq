import React, { useState, useEffect } from "react";
import { PageTransition } from "../components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VideoUploader } from "@/components/vqa/VideoUploader";
import { motion } from "framer-motion";
import {
    Play,
    CheckCircle,
    XCircle,
    Award,
    Clock,
    RefreshCw,
} from "lucide-react";
import { quizService } from "@/services/quizService";
import { toast } from "sonner";

const Quiz = () => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [sessionId, setSessionId] = useState<string>("");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [loading, setLoading] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleVideoSelected = (file: File) => {
        setVideoFile(file);
        toast.success(`Video "${file.name}" uploaded successfully!`);
    };

    const startQuiz = async () => {
        if (!videoFile) {
            toast.error("Please upload a video first!");
            return;
        }

        try {
            setLoading(true);
            setQuizStarted(false);
            setShowResult(false);
            const formData = new FormData();
            formData.append("video", videoFile);
            formData.append("num_questions", "5");
            formData.append("time_limit", "300");

            const response = await fetch(
                "http://localhost:8000/api/quiz/create",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create quiz: ${errorText}`);
            }

            const session = await response.json();
            if (
                !session ||
                !session.session_id ||
                !Array.isArray(session.questions)
            ) {
                throw new Error(
                    "Invalid quiz session response: " + JSON.stringify(session)
                );
            }

            setSessionId(session.session_id);
            setQuestions(session.questions);
            setCurrentQuestion(0);
            setScore(0);
            setTimeLeft(15);
            setQuizStarted(true);
            setShowResult(false);

            // Log for debugging
            console.log("Quiz session created:", {
                sessionId: session.session_id,
                questionCount: session.questions.length,
            });
        } catch (error) {
            console.error("Error starting quiz:", error);
            toast.error("Failed to create quiz. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = async (answerIndex: number) => {
        if (loading) return;

        setSelectedAnswer(answerIndex);
        setLoading(true);

        try {
            const result = await quizService.submitAnswer({
                sessionId,
                questionIndex: currentQuestion,
                selectedAnswer: answerIndex,
                selectedOption: questions[currentQuestion].options[answerIndex],
            });

            if (result.correct) {
                setScore(result.score);
            }

            setTimeout(() => {
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
                    setSelectedAnswer(null);
                    setTimeLeft(15);
                } else {
                    handleQuizEnd();
                }
            }, 1500);
        } catch (error) {
            console.error("Error submitting answer:", error);
            toast.error("Failed to submit answer");
        } finally {
            setLoading(false);
        }
    };

    const handleQuizEnd = async () => {
        try {
            if (sessionId) {
                const results = await quizService.getQuizResults(sessionId);
                setScore(results.finalScore);
            }
        } catch (error) {
            console.error("Error getting quiz results:", error);
            toast.error("Failed to get final results");
        } finally {
            setShowResult(true);
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (quizStarted && !showResult && selectedAnswer === null) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        if (currentQuestion < questions.length - 1) {
                            setCurrentQuestion(
                                (prevQuestion) => prevQuestion + 1
                            );
                            return 15;
                        } else {
                            handleQuizEnd();
                            return 0;
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [
        quizStarted,
        showResult,
        selectedAnswer,
        currentQuestion,
        questions.length,
    ]);

    return (
        <PageTransition>
            <div className="min-h-screen">
                <Navbar />
                <main className="pt-24 pb-20 px-6 md:px-10">
                    <motion.div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <motion.h1 className="text-3xl md:text-4xl font-bold mb-4">
                                Interactive Video Quiz
                            </motion.h1>
                            <motion.p className="text-xl text-gray-600 dark:text-gray-300">
                                Test your observation skills by answering
                                questions about video content
                            </motion.p>
                        </div>

                        {!quizStarted ? (
                            <motion.div className="space-y-8">
                                <h2 className="text-xl font-semibold mb-4">
                                    Step 1: Upload Your Video
                                </h2>
                                <VideoUploader
                                    onVideoSelected={handleVideoSelected}
                                />

                                <motion.div className="glass-card p-10 text-center">
                                    <h2 className="text-2xl font-semibold mb-4">
                                        Ready to test your observation skills?
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                                        Watch the video carefully, then take the
                                        quiz to see how much you noticed.
                                    </p>

                                    <button
                                        onClick={startQuiz}
                                        className="button-accent flex items-center gap-2 mx-auto"
                                    >
                                        <Play className="w-5 h-5" /> Start Quiz
                                    </button>
                                </motion.div>
                            </motion.div>
                        ) : showResult ? (
                            <motion.div className="glass-card p-10 text-center">
                                <Award className="w-10 h-10 mx-auto mb-6" />
                                <h2 className="text-2xl font-semibold mb-4">
                                    Quiz Results
                                </h2>
                                <p className="text-4xl font-bold text-accent mb-4">
                                    {score} / {questions.length}
                                </p>
                                <button
                                    onClick={startQuiz}
                                    className="button-accent flex items-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" /> Try Again
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div className="glass-card p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-sm font-medium text-gray-600">
                                        Question {currentQuestion + 1} of{" "}
                                        {questions.length}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Clock className="w-4 h-4" /> {timeLeft}{" "}
                                        seconds
                                    </div>
                                </div>

                                <h2 className="text-xl md:text-2xl font-semibold mb-6">
                                    {questions[currentQuestion]?.question}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {questions[currentQuestion]?.options.map(
                                        (option, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    handleAnswerSelect(index)
                                                }
                                                disabled={
                                                    selectedAnswer !== null
                                                }
                                            >
                                                {option}
                                            </button>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </main>
                <Footer />
            </div>
        </PageTransition>
    );
};

export default Quiz;
