
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';

interface ResultDisplayProps {
  question: string;
  answer: string;
  confidence: number;
  loading: boolean;
  processingStatus?: string;
}

export function ResultDisplay({ question, answer, confidence, loading, processingStatus }: ResultDisplayProps) {
  if (!question) return null;

  return (
    <motion.div
      className="w-full glass-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Question</p>
            <p className="text-lg font-medium">{question}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-accent animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-t-2 border-l-2 border-accent animate-spin" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{processingStatus || 'Analyzing video and processing your question...'}</p>
            
            {processingStatus && (
              <motion.div 
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <motion.div 
                  className="h-full bg-accent"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 3, 
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <div className="w-5 h-5 text-accent">AI</div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Answer</p>
                <p className="text-lg">{answer}</p>
                
                {confidence > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <span>Confidence:</span>
                      <span className="font-medium">{(confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${confidence * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-4 mt-4">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-accent transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">Helpful</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-accent transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm">Not helpful</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-accent transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
