
import React, { useState } from 'react';
import { Send, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isDisabled: boolean;
}

export function QuestionInput({ onSubmit, isDisabled }: QuestionInputProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isDisabled) {
      onSubmit(question);
    }
  };

  const exampleQuestions = [
    "What is happening in this video?",
    "How many people are in the scene?",
    "What objects can be seen in the room?",
    "What is the weather like in this video?",
    "What actions is the person performing?",
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isDisabled}
          placeholder="Ask a question about the video..."
          className="w-full px-4 py-4 pr-12 border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        />
        <button
          type="submit"
          disabled={isDisabled || !question.trim()}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            isDisabled || !question.trim()
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-accent text-white hover:bg-accent/90'
          }`}
          aria-label="Submit question"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {!isDisabled && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <HelpCircle className="w-4 h-4 mr-2" />
            <span>Example questions you can ask:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((eq, index) => (
              <button
                key={index}
                onClick={() => setQuestion(eq)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {eq}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
