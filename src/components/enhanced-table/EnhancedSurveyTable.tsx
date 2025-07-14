import React, { useState, useMemo } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ChevronUp, 
  ChevronDown, 
  Settings2, 
  GripVertical,
  Edit, 
  Copy, 
  Eye, 
  Share2 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export interface SurveyData {
  id: string;
  title: string;
  ticketCreation: boolean;
  ticketCategory: string;
  ticketLevel: string;
  noOfAssociation: number;
  typeOfSurvey: string;
  status: string;
  validFrom: string;
  validTo: string;
}

interface Column {
  id: string;
  label: string;
  sortable: boolean;
  visible: boolean;
  width?: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: string | null;
  direction: SortDirection;
}

interface EnhancedSurveyTableProps {
  data: SurveyData[];
  onDataChange: (data: SurveyData[]) => void;
  searchTerm: string;
}

const SortableTableHeader = ({ column, sort, onSort, onToggleVisibility }: {
  column: Column;
  sort: SortConfig;
  onSort: (key: string) => void;
  onToggleVisibility: (columnId: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSortIcon = () => {
    if (sort.key !== column.id) return null;
    return sort.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <TableHead 
      ref={setNodeRef} 
      style={style} 
      className={`${column.width || ''} select-none bg-gray-50`}
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        
        {column.sortable ? (
          <button
            onClick={() => onSort(column.id)}
            className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded flex-1 text-left"
          >
            <span>{column.label}</span>
            {getSortIcon()}
          </button>
        ) : (
          <span className="flex-1">{column.label}</span>
        )}
      </div>
    </TableHead>
  );
};

export const EnhancedSurveyTable = ({ data, onDataChange, searchTerm }: EnhancedSurveyTableProps) => {
  const { toast } = useToast();
  
  const [columns, setColumns] = useState<Column[]>([
    { id: 'actions', label: 'Actions', sortable: false, visible: true, width: 'w-48' },
    { id: 'id', label: 'ID', sortable: true, visible: true, width: 'w-24' },
    { id: 'title', label: 'Survey Title', sortable: true, visible: true, width: 'min-w-[200px]' },
    { id: 'ticketCreation', label: 'Ticket Creation', sortable: true, visible: true, width: 'w-32' },
    { id: 'ticketCategory', label: 'Ticket Category', sortable: true, visible: true, width: 'min-w-[150px]' },
    { id: 'ticketLevel', label: 'Ticket Level', sortable: true, visible: true, width: 'min-w-[120px]' },
    { id: 'noOfAssociation', label: 'No. Of Association', sortable: true, visible: true, width: 'w-32 text-center' },
    { id: 'typeOfSurvey', label: 'Type Of Survey', sortable: true, visible: true, width: 'min-w-[120px]' },
    { id: 'status', label: 'Status', sortable: true, visible: true, width: 'min-w-[120px]' },
    { id: 'validFrom', label: 'Valid From', sortable: true, visible: true, width: 'min-w-[120px]' },
    { id: 'validTo', label: 'Valid To', sortable: true, visible: true, width: 'min-w-[120px]' },
  ]);

  const [sort, setSort] = useState<SortConfig>({ key: null, direction: null });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredData = useMemo(() => {
    return data.filter(survey =>
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.ticketCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sort.key || !sort.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sort.key as keyof SurveyData];
      const bValue = b[sort.key as keyof SurveyData];

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sort]);

  const visibleColumns = columns.filter(col => col.visible);

  const handleSort = (key: string) => {
    setSort(prevSort => {
      if (prevSort.key !== key) {
        return { key, direction: 'asc' };
      }
      if (prevSort.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      if (prevSort.direction === 'desc') {
        return { key: null, direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleColumnToggle = (columnId: string) => {
    setColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(sortedData.map(item => item.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleTicketCreationToggle = (index: number) => {
    const newData = [...data];
    const survey = newData.find(s => s.id === sortedData[index].id);
    if (survey) {
      survey.ticketCreation = !survey.ticketCreation;
      onDataChange(newData);
      toast({
        title: "Ticket Creation Updated",
        description: "Ticket creation setting has been updated successfully"
      });
    }
  };

  const handleStatusChange = (index: number, newStatus: string) => {
    const newData = [...data];
    const survey = newData.find(s => s.id === sortedData[index].id);
    if (survey) {
      survey.status = newStatus;
      onDataChange(newData);
      toast({
        title: "Status Updated",
        description: `Survey status changed to ${newStatus}`
      });
    }
  };

  const handleAction = (action: string, surveyId: string) => {
    toast({
      title: `${action} Action`,
      description: `${action} action performed for survey ${surveyId}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'text-green-600';
      case 'Draft': return 'text-yellow-600';
      case 'Inactive': return 'text-red-600';
      case 'Active': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const statusOptions = ['Active', 'Draft', 'Published', 'Inactive'];

  const renderCellContent = (column: Column, survey: SurveyData, index: number) => {
    switch (column.id) {
      case 'actions':
        return (
          <div className="flex gap-1">
            <button onClick={() => handleAction('Edit', survey.id)} className="p-1 text-gray-600 hover:text-gray-800">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => handleAction('Copy', survey.id)} className="p-1 text-gray-600 hover:text-gray-800">
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={() => handleAction('View', survey.id)} className="p-1 text-gray-600 hover:text-gray-800">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => handleAction('Share', survey.id)} className="p-1 text-gray-600 hover:text-gray-800">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        );
      case 'ticketCreation':
        return (
          <div className="flex items-center">
            <div 
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                survey.ticketCreation ? 'bg-green-400' : 'bg-gray-300'
              }`} 
              onClick={() => handleTicketCreationToggle(index)}
            >
              <span 
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  survey.ticketCreation ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </div>
          </div>
        );
      case 'status':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded">
              <span className={`font-medium ${getStatusColor(survey.status)}`}>
                {survey.status}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border shadow-lg z-50">
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(index, status)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <span className={getStatusColor(status)}>{status}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case 'noOfAssociation':
        return <div className="text-center">{survey.noOfAssociation}</div>;
      default:
        return survey[column.id as keyof SurveyData];
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
      {/* Column Controls */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Selected: {selectedRows.size}</span>
          {selectedRows.size > 0 && (
            <Button variant="outline" size="sm">
              Bulk Actions
            </Button>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.visible}
                onCheckedChange={() => handleColumnToggle(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setColumns(prev => prev.map(col => ({ ...col, visible: true })))}>
              Show All Columns
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <SortableContext items={visibleColumns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
                  {visibleColumns.map((column) => (
                    <SortableTableHeader
                      key={column.id}
                      column={column}
                      sort={sort}
                      onSort={handleSort}
                      onToggleVisibility={handleColumnToggle}
                    />
                  ))}
                </SortableContext>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((survey, index) => (
                <TableRow key={survey.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(survey.id)}
                      onCheckedChange={(checked) => handleSelectRow(survey.id, checked as boolean)}
                    />
                  </TableCell>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} className={column.width || ''}>
                      {renderCellContent(column, survey, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
};