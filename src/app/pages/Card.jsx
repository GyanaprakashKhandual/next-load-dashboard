'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Gauge, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Activity,
  Network,
  BarChart2,
  Zap,
  Timer,
  GanttChart,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Card = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jwellary-backend-load-test-result.onrender.com/api/load-test-result');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-full"
      >
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 max-w-md rounded-lg">
          <p className="font-bold flex items-center">
            <AlertTriangle className="mr-2" /> Error
          </p>
          <p>{error}</p>
        </div>
      </motion.div>
    );
  }

  const getResultColor = (result) => {
    return result === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800';
  };

  const getResultIcon = (result) => {
    return result === 'pass' ? 
      <CheckCircle className="w-5 h-5 text-emerald-500" /> : 
      <XCircle className="w-5 h-5 text-rose-500" />;
  };

  const getTrendIcon = (value) => {
    const num = parseFloat(value);
    return num > 0 ? 
      <TrendingUp className="w-4 h-4 text-emerald-500" /> : 
      <TrendingDown className="w-4 h-4 text-rose-500" />;
  };

  return (
    <motion.div
      className="p-8 bg-gradient-to-r from-blue-50 via-white to-purple-100 dark:bg-gray-900 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex items-center mb-2">
          <Activity className="text-indigo-500 mr-3 w-8 h-8" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Load Test Dashboard
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 ml-11">
          Comprehensive performance metrics across different network conditions
        </p>
      </motion.div>

      {data.map((site, index) => (
        <motion.div 
          key={index}
          variants={itemVariants}
          className="mb-12"
        >
          <div className="flex items-center mb-6 ml-2">
            <Zap className="text-amber-400 mr-3 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {site.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {site.tests.map((test, testIndex) => (
              <motion.div
                key={testIndex}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Network className="w-6 h-6 text-indigo-500 mr-3" />
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                      {test.network}
                    </h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getResultColor(
                    test.metrics.status.result === 'pass' && test.metrics.responseTime.result === 'pass' ? 'pass' : 'fail'
                  )}`}>
                    {test.metrics.status.result === 'pass' && test.metrics.responseTime.result === 'pass' ? 
                      <CheckCircle className="w-4 h-4 mr-1" /> : 
                      <AlertTriangle className="w-4 h-4 mr-1" />}
                    {test.metrics.status.result === 'pass' && test.metrics.responseTime.result === 'pass' ? 'All Passed' : 'Some Failed'}
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Duration Section */}
                  <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Timer className="w-5 h-5 text-indigo-500 mr-2" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Duration Metrics</span>
                      </div>
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        Avg: {test.metrics.duration.avg}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white dark:bg-gray-600 p-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Min</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{test.metrics.duration.min}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-600 p-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Median</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{test.metrics.duration.med}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-600 p-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Max</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{test.metrics.duration.max}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-gray-600 p-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-300">90th Percentile</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{test.metrics.duration.p90}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-600 p-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-300">95th Percentile</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{test.metrics.duration.p95}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Response Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">Status</span>
                        </div>
                        {getResultIcon(test.metrics.status.result)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Pass Rate</span>
                          <span className={`font-semibold ${
                            test.metrics.status.result === 'pass' ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {test.metrics.status.passRate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Pass Count</span>
                          <span className="font-semibold text-gray-800 dark:text-white">
                            {test.metrics.status.passCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Fail Count</span>
                          <span className="font-semibold text-gray-800 dark:text-white">
                            {test.metrics.status.failCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <GanttChart className="w-5 h-5 text-purple-500 mr-2" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">Response Time</span>
                        </div>
                        {getResultIcon(test.metrics.responseTime.result)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Pass Rate</span>
                          <span className={`font-semibold ${
                            test.metrics.responseTime.result === 'pass' ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {test.metrics.responseTime.passRate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Pass Count</span>
                          <span className="font-semibold text-gray-800 dark:text-white">
                            {test.metrics.responseTime.passCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Fail Count</span>
                          <span className="font-semibold text-gray-800 dark:text-white">
                            {test.metrics.responseTime.failCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Badges */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                      <Gauge className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                        Avg Duration: {test.metrics.duration.avg}
                      </span>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full ${
                      test.metrics.status.result === 'pass' ? 
                      'bg-emerald-100 dark:bg-emerald-900/50' : 
                      'bg-rose-100 dark:bg-rose-900/50'
                    }`}>
                      {test.metrics.status.result === 'pass' ? 
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" /> : 
                        <XCircle className="w-4 h-4 text-rose-500 mr-1" />}
                      <span className={`text-xs font-medium ${
                        test.metrics.status.result === 'pass' ? 
                        'text-emerald-800 dark:text-emerald-200' : 
                        'text-rose-800 dark:text-rose-200'
                      }`}>
                        Status: {test.metrics.status.result.toUpperCase()}
                      </span>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full ${
                      test.metrics.responseTime.result === 'pass' ? 
                      'bg-emerald-100 dark:bg-emerald-900/50' : 
                      'bg-rose-100 dark:bg-rose-900/50'
                    }`}>
                      {test.metrics.responseTime.result === 'pass' ? 
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" /> : 
                        <XCircle className="w-4 h-4 text-rose-500 mr-1" />}
                      <span className={`text-xs font-medium ${
                        test.metrics.responseTime.result === 'pass' ? 
                        'text-emerald-800 dark:text-emerald-200' : 
                        'text-rose-800 dark:text-rose-200'
                      }`}>
                        Response: {test.metrics.responseTime.result.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {data.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center h-64"
        >
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No test results available</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Perform a load test to see metrics appear here
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Card;
