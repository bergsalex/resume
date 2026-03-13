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
  gpa?: string;
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
  doi?: string;
  date?: string;
}

export interface MediaItem {
  title: string;
  publisher: string;
  authors: string[];
  date: string;
  url: string;
  description: string;
}

export interface CV {
  name: string;
  location?: string;
  email: string;
  website?: string;
  phone: string;
  social_networks: SocialNetwork[];
  sections: {
    overview: string[];
    'Core Competencies': TechnologyItem[];
    'Technical Leadership Highlights': string[];
    experience: ExperienceItem[];
    'Selected Projects': ProjectItem[];
    education: EducationItem[];
    publications: PublicationItem[];
    media?: MediaItem[];
  };
}
