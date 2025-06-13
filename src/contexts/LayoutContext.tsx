
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SubNavItem {
  name: string;
  href: string;
}

export interface NavigationSection {
  id: string;
  name: string;
  subItems?: SubNavItem[];
}

interface LayoutContextType {
  currentSection: string;
  currentSubSection?: string;
  setCurrentSection: (section: string, subSection?: string) => void;
  navigationSections: NavigationSection[];
}

const navigationSections: NavigationSection[] = [
  {
    id: 'project',
    name: 'Project',
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    subItems: [
      { name: 'Asset List', href: '/' },
      { name: 'AMC', href: '/amc' },
      { name: 'Services', href: '/services' },
      { name: 'Survey List', href: '/surveys/list' },
      { name: 'Survey Mapping', href: '/surveys/mapping' },
      { name: 'Survey Response', href: '/surveys/response' },
      { name: 'Attendance', href: '/attendance' },
      { name: 'Schedule', href: '/schedule' },
      { name: 'Supplier', href: '/supplier' },
    ]
  },
  {
    id: 'crm',
    name: 'CRM',
  },
  {
    id: 'utility',
    name: 'Utility',
  },
  {
    id: 'visitors',
    name: 'Visitors',
  },
  {
    id: 'experience',
    name: 'Experience',
  },
  {
    id: 'property',
    name: 'Property',
  },
];

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [currentSection, setCurrentSectionState] = useState('maintenance');
  const [currentSubSection, setCurrentSubSectionState] = useState<string | undefined>();

  const setCurrentSection = (section: string, subSection?: string) => {
    setCurrentSectionState(section);
    setCurrentSubSectionState(subSection);
  };

  return (
    <LayoutContext.Provider
      value={{
        currentSection,
        currentSubSection,
        setCurrentSection,
        navigationSections,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
