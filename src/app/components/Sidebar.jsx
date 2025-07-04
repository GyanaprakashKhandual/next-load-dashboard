'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  CreditCard,
  PieChart,
  Bug,
  BarChart3,
  Sheet,
  TrendingUp,
  User,
  Lightbulb,
  Filter,
  RotateCcw
} from 'lucide-react';
import { FaHome, FaMoon, FaSun, FaScrewdriver } from 'react-icons/fa';
import Home from '../pages/Home';
import Card from '../pages/Card';
// import Home from './pages/Home';
// import TableView from './pages/TableView';
// import CardView from './pages/CardView';
// import PieChartView from './pages/PieChartView';
// import Bugs from './pages/Bugs';
// import Analysis from './pages/Analysis';
// import Documentation from './pages/Documentation';
// import Comments from './pages/Comments';
// import Project from './pages/Project';
// import Suggestions from './pages/Suggestions';

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(<Home />);

  // Check for user's preferred color scheme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const sidebarItems = [
    { icon: FaHome, label: 'Home', component: <Home /> },
    { icon: Table, label: 'Table View', component: <Home /> },
    { icon: CreditCard, label: 'Card View', component: <Card/> },
    { icon: PieChart, label: 'Pie Chart View', component: <Home /> },
    { icon: Bug, label: 'Bugs', component: <Home /> },
    { icon: BarChart3, label: 'Analysis', component: <Home  /> },
    { icon: Sheet, label: 'Documentation', component: <Home/> },
    { icon: TrendingUp, label: 'Comments', component: <Home /> },
    { icon: User, label: 'Project', component: <Home /> },
    { icon: Lightbulb, label: 'Suggestions', component: <Home  /> },
    { icon: Filter, label: 'Filter' },
    { 
      icon: darkMode ? FaSun : FaMoon, 
      label: darkMode ? 'Light Mode' : 'Dark Mode',
      action: toggleDarkMode
    },
    { icon: RotateCcw, label: 'Refresh' },
  ];

  const handleItemClick = (index) => {
    setActiveIndex(index);
    const item = sidebarItems[index];
    
    if (item.action) {
      item.action();
    } else if (item.component) {
      setCurrentComponent(item.component);
    }
  };

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

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
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
        {/* Sidebar Items */}
        <div className="flex flex-col py-4 space-y-2 user-select-none">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index;

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
                  className="w-full h-12 flex items-center justify-center relative overflow-visible"
                  onClick={() => handleItemClick(index)}
                >
                  {/* Active indicator bar */}
                  <motion.div
                    className={`absolute left-0 top-0 h-full w-1 rounded-r-full ${
                      darkMode ? 'bg-green-400' : 'bg-green-500'
                    }`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />

                  {/* Icon with special animation for theme toggle */}
                  <motion.div
                    className="relative z-10"
                    variants={item.label.includes('Mode') ? themeIconVariants : iconVariants}
                    animate={
                      item.label.includes('Mode') 
                        ? darkMode ? 'sun' : 'moon'
                        : undefined
                    }
                  >
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
                  </motion.div>

                  {/* Tooltip */}
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
                            {item.label}
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