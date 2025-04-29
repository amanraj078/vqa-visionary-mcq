
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, Brain, MessageSquare } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Upload Video',
      description: 'Upload any video file or provide a URL to a video you want to analyze.',
      color: 'bg-blue-500',
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Ask a Question',
      description: 'Type in any question about the content, objects, actions, or context in the video.',
      color: 'bg-purple-500',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI Processing',
      description: 'Our advanced AI analyzes the video frame by frame and processes your question.',
      color: 'bg-orange-500',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Get Detailed Answer',
      description: 'Receive an accurate, contextual answer based on the visual content of your video.',
      color: 'bg-green-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block mb-4 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
              How It Works
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Simple Process, Powerful Results
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our platform makes it easy to extract valuable insights from any video content in just a few simple steps.
          </motion.p>
        </div>
        
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2 lg:hidden"></div>
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2 hidden lg:block"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white z-10 mb-4`}>
                  {step.icon}
                  <div className="absolute text-sm font-bold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white w-6 h-6 rounded-full flex items-center justify-center -top-1 -right-1">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a 
            href="/demo" 
            className="button-accent inline-flex items-center justify-center"
          >
            Try It Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
