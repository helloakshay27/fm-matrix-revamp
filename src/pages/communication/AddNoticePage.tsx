import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const AddNoticePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expireDate: '',
    expireTime: '',
    markAsImportant: false,
    sendEmail: false,
    shareWith: 'all',
    selectedFile: null as File | null,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        selectedFile: file,
      }));
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    // Here you would typically send the data to your backend
    toast.success('Notice created successfully!');
    navigate('/communication/notice');
  };

  const handleBack = () => {
    navigate('/communication/notice');
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
          </Button>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Add Notice</h1>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          {/* NOTICE INFO Section */}
          <div className="mb-8">
            <div className="bg-[#C4B89D54] text-[#1A1A1A] px-4 py-2 rounded font-medium mb-6">
              NOTICE INFO
            </div>

            {/* Title Field */}
            <div className="mb-6">
              <Label htmlFor="title" className="text-sm font-medium text-[#1A1A1A] mb-2 block">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
              />
            </div>

            {/* Description Field */}
            <div className="mb-6">
              <Label htmlFor="description" className="text-sm font-medium text-[#1A1A1A] mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder=""
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full min-h-[150px] border-gray-300 focus:border-[#C72030] focus:ring-[#C72030] resize-none"
              />
            </div>

            {/* Notice Expire on */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-[#1A1A1A] mb-2 block">
                Notice Expire on
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="Select Date"
                  value={formData.expireDate}
                  onChange={(e) => handleInputChange('expireDate', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
                />
                <Input
                  type="time"
                  placeholder="Select Time"
                  value={formData.expireTime}
                  onChange={(e) => handleInputChange('expireTime', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="markAsImportant"
                  checked={formData.markAsImportant}
                  onCheckedChange={(checked) => handleInputChange('markAsImportant', checked)}
                  className="border-gray-400 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                />
                <Label
                  htmlFor="markAsImportant"
                  className="text-sm font-normal text-[#1A1A1A] cursor-pointer"
                >
                  Mark as Important
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="sendEmail"
                  checked={formData.sendEmail}
                  onCheckedChange={(checked) => handleInputChange('sendEmail', checked)}
                  className="border-gray-400 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                />
                <Label
                  htmlFor="sendEmail"
                  className="text-sm font-normal text-[#1A1A1A] cursor-pointer"
                >
                  Send Email
                </Label>
              </div>
            </div>
          </div>

          {/* UPLOAD FILES Section */}
          <div className="mb-8">
            <div className="bg-[#C4B89D54] text-[#1A1A1A] px-4 py-2 rounded font-medium mb-6">
              UPLOAD FILES
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#C72030] transition-colors cursor-pointer">
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={handleFileSelect}
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-3 text-[#C72030]" />
                <span className="text-[#C72030] font-medium hover:underline">
                  Choose a file...
                </span>
              </label>
              {formData.selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {formData.selectedFile.name}
                </p>
              )}
            </div>
          </div>

          {/* SHARE WITH Section */}
          <div className="mb-8">
            <div className="bg-[#C4B89D54] text-[#1A1A1A] px-4 py-2 rounded font-medium mb-6">
              SHARE WITH
            </div>

            <RadioGroup
              value={formData.shareWith}
              onValueChange={(value) => handleInputChange('shareWith', value)}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="all"
                  id="all"
                  className="border-gray-400 text-[#C72030] focus:ring-[#C72030]"
                />
                <Label
                  htmlFor="all"
                  className="text-sm font-normal text-[#1A1A1A] cursor-pointer"
                >
                  All
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="individuals"
                  id="individuals"
                  className="border-gray-400 text-[#C72030] focus:ring-[#C72030]"
                />
                <Label
                  htmlFor="individuals"
                  className="text-sm font-normal text-[#1A1A1A] cursor-pointer"
                >
                  Individuals
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="groups"
                  id="groups"
                  className="border-gray-400 text-[#C72030] focus:ring-[#C72030]"
                />
                <Label
                  htmlFor="groups"
                  className="text-sm font-normal text-[#1A1A1A] cursor-pointer"
                >
                  Groups
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#A01A26] text-white px-12 py-2 rounded"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNoticePage;
