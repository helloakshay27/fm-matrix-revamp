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

interface CountryTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  entriesPerPage: string;
  setEntriesPerPage: (entries: string) => void;
}

export const CountryTab: React.FC<CountryTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  
  // Countries state for API management
  const [countries, setCountries] = useState<any[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [isEditCountryOpen, setIsEditCountryOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<any>(null);
  const [countryFormData, setCountryFormData] = useState({
    name: '',
    logo: null as File | null,
    company_setup_id: '',
    country_id: ''
  });
  const [canEditCountry, setCanEditCountry] = useState(false);
  
  // Maps for displaying related data
  const [countriesMap, setCountriesMap] = useState<Map<number, string>>(new Map());
  const [companiesMap, setCompaniesMap] = useState<Map<number, string>>(new Map());
  const [countriesDropdown, setCountriesDropdown] = useState<any[]>([]);
  const [companiesDropdown, setCompaniesDropdown] = useState<any[]>([]);

  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: "",
  };

  const checkEditPermission = () => {
    const userEmail = user.email || '';
    const allowedEmails = ['abhishek.sharma@lockated.com', 'your-specific-email@domain.com'];
    setCanEditCountry(allowedEmails.includes(userEmail));
  };

  useEffect(() => {
    fetchCountries();
    fetchCompanies();
    fetchCountriesDropdown();
    checkEditPermission();
  }, []);

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
        console.log('Countries API response:', data);
        
        if (Array.isArray(data)) {
          setCountries(data);
        } else if (data && data.headquarters && Array.isArray(data.headquarters)) {
          setCountries(data.headquarters);
        } else if (data && data.data && Array.isArray(data.data)) {
          setCountries(data.data);
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

  const fetchCompanies = async () => {
    try {
      const response = await fetch(getFullUrl('/pms/company_setups/company_index.json'), {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData && responseData.code === 200 && Array.isArray(responseData.data)) {
          setCompaniesDropdown(responseData.data);
          const compMap = new Map();
          responseData.data.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        } else if (responseData && Array.isArray(responseData.companies)) {
          setCompaniesDropdown(responseData.companies);
          const compMap = new Map();
          responseData.companies.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        } else if (Array.isArray(responseData)) {
          setCompaniesDropdown(responseData);
          const compMap = new Map();
          responseData.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchCountriesDropdown = async () => {
    try {
      const response = await fetch(getFullUrl('/headquarters.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Countries dropdown API response:', data);
        
        if (Array.isArray(data)) {
          // Handle direct array format
          const uniqueCountries = new Map();
          data.forEach((country: any) => {
            const id = country.country_id || country.id;
            const name = country.country_name || country.name;
            if (id && name && !uniqueCountries.has(id)) {
              uniqueCountries.set(id, name);
            }
          });
          
          const countriesArray = Array.from(uniqueCountries.entries()).map(([id, name]) => ({ id, name }));
          setCountriesDropdown(countriesArray);
          setCountriesMap(uniqueCountries);
        } else if (data && data.headquarters && Array.isArray(data.headquarters)) {
          // Handle nested headquarters format
          const uniqueCountries = new Map();
          data.headquarters.forEach((hq: any) => {
            const id = hq.country_id;
            const name = hq.country_name;
            if (id && name && !uniqueCountries.has(id)) {
              uniqueCountries.set(id, name);
            }
          });
          
          const countriesArray = Array.from(uniqueCountries.entries()).map(([id, name]) => ({ id, name }));
          setCountriesDropdown(countriesArray);
          setCountriesMap(uniqueCountries);
        } else if (data && data.countries && Array.isArray(data.countries)) {
          // Handle existing format as fallback
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

  const handleCreateCountry = async () => {
    if (!countryFormData.company_setup_id || !countryFormData.country_id) {
      toast.error('Please select both company and country');
      return;
    }

    if (!canEditCountry) {
      toast.error('You do not have permission to create countries');
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
        toast.success('Country created successfully');
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
        console.error('Failed to create country:', errorData);
        toast.error('Failed to create country');
      }
    } catch (error) {
      console.error('Error creating country:', error);
      toast.error('Error creating country');
    }
  };

  const handleUpdateCountry = async () => {
    if (!editingCountry || !countryFormData.company_setup_id || !countryFormData.country_id) {
      toast.error('Please select both company and country');
      return;
    }

    if (!canEditCountry) {
      toast.error('You do not have permission to edit countries');
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
        toast.success('Country updated successfully');
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
        console.error('Failed to update country:', errorData);
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
      const response = await fetch(getFullUrl(`/headquarters/${countryId}.json`), {
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

  const handleEditCountry = (headquarters: any) => {
    if (!canEditCountry) {
      toast.error('You do not have permission to edit countries');
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

  const filteredCountries = countries.filter(country =>
    country.country_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    companiesMap.get(country.company_setup_id)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Dialog open={isAddCountryOpen} onOpenChange={setIsAddCountryOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Country</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Company *</Label>
                <Select value={countryFormData.company_setup_id} onValueChange={(value) => setCountryFormData({ ...countryFormData, company_setup_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companiesDropdown.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select value={countryFormData.country_id} onValueChange={(value) => setCountryFormData({ ...countryFormData, country_id: value })}>
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
                <Label htmlFor="logo">Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  onChange={handleCountryLogoChange}
                  accept="image/*"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCountryOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCountry} className="bg-[#C72030] hover:bg-[#A01020] text-white">
                Create Country
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
              placeholder="Search countries..."
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
                <TableHead className="font-semibold">Country</TableHead>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingCountries ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading countries...
                  </TableCell>
                </TableRow>
              ) : filteredCountries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No countries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCountries.map((country) => (
                  <TableRow key={country.id}>
                    <TableCell>{country.id}</TableCell>
                    <TableCell>{country.country_name || countriesMap.get(country.country_id) || '-'}</TableCell>
                    <TableCell>{companiesMap.get(country.company_setup_id) || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCountry(country)}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCountry(country.id)}
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

      {/* Edit Country Dialog */}
      <Dialog open={isEditCountryOpen} onOpenChange={setIsEditCountryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Country</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_company">Company *</Label>
              <Select value={countryFormData.company_setup_id} onValueChange={(value) => setCountryFormData({ ...countryFormData, company_setup_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companiesDropdown.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_country">Country *</Label>
              <Select value={countryFormData.country_id} onValueChange={(value) => setCountryFormData({ ...countryFormData, country_id: value })}>
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
              <Label htmlFor="edit_logo">Logo</Label>
              <Input
                id="edit_logo"
                type="file"
                onChange={handleCountryLogoChange}
                accept="image/*"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCountryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCountry} className="bg-[#C72030] hover:bg-[#A01020] text-white">
              Update Country
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
