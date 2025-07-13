import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, File, Image } from 'lucide-react';

interface FileUploadSectionProps {
  title: string;
  sectionNumber: number;
  acceptedTypes?: string;
  multiple?: boolean;
  buttonText: string;
  description?: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

// Map section numbers to display numbers
const getSectionDisplayNumber = (sectionNumber: number): number => {
  const sectionMap: { [key: number]: number } = {
    4: 1, // Cover section
    5: 2, // Menu section
    6: 3  // Gallery section
  };
  return sectionMap[sectionNumber] || sectionNumber;
};

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  title,
  sectionNumber,
  acceptedTypes = "image/*",
  multiple = false,
  buttonText,
  description = "Drag and drop files here or click to browse",
  files,
  onFilesChange
}) => {
  const [dragOver, setDragOver] = useState(false);
  const displayNumber = getSectionDisplayNumber(sectionNumber);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (multiple) {
      onFilesChange([...files, ...selectedFiles]);
    } else {
      onFilesChange(selectedFiles);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (multiple) {
      onFilesChange([...files, ...droppedFiles]);
    } else {
      onFilesChange(droppedFiles);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeFile = (indexToRemove: number) => {
    onFilesChange(files.filter((_, index) => index !== indexToRemove));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    }
    return <File className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
          {displayNumber}
        </span>
        <h3 className="text-lg font-medium text-[#C72030] uppercase">{title}</h3>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-[#C72030] bg-red-50' 
            : 'border-gray-300 bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="space-y-2">
            <p className="text-gray-600 font-medium">{description}</p>
            <p className="text-sm text-gray-500">
              Supported formats: {acceptedTypes.includes('image') ? 'PNG, JPG, JPEG' : 'PDF, DOC, DOCX'}
              {acceptedTypes.includes(',') && ', PDF'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              type="button"
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              onClick={() => document.getElementById(`file-input-${sectionNumber}`)?.click()}
            >
              {buttonText}
            </Button>
            
            <input
              id={`file-input-${sectionNumber}`}
              type="file"
              accept={acceptedTypes}
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Selected Files:</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
