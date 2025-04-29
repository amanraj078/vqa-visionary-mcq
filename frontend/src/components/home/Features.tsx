
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Video, BarChart, Zap, FileQuestion, Users } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Advanced AI Understanding',
      description: 'Our model understands complex visual content and nuanced questions about videos.',
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'Frame-by-Frame Analysis',
      description: 'Analyzes video content frame by frame to extract detailed visual information.',
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: 'Detailed Analytics',
      description: 'Get insights into how the model interprets videos and answers questions.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Real-time Processing',
      description: 'Fast, responsive analysis that delivers answers in seconds.',
    },
    {
      icon: <FileQuestion className="w-6 h-6" />,
      title: 'Interactive Learning',
      description: 'Test your knowledge with our quiz platform based on video content.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Collaboration Tools',
      description: 'Share results and insights with your team or community.',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="features" className="py-20 px-6 md:px-10 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block mb-4 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
              Features
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Powerful Visual Intelligence
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our platform combines cutting-edge AI with an intuitive interface to deliver visual understanding capabilities for your video content.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="glass-card p-6 hover-scale"
            >
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
