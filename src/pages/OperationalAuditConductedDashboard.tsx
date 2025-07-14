
import React, { useState } from 'react';
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const OperationalAuditConductedDashboard = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Sample data matching the image
  const conductedData = [
    { report: true, id: "46884738", auditName: "clean", startDateTime: "18/02/2025, 06:26PM", conductedBy: "", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
    { report: true, id: "44388421", auditName: "This is test Audit", startDateTime: "22/11/2024, 04:17PM", conductedBy: "Vinayak Mane", status: "Completed", site: "Lockated", duration: "", percentage: "" },
    { report: true, id: "44254888", auditName: "This is test Audit", startDateTime: "05/11/2024, 02:44PM", conductedBy: "", status: "Completed", site: "Lockated", duration: "", percentage: "" },
    { report: false, id: "44247307", auditName: "This is test Audit", startDateTime: "30/10/2024, 04:27PM", conductedBy: "Vinayak Mane", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
    { report: false, id: "44247306", auditName: "This is test Audit", startDateTime: "30/10/2024, 04:27PM", conductedBy: "Vinayak Mane", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
    { report: true, id: "44246870", auditName: "This is test Audit", startDateTime: "25/10/2024, 01:08PM", conductedBy: "Vinayak Mane", status: "Completed", site: "Lockated", duration: "", percentage: "" },
    { report: true, id: "44212284", auditName: "This is test Audit", startDateTime: "23/10/2024, 06:34PM", conductedBy: "", status: "Completed", site: "Lockated", duration: "", percentage: "" },
    { report: false, id: "44212283", auditName: "Short Audit Process Report 1", startDateTime: "23/10/2024, 06:23PM", conductedBy: "Deepak Gupta", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
    { report: false, id: "44119818", auditName: "Short Audit Process Report 1", startDateTime: "18/10/2024, 11:48AM", conductedBy: "", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
    { report: false, id: "44119816", auditName: "Short Audit Process Report 1", startDateTime: "18/10/2024, 10:19AM", conductedBy: "", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
    { report: false, id: "44119814", auditName: "Short Audit Process Report 1", startDateTime: "17/10/2024, 10:26PM", conductedBy: "", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
    { report: false, id: "44119808", auditName: "Engineering Audit Checklist 2", startDateTime: "17/10/2024, 07:50PM", conductedBy: "Vinayak Mane", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
    { report: false, id: "44119803", auditName: "Short Audit Process Report 1", startDateTime: "17/10/2024, 06:07PM", conductedBy: "", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
    { report: false, id: "44119800", auditName: "Short Audit Process Report 1", startDateTime: "17/10/2024, 05:19PM", conductedBy: "", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
    { report: false, id: "44117794", auditName: "Short Audit Process Report 1", startDateTime: "17/10/2024, 03:58PM", conductedBy: "", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
    { report: false, id: "44116014", auditName: "Short Audit Process Report 1", startDateTime: "16/10/2024, 04:07PM", conductedBy: "", status: "In Progress", site: "Lockated", duration: "", percentage: "" },
  ];

  const handlePrintReport = (auditId: string, auditName: string) => {
    // Create a printable content
    const printContent = `
      <html>
        <head>
          <title>Audit Report - ${auditId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #C72030; }
            .report-header { margin-bottom: 20px; }
            .report-details { line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1>Operational Audit Report</h1>
            <h2>Audit ID: ${auditId}</h2>
            <h3>Audit Name: ${auditName}</h3>
          </div>
          <div class="report-details">
            <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Generated at:</strong> ${new Date().toLocaleTimeString()}</p>
            <p>This is a system-generated audit report.</p>
          </div>
        </body>
      </html>
    `;

    // Open a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const columns = [
    { key: 'report', label: 'Report', sortable: true, draggable: true },
    { key: 'id', label: 'ID', sortable: true, draggable: true },
    { key: 'auditName', label: 'Audit Name', sortable: true, draggable: true },
    { key: 'startDateTime', label: 'Start Date & Time', sortable: true, draggable: true },
    { key: 'conductedBy', label: 'Conducted By', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, draggable: true },
    { key: 'site', label: 'Site', sortable: true, draggable: true },
    { key: 'duration', label: 'Duration', sortable: true, draggable: true },
    { key: 'percentage', label: '%', sortable: true, draggable: true },
    { key: 'delete', label: 'Delete', sortable: false, draggable: true },
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'report':
        return item.report ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePrintReport(item.id, item.auditName)}
            className="p-1 h-auto hover:bg-gray-100"
          >
            <FileText className="w-4 h-4 text-blue-600" />
          </Button>
        ) : null;
      case 'id':
        return <span className="text-blue-600 font-medium">{item.id}</span>;
      case 'status':
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {item.status}
          </span>
        );
      case 'delete':
        return null;
      default:
        return item[columnKey];
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(conductedData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Audits Conducted &gt; Audits Conducted List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">AUDITS CONDUCTED LIST</h1>
        </div>
      </div>

      <div className="overflow-x-auto">
        <EnhancedTable
          data={conductedData}
          columns={columns}
          renderCell={renderCell}
          selectable={true}
          selectedItems={selectedItems}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          getItemId={(item) => item.id}
          storageKey="conducted-audit-table"
          className="w-full"
        />
      </div>
    </div>
  );
};
