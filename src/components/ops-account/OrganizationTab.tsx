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

interface OrganizationTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  entriesPerPage: string;
  setEntriesPerPage: (entries: string) => void;
}

export const OrganizationTab: React.FC<OrganizationTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  
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

  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: "",
  };

  const checkEditPermission = () => {
    const userEmail = user.email || '';
    const allowedEmails = ['abhishek.sharma@lockated.com', 'your-specific-email@domain.com'];
    setCanEditOrganization(allowedEmails.includes(userEmail));
  };

  useEffect(() => {
    fetchOrganizations();
    fetchCountriesDropdown();
    checkEditPermission();
  }, []);

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
        
        if (data && data.organizations && Array.isArray(data.organizations)) {
          setOrganizations(data.organizations);
        } else if (Array.isArray(data)) {
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
        
        if (data && data.countries && Array.isArray(data.countries)) {
          const mappedCountries = data.countries.map(([id, name]) => ({ id, name }));
          setCountriesDropdown(mappedCountries);
        } else if (Array.isArray(data)) {
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
        resetForm();
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
        resetForm();
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

  const resetForm = () => {
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
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.domain?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Dialog open={isAddOrgOpen} onOpenChange={setIsAddOrgOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Organization</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Organization Name *</Label>
                <Input
                  id="name"
                  value={orgFormData.name}
                  onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={orgFormData.description}
                  onChange={(e) => setOrgFormData({ ...orgFormData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={orgFormData.domain}
                  onChange={(e) => setOrgFormData({ ...orgFormData, domain: e.target.value })}
                  placeholder="Enter domain"
                />
              </div>
              <div>
                <Label htmlFor="sub_domain">Sub Domain</Label>
                <Input
                  id="sub_domain"
                  value={orgFormData.sub_domain}
                  onChange={(e) => setOrgFormData({ ...orgFormData, sub_domain: e.target.value })}
                  placeholder="Enter sub domain"
                />
              </div>
              <div>
                <Label htmlFor="front_domain">Front Domain</Label>
                <Input
                  id="front_domain"
                  value={orgFormData.front_domain}
                  onChange={(e) => setOrgFormData({ ...orgFormData, front_domain: e.target.value })}
                  placeholder="Enter front domain"
                />
              </div>
              <div>
                <Label htmlFor="front_subdomain">Front Subdomain</Label>
                <Input
                  id="front_subdomain"
                  value={orgFormData.front_subdomain}
                  onChange={(e) => setOrgFormData({ ...orgFormData, front_subdomain: e.target.value })}
                  placeholder="Enter front subdomain"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={orgFormData.country_id} onValueChange={(value) => setOrgFormData({ ...orgFormData, country_id: value })}>
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
                <Label htmlFor="logo">Organization Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  onChange={handleOrgLogoChange}
                  accept="image/*"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="powered_by_logo">Powered By Logo</Label>
                <Input
                  id="powered_by_logo"
                  type="file"
                  onChange={handleOrgPoweredByLogoChange}
                  accept="image/*"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOrgOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrganization} className="bg-[#C72030] hover:bg-[#A01020] text-white">
                Create Organization
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
              placeholder="Search organizations..."
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
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Domain</TableHead>
                <TableHead className="font-semibold">Country</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingOrganizations ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading organizations...
                  </TableCell>
                </TableRow>
              ) : filteredOrganizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No organizations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>{org.id}</TableCell>
                    <TableCell>{org.name}</TableCell>
                    <TableCell>{org.description || '-'}</TableCell>
                    <TableCell>{org.domain || '-'}</TableCell>
                    <TableCell>
                      {countriesDropdown.find(c => c.id.toString() === org.country_id?.toString())?.name || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditOrganization(org)}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOrganization(org.id)}
                          className="hover:bg-red-100 text-red-600"
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

      {/* Edit Organization Dialog */}
      <Dialog open={isEditOrgOpen} onOpenChange={setIsEditOrgOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_name">Organization Name *</Label>
              <Input
                id="edit_name"
                value={orgFormData.name}
                onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Input
                id="edit_description"
                value={orgFormData.description}
                onChange={(e) => setOrgFormData({ ...orgFormData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label htmlFor="edit_domain">Domain</Label>
              <Input
                id="edit_domain"
                value={orgFormData.domain}
                onChange={(e) => setOrgFormData({ ...orgFormData, domain: e.target.value })}
                placeholder="Enter domain"
              />
            </div>
            <div>
              <Label htmlFor="edit_sub_domain">Sub Domain</Label>
              <Input
                id="edit_sub_domain"
                value={orgFormData.sub_domain}
                onChange={(e) => setOrgFormData({ ...orgFormData, sub_domain: e.target.value })}
                placeholder="Enter sub domain"
              />
            </div>
            <div>
              <Label htmlFor="edit_front_domain">Front Domain</Label>
              <Input
                id="edit_front_domain"
                value={orgFormData.front_domain}
                onChange={(e) => setOrgFormData({ ...orgFormData, front_domain: e.target.value })}
                placeholder="Enter front domain"
              />
            </div>
            <div>
              <Label htmlFor="edit_front_subdomain">Front Subdomain</Label>
              <Input
                id="edit_front_subdomain"
                value={orgFormData.front_subdomain}
                onChange={(e) => setOrgFormData({ ...orgFormData, front_subdomain: e.target.value })}
                placeholder="Enter front subdomain"
              />
            </div>
            <div>
              <Label htmlFor="edit_country">Country</Label>
              <Select value={orgFormData.country_id} onValueChange={(value) => setOrgFormData({ ...orgFormData, country_id: value })}>
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
              <Label htmlFor="edit_logo">Organization Logo</Label>
              <Input
                id="edit_logo"
                type="file"
                onChange={handleOrgLogoChange}
                accept="image/*"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit_powered_by_logo">Powered By Logo</Label>
              <Input
                id="edit_powered_by_logo"
                type="file"
                onChange={handleOrgPoweredByLogoChange}
                accept="image/*"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOrgOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrganization} className="bg-[#C72030] hover:bg-[#A01020] text-white">
              Update Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
