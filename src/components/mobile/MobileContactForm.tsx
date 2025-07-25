import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  contactNumber: string;
  name: string;
  email: string;
}

export const MobileContactForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { items, restaurant, note } = location.state;

  const [formData, setFormData] = useState<ContactFormData>({
    contactNumber: '',
    name: '',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return formData.contactNumber.trim() !== '' && 
           formData.name.trim() !== '' && 
           formData.email.trim() !== '';
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to place order with contact details
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to order review with contact details
      navigate(`/mobile/restaurant/${restaurant.id}/order-review`, {
        state: { 
          items, 
          restaurant, 
          note,
          contactDetails: formData,
          isAppUser: false 
        }
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit order. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Order Review</h1>
        </div>
      </div>

      {/* Contact Details Form */}
      <div className="p-4">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
          </div>

          <div className="p-4 space-y-6">
            {/* Contact Number */}
            <div>
              <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700 mb-2 block">
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="Enter Your Number"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Your Mail ID"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid() || isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </div>
  );
};