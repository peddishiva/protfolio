'use client';

import { useState, useEffect } from 'react';
import { Eye, ExternalLink, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = [
    "I'm an AI Agent Developer",
    "I'm a UI/UX Developer", 
    "I'm a Prompt Engineer",
    "I'm an Automation Expert"
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResumeView = () => {
    // Open the resume in view mode in a new tab
    const viewUrl = 'https://drive.google.com/file/d/1P_cuDfPxzkg_cbd-aBCX-S257qQrhAJz/view?usp=sharing';
    window.open(viewUrl, '_blank', 'noopener,noreferrer');
  };

  // Typing animation effect
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    let timeout: NodeJS.Timeout;

    if (isTyping && !isDeleting) {
      if (displayedText.length < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentRole.slice(0, displayedText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else if (isDeleting) {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 50);
      } else {
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, isDeleting, currentRoleIndex, roles]);

  return (
    <section className="min-h-screen flex items-center bg-slate-50 dark:bg-slate-900 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center max-w-7xl mx-auto">
          
          {/* Left Side - Content */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Hi, I'm{' '}
                <span className="text-blue-700 dark:text-blue-400">
                  Shiva Peddi
                </span>
              </h1>
              
              {/* Animated Role Text */}
              <div className="h-12 sm:h-14 md:h-16 flex items-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-600 dark:text-slate-300">
                  {displayedText}
                  <span className="animate-pulse text-blue-700 dark:text-blue-400">|</span>
                </h2>
              </div>
            </div>

            {/* Bio */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              I'm a passionate and creative developer blending web, AI, and cloud-native tools to craft smart, user-driven solutions.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                onClick={() => scrollToSection('projects')}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 sm:px-8 py-3 text-base font-medium rounded-lg shadow-professional hover:shadow-professional-lg transition-all duration-300 transform hover:scale-105"
              >
                <Eye className="mr-2 h-5 w-5" />
                View My Portfolio
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={handleResumeView}
                className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-6 sm:px-8 py-3 text-base font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                View Resume
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-2">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Connect with me:
              </p>
              <div className="flex space-x-3">
                <a
                  href="https://github.com/peddishiva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
                  aria-label="GitHub Profile"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/shiva-peddi-3b0237282/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative group">
              {/* Main Square Profile Image */}
              <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-2xl overflow-hidden shadow-professional-lg bg-slate-200 dark:bg-slate-700 transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:shadow-2xl">
                <img
                  src="/images/hero.jpg"
                  alt="Shiva Peddi - Software Developer"
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  loading="eager"
                />         
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>
              </div>
              
              {/* Soft Glow Effect */}
              <div className="absolute inset-0 rounded-2xl shadow-xl opacity-20 blur-sm group-hover:opacity-40 group-hover:blur-md transition-all duration-500 ease-in-out"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}