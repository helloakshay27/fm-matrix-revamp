
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload } from "lucide-react";

export const OperationalAuditMasterChecklistsDashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      
      <div className="mb-6">
        <Button className="bg-[#8B4B8C] hover:bg-[#7a4179] text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* File Upload Section */}
      <div className="mb-6 flex gap-4">
        <div 
          className="flex-1 border-2 border-dashed border-orange-300 rounded-lg p-8 text-center bg-orange-50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-orange-500 mb-2" />
            <p className="text-orange-600 mb-2">Drag & Drop or</p>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileSelect}
              accept=".xlsx,.xls,.csv"
            />
            <label
              htmlFor="fileInput"
              className="text-orange-600 underline cursor-pointer hover:text-orange-700"
            >
              Choose File
            </label>
            <p className="text-sm text-gray-500 mt-2">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button className="bg-[#8B4B8C] hover:bg-[#7a4179] text-white">
            Download Sample Format
          </Button>
          <Button className="bg-[#8B4B8C] hover:bg-[#7a4179] text-white">
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
            {masterChecklistData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              masterChecklistData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                  <TableCell>{item.activityName}</TableCell>
                  <TableCell>{item.numberOfQuestions}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
