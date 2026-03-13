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
  Shield,
  Layers,
  Users,
  Wrench,
  Newspaper,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useCV } from './contexts/CVContext';
import { formatDate, processEmphasis, processMarkdownLinks } from './services/cvService';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectsModal } from '@/components/ProjectsModal';

const App = () => {
  const { cv, loading, error } = useCV();
  const [scrolled, setScrolled] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(280);
  const expandedHeight = useRef(280);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamically measure header height so the spacer always matches
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    if (!scrolled) {
      // When expanding back, immediately use the last-known expanded height
      // so the spacer doesn't briefly stay small and cut off content
      setHeaderHeight(expandedHeight.current);
    }

    const measure = () => {
      const h = el.getBoundingClientRect().height;
      setHeaderHeight(h);
      if (!scrolled) expandedHeight.current = h;
    };

    // Delay measurement slightly so conditional children have mounted
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [scrolled]);


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

  // Map competencies to icons — unified indigo palette for visual cohesion
  const iconClass = "h-5 w-5 sm:h-6 sm:w-6 text-indigo-500";
  const getSkillIcon = (label: string) => {
    switch (label) {
      case 'ML Systems & Experimentation':
        return <Cpu className={iconClass} />;
      case 'Workflow Orchestration & HPC':
        return <Server className={iconClass} />;
      case 'Reliability & Operations':
        return <Shield className={iconClass} />;
      case 'Distributed Systems & APIs':
        return <Database className={iconClass} />;
      case 'Cloud & Infrastructure':
        return <Cloud className={iconClass} />;
      case 'Software Engineering':
        return <Code2 className={iconClass} />;
      case 'System Architecture':
        return <Layers className={iconClass} />;
      case 'Leadership & Strategy':
        return <Users className={iconClass} />;
      case 'Languages & Frameworks':
        return <Terminal className={iconClass} />;
      case 'Additional Technologies':
        return <Wrench className={iconClass} />;
      default:
        return <Code2 className={iconClass} />;
    }
  };

  /** Render a string that may contain **bold** markdown as React nodes. */
  const renderMarkdownBold = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  const skills = cv.sections['Core Competencies'];

  // Get featured projects (first 4)
  const featuredProjects = cv.sections['Selected Projects'].slice(0, 4);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
          ${
            scrolled
              ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm'
              : 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900'
          }`}
      >
        <div
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out
          ${scrolled ? 'py-3 sm:py-4' : 'py-14 sm:py-16 lg:py-20'}`}
        >
          <div className={`flex items-center ${scrolled ? 'justify-between' : 'mb-1'}`}>
            <div className="flex items-center gap-3">
              <h1
                className={`inline-block text-transparent bg-clip-text
                transition-all duration-300 ease-in-out font-bold tracking-tight
                ${scrolled
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-lg sm:text-xl'
                  : 'bg-gradient-to-r from-white to-indigo-200 text-3xl sm:text-4xl lg:text-5xl'
                }`}
              >
                {cv.name}
              </h1>
              {scrolled && (
                <span className="text-sm text-gray-400 hidden lg:inline font-medium">
                  {cv.sections.experience[0]?.position}
                </span>
              )}
            </div>
            {scrolled && (
              <nav className="hidden sm:flex items-center gap-1">
                {[
                  { label: 'Experience', href: '#experience' },
                  { label: 'Projects', href: '#projects' },
                  { label: 'Publications', href: '#publications' },
                  { label: 'Connect', href: '#connect' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
          {!scrolled && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-indigo-200/70 mt-2 font-medium tracking-wide uppercase"
            >
              {cv.sections.experience[0]?.position} &middot; {cv.location}
            </motion.p>
          )}
          {!scrolled && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-slate-300/90 mt-5 sm:mt-7 max-w-2xl leading-relaxed"
            >
              {processEmphasis(cv.sections.overview[0])}
            </motion.p>
          )}
          {!scrolled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 mt-6 sm:mt-8"
            >
              {cv.social_networks.map((sn) => {
                const url = sn.network === 'GitHub'
                  ? `https://github.com/${sn.username}`
                  : `https://www.linkedin.com/in/${sn.username}`;
                const Icon = sn.network === 'GitHub' ? Github : Linkedin;
                return (
                  <a
                    key={sn.network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                    aria-label={sn.network}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
              <a
                href={`mailto:${cv.email}`}
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="/Alexander_Berger_CV.pdf"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="Resume"
              >
                <FileText className="h-5 w-5" />
              </a>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Spacer div to prevent content jump when header becomes fixed */}
      <div
        style={{ height: headerHeight }}
        className="w-full transition-all duration-300"
      />

      {/* Skills Section */}
      <div className="w-full py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Technical Expertise
            </h2>
            <div className="mt-3 h-px w-12 bg-indigo-500" />
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {skills.map((skill, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  className="h-full border-gray-100/80 hover:border-indigo-200 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden relative bg-white"
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:h-1 transition-all duration-300" />
                  <CardHeader className="pb-3 pt-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50/80 group-hover:bg-indigo-100 flex items-center justify-center transition-colors duration-300 shrink-0 ring-1 ring-indigo-100/50">
                        {getSkillIcon(skill.label)}
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
                        {skill.label}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {skill.details.split(/,\s*/).map((item, i) => (
                        <span
                          key={i}
                          className="inline-block px-2.5 py-1 text-xs font-medium text-gray-500 bg-gray-50/80 group-hover:bg-indigo-50 group-hover:text-indigo-700 rounded-md border border-gray-100/80 group-hover:border-indigo-100 transition-colors duration-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Experience Section */}
      <div id="experience" className="w-full bg-gradient-to-br from-gray-50/80 to-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Professional Experience
            </h2>
            <div className="mt-3 h-px w-12 bg-indigo-500" />
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Timeline spine */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-300 via-indigo-200 to-transparent" />

            {cv.sections.experience.filter(exp => exp.position).map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative pl-12 sm:pl-16 pb-10 last:pb-0"
              >
                {/* Timeline node */}
                <div className="absolute left-2 sm:left-4 top-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[3px] border-indigo-500 bg-white z-10 shadow-sm" />

                <Card className="border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 overflow-hidden border-l-2 border-l-indigo-400/60">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{exp.position}</h3>
                        <p className="text-base text-gray-500 font-medium">{exp.company}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400 shrink-0 mt-1 sm:mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
                        </span>
                        <span className="hidden sm:inline text-gray-300">&middot;</span>
                        <span>{exp.location}</span>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-1.5">
                      {exp.highlights.filter(h => h !== '').map((highlight, i) => {
                        const isSectionHeader = highlight.startsWith('**');
                        if (isSectionHeader) {
                          return (
                            <li key={i} className="text-gray-700 text-xs sm:text-sm font-semibold uppercase tracking-wide mt-5 first:mt-0 list-none border-b border-gray-100 pb-1">
                              {renderMarkdownBold(highlight)}
                            </li>
                          );
                        }
                        return (
                          <li key={i} className="text-gray-600 text-sm sm:text-base flex gap-2.5 leading-relaxed">
                            <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-gray-300 inline-block" />
                            <span>{highlight}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Education Section */}
      <div className="w-full py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Education
            </h2>
            <div className="mt-3 h-px w-12 bg-indigo-500" />
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {cv.sections.education.map((edu, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 overflow-hidden border-l-2 border-l-indigo-400/60">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                          <GraduationCap className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800">{edu.degree} in {edu.area}</h3>
                          <p className="text-base text-gray-500 font-medium">{edu.institution}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 shrink-0 mt-1 sm:mt-1 ml-[3.25rem] sm:ml-0">
                        <span>{formatDate(edu.start_date)} – {formatDate(edu.end_date)}</span>
                      </div>
                    </div>
                    {edu.gpa && (
                      <p className="text-sm text-gray-500 mt-3 ml-[3.25rem]">
                        <span className="font-medium text-gray-600">GPA:</span> {edu.gpa}
                      </p>
                    )}
                    {edu.highlights.length > 0 && (
                      <ul className="mt-3 ml-[3.25rem] space-y-1.5">
                        {edu.highlights.map((highlight, i) => (
                          <li key={i} className="text-gray-600 text-sm sm:text-base flex gap-2.5 leading-relaxed">
                            <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-gray-300 inline-block" />
                            <span>{renderMarkdownBold(highlight)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Projects Section */}
      <div id="projects" className="w-full bg-gradient-to-br from-gray-50/80 to-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Featured Projects
            </h2>
            <div className="mt-3 h-px w-12 bg-indigo-500" />
          </motion.div>
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
      <div id="publications" className="w-full py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Publications
            </h2>
            <div className="mt-3 h-px w-12 bg-indigo-500" />
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {cv.sections.publications.map((pub, index) => {
              // Handle the "Full Publication List" link entry
              const isLinkEntry = pub.authors.length === 1 && pub.authors[0].startsWith('http');
              if (isLinkEntry) {
                return (
                  <motion.div key={index} variants={itemVariants}>
                    <a
                      href={pub.authors[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Card className="border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300 overflow-hidden group">
                        <CardContent className="p-4 sm:p-6 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                            <BookOpen className="h-5 w-5 text-indigo-500" />
                          </div>
                          <span className="text-lg font-semibold text-indigo-600 group-hover:text-indigo-800 transition-colors duration-300">
                            {pub.title}
                          </span>
                        </CardContent>
                      </Card>
                    </a>
                  </motion.div>
                );
              }

              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 overflow-hidden border-l-2 border-l-indigo-400/60">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                          <BookOpen className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {pub.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {pub.authors.map((author, i) => {
                              const isHighlighted = author.includes('***');
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
                          <div className="flex flex-wrap items-center gap-x-2 mt-2 text-xs text-gray-400">
                            {pub.date && <span>{formatDate(pub.date)}</span>}
                            {pub.doi && (
                              <>
                                <span className="text-gray-300">&middot;</span>
                                <a
                                  href={`https://doi.org/${pub.doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-500 hover:text-indigo-700 transition-colors duration-300"
                                >
                                  DOI: {pub.doi}
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Media Section */}
      {cv.sections.media && cv.sections.media.length > 0 && (
        <div className="w-full bg-gradient-to-br from-gray-50/80 to-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                In the Media
              </h2>
              <div className="mt-3 h-px w-12 bg-indigo-500" />
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {cv.sections.media.map((item, index) => (
                <motion.a
                  key={index}
                  variants={itemVariants}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-l-4 border-indigo-400/60 pl-4 sm:pl-6 py-2 hover:bg-gray-50 transition-colors duration-300 rounded-r"
                >
                  <div className="flex items-start gap-3">
                    <Newspaper className="h-5 w-5 text-indigo-500 mt-1 shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{item.publisher} &bull; {item.date}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Footer with Connect */}
      <footer id="connect" className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Get in Touch
            </h2>
            <div className="mt-3 h-px w-12 bg-indigo-400 mx-auto" />
            <p className="mt-4 text-slate-300/80 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Interested in collaborating or learning more about my work? I'd love to hear from you.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto"
          >
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target={link.name === 'Email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-400/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors duration-300">
                  {React.cloneElement(link.icon, { className: "h-5 w-5 text-indigo-300" })}
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-200">
                  {link.name}
                </span>
              </a>
            ))}
          </motion.div>
          <div className="mt-14 sm:mt-16 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400 font-medium">
              {cv.name}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {cv.sections.experience[0]?.position} &middot; {cv.location}
            </p>
            <p className="text-xs text-slate-600 mt-3">
              &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>

      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        projects={cv.sections['Selected Projects']}
      />
    </div>
  );
};

export default App;
