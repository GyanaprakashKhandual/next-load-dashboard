'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  CreditCard,
  PieChart,
  Bug,
  Sheet,
  TrendingUp,
  User,
  Lightbulb,
  Filter,
  RotateCcw,
  Download,
  Search,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FaHome, FaMoon, FaSun, FaFileExport } from 'react-icons/fa';
import Home from '../pages/Home';
import Card from '../pages/Card';
import TableView from '../pages/Table';
import ChartView from '../pages/Chart';

const Sidebar = () => {
  // State declarations that don't depend on sidebarItems
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [networkType, setNetworkType] = useState([]);
  const [assertionStatus, setAssertionStatus] = useState([]);
  const [testStatus, setTestStatus] = useState([]);
  const [avgTimeRange, setAvgTimeRange] = useState([0, 10]);
  const [expandedSection, setExpandedSection] = useState(null);

  // Function declarations that are used in sidebarItems
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      const contentElement = document.querySelector('[data-table-view]') || 
                            document.querySelector('table') || 
                            document.querySelector('.table-container') ||
                            document.querySelector('.main-content') ||
                            document.body;
      
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: ${contentElement.scrollWidth}px;
        background-color: ${darkMode ? '#1f2937' : '#ffffff'};
        padding: 20px;
        font-family: Arial, sans-serif;
        color: ${darkMode ? '#ffffff' : '#000000'};
      `;
      
      const header = document.createElement('div');
      header.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px; ${darkMode ? 'color: #ffffff' : 'color: #000000'}">
          <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 10px 0; ${darkMode ? 'color: #10b981' : 'color: #059669'}">
            Full Report
          </h1>
          <p style="font-size: 14px; margin: 0; ${darkMode ? 'color: #d1d5db' : 'color: #6b7280'}">
            Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      `;
      
      const pdfWrapper = document.createElement('div');
      pdfWrapper.style.cssText = `
        background: ${darkMode ? '#1f2937' : '#ffffff'};
        color: ${darkMode ? '#ffffff' : '#000000'};
        font-family: Arial, sans-serif;
        width: 100%;
      `;
      
      pdfWrapper.appendChild(header);
      const clonedContent = contentElement.cloneNode(true);
      clonedContent.style.cssText = `
        width: 100%;
        background: ${darkMode ? '#1f2937' : '#ffffff'};
        color: ${darkMode ? '#ffffff' : '#000000'};
        font-family: Arial, sans-serif;
      `;
      
      const cleanElement = (element) => {
        try {
          if (element.hasAttribute('class')) {
            element.removeAttribute('class');
          }
          
          if (element.hasAttribute('style')) {
            const style = element.getAttribute('style');
            if (style.includes('transform') || style.includes('transition')) {
              element.removeAttribute('style');
            }
          }
          
          element.style.color = darkMode ? '#ffffff' : '#000000';
          element.style.backgroundColor = element.style.backgroundColor || 'transparent';
          
          for (let i = element.style.length - 1; i >= 0; i--) {
            const prop = element.style[i];
            if (prop.startsWith('--')) {
              element.style.removeProperty(prop);
            }
          }
        } catch (e) {
          console.warn('Error cleaning element:', e);
        }
        
        if (element.children) {
          Array.from(element.children).forEach(cleanElement);
        }
      };
      
      cleanElement(clonedContent);
      pdfWrapper.appendChild(clonedContent);
      tempContainer.appendChild(pdfWrapper);
      document.body.appendChild(tempContainer);
      
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        width: tempContainer.scrollWidth,
        height: tempContainer.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: tempContainer.scrollWidth,
        windowHeight: tempContainer.scrollHeight,
        ignoreElements: (element) => {
          return element.tagName === 'STYLE' || element.tagName === 'SCRIPT';
        }
      });
      
      const pdf = new jsPDF({
        orientation: tempContainer.scrollWidth > tempContainer.scrollHeight ? 'landscape' : 'portrait',
        unit: 'mm'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(darkMode ? '#9ca3af' : '#6b7280');
        pdf.text(
          `Page ${i} of ${pageCount} | Full Report`,
          pdfWidth / 2,
          pdfHeight - 10,
          { align: 'center' }
        );
      }
      
      pdf.save(`full-report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.removeChild(tempContainer);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Define sidebarItems after all the functions it uses are defined
  const sidebarItems = [
    { icon: FaHome, label: 'Home', component: <Home /> },
    { icon: Table, label: 'Table View', component: <TableView /> },
    { icon: CreditCard, label: 'Card View', component: <Card /> },
    { icon: PieChart, label: 'Chart View', component: <ChartView /> },
    { icon: Bug, label: 'Bugs', component: <Home /> },
    {
      icon: FaFileExport, 
      label: 'Download PDF', 
      component: <Home />, 
      action: generatePDF,
      isLoading: isGeneratingPDF 
    },
    { icon: Sheet, label: 'Documentation', component: <Home /> },
    { icon: TrendingUp, label: 'Comments', component: <Home /> },
    { icon: User, label: 'Project', component: <Home /> },
    { icon: Lightbulb, label: 'Suggestions', component: <Home /> },
    { 
      icon: Filter, 
      label: 'Filter',
      action: toggleFilter
    },
    { 
      icon: darkMode ? FaSun : FaMoon, 
      label: darkMode ? 'Light Mode' : 'Dark Mode',
      action: toggleDarkMode
    },
    { icon: RotateCcw, label: 'Refresh' },
  ];

  // Now define state that uses sidebarItems
  const [activeIndex, setActiveIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedIndex = localStorage.getItem('sidebarActiveIndex');
      return savedIndex ? parseInt(savedIndex) : 0;
    }
    return 0;
  });

  const [currentComponent, setCurrentComponent] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedIndex = localStorage.getItem('sidebarActiveIndex');
      const index = savedIndex ? parseInt(savedIndex) : 0;
      return sidebarItems[index]?.component || <Home />;
    }
    return <Home />;
  });

  // Constants
  const networkTypes = ['35mbps', '1mbps', '100mbps', '10mbps', '5mbps'];
  const assertionStatuses = ['passed', 'failed', 'pending'];
  const testStatuses = ['pass', 'fail', 'running', 'queued'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: 'easeOut'
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  const iconVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2, ease: 'easeInOut' }
    },
    tap: { scale: 0.95 }
  };

  const tooltipVariants = {
    hidden: { opacity: 0, x: -10, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const themeIconVariants = {
    moon: { rotate: 0, scale: 1 },
    sun: { rotate: 360, scale: 1.1 },
    transition: { duration: 0.5, ease: "easeInOut" }
  };

  const loadingVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Handle network type selection
  const handleNetworkType = (type) => {
    setNetworkType(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Handle assertion status selection
  const handleAssertionStatus = (status) => {
    setAssertionStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Handle test status selection
  const handleTestStatus = (status) => {
    setTestStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  // Check for user's preferred color scheme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, []);

  // Apply filters
  const applyFilters = () => {
    console.log('Filters applied:', {
      searchQuery,
      networkType,
      assertionStatus,
      testStatus,
      avgTimeRange
    });
    setFilterOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setNetworkType([]);
    setAssertionStatus([]);
    setTestStatus([]);
    setAvgTimeRange([0, 10]);
  };

  const handleItemClick = (index) => {
    const item = sidebarItems[index];
    
    if (item.label !== 'Analysis') {
      setActiveIndex(index);
      localStorage.setItem('sidebarActiveIndex', index.toString());
    }
    
    if (item.action) {
      item.action();
    } else if (item.component) {
      setCurrentComponent(item.component);
    }
  };

  // Rest of your component code...
  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Main Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-screen w-[60px] ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800' 
            : 'bg-gradient-to-r from-blue-50 via-white to-purple-100'
        } z-40 overflow-visible`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col py-4 space-y-2 user-select-none">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index;
            const isLoading = item.isLoading;

            return (
              <motion.div
                key={index}
                className="relative group"
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                initial="rest"
                animate="rest"
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <motion.button
                  className={`w-full h-12 flex items-center justify-center relative overflow-visible ${
                    isLoading ? 'cursor-not-allowed opacity-75' : ''
                  }`}
                  onClick={() => !isLoading && handleItemClick(index)}
                  disabled={isLoading}
                >
                  <motion.div
                    className={`absolute left-0 top-0 h-full w-1 rounded-r-full ${
                      darkMode ? 'bg-green-400' : 'bg-green-500'
                    }`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />

                  <motion.div
                    className="relative z-10"
                    variants={
                      item.label.includes('Mode') 
                        ? themeIconVariants 
                        : isLoading 
                        ? loadingVariants 
                        : iconVariants
                    }
                    animate={
                      item.label.includes('Mode') 
                        ? darkMode ? 'sun' : 'moon'
                        : isLoading 
                        ? 'rotate' 
                        : undefined
                    }
                  >
                    {isLoading ? (
                      <Download
                        size={20}
                        className={`transition-colors duration-200 ${
                          darkMode ? 'text-green-300' : 'text-green-700'
                        }`}
                      />
                    ) : (
                      <Icon
                        size={20}
                        className={`transition-colors duration-200 ${
                          isActive
                            ? darkMode 
                              ? 'text-green-300' 
                              : 'text-green-700'
                            : darkMode
                              ? 'text-gray-300 group-hover:text-green-300'
                              : 'text-green-500 group-hover:text-green-700'
                        }`}
                      />
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        variants={tooltipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute left-16 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
                      >
                        <div className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-xl ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600' 
                            : 'bg-white border-gray-300'
                        } border whitespace-nowrap`}>
                          <span className={`${
                            darkMode ? 'text-green-300' : 'text-green-700'
                          } font-semibold`}>
                            {isLoading ? 'Generating PDF...' : item.label}
                          </span>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white dark:border-r-gray-800" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Filter Sidebar */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed left-[60px] top-0 h-screen w-[300px] z-30 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-xl border-r ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${
                  darkMode ? 'text-green-300' : 'text-green-600'
                }`}>
                  Filters
                </h2>
                <button
                  onClick={toggleFilter}
                  className={`p-2 rounded-full ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                </button>
              </div>

              <div className="mb-6">
                <div className={`relative flex items-center rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                } px-3 py-2`}>
                  <Search size={18} className={`mr-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full bg-transparent outline-none ${
                      darkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Network Type */}
                <div className="mb-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('network')}
                  >
                    <h3 className={`font-semibold ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Network Type
                    </h3>
                    {expandedSection === 'network' ? (
                      <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    ) : (
                      <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {expandedSection === 'network' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 space-y-2"
                      >
                        {networkTypes.map((type) => (
                          <div key={type} className="flex items-center">
                            <button
                              onClick={() => handleNetworkType(type)}
                              className={`w-5 h-5 rounded mr-2 flex items-center justify-center ${
                                networkType.includes(type)
                                  ? darkMode
                                    ? 'bg-green-400 border-green-400'
                                    : 'bg-green-500 border-green-500'
                                  : darkMode
                                    ? 'border-gray-500 border'
                                    : 'border-gray-300 border'
                              }`}
                            >
                              {networkType.includes(type) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`w-2 h-2 rounded-full ${
                                    darkMode ? 'bg-gray-800' : 'bg-white'
                                  }`}
                                />
                              )}
                            </button>
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {type}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Assertion Status */}
                <div className="mb-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('assertion')}
                  >
                    <h3 className={`font-semibold ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Assertion Status
                    </h3>
                    {expandedSection === 'assertion' ? (
                      <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    ) : (
                      <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {expandedSection === 'assertion' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 space-y-2"
                      >
                        {assertionStatuses.map((status) => (
                          <div key={status} className="flex items-center">
                            <button
                              onClick={() => handleAssertionStatus(status)}
                              className={`w-5 h-5 rounded mr-2 flex items-center justify-center ${
                                assertionStatus.includes(status)
                                  ? status === 'passed'
                                    ? darkMode
                                      ? 'bg-green-400 border-green-400'
                                      : 'bg-green-500 border-green-500'
                                    : status === 'failed'
                                      ? darkMode
                                        ? 'bg-red-400 border-red-400'
                                        : 'bg-red-500 border-red-500'
                                      : darkMode
                                        ? 'bg-yellow-400 border-yellow-400'
                                        : 'bg-yellow-500 border-yellow-500'
                                  : darkMode
                                    ? 'border-gray-500 border'
                                    : 'border-gray-300 border'
                              }`}
                            >
                              {assertionStatus.includes(status) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`w-2 h-2 rounded-full ${
                                    darkMode ? 'bg-gray-800' : 'bg-white'
                                  }`}
                                />
                              )}
                            </button>
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Test Status */}
                <div className="mb-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('test')}
                  >
                    <h3 className={`font-semibold ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Test Status
                    </h3>
                    {expandedSection === 'test' ? (
                      <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    ) : (
                      <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {expandedSection === 'test' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 space-y-2"
                      >
                        {testStatuses.map((status) => (
                          <div key={status} className="flex items-center">
                            <button
                              onClick={() => handleTestStatus(status)}
                              className={`w-5 h-5 rounded mr-2 flex items-center justify-center ${
                                testStatus.includes(status)
                                  ? status === 'pass'
                                    ? darkMode
                                      ? 'bg-green-400 border-green-400'
                                      : 'bg-green-500 border-green-500'
                                    : status === 'fail'
                                      ? darkMode
                                        ? 'bg-red-400 border-red-400'
                                        : 'bg-red-500 border-red-500'
                                      : status === 'running'
                                        ? darkMode
                                          ? 'bg-blue-400 border-blue-400'
                                          : 'bg-blue-500 border-blue-500'
                                        : darkMode
                                          ? 'bg-purple-400 border-purple-400'
                                          : 'bg-purple-500 border-purple-500'
                                  : darkMode
                                    ? 'border-gray-500 border'
                                    : 'border-gray-300 border'
                              }`}
                            >
                              {testStatus.includes(status) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`w-2 h-2 rounded-full ${
                                    darkMode ? 'bg-gray-800' : 'bg-white'
                                  }`}
                                />
                              )}
                            </button>
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Average Time Range */}
                <div className="mb-6">
                  <h3 className={`font-semibold mb-3 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Average Time (seconds)
                  </h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={avgTimeRange[1]}
                      onChange={(e) => setAvgTimeRange([avgTimeRange[0], parseFloat(e.target.value)])}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}
                    />
                    <div className="flex justify-between mt-1">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        0s
                      </span>
                      <span className={`text-xs font-medium ${
                        darkMode ? 'text-green-300' : 'text-green-600'
                      }`}>
                        {avgTimeRange[1]}s
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={resetFilters}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } transition-colors`}
                >
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
                    darkMode
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  } transition-colors`}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className={`flex-1 ml-[60px] ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {currentComponent}
      </div>
    </div>
  );
};

export default Sidebar;