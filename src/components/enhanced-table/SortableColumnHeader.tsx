
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SortDirection } from '@/hooks/useEnhancedTable';

interface SortableColumnHeaderProps {
  id: string;
  children: React.ReactNode;
  sortable?: boolean;
  draggable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  className?: string;
}

export const SortableColumnHeader: React.FC<SortableColumnHeaderProps> = ({
  id,
  children,
  sortable = true,
  draggable = true,
  sortDirection,
  onSort,
  className
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !draggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={cn(
        "h-12 px-6 py-4 text-left align-middle font-medium text-gray-700 border-b border-gray-300 whitespace-nowrap relative group bg-[#f5f5dc]",
        sortable && "cursor-pointer hover:bg-[#f0f0d8]",
        isDragging && "opacity-50 z-50",
        className
      )}
      {...attributes}
    >
      <div className="flex items-center gap-2">
        {draggable && (
          <div
            {...listeners}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        )}
        
        <div 
          className="flex items-center justify-center gap-1 flex-1 select-none"
          onClick={handleClick}
        >
          <span>{children}</span>
          {sortable && (
            <div className="flex flex-col">
              <ChevronUp 
                className={cn(
                  "w-3 h-3 -mb-1",
                  sortDirection === 'asc' ? "text-gray-900" : "text-gray-300"
                )} 
              />
              <ChevronDown 
                className={cn(
                  "w-3 h-3",
                  sortDirection === 'desc' ? "text-gray-900" : "text-gray-300"
                )} 
              />
            </div>
          )}
        </div>
      </div>
    </th>
  );
};
