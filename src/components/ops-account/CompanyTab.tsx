import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';
import { getUser } from '@/utils/auth';

interface CompanyTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  entriesPerPage: string;
  setEntriesPerPage: (entries: string) => void;
}

export const CompanyTab: React.FC<CompanyTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  
  // Company state
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [canEditCompany, setCanEditCompany] = useState(false);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);
  
  // Maps for displaying related data
  const [countriesMap, setCountriesMap] = useState<Map<number, string>>(new Map());
  const [organizationsMap, setOrganizationsMap] = useState<Map<number, string>>(new Map());
  const [countriesDropdown, setCountriesDropdown] = useState<any[]>([]);
  const [organizationsDropdown, setOrganizationsDropdown] = useState<any[]>([]);
  
  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    organization_id: '',
    country_id: '',
    billing_term: '',
    billing_rate: '',
    live_date: '',
    remarks: '',
    logo: null as File | null,
    bill_to_address: { address: '', email: '' },
    postal_address: { address: '', email: '' },
    finance_spoc: { name: '', designation: '', email: '', mobile: '' },
    operation_spoc: { name: '', designation: '', email: '', mobile: '' }
  });

  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: "",
  };

  const checkEditPermission = () => {
    const userEmail = user.email || '';
    const allowedEmails = ['abhishek.sharma@lockated.com', 'your-specific-email@domain.com'];
    setCanEditCompany(allowedEmails.includes(userEmail));
  };

  useEffect(() => {
    fetchCompanies();
    fetchOrganizations();
    fetchCountriesDropdown();
    checkEditPermission();
  }, []);

  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      const response = await fetch(getFullUrl('/pms/company_setups/company_index.json'), {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Companies API response:', responseData);
        
        if (responseData && responseData.code === 200 && Array.isArray(responseData.data)) {
          setCompanies(responseData.data);
        } else if (responseData && Array.isArray(responseData.companies)) {
          setCompanies(responseData.companies);
        } else if (Array.isArray(responseData)) {
          setCompanies(responseData);
        } else {
          console.warn('Companies data format unexpected:', responseData);
          setCompanies([]);
          toast.error('Invalid companies data format');
        }
      } else {
        console.error('Failed to fetch companies:', response.statusText);
        toast.error('Failed to fetch companies');
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Error fetching companies');
      setCompanies([]);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(getFullUrl('/organizations.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.organizations && Array.isArray(data.organizations)) {
          setOrganizationsDropdown(data.organizations);
          const orgMap = new Map();
          data.organizations.forEach((org: any) => {
            orgMap.set(org.id, org.name);
          });
          setOrganizationsMap(orgMap);
        } else if (Array.isArray(data)) {
          setOrganizationsDropdown(data);
          const orgMap = new Map();
          data.forEach((org: any) => {
            orgMap.set(org.id, org.name);
          });
          setOrganizationsMap(orgMap);
        }
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchCountriesDropdown = async () => {
    try {
      const response = await fetch(getFullUrl('/pms/countries/country_list.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.countries && Array.isArray(data.countries)) {
          const mappedCountries = data.countries.map(([id, name]) => ({ id, name }));
          setCountriesDropdown(mappedCountries);
          const countryMap = new Map();
          data.countries.forEach(([id, name]) => {
            countryMap.set(id, name);
          });
          setCountriesMap(countryMap);
        }
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const createCompany = async () => {
    if (!canEditCompany) {
      toast.error('You do not have permission to create companies');
      return;
    }

    setIsCreatingCompany(true);
    try {
      const formData = new FormData();
      
      // Company setup data
      formData.append('pms_company_setup[name]', companyFormData.name);
      formData.append('pms_company_setup[organization_id]', companyFormData.organization_id);
      formData.append('pms_company_setup[country_id]', companyFormData.country_id);
      formData.append('pms_company_setup[billing_term]', companyFormData.billing_term);
      formData.append('pms_company_setup[billing_rate]', companyFormData.billing_rate);
      formData.append('pms_company_setup[live_date]', companyFormData.live_date);
      formData.append('pms_company_setup[remarks]', companyFormData.remarks);
      
      // Address data with nested attributes structure
      formData.append('pms_company_setup[bill_to_address_attributes][address]', companyFormData.bill_to_address.address);
      formData.append('pms_company_setup[bill_to_address_attributes][email]', companyFormData.bill_to_address.email);
      formData.append('pms_company_setup[bill_to_address_attributes][address_type]', 'BillTo');
      
      formData.append('pms_company_setup[postal_address_attributes][address]', companyFormData.postal_address.address);
      formData.append('pms_company_setup[postal_address_attributes][email]', companyFormData.postal_address.email);
      formData.append('pms_company_setup[postal_address_attributes][address_type]', 'Postal');

      // SPOC data with nested attributes structure
      formData.append('pms_company_setup[finance_spoc_attributes][name]', companyFormData.finance_spoc.name);
      formData.append('pms_company_setup[finance_spoc_attributes][designation]', companyFormData.finance_spoc.designation);
      formData.append('pms_company_setup[finance_spoc_attributes][email]', companyFormData.finance_spoc.email);
      formData.append('pms_company_setup[finance_spoc_attributes][mobile]', companyFormData.finance_spoc.mobile);
      formData.append('pms_company_setup[finance_spoc_attributes][spoc_type]', 'Finance');
      
      formData.append('pms_company_setup[operation_spoc_attributes][name]', companyFormData.operation_spoc.name);
      formData.append('pms_company_setup[operation_spoc_attributes][designation]', companyFormData.operation_spoc.designation);
      formData.append('pms_company_setup[operation_spoc_attributes][email]', companyFormData.operation_spoc.email);
      formData.append('pms_company_setup[operation_spoc_attributes][mobile]', companyFormData.operation_spoc.mobile);
      formData.append('pms_company_setup[operation_spoc_attributes][spoc_type]', 'Operation');
      
      // Logo
      if (companyFormData.logo) {
        formData.append('logo', companyFormData.logo);
      } else {
        formData.append('logo', '');
      }

      const response = await fetch(getFullUrl('/pms/company_setups/create_company.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('Company created successfully');
        setIsAddCompanyOpen(false);
        resetCompanyForm();
        fetchCompanies();
      } else {
        const errorData = await response.json();
        console.error('Failed to create company:', errorData);
        toast.error('Failed to create company');
      }
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Error creating company');
    } finally {
      setIsCreatingCompany(false);
    }
  };

  const updateCompany = async () => {
    if (!canEditCompany || !selectedCompany) {
      toast.error('You do not have permission to update companies');
      return;
    }

    setIsUpdatingCompany(true);
    try {
      const formData = new FormData();
      
      // Company setup data
      formData.append('pms_company_setup[name]', companyFormData.name);
      formData.append('pms_company_setup[organization_id]', companyFormData.organization_id);
      formData.append('pms_company_setup[country_id]', companyFormData.country_id);
      formData.append('pms_company_setup[billing_term]', companyFormData.billing_term);
      formData.append('pms_company_setup[billing_rate]', companyFormData.billing_rate);
      formData.append('pms_company_setup[live_date]', companyFormData.live_date);
      formData.append('pms_company_setup[remarks]', companyFormData.remarks);
      
      // Address data with nested attributes structure (include IDs for updates)
      if (selectedCompany.bill_to_address?.id) {
        formData.append('pms_company_setup[bill_to_address_attributes][id]', selectedCompany.bill_to_address.id.toString());
      }
      formData.append('pms_company_setup[bill_to_address_attributes][address]', companyFormData.bill_to_address.address);
      formData.append('pms_company_setup[bill_to_address_attributes][email]', companyFormData.bill_to_address.email);
      
      if (selectedCompany.postal_address?.id) {
        formData.append('pms_company_setup[postal_address_attributes][id]', selectedCompany.postal_address.id.toString());
      }
      formData.append('pms_company_setup[postal_address_attributes][address]', companyFormData.postal_address.address);
      formData.append('pms_company_setup[postal_address_attributes][email]', companyFormData.postal_address.email);

      // SPOC data with nested attributes structure (include IDs for updates)
      if (selectedCompany.finance_spoc?.id) {
        formData.append('pms_company_setup[finance_spoc_attributes][id]', selectedCompany.finance_spoc.id.toString());
      }
      formData.append('pms_company_setup[finance_spoc_attributes][name]', companyFormData.finance_spoc.name);
      formData.append('pms_company_setup[finance_spoc_attributes][designation]', companyFormData.finance_spoc.designation);
      formData.append('pms_company_setup[finance_spoc_attributes][email]', companyFormData.finance_spoc.email);
      formData.append('pms_company_setup[finance_spoc_attributes][mobile]', companyFormData.finance_spoc.mobile);
      
      if (selectedCompany.operation_spoc?.id) {
        formData.append('pms_company_setup[operation_spoc_attributes][id]', selectedCompany.operation_spoc.id.toString());
      }
      formData.append('pms_company_setup[operation_spoc_attributes][name]', companyFormData.operation_spoc.name);
      formData.append('pms_company_setup[operation_spoc_attributes][designation]', companyFormData.operation_spoc.designation);
      formData.append('pms_company_setup[operation_spoc_attributes][email]', companyFormData.operation_spoc.email);
      formData.append('pms_company_setup[operation_spoc_attributes][mobile]', companyFormData.operation_spoc.mobile);
      
      // Logo
      if (companyFormData.logo) {
        formData.append('logo', companyFormData.logo);
      } else {
        formData.append('logo', '');
      }

      const response = await fetch(getFullUrl(`/pms/company_setups/${selectedCompany.id}/company_update.json`), {
        method: 'PATCH',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('Company updated successfully');
        setIsEditCompanyOpen(false);
        resetCompanyForm();
        fetchCompanies();
      } else {
        const errorData = await response.json();
        console.error('Failed to update company:', errorData);
        toast.error('Failed to update company');
      }
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Error updating company');
    } finally {
      setIsUpdatingCompany(false);
    }
  };

  const handleDeleteCompany = async (companyId: number) => {
    if (!canEditCompany) {
      toast.error('You do not have permission to delete companies');
      return;
    }

    if (!confirm('Are you sure you want to delete this company?')) {
      return;
    }

    setIsDeletingCompany(true);
    try {
      const response = await fetch(getFullUrl(`/pms/company_setups/${companyId}/company_update.json`), {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (response.ok) {
        toast.success('Company deleted successfully');
        fetchCompanies();
      } else {
        toast.error('Failed to delete company');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Error deleting company');
    } finally {
      setIsDeletingCompany(false);
    }
  };

  const handleEditCompany = (company: any) => {
    if (!canEditCompany) {
      toast.error('You do not have permission to edit companies');
      return;
    }

    setSelectedCompany(company);
    setCompanyFormData({
      name: company.name || '',
      organization_id: company.organization_id?.toString() || '',
      country_id: company.country_id?.toString() || '',
      billing_term: company.billing_term || '',
      billing_rate: company.billing_rate || '',
      live_date: company.live_date || '',
      remarks: company.remarks || '',
      logo: null,
      bill_to_address: {
        address: company.bill_to_address?.address || '',
        email: company.bill_to_address?.email || ''
      },
      postal_address: {
        address: company.postal_address?.address || '',
        email: company.postal_address?.email || ''
      },
      finance_spoc: {
        name: company.finance_spoc?.name || '',
        designation: company.finance_spoc?.designation || '',
        email: company.finance_spoc?.email || '',
        mobile: company.finance_spoc?.mobile || ''
      },
      operation_spoc: {
        name: company.operation_spoc?.name || '',
        designation: company.operation_spoc?.designation || '',
        email: company.operation_spoc?.email || '',
        mobile: company.operation_spoc?.mobile || ''
      }
    });
    setIsEditCompanyOpen(true);
  };

  const resetCompanyForm = () => {
    setCompanyFormData({
      name: '',
      organization_id: '',
      country_id: '',
      billing_term: '',
      billing_rate: '',
      live_date: '',
      remarks: '',
      logo: null,
      bill_to_address: { address: '', email: '' },
      postal_address: { address: '', email: '' },
      finance_spoc: { name: '', designation: '', email: '', mobile: '' },
      operation_spoc: { name: '', designation: '', email: '', mobile: '' }
    });
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCompanyFormData({ ...companyFormData, logo: file });
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    organizationsMap.get(company.organization_id)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    countriesMap.get(company.country_id)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Company</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={companyFormData.name}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="organization">Organization *</Label>
                <Select value={companyFormData.organization_id} onValueChange={(value) => setCompanyFormData({ ...companyFormData, organization_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationsDropdown.map((org) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select value={companyFormData.country_id} onValueChange={(value) => setCompanyFormData({ ...companyFormData, country_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countriesDropdown.map((country) => (
                      <SelectItem key={country.id} value={country.id.toString()}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="billing_term">Billing Term</Label>
                <Input
                  id="billing_term"
                  value={companyFormData.billing_term}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, billing_term: e.target.value })}
                  placeholder="Enter billing term"
                />
              </div>
              <div>
                <Label htmlFor="billing_rate">Billing Rate</Label>
                <Input
                  id="billing_rate"
                  value={companyFormData.billing_rate}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, billing_rate: e.target.value })}
                  placeholder="Enter billing rate"
                />
              </div>
              <div>
                <Label htmlFor="live_date">Live Date</Label>
                <Input
                  id="live_date"
                  type="date"
                  value={companyFormData.live_date}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, live_date: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  value={companyFormData.remarks}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, remarks: e.target.value })}
                  placeholder="Enter remarks"
                />
              </div>
              <div>
                <Label htmlFor="logo">Company Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  onChange={handleLogoChange}
                  accept="image/*"
                />
              </div>
              <div>
                <Label htmlFor="bill_to_address">Bill To Address</Label>
                <Input
                  id="bill_to_address"
                  value={companyFormData.bill_to_address.address}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    bill_to_address: { ...companyFormData.bill_to_address, address: e.target.value }
                  })}
                  placeholder="Enter bill to address"
                />
              </div>
              <div>
                <Label htmlFor="bill_to_email">Bill To Email</Label>
                <Input
                  id="bill_to_email"
                  value={companyFormData.bill_to_address.email}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    bill_to_address: { ...companyFormData.bill_to_address, email: e.target.value }
                  })}
                  placeholder="Enter bill to email"
                />
              </div>
              <div>
                <Label htmlFor="postal_address">Postal Address</Label>
                <Input
                  id="postal_address"
                  value={companyFormData.postal_address.address}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    postal_address: { ...companyFormData.postal_address, address: e.target.value }
                  })}
                  placeholder="Enter postal address"
                />
              </div>
              <div>
                <Label htmlFor="postal_email">Postal Email</Label>
                <Input
                  id="postal_email"
                  value={companyFormData.postal_address.email}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    postal_address: { ...companyFormData.postal_address, email: e.target.value }
                  })}
                  placeholder="Enter postal email"
                />
              </div>
              
              {/* Finance SPOC */}
              <div className="col-span-2">
                <h3 className="font-semibold text-lg mt-4 mb-2">Finance SPOC</h3>
              </div>
              <div>
                <Label htmlFor="finance_name">Name</Label>
                <Input
                  id="finance_name"
                  value={companyFormData.finance_spoc.name}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    finance_spoc: { ...companyFormData.finance_spoc, name: e.target.value }
                  })}
                  placeholder="Enter finance SPOC name"
                />
              </div>
              <div>
                <Label htmlFor="finance_designation">Designation</Label>
                <Input
                  id="finance_designation"
                  value={companyFormData.finance_spoc.designation}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    finance_spoc: { ...companyFormData.finance_spoc, designation: e.target.value }
                  })}
                  placeholder="Enter finance SPOC designation"
                />
              </div>
              <div>
                <Label htmlFor="finance_email">Email</Label>
                <Input
                  id="finance_email"
                  value={companyFormData.finance_spoc.email}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    finance_spoc: { ...companyFormData.finance_spoc, email: e.target.value }
                  })}
                  placeholder="Enter finance SPOC email"
                />
              </div>
              <div>
                <Label htmlFor="finance_mobile">Mobile</Label>
                <Input
                  id="finance_mobile"
                  value={companyFormData.finance_spoc.mobile}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    finance_spoc: { ...companyFormData.finance_spoc, mobile: e.target.value }
                  })}
                  placeholder="Enter finance SPOC mobile"
                />
              </div>
              
              {/* Operation SPOC */}
              <div className="col-span-2">
                <h3 className="font-semibold text-lg mt-4 mb-2">Operation SPOC</h3>
              </div>
              <div>
                <Label htmlFor="operation_name">Name</Label>
                <Input
                  id="operation_name"
                  value={companyFormData.operation_spoc.name}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    operation_spoc: { ...companyFormData.operation_spoc, name: e.target.value }
                  })}
                  placeholder="Enter operation SPOC name"
                />
              </div>
              <div>
                <Label htmlFor="operation_designation">Designation</Label>
                <Input
                  id="operation_designation"
                  value={companyFormData.operation_spoc.designation}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    operation_spoc: { ...companyFormData.operation_spoc, designation: e.target.value }
                  })}
                  placeholder="Enter operation SPOC designation"
                />
              </div>
              <div>
                <Label htmlFor="operation_email">Email</Label>
                <Input
                  id="operation_email"
                  value={companyFormData.operation_spoc.email}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    operation_spoc: { ...companyFormData.operation_spoc, email: e.target.value }
                  })}
                  placeholder="Enter operation SPOC email"
                />
              </div>
              <div>
                <Label htmlFor="operation_mobile">Mobile</Label>
                <Input
                  id="operation_mobile"
                  value={companyFormData.operation_spoc.mobile}
                  onChange={(e) => setCompanyFormData({ 
                    ...companyFormData, 
                    operation_spoc: { ...companyFormData.operation_spoc, mobile: e.target.value }
                  })}
                  placeholder="Enter operation SPOC mobile"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCompanyOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={createCompany} 
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                disabled={isCreatingCompany}
              >
                {isCreatingCompany ? 'Creating...' : 'Create Company'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="flex items-center gap-4">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-600">entries per page</span>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Organization</TableHead>
                <TableHead className="font-semibold">Country</TableHead>
                <TableHead className="font-semibold">Live Date</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingCompanies ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading companies...
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No companies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.id}</TableCell>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{organizationsMap.get(company.organization_id) || '-'}</TableCell>
                    <TableCell>{countriesMap.get(company.country_id) || '-'}</TableCell>
                    <TableCell>{company.live_date || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCompany(company)}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCompany(company.id)}
                          className="hover:bg-red-100 text-red-600"
                          disabled={isDeletingCompany}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Company Dialog - Similar to Add but with different title and update function */}
      <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_name">Company Name *</Label>
              <Input
                id="edit_name"
                value={companyFormData.name}
                onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="edit_organization">Organization *</Label>
              <Select value={companyFormData.organization_id} onValueChange={(value) => setCompanyFormData({ ...companyFormData, organization_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizationsDropdown.map((org) => (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_country">Country *</Label>
              <Select value={companyFormData.country_id} onValueChange={(value) => setCompanyFormData({ ...companyFormData, country_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countriesDropdown.map((country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_billing_term">Billing Term</Label>
              <Input
                id="edit_billing_term"
                value={companyFormData.billing_term}
                onChange={(e) => setCompanyFormData({ ...companyFormData, billing_term: e.target.value })}
                placeholder="Enter billing term"
              />
            </div>
            <div>
              <Label htmlFor="edit_billing_rate">Billing Rate</Label>
              <Input
                id="edit_billing_rate"
                value={companyFormData.billing_rate}
                onChange={(e) => setCompanyFormData({ ...companyFormData, billing_rate: e.target.value })}
                placeholder="Enter billing rate"
              />
            </div>
            <div>
              <Label htmlFor="edit_live_date">Live Date</Label>
              <Input
                id="edit_live_date"
                type="date"
                value={companyFormData.live_date}
                onChange={(e) => setCompanyFormData({ ...companyFormData, live_date: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit_remarks">Remarks</Label>
              <Input
                id="edit_remarks"
                value={companyFormData.remarks}
                onChange={(e) => setCompanyFormData({ ...companyFormData, remarks: e.target.value })}
                placeholder="Enter remarks"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCompanyOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={updateCompany} 
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
              disabled={isUpdatingCompany}
            >
              {isUpdatingCompany ? 'Updating...' : 'Update Company'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
