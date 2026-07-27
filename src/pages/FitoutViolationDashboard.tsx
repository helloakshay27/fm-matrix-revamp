import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { FitoutViolationFilterDialog } from '@/components/FitoutViolationFilterDialog';

interface FitoutViolation {
  id: string;
  type: string;
  description: string;
  unit: string;
  severity: string;
  status: string;
  reportedDate: string;
  assignedTo: string;
}

const columns: ColumnConfig[] = [
  { key: 'id', label: 'Violation ID', sortable: true, hideable: true, defaultVisible: true },
  { key: 'type', label: 'Type', sortable: true, hideable: true, defaultVisible: true },
  { key: 'description', label: 'Description', sortable: true, hideable: true, defaultVisible: true },
  { key: 'unit', label: 'Unit', sortable: true, hideable: true, defaultVisible: true },
  { key: 'severity', label: 'Severity', sortable: true, hideable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true },
  { key: 'reportedDate', label: 'Reported Date', sortable: true, hideable: true, defaultVisible: true },
  { key: 'assignedTo', label: 'Assigned To', sortable: true, hideable: true, defaultVisible: true },
];

export const FitoutViolationDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [violations] = useState<FitoutViolation[]>([]);

  const filteredViolations = useMemo(() => {
    if (!searchTerm) return violations;
    const q = searchTerm.toLowerCase();
    return violations.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(q))
    );
  }, [violations, searchTerm]);

  const renderCell = (item: FitoutViolation, columnKey: string) => (
    <span>{item[columnKey as keyof FitoutViolation] ?? '-'}</span>
  );

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">
          Fitout &gt; Fitout Violation
        </p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Fitout Violations
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Violations"
          value={0}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />
        <StatsCard
          title="Pending"
          value={0}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />
        <StatsCard
          title="In Progress"
          value={0}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />
        <StatsCard
          title="Resolved"
          value={0}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />
      </div>

      <EnhancedTable
        data={filteredViolations}
        columns={columns}
        renderCell={renderCell}
        storageKey="fitout-violation-table"
        emptyMessage="No violations reported. This is good news!"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search violations..."
        enableSearch
        pagination
        pageSize={10}
        onFilterClick={() => setShowFilters(true)}
        leftActions={
          <div className="flex items-center gap-2">
            <Button
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" /> Report Violation
            </Button>
          </div>
        }
      />

      <FitoutViolationFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
};
