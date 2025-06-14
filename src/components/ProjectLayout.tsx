
import React from 'react';
import { Settings, FileText, CheckSquare, AlertTriangle } from 'lucide-react';

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Project Sidebar */}
      <div className="w-64 bg-[#2D1B3D] text-white fixed left-0 top-0 h-full z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#C72030] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-white font-semibold text-lg">Project</span>
          </div>
          
          <nav className="space-y-2">
            <a 
              href="/projects/fitout-setup" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-[#3D2B4D] hover:text-white"
            >
              <Settings className="w-5 h-5" />
              Fitout Setup
            </a>
            
            <a 
              href="/projects/fitout-request" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-[#3D2B4D] hover:text-white"
            >
              <FileText className="w-5 h-5" />
              Fitout Request
            </a>
            
            <a 
              href="/projects/fitout-checklist" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-[#3D2B4D] hover:text-white"
            >
              <CheckSquare className="w-5 h-5" />
              Fitout Checklist
            </a>
            
            <a 
              href="/projects/fitout-violation" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-[#3D2B4D] hover:text-white"
            >
              <AlertTriangle className="w-5 h-5" />
              Fitout Violation
            </a>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
