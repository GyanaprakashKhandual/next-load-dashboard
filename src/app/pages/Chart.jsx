'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar,
  Legend
} from 'recharts';
import { 
  Activity, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, 
  Wifi, Signal, Globe, Zap, AlertTriangle, Target, RefreshCw
} from 'lucide-react';

const Chart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://jwellary-backend-load-test-result.onrender.com/api/load-test-result');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      // Extract the tests array from each site object
      const allTests = result.flatMap(site => site.tests);
      setData(allTests);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Transform data for charts
  const transformedData = data.map(item => ({
    network: item.network,
    avgDuration: parseFloat(item.metrics.duration.avg.replace('ms', '').replace('s', '')) * 
      (item.metrics.duration.avg.includes('s') ? 1000 : 1),
    maxDuration: parseFloat(item.metrics.duration.max.replace('ms', '').replace('s', '')) * 
      (item.metrics.duration.max.includes('s') ? 1000 : 1),
    minDuration: parseFloat(item.metrics.duration.min.replace('ms', '').replace('s', '')) * 
      (item.metrics.duration.min.includes('s') ? 1000 : 1),
    medDuration: parseFloat(item.metrics.duration.med.replace('ms', '').replace('s', '')) * 
      (item.metrics.duration.med.includes('s') ? 1000 : 1),
    p90Duration: parseFloat(item.metrics.duration.p90.replace('ms', '').replace('s', '')) * 
      (item.metrics.duration.p90.includes('s') ? 1000 : 1),
    p95Duration: parseFloat(item.metrics.duration.p95.replace('ms', '').replace('s', '')) * 
      (item.metrics.duration.p95.includes('s') ? 1000 : 1),
    statusPassRate: parseInt(item.metrics.status.passRate.replace('%', '')),
    responsePassRate: parseInt(item.metrics.responseTime.passRate.replace('%', '')),
    passCount: item.metrics.status.passCount,
    failCount: item.metrics.status.failCount,
    totalRequests: item.metrics.status.passCount + item.metrics.status.failCount,
    statusResult: item.metrics.status.result,
    responseResult: item.metrics.responseTime.result
  }));

  // Pie chart data for pass/fail status
  const pieData = data.flatMap(item => [
    {
      name: `${item.network} - Pass`,
      value: item.metrics.status.passCount,
      network: item.network,
      type: 'pass'
    },
    {
      name: `${item.network} - Fail`,
      value: item.metrics.status.failCount,
      network: item.network,
      type: 'fail'
    }
  ]);

  // Duration comparison data
  const durationData = transformedData.map(item => ({
    network: item.network,
    avg: item.avgDuration,
    min: item.minDuration,
    max: item.maxDuration,
    p90: item.p90Duration,
    p95: item.p95Duration
  }));

  // Performance metrics for radial chart
  const performanceData = transformedData.map(item => ({
    network: item.network,
    statusPass: item.statusPassRate,
    responsePass: item.responsePassRate
  }));

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  const GRADIENT_COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-900/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 text-center"
        >
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-300 mb-2">Error Loading Data</h2>
          <p className="text-red-200 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Load Test Dashboard
          </h1>
          <p className="text-slate-300 text-lg">Real-time performance monitoring and analytics</p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {transformedData.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Signal className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{item.network}</span>
                </div>
                <div className={`p-2 rounded-full ${
                  item.statusResult === 'pass' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {item.statusResult === 'pass' ? 
                    <CheckCircle className="w-4 h-4 text-green-400" /> : 
                    <XCircle className="w-4 h-4 text-red-400" />
                  }
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Duration</span>
                  <span className="text-white font-mono">{(item.avgDuration / 1000).toFixed(2)}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pass Rate</span>
                  <span className="text-white font-mono">{item.statusPassRate}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Duration Bar Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Response Duration Analysis</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="network" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value) => [`${(value / 1000).toFixed(2)}s`, 'Duration']}
                />
                <Bar dataKey="avg" fill="#8b5cf6" name="Average" radius={[4, 4, 0, 0]} />
                <Bar dataKey="p90" fill="#06b6d4" name="P90" radius={[4, 4, 0, 0]} />
                <Bar dataKey="p95" fill="#10b981" name="P95" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pass/Fail Pie Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Success Rate Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'pass' ? '#10b981' : '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Radial Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Performance Metrics</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart 
                innerRadius="10%" 
                outerRadius="80%" 
                data={performanceData}
                startAngle={180}
                endAngle={-180}
              >
                <RadialBar 
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  clockWise
                  dataKey="statusPass" 
                  name="Status Pass Rate"
                  fill="#8b5cf6" 
                />
                <RadialBar 
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  clockWise
                  dataKey="responsePass" 
                  name="Response Pass Rate"
                  fill="#06b6d4" 
                />
                <Legend 
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value) => [`${value}%`, 'Pass Rate']}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Duration Trend Area Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Duration Range Analysis</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="network" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value) => [`${(value / 1000).toFixed(2)}s`, 'Duration']}
                />
                <Area type="monotone" dataKey="max" name="Max" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                <Area type="monotone" dataKey="avg" name="Average" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="min" name="Min" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Refresh Button */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-8"
        >
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full flex items-center gap-3 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Chart;