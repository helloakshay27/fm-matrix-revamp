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
import { Plus, Search, Upload, X, Edit, File, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';
import { getUser } from '@/utils/auth';

// List of all world countries


export const OpsAccountPage = () => {
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
    name: '',
    company_id: '',
    headquarter_id: ''
  });
  const [editRegionData, setEditRegionData] = useState({
    id: '',
    name: '',
    company_id: '',
    headquarter_id: ''
  });
  const [isEditRegionOpen, setIsEditRegionOpen] = useState(false);
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
    logo: null as File | null,
    powered_by_logo: null as File | null
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
    logo: null as File | null,
    company_setup_id: '',
    country_id: ''
  });
  const [canEditCountry, setCanEditCountry] = useState(false);

  // Company Setup state for API management
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [countriesMap, setCountriesMap] = useState<Map<number, string>>(new Map());
  const [organizationsMap, setOrganizationsMap] = useState<Map<number, string>>(new Map());
  const [companiesMap, setCompaniesMap] = useState<Map<number, string>>(new Map());
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
  const [countryCurrentPage, setCountryCurrentPage] = useState(1);
  const countriesPerPage = 10;
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);

  const [regions, setRegions] = useState<any[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [headquartersMap, setHeadquartersMap] = useState<Map<number, string>>(new Map());

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
      fetchCompanies(); // For companiesMap
      fetchCountriesDropdown(); // For countriesMap
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

  // Fetch regions and related data
  useEffect(() => {
    if (activeTab === 'region') {
      fetchRegions();
      fetchCompanies(); // For companiesMap
      fetchCountries(); // For headquarters data
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
          // Create organizations map for company display
          const orgMap = new Map();
          data.organizations.forEach((org: any) => {
            orgMap.set(org.id, org.name);
          });
          setOrganizationsMap(orgMap);
        } else if (Array.isArray(data)) {
          // Fallback for direct array response
          setOrganizations(data);
          const orgMap = new Map();
          data.forEach((org: any) => {
            orgMap.set(org.id, org.name);
          });
          setOrganizationsMap(orgMap);
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
          // Create countries map for company display
          const countryMap = new Map();
          data.countries.forEach(([id, name]) => {
            countryMap.set(id, name);
          });
          setCountriesMap(countryMap);
        } else if (Array.isArray(data)) {
          // Fallback for direct array response
          const mappedCountries = data.map((item) => {
            if (Array.isArray(item) && item.length >= 2) {
              return { id: item[0], name: item[1] };
            }
            return { id: item.id || item.value, name: item.name || item.label };
          });
          setCountriesDropdown(mappedCountries);
          // Create countries map for company display
          const countryMap = new Map();
          mappedCountries.forEach((country) => {
            countryMap.set(country.id, country.name);
          });
          setCountriesMap(countryMap);
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
    if (orgFormData.powered_by_logo) {
      formData.append('organization[powered_by_logo]', orgFormData.powered_by_logo);
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
          logo: null,
          powered_by_logo: null
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
    if (orgFormData.powered_by_logo) {
      formData.append('organization[powered_by_logo]', orgFormData.powered_by_logo);
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
          logo: null,
          powered_by_logo: null
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
      logo: null,
      powered_by_logo: null
    });
    setIsEditOrgOpen(true);
  };

  const handleOrgLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOrgFormData({ ...orgFormData, logo: file });
    }
  };

  const handleOrgPoweredByLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOrgFormData({ ...orgFormData, powered_by_logo: file });
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

  const handleAddRegion = async () => {
    if (!newRegionData.name.trim() || !newRegionData.company_id || !newRegionData.headquarter_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(getFullUrl('/pms/regions.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pms_region: {
            name: newRegionData.name,
            company_id: parseInt(newRegionData.company_id),
            headquarter_id: parseInt(newRegionData.headquarter_id)
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Region created successfully:', result);
        toast.success(`Region "${newRegionData.name}" added successfully`);
        
        // Refresh regions list
        await fetchRegions();
        
        // Reset form and close dialog
        setNewRegionData({ name: '', company_id: '', headquarter_id: '' });
        setIsAddRegionOpen(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to create region:', errorData);
        toast.error('Failed to create region');
      }
    } catch (error) {
      console.error('Error creating region:', error);
      toast.error('Error creating region');
    }
  };

  const handleEditRegion = (region: any) => {
    setEditRegionData({
      id: region.id,
      name: region.name || region.region || '',
      company_id: region.company_id || '',
      headquarter_id: region.headquarter_id || ''
    });
    setIsEditRegionOpen(true);
  };

  const handleUpdateRegion = async () => {
    if (!editRegionData.name.trim() || !editRegionData.company_id || !editRegionData.headquarter_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(getFullUrl(`/pms/regions/${editRegionData.id}.json`), {
        method: 'PATCH',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pms_region: {
            name: editRegionData.name,
            company_id: parseInt(editRegionData.company_id),
            headquarter_id: parseInt(editRegionData.headquarter_id)
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Region updated successfully:', result);
        toast.success(`Region "${editRegionData.name}" updated successfully`);
        
        // Refresh regions list
        await fetchRegions();
        
        // Reset form and close dialog
        setEditRegionData({ id: '', name: '', company_id: '', headquarter_id: '' });
        setIsEditRegionOpen(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to update region:', errorData);
        toast.error('Failed to update region');
      }
    } catch (error) {
      console.error('Error updating region:', error);
      toast.error('Error updating region');
    }
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
      const response = await fetch(getFullUrl('/headquarters.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Headquarters API response:', data);
        
        // Handle response structure for headquarters
        if (Array.isArray(data)) {
          setCountries(data);
          // Build headquarters map for region lookups
          const hqMap = new Map();
          data.forEach((hq: any) => {
            if (hq.id && hq.country_name) {
              hqMap.set(hq.id, hq.country_name);
            }
          });
          setHeadquartersMap(hqMap);
        } else if (data && data.headquarters && Array.isArray(data.headquarters)) {
          setCountries(data.headquarters);
          // Build headquarters map for region lookups
          const hqMap = new Map();
          data.headquarters.forEach((hq: any) => {
            if (hq.id && hq.country_name) {
              hqMap.set(hq.id, hq.country_name);
            }
          });
          setHeadquartersMap(hqMap);
        } else if (data && data.data && Array.isArray(data.data)) {
          setCountries(data.data);
          // Build headquarters map for region lookups
          const hqMap = new Map();
          data.data.forEach((hq: any) => {
            if (hq.id && hq.country_name) {
              hqMap.set(hq.id, hq.country_name);
            }
          });
          setHeadquartersMap(hqMap);
        } else {
          console.error('Headquarters data format unexpected:', data);
          setCountries([]);
          toast.error('Invalid headquarters data format');
        }
      } else {
        toast.error('Failed to fetch headquarters');
        setCountries([]);
      }
    } catch (error) {
      console.error('Error fetching headquarters:', error);
      toast.error('Error fetching headquarters');
      setCountries([]);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const fetchRegions = async () => {
    setIsLoadingRegions(true);
    try {
      const response = await fetch(getFullUrl('/pms/regions.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Regions API response:', data);
        
        // Handle response structure for regions
        if (Array.isArray(data)) {
          setRegions(data);
        } else if (data && data.regions && Array.isArray(data.regions)) {
          setRegions(data.regions);
        } else if (data && data.data && Array.isArray(data.data)) {
          setRegions(data.data);
        } else {
          console.error('Regions data format unexpected:', data);
          setRegions([]);
          toast.error('Invalid regions data format');
        }
      } else {
        toast.error('Failed to fetch regions');
        setRegions([]);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
      toast.error('Error fetching regions');
      setRegions([]);
    } finally {
      setIsLoadingRegions(false);
    }
  };

  const handleCreateCountry = async () => {
    if (!countryFormData.company_setup_id || !countryFormData.country_id) {
      toast.error('Please select both company and country');
      return;
    }

    if (!canEditCountry) {
      toast.error('You do not have permission to create headquarters');
      return;
    }

    try {
      const response = await fetch(getFullUrl('/headquarters.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pms_headquarter: {
            company_setup_id: parseInt(countryFormData.company_setup_id),
            country_id: parseInt(countryFormData.country_id)
          }
        }),
      });

      if (response.ok) {
        toast.success('Headquarters created successfully');
        fetchCountries();
        setIsAddCountryOpen(false);
        setCountryFormData({
          name: '',
          logo: null,
          company_setup_id: '',
          country_id: ''
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to create headquarters:', errorData);
        toast.error('Failed to create headquarters');
      }
    } catch (error) {
      console.error('Error creating headquarters:', error);
      toast.error('Error creating headquarters');
    }
  };

  const handleUpdateCountry = async () => {
    if (!editingCountry || !countryFormData.company_setup_id || !countryFormData.country_id) {
      toast.error('Please select both company and country');
      return;
    }

    if (!canEditCountry) {
      toast.error('You do not have permission to edit headquarters');
      return;
    }

    try {
      const response = await fetch(getFullUrl(`/headquarters/${editingCountry.id}.json`), {
        method: 'PATCH',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pms_headquarter: {
            company_setup_id: parseInt(countryFormData.company_setup_id),
            country_id: parseInt(countryFormData.country_id)
          }
        }),
      });

      if (response.ok) {
        toast.success('Headquarters updated successfully');
        fetchCountries();
        setIsEditCountryOpen(false);
        setEditingCountry(null);
        setCountryFormData({
          name: '',
          logo: null,
          company_setup_id: '',
          country_id: ''
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to update headquarters:', errorData);
        toast.error('Failed to update headquarters');
      }
    } catch (error) {
      console.error('Error updating headquarters:', error);
      toast.error('Error updating headquarters');
    }
  };

  const handleDeleteCountry = async (countryId: number) => {
    if (!canEditCountry) {
      toast.error('You do not have permission to delete headquarters');
      return;
    }

    if (!confirm('Are you sure you want to delete this headquarters?')) {
      return;
    }

    try {
      const response = await fetch(getFullUrl(`/headquarters/${countryId}.json`), {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (response.ok) {
        toast.success('Headquarters deleted successfully');
        fetchCountries();
      } else {
        toast.error('Failed to delete headquarters');
      }
    } catch (error) {
      console.error('Error deleting headquarters:', error);
      toast.error('Error deleting headquarters');
    }
  };

  const handleEditCountry = (headquarters: any) => {
    if (!canEditCountry) {
      toast.error('You do not have permission to edit headquarters');
      return;
    }

    setEditingCountry(headquarters);
    setCountryFormData({
      name: headquarters.name || '',
      logo: null,
      company_setup_id: headquarters.company_setup_id?.toString() || '',
      country_id: headquarters.country_id?.toString() || ''
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
        const responseData = await response.json();
        console.log('Companies API response:', responseData);
        
        // Handle the new API response format with nested data structure
        if (responseData && responseData.code === 200 && Array.isArray(responseData.data)) {
          setCompanies(responseData.data);
          // Create companies map for headquarters display
          const compMap = new Map();
          responseData.data.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        } else if (responseData && Array.isArray(responseData.companies)) {
          // Fallback for old format
          setCompanies(responseData.companies);
          const compMap = new Map();
          responseData.companies.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        } else if (Array.isArray(responseData)) {
          // Direct array format
          setCompanies(responseData);
          const compMap = new Map();
          responseData.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Powered By Logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleOrgPoweredByLogoChange}
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
                            {/* <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteOrganization(org.id)}
                              disabled={!canEditOrganization}
                            >
                              <X className="h-4 w-4" />
                            </Button> */}
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
                      <TableHead>ID</TableHead>
                      <TableHead>Company Logo</TableHead>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!Array.isArray(companies) || companies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 py-8">
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
                            <TableCell className="font-medium">{company.id}</TableCell>
                            <TableCell>
                              {company.company_logo_url ? (
                                <img 
                                  src={company.company_logo_url} 
                                  alt={`${company.name} logo`}
                                  className="w-8 h-8 object-contain rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                  No Logo
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{company.name}</TableCell>
                            <TableCell>{organizationsMap.get(company.organization_id) || 'N/A'}</TableCell>
                            <TableCell>{countriesMap.get(company.country_id) || 'N/A'}</TableCell>
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
                  Add Headquarters
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Headquarters</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company *
                    </label>
                    <select
                      value={countryFormData.company_setup_id}
                      onChange={(e) => setCountryFormData({ ...countryFormData, company_setup_id: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                    >
                      <option value="">Select Company</option>
                      {Array.isArray(companies) && companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      value={countryFormData.country_id}
                      onChange={(e) => setCountryFormData({ ...countryFormData, country_id: e.target.value })}
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
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddCountryOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#C72030] hover:bg-[#A01020] text-white"
                      onClick={handleCreateCountry}
                    >
                      Create Headquarters
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
                  placeholder="Search headquarters..."
                  value={countrySearchTerm}
                  onChange={(e) => setCountrySearchTerm(e.target.value)}
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
                    <TableHead className="font-semibold">Company</TableHead>
                    <TableHead className="font-semibold">Country</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingCountries ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Loading headquarters...
                      </TableCell>
                    </TableRow>
                  ) : countries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No headquarters found
                      </TableCell>
                    </TableRow>
                  ) : (
                    Array.isArray(countries) && countries
                      .filter(headquarters => 
                        headquarters.country_name?.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                        companiesMap.get(headquarters.company_id)?.toLowerCase().includes(countrySearchTerm.toLowerCase())
                      )
                      .slice((countryCurrentPage - 1) * countriesPerPage, countryCurrentPage * countriesPerPage)
                      .map((headquarters) => (
                      <TableRow key={headquarters.id}>
                        <TableCell>{headquarters.id}</TableCell>
                        <TableCell>{companiesMap.get(headquarters.company_id) || headquarters.company_name}</TableCell>
                        <TableCell>{headquarters.country_name}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {canEditCountry && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditCountry(headquarters)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteCountry(headquarters.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination for Country */}
          {Array.isArray(countries) && countries.length > countriesPerPage && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCountryCurrentPage(Math.max(1, countryCurrentPage - 1))}
                disabled={countryCurrentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {countryCurrentPage} of {Math.ceil(countries.length / countriesPerPage)}
              </span>
              <Button
                variant="outline"
                onClick={() => setCountryCurrentPage(Math.min(Math.ceil(countries.length / countriesPerPage), countryCurrentPage + 1))}
                disabled={countryCurrentPage === Math.ceil(countries.length / countriesPerPage)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="region" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Dialog open={isAddRegionOpen} onOpenChange={setIsAddRegionOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Region
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Region</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <select
                      value={newRegionData.company_id}
                      onChange={(e) => setNewRegionData({ ...newRegionData, company_id: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Headquarters
                    </label>
                    <select
                      value={newRegionData.headquarter_id}
                      onChange={(e) => setNewRegionData({ ...newRegionData, headquarter_id: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                    >
                      <option value="">Select Headquarters</option>
                      {countries.map((headquarters) => (
                        <option key={headquarters.id} value={headquarters.id}>
                          {headquarters.country_name} ({companiesMap.get(headquarters.company_id) || headquarters.company_name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region Name
                    </label>
                    <input
                      type="text"
                      value={newRegionData.name}
                      onChange={(e) => setNewRegionData({ ...newRegionData, name: e.target.value })}
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

            {/* Edit Region Dialog */}
            <Dialog open={isEditRegionOpen} onOpenChange={setIsEditRegionOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Region</DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => setIsEditRegionOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <select
                      value={editRegionData.company_id}
                      onChange={(e) => setEditRegionData({ ...editRegionData, company_id: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Headquarters
                    </label>
                    <select
                      value={editRegionData.headquarter_id}
                      onChange={(e) => setEditRegionData({ ...editRegionData, headquarter_id: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                    >
                      <option value="">Select Headquarters</option>
                      {countries.map((headquarters) => (
                        <option key={headquarters.id} value={headquarters.id}>
                          {headquarters.country_name} ({companiesMap.get(headquarters.company_id) || headquarters.company_name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region Name
                    </label>
                    <input
                      type="text"
                      value={editRegionData.name}
                      onChange={(e) => setEditRegionData({ ...editRegionData, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      placeholder="Enter region name"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditRegionOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#C72030] hover:bg-[#A01020] text-white"
                      onClick={handleUpdateRegion}
                    >
                      Update Region
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

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Region Name</TableHead>
                    <TableHead className="font-semibold">Company</TableHead>
                    <TableHead className="font-semibold">Headquarters</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingRegions ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Loading regions...
                      </TableCell>
                    </TableRow>
                  ) : regions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No regions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    regions
                      .filter(region => 
                        region.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        companiesMap.get(region.company_id)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        headquartersMap.get(region.headquarter_id)?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((region) => (
                        <TableRow key={region.id}>
                          <TableCell>{region.id}</TableCell>
                          <TableCell>{region.name}</TableCell>
                          <TableCell>{companiesMap.get(region.company_id) || region.company_name || '-'}</TableCell>
                          <TableCell>{headquartersMap.get(region.headquarter_id) || region.headquarter_name || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditRegion(region)}
                                className="hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4" />
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
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
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
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
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
          <div className="flex items-center justify-between mb-4">
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

      {/* All Edit Dialogs */}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Powered By Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleOrgPoweredByLogoChange}
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