/**
 * Type definitions for CV data structure
 */

export interface SocialNetwork {
  network: string;
  username: string;
}

export interface TechnologyItem {
  label: string;
  details: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  area: string;
  degree: string;
  start_date: string;
  end_date: string;
  highlights: string[];
}

export interface ProjectItem {
  name: string;
  date?: string;
  highlights: string[];
}

export interface PublicationItem {
  title: string;
  authors: string[];
  doi: string;
  date: string;
}

export interface CV {
  name: string;
  email: string;
  phone: string;
  social_networks: SocialNetwork[];
  sections: {
    overview: string[];
    technologies: TechnologyItem[];
    experience: ExperienceItem[];
    'Core Skills': TechnologyItem[];
    education: EducationItem[];
    projects: ProjectItem[];
    publications: PublicationItem[];
    'Additional Experience': ExperienceItem[];
  };
  design: {
    theme: string;
  };
} 