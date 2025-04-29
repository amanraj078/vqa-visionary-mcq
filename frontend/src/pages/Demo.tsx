import { useState } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VideoUploader } from "@/components/vqa/VideoUploader";
import { QuestionInput } from "@/components/vqa/QuestionInput";
import { ResultDisplay } from "@/components/vqa/ResultDisplay";
import { ModelInfo } from "@/components/vqa/ModelInfo";
import { motion } from "framer-motion";
import { vqaService } from "@/services/vqaService";
import { toast } from "sonner";

const Demo = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [confidence, setConfidence] = useState(0);
    const [loading, setLoading] = useState(false);
    const [processingStatus, setProcessingStatus] = useState("");

    const handleVideoSelected = (file: File) => {
        setVideoFile(file);
        // Reset other states when a new video is uploaded
        setQuestion("");
        setAnswer("");
        setConfidence(0);
        toast.success(`Video "${file.name}" uploaded successfully!`);
    };

    const handleQuestionSubmit = async (q: string) => {
        if (!videoFile) {
            toast.error("Please upload a video first!");
            return;
        }

        setQuestion(q);
        setLoading(true);
        setProcessingStatus("Initializing BLIP-VQA model...");

        try {
            // Simulate model initialization
            await new Promise((resolve) => setTimeout(resolve, 800));
            setProcessingStatus("Processing video frames...");

            // Simulate frame extraction
            await new Promise((resolve) => setTimeout(resolve, 600));
            setProcessingStatus("Analyzing question context...");

            // Call the VQA service
            const result = await vqaService.processQuestion({
                videoFile,
                question: q,
            });

            setProcessingStatus("Generating response...");
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Update state with the response
            setAnswer(result.answer);
            setConfidence(result.confidence);

            toast.success("Analysis complete!");
        } catch (error) {
            console.error("Error in VQA process:", error);
            toast.error("Failed to process your question. Please try again.");
        } finally {
            setLoading(false);
            setProcessingStatus("");
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen">
                <Navbar />
                <main className="pt-24 pb-20 px-6 md:px-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <motion.h1
                                className="text-3xl md:text-4xl font-bold mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                Visual Question Answering Demo
                            </motion.h1>
                            <motion.p
                                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                Upload a video and ask questions about its
                                content. Our AI will analyze the video and
                                provide accurate answers.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <h2 className="text-xl font-semibold mb-4">
                                        Step 1: Upload Your Video
                                    </h2>
                                    <VideoUploader
                                        onVideoSelected={handleVideoSelected}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <h2 className="text-xl font-semibold mb-4">
                                        Step 2: Ask a Question
                                    </h2>
                                    <QuestionInput
                                        onSubmit={handleQuestionSubmit}
                                        isDisabled={!videoFile || loading}
                                    />
                                </motion.div>

                                <ModelInfo />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <h2 className="text-xl font-semibold mb-4">
                                    Results
                                </h2>
                                {question ? (
                                    <ResultDisplay
                                        question={question}
                                        answer={answer}
                                        confidence={confidence}
                                        loading={loading}
                                        processingStatus={processingStatus}
                                    />
                                ) : (
                                    <div className="glass-card p-8 flex flex-col items-center justify-center text-center h-80">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                            <span className="text-2xl">?</span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            No Question Yet
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                            Upload a video and ask a question to
                                            see the AI-generated answer here
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </PageTransition>
    );
};

export default Demo;
