import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Education() {
  const educationData = [
    {
      degree: "B.Tech Computer Science Engineering [ AI-ML ]",
      institution: "CMR Institute of Technology",
      grade: "CGPA: 8.00",
      description: "Specialized in CSE - Artificial Intelligence and Machine Learning with distinction.",
      duration: "2023 - 2027",
      type: "degree",
      icon: <GraduationCap className="h-6 w-6" />
    },
    {
      degree: "Intermediate",
      institution: "Sri Kakatiya Junior College",
      grade: "Percentage: 85.5%",
      description: "Completed my Intermediate education with a strong academic foundation and also with JEE and JEE Advance training.",
      duration: "2021 - 2023",
      type: "intermediate",
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      degree: "Coaching",
      institution: "Aakash Institute",
      grade: "",
      description: "Intensive coaching for competitive examinations with focus on engineering entrance preparation.",
      duration: "2021 - 2023",
      type: "coaching",
      icon: <Award className="h-6 w-6" />
    },
    {
      degree: "Secondary Education",
      institution: "Nalanda High School",
      grade: "GPA: 10.0",
      description: "Completed my schooling with a solid academic background and holistic development.",
      duration: "2021",
      type: "secondary",
      icon: <BookOpen className="h-6 w-6" />
    }
  ];

  return (
    <section id="education" className="py-16 sm:py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-slate-800 dark:text-slate-100">
              Educational Qualifications
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
              My academic background and professional journey that shaped my skills and expertise.
            </p>
          </div>

          {/* Education Sub-heading */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-center sm:justify-start">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-700 dark:text-blue-400" />
              Education
            </h3>
          </div>

          {/* Education Cards */}
          <div className="space-y-4 sm:space-y-6">
            {educationData.map((item, index) => (
              <Card key={index} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl text-slate-800 dark:text-slate-100 mb-1 leading-tight">
                          {item.degree}
                        </CardTitle>
                        <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {item.institution}
                        </p>
                        {item.grade && (
                          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                            {item.grade}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge 
                        variant="outline" 
                        className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 flex items-center space-x-1 text-xs sm:text-sm"
                      >
                        <Calendar className="h-3 w-3" />
                        <span>{item.duration}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}