import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, User } from 'lucide-react';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';
import { createOrganizationAdmin, getOrganizations, getCompanies } from '@/services/adminUserAPI';

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  organization_id: string;
  company_id: string;
}

interface Organization {
  id: number;
  name: string;
  active: boolean;
}

interface Company {
  id: number;
  name: string;
  organization_id: number;
}

export const CreateAdminUserPage = () => {
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();
  
  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    organization_id: '',
    company_id: ''
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOrganizations, setLoadingOrganizations] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
    fetchCompanies();
  }, []);

  // Filter companies when organization is selected
  useEffect(() => {
    if (formData.organization_id) {
      const filtered = companies.filter(
        company => company.organization_id.toString() === formData.organization_id
      );
      setFilteredCompanies(filtered);
      // Reset company selection if current selection is not in filtered list
      if (formData.company_id && !filtered.find(c => c.id.toString() === formData.company_id)) {
        setFormData(prev => ({ ...prev, company_id: '' }));
      }
    } else {
      setFilteredCompanies([]);
      setFormData(prev => ({ ...prev, company_id: '' }));
    }
  }, [formData.organization_id, companies]);

  const fetchOrganizations = async () => {
    setLoadingOrganizations(true);
    try {
      const result = await getOrganizations();
      
      if (result.success && result.data) {
        setOrganizations(result.data);
      } else {
        console.error('Failed to fetch organizations:', result.error);
        toast.error(result.error || 'Failed to load organizations');
        setOrganizations([]);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Error loading organizations');
      setOrganizations([]);
    } finally {
      setLoadingOrganizations(false);
    }
  };

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const result = await getCompanies();
      
      if (result.success && result.data) {
        setCompanies(result.data);
      } else {
        console.error('Failed to fetch companies:', result.error);
        toast.error(result.error || 'Failed to load companies');
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Error loading companies');
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstname.trim()) {
      toast.error('First name is required');
      return false;
    }
    if (!formData.lastname.trim()) {
      toast.error('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.mobile.trim()) {
      toast.error('Mobile number is required');
      return false;
    }
    if (!formData.mobile.match(/^\d{10,15}$/)) {
      toast.error('Please enter a valid mobile number (10-15 digits)');
      return false;
    }
    if (!formData.organization_id) {
      toast.error('Organization is required');
      return false;
    }
    if (!formData.company_id) {
      toast.error('Company is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Prepare the payload according to the API specification
      const payload = {
        user: {
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          email: formData.email.trim().toLowerCase(),
          mobile: formData.mobile.trim(),
          organization_id: parseInt(formData.organization_id),
          company_id: parseInt(formData.company_id)
        }
      };

      console.log('Creating admin user with payload:', payload);

      const result = await createOrganizationAdmin(payload);

      if (result.success) {
        console.log('Admin user created successfully:', result.data);
        toast.success('Organization admin user created successfully!');
        
        // Navigate back to the users list or admin console
        navigate('/ops-console/master/user/fm-users');
      } else {
        console.error('Failed to create admin user:', result.error);
        toast.error(result.error || 'Failed to create admin user');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/ops-console/master/user/fm-users');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Create Organization Admin User</h1>
          <p className="text-sm text-gray-600 mt-1">Create a new organization admin user with appropriate permissions</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstname"
                  value={formData.firstname}
                  onChange={(e) => handleInputChange('firstname', e.target.value)}
                  placeholder="Enter first name"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                  Last Name *
                </Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) => handleInputChange('lastname', e.target.value)}
                  placeholder="Enter last name"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                  Mobile Number *
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 15) {
                      handleInputChange('mobile', value);
                    }
                  }}
                  placeholder="Enter mobile number"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {/* Organization Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization" className="text-sm font-medium text-gray-700">
                  Organization *
                </Label>
                <Select
                  value={formData.organization_id}
                  onValueChange={(value) => handleInputChange('organization_id', value)}
                  disabled={loadingOrganizations}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={loadingOrganizations ? "Loading organizations..." : "Select organization"} />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                  Company *
                </Label>
                <Select
                  value={formData.company_id}
                  onValueChange={(value) => handleInputChange('company_id', value)}
                  disabled={loadingCompanies || !formData.organization_id || filteredCompanies.length === 0}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue 
                      placeholder={
                        !formData.organization_id
                          ? "Select organization first"
                          : loadingCompanies
                          ? "Loading companies..."
                          : filteredCompanies.length === 0
                          ? "No companies available"
                          : "Select company"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Admin User
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
