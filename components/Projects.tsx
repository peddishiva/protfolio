'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Github, Code, Database, Globe, Cpu, Settings, Save, X, Lock, Eye, EyeOff, Plus, Trash2, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Admin authentication hook (reused from Skills component)
const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Admin password (in production, this should be environment variable)
  const ADMIN_PASSWORD = 'YOGCJ8U9J22';

  useEffect(() => {
    // Check for admin query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    
    // Check localStorage for admin session
    const adminSession = localStorage.getItem('portfolio_admin_session');
    
    if (adminParam === 'true' || adminSession === 'authenticated') {
      setIsAdmin(true);
      if (adminParam === 'true') {
        localStorage.setItem('portfolio_admin_session', 'authenticated');
      }
    }
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('portfolio_admin_session', 'authenticated');
      setShowLoginModal(false);
      setPassword('');
    } else {
      alert('Invalid password. Access denied.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('portfolio_admin_session');
    // Remove admin query param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.history.replaceState({}, '', url.toString());
  };

  return {
    isAdmin,
    showLoginModal,
    setShowLoginModal,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    handleLogin,
    handleLogout
  };
};

// New Project interface
interface NewProject {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  skills: string[];
  mediaUrl: string;
  category: string;
  featured: boolean;
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

export default function Projects() {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const {
    isAdmin,
    showLoginModal,
    setShowLoginModal,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    handleLogin,
    handleLogout
  } = useAdminAuth();

  const [projectLinks, setProjectLinks] = useState<Record<string, { githubUrl: string; liveUrl: string }>>({
    'face-detection': {
      githubUrl: 'https://github.com/peddishiva/py.projects',
      liveUrl: ''
    },
    'jarvis-ai': {
      githubUrl: 'https://github.com/peddishiva/JARVIS',
      liveUrl: ''
    },
    'js-projects': {
      githubUrl: 'https://github.com/peddishiva/Projects',
      liveUrl: ''
    },
    'email-spam': {
      githubUrl: 'https://github.com/peddishiva/py.projects',
      liveUrl: ''
    }
  });

  const [tempLinks, setTempLinks] = useState<Record<string, { githubUrl: string; liveUrl: string }>>(projectLinks);
  const [newProjects, setNewProjects] = useState<NewProject[]>([]);
  const [savedNewProjects, setSavedNewProjects] = useState<NewProject[]>([]);
  const [collapsedProjects, setCollapsedProjects] = useState<Set<string>>(new Set());

  const projects = [
    {
      id: 'face-detection',
      title: "Face Detection using OpenCV",
      description: "This Face Detection project is designed to detect human faces for various applications, including attendance systems and face recognition for security, privacy authentication, and mobile locking.",
      technologies: ["Python", "OpenCV", "Computer Vision", "Machine Learning"],
      featured: true,
      image: "https://buzzneers.com/wp-content/uploads/2018/05/cv1.jpg",
      icon: <Eye className="h-6 w-6" />,
      category: "Computer Vision"
    },
    {
      id: 'jarvis-ai',
      title: "JARVIS AI Assistant Chatbot",
      description: "JARVIS (Just A Rather Very Intelligent System) is a voice-activated AI assistant chatbot designed for automation and productivity. It can perform tasks such as making voice/video calls via WhatsApp, sending text messages using voice commands, and accessing local applications on the system.",
      technologies: ["Python", "AI", "Voice Recognition", "Automation"],
      featured: true,
      image: "https://repository-images.githubusercontent.com/367071568/a0833ac3-dfd7-4386-951f-b59e0caa8c96",
      icon: <Cpu className="h-6 w-6" />,
      category: "AI Assistant"
    },
    {
      id: 'js-projects',
      title: "30 Mini JavaScript Projects",
      description: "A collection of 30 mini practice projects built using JavaScript, HTML, CSS, and Python. These projects helped me gain hands-on experience and improve my JavaScript development skills.",
      technologies: ["JavaScript", "HTML5", "CSS3", "Python"],
      image: "https://oracle-devrel.github.io/devo-image-repository/seo-thumbnails/JavaScript---Thumbnail-1200-x-630.jpg",
      icon: <Code className="h-6 w-6" />,
      category: "JavaScript Projects"
    },
    {
      id: 'email-spam',
      title: "Email Spam Classification Model",
      description: "This machine learning project focuses on email spam classification. It helped me deeply understand how classification models work, strengthened my grasp on concepts of supervised learning, and gave me practical experience with scikit-learn and TensorFlow.",
      technologies: ["Python", "Machine Learning", "Scikit-learn", "TensorFlow"],
      image: "https://raw.githubusercontent.com/deepankarkotnala/Email-Spam-Ham-Classifier-NLP/master/images/email_spam_ham.png",
      icon: <Database className="h-6 w-6" />,
      category: "Machine Learning"
    }
  ];

  const handleSaveLinks = () => {
    setProjectLinks(tempLinks);
    setSavedNewProjects([...savedNewProjects, ...newProjects]);
    setNewProjects([]);
    setCollapsedProjects(new Set());
    setIsManageOpen(false);
    // Here you would typically save to a backend or local storage
    console.log('Saved project links:', tempLinks);
    console.log('Saved new projects:', [...savedNewProjects, ...newProjects]);
  };

  const handleLinkChange = (projectId: string, field: 'githubUrl' | 'liveUrl', value: string) => {
    setTempLinks(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId] || { githubUrl: '', liveUrl: '' },
        [field]: value
      }
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // New project management functions
  const addNewProject = () => {
    const newProject: NewProject = {
      id: `new-project-${Date.now()}`,
      title: '',
      description: '',
      githubUrl: '',
      liveUrl: '',
      skills: [],
      mediaUrl: '',
      category: 'Web App',
      featured: false
    };
    setNewProjects(prev => [...prev, newProject]);
  };

  const removeNewProject = (projectId: string) => {
    setNewProjects(prev => prev.filter(p => p.id !== projectId));
    setCollapsedProjects(prev => {
      const newSet = new Set(prev);
      newSet.delete(projectId);
      return newSet;
    });
  };

  const updateNewProject = (projectId: string, field: keyof NewProject, value: any) => {
    setNewProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, [field]: value } : p
    ));
  };

  const addSkillToProject = (projectId: string, skill: string) => {
    if (!skill.trim()) return;
    
    setNewProjects(prev => prev.map(p => {
      if (p.id === projectId && p.skills.length < 5 && !p.skills.includes(skill.trim())) {
        return { ...p, skills: [...p.skills, skill.trim()] };
      }
      return p;
    }));
  };

  const removeSkillFromProject = (projectId: string, skillIndex: number) => {
    setNewProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, skills: p.skills.filter((_, index) => index !== skillIndex) }
        : p
    ));
  };

  const toggleProjectCollapse = (projectId: string) => {
    setCollapsedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const validateNewProject = (project: NewProject): string[] => {
    const errors: string[] = [];
    
    if (!project.title.trim()) errors.push('Project title is required');
    if (!project.description.trim()) errors.push('Project description is required');
    if (!project.githubUrl.trim()) errors.push('GitHub link is required');
    if (project.description.length > 2000) errors.push('Description must be under 2000 characters');
    if (project.githubUrl && !isValidUrl(project.githubUrl)) errors.push('Invalid GitHub URL');
    if (project.liveUrl && !isValidUrl(project.liveUrl)) errors.push('Invalid Live Demo URL');
    if (project.mediaUrl && !isValidUrl(project.mediaUrl)) errors.push('Invalid Media URL');
    
    return errors;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Combine existing projects with saved new projects for display
  type DisplayProject = (
    {
      isNewProject: false;
      id: string;
      title: string;
      description: string;
      technologies: string[];
      featured?: boolean;
      image: string;
      icon: JSX.Element;
      category: string;
    }
    |
    (NewProject & { isNewProject: true; icon: JSX.Element; technologies: string[]; image: string; })
  );

  const allProjects: DisplayProject[] = [
    ...projects.map(p => ({
      ...p,
      technologies: p.technologies,
      isNewProject: false as const
    })),
    ...savedNewProjects.map(p => ({
      ...p,
      isNewProject: true as const,
      icon: getCategoryIcon(p.category),
      technologies: p.skills,
      image: p.mediaUrl || "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
    }))
  ];

  return (
    <section id="projects" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header with Admin Controls */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
              Featured Projects
            </h2>
            
            {/* Admin Controls */}
            <div className="flex items-center space-x-2">
              {isAdmin ? (
                <>
                  <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Links
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                          Manage Project Links
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 mt-4">
                        {/* Existing Projects */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                            Existing Projects
                          </h3>
                          {projects.map((project) => (
                            <div key={project.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-4">
                              <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                                {project.title}
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    GitHub Link
                                  </Label>
                                  <Input
                                    value={tempLinks[project.id]?.githubUrl || ''}
                                    onChange={(e) => handleLinkChange(project.id, 'githubUrl', e.target.value)}
                                    placeholder="https://github.com/username/repo"
                                    className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Live Demo Link
                                  </Label>
                                  <Input
                                    value={tempLinks[project.id]?.liveUrl || ''}
                                    onChange={(e) => handleLinkChange(project.id, 'liveUrl', e.target.value)}
                                    placeholder="https://your-project.com (optional)"
                                    className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* New Projects Section */}
                        {newProjects.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                              New Projects
                            </h3>
                            {newProjects.map((project) => {
                              const isCollapsed = collapsedProjects.has(project.id);
                              const errors = validateNewProject(project);
                              
                              return (
                                <div key={project.id} className="border border-slate-200 dark:border-slate-700 rounded-lg">
                                  {/* Project Header */}
                                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-t-lg flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleProjectCollapse(project.id)}
                                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
                                      >
                                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                      </Button>
                                      <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                                        {project.title || 'New Project'}
                                      </h4>
                                      {errors.length > 0 && (
                                        <Badge variant="destructive" className="text-xs">
                                          {errors.length} error{errors.length > 1 ? 's' : ''}
                                        </Badge>
                                      )}
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeNewProject(project.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  {/* Project Form */}
                                  {!isCollapsed && (
                                    <div className="p-4 space-y-4">
                                      {/* Basic Information */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Project Title *
                                          </Label>
                                          <Input
                                            value={project.title}
                                            onChange={(e) => updateNewProject(project.id, 'title', e.target.value)}
                                            placeholder="Enter project title"
                                            className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                            required
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Category
                                          </Label>
                                          <select
                                            value={project.category}
                                            onChange={(e) => updateNewProject(project.id, 'category', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                          >
                                            <option value="Web App">Web App</option>
                                            <option value="Full Stack">Full Stack</option>
                                            <option value="Machine Learning">Machine Learning</option>
                                            <option value="AI/NLP">AI/NLP</option>
                                            <option value="Mobile App">Mobile App</option>
                                            <option value="Desktop App">Desktop App</option>
                                            <option value="Other">Other</option>
                                          </select>
                                        </div>
                                      </div>

                                      {/* Description */}
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                          Project Description * ({project.description.length}/2000)
                                        </Label>
                                        <Textarea
                                          value={project.description}
                                          onChange={(e) => updateNewProject(project.id, 'description', e.target.value)}
                                          placeholder="Describe your project..."
                                          rows={4}
                                          maxLength={2000}
                                          className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                          required
                                        />
                                      </div>

                                      {/* Links */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            GitHub Link *
                                          </Label>
                                          <Input
                                            value={project.githubUrl}
                                            onChange={(e) => updateNewProject(project.id, 'githubUrl', e.target.value)}
                                            placeholder="https://github.com/username/repo"
                                            className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                            required
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Live Demo Link
                                          </Label>
                                          <Input
                                            value={project.liveUrl}
                                            onChange={(e) => updateNewProject(project.id, 'liveUrl', e.target.value)}
                                            placeholder="https://your-project.com (optional)"
                                            className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                          />
                                        </div>
                                      </div>

                                      {/* Media URL */}
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                          Media URL (Image/Document)
                                        </Label>
                                        <div className="flex space-x-2">
                                          <Input
                                            value={project.mediaUrl}
                                            onChange={(e) => updateNewProject(project.id, 'mediaUrl', e.target.value)}
                                            placeholder="https://example.com/image.jpg or upload file"
                                            className="flex-1 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                          >
                                            <Upload className="w-4 h-4" />
                                          </Button>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                          Supported: Images, PDFs, Documents (Max 10MB)
                                        </p>
                                      </div>

                                      {/* Skills */}
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                          Skills/Technologies ({project.skills.length}/5)
                                        </Label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                          {project.skills.map((skill, index) => (
                                            <Badge
                                              key={index}
                                              variant="secondary"
                                              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                                              onClick={() => removeSkillFromProject(project.id, index)}
                                            >
                                              {skill}
                                              <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                          ))}
                                        </div>
                                        {project.skills.length < 5 && (
                                          <div className="flex space-x-2">
                                            <Input
                                              placeholder="Add a skill..."
                                              className="flex-1 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                              onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                  const input = e.target as HTMLInputElement;
                                                  addSkillToProject(project.id, input.value);
                                                  input.value = '';
                                                }
                                              }}
                                            />
                                            <div className="flex flex-wrap gap-1">
                                              {SKILL_SUGGESTIONS.slice(0, 3).map((skill) => (
                                                <Button
                                                  key={skill}
                                                  type="button"
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => addSkillToProject(project.id, skill)}
                                                  className="text-xs px-2 py-1 h-auto text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                  disabled={project.skills.includes(skill)}
                                                >
                                                  +{skill}
                                                </Button>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Featured Toggle */}
                                      <div className="flex items-center space-x-2">
                                        <input
                                          type="checkbox"
                                          id={`featured-${project.id}`}
                                          checked={project.featured}
                                          onChange={(e) => updateNewProject(project.id, 'featured', e.target.checked)}
                                          className="rounded border-slate-300 dark:border-slate-600"
                                        />
                                        <Label htmlFor={`featured-${project.id}`} className="text-sm text-slate-700 dark:text-slate-300">
                                          Mark as Featured Project
                                        </Label>
                                      </div>

                                      {/* Validation Errors */}
                                      {errors.length > 0 && (
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                          <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                                            Please fix the following errors:
                                          </p>
                                          <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                                            {errors.map((error, index) => (
                                              <li key={index}>{error}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                          <Button 
                            type="button"
                            onClick={addNewProject}
                            className="bg-green-700 hover:bg-green-800 text-white"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Project
                          </Button>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setIsManageOpen(false);
                                setTempLinks(projectLinks); // Reset changes
                                setNewProjects([]); // Clear new projects
                                setCollapsedProjects(new Set()); // Reset collapsed state
                              }}
                              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleSaveLinks}
                              className="bg-blue-700 hover:bg-blue-800 text-white"
                              disabled={newProjects.some(p => validateNewProject(p).length > 0)}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
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
          
          <p className="text-lg text-slate-600 dark:text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            A showcase of my recent work in computer vision, AI development, web technologies, and machine learning
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {allProjects.map((project, index) => {
              let currentLinks: { githubUrl: string; liveUrl: string };
              if (project.isNewProject) {
                currentLinks = { githubUrl: project.githubUrl, liveUrl: project.liveUrl };
              } else {
                currentLinks = projectLinks[project.id] || { githubUrl: '', liveUrl: '' };
              }
              
              return (
                <Card 
                  key={index} 
                  className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden ${
                    project.featured ? 'ring-2 ring-blue-700/20 dark:ring-blue-400/20' : ''
                  }`}
                >
                  {/* Project Image Header */}
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <img 
                      src={project.image} 
                      alt={`${project.title} - ${project.category}`}
                      className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-blue-700 dark:text-blue-400 shadow-lg">
                        {project.icon}
                      </div>
                      <Badge className="bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-0 shadow-lg">
                        {project.category}
                      </Badge>
                    </div>
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <Badge className="absolute top-4 right-4 bg-blue-700 dark:bg-blue-600 text-white border-0 shadow-lg">
                        Featured
                      </Badge>
                    )}

                    {/* New Project Badge */}
                    {project.isNewProject && (
                      <Badge className="absolute bottom-4 right-4 bg-green-700 dark:bg-green-600 text-white border-0 shadow-lg">
                        New
                      </Badge>
                    )}
                    
                    {/* Hover Overlay with Quick Actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex space-x-3">
                        {currentLinks.githubUrl && (
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-slate-800 shadow-lg"
                            asChild
                          >
                            <a 
                              href={currentLinks.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2"
                            >
                              <Github className="h-4 w-4" />
                              <span>Code</span>
                            </a>
                          </Button>
                        )}
                        {currentLinks.liveUrl && (
                          <Button 
                            size="sm"
                            className="bg-blue-700 hover:bg-blue-800 text-white shadow-lg"
                            asChild
                          >
                            <a 
                              href={currentLinks.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Live</span>
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge 
                          key={techIndex} 
                          variant="outline" 
                          className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  {/* Card Footer - Always visible for accessibility */}
                  <CardFooter className="flex space-x-2 pt-0">
                    {currentLinks.githubUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild 
                        className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                      >
                        <a 
                          href={currentLinks.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2"
                        >
                          <Github className="h-4 w-4" />
                          <span>Code</span>
                        </a>
                      </Button>
                    )}
                    {currentLinks.liveUrl && (
                      <Button 
                        size="sm" 
                        asChild 
                        className="flex-1 bg-blue-700 hover:bg-blue-800 text-white transition-all duration-200"
                      >
                        <a 
                          href={currentLinks.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Live Demo</span>
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          
          {/* View All Projects on GitHub Button */}
          <div className="text-center mt-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Want to see more of my work?
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
              asChild
            >
              <a 
                href="https://github.com/peddishiva?tab=repositories" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Github className="h-5 w-5" />
                <span>View All Projects on GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-700 dark:text-blue-400" />
              Admin Access
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowLoginModal(false);
                  setPassword('');
                }}
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleLogin}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                Login
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}