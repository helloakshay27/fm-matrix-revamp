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
  const [auditEvent, setAuditEvent] = useState<{ key: number; event: "Master Checklist Import clicked" | "Download Sample Format clicked" } | null>(null);
  const auditEventKeyRef = useRef(0);
  const captureAuditEvent = (event: "Master Checklist Import clicked" | "Download Sample Format clicked") => {
    auditEventKeyRef.current += 1;
    setAuditEvent({ key: auditEventKeyRef.current, event });
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
      className="border-2 border-dashed border-[#C72030] rounded-lg px-3 py-1.5 flex items-center gap-2 h-9 min-w-[120px]"
    >
      <Upload className="w-4 h-4 text-[#C72030] shrink-0" />
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileSelect}
        accept=".xlsx,.xls,.csv"
      />
      <label htmlFor="fileInput" className="text-[#C72030] cursor-pointer hover:opacity-75 text-sm truncate max-w-[70px]">
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
        style={{ backgroundColor: "#C72030" }}
        className="fm-button-fix fm-button-brand p-2 h-9 w-9 rounded-lg"
        variant="ghost"
      >
        <Download className="w-4 h-4" />
      </Button>
      <Button
        onClick={handleImportQuestions}
        title="Import Questions"
        style={{ backgroundColor: "#C72030" }}
        className="fm-button-fix fm-button-brand p-2 h-9 w-9 rounded-lg"
        variant="ghost"
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
      {auditEvent && (
        <PostHogAuditActivity key={auditEvent.key} event={auditEvent.event} />
      )}
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
              style={{ backgroundColor: "#C72030" }}
              className="fm-button-fix fm-button-brand px-4 py-2 rounded-lg"
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
