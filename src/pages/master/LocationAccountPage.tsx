import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Upload, X, Edit, File } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';

// List of all world countries
const worldCountries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

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
  const [selectedCountryToAdd, setSelectedCountryToAdd] = useState('');
  const [newZoneData, setNewZoneData] = useState({
    country: '',
    region: '',
    zoneName: ''
  });
  const [isLoadingUserCategories, setIsLoadingUserCategories] = useState(false);

  // Sample data with state management
  const [countries, setCountries] = useState([
    { name: 'Afghanistan', status: false },
    { name: 'India', status: true },
    { name: 'Indonesia', status: true },
    { name: 'Italy', status: false },
    { name: 'United Arab Emirates', status: true },
  ]);

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

  const handleCountryStatusChange = (index: number, checked: boolean) => {
    const updatedCountries = [...countries];
    updatedCountries[index].status = checked;
    setCountries(updatedCountries);
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

  const handleAddCountry = () => {
    if (!selectedCountryToAdd) {
      toast.error('Please select a country to add');
      return;
    }

    // Check if country already exists
    const countryExists = countries.some(country => country.name === selectedCountryToAdd);
    if (countryExists) {
      toast.error('This country already exists in the list');
      return;
    }

    // Add the new country to the countries array
    const newCountry = {
      name: selectedCountryToAdd,
      status: true
    };

    setCountries([...countries, newCountry]);
    toast.success(`Country "${selectedCountryToAdd}" added successfully`);

    // Reset form and close dialog
    setSelectedCountryToAdd('');
    setIsAddCountryOpen(false);
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
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">{localStorage.getItem('selectedOrg')}</h2>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center">
                <p className="text-gray-600">
                  Drag & Drop or{' '}
                  <label className="text-orange-500 cursor-pointer underline">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  </label>
                  {' '}No file chosen
                </p>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  disabled
                  value={localStorage.getItem('selectedCompany')}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="removeLogo"
                    checked={removeLogo}
                    onChange={(e) => setRemoveLogo(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="removeLogo" className="text-sm text-gray-700">
                    Remove Logo
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dailyReport"
                    checked={dailyReport}
                    onChange={(e) => setDailyReport(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="dailyReport" className="text-sm text-gray-700">
                    Daily Helpdesk Report Email
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSubmitCompany}
                  className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="country" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Dialog open={isAddCountryOpen} onOpenChange={setIsAddCountryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Countries
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Country</DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => setIsAddCountryOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country Name
                    </label>
                    <select
                      value={selectedCountryToAdd}
                      onChange={(e) => setSelectedCountryToAdd(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] bg-white"
                    >
                      <option value="">Select Country</option>
                      {worldCountries.map((countryName, index) => (
                        <option key={index} value={countryName}>{countryName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddCountryOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#C72030] hover:bg-[#A01020] text-white"
                      onClick={handleAddCountry}
                    >
                      Add Country
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
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countries.filter(country =>
                    country.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((country, index) => (
                    <TableRow key={index}>
                      <TableCell>{country.name}</TableCell>
                      <TableCell>
                        <Switch
                          checked={country.status}
                          onCheckedChange={(checked) => handleCountryStatusChange(index, checked)}
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
    </div>
  );
};