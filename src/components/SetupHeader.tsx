
import React from 'react';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const SetupHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-[#D5DbDB] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <a 
          href="/" 
          className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </a>
        <div className="w-px h-6 bg-[#D5DbDB]"></div>
        <h1 className="text-lg font-semibold text-[#1a1a1a]">Setup Configuration</h1>
      </div>
      
      <Button
        onClick={() => navigate('/dashboard')}
        variant="outline"
        className="flex items-center gap-2 hover:bg-[#C72030] hover:text-white transition-colors"
      >
        <BarChart3 className="w-4 h-4" />
        Analytics Dashboard
      </Button>
    </header>
  );
};
