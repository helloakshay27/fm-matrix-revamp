import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const OperationalAuditMasterChecklistsDashboard = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAddMasterChecklist = () => {
    navigate('/maintenance/audit/operational/master-checklists/add');
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
    console.log('Downloading sample format...');
    // Add download logic here
  };

  const handleImportQuestions = () => {
    if (selectedFile) {
      console.log('Importing questions from file:', selectedFile.name);
      // Add import logic here
    } else {
      alert('Please select a file first');
    }
  };

  // Sample data - empty table as shown in image
  const masterChecklistData: any[] = [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Master Checklist &gt; Master Checklist List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">MASTER CHECKLIST LIST</h1>
        </div>
      </div>
      
      <div className="mb-6 flex items-center gap-6">
        <Button onClick={handleAddMasterChecklist} style={{
        backgroundColor: '#C72030'
      }} className="text-white hover:opacity-90 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>

        {/* File Upload Section */}
        <div onDragOver={handleDragOver} onDrop={handleDrop} className="border-2 border-dashed border-[#C72030] rounded-lg px-4 py-2 text-center h-10 flex items-center min-w-[150px]">
          <div className="flex items-center justify-center w-full">
            <Upload className="w-4 h-4 text-[#C72030] mr-2" />
            <input type="file" id="fileInput" className="hidden" onChange={handleFileSelect} accept=".xlsx,.xls,.csv" />
            <label htmlFor="fileInput" className="text-[#C72030] cursor-pointer hover:opacity-75 text-sm">
              {selectedFile ? selectedFile.name.substring(0, 15) + (selectedFile.name.length > 15 ? '...' : '') : 'Choose File'}
            </label>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={handleDownloadSampleFormat} style={{
          backgroundColor: '#C72030'
        }} className="text-white hover:opacity-90">
            Download Sample Format
          </Button>
          <Button onClick={handleImportQuestions} style={{
          backgroundColor: '#C72030'
        }} className="text-white hover:opacity-90">
            Import Questions
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">ID</TableHead>
              <TableHead className="font-semibold text-gray-700">Activity Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Number Of Questions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {masterChecklistData.length === 0 ? <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No data available
                </TableCell>
              </TableRow> : masterChecklistData.map((item, index) => <TableRow key={index}>
                  <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                  <TableCell>{item.activityName}</TableCell>
                  <TableCell>{item.numberOfQuestions}</TableCell>
                </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
