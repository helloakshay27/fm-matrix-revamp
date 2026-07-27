import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Download, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { PostHogAuditActivity } from "@/components/PostHogAuditActivity";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

export const OperationalAuditMasterChecklistsDashboard = () => {
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [auditEvents, setAuditEvents] = useState<Array<{ key: number; event: "Master Checklist Import clicked" | "Download Sample Format clicked" | "Master Checklist Created"; properties?: Record<string, unknown> }>>([]);
  const auditEventKeyRef = useRef(0);
  const captureAuditEvent = (event: "Master Checklist Import clicked" | "Download Sample Format clicked" | "Master Checklist Created", properties?: Record<string, unknown>) => {
    auditEventKeyRef.current += 1;
    setAuditEvents(prev => [...prev, { key: auditEventKeyRef.current, event, properties }]);
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

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownloadSampleFormat = () => {
    captureAuditEvent("Download Sample Format clicked");
    console.log("Downloading sample format...");
    // Add download logic here
  };

  const handleImportQuestions = () => {
    if (selectedFile) {
      captureAuditEvent("Master Checklist Import clicked");
      console.log("Importing questions from file:", selectedFile.name);
      // Add import logic here
      captureAuditEvent("Master Checklist Created", { import_method: "excel" });
    } else {
      alert("Please select a file first");
    }
  };

  const masterChecklistData: any[] = [];

  const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
    { key: "activityName", label: "Activity Name", sortable: true, draggable: true, defaultVisible: true },
    { key: "numberOfQuestions", label: "Number Of Questions", sortable: true, draggable: true, defaultVisible: true },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const rightActions = shouldShow("Master Checklist", "create") ? (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border-2 border-dashed border-[#DA7756] rounded-lg px-3 py-1.5 flex items-center gap-2 h-9 min-w-[120px]"
    >
      <Upload className="w-4 h-4 text-[#DA7756] shrink-0" />
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileSelect}
        accept=".xlsx,.xls,.csv"
      />
      <label htmlFor="fileInput" className="text-[#DA7756] cursor-pointer hover:opacity-75 text-sm truncate max-w-[70px]">
        {selectedFile
          ? selectedFile.name.substring(0, 10) + (selectedFile.name.length > 10 ? "..." : "")
          : "Choose File"}
      </label>
    </div>
  ) : undefined;

  const filterAdjacentActions = shouldShow("Master Checklist", "create") ? (
    <>
      <Button
        onClick={handleDownloadSampleFormat}
        title="Download Sample Format"
        className="h-9 w-9 min-h-9 p-0 flex items-center justify-center rounded-lg border border-[#DA7756] bg-[#fffaf6] hover:bg-[#fdf0ea] text-[#DA7756]"
        variant="outline"
      >
        <Download className="w-4 h-4" />
      </Button>
      <Button
        onClick={handleImportQuestions}
        title="Import Questions"
        className="h-9 w-9 min-h-9 p-0 flex items-center justify-center rounded-lg border border-[#DA7756] bg-[#fffaf6] hover:bg-[#fdf0ea] text-[#DA7756]"
        variant="outline"
      >
        <Upload className="w-4 h-4" />
      </Button>
    </>
  ) : undefined;

  const customSearchInput = (
    <div className="relative w-[200px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 h-9"
      />
    </div>
  );

  return (
    <div className="p-6">
      <PostHogAuditActivity event="Audit Schedule List Viewed" properties={{ list_type: "master_checklist" }} />
      {auditEvents.map(evt => (
        <PostHogAuditActivity key={evt.key} event={evt.event} properties={evt.properties} />
      ))}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">
          Master Checklist &gt; Master Checklist List
        </p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">
          MASTER CHECKLIST LIST
        </h1>
      </div>

      <EnhancedTable
        data={masterChecklistData}
        columns={columns}
        storageKey="master-checklist-table"
        emptyMessage="No data available"
        pagination={true}
        pageSize={10}
        enableSearch={true}
        hideTableExport={true}
        customSearchInput={customSearchInput}
        filterAdjacentActions={filterAdjacentActions}
        leftActions={
          shouldShow("Master Checklist", "create") ? (
            <Button
              onClick={handleAddMasterChecklist}
              className="fm-button-fix fm-button-brand px-4 py-2 rounded-none"
              variant="ghost"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          ) : undefined
        }
        rightActions={rightActions}
      />
    </div>
  );
};
