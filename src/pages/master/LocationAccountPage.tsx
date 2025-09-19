import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Upload, X, Edit, File } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';
import { getUser } from '@/utils/auth';

// List of all world countries


export const LocationAccountPage = () => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [activeTab, setActiveTab] = useState('organization');
  const [searchQuery, setSearchQuery] = useState('');
  const [companyName, setCompanyName] = useState("");
  const [removeLogo, setRemoveLogo] = useState(false);
  const [dailyReport, setDailyReport] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [entityName, setEntityName] = useState('');
  const [userCategoryName, setUserCategoryName] = useState('');
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [isAddRegionOpen, setIsAddRegionOpen] = useState(false);
  const [isAddZoneOpen, setIsAddZoneOpen] = useState(false);
  const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
  const [isAddUserCategoryOpen, setIsAddUserCategoryOpen] = useState(false);
  const [isEditZoneOpen, setIsEditZoneOpen] = useState(false);
  const [selectedZonesForEdit, setSelectedZonesForEdit] = useState<string[]>([]);
  const [isEditZoneFormOpen, setIsEditZoneFormOpen] = useState(false);
  const [editZoneData, setEditZoneData] = useState({
    zoneName: '',
    headquarter: '',
    region: ''
  });
  const [newRegionData, setNewRegionData] = useState({
    country: '',
    regionName: ''
  });
  const [showEntityForm, setShowEntityForm] = useState(false);
  const [newZoneData, setNewZoneData] = useState({
    country: '',
    region: '',
    zoneName: ''
  });
  const [isLoadingUserCategories, setIsLoadingUserCategories] = useState(false);

  // Organization state
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);
  const [isAddOrgOpen, setIsAddOrgOpen] = useState(false);
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<any>(null);
  const [orgFormData, setOrgFormData] = useState({
    name: '',
    description: '',
    domain: '',
    sub_domain: '',
    front_domain: '',
    front_subdomain: '',
    country_id: '',
    logo: null as File | null
  });
  const [countriesDropdown, setCountriesDropdown] = useState<any[]>([]);
  const [canEditOrganization, setCanEditOrganization] = useState(false);

  // Countries state for API management
  const [countries, setCountries] = useState<any[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isEditCountryOpen, setIsEditCountryOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<any>(null);
  const [countryFormData, setCountryFormData] = useState({
    name: '',
    logo: null as File | null
  });
  const [canEditCountry, setCanEditCountry] = useState(false);

  // Company Setup state for API management
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
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
  const [canEditCompany, setCanEditCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [companyCurrentPage, setCompanyCurrentPage] = useState(1);
  const companiesPerPage = 10;
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);

  const [regions, setRegions] = useState([
    { country: 'India', region: 'East', status: true },
    { country: 'India', region: 'South', status: true },
    { country: 'India', region: 'North', status: true },
    { country: 'India', region: 'West', status: true },
  ]);

  const [zones, setZones] = useState([
    { country: 'India', region: 'West', zone: 'Bali', status: true, icon: '/placeholder.svg' },
    { country: 'India', region: 'North', zone: 'Delhi', status: true, icon: '/placeholder.svg' },
    { country: 'India', region: 'West', zone: 'Mumbai', status: true, icon: '/placeholder.svg' },
  ]);

  const [sites, setSites] = useState([
    { country: 'India', region: 'West', zone: 'Mumbai', site: 'Lockated', latitude: '19.0760', longitude: '72.8777', status: true, qrCode: '/placeholder.svg' },
  ]);

  const [entities, setEntities] = useState([
    { entity: 'GoPhygital', status: true },
    { entity: 'TCS', status: true },
    { entity: 'Andheri', status: false },
    { entity: 'Noid 62', status: true },
    { entity: 'HSBC', status: true },
    { entity: 'lockated', status: true },
    { entity: 'demo', status: false },
    { entity: 'Sohail Ansari', status: true },
  ]);

  const [userCategories, setUserCategories] = useState<any[]>([]);
  const [isEditUserCategoryOpen, setIsEditUserCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: number, name: string, resource_type?: string, resource_id?: number } | null>(null);

  // Fetch user categories from API
  useEffect(() => {
    if (activeTab === 'user-category') {
      fetchUserCategories();
    }
  }, [activeTab]);

  // Fetch companies from API
  useEffect(() => {
    if (activeTab === 'company') {
      fetchCompanies();
      fetchOrganizations(); // For dropdown
      fetchCountriesDropdown(); // For dropdown
      checkEditPermission();
    }
  }, [activeTab]);

  // Fetch countries from API
  useEffect(() => {
    if (activeTab === 'country') {
      fetchCountries();
      checkEditPermission();
    }
  }, [activeTab]);

  // Fetch organizations and check permissions
  useEffect(() => {
    if (activeTab === 'organization') {
      fetchOrganizations();
      fetchCountriesDropdown();
      checkEditPermission();
    }
  }, [activeTab]);
     const user = getUser() || {
        id: 0,
        firstname: "Guest",
        lastname: "",
        email: "",
      };

  const checkEditPermission = () => {
   
    // Check if user email allows editing - replace with your specific email or permission logic
    const userEmail = user.email || '';
    const allowedEmails = ['abhishek.sharma@lockated.com', 'your-specific-email@domain.com']; // Add your specific email here
    setCanEditOrganization(allowedEmails.includes(userEmail));
    setCanEditCountry(allowedEmails.includes(userEmail));
    setCanEditCompany(allowedEmails.includes(userEmail));
  };

  const fetchOrganizations = async () => {
    setIsLoadingOrganizations(true);
    try {
      const response = await fetch(getFullUrl('/organizations.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Organizations API response:', data);
        
        // Handle nested response structure: { organizations: [...] }
        if (data && data.organizations && Array.isArray(data.organizations)) {
          setOrganizations(data.organizations);
        } else if (Array.isArray(data)) {
          // Fallback for direct array response
          setOrganizations(data);
        } else {
          console.error('Organizations data format unexpected:', data);
          setOrganizations([]);
          toast.error('Invalid organizations data format');
        }
      } else {
        toast.error('Failed to fetch organizations');
        setOrganizations([]);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Error fetching organizations');
      setOrganizations([]);
    } finally {
      setIsLoadingOrganizations(false);
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
        console.log('Countries API response:', data);
        
        // Handle nested response structure: { countries: [[id, name], ...] }
        if (data && data.countries && Array.isArray(data.countries)) {
          const mappedCountries = data.countries.map(([id, name]) => ({ id, name }));
          setCountriesDropdown(mappedCountries);
        } else if (Array.isArray(data)) {
          // Fallback for direct array response
          const mappedCountries = data.map((item) => {
            if (Array.isArray(item) && item.length >= 2) {
              return { id: item[0], name: item[1] };
            }
            return { id: item.id || item.value, name: item.name || item.label };
          });
          setCountriesDropdown(mappedCountries);
        } else {
          console.error('Countries data format unexpected:', data);
          setCountriesDropdown([]);
          toast.error('Invalid countries data format');
        }
      } else {
        toast.error('Failed to fetch countries');
        setCountriesDropdown([]);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Error fetching countries');
      setCountriesDropdown([]);
    }
  };

  const handleCreateOrganization = async () => {
    if (!orgFormData.name.trim()) {
      toast.error('Please enter organization name');
      return;
    }

    if (!canEditOrganization) {
      toast.error('You do not have permission to create organizations');
      return;
    }

    const formData = new FormData();
    formData.append('organization[name]', orgFormData.name);
    formData.append('organization[description]', orgFormData.description);
    formData.append('organization[domain]', orgFormData.domain);
    formData.append('organization[sub_domain]', orgFormData.sub_domain);
    formData.append('organization[front_domain]', orgFormData.front_domain);
    formData.append('organization[front_subdomain]', orgFormData.front_subdomain);
    formData.append('organization[country_id]', orgFormData.country_id);
    if (orgFormData.logo) {
      formData.append('organization[logo]', orgFormData.logo);
    }

    try {
      const response = await fetch(getFullUrl('/organizations.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('Organization created successfully');
        fetchOrganizations();
        setIsAddOrgOpen(false);
        setOrgFormData({
          name: '',
          description: '',
          domain: '',
          sub_domain: '',
          front_domain: '',
          front_subdomain: '',
          country_id: '',
          logo: null
        });
      } else {
        toast.error('Failed to create organization');
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      toast.error('Error creating organization');
    }
  };

  const handleUpdateOrganization = async () => {
    if (!editingOrg || !orgFormData.name.trim()) {
      toast.error('Please enter organization name');
      return;
    }

    if (!canEditOrganization) {
      toast.error('You do not have permission to edit organizations');
      return;
    }

    const formData = new FormData();
    formData.append('organization[name]', orgFormData.name);
    formData.append('organization[description]', orgFormData.description);
    formData.append('organization[domain]', orgFormData.domain);
    formData.append('organization[sub_domain]', orgFormData.sub_domain);
    formData.append('organization[front_domain]', orgFormData.front_domain);
    formData.append('organization[front_subdomain]', orgFormData.front_subdomain);
    formData.append('organization[country_id]', orgFormData.country_id);
    if (orgFormData.logo) {
      formData.append('organization[logo]', orgFormData.logo);
    }

    try {
      const response = await fetch(getFullUrl(`/organizations/${editingOrg.id}.json`), {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('Organization updated successfully');
        fetchOrganizations();
        setIsEditOrgOpen(false);
        setEditingOrg(null);
        setOrgFormData({
          name: '',
          description: '',
          domain: '',
          sub_domain: '',
          front_domain: '',
          front_subdomain: '',
          country_id: '',
          logo: null
        });
      } else {
        toast.error('Failed to update organization');
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('Error updating organization');
    }
  };

  const handleDeleteOrganization = async (orgId: number) => {
    if (!canEditOrganization) {
      toast.error('You do not have permission to delete organizations');
      return;
    }

    if (!confirm('Are you sure you want to delete this organization?')) {
      return;
    }

    try {
      const response = await fetch(getFullUrl(`/organizations/${orgId}.json`), {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (response.ok) {
        toast.success('Organization deleted successfully');
        fetchOrganizations();
      } else {
        toast.error('Failed to delete organization');
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast.error('Error deleting organization');
    }
  };

  const handleEditOrganization = (org: any) => {
    if (!canEditOrganization) {
      toast.error('You do not have permission to edit organizations');
      return;
    }

    setEditingOrg(org);
    setOrgFormData({
      name: org.name || '',
      description: org.description || '',
      domain: org.domain || '',
      sub_domain: org.sub_domain || '',
      front_domain: org.front_domain || '',
      front_subdomain: org.front_subdomain || '',
      country_id: org.country_id?.toString() || '',
      logo: null
    });
    setIsEditOrgOpen(true);
  };

  const handleOrgLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOrgFormData({ ...orgFormData, logo: file });
    }
  };

  const fetchUserCategories = async () => {
    setIsLoadingUserCategories(true);
    try {
      const response = await fetch(getFullUrl('/pms/admin/user_categories.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserCategories(data);
      } else {
        toast.error('Failed to fetch user categories');
      }
    } catch (error) {
      console.error('Error fetching user categories:', error);
      toast.error('Error fetching user categories');
    } finally {
      setIsLoadingUserCategories(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success('File uploaded successfully');
    }
  };

  const handleSubmitCompany = () => {
    toast.success('Company details updated successfully');
  };

  const handleSubmitEntity = () => {
    if (!entityName.trim()) {
      toast.error('Please enter an entity name');
      return;
    }

    // Check if entity already exists
    const entityExists = entities.some(entity => entity.entity.toLowerCase() === entityName.toLowerCase());
    if (entityExists) {
      toast.error('This entity already exists');
      return;
    }

    // Add the new entity to the entities array
    const newEntity = {
      entity: entityName,
      status: true
    };

    setEntities([...entities, newEntity]);
    toast.success(`Entity "${entityName}" added successfully`);

    // Reset form and close the form section
    setEntityName('');
    setShowEntityForm(false);
  };

  const handleImportEntity = () => {
    toast.success('Entity import functionality triggered');
  };

  const handleSampleFormat = () => {
    toast.info('Sample format downloaded');
  };

  const handleRegionStatusChange = (index: number, checked: boolean) => {
    const updatedRegions = [...regions];
    updatedRegions[index].status = checked;
    setRegions(updatedRegions);
  };

  const handleZoneStatusChange = (index: number, checked: boolean) => {
    const updatedZones = [...zones];
    updatedZones[index].status = checked;
    setZones(updatedZones);
  };

  const handleSiteStatusChange = (index: number, checked: boolean) => {
    const updatedSites = [...sites];
    updatedSites[index].status = checked;
    setSites(updatedSites);
  };

  const handleEntityStatusChange = (index: number, checked: boolean) => {
    const updatedEntities = [...entities];
    updatedEntities[index].status = checked;
    setEntities(updatedEntities);
  };

  const handleEditUserCategory = (category: any) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      resource_type: category.resource_type,
      resource_id: category.resource_id
    });
    setIsEditUserCategoryOpen(true);
  };

  const handleUpdateUserCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast.error('Please enter a user category name');
      return;
    }

    try {
      const response = await fetch(getFullUrl(`/pms/admin/user_categories/${editingCategory.id}.json?user_category[name]=${encodeURIComponent(editingCategory.name)}`), {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('User category updated successfully');
        fetchUserCategories(); // Refresh the list
        setEditingCategory(null);
        setIsEditUserCategoryOpen(false);
      } else {
        toast.error('Failed to update user category');
      }
    } catch (error) {
      console.error('Error updating user category:', error);
      toast.error('Error updating user category');
    }
  };

  const handleSubmitUserCategory = async () => {
    if (!userCategoryName.trim()) {
      toast.error('Please enter a user category name');
      return;
    }

    try {
      const response = await fetch(getFullUrl('/pms/admin/user_categories'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_category: {
            name: userCategoryName
          }
        }),
      });

      if (response.ok) {
        toast.success('User category added successfully');
        fetchUserCategories(); // Refresh the list
        setUserCategoryName('');
        setIsAddUserCategoryOpen(false);
      } else {
        toast.error('Failed to add user category');
      }
    } catch (error) {
      console.error('Error adding user category:', error);
      toast.error('Error adding user category');
    }
  };

  const handleZoneSelection = (zoneName: string, checked: boolean) => {
    if (checked) {
      setSelectedZonesForEdit([...selectedZonesForEdit, zoneName]);
    } else {
      setSelectedZonesForEdit(selectedZonesForEdit.filter(name => name !== zoneName));
    }
  };

  const handleEditSelectedZones = () => {
    if (selectedZonesForEdit.length === 0) {
      toast.error('Please select at least one zone to edit');
      return;
    }

    // Pre-fill form with data from the first selected zone
    const firstSelectedZone = selectedZonesForEdit[0];
    setEditZoneData({
      zoneName: firstSelectedZone,
      headquarter: 'India', // Default value
      region: 'west' // Default value
    });

    setIsEditZoneOpen(false);
    setIsEditZoneFormOpen(true);
  };

  const handleSaveZoneChanges = () => {
    if (!editZoneData.zoneName.trim() || !editZoneData.headquarter.trim() || !editZoneData.region.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success(`Zone "${editZoneData.zoneName}" updated successfully`);
    setIsEditZoneFormOpen(false);
    setSelectedZonesForEdit([]);
    setEditZoneData({ zoneName: '', headquarter: '', region: '' });
  };

  const handleZoneFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success('Zone image uploaded successfully');
    }
  };

  const handleAddRegion = () => {
    if (!newRegionData.country || !newRegionData.regionName.trim()) {
      toast.error('Please select a country and enter a region name');
      return;
    }

    // Add the new region to the regions array
    const newRegion = {
      country: newRegionData.country,
      region: newRegionData.regionName,
      status: true
    };

    setRegions([...regions, newRegion]);
    toast.success(`Region "${newRegionData.regionName}" added successfully`);

    // Reset form and close dialog
    setNewRegionData({ country: '', regionName: '' });
    setIsAddRegionOpen(false);
  };

  const handleAddZone = () => {
    if (!newZoneData.country || !newZoneData.region || !newZoneData.zoneName.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if zone already exists
    const zoneExists = zones.some(zone =>
      zone.country === newZoneData.country &&
      zone.region === newZoneData.region &&
      zone.zone === newZoneData.zoneName
    );

    if (zoneExists) {
      toast.error('This zone already exists in the selected country and region');
      return;
    }

    // Add the new zone to the zones array
    const newZone = {
      country: newZoneData.country,
      region: newZoneData.region,
      zone: newZoneData.zoneName,
      status: true,
      icon: '/placeholder.svg'
    };

    setZones([...zones, newZone]);
    toast.success(`Zone "${newZoneData.zoneName}" added successfully`);

    // Reset form and close dialog
    setNewZoneData({ country: '', region: '', zoneName: '' });
    setIsAddZoneOpen(false);
  };

  // Countries API functions
  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const response = await fetch(getFullUrl('/pms/countries.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Countries API response:', data);
        
        // Handle response structure
        if (Array.isArray(data)) {
          setCountries(data);
        } else if (data && data.countries && Array.isArray(data.countries)) {
          setCountries(data.countries);
        } else {
          console.error('Countries data format unexpected:', data);
          setCountries([]);
          toast.error('Invalid countries data format');
        }
      } else {
        toast.error('Failed to fetch countries');
        setCountries([]);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Error fetching countries');
      setCountries([]);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const handleCreateCountry = async () => {
    if (!countryFormData.name.trim()) {
      toast.error('Please enter country name');
      return;
    }

    if (!canEditCountry) {
      toast.error('You do not have permission to create countries');
      return;
    }

    const formData = new FormData();
    formData.append('pms_country[name]', countryFormData.name);
    if (countryFormData.logo) {
      formData.append('pms_country[logo]', countryFormData.logo);
    }

    try {
      const response = await fetch(getFullUrl('/pms/countries.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('Country created successfully');
        fetchCountries();
        setIsAddCountryOpen(false);
        setCountryFormData({
          name: '',
          logo: null
        });
      } else {
        toast.error('Failed to create country');
      }
    } catch (error) {
      console.error('Error creating country:', error);
      toast.error('Error creating country');
    }
  };

  const handleUpdateCountry = async () => {
    if (!editingCountry || !countryFormData.name.trim()) {
      toast.error('Please enter country name');
      return;
    }

    if (!canEditCountry) {
      toast.error('You do not have permission to edit countries');
      return;
    }

    const formData = new FormData();
    formData.append('pms_country[name]', countryFormData.name);
    if (countryFormData.logo) {
      formData.append('pms_country[logo]', countryFormData.logo);
    }

    try {
      const response = await fetch(getFullUrl(`/pms/countries/${editingCountry.id}.json`), {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('Country updated successfully');
        fetchCountries();
        setIsEditCountryOpen(false);
        setEditingCountry(null);
        setCountryFormData({
          name: '',
          logo: null
        });
      } else {
        toast.error('Failed to update country');
      }
    } catch (error) {
      console.error('Error updating country:', error);
      toast.error('Error updating country');
    }
  };

  const handleDeleteCountry = async (countryId: number) => {
    if (!canEditCountry) {
      toast.error('You do not have permission to delete countries');
      return;
    }

    if (!confirm('Are you sure you want to delete this country?')) {
      return;
    }

    try {
      const response = await fetch(getFullUrl(`/pms/countries/${countryId}.json`), {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (response.ok) {
        toast.success('Country deleted successfully');
        fetchCountries();
      } else {
        toast.error('Failed to delete country');
      }
    } catch (error) {
      console.error('Error deleting country:', error);
      toast.error('Error deleting country');
    }
  };

  const handleEditCountry = (country: any) => {
    if (!canEditCountry) {
      toast.error('You do not have permission to edit countries');
      return;
    }

    setEditingCountry(country);
    setCountryFormData({
      name: country.name || '',
      logo: null
    });
    setIsEditCountryOpen(true);
  };

  const handleCountryLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCountryFormData({ ...countryFormData, logo: file });
    }
  };

  // End of Countries API functions

  // Company API Functions
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
        const data = await response.json();
        console.log('Companies API response:', data);
        
        // Handle the API response format
        if (data && Array.isArray(data.companies)) {
          setCompanies(data.companies);
        } else if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          console.warn('Companies data is not an array:', data);
          setCompanies([]);
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

  const createCompany = async () => {
    if (!canEditCompany) {
      toast.error('You do not have permission to create companies');
      return;
    }

    setIsCreatingCompany(true);
    try {
      const formData = new FormData();
      formData.append('pms_company_setup[name]', companyFormData.name);
      formData.append('pms_company_setup[organization_id]', companyFormData.organization_id);
      formData.append('pms_company_setup[country_id]', companyFormData.country_id);
      formData.append('pms_company_setup[billing_term]', companyFormData.billing_term);
      formData.append('pms_company_setup[billing_rate]', companyFormData.billing_rate);
      formData.append('pms_company_setup[live_date]', companyFormData.live_date);
      formData.append('pms_company_setup[remarks]', companyFormData.remarks);
      
      if (companyFormData.logo) {
        formData.append('pms_company_setup[logo]', companyFormData.logo);
      }

      // Address data
      formData.append('bill_to_address[address]', companyFormData.bill_to_address.address);
      formData.append('bill_to_address[email]', companyFormData.bill_to_address.email);
      formData.append('postal_address[address]', companyFormData.postal_address.address);
      formData.append('postal_address[email]', companyFormData.postal_address.email);

      // SPOC data
      formData.append('finance_spoc[name]', companyFormData.finance_spoc.name);
      formData.append('finance_spoc[designation]', companyFormData.finance_spoc.designation);
      formData.append('finance_spoc[email]', companyFormData.finance_spoc.email);
      formData.append('finance_spoc[mobile]', companyFormData.finance_spoc.mobile);
      
      formData.append('operation_spoc[name]', companyFormData.operation_spoc.name);
      formData.append('operation_spoc[designation]', companyFormData.operation_spoc.designation);
      formData.append('operation_spoc[email]', companyFormData.operation_spoc.email);
      formData.append('operation_spoc[mobile]', companyFormData.operation_spoc.mobile);

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
      formData.append('pms_company_setup[name]', companyFormData.name);
      formData.append('pms_company_setup[organization_id]', companyFormData.organization_id);
      formData.append('pms_company_setup[country_id]', companyFormData.country_id);
      formData.append('pms_company_setup[billing_term]', companyFormData.billing_term);
      formData.append('pms_company_setup[billing_rate]', companyFormData.billing_rate);
      formData.append('pms_company_setup[live_date]', companyFormData.live_date);
      formData.append('pms_company_setup[remarks]', companyFormData.remarks);
      
      if (companyFormData.logo) {
        formData.append('pms_company_setup[logo]', companyFormData.logo);
      }

      // Address data
      formData.append('bill_to_address[address]', companyFormData.bill_to_address.address);
      formData.append('bill_to_address[email]', companyFormData.bill_to_address.email);
      formData.append('postal_address[address]', companyFormData.postal_address.address);
      formData.append('postal_address[email]', companyFormData.postal_address.email);

      // SPOC data
      formData.append('finance_spoc[name]', companyFormData.finance_spoc.name);
      formData.append('finance_spoc[designation]', companyFormData.finance_spoc.designation);
      formData.append('finance_spoc[email]', companyFormData.finance_spoc.email);
      formData.append('finance_spoc[mobile]', companyFormData.finance_spoc.mobile);
      
      formData.append('operation_spoc[name]', companyFormData.operation_spoc.name);
      formData.append('operation_spoc[designation]', companyFormData.operation_spoc.designation);
      formData.append('operation_spoc[email]', companyFormData.operation_spoc.email);
      formData.append('operation_spoc[mobile]', companyFormData.operation_spoc.mobile);

      const response = await fetch(getFullUrl(`/pms/company_setups/${selectedCompany.id}/company_update.json`), {
        method: 'PUT',
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
    setSelectedCompany(null);
  };

  const handleCompanyLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCompanyFormData({ ...companyFormData, logo: file });
    }
  };

  // End of Company API functions

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ACCOUNT</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-6">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="country">Country</TabsTrigger>
          <TabsTrigger value="region">Region</TabsTrigger>
          <TabsTrigger value="zone">Zone</TabsTrigger>
          <TabsTrigger value="site">Site</TabsTrigger>
          <TabsTrigger value="entity">Entity</TabsTrigger>
          <TabsTrigger value="user-category">User Category</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Dialog open={isAddOrgOpen} onOpenChange={setIsAddOrgOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#C72030] hover:bg-[#A01020] text-white"
                  disabled={!canEditOrganization}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Organization</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name *
                      </label>
                      <input
                        type="text"
                        value={orgFormData.name}
                        onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                        placeholder="Enter organization name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        value={orgFormData.country_id}
                        onChange={(e) => setOrgFormData({ ...orgFormData, country_id: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      >
                        <option value="">Select Country</option>
                        {Array.isArray(countriesDropdown) && countriesDropdown.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={orgFormData.description}
                      onChange={(e) => setOrgFormData({ ...orgFormData, description: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      rows={3}
                      placeholder="Enter description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Domain
                      </label>
                      <input
                        type="text"
                        value={orgFormData.domain}
                        onChange={(e) => setOrgFormData({ ...orgFormData, domain: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                        placeholder="Enter domain"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Domain
                      </label>
                      <input
                        type="text"
                        value={orgFormData.sub_domain}
                        onChange={(e) => setOrgFormData({ ...orgFormData, sub_domain: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                        placeholder="Enter sub domain"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Front Domain
                      </label>
                      <input
                        type="text"
                        value={orgFormData.front_domain}
                        onChange={(e) => setOrgFormData({ ...orgFormData, front_domain: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                        placeholder="Enter front domain"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Front Subdomain
                      </label>
                      <input
                        type="text"
                        value={orgFormData.front_subdomain}
                        onChange={(e) => setOrgFormData({ ...orgFormData, front_subdomain: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                        placeholder="Enter front subdomain"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleOrgLogoChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddOrgOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    onClick={handleCreateOrganization}
                  >
                    Create Organization
                  </Button>
                </div>
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
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
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
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Domain</TableHead>
                    <TableHead className="font-semibold">Country</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingOrganizations ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Loading organizations...
                      </TableCell>
                    </TableRow>
                  ) : organizations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No organizations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    Array.isArray(organizations) && organizations
                      .filter(org => 
                        org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        org.description?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>{org.id}</TableCell>
                        <TableCell>{org.name}</TableCell>
                        <TableCell>{org.description || '-'}</TableCell>
                        <TableCell>{org.domain || '-'}</TableCell>
                        <TableCell>{org.country?.name || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditOrganization(org)}
                              disabled={!canEditOrganization}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteOrganization(org.id)}
                              disabled={!canEditOrganization}
                            >
                              <X className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#C72030] hover:bg-[#A01020] text-white"
                  disabled={!canEditCompany}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Company</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Company Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-name">Company Name *</Label>
                      <Input
                        id="company-name"
                        value={companyFormData.name}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization *</Label>
                      <Select
                        value={companyFormData.organization_id}
                        onValueChange={(value) => setCompanyFormData({ ...companyFormData, organization_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(organizations) && organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id.toString()}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        value={companyFormData.country_id}
                        onValueChange={(value) => setCompanyFormData({ ...companyFormData, country_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(countriesDropdown) && countriesDropdown.map((country) => (
                            <SelectItem key={country.id} value={country.id.toString()}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="billing-term">Billing Term</Label>
                      <Input
                        id="billing-term"
                        value={companyFormData.billing_term}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, billing_term: e.target.value })}
                        placeholder="Enter billing term"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing-rate">Billing Rate</Label>
                      <Input
                        id="billing-rate"
                        value={companyFormData.billing_rate}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, billing_rate: e.target.value })}
                        placeholder="Enter billing rate"
                      />
                    </div>
                    <div>
                      <Label htmlFor="live-date">Live Date</Label>
                      <Input
                        id="live-date"
                        type="date"
                        value={companyFormData.live_date}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, live_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="remarks">Remarks</Label>
                    <textarea
                      id="remarks"
                      value={companyFormData.remarks}
                      onChange={(e) => setCompanyFormData({ ...companyFormData, remarks: e.target.value })}
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      placeholder="Enter remarks"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company-logo">Company Logo</Label>
                    <Input
                      id="company-logo"
                      type="file"
                      accept="image/*"
                      onChange={handleCompanyLogoChange}
                    />
                  </div>

                  {/* Bill To Address */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Bill To Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bill-address">Address</Label>
                        <textarea
                          id="bill-address"
                          value={companyFormData.bill_to_address.address}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            bill_to_address: { ...companyFormData.bill_to_address, address: e.target.value }
                          })}
                          className="w-full p-2 border rounded-md"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bill-email">Email</Label>
                        <Input
                          id="bill-email"
                          type="email"
                          value={companyFormData.bill_to_address.email}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            bill_to_address: { ...companyFormData.bill_to_address, email: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Postal Address */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Postal Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postal-address">Address</Label>
                        <textarea
                          id="postal-address"
                          value={companyFormData.postal_address.address}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            postal_address: { ...companyFormData.postal_address, address: e.target.value }
                          })}
                          className="w-full p-2 border rounded-md"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postal-email">Email</Label>
                        <Input
                          id="postal-email"
                          type="email"
                          value={companyFormData.postal_address.email}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            postal_address: { ...companyFormData.postal_address, email: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Finance SPOC */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Finance SPOC</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="finance-name">Name</Label>
                        <Input
                          id="finance-name"
                          value={companyFormData.finance_spoc.name}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            finance_spoc: { ...companyFormData.finance_spoc, name: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="finance-designation">Designation</Label>
                        <Input
                          id="finance-designation"
                          value={companyFormData.finance_spoc.designation}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            finance_spoc: { ...companyFormData.finance_spoc, designation: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="finance-email">Email</Label>
                        <Input
                          id="finance-email"
                          type="email"
                          value={companyFormData.finance_spoc.email}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            finance_spoc: { ...companyFormData.finance_spoc, email: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="finance-mobile">Mobile</Label>
                        <Input
                          id="finance-mobile"
                          value={companyFormData.finance_spoc.mobile}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            finance_spoc: { ...companyFormData.finance_spoc, mobile: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operation SPOC */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Operation SPOC</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="operation-name">Name</Label>
                        <Input
                          id="operation-name"
                          value={companyFormData.operation_spoc.name}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            operation_spoc: { ...companyFormData.operation_spoc, name: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="operation-designation">Designation</Label>
                        <Input
                          id="operation-designation"
                          value={companyFormData.operation_spoc.designation}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            operation_spoc: { ...companyFormData.operation_spoc, designation: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="operation-email">Email</Label>
                        <Input
                          id="operation-email"
                          type="email"
                          value={companyFormData.operation_spoc.email}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            operation_spoc: { ...companyFormData.operation_spoc, email: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="operation-mobile">Mobile</Label>
                        <Input
                          id="operation-mobile"
                          value={companyFormData.operation_spoc.mobile}
                          onChange={(e) => setCompanyFormData({ 
                            ...companyFormData, 
                            operation_spoc: { ...companyFormData.operation_spoc, mobile: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsAddCompanyOpen(false); resetCompanyForm(); }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={createCompany}
                    disabled={isCreatingCompany || !companyFormData.name}
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                  >
                    {isCreatingCompany ? 'Creating...' : 'Create Company'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search companies..."
                value={companySearchTerm}
                onChange={(e) => setCompanySearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoadingCompanies ? (
                <div className="flex justify-center items-center p-8">
                  <div className="text-gray-500">Loading companies...</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Billing Rate</TableHead>
                      <TableHead>Live Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!Array.isArray(companies) || companies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                          No companies found
                        </TableCell>
                      </TableRow>
                    ) : (
                      Array.isArray(companies) && companies
                        .filter(company => 
                          company.name?.toLowerCase().includes(companySearchTerm.toLowerCase())
                        )
                        .slice((companyCurrentPage - 1) * companiesPerPage, companyCurrentPage * companiesPerPage)
                        .map((company) => (
                          <TableRow key={company.id}>
                            <TableCell className="font-medium">{company.name}</TableCell>
                            <TableCell>{company.organization?.name || 'N/A'}</TableCell>
                            <TableCell>{company.country?.name || 'N/A'}</TableCell>
                            <TableCell>{company.billing_rate || 'N/A'}</TableCell>
                            <TableCell>{company.live_date || 'N/A'}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                company.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {company.active ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditCompany(company)}
                                  disabled={!canEditCompany}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteCompany(company.id)}
                                  disabled={!canEditCompany || isDeletingCompany}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {Array.isArray(companies) && companies.length > companiesPerPage && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCompanyCurrentPage(Math.max(1, companyCurrentPage - 1))}
                disabled={companyCurrentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {companyCurrentPage} of {Math.ceil(companies.length / companiesPerPage)}
              </span>
              <Button
                variant="outline"
                onClick={() => setCompanyCurrentPage(Math.min(Math.ceil(companies.length / companiesPerPage), companyCurrentPage + 1))}
                disabled={companyCurrentPage === Math.ceil(companies.length / companiesPerPage)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="country" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Dialog open={isAddCountryOpen} onOpenChange={setIsAddCountryOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#C72030] hover:bg-[#A01020] text-white"
                  disabled={!canEditCountry}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Country
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Country</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country Name *
                    </label>
                    <input
                      type="text"
                      value={countryFormData.name}
                      onChange={(e) => setCountryFormData({ ...countryFormData, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      placeholder="Enter country name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country Logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCountryLogoChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddCountryOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#C72030] hover:bg-[#A01020] text-white"
                      onClick={handleCreateCountry}
                    >
                      Create Country
                    </Button>
                  </div>
                </div>
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
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
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
                    <TableHead className="font-semibold">Country Name</TableHead>
                    <TableHead className="font-semibold">Logo</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingCountries ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Loading countries...
                      </TableCell>
                    </TableRow>
                  ) : countries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No countries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    Array.isArray(countries) && countries
                      .filter(country => 
                        country.name?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((country) => (
                      <TableRow key={country.id}>
                        <TableCell>{country.id}</TableCell>
                        <TableCell>{country.name}</TableCell>
                        <TableCell>
                          {country.logo ? (
                            <img 
                              src={country.logo} 
                              alt={country.name} 
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditCountry(country)}
                              disabled={!canEditCountry}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteCountry(country.id)}
                              disabled={!canEditCountry}
                            >
                              <X className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="region" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Dialog open={isAddRegionOpen} onOpenChange={setIsAddRegionOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
                  Add Region
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Region</DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => setIsAddRegionOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={newRegionData.country}
                      onChange={(e) => setNewRegionData({ ...newRegionData, country: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                    >
                      <option value="">Select Country</option>
                      {countries.map((country, index) => (
                        <option key={index} value={country.name}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region Name
                    </label>
                    <input
                      type="text"
                      value={newRegionData.regionName}
                      onChange={(e) => setNewRegionData({ ...newRegionData, regionName: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      placeholder="Enter region name"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddRegionOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#C72030] hover:bg-[#A01020] text-white"
                      onClick={handleAddRegion}
                    >
                      Add Region
                    </Button>
                  </div>
                </div>
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
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                />
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Country</TableHead>
                    <TableHead className="font-semibold">Region</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regions.map((region, index) => (
                    <TableRow key={index}>
                      <TableCell>{region.country}</TableCell>
                      <TableCell>{region.region}</TableCell>
                      <TableCell>
                        <Switch
                          checked={region.status}
                          onCheckedChange={(checked) => handleRegionStatusChange(index, checked)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zone" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Dialog open={isAddZoneOpen} onOpenChange={setIsAddZoneOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
                    Add Zone
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Zone</DialogTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4"
                      onClick={() => setIsAddZoneOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        value={newZoneData.country}
                        onChange={(e) => setNewZoneData({ ...newZoneData, country: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      >
                        <option value="">Select Country</option>
                        {countries.map((country, index) => (
                          <option key={index} value={country.name}>{country.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Region
                      </label>
                      <select
                        value={newZoneData.region}
                        onChange={(e) => setNewZoneData({ ...newZoneData, region: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      >
                        <option value="">Select Region</option>
                        {regions.filter(region => !newZoneData.country || region.country === newZoneData.country).map((region, index) => (
                          <option key={index} value={region.region}>{region.region}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zone Name
                      </label>
                      <input
                        type="text"
                        value={newZoneData.zoneName}
                        onChange={(e) => setNewZoneData({ ...newZoneData, zoneName: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                        placeholder="Enter zone name"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddZoneOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-[#C72030] hover:bg-[#A01020] text-white"
                        onClick={handleAddZone}
                      >
                        Add Zone
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isEditZoneOpen} onOpenChange={setIsEditZoneOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
                    Edit Zone
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select Zone to Edit</DialogTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4"
                      onClick={() => setIsEditZoneOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {['Mumbai', 'Madhya Pradesh', 'Bali', 'Delhi', 'Hyderabad', 'Kolkata', 'NCR', 'Pune'].map((zoneName) => (
                        <div key={zoneName} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`zone-${zoneName}`}
                            checked={selectedZonesForEdit.includes(zoneName)}
                            onChange={(e) => handleZoneSelection(zoneName, e.target.checked)}
                            className="rounded border-gray-300 text-[#C72030] focus:ring-[#C72030]"
                          />
                          <label htmlFor={`zone-${zoneName}`} className="text-sm text-gray-700 cursor-pointer">
                            {zoneName}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        onClick={handleEditSelectedZones}
                      >
                        Edit Selected Zone
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                />
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Country</TableHead>
                    <TableHead className="font-semibold">Region</TableHead>
                    <TableHead className="font-semibold">Zone</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Icon</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.filter(zone =>
                    zone.country.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((zone, index) => (
                    <TableRow key={index}>
                      <TableCell>{zone.country}</TableCell>
                      <TableCell>{zone.region}</TableCell>
                      <TableCell>{zone.zone}</TableCell>
                      <TableCell>
                        <Switch
                          checked={zone.status}
                          onCheckedChange={(checked) => handleZoneStatusChange(index, checked)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <img src={zone.icon} alt="Zone icon" className="w-6 h-6" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Country</TableHead>
                    <TableHead className="font-semibold">Region</TableHead>
                    <TableHead className="font-semibold">Zone</TableHead>
                    <TableHead className="font-semibold">Site</TableHead>
                    <TableHead className="font-semibold">Latitude</TableHead>
                    <TableHead className="font-semibold">Longitude</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">QR Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map((site, index) => (
                    <TableRow key={index}>
                      <TableCell>{site.country}</TableCell>
                      <TableCell>{site.region}</TableCell>
                      <TableCell>{site.zone}</TableCell>
                      <TableCell>{site.site}</TableCell>
                      <TableCell>{site.latitude}</TableCell>
                      <TableCell>{site.longitude}</TableCell>
                      <TableCell>
                        <Switch
                          checked={site.status}
                          onCheckedChange={(checked) => handleSiteStatusChange(index, checked)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <img src={site.qrCode} alt="QR Code" className="w-6 h-6" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entity" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
              onClick={() => setShowEntityForm(!showEntityForm)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entity
            </Button>
          </div>

          {/* Toggle Form Section */}
          {showEntityForm && (
            <Card className="mb-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                    placeholder="Enter Entity Name"
                  />
                  <Button
                    onClick={handleSubmitEntity}
                    className="bg-[#6B2C91] hover:bg-[#5A2478] text-white px-6"
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={handleSampleFormat}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                  >
                    📁 Sample Format
                  </Button>
                  <Button
                    onClick={handleImportEntity}
                    className="bg-[#6B2C91] hover:bg-[#5A2478] text-white px-6"
                  >
                    + Import
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Actions</TableHead>
                    <TableHead className="font-semibold">Active</TableHead>
                    <TableHead className="font-semibold">Entity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entities.map((entity, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={entity.status}
                          onCheckedChange={(checked) => handleEntityStatusChange(index, checked)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                        />
                      </TableCell>
                      <TableCell>{entity.entity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-category" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Dialog open={isAddUserCategoryOpen} onOpenChange={setIsAddUserCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add User Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Category Name
                    </label>
                    <input
                      type="text"
                      value={userCategoryName}
                      onChange={(e) => setUserCategoryName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      placeholder="Enter user category name"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddUserCategoryOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#C72030] hover:bg-[#A01020] text-white"
                      onClick={handleSubmitUserCategory}
                    >
                      Add User Category
                    </Button>
                  </div>
                </div>
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
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                />
                <Button size="sm" variant="outline">Search</Button>
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
                    <TableHead className="font-semibold">Resource Type</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="font-semibold">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingUserCategories ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Loading user categories...
                      </TableCell>
                    </TableRow>
                  ) : userCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No user categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    userCategories.map((category, index) => (
                      <TableRow key={category.id || index}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.resource_type}</TableCell>
                        <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditUserCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit User Category Dialog */}
          <Dialog open={isEditUserCategoryOpen} onOpenChange={setIsEditUserCategoryOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Category Name
                  </label>
                  <input
                    type="text"
                    value={editingCategory?.name || ''}
                    onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, name: e.target.value } : null)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                    placeholder="Enter user category name"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditUserCategoryOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    onClick={handleUpdateUserCategory}
                  >
                    Update User Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>

      {/* Edit Country Dialog */}
      <Dialog open={isEditCountryOpen} onOpenChange={setIsEditCountryOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Country</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Name *
              </label>
              <input
                type="text"
                value={countryFormData.name}
                onChange={(e) => setCountryFormData({ ...countryFormData, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                placeholder="Enter country name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCountryLogoChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditCountryOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
              onClick={handleUpdateCountry}
            >
              Update Country
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Organization Dialog */}
      <Dialog open={isEditOrgOpen} onOpenChange={setIsEditOrgOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={orgFormData.name}
                  onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={orgFormData.country_id}
                  onChange={(e) => setOrgFormData({ ...orgFormData, country_id: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                >
                  <option value="">Select Country</option>
                  {Array.isArray(countriesDropdown) && countriesDropdown.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={orgFormData.description}
                onChange={(e) => setOrgFormData({ ...orgFormData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                rows={3}
                placeholder="Enter description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                           <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain
                </label>
                <input
                  type="text"
                  value={orgFormData.domain}
                  onChange={(e) => setOrgFormData({ ...orgFormData, domain: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                  placeholder="Enter domain"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Domain
                </label>
                <input
                  type="text"
                  value={orgFormData.sub_domain}
                  onChange={(e) => setOrgFormData({ ...orgFormData, sub_domain: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                  placeholder="Enter sub domain"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Front Domain
                </label>
                <input
                  type="text"
                  value={orgFormData.front_domain}
                  onChange={(e) => setOrgFormData({ ...orgFormData, front_domain: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                  placeholder="Enter front domain"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Front Subdomain
                </label>
                <input
                  type="text"
                  value={orgFormData.front_subdomain}
                  onChange={(e) => setOrgFormData({ ...orgFormData, front_subdomain: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                  placeholder="Enter front subdomain"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleOrgLogoChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditOrgOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
              onClick={handleUpdateOrganization}
            >
              Update Organization
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Zone Form Dialog */}
      <Dialog open={isEditZoneFormOpen} onOpenChange={setIsEditZoneFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Zone</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsEditZoneFormOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone Name
              </label>
              <input
                type="text"
                value={editZoneData.zoneName}
                onChange={(e) => setEditZoneData({ ...editZoneData, zoneName: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] bg-white"
                placeholder="Enter zone name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headquarter
              </label>
              <input
                type="text"
                value={editZoneData.headquarter}
                onChange={(e) => setEditZoneData({ ...editZoneData, headquarter: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] bg-white"
                placeholder="Enter headquarter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <input
                type="text"
                value={editZoneData.region}
                onChange={(e) => setEditZoneData({ ...editZoneData, region: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] bg-white"
                placeholder="Enter region"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  id="zoneImageUpload"
                  accept="image/*"
                  onChange={handleZoneFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="zoneImageUpload"
                  className="cursor-pointer bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Choose File
                </label>
                <span className="ml-3 text-sm text-gray-500">No file chosen</span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                onClick={handleSaveZoneChanges}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Company Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-company-name">Company Name *</Label>
                <Input
                  id="edit-company-name"
                  value={companyFormData.name}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="edit-organization">Organization *</Label>
                <Select
                  value={companyFormData.organization_id}
                  onValueChange={(value) => setCompanyFormData({ ...companyFormData, organization_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(organizations) && organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-country">Country *</Label>
                <Select
                  value={companyFormData.country_id}
                  onValueChange={(value) => setCompanyFormData({ ...companyFormData, country_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(countriesDropdown) && countriesDropdown.map((country) => (
                      <SelectItem key={country.id} value={country.id.toString()}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-billing-term">Billing Term</Label>
                <Input
                  id="edit-billing-term"
                  value={companyFormData.billing_term}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, billing_term: e.target.value })}
                  placeholder="Enter billing term"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-billing-rate">Billing Rate</Label>
                <Input
                  id="edit-billing-rate"
                  value={companyFormData.billing_rate}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, billing_rate: e.target.value })}
                  placeholder="Enter billing rate"
                />
              </div>
              <div>
                <Label htmlFor="edit-live-date">Live Date</Label>
                <Input
                  id="edit-live-date"
                  type="date"
                  value={companyFormData.live_date}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, live_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-remarks">Remarks</Label>
              <textarea
                id="edit-remarks"
                value={companyFormData.remarks}
                onChange={(e) => setCompanyFormData({ ...companyFormData, remarks: e.target.value })}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter remarks"
              />
            </div>

            <div>
              <Label htmlFor="edit-company-logo">Company Logo</Label>
              <Input
                id="edit-company-logo"
                type="file"
                accept="image/*"
                onChange={handleCompanyLogoChange}
              />
            </div>

            {/* Bill To Address */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Bill To Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-bill-address">Address</Label>
                  <textarea
                    id="edit-bill-address"
                    value={companyFormData.bill_to_address.address}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      bill_to_address: { ...companyFormData.bill_to_address, address: e.target.value }
                    })}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-bill-email">Email</Label>
                  <Input
                    id="edit-bill-email"
                    type="email"
                    value={companyFormData.bill_to_address.email}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      bill_to_address: { ...companyFormData.bill_to_address, email: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Postal Address */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Postal Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-postal-address">Address</Label>
                  <textarea
                    id="edit-postal-address"
                    value={companyFormData.postal_address.address}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      postal_address: { ...companyFormData.postal_address, address: e.target.value }
                    })}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-postal-email">Email</Label>
                  <Input
                    id="edit-postal-email"
                    type="email"
                    value={companyFormData.postal_address.email}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      postal_address: { ...companyFormData.postal_address, email: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Finance SPOC */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Finance SPOC</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-finance-name">Name</Label>
                  <Input
                    id="edit-finance-name"
                    value={companyFormData.finance_spoc.name}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      finance_spoc: { ...companyFormData.finance_spoc, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-finance-designation">Designation</Label>
                  <Input
                    id="edit-finance-designation"
                    value={companyFormData.finance_spoc.designation}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      finance_spoc: { ...companyFormData.finance_spoc, designation: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-finance-email">Email</Label>
                  <Input
                    id="edit-finance-email"
                    type="email"
                    value={companyFormData.finance_spoc.email}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      finance_spoc: { ...companyFormData.finance_spoc, email: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-finance-mobile">Mobile</Label>
                  <Input
                    id="edit-finance-mobile"
                    value={companyFormData.finance_spoc.mobile}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      finance_spoc: { ...companyFormData.finance_spoc, mobile: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Operation SPOC */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Operation SPOC</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-operation-name">Name</Label>
                  <Input
                    id="edit-operation-name"
                    value={companyFormData.operation_spoc.name}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      operation_spoc: { ...companyFormData.operation_spoc, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-operation-designation">Designation</Label>
                  <Input
                    id="edit-operation-designation"
                    value={companyFormData.operation_spoc.designation}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      operation_spoc: { ...companyFormData.operation_spoc, designation: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-operation-email">Email</Label>
                  <Input
                    id="edit-operation-email"
                    type="email"
                    value={companyFormData.operation_spoc.email}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      operation_spoc: { ...companyFormData.operation_spoc, email: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-operation-mobile">Mobile</Label>
                  <Input
                    id="edit-operation-mobile"
                    value={companyFormData.operation_spoc.mobile}
                    onChange={(e) => setCompanyFormData({ 
                      ...companyFormData, 
                      operation_spoc: { ...companyFormData.operation_spoc, mobile: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditCompanyOpen(false); resetCompanyForm(); }}>
              Cancel
            </Button>
            <Button 
              onClick={updateCompany}
              disabled={isUpdatingCompany || !companyFormData.name}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              {isUpdatingCompany ? 'Updating...' : 'Update Company'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};