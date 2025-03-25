/**
 * Modal for displaying all projects
 */
import React from "react";
import { Modal } from "@/components/ui/modal";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectItem } from "@/types/cv";
import { motion } from "framer-motion";

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
}

/**
 * Modal component that displays all projects in a grid layout
 * 
 * @param isOpen - Whether the modal is open
 * @param onClose - Function to call when the modal is closed
 * @param projects - Array of project items to display
 */
export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  projects,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
    <Modal isOpen={isOpen} onClose={onClose} title="All Projects">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {projects.map((project, index) => (
          <motion.div key={index} variants={itemVariants} className="group">
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </Modal>
  );
}; 