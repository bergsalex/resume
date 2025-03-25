import React from 'react';
import {
  Code2,
  Database,
  Server,
  GitBranch,
  Terminal,
  Cpu,
  Github,
  Linkedin,
  Mail,
  FileText,
  Cloud,
  Briefcase,
  GraduationCap,
  BookOpen,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCV } from './contexts/CVContext';
import { formatDate, processEmphasis, processMarkdownLinks } from './services/cvService';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectsModal } from '@/components/ProjectsModal';

const App = () => {
  const { cv, loading, error } = useCV();
  const [scrolled, setScrolled] = useState(false);
  const [hookIndex, setHookIndex] = useState(0);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!cv) return;
    
    const interval = setInterval(() => {
      setHookIndex(current => (current + 1) % cv.sections.overview.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [cv]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-indigo-600">Loading...</div>
      </div>
    );
  }

  if (error || !cv) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-600">Error loading CV data</div>
      </div>
    );
  }

  // Map technologies to icons
  const getSkillIcon = (label: string) => {
    switch (label) {
      case 'Languages':
        return <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />;
      case 'Technologies':
        return <Server className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />;
      case 'Frameworks':
        return <Database className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />;
      case 'Services':
        return <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-teal-500" />;
      case 'Experience with':
        return <Terminal className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-500" />;
      case 'Software Engineering':
        return <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-pink-500" />;
      case 'Technical Leadership':
        return <GitBranch className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />;
      default:
        return <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />;
    }
  };

  // Combine technologies and core skills for the skills section
  const skills = [
    ...cv.sections.technologies,
    ...cv.sections['Core Skills']
  ];

  // Get featured projects (first 4)
  const featuredProjects = cv.sections.projects.slice(0, 4);

  // Social links
  const links = [
    {
      icon: <Github className="h-6 w-6" />,
      name: 'GitHub',
      url: `https://github.com/${cv.social_networks.find(n => n.network === 'GitHub')?.username}`,
      description: 'Check out my open source contributions',
    },
    {
      icon: <Linkedin className="h-6 w-6" />,
      name: 'LinkedIn',
      url: `https://www.linkedin.com/in/${cv.social_networks.find(n => n.network === 'LinkedIn')?.username}`,
      description: 'Connect with me professionally',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      name: 'Email',
      url: `mailto:${cv.email}`,
      description: 'Reach out directly',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      name: 'Resume',
      url: '/Alexander_Berger_CV.pdf',
      description: 'Download my resume',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const currentHook = cv.sections.overview[hookIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
          ${
            scrolled
              ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm'
              : 'bg-transparent'
          }`}
      >
        <div
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out
          ${scrolled ? 'py-4' : 'py-12 sm:py-16 lg:py-20'}`}
        >
          <h1
            className={`bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text
            transition-all duration-300 ease-in-out font-bold
            ${scrolled ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl'}`}
          >
            {cv.name}
          </h1>
          {!scrolled && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              animate={{
                opacity: scrolled ? 0 : 1,
                height: scrolled ? 0 : 'auto',
              }}
              className="text-lg sm:text-xl text-gray-600 mt-3 sm:mt-4"
            >
              <div className="fade-text" key={hookIndex}>
                {processEmphasis(currentHook)}
              </div>
            </motion.div>
          )}
          {!scrolled && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              animate={{
                opacity: scrolled ? 0 : 1,
                height: scrolled ? 0 : 'auto',
              }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 w-full sm:w-auto"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Projects
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 w-full sm:w-auto"
                onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Me
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Spacer div to prevent content jump when header becomes fixed */}
      <div
        className={`w-full ${
          scrolled
            ? 'h-[72px]'
            : 'h-[300px] lg:h-[200px] md:h-[225px] sm:h-[225px] xs:h-[300px] xxs:h-[350px]'
        } transition-all duration-300`}
      />

      {/* Skills Section */}
      <div className="w-full py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text">
            Technical Expertise
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {skills.map((skill, index) => (
              <Card
                key={index}
                className="h-full hover:shadow-md transition-shadow duration-300 border-gray-100"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {getSkillIcon(skill.label)}
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                      {skill.label}
                    </h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-gray-600">
                    {skill.details}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="w-full bg-gradient-to-br from-gray-50/80 to-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text"
          >
            Professional Experience
          </motion.h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {cv.sections.experience.filter(exp => exp.position).map((exp, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="border-l-4 border-indigo-500 pl-4 sm:pl-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                    <p className="text-lg text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                    <span className="inline-flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                    </span>
                    <span className="block sm:inline sm:ml-3">{exp.location}</span>
                  </div>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="text-gray-600 text-sm sm:text-base">
                      • {highlight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Education Section */}
      <div className="w-full py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text"
          >
            Education
          </motion.h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {cv.sections.education.map((edu, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="border-l-4 border-purple-500 pl-4 sm:pl-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{edu.degree} in {edu.area}</h3>
                    <p className="text-lg text-gray-600">{edu.institution}</p>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                    <span className="inline-flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                    </span>
                  </div>
                </div>
                <ul className="mt-2 space-y-1">
                  {edu.highlights.map((highlight, i) => (
                    <li key={i} className="text-gray-600 text-sm sm:text-base" 
                        dangerouslySetInnerHTML={{ __html: highlight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Projects Section */}
      <div id="projects" className="w-full bg-gradient-to-br from-gray-50/80 to-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text"
          >
            Featured Projects
          </motion.h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {featuredProjects.map((project, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="group"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-8 text-center">
            <Button 
              variant="outline"
              className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
              onClick={() => setIsProjectsModalOpen(true)}
            >
              View All Projects
            </Button>
          </div>
        </div>
      </div>

      {/* Publications Section */}
      <div className="w-full py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text"
          >
            Publications
          </motion.h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {cv.sections.publications.map((pub, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="border-l-4 border-blue-500 pl-4 sm:pl-6 py-2"
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {pub.authors.map((author, i) => {
                      // Check if the author name contains the CV owner's name
                      const isHighlighted = author.includes(cv.name) || author.includes('***');
                      const cleanName = author.replace(/\*\*\*(.*?)\*\*\*/g, '$1');
                      
                      return (
                        <React.Fragment key={i}>
                          <span className={isHighlighted ? "font-semibold text-indigo-600" : ""}>
                            {cleanName}
                          </span>
                          {i < pub.authors.length - 1 && ", "}
                        </React.Fragment>
                      );
                    })}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{formatDate(pub.date)}</span>
                    <span className="mx-2">•</span>
                    <a 
                      href={`https://doi.org/${pub.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-700 transition-colors duration-300"
                    >
                      DOI: {pub.doi}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Connect Section */}
      <div id="connect" className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text"
          >
            Let's Connect
          </motion.h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {links.map((link, index) => (
              <motion.a
                key={index}
                variants={itemVariants}
                href={link.url}
                target={link.name !== 'Resume' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full hover:shadow-md transition-shadow duration-300 border-gray-100 group-hover:border-indigo-200">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors duration-300">
                      {React.cloneElement(link.icon, { className: "h-6 w-6 text-indigo-600" })}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                      {link.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {link.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {cv.name}. All rights reserved.</p>
          <p className="mt-2">Built with React, TypeScript, and Tailwind CSS.</p>
        </div>
      </footer>

      <ProjectsModal 
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        projects={cv.sections.projects}
      />
    </div>
  );
};

export default App;