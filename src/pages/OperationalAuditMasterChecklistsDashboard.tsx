import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { PostHogAuditActivity } from "@/components/PostHogAuditActivity";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { MasterChecklistFilterDialog } from "@/components/MasterChecklistFilterDialog";

export const OperationalAuditMasterChecklistsDashboard = () => {
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [auditEvents, setAuditEvents] = useState<
    Array<{
      key: number;
      event:
        | "Master Checklist Import clicked"
        | "Download Sample Format clicked"
        | "Master Checklist Created";
      properties?: Record<string, unknown>;
    }>
  >([]);
  const auditEventKeyRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const captureAuditEvent = (
    event:
      | "Master Checklist Import clicked"
      | "Download Sample Format clicked"
      | "Master Checklist Created",
    properties?: Record<string, unknown>
  ) => {
    auditEventKeyRef.current += 1;
    setAuditEvents((prev) => [
      ...prev,
      { key: auditEventKeyRef.current, event, properties },
    ]);
  };

  const handleAddMasterChecklist = () => {
    navigate("/maintenance/audit/operational/master-checklists/add");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownloadSampleFormat = () => {
    captureAuditEvent("Download Sample Format clicked");
  };

  const handleImportQuestions = () => {
    if (selectedFile) {
      captureAuditEvent("Master Checklist Import clicked");
      captureAuditEvent("Master Checklist Created", { import_method: "excel" });
    } else {
      fileInputRef.current?.click();
    }
  };

  const masterChecklistData: any[] = [];

  const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
    { key: "activityName", label: "Activity Name", sortable: true, draggable: true, defaultVisible: true },
    { key: "numberOfQuestions", label: "Number Of Questions", sortable: true, draggable: true, defaultVisible: true },
  ];

  const filteredData = searchTerm
    ? masterChecklistData.filter((item) =>
        Object.values(item).some((value) =>
          String(value ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : masterChecklistData;

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === "id") {
      return <span className="text-gray-900 font-medium">{item.id}</span>;
    }
    return <span>{item[columnKey] ?? "-"}</span>;
  };

  const canCreate = shouldShow("Master Checklist", "create");

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <PostHogAuditActivity
        event="Audit Schedule List Viewed"
        properties={{ list_type: "master_checklist" }}
      />
      {auditEvents.map((evt) => (
        <PostHogAuditActivity
          key={evt.key}
          event={evt.event}
          properties={evt.properties}
        />
      ))}

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">
          Master Checklist &gt; Master Checklist List
        </p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Master Checklist List
        </h1>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept=".xlsx,.xls,.csv"
      />

      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderCell={renderCell}
        storageKey="master-checklist-table"
        emptyMessage="No data available"
        pagination
        pageSize={10}
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search checklists..."
        hideTableExport
        onFilterClick={() => setShowFilters(true)}
        leftActions={
          canCreate ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddMasterChecklist}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          ) : undefined
        }
        filterAdjacentActions={
          canCreate ? (
            <>
              <Button
                onClick={() => fileInputRef.current?.click()}
                title={selectedFile ? selectedFile.name : "Choose File"}
                size="icon"
                className="!rounded-lg border border-brand text-brand hover:bg-brand-selected"
                variant="outline"
              >
                <Upload className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleDownloadSampleFormat}
                title="Download Sample Format"
                size="icon"
                className="!rounded-lg border border-brand text-brand hover:bg-brand-selected"
                variant="outline"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleImportQuestions}
                title="Import Questions"
                size="icon"
                className="!rounded-lg border border-brand text-brand hover:bg-brand-selected"
                variant="outline"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </>
          ) : undefined
        }
      />

      <MasterChecklistFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
};
