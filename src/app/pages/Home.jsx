'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Wifi, 
  WifiOff,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  AlertCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  BarController
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  BarController
);

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/load-test-result');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      createCharts();
    }
  }, [data]);

  const createCharts = () => {
    // Clear existing charts
    Object.values(chartRefs.current).forEach(chart => {
      if (chart) chart.destroy();
    });
    chartRefs.current = {};

    data.forEach((site, siteIndex) => {
      site.tests.forEach((test, testIndex) => {
        const chartId = `pie-${siteIndex}-${testIndex}`;
        const ctx = document.getElementById(chartId);
        if (ctx) {
          chartRefs.current[chartId] = new ChartJS(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Pass', 'Fail'],
              datasets: [{
                data: [test.metrics.status.passCount, test.metrics.status.failCount],
                backgroundColor: ['#10b981', '#ef4444'],
                borderColor: ['#059669', '#dc2626'],
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: '#e5e7eb',
                    font: {
                      size: 12
                    }
                  }
                },
                tooltip: {
                  backgroundColor: '#1e293b',
                  titleColor: '#fff',
                  bodyColor: '#fff',
                  borderColor: '#475569',
                  borderWidth: 1
                }
              }
            }
          });
        }
      });

      // Create comparison chart
      const comparisonCtx = document.getElementById(`comparison-${siteIndex}`);
      if (comparisonCtx) {
        const comparisonData = site.tests.map(test => ({
          network: test.network,
          responseTimePass: parseInt(test.metrics.responseTime.passRate.replace('%', '')),
          statusPass: parseInt(test.metrics.status.passRate.replace('%', ''))
        }));

        chartRefs.current[`comparison-${siteIndex}`] = new ChartJS(comparisonCtx, {
          type: 'bar',
          data: {
            labels: comparisonData.map(d => d.network),
            datasets: [
              {
                label: 'Response Time Pass Rate %',
                data: comparisonData.map(d => d.responseTimePass),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1
              },
              {
                label: 'Status Pass Rate %',
                data: comparisonData.map(d => d.statusPass),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: '#e5e7eb'
                }
              },
              tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#475569',
                borderWidth: 1
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  color: '#9ca3af'
                },
                grid: {
                  color: '#374151'
                }
              },
              x: {
                ticks: {
                  color: '#9ca3af'
                },
                grid: {
                  color: '#374151'
                }
              }
            }
          }
        });
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const getNetworkIcon = (network) => {
    if (network.includes('35mbps')) return <Wifi className="w-5 h-5 text-green-400" />;
    if (network.includes('1mbps')) return <WifiOff className="w-5 h-5 text-red-400" />;
    return <Activity className="w-5 h-5 text-blue-400" />;
  };

  const getStatusColor = (result) => {
    return result === 'pass' ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (result) => {
    return result === 'pass' ? 
      <CheckCircle className="w-4 h-4 text-green-400" /> : 
      <XCircle className="w-4 h-4 text-red-400" />;
  };

  const getMetricTrend = (passRate) => {
    const rate = parseInt(passRate.replace('%', ''));
    return rate >= 80 ? 
      <TrendingUp className="w-4 h-4 text-green-400" /> : 
      <TrendingDown className="w-4 h-4 text-red-400" />;
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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-300">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto h-full"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Load Test Dashboard</h1>
          </div>
          <p className="text-gray-300">Real-time performance metrics and analysis</p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)] overflow-y-auto">
          {data.map((site, siteIndex) => (
            <motion.div
              key={siteIndex}
              variants={itemVariants}
              className="lg:col-span-3 space-y-6"
            >
              {/* Site Header */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white capitalize mb-4 flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-purple-400" />
                  <span>{site.name}</span>
                </h2>
                
                {/* Network Tests Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {site.tests.map((test, testIndex) => (
                    <motion.div
                      key={testIndex}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-slate-800/70 border border-slate-600/50 rounded-lg p-6 space-y-4"
                    >
                      {/* Network Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getNetworkIcon(test.network)}
                          <span className="text-lg font-medium text-white">{test.network}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(test.metrics.status.result)}
                          <span className={`text-sm font-medium ${getStatusColor(test.metrics.status.result)}`}>
                            {test.metrics.status.result.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Status Metrics */}
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-gray-300">Status</span>
                            </div>
                            {getMetricTrend(test.metrics.status.passRate)}
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {test.metrics.status.passRate}
                          </div>
                          <div className="text-xs text-gray-400">
                            {test.metrics.status.passCount} pass / {test.metrics.status.failCount} fail
                          </div>
                        </div>

                        {/* Response Time */}
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-gray-300">Response Time</span>
                            </div>
                            {getMetricTrend(test.metrics.responseTime.passRate)}
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {test.metrics.responseTime.passRate}
                          </div>
                          <div className="text-xs text-gray-400">
                            {test.metrics.responseTime.passCount} pass / {test.metrics.responseTime.failCount} fail
                          </div>
                        </div>
                      </div>

                      {/* Duration Stats */}
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-300">Duration Metrics</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-white font-semibold">{test.metrics.duration.avg}</div>
                            <div className="text-gray-400">Avg</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-semibold">{test.metrics.duration.med}</div>
                            <div className="text-gray-400">Median</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-semibold">{test.metrics.duration.max}</div>
                            <div className="text-gray-400">Max</div>
                          </div>
                        </div>
                      </div>

                      {/* Pie Chart */}
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <BarChart3 className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-gray-300">Pass/Fail Distribution</span>
                        </div>
                        <div className="h-40">
                          <canvas id={`pie-${siteIndex}-${testIndex}`} className="w-full h-full"></canvas>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Comparison Chart */}
                <motion.div
                  variants={itemVariants}
                  className="mt-6 bg-slate-800/70 border border-slate-600/50 rounded-lg p-6"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Network Performance Comparison</h3>
                  </div>
                  <div className="h-64">
                    <canvas id={`comparison-${siteIndex}`} className="w-full h-full"></canvas>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;