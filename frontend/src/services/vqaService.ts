import { toast } from "sonner";

// Define types for our API requests and responses
export interface VQARequest {
    videoFile: File;
    question: string;
}

export interface VQAResponse {
    answer: string;
    confidence: number;
}

/**
 * Service to handle Visual Question Answering API requests
 */
export const vqaService = {
    /**
     * Process a video and question to get an answer using BLIP-VQA model
     */
    async processQuestion(request: VQARequest): Promise<VQAResponse> {
        try {
            // Log the request for debugging
            console.log("Sending VQA request:", {
                fileName: request.videoFile.name,
                fileSize: `${(request.videoFile.size / (1024 * 1024)).toFixed(
                    2
                )} MB`,
                fileType: request.videoFile.type,
                question: request.question,
            });

            // Create form data for the API request
            const formData = new FormData();
            formData.append("video", request.videoFile);
            formData.append("question", request.question);

            // Make the API call to the backend server
            const response = await fetch("http://localhost:8000/api/ask", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `API request failed with status ${response.status}: ${errorText}`
                );
            }

            const result = await response.json();

            // Validate the response format
            if (!result.answer) {
                throw new Error("Invalid response format from API");
            }

            return {
                answer: result.answer,
                confidence: 1.0, // Backend doesn't provide confidence yet
            };
        } catch (error) {
            console.error("Error processing VQA request:", error);
            toast.error("Error processing your request. Please try again.");
            throw error;
        }
    },
};
