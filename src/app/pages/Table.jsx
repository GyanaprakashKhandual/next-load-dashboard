'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  Gauge,
  BarChart2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedApi, setSelectedApi] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12; // 12 rows total including header, so 11 data rows

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

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const openSidebar = (api) => {
    setSelectedApi(api);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getStatusColor = (result) => {
    return result === 'pass' ? 'text-emerald-500' : 'text-rose-500';
  };

  const getStatusIcon = (result) => {
    return result === 'pass' ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );
  };

  // Flatten the data for pagination
  const flattenedData = data.flatMap((api, apiIndex) =>
    api.tests.map((test, testIndex) => ({
      api,
      test,
      rowIndex: `${apiIndex}-${testIndex}`,
    }))
  );

  // Calculate pagination
  const totalRows = flattenedData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = flattenedData.slice(startIndex, startIndex + rowsPerPage);

  // Handle page navigation
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setExpandedRow(null); // Reset expanded row on page change
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setExpandedRow(null); // Reset expanded row on page change
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen"
      >
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-purple-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr className=' '>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SL No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  API Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Network Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Clock className="mr-1 w-3 h-3" /> Min
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Gauge className="mr-1 w-3 h-3" /> Avg
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center">
                    <BarChart2 className="mr-1 w-3 h-3" /> Med
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-1 w-3 h-3" /> Max
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Passed %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.map(({ api, test, rowIndex }, index) => {
                const isExpanded = expandedRow === rowIndex;
                return (
                  <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      isExpanded ? 'bg-gray-50 dark:bg-gray-700' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {api.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {test.network}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {test.metrics.duration.min}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {test.metrics.duration.avg}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {test.metrics.duration.med}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {test.metrics.duration.max}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center ${getStatusColor(
                          test.metrics.status.result
                        )}`}
                      >
                        {getStatusIcon(test.metrics.status.result)}
                        <span className="ml-1 text-sm capitalize">
                          {test.metrics.status.result}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {test.metrics.status.passRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openSidebar({ api, test })}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 flex items-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View More
                        </button>
                        <button
                          onClick={() => toggleRow(rowIndex)}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 h-14">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md flex items-center ${
                currentPage === 1
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md flex items-center ${
                currentPage === totalPages
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar for detailed view */}
      <AnimatePresence>
        {sidebarOpen && selectedApi && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed top-0 right-0 w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Detailed Performance Metrics
                  </h2>
                  <button
                    onClick={closeSidebar}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {selectedApi.api.name} - {selectedApi.test.network}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                        selectedApi.test.metrics.status.result === 'pass'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200'
                      }`}
                    >
                      {selectedApi.test.metrics.status.result === 'pass' ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      Overall: {selectedApi.test.metrics.status.result.toUpperCase()}
                    </div>
                  </div>
                </div>

<div className="space-y-6">
  {/* Duration Metrics */}
  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
    <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3 flex items-center">
      <Clock className="mr-2 text-indigo-500" />
      Duration Metrics
    </h4>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Minimum
        </p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {selectedApi.test.metrics.duration.min}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Average
        </p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {selectedApi.test.metrics.duration.avg}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Median
        </p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {selectedApi.test.metrics.duration.med}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Maximum
        </p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {selectedApi.test.metrics.duration.max}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          90th Percentile
        </p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {selectedApi.test.metrics.duration.p90}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          95th Percentile
        </p>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {selectedApi.test.metrics.duration.p95}
        </p>
      </div>
    </div>
  </div>

                  {/* Status Metrics */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                      <CheckCircle className="mr-2 text-emerald-500" />
                      Status Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Pass Rate
                        </p>
                        <p
                          className={`text-lg font-semibold ${
                            selectedApi.test.metrics.status.result === 'pass'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {selectedApi.test.metrics.status.passRate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Pass Count
                        </p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {selectedApi.test.metrics.status.passCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Fail Count
                        </p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {selectedApi.test.metrics.status.failCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Result
                        </p>
                        <div className="flex items-center">
                          {getStatusIcon(selectedApi.test.metrics.status.result)}
                          <span className="ml-1 text-lg font-semibold capitalize">
                            {selectedApi.test.metrics.status.result}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Response Time Metrics */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                      <Gauge className="mr-2 text-purple-500" />
                      Response Time Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Pass Rate
                        </p>
                        <p
                          className={`text-lg font-semibold ${
                            selectedApi.test.metrics.responseTime.result === 'pass'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {selectedApi.test.metrics.responseTime.passRate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Pass Count
                        </p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {selectedApi.test.metrics.responseTime.passCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Fail Count
                        </p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {selectedApi.test.metrics.responseTime.failCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Result
                        </p>
                        <div className="flex items-center">
                          {getStatusIcon(
                            selectedApi.test.metrics.responseTime.result
                          )}
                          <span className="ml-1 text-lg font-semibold capitalize">
                            {selectedApi.test.metrics.responseTime.result}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Table;