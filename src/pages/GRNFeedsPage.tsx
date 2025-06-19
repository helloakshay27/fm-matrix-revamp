
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from "sonner";

export const GRNFeedsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const feedsData = [
    {
      id: 1,
      date: "Apr 22, 2025",
      time: "12:16 PM",
      user: "Sony Bhosle",
      action: "made below changes.",
      level: "Level 1",
      status: "Approved"
    },
    {
      id: 2,
      date: "Apr 22, 2025",
      time: "12:14 PM",
      user: "Sony Bhosle",
      action: "made below changes.",
      level: "Level 1",
      status: "Rejected",
      rejectionReason: "Rejection Reason"
    },
    {
      id: 3,
      date: "Apr 22, 2025",
      time: "12:14 PM",
      user: "System",
      action: "GRN Created.",
      level: "",
      status: ""
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) uploaded successfully`);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    toast.success("File removed successfully");
  };

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    // Handle comment submission logic here
    console.log('Submitting comment:', comment);
    console.log('Attachments:', attachments);
    
    toast.success("Comment added successfully");
    setComment('');
    setAttachments([]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) uploaded successfully`);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button 
            onClick={() => navigate(`/finance/grn-srn/details/${id}`)}
            className="flex items-center gap-1 hover:text-[#C72030] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to GRN Details</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>GRN Order</span>
          <span>&gt;</span>
          <span>Feeds</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Feeds</h1>
      </div>

      {/* Feeds Timeline */}
      <div className="space-y-4 mb-8">
        {feedsData.map((feed) => (
          <Card key={feed.id} className="border-l-4 border-l-[#C72030]">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{feed.date}</span>
                  <span className="text-sm text-gray-600">{feed.time}</span>
                </div>
                {feed.status && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    feed.status === 'Approved' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {feed.status}
                  </span>
                )}
              </div>
              
              <div className="mb-2">
                <span className="font-medium text-gray-900">{feed.user}</span>
                <span className="text-gray-600 ml-1">- {feed.action}</span>
              </div>
              
              {feed.level && (
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {feed.level} - {feed.status}
                </div>
              )}
              
              {feed.rejectionReason && (
                <div className="text-sm text-red-600 font-medium">
                  {feed.rejectionReason}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Comment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1a1a1a]">Add Comment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comment Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent resize-none"
              rows={4}
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#C72030] transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Drag and drop files here or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, JPG, PNG, DOCX
              </p>
            </div>
            
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Uploaded Files List */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#C72030] rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-6"
            >
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
