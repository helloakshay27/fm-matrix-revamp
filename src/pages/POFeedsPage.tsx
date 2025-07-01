
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';

export const POFeedsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const feeds = [
    {
      date: 'Apr 22, 2025',
      time: '11:34 AM',
      user: 'Sony Bhosle',
      action: 'made below changes.',
      status: 'L1 - Approved'
    },
    {
      date: 'Apr 22, 2025', 
      time: '11:34 AM',
      user: '',
      action: 'made below changes.',
      status: 'L1 - Rejected',
      reason: 'Rejection Reason'
    },
    {
      date: 'Apr 22, 2025',
      time: '11:34 AM', 
      user: '',
      action: 'PO Created.',
      status: ''
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    console.log('Submitting comment:', comment);
    console.log('Attachments:', attachments);
    
    toast.success('Comment added successfully');
    setComment('');
    setAttachments([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="text-sm text-gray-600 mb-1">Finance</div>
          <h1 className="text-2xl font-bold">Feeds</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Timeline */}
        <div className="space-y-6 mb-8">
          {feeds.map((feed, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                {index < feeds.length - 1 && <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>}
              </div>
              
              <div className="flex-1">
                <div className="text-sm text-gray-500">
                  {feed.date}
                </div>
                <div className="text-sm text-gray-500">
                  {feed.time}
                </div>
                <div className="mt-1">
                  <span className="font-medium">{feed.user}</span>
                  <span className="text-gray-700"> - {feed.action}</span>
                </div>
                
                {feed.status && (
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                      feed.status.includes('Approved') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {feed.status}
                    </span>
                  </div>
                )}
                
                {feed.reason && (
                  <div className="mt-2 text-sm text-gray-700">
                    <strong>{feed.reason}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Add Comment</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment..."
                className="min-h-[100px] focus:ring-[#BF213E] focus:border-[#BF213E]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload files or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Support for multiple file uploads
                  </span>
                </label>
              </div>

              {/* Display uploaded files */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Uploaded Files:</h4>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
                className="hover:bg-[#F2EEE9]/90"
              >
                Submit Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
