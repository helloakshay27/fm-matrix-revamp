import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Calendar, Clock, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface PollOption {
  id: string;
  value: string;
}

const AddPollPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    subject: '',
    startDate: '',
    startTime: '03:00 PM',
    endDate: '',
    endTime: '03:00 PM',
    flat: '',
    shareWith: 'all',
  });

  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', value: '' },
    { id: '2', value: '' },
  ]);

  const handleAddOption = () => {
    const newOption: PollOption = {
      id: Date.now().toString(),
      value: '',
    };
    setOptions([...options, newOption]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== id));
    } else {
      toast.error('Poll must have at least 2 options');
    }
  };

  const handleOptionChange = (id: string, value: string) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, value } : option
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    const filledOptions = options.filter((opt) => opt.value.trim());
    if (filledOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    // Submit poll
    console.log('Poll Data:', { ...formData, options: filledOptions });
    toast.success('Poll created successfully!');
    
    // Navigate back to polls page
    setTimeout(() => {
      navigate('/communication/polls');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/communication/polls')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Create New Poll</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Subject Field */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Subject
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="Enter poll subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full"
              />
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Start Date and Time */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                    Start Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                    Start Time
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* End Date and Time */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                    End Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                    End Time
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Flat Selection */}
            <div className="space-y-2">
              <Label htmlFor="flat" className="text-sm font-medium text-gray-700">
                Select Flat
              </Label>
              <div className="flex items-center gap-4">
                <Select
                  value={formData.flat}
                  onValueChange={(value) =>
                    setFormData({ ...formData, flat: value })
                  }
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat1">Flat 1</SelectItem>
                    <SelectItem value="flat2">Flat 2</SelectItem>
                    <SelectItem value="flat3">Flat 3</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">
                  User can participate in the poll from a Flat.
                </span>
              </div>
            </div>

            {/* Poll Options */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Poll Options</Label>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option.value}
                      onChange={(e) =>
                        handleOptionChange(option.id, e.target.value)
                      }
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(option.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <Button
                type="button"
                onClick={handleAddOption}
                variant="outline"
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add option
              </Button>
            </div>

            {/* Share With Section */}
            <div className="space-y-4 pt-4">
              <div className="bg-[#f6f4ee] px-4 py-2.5 rounded-md inline-block">
                <span className="text-sm font-semibold text-gray-900 tracking-wide">
                  SHARE WITH
                </span>
              </div>

              <RadioGroup
                value={formData.shareWith}
                onValueChange={(value) =>
                  setFormData({ ...formData, shareWith: value })
                }
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="all"
                    id="all"
                    className="border-gray-400"
                  />
                  <Label
                    htmlFor="all"
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    All
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="individual"
                    id="individual"
                    className="border-gray-400"
                  />
                  <Label
                    htmlFor="individual"
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Individual
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="group"
                    id="group"
                    className="border-gray-400"
                  />
                  <Label
                    htmlFor="group"
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Group
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 border-t">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-2.5 text-base font-medium"
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

export default AddPollPage;
