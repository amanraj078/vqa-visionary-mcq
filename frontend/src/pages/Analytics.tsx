import React, { useState } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Calendar, Filter, DownloadCloud } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts
  const modelAccuracyData = [
    { name: 'Jan', accuracy: 84 },
    { name: 'Feb', accuracy: 85 },
    { name: 'Mar', accuracy: 87 },
    { name: 'Apr', accuracy: 89 },
    { name: 'May', accuracy: 91 },
    { name: 'Jun', accuracy: 93 },
    { name: 'Jul', accuracy: 94 },
  ];

  const questionTypeData = [
    { name: 'What', value: 35 },
    { name: 'Who', value: 20 },
    { name: 'Where', value: 15 },
    { name: 'When', value: 10 },
    { name: 'Why', value: 10 },
    { name: 'How', value: 10 },
  ];

  const videoContentData = [
    { name: 'People', value: 40 },
    { name: 'Objects', value: 25 },
    { name: 'Actions', value: 20 },
    { name: 'Scenes', value: 15 },
  ];

  const usageData = [
    { name: 'Week 1', queries: 120 },
    { name: 'Week 2', queries: 140 },
    { name: 'Week 3', queries: 180 },
    { name: 'Week 4', queries: 220 },
    { name: 'Week 5', queries: 280 },
    { name: 'Week 6', queries: 350 },
    { name: 'Week 7', queries: 390 },
    { name: 'Week 8', queries: 420 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'performance', label: 'Model Performance' },
    { id: 'usage', label: 'Usage Statistics' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-20 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold">Analytics & Insights</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Detailed analytics about model performance and usage patterns
                </p>
              </motion.div>
              
              <motion.div 
                className="flex space-x-4 mt-4 md:mt-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>Last 30 days</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <DownloadCloud className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </motion.div>
            </div>
            
            <motion.div 
              className="mb-8 border-b border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex space-x-4 overflow-x-auto scrollbar-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-accent text-accent'
                        : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>
            
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Model Accuracy Over Time</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={modelAccuracyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[80, 100]} />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="accuracy" 
                          stroke="#3b82f6" 
                          fill="url(#colorAccuracy)" 
                          activeDot={{ r: 8 }} 
                        />
                        <defs>
                          <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Question Types Distribution</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={questionTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {questionTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Video Content Analysis</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={videoContentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                          {videoContentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Usage Growth</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={usageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="queries" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            )}
            
            {/* Other tabs content would go here */}
            {activeTab !== 'overview' && (
              <div className="glass-card p-16 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
                <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
                  We're still working on this section. Check back soon for more detailed analytics!
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Analytics;
