import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { FitoutChecklistFilterDialog } from '@/components/FitoutChecklistFilterDialog';

interface FitoutChecklist {
  id: number;
  name: string;
  category: string;
  itemsCount: number | string;
  status: string;
  createdDate: string;
  modifiedDate: string;
}

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Checklist Name', sortable: true, hideable: true, defaultVisible: true },
  { key: 'category', label: 'Category', sortable: true, hideable: true, defaultVisible: true },
  { key: 'itemsCount', label: 'Items Count', sortable: true, hideable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true },
  { key: 'createdDate', label: 'Created Date', sortable: true, hideable: true, defaultVisible: true },
  { key: 'modifiedDate', label: 'Modified Date', sortable: true, hideable: true, defaultVisible: true },
];

export const FitoutChecklistDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [checklists] = useState<FitoutChecklist[]>([]);
  const navigate = useNavigate();

  const filteredChecklists = useMemo(() => {
    if (!searchTerm) return checklists;
    const q = searchTerm.toLowerCase();
    return checklists.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(q))
    );
  }, [checklists, searchTerm]);

  const handleAddChecklist = () => {
    navigate('/transitioning/fitout/checklist/add');
  };

  const renderCell = (item: FitoutChecklist, columnKey: string) => (
    <span>{item[columnKey as keyof FitoutChecklist] ?? '-'}</span>
  );

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">
          Fitout &gt; Fitout Checklist
        </p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Fitout Checklist
        </h1>
      </div>

      <EnhancedTable
        data={filteredChecklists}
        columns={columns}
        renderCell={renderCell}
        storageKey="fitout-checklist-table"
        emptyMessage="No checklists found. Click 'Add' to create your first checklist."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search checklists..."
        enableSearch
        pagination
        pageSize={10}
        onFilterClick={() => setShowFilters(true)}
        leftActions={
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddChecklist}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
        }
      />

      <FitoutChecklistFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
};
