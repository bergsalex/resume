/**
 * ProjectCard component for displaying project information
 */
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ProjectItem } from "@/types/cv";
import { processMarkdownLinks } from "@/services/cvService";

interface ProjectCardProps {
  project: ProjectItem;
  className?: string;
}

/**
 * Renders a project card with title, date, and highlights
 * 
 * @param project - Project data to display
 * @param className - Additional CSS classes
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  const projectDate = project.date ? processMarkdownLinks(project.date) : null;
  
  return (
    <Card className={`h-full hover:shadow-md transition-shadow duration-300 border-gray-100 overflow-hidden ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
            {project.name}
          </h3>
          {projectDate && projectDate.link && (
            <a 
              href={projectDate.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors duration-300"
            >
              {projectDate.text}
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {project.highlights.map((highlight, i) => {
            // Handle markdown formatting in highlights
            const highlightText = highlight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            return (
              <li key={i} className="text-gray-600 text-sm">
                <div dangerouslySetInnerHTML={{ __html: highlightText }} />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}; 