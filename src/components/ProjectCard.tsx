import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectItem } from "@/types/cv";
import { processMarkdownLinks } from "@/services/cvService";

interface ProjectCardProps {
  project: ProjectItem;
  className?: string;
}

const renderMarkdownBold = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  const projectDate = project.date ? processMarkdownLinks(project.date) : null;

  return (
    <Card className={`h-full border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 overflow-hidden border-l-2 border-l-indigo-400/60 relative group ${className}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
            {project.name}
          </h3>
          {projectDate && projectDate.link && (
            <a
              href={projectDate.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors duration-300 shrink-0"
            >
              {projectDate.text}
            </a>
          )}
        </div>
        <ul className="mt-3 space-y-1.5">
          {project.highlights.map((highlight, i) => (
            <li key={i} className="text-gray-600 text-sm sm:text-base flex gap-2.5 leading-relaxed">
              <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-gray-300 inline-block" />
              <span>{renderMarkdownBold(highlight)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}; 