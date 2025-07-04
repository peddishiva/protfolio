'use client';

import { useState } from 'react';
import { Mail, MapPin, Github, Linkedin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Custom icons for additional platforms
const KaggleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.336"/>
  </svg>
);

const LeetCodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
  </svg>
);

const HackerRankIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .642 1.114.642 10.886 0 12C21.75 19.114 13.285 24 12 24s-9.75-4.886-10.392-6c-.642-1.114-.642-10.886 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V7.057c0-.143-.116-.258-.258-.258H8.963c-.141 0-.258.115-.258.258v9.886c0 .141.117.258.258.258h.742c.142 0 .258-.117.258-.258v-4.63h4.074v4.63c0 .141.116.258.258.258h.742c.141 0 .258-.117.258-.258V7.057c0-.143-.117-.258-.258-.258h-.742z"/>
  </svg>
);

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<FormStatus>({
    type: 'idle',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any previous status when user starts typing
    if (formStatus.type !== 'idle') {
      setFormStatus({ type: 'idle', message: '' });
    }
  };

  const validateForm = (): { isValid: boolean; error?: string } => {
    if (!formData.name.trim() || formData.name.length < 2) {
      return { isValid: false, error: 'Please enter a valid name (at least 2 characters)' };
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    if (!formData.message.trim() || formData.message.length < 10) {
      return { isValid: false, error: 'Please enter a message (at least 10 characters)' };
    }
    
    if (formData.message.length > 2000) {
      return { isValid: false, error: 'Message is too long (maximum 2000 characters)' };
    }
    
    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      setFormStatus({
        type: 'error',
        message: validation.error || 'Please check your input'
      });
      return;
    }

    setFormStatus({
      type: 'loading',
      message: 'Preparing your message...'
    });

    try {
      // Use Formspree for form submission (free service for static sites)
      const formspreeEndpoint = 'https://getform.io/f/bjjovgyb'; // You'll need to create this at formspree.io
      
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _replyto: formData.email,
          _subject: `Portfolio Contact from ${formData.name}`,
        }),
      });

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: 'Message sent successfully! Thank you for reaching out. I\'ll get back to you soon.'
        });
        
        // Reset form after successful submission
        setFormData({ name: '', email: '', message: '' });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setFormStatus({ type: 'idle', message: '' });
        }, 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      
      // Fallback to mailto link
      const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:peddishiva63@gmail.com?subject=${subject}&body=${body}`;
      
      setFormStatus({
        type: 'error',
        message: 'Unable to send message directly. Opening your email client instead...'
      });
      
      // Open mailto link after a short delay
      setTimeout(() => {
        window.location.href = mailtoLink;
        setFormStatus({
          type: 'idle',
          message: ''
        });
      }, 2000);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: "peddishiva63@gmail.com",
      href: "mailto:peddishiva63@gmail.com"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Location",
      value: "Hyderabad, Telangana, India"
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="h-6 w-6" />,
      label: "GitHub",
      href: "https://github.com/peddishiva"
    },
    {
      icon: <Linkedin className="h-6 w-6" />,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/shiva-peddi-3b0237282/"
    },
    {
      icon: <KaggleIcon className="h-6 w-6" />,
      label: "Kaggle",
      href: "https://www.kaggle.com/shivapeddi22"
    },
    {
      icon: <LeetCodeIcon className="h-6 w-6" />,
      label: "LeetCode",
      href: "https://leetcode.com/u/peddishiva22/"
    },
    {
      icon: <HackerRankIcon className="h-6 w-6" />,
      label: "HackerRank",
      href: "https://www.hackerrank.com/profile/23r01a66h1"
    }
  ];

  const isFormDisabled = formStatus.type === 'loading';

  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-800 dark:text-slate-100">
            Get In Touch
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-100">Let's Connect</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                I'm always interested in new opportunities and collaborations. 
                Whether you have a project in mind or just want to chat about technology, 
                feel free to reach out!
              </p>
              
              <div className="space-y-4 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-blue-700 dark:text-blue-400">
                      {info.icon}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">{info.label}</p>
                      {info.href ? (
                        <a 
                          href={info.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-slate-600 dark:text-slate-400">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 transition-all duration-300 text-slate-700 dark:text-slate-300 hover:scale-110 hover:shadow-lg"
                    aria-label={social.label}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-professional-lg">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-slate-100">Send a Message</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isFormDisabled}
                      className="mt-1 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isFormDisabled}
                      className="mt-1 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-slate-700 dark:text-slate-300">
                      Message ({formData.message.length}/2000)
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      disabled={isFormDisabled}
                      rows={5}
                      maxLength={2000}
                      className="mt-1 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
                      placeholder="Tell me about your project or just say hello..."
                    />
                  </div>

                  {/* Status Message */}
                  {formStatus.message && (
                    <div className={`p-3 rounded-lg border flex items-center space-x-2 ${
                      formStatus.type === 'success' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                        : formStatus.type === 'error'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                    }`}>
                      {formStatus.type === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                      {formStatus.type === 'success' && <CheckCircle className="h-4 w-4" />}
                      {formStatus.type === 'error' && <AlertCircle className="h-4 w-4" />}
                      <span className="text-sm font-medium">{formStatus.message}</span>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={isFormDisabled}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus.type === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                {/* Alternative Contact Methods */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-3">
                    Or reach out directly:
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="mailto:peddishiva63@gmail.com"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      peddishiva63@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}