import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const NotificationsPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    file: null as File | null,
    shareWith: 'all',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!formData.text.trim()) {
      toast.error('Please enter notification text');
      return;
    }

    // Here you would send the notification
    toast.success('Notification sent successfully!');
    
    // Reset form
    setFormData({
      title: '',
      text: '',
      file: null,
      shareWith: 'all',
    });
  };

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-6">Send Notifications</h1>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {/* Title Field */}
          <div className="mb-4">
            <Label htmlFor="title" className="text-sm font-medium text-[#1A1A1A] mb-2 block">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-64"
            />
          </div>

          {/* Text Field */}
          <div className="mb-4">
            <Label htmlFor="text" className="text-sm font-medium text-[#1A1A1A] mb-2 block">
              Text
            </Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-64 h-24 resize-none"
            />
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 text-sm text-[#1A1A1A]"
            >
              Choose File
            </label>
            <span className="ml-3 text-sm text-[#6B7280]">
              {formData.file ? formData.file.name : 'No file chosen'}
            </span>
          </div>

          {/* Share With Section */}
          <div className="mb-6">
            <div className="bg-[#E8F5F0] px-4 py-2 inline-block mb-4">
              <span className="text-sm font-medium text-[#1A1A1A] tracking-wide">SHARE WITH</span>
            </div>
            
            <RadioGroup
              value={formData.shareWith}
              onValueChange={(value) => setFormData({ ...formData, shareWith: value })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="text-sm font-normal text-[#1A1A1A] cursor-pointer">
                  All
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individuals" id="individuals" />
                <Label htmlFor="individuals" className="text-sm font-normal text-[#1A1A1A] cursor-pointer">
                  Individuals
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="groups" id="groups" />
                <Label htmlFor="groups" className="text-sm font-normal text-[#1A1A1A] cursor-pointer">
                  Groups
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <Button
              type="submit"
              className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationsPage;