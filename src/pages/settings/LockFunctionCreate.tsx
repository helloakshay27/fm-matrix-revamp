import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';

// Lock types available
const lockTypes = [
  { value: 'SYSTEM', label: 'System Lock' },
  { value: 'USER', label: 'User Lock' },
  { value: 'ADMIN', label: 'Admin Lock' },
  { value: 'TEMPORARY', label: 'Temporary Lock' }
];

// Duration options
const durationOptions = [
  { value: '15m', label: '15 minutes' },
  { value: '30m', label: '30 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '2h', label: '2 hours' },
  { value: '4h', label: '4 hours' },
  { value: '8h', label: '8 hours' },
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'permanent', label: 'Permanent' }
];

export const LockFunctionCreate: React.FC = () => {
  const navigate = useNavigate();

  // Set document title
  useEffect(() => {
    document.title = 'Create Lock Function';
  }, []);

  // Form state similar to CreateShiftDialog
  const [functionName, setFunctionName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [lockType, setLockType] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [autoRelease, setAutoRelease] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validateForm = () => {
    if (!functionName.trim()) {
      toast.error('Function name is required');
      return false;
    }

    if (!description.trim()) {
      toast.error('Description is required');
      return false;
    }

    if (!lockType) {
      toast.error('Lock type must be selected');
      return false;
    }

    if (!duration) {
      toast.error('Duration must be selected');
      return false;
    }

    return true;
  };

  // Handle create - similar to CreateShiftDialog
  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    // Build API payload
    const payload = {
      lock_function: {
        name: functionName,
        description: description,
        lock_type: lockType,
        duration: duration,
        auto_release: autoRelease,
        active: isActive
      }
    };

    try {
      // Mock API call - replace with actual API when backend is ready
      console.log('Creating lock function:', payload);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      toast.success('Lock function created successfully!');
      
      // Navigate back to list
      navigate('/settings/account/lock-function');

    } catch (error: any) {
      console.error('Error creating lock function:', error);
      toast.error(`Failed to create lock function: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/settings/account/lock-function')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="w-10 h-10 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide uppercase">Create Lock Function</h1>
            <p className="text-gray-600">Set up new system lock function</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 space-y-6">
            {/* Function Name */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Function Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
                placeholder="Enter function name"
                className="rounded-none border border-gray-300 h-10"
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter function description"
                className="rounded-none border border-gray-300 min-h-[80px]"
                disabled={isSubmitting}
              />
            </div>

            {/* Lock Type */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Lock Type <span className="text-red-500">*</span>
              </Label>
              <Select value={lockType} onValueChange={setLockType} disabled={isSubmitting}>
                <SelectTrigger className="rounded-none border border-gray-300 h-10">
                  <SelectValue placeholder="Select lock type" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-none">
                  {lockTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Duration <span className="text-red-500">*</span>
              </Label>
              <Select value={duration} onValueChange={setDuration} disabled={isSubmitting}>
                <SelectTrigger className="rounded-none border border-gray-300 h-10">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-60 rounded-none">
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto Release */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="auto-release" 
                checked={autoRelease}
                onCheckedChange={(checked) => setAutoRelease(checked as boolean)}
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="auto-release" 
                className="text-sm font-medium text-gray-700"
              >
                Auto Release After Duration
              </Label>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="active-status" 
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked as boolean)}
                disabled={isSubmitting}
              />
              <Label 
                htmlFor="active-status" 
                className="text-sm font-medium text-gray-700"
              >
                Active Function
              </Label>
            </div>

            {/* Create Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleCreate}
                disabled={isSubmitting}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 rounded-none shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Lock Function'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
