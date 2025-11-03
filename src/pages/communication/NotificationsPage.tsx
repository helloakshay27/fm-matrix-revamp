import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

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
    <div className="min-h-screen bg-[#fafafa] p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Send Notifications</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="max-w-3xl space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter notification title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Text Field */}
            <div className="space-y-2">
              <Label htmlFor="text" className="text-sm font-medium text-gray-700">
                Text
              </Label>
              <Textarea
                id="text"
                placeholder="Enter notification message"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full min-h-[120px] resize-none"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Attachment (Optional)
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </label>
                <span className="text-sm text-gray-600">
                  {formData.file ? formData.file.name : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Share With Section */}
            <div className="space-y-4 pt-4">
              <div className="bg-[#f6f4ee] px-4 py-2.5 rounded-md inline-block">
                <span className="text-sm font-semibold text-gray-900 tracking-wide">SHARE WITH</span>
              </div>
              
              <RadioGroup
                value={formData.shareWith}
                onValueChange={(value) => setFormData({ ...formData, shareWith: value })}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" className="border-gray-400" />
                  <Label htmlFor="all" className="text-sm font-medium text-gray-900 cursor-pointer">
                    All
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individuals" id="individuals" className="border-gray-400" />
                  <Label htmlFor="individuals" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Individuals
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="groups" id="groups" className="border-gray-400" />
                  <Label htmlFor="groups" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Groups
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 border-t">
              <Button
                type="submit"
                className="bg-[#C72030] hover:bg-[#A01828] text-white px-12 py-2.5 text-base font-medium"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationsPage;