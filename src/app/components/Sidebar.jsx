'use client';

import { useState } from 'react';
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

import { FaHome, FaMoon, FaScrewdriver } from 'react-icons/fa';

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const sidebarItems = [
    { icon: FaHome, label: 'Home' },
    { icon: Table, label: 'Table View' },
    { icon: CreditCard, label: 'Card View' },
    { icon: PieChart, label: 'Pie Chart View' },
    { icon: Bug, label: 'Bugs' },
    { icon: BarChart3, label: 'Analysis' },
    { icon: Sheet, label: 'Documentation' },
    { icon: TrendingUp, label: 'Comments' },
    { icon: User, label: 'Project' },
    { icon: Lightbulb, label: 'Suggestions' },
    { icon: Filter, label: 'Filter' },
    { icon: FaMoon, label: 'Dark Mode' }, 
    { icon: RotateCcw, label: 'Refresh' },
  ];

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

  return (
    <motion.div
      className="fixed left-0 top-0 h-screen w-[60px] bg-gradient-to-r from-blue-50 via-white to-purple-100  z-40 overflow-visible"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* Sidebar Items */}
      <div className="flex flex-col py-4 space-y-2">
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
                onClick={() => setActiveIndex(index)}
              >
                {/* Active green bar */}
                <motion.div
                  className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-r-full"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />

                {/* Icon */}
                <motion.div
                  className="relative z-10"
                  variants={iconVariants}
                >
                  <Icon
                    size={20}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? 'text-green-700'
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
                      <div className="px-4 py-2 rounded-xl text-sm font-semibold shadow-xl bg-white border border-gray-300 whitespace-nowrap">
                        <span className="text-green-700 font-semibold">
                          {item.label}
                        </span>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white" />
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
  );
};

export default Sidebar;
