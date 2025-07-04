import { Code, Cpu, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  const interests = [
    {
      icon: <Code className="h-8 w-8 text-blue-700" />,
      title: "Software Development",
      description: "Building scalable applications with modern technologies"
    },
    {
      icon: <Cpu className="h-8 w-8 text-slate-600" />,
      title: "Machine Learning",
      description: "Exploring AI and data science to solve real-world problems"
    },
    {
      icon: <Zap className="h-8 w-8 text-emerald-600" />,
      title: "Automation",
      description: "Creating efficient solutions that simplify complex workflows"
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-800 dark:text-slate-100">
            About Me
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Circular Profile Image */}
            <div className="flex justify-center">
              <div className="relative group">
                {/* Main Circular Profile Image */}
                <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-professional-lg bg-slate-200 dark:bg-slate-700 transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:shadow-2xl">
                  <img
                    src="/images/about.jpg"
                    alt="Shiva Peddi - Software Developer"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-full"></div>
                </div>
                
                {/* Soft Glow Effect */}
                <div className="absolute inset-0 rounded-full shadow-xl opacity-20 blur-sm group-hover:opacity-40 group-hover:blur-md transition-all duration-500 ease-in-out"></div>
              </div>
            </div>
            
            {/* About Text Content */}
            <div className="space-y-6">
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Hi! I'm Shivamani, a passionate and creative developer blending web, AI, and cloud-native tools to craft smart, user-driven solutions. I can use AI tools like a pro and do the work of a team by myself within the given deadline. With strong problem-solving abilities, I specialize in Data Structures and Algorithms (DSA).
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Additionally, I'm a professional video editor and a part-time freelancer with advanced editing skills.
              </p>
            </div>
          </div>

          {/* Interest Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {interests.map((interest, index) => (
              <Card key={index} className="text-center hover:shadow-professional-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
                    <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                      {interest.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300">
                    {interest.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{interest.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}