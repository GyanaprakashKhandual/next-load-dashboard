'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  BarChart2,
  Clock,
  Zap,
  AlertCircle,
  Moon,
  Sun
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState({
    totalApis: 100,
    totalUserPerApi: 150,
    avgTime: '3.1s',
    avgPassRate: 90,
    avgAssertionPassRate: 90,
    avgMaxTime: '22s',
    avgMinTime: '2.1s',
    avgMedianTime: '5s',
    passed: 13500,
    failed: 1500,
    networks: [
      { name: '35mbps', passed: 9500, failed: 500 },
      { name: '1mbps', passed: 4000, failed: 1000 }
    ]
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Set theme colors based on dark mode
  const colors = darkMode ? {
    primary: 'linear-gradient(135deg, #6EE7B7, #059669)',
    secondary: 'linear-gradient(135deg, #1E3A8A, #1E40AF)',
    accent: 'linear-gradient(135deg, #FCA5A5, #EF4444)',
    chartPrimary: '#6EE7B7',
    chartAccent: '#FCA5A5',
    white: '#1F2937',
    background: 'linear-gradient(135deg, #111827, #1F2937)',
    cardBg: '#1F2937',
    border: '#374151',
    text: '#E5E7EB',
    textDark: '#F9FAFB',
    sky: 'linear-gradient(135deg, #1E40AF, #1E3A8A)'
  } : {
    primary: 'linear-gradient(135deg, #10B981, #047857)',
    secondary: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
    accent: 'linear-gradient(135deg, #EF4444, #B91C1C)',
    chartPrimary: '#10B981',
    chartAccent: '#EF4444',
    white: '#FFFFFF',
    background: 'linear-gradient(135deg, #F9FAFB, #E5E7EB)',
    cardBg: '#FFFFFF',
    border: '#E5E7EB',
    text: '#374151',
    textDark: '#1F2937',
    sky: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)'
  };

  const pieData = [
    { name: 'Passed', value: data.passed, color: colors.chartPrimary },
    { name: 'Failed', value: data.failed, color: colors.chartAccent }
  ];

  const barData = data.networks.map(network => ({
    name: network.name,
    Passed: network.passed,
    Failed: network.failed
  }));

  const totalTests = data.totalApis * data.totalUserPerApi;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const chartVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    show: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15
      }
    }
  };

  return (
    <div 
      className={`h-screen overflow-y-auto p-4 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}
      style={{ 
        background: colors.background,
        minHeight: '100vh'
      }}
    >

      <motion.div 
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="h-full flex flex-col"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
          {/* Total APIs */}
          <motion.div variants={itemVariants}>
            <Card 
              icon={<Activity className="w-6 h-6" />} 
              title="Total APIs" 
              value={data.totalApis} 
              colors={colors} 
              gradient={colors.secondary}
            />
          </motion.div>

          {/* Total Users */}
          <motion.div variants={itemVariants}>
            <Card 
              icon={<Zap className="w-6 h-6" />} 
              title="Total Users" 
              value={totalTests} 
              colors={colors} 
              gradient={colors.sky}
            />
          </motion.div>

          {/* Pass Rate */}
          <motion.div variants={itemVariants}>
            <Card 
              icon={<CheckCircle className="w-6 h-6" />} 
              title="Avg Pass Rate" 
              value={`${data.avgPassRate}%`} 
              colors={colors} 
              gradient={colors.secondary}
            />
          </motion.div>

          {/* Assertion Pass Rate */}
          <motion.div variants={itemVariants}>
            <Card 
              icon={<CheckCircle className="w-6 h-6" />} 
              title="Assertion Pass Rate" 
              value={`${data.avgAssertionPassRate}%`} 
              colors={colors} 
              gradient={colors.secondary}
            />
          </motion.div>

          {/* Avg Time */}
          <motion.div variants={itemVariants}>
            <Card 
              icon={<Clock className="w-6 h-6" />} 
              title="Avg Time" 
              value={data.avgTime} 
              colors={colors} 
              gradient={colors.sky}
            />
          </motion.div>

          {/* Avg Max */}
          <motion.div variants={itemVariants}>
            <Card 
              icon={<Clock className="w-6 h-6" />} 
              title="Max Time" 
              value={data.avgMaxTime} 
              colors={colors} 
              gradient={colors.sky}
            />
          </motion.div>

          {/* Avg Min */}
          <motion.div variants={itemVariants}>
            <Card 
              icon={<Clock className="w-6 h-6" />} 
              title="Min Time" 
              value={data.avgMinTime} 
              colors={colors} 
              gradient={colors.sky}
            />
          </motion.div>

          {/* Avg Median */}
          <motion.div variants={itemVariants}>
            <Card 
              icon={<Clock className="w-6 h-6" />} 
              title="Median Time" 
              value={data.avgMedianTime} 
              colors={colors} 
              gradient={colors.sky}
            />
          </motion.div>

          {/* Pie Chart */}
          <motion.div 
            variants={chartVariants}
            className="col-span-1 md:col-span-2"
          >
            <div className="h-full p-6 rounded-xl shadow-lg" style={{ 
              backgroundColor: colors.cardBg, 
              border: `1px solid ${colors.border}`,
            }}>
              <h3 className="font-medium mb-4 text-lg" style={{ color: colors.textDark }}>Overall Test Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={80}
                    animationBegin={200}
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                      borderRadius: '0.5rem',
                      color: colors.text
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: colors.text
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div 
            variants={chartVariants}
            className="col-span-1 md:col-span-2"
          >
            <div className="h-full p-6 rounded-xl shadow-lg" style={{ 
              backgroundColor: colors.cardBg, 
              border: `1px solid ${colors.border}`,
            }}>
              <h3 className="font-medium mb-4 text-lg" style={{ color: colors.textDark }}>Network Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis 
                    dataKey="name" 
                    stroke={colors.text} 
                    tick={{ fill: colors.text }}
                  />
                  <YAxis 
                    stroke={colors.text} 
                    tick={{ fill: colors.text }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                      borderRadius: '0.5rem',
                      color: colors.text
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: colors.text
                    }}
                  />
                  <Bar 
                    dataKey="Passed" 
                    fill={colors.chartPrimary} 
                    animationBegin={200}
                    animationDuration={1000}
                  />
                  <Bar 
                    dataKey="Failed" 
                    fill={colors.chartAccent} 
                    animationBegin={200}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const Card = ({ icon, title, value, colors, gradient }) => (
  <motion.div 
    className="h-full p-6 rounded-xl shadow-lg flex flex-col"
    style={{ 
      background: gradient,
      border: `1px solid ${colors.border}`,
    }}
    whileHover={{
      y: -5,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 }
    }}
  >
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 rounded-full" style={{
        backgroundColor: colors.white,
        opacity: 0.3
      }}>
        {icon}
      </div>
      <h3 className="font-medium text-lg" style={{ color: colors.textDark }}>{title}</h3>
    </div>
    <motion.p 
      className="text-3xl font-bold mt-auto"
      style={{ color: colors.textDark }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {value}
    </motion.p>
  </motion.div>
);

export default Home;