import React from "react";
import { Info, BarChart2, Cpu, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

export function ModelInfo() {
    return (
        <motion.div
            className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center mb-3">
                <Info className="w-5 h-5 mr-2 text-accent" />
                <h3 className="font-medium">Model Information</h3>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <div className="flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium mr-2">Model:</span>
                    <span>BLIP-VQA Base (ViT-B/16)</span>
                </div>

                <div className="flex items-center">
                    <BarChart2 className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium mr-2">Performance:</span>
                    <span>78.3% accuracy on VQA benchmark</span>
                </div>

                <div className="flex items-center">
                    <GitBranch className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium mr-2">Architecture:</span>
                    <span>Vision-Language Pretraining</span>
                </div>
            </div>

            <div className="mt-3 text-xs text-gray-500">
                <p>
                    BLIP (Bootstrapping Language-Image Pre-training) is a
                    vision-language model that excels at understanding images
                    and answering questions about them.
                </p>
                {/* <p className="mt-1 text-amber-500 dark:text-amber-400">
          Note: This demo uses a simulation. For a full experience with real video analysis, please contact us about our API access.
        </p> */}
            </div>
        </motion.div>
    );
}
