/**
 * Service for loading and parsing CV data from YAML
 */
import { parse } from 'yaml';
import React from 'react';
import { CV } from '../types/cv';

/**
 * Loads CV data from a YAML file
 * 
 * @param yamlContent - The content of the YAML file as a string
 * @returns Parsed CV data
 */
export const parseCV = (yamlContent: string): CV => {
  try {
    const parsed = parse(yamlContent);
    return parsed.cv as CV;
  } catch (error) {
    console.error('Error parsing CV YAML:', error);
    throw new Error('Failed to parse CV data');
  }
};

/**
 * Formats a date string from YYYY-MM to a more readable format
 * 
 * @param dateStr - Date string in YYYY-MM format or "present"
 * @returns Formatted date string
 */
export const formatDate = (dateStr: string): string => {
  if (dateStr === 'present') return 'Present';
  
  const [year, month] = dateStr.split('-');
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return `${months[parseInt(month) - 1]} ${year}`;
};

/**
 * Processes markdown-style links in text
 * 
 * @param text - Text that may contain markdown links
 * @returns Object with processed text and extracted links
 */
export const processMarkdownLinks = (text: string): { text: string, link?: string } => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
  const match = text.match(linkRegex);
  
  if (match) {
    return {
      text: match[1],
      link: match[2]
    };
  }
  
  return { text };
};

/**
 * Processes text with emphasis markers (***text***)
 * 
 * @param text - Text that may contain emphasis markers
 * @returns Text with emphasis markers processed for React rendering
 */
export const processEmphasis = (text: string): React.ReactNode => {
  if (!text) return null;
  
  const parts = text.split(/((?:\*\*\*)[^*]+(?:\*\*\*))/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('***') && part.endsWith('***')) {
          const content = part.slice(3, -3);
          return <strong key={index} className="text-indigo-600">{content}</strong>;
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}; 