import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, File, Image } from 'lucide-react';
export const AttachmentsTab = () => {
  const [activeType, setActiveType] = useState('Manuals Upload');
  const attachmentTypes = [{
    name: 'Manuals Upload',
    count: 10,
    active: true
  }, {
    name: 'Insurance Details',
    count: 5,
    active: false
  }, {
    name: 'Purchase Invoice',
    count: 1,
    active: false
  }, {
    name: 'Other Uploads',
    count: 1,
    active: false
  }];
  const fileData = [{
    name: 'Image.png',
    type: 'image'
  }, {
    name: 'File1.pdf',
    type: 'pdf'
  }, {
    name: 'Image.jpg',
    type: 'image'
  }, {
    name: 'File1.pdf',
    type: 'pdf'
  }, {
    name: 'File2.pdf',
    type: 'pdf'
  }, {
    name: 'Image.png',
    type: 'image'
  }, {
    name: 'Image.png',
    type: 'image'
  }, {
    name: 'Image.png',
    type: 'image'
  }, {
    name: 'File2.pdf',
    type: 'pdf'
  }, {
    name: 'Image.png',
    type: 'image'
  }];
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-6 h-6 text-gray-600" />;
      case 'pdf':
        return <File className="w-6 h-6 text-red-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };
  return <div className="space-y-6">
      {/* Attachment Type Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 overflow-x-auto pb-2">
        {attachmentTypes.map((type, index) => <Button key={index} variant={type.name === activeType ? "default" : "outline"} className={`flex items-center gap-2 whitespace-nowrap min-w-fit px-4 py-2 rounded-lg ${type.name === activeType ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"}`} onClick={() => setActiveType(type.name)}>
            <div className="w-4 h-4 rounded flex-shrink-0 bg-red-700"></div>
            <span className="text-sm font-medium">{type.name}</span>
            <span className="text-xs">{type.count} Files</span>
          </Button>)}
      </div>

      {/* Files Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Files</h3>
        
        {/* Files Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {fileData.map((file, index) => <div key={index} className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
              {/* File Preview */}
              <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center border">
                {file.type === 'image' ? <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div> : <div className="w-full h-full bg-white rounded flex flex-col items-center justify-center p-2">
                    <div className="text-xs text-gray-600 font-mono leading-tight text-center">
                      {/* Simulated document content lines */}
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-300 rounded w-full"></div>
                        <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-1 bg-gray-300 rounded w-full"></div>
                        <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="mt-2">
                      {getFileIcon(file.type)}
                    </div>
                  </div>}
              </div>
              
              {/* File Name */}
              <p className="text-sm text-gray-700 text-center font-medium">
                {file.name}
              </p>
            </div>)}
        </div>
      </div>
    </div>;
};