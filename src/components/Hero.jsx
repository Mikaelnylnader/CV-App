import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Hero() {
  const navigate = useNavigate();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(() => ["Resume", "Cover letter"], []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber(titleNumber === titles.length - 1 ? 0 : titleNumber + 1);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="relative overflow-hidden min-h-[80vh] flex items-center bg-gradient-to-br from-[#020617] via-[#0B1120] to-[#1e3a8a]">
      {/* Background overlay with subtle texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_rgba(255,255,255,0)_100%)]" />
      
      {/* Content */}
      <div className="relative w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 py-20 lg:py-32 items-center justify-center flex-col">
            <div className="flex gap-4 flex-col max-w-4xl">
              <h1 className="text-center">
                <motion.div 
                  className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Land Your Dream Job with
                </motion.div>
                <motion.div 
                  className="text-5xl md:text-7xl font-extrabold text-white relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  AI-Powered
                  <div className="relative flex w-full justify-center overflow-hidden text-center h-[1.2em]">
                    {titles.map((title, index) => (
                      <motion.span
                        key={index}
                        className="absolute text-[#3B82F6]"
                        initial={{ opacity: 0, y: 150 }}
                        animate={
                          titleNumber === index
                            ? { y: 0, opacity: 1 }
                            : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                        }
                        transition={{ type: "spring", stiffness: 50 }}
                      >
                        {title}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </h1>

              <motion.p 
                className="mt-8 text-lg sm:text-xl md:text-2xl text-gray-300 text-center max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Transform your resume instantly with AI that tailors your experience to match any job description
              </motion.p>
            </div>
            
            <motion.div 
              className="mt-12 flex flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-[#3B82F6] text-white rounded-full font-semibold text-lg hover:bg-blue-600 transition-colors duration-200 flex items-center group"
              >
                Try It Now
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}