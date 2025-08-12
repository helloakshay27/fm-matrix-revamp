import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EditSupportStaffPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    categoryName: '',
    days: '',
    hours: '',
    minutes: '',
    selectedIcon: ''
  });

  const iconOptions = [
    { id: '1', icon: '📦', name: 'Delivery' },
    { id: '2', icon: '🚛', name: 'Logistics' },
    { id: '3', icon: '🏥', name: 'Medical' },
    { id: '4', icon: '🏪', name: 'Shop' },
    { id: '5', icon: '👨‍⚕️', name: 'Doctor' },
    { id: '6', icon: '🧑‍🔧', name: 'Technician' },
    { id: '7', icon: '🧳', name: 'Travel' },
    { id: '8', icon: '💺', name: 'Haircut' },
    { id: '9', icon: '🧊', name: 'Appliance' },
    { id: '10', icon: '🏦', name: 'Banking' },
    { id: '11', icon: '🔧', name: 'Maintenance' },
    { id: '12', icon: '👨‍💼', name: 'Business' },
    { id: '13', icon: '👩‍⚕️', name: 'Nurse' },
    { id: '14', icon: '📋', name: 'Admin' },
    { id: '15', icon: '🛠️', name: 'Tools' },
    { id: '16', icon: '👨‍🍳', name: 'Chef' },
    { id: '17', icon: '👩‍💻', name: 'IT Support' },
    { id: '18', icon: '📦', name: 'Package' },
    { id: '19', icon: '👮‍♂️', name: 'Security' },
    { id: '20', icon: '🧹', name: 'Cleaning' }
  ];

  // Simulate loading existing data
  useEffect(() => {
    // Simulate API call to fetch existing data
    setTimeout(() => {
      // Pre-populate with sample data based on ID
      const sampleData = {
        '1': { categoryName: 'DTDC', days: '2', hours: '4', minutes: '30', selectedIcon: '1' },
        '2': { categoryName: 'Swiggy/Instamrt', days: '0', hours: '1', minutes: '15', selectedIcon: '2' },
        '3': { categoryName: 'OLA', days: '0', hours: '0', minutes: '30', selectedIcon: '7' },
        '4': { categoryName: 'Flipkart', days: '1', hours: '0', minutes: '0', selectedIcon: '1' },
        '5': { categoryName: 'Amazon', days: '2', hours: '0', minutes: '0', selectedIcon: '1' },
        '6': { categoryName: 'UBER', days: '0', hours: '0', minutes: '20', selectedIcon: '7' },
        '7': { categoryName: 'Zomato', days: '0', hours: '1', minutes: '0', selectedIcon: '16' }
      };
      
      if (id && sampleData[id as keyof typeof sampleData]) {
        setFormData(sampleData[id as keyof typeof sampleData]);
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.categoryName) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically submit to API
    toast({
      title: "Success",
      description: "Support staff updated successfully",
    });
    navigate('/security/visitor-management/support-staff');
  };

  const handleBack = () => {
    navigate('/security/visitor-management/support-staff');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Edit Support Staff</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name Input */}
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              placeholder="Enter Category Name"
              value={formData.categoryName}
              onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
              className="w-full"
              required
            />
          </div>

          {/* Time Inputs */}
          <div className="space-y-2">
            <Label>Estimated Time</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="days" className="text-sm text-gray-600">Days</Label>
                <Input
                  id="days"
                  placeholder="Days"
                  value={formData.days}
                  onChange={(e) => setFormData({...formData, days: e.target.value})}
                  type="number"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="hours" className="text-sm text-gray-600">Hours</Label>
                <Input
                  id="hours"
                  placeholder="Hrs"
                  value={formData.hours}
                  onChange={(e) => setFormData({...formData, hours: e.target.value})}
                  type="number"
                  min="0"
                  max="23"
                />
              </div>
              <div>
                <Label htmlFor="minutes" className="text-sm text-gray-600">Minutes</Label>
                <Input
                  id="minutes"
                  placeholder="Min"
                  value={formData.minutes}
                  onChange={(e) => setFormData({...formData, minutes: e.target.value})}
                  type="number"
                  min="0"
                  max="59"
                />
              </div>
            </div>
          </div>

          {/* Icon Selection Grid */}
          <div className="space-y-2">
            <Label>Select Icon</Label>
            <div className="grid grid-cols-6 gap-4">
              {iconOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    formData.selectedIcon === option.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => setFormData({...formData, selectedIcon: option.id})}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-xs text-center">{option.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};