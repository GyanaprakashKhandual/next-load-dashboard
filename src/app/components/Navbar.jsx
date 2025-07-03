'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  Search, 
  ChevronDown, 
  Sun, 
  Moon, 
  Monitor,
  Radio
} from 'lucide-react';

import { FaCoffee } from 'react-icons/fa'

const Navbar = () => {
  const [selectedPhase, setSelectedPhase] = useState('Phase 1');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [themeMode, setThemeMode] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');

  const phases = ['Phase 1', 'Phase 2', 'Phase 3'];
  
  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const waveVariants = {
    animate: {
      pathLength: [0, 1, 0],
      opacity: [0.3, 0.8, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const currentTheme = themeOptions.find(option => option.value === themeMode);
  const ThemeIcon = currentTheme.icon;

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-50 via-white to-purple-100 z-30 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Background Waves */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1200 80">
          <motion.path
            d="M0,40 Q300,10 600,40 T1200,40 V80 H0 Z"
            fill="url(#waveGradient)"
            variants={waveVariants}
            animate="animate"
          />
          <motion.path
            d="M0,50 Q400,20 800,50 T1200,50 V80 H0 Z"
            fill="url(#waveGradient2)"
            variants={waveVariants}
            animate="animate"
            style={{ animationDelay: '1s' }}
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Dust Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            animate={{
              x: [0, window.innerWidth || 1200],
              y: [
                Math.random() * 20 + 20,
                Math.random() * 20 + 40,
                Math.random() * 20 + 30
              ],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-between h-full px-4">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center space-x-4">
          <motion.div
            className="flex items-center space-x-3"
            variants={itemVariants}
          >
            <motion.div
            >
              <FaCoffee className="w-8 h-8 text-blue-700" />
            </motion.div>
            <motion.h1
              className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Load Test Dashboard Jewelry Shop
            </motion.h1>
          </motion.div>
        </div>

        {/* Center Section - Search Bar */}
        <motion.div
          className="flex-1 max-w-md mx-8"
          variants={itemVariants}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-6">
          {/* Phase Dropdown */}
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-slate-700 font-medium">{selectedPhase}</span>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {phases.map((phase) => (
                    <button
                      key={phase}
                      onClick={() => {
                        setSelectedPhase(phase);
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-150 ${
                        selectedPhase === phase ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                      }`}
                    >
                      {phase}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Live Data Indicator */}
          <motion.div
            className="flex items-center space-x-2"
            variants={itemVariants}
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              variants={pulseVariants}
              animate="animate"
            />
            <span className="text-slate-600 font-medium">Data are live</span>
          </motion.div>

          {/* Theme Toggle */}
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => {
                const nextIndex = (themeOptions.findIndex(opt => opt.value === themeMode) + 1) % themeOptions.length;
                setThemeMode(themeOptions[nextIndex].value);
              }}
              className="p-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                key={themeMode}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ThemeIcon className="w-5 h-5 text-slate-600" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;