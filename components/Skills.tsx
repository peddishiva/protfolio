'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, ExternalLink, Save, X, Lock, Eye, EyeOff, Plus, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Login attempt limiter configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const STORAGE_KEYS = {
  ATTEMPTS: 'portfolio_login_attempts',
  LOCKOUT_TIME: 'portfolio_lockout_time',
  ADMIN_SESSION: 'portfolio_admin_session'
};

// Login attempt limiter hook
const useLoginLimiter = () => {
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    // Load stored attempt data on component mount
    const storedAttempts = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    const storedLockoutTime = localStorage.getItem(STORAGE_KEYS.LOCKOUT_TIME);

    if (storedAttempts) {
      setAttemptCount(parseInt(storedAttempts, 10));
    }

    if (storedLockoutTime) {
      const lockoutTime = parseInt(storedLockoutTime, 10);
      const currentTime = Date.now();
      
      if (currentTime < lockoutTime) {
        // Still in lockout period
        setIsLockedOut(true);
        setLockoutEndTime(lockoutTime);
      } else {
        // Lockout period has expired, reset attempts
        resetAttempts();
      }
    }
  }, []);

  useEffect(() => {
    // Update countdown timer if locked out
    if (isLockedOut && lockoutEndTime) {
      const updateTimer = () => {
        const currentTime = Date.now();
        const remaining = lockoutEndTime - currentTime;

        if (remaining <= 0) {
          // Lockout period has ended
          resetAttempts();
          setIsLockedOut(false);
          setLockoutEndTime(null);
          setTimeRemaining('');
        } else {
          // Calculate and format remaining time
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      };

      updateTimer(); // Initial call
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [isLockedOut, lockoutEndTime]);

  const recordFailedAttempt = () => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, newAttemptCount.toString());

    if (newAttemptCount >= MAX_LOGIN_ATTEMPTS) {
      // Trigger lockout
      const lockoutTime = Date.now() + LOCKOUT_DURATION;
      setIsLockedOut(true);
      setLockoutEndTime(lockoutTime);
      localStorage.setItem(STORAGE_KEYS.LOCKOUT_TIME, lockoutTime.toString());
    }
  };

  const resetAttempts = () => {
    setAttemptCount(0);
    setIsLockedOut(false);
    setLockoutEndTime(null);
    setTimeRemaining('');
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.LOCKOUT_TIME);
  };

  const getRemainingAttempts = () => {
    return Math.max(0, MAX_LOGIN_ATTEMPTS - attemptCount);
  };

  return {
    attemptCount,
    isLockedOut,
    timeRemaining,
    recordFailedAttempt,
    resetAttempts,
    getRemainingAttempts
  };
};

// Admin authentication hook with login limiter
const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const {
    attemptCount,
    isLockedOut,
    timeRemaining,
    recordFailedAttempt,
    resetAttempts,
    getRemainingAttempts
  } = useLoginLimiter();
  
  // Updated admin password
  const ADMIN_PASSWORD = 'YOGCJ8U9J22';

  useEffect(() => {
    // Check for admin query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    
    // Check localStorage for admin session
    const adminSession = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    
    if (adminParam === 'true' || adminSession === 'authenticated') {
      setIsAdmin(true);
      if (adminParam === 'true') {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'authenticated');
      }
    }
  }, []);

  const handleLogin = () => {
    // Clear any previous error
    setLoginError('');

    // Check if locked out
    if (isLockedOut) {
      setLoginError(`Too many failed login attempts. Try again after 24 hours. Time remaining: ${timeRemaining}`);
      return;
    }

    if (password === ADMIN_PASSWORD) {
      // Successful login
      setIsAdmin(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'authenticated');
      setShowLoginModal(false);
      setPassword('');
      setLoginError('');
      // Reset attempts on successful login
      resetAttempts();
    } else {
      // Failed login
      recordFailedAttempt();
      const remaining = getRemainingAttempts();
      
      if (remaining > 0) {
        setLoginError(`Incorrect password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
      } else {
        setLoginError(`Too many failed login attempts. Try again after 24 hours.`);
      }
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    // Remove admin query param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.history.replaceState({}, '', url.toString());
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    setPassword('');
    setLoginError('');
  };

  return {
    isAdmin,
    showLoginModal,
    setShowLoginModal: (show: boolean) => {
      if (show) {
        setShowLoginModal(true);
        setLoginError(''); // Clear error when opening modal
      } else {
        handleModalClose();
      }
    },
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loginError,
    isLockedOut,
    timeRemaining,
    attemptCount,
    getRemainingAttempts,
    handleLogin,
    handleLogout
  };
};

// Custom skill interface
interface CustomSkill {
  id: string;
  name: string;
  iconUrl: string;
  certificationUrl: string;
  category: string;
}

// Skill suggestions for autocomplete
const SKILL_SUGGESTIONS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Python', 'Node.js', 'Express',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'AWS', 'Git',
  'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'Flask', 'Django',
  'Tailwind CSS', 'CSS3', 'HTML5', 'Socket.io', 'GraphQL', 'REST API',
  'Machine Learning', 'AI', 'Data Science', 'Automation', 'DevOps'
];

// Category icons mapping
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Full Stack':
      return <Globe className="h-6 w-6" />;
    case 'Machine Learning':
      return <Cpu className="h-6 w-6" />;
    case 'AI/NLP':
      return <Database className="h-6 w-6" />;
    case 'Web App':
      return <Code className="h-6 w-6" />;
    case 'Mobile App':
      return <Code className="h-6 w-6" />;
    case 'Desktop App':
      return <Code className="h-6 w-6" />;
    case 'Computer Vision':
      return <Eye className="h-6 w-6" />;
    case 'AI Assistant':
      return <Cpu className="h-6 w-6" />;
    case 'JavaScript Projects':
      return <Code className="h-6 w-6" />;
    default:
      return <Code className="h-6 w-6" />;
  }
};

export default function Skills() {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const {
    isAdmin,
    showLoginModal,
    setShowLoginModal,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loginError,
    isLockedOut,
    timeRemaining,
    attemptCount,
    getRemainingAttempts,
    handleLogin,
    handleLogout
  } = useAdminAuth();

  const [skillLinks, setSkillLinks] = useState({
    // Languages
    javascript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    python: 'https://python.org',
    typescript: 'https://typescriptlang.org',
    c: 'https://en.wikipedia.org/wiki/C_(programming_language)',
    java: 'https://oracle.com/java',
    
    // Web Development
    react: 'https://reactjs.org',
    nextjs: 'https://nextjs.org',
    nodejs: 'https://nodejs.org',
    express: 'https://expressjs.com',
    angular: 'https://angular.io',
    aitools: 'https://openai.com',
    html5: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    css3: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    
    // Databases
    mongodb: 'https://mongodb.com',
    postgresql: 'https://postgresql.org',
    mysql: 'https://mysql.com',
    
    // Tools & Frameworks - Added new tools
    git: 'https://git-scm.com',
    docker: 'https://docker.com',
    vscode: 'https://code.visualstudio.com',
    tensorflow: 'https://tensorflow.org',
    pandas: 'https://pandas.pydata.org',
    numpy: 'https://numpy.org',
    aws: 'https://aws.amazon.com',
    gitlab: 'https://gitlab.com',
    n8n: 'https://n8n.io',
    cursorai: 'https://cursor.sh',
    autocad: 'https://www.autodesk.com/products/autocad',
    androidstudio: 'https://developer.android.com/studio',
    
    // Areas of Interest
    machinelearning: 'https://scikit-learn.org',
    automation: 'https://github.com/shivapeddi',
    api: 'https://restfulapi.net',
    datascience: 'https://kaggle.com'
  });

  const [tempLinks, setTempLinks] = useState(skillLinks);
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>([]);
  const [tempCustomSkills, setTempCustomSkills] = useState<CustomSkill[]>([]);

  // New skill form state
  const [newSkill, setNewSkill] = useState({
    name: '',
    iconUrl: '',
    certificationUrl: '',
    category: 'Languages'
  });

  const skillCategories = [
    {
      title: "Languages",
      skills: ["javascript", "python", "typescript", "c", "java"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Web Development", 
      skills: ["react", "nextjs", "nodejs", "express", "angular", "aitools", "html5", "css3"],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Databases",
      skills: ["mongodb", "postgresql", "mysql"],
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Tools & Frameworks",
      skills: ["git", "docker", "vscode", "tensorflow", "pandas", "numpy", "aws", "gitlab", "n8n", "cursorai", "autocad", "androidstudio"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const areasOfInterest = [
    { name: "Machine Learning", key: "machinelearning" },
    { name: "Automation", key: "automation" },
    { name: "API Development", key: "api" },
    { name: "Data Science", key: "datascience" }
  ];

  const categoryOptions = [
    "Languages",
    "Web Development",
    "Databases",
    "Tools & Frameworks",
    "Areas of Interest"
  ];

  const handleSaveLinks = () => {
    setSkillLinks(tempLinks);
    setCustomSkills(tempCustomSkills);
    setIsManageOpen(false);
    setShowAddSkillForm(false);
    setNewSkill({ name: '', iconUrl: '', certificationUrl: '', category: 'Languages' });
  };

  const handleLinkChange = (skill: string, url: string) => {
    setTempLinks(prev => ({ ...prev, [skill]: url }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLockedOut) {
      handleLogin();
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim() || !newSkill.certificationUrl.trim()) {
      alert('Please fill in all required fields (Name and Certification Link)');
      return;
    }

    if (!isValidUrl(newSkill.certificationUrl)) {
      alert('Please enter a valid certification URL');
      return;
    }

    if (newSkill.iconUrl && !isValidUrl(newSkill.iconUrl)) {
      alert('Please enter a valid icon URL');
      return;
    }

    const customSkill: CustomSkill = {
      id: `custom-${Date.now()}`,
      name: newSkill.name.trim(),
      iconUrl: newSkill.iconUrl.trim(),
      certificationUrl: newSkill.certificationUrl.trim(),
      category: newSkill.category
    };

    setTempCustomSkills(prev => [...prev, customSkill]);
    setNewSkill({ name: '', iconUrl: '', certificationUrl: '', category: 'Languages' });
    setShowAddSkillForm(false);
  };

  const handleRemoveCustomSkill = (skillId: string) => {
    setTempCustomSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Get skills for each category including custom skills
  const getSkillsForCategory = (categoryTitle: string) => {
    const category = skillCategories.find(cat => cat.title === categoryTitle);
    const defaultSkills = category ? category.skills : [];
    const customSkillsForCategory = tempCustomSkills.filter(skill => skill.category === categoryTitle);
    
    return { defaultSkills, customSkillsForCategory };
  };

  // Get areas of interest including custom skills
  const getAreasOfInterest = () => {
    const customAreasOfInterest = tempCustomSkills.filter(skill => skill.category === 'Areas of Interest');
    return { defaultAreas: areasOfInterest, customAreas: customAreasOfInterest };
  };

  // Custom icon component for AWS
  const AWSIcon = ({ className }: { className?: string }) => (
    <img
      src="https://www.pngall.com/wp-content/uploads/13/AWS-Logo-PNG-Image.png"
      alt="AWS"
      className={`${className} object-contain`}
    />
  );

  // Custom icon component for GitLab - Fixed alignment
  const GitLabIcon = ({ className }: { className?: string }) => (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg className="w-10 h-10 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.919 1.263c-.135-.423-.73-.423-.867 0L1.388 9.452-.955 13.587a.849.849 0 0 0 .308 1.005L12 23.054l10.647-8.462a.849.849 0 0 0 .308-1.005"/>
      </svg>
    </div>
  );

  // Custom icon component for n8n
  const N8nIcon = ({ className }: { className?: string }) => (
    <img
      src="https://hdrobots.com/wp-content/uploads/2024/01/n8n-logo-1.png"
      alt="n8n"
      className={`${className} object-contain`}
    />
  );

  // Custom icon component for Angular
  const AngularIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 6.5l1.5 13L12 22l8.5-2.5L22 6.5L12 2zm0 2.2l6.4 14.3h-2.1l-1.2-3.1H8.9l-1.2 3.1H5.6L12 4.2zm0 3.3L9.7 12h4.6L12 7.5z" fill="#DD0031"/>
    </svg>
  );

  // Updated AI Tools icon component with ChatGPT icon
  const AIToolsIcon = ({ className }: { className?: string }) => (
    <img
      src="https://freelogopng.com/images/all_img/1681039084chatgpt-icon.png"
      alt="AI Tools"
      className={`${className} object-contain`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 border-slate-400 dark:border-slate-500 shadow-lg">AI</div>`;
        }
      }}
    />
  );

  // New icon component for Cursor AI Code
  const CursorAIIcon = ({ className }: { className?: string }) => (
    <img
      src="https://ai-cursor.com/wp-content/uploads/2024/09/AI-Cursor.webp"
      alt="Cursor AI Code"
      className={`${className} object-contain`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 border-slate-400 dark:border-slate-500 shadow-lg">CR</div>`;
        }
      }}
    />
  );

  // New icon component for AutoCAD
  const AutoCADIcon = ({ className }: { className?: string }) => (
    <img
      src="https://seeklogo.com/images/A/autocad-logo-69326D7728-seeklogo.com.png"
      alt="AutoCAD"
      className={`${className} object-contain`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `<div class="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 border-slate-400 dark:border-slate-500 shadow-lg">AC</div>`;
        }
      }}
    />
  );

  // New icon component for Android Studio
  const AndroidStudioIcon = ({ className }: { className?: string }) => (
    <img
      src="https://keycheck.dev/app-icons/android-studio.png"
      alt="Android Studio"
      className={`${className} object-contain`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 border-slate-400 dark:border-slate-500 shadow-lg">AS</div>`;
        }
      }}
    />
  );

  // Enhanced TechIcon component with improved visibility and prominent borders
  const EnhancedTechIcon = ({ name, url, iconUrl, onClick }: { name: string; url: string; iconUrl?: string; onClick?: () => void }) => {
    const handleClick = () => {
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      if (onClick) onClick();
    };

    const renderIcon = () => {
      if (name === 'aws') {
        return <AWSIcon className="w-12 h-12" />;
      } else if (name === 'gitlab') {
        return <GitLabIcon className="w-12 h-12" />;
      } else if (name === 'n8n') {
        return <N8nIcon className="w-12 h-12" />;
      } else if (name === 'angular') {
        return <AngularIcon className="w-12 h-12" />;
      } else if (name === 'aitools') {
        return <AIToolsIcon className="w-12 h-12" />;
      } else if (name === 'cursorai') {
        return <CursorAIIcon className="w-12 h-12" />;
      } else if (name === 'autocad') {
        return <AutoCADIcon className="w-12 h-12" />;
      } else if (name === 'androidstudio') {
        return <AndroidStudioIcon className="w-12 h-12" />;
      } else if (iconUrl) {
        return (
          <img
            src={iconUrl}
            alt={name}
            className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 border-slate-400 dark:border-slate-500 shadow-lg">${name.charAt(0).toUpperCase()}</div>`;
              }
            }}
          />
        );
      } else {
        const defaultIconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name.toLowerCase()}/${name.toLowerCase()}-original.svg`;
        const fallbackIconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name.toLowerCase()}/${name.toLowerCase()}-plain.svg`;
        
        return (
          <img
            src={defaultIconUrl}
            alt={name}
            className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackIconUrl;
              target.onerror = () => {
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 border-slate-400 dark:border-slate-500 shadow-lg">${name.charAt(0).toUpperCase()}</div>`;
                }
              };
            }}
          />
        );
      }
    };

    const getDisplayName = (skillName: string) => {
      if (skillName === 'c') return 'C Language';
      if (skillName === 'aitools') return 'AI Tools';
      if (skillName === 'cursorai') return 'Cursor AI Code';
      if (skillName === 'autocad') return 'AutoCAD';
      if (skillName === 'androidstudio') return 'Android Studio';
      return skillName;
    };

    return (
      <div 
        className="group relative flex flex-col items-center p-4 rounded-xl bg-white dark:bg-slate-800 border-3 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl shadow-md"
        onClick={handleClick}
        title={`Learn more about ${getDisplayName(name)}`}
      >
        <div className="relative w-14 h-14 mb-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all duration-300 shadow-sm group-hover:shadow-md flex items-center justify-center">
          {renderIcon()}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        </div>
        <span className="text-sm font-semibold text-center text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
          {getDisplayName(name)}
        </span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 text-blue-600 dark:text-blue-400" />
      </div>
    );
  };

  return (
    <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
              Skills & Technologies
            </h2>
            
            {/* Admin Controls */}
            <div className="flex items-center space-x-2">
              {isAdmin ? (
                <>
                  <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Links
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Manage Skill Links</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 mt-4">
                        {/* Add Skill Button */}
                        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Skills Management</h3>
                          <Button 
                            onClick={() => setShowAddSkillForm(true)}
                            className="bg-blue-700 hover:bg-blue-800 text-white"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Skill
                          </Button>
                        </div>

                        {/* Add Skill Form */}
                        {showAddSkillForm && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Add New Skill</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowAddSkillForm(false);
                                  setNewSkill({ name: '', iconUrl: '', certificationUrl: '', category: 'Languages' });
                                }}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Skill Name *
                                </Label>
                                <Input
                                  value={newSkill.name}
                                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                                  placeholder="e.g., React, Python, Docker"
                                  className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Category *
                                </Label>
                                <select
                                  value={newSkill.category}
                                  onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                >
                                  {categoryOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Icon URL (optional)
                              </Label>
                              <Input
                                value={newSkill.iconUrl}
                                onChange={(e) => setNewSkill(prev => ({ ...prev, iconUrl: e.target.value }))}
                                placeholder="https://example.com/icon.svg (leave empty for auto-generated icon)"
                                className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                              />
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                If left empty, we'll try to find an appropriate icon automatically
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Certification/Documentation Link *
                              </Label>
                              <Input
                                value={newSkill.certificationUrl}
                                onChange={(e) => setNewSkill(prev => ({ ...prev, certificationUrl: e.target.value }))}
                                placeholder="https://example.com/certification or documentation"
                                className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                              />
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setShowAddSkillForm(false);
                                  setNewSkill({ name: '', iconUrl: '', certificationUrl: '', category: 'Languages' });
                                }}
                                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleAddSkill}
                                className="bg-green-700 hover:bg-green-800 text-white"
                              >
                                Add Skill
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Custom Skills List */}
                        {tempCustomSkills.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                              Custom Skills
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {tempCustomSkills.map((skill) => (
                                <div key={skill.id} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                      {skill.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-800 dark:text-slate-100">{skill.name}</p>
                                      <p className="text-xs text-slate-600 dark:text-slate-400">{skill.category}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveCustomSkill(skill.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Existing Skills Links */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                            Default Skills Links
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(tempLinks).map(([skill, url]) => (
                              <div key={skill} className="space-y-2">
                                <Label className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                                  {skill === 'c' ? 'C Language' : 
                                   skill === 'aitools' ? 'AI Tools' :
                                   skill === 'cursorai' ? 'Cursor AI Code' :
                                   skill === 'autocad' ? 'AutoCAD' :
                                   skill === 'androidstudio' ? 'Android Studio' :
                                   skill.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>
                                <Input
                                  value={url}
                                  onChange={(e) => handleLinkChange(skill, e.target.value)}
                                  placeholder={`Enter URL for ${skill}`}
                                  className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsManageOpen(false);
                              setTempLinks(skillLinks);
                              setTempCustomSkills(customSkills);
                              setShowAddSkillForm(false);
                              setNewSkill({ name: '', iconUrl: '', certificationUrl: '', category: 'Languages' });
                            }}
                            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSaveLinks}
                            className="bg-blue-700 hover:bg-blue-800 text-white"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLoginModal(true)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-30 hover:opacity-100 transition-all duration-300"
                  title="Admin Access"
                >
                  <Lock className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {skillCategories.map((category, index) => {
              const { defaultSkills, customSkillsForCategory } = getSkillsForCategory(category.title);
              
              return (
                <Card key={index} className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 shadow-md">
                  <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {/* Default skills */}
                      {defaultSkills.map((skill) => (
                        <EnhancedTechIcon
                          key={skill}
                          name={skill}
                          url={skillLinks[skill as keyof typeof skillLinks]}
                        />
                      ))}
                      {/* Custom skills */}
                      {customSkillsForCategory.map((skill) => (
                        <EnhancedTechIcon
                          key={skill.id}
                          name={skill.name}
                          url={skill.certificationUrl}
                          iconUrl={skill.iconUrl}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Areas of Interest - Updated to be non-clickable */}
          <Card className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-md">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                Areas of Interest
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                {/* Default areas of interest - now non-clickable */}
                {areasOfInterest.map((area) => (
                  <Badge
                    key={area.key}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 font-medium"
                  >
                    {area.name}
                  </Badge>
                ))}
                {/* Custom areas of interest - now non-clickable */}
                {customSkills.filter(skill => skill.category === 'Areas of Interest').map((skill) => (
                  <Badge
                    key={skill.id}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 font-medium"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin Login Modal with Security Features */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-700 dark:text-blue-400" />
              Admin Access
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Security Status Display */}
            {(attemptCount > 0 || isLockedOut) && (
              <div className={`p-3 rounded-lg border ${
                isLockedOut 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' 
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {isLockedOut ? (
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  )}
                  <span className="text-sm font-medium">
                    {isLockedOut ? 'Account Locked' : 'Security Warning'}
                  </span>
                </div>
                {isLockedOut ? (
                  <div className="space-y-1">
                    <p className="text-sm">
                      Too many failed login attempts. Access blocked for 24 hours.
                    </p>
                    {timeRemaining && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>Time remaining: {timeRemaining}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm">
                    {attemptCount} failed attempt{attemptCount !== 1 ? 's' : ''}. 
                    {getRemainingAttempts()} attempt{getRemainingAttempts() !== 1 ? 's' : ''} remaining before lockout.
                  </p>
                )}
              </div>
            )}

            {/* Login Form */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Enter Admin Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter password"
                  className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 pr-10"
                  autoFocus
                  disabled={isLockedOut}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLockedOut}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">{loginError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowLoginModal(false)}
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleLogin}
                disabled={isLockedOut}
                className={`${
                  isLockedOut 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-700 hover:bg-blue-800 text-white'
                }`}
              >
                {isLockedOut ? 'Locked' : 'Login'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}