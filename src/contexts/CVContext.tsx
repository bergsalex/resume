/**
 * Context provider for CV data
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CV } from '../types/cv';
import { parseCV } from '../services/cvService';
import cvYaml from '../data/Alexander_Berger_CV.yaml?raw'; // You'll need to configure Vite for this

interface CVContextType {
  cv: CV | null;
  loading: boolean;
  error: string | null;
}

const CVContext = createContext<CVContextType>({
  cv: null,
  loading: true,
  error: null
});

/**
 * Hook to access CV data
 */
export const useCV = () => useContext(CVContext);

interface CVProviderProps {
  children: ReactNode;
}

/**
 * Provider component for CV data
 */
export const CVProvider: React.FC<CVProviderProps> = ({ children }) => {
  const [cv, setCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCV = async () => {
      try {
        // In a real app, you might fetch this from an API
        const parsedCV = parseCV(cvYaml);
        setCV(parsedCV);
      } catch (err) {
        setError('Failed to load CV data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCV();
  }, []);

  return (
    <CVContext.Provider value={{ cv, loading, error }}>
      {children}
    </CVContext.Provider>
  );
}; 