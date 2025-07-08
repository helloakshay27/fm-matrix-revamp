
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, Upload, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const checklistData = [
  {
    id: 440,
    activityName: 'qawertyu',
    meterCategory: '',
    numberOfQuestions: 1,
    scheduledFor: 'Asset'
  },
  {
    id: 435,
    activityName: 'VI Repair Preparedness Checklist',
    meterCategory: '',
    numberOfQuestions: 5,
    scheduledFor: 'Service'
  },
  {
    id: 309,
    activityName: 'Daily Meeting Room Readiness Checklist',
    meterCategory: '',
    numberOfQuestions: 21,
    scheduledFor: 'Service'
  }
];

export const ChecklistMasterDashboard = () => {
  const navigate = useNavigate();
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

  const handleDownloadSampleFormat = () => {
    console.log('Downloading sample format...');
  };

  const handleImportQuestions = () => {
    console.log('Importing questions...');
  };

  const handleAddClick = () => {
    navigate('/settings/masters/checklist-master/add');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={handleAddClick}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* File Upload Section - All in one row */}
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-600">Choose File</span>
            <span className="text-gray-400">{selectedFile ? selectedFile.name : 'No file chosen'}</span>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileSelect}
              accept=".xlsx,.xls,.csv"
            />
            <label
              htmlFor="fileInput"
              className="text-blue-600 underline cursor-pointer hover:text-blue-700 ml-2"
            >
              Browse files
            </label>
          </div>
        </div>
        
        <Button 
          onClick={handleDownloadSampleFormat}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 whitespace-nowrap"
        >
          Download Sample Format
        </Button>
        
        <Button 
          onClick={handleImportQuestions}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 whitespace-nowrap"
        >
          Import Questions
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Actions</TableHead>
              <TableHead>View</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Activity Name</TableHead>
              <TableHead>Meter Category</TableHead>
              <TableHead>Number Of Questions</TableHead>
              <TableHead>Scheduled For</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checklistData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                <TableCell>{item.activityName}</TableCell>
                <TableCell>{item.meterCategory}</TableCell>
                <TableCell>{item.numberOfQuestions}</TableCell>
                <TableCell>{item.scheduledFor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
