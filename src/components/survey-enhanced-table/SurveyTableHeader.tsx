import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { SurveyColumnConfig } from './SurveyEnhancedTable';

interface SurveyTableHeaderProps {
  column: SurveyColumnConfig;
  sortIcon: React.ReactNode;
  onSort: () => void;
}

export function SurveyTableHeader({ column, sortIcon, onSort }: SurveyTableHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-50' : ''}`}
    >
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        
        {/* Column Content */}
        <div 
          className={`flex items-center gap-2 flex-1 ${
            column.sortable ? 'cursor-pointer hover:text-blue-600' : ''
          }`}
          onClick={column.sortable ? onSort : undefined}
        >
          <span className="font-medium">{column.label}</span>
          {column.sortable && sortIcon}
        </div>
      </div>
    </TableHead>
  );
}