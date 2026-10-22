import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, Upload, X, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { AttachmentUpload } from '@/components/common/AttachmentUpload';

// Column configs â€” har tab ka apna EnhancedTable
const countryColumns: ColumnConfig[] = [
  { key: 'name', label: 'Country', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true, draggable: true },
];

const regionColumns: ColumnConfig[] = [
  { key: 'country', label: 'Country', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'region', label: 'Region', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true, draggable: true },
];

const zoneColumns: ColumnConfig[] = [
  { key: 'country', label: 'Country', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'region', label: 'Region', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'zone', label: 'Zone', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'icon', label: 'Icon', sortable: false, hideable: true, defaultVisible: true, draggable: true },
];

const siteColumns: ColumnConfig[] = [
  { key: 'country', label: 'Country', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'region', label: 'Region', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'zone', label: 'Zone', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'site', label: 'Site', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'latitude', label: 'Latitude', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'longitude', label: 'Longitude', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'qrCode', label: 'QR Code', sortable: false, hideable: true, defaultVisible: true, draggable: true },
];

const entityColumns: ColumnConfig[] = [
  { key: 'status', label: 'Active', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'entity', label: 'Entity', sortable: true, hideable: true, defaultVisible: true, draggable: true },
];

const userCategoryColumns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'name', label: 'Name', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'resource_type', label: 'Resource Type', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'created_at', label: 'Created At', sortable: true, hideable: true, defaultVisible: true, draggable: true },
];

// Rows me original array index (_index) rakhte hain taaki status toggle handlers
// sort/filter/pagination ke baad bhi sahi row update karein. Client search khud karte
// hain (sirf diye gaye text fields pe) â€” warna _index / boolean status bhi match ho jaate.
const filterRows = <T extends Record<string, any>>(rows: T[], term: string, fields: (keyof T)[]) => {
  const query = term.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter(row => fields.some(field => String(row[field] ?? '').toLowerCase().includes(query)));
};

const brandSwitchClass = 'data-[state=checked]:bg-brand data-[state=unchecked]:bg-gray-300';
const addButtonClass = 'bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium';

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
  // Har tab ka apna search term â€” ek tab me type karne se dusra filter nahi hota
  const [tableSearch, setTableSearch] = useState({
    country: '',
    region: '',
    zone: '',
    site: '',
    entity: '',
    userCategory: '',
  });
  const setSearchFor = (key: keyof typeof tableSearch) => (value: string) =>
    setTableSearch(prev => ({ ...prev, [key]: value }));
  const [companyName, setCompanyName] = useState("");
  const [removeLogo, setRemoveLogo] = useState(false);
  const [dailyReport, setDailyReport] = useState(false);
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [zoneImageFile, setZoneImageFile] = useState<File | null>(null);
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

  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
      setCompanyLogoFile(file);
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

  const handleZoneFileUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
      setZoneImageFile(file);
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

  // Table rows (original index ke saath) + per-tab search
  const countryRows = filterRows(countries.map((c, _index) => ({ ...c, _index })), tableSearch.country, ['name']);
  const regionRows = filterRows(regions.map((r, _index) => ({ ...r, _index })), tableSearch.region, ['country', 'region']);
  const zoneRows = filterRows(zones.map((z, _index) => ({ ...z, _index })), tableSearch.zone, ['country', 'region', 'zone']);
  const siteRows = filterRows(sites.map((s, _index) => ({ ...s, _index })), tableSearch.site, ['country', 'region', 'zone', 'site', 'latitude', 'longitude']);
  const entityRows = filterRows(entities.map((e, _index) => ({ ...e, _index })), tableSearch.entity, ['entity']);
  const userCategoryRows = filterRows(
    userCategories.map((category, _index) => ({ ...category, _index })),
    tableSearch.userCategory,
    ['id', 'name', 'resource_type']
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ACCOUNT</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-6 bg-white border border-gray-200">
          {[
            { value: 'organization', label: 'Organization' },
            { value: 'company', label: 'Company' },
            { value: 'country', label: 'Country' },
            { value: 'region', label: 'Region' },
            { value: 'zone', label: 'Zone' },
            { value: 'site', label: 'Site' },
            { value: 'entity', label: 'Entity' },
            { value: 'user-category', label: 'User Category' },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              {tab.label}
            </TabsTrigger>
          ))}
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
              <AttachmentUpload
                label="Company Logo"
                chooseText="Choose Logo"
                uploadText="Upload Logo"
                emptyText="No file chosen"
                accept="image/*"
                files={companyLogoFile ? [companyLogoFile] : []}
                onFilesSelected={handleFileUpload}
                onRemove={() => setCompanyLogoFile(null)}
              />

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
              <div className="fm-action-bar pt-4">
                <button type="button" className="fm-action-primary" onClick={handleSubmitCompany}>
                  Submit
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="country" className="space-y-4">
          <EnhancedTable
            data={countryRows}
            columns={countryColumns}
            getItemId={(item) => String(item._index)}
            storageKey="account-country-table"
            renderCell={(item, columnKey) => {
              if (columnKey === 'status') {
                return (
                  <Switch
                    checked={item.status}
                    onCheckedChange={(checked) => handleCountryStatusChange(item._index, checked)}
                    className={brandSwitchClass}
                  />
                );
              }
              return item[columnKey as keyof typeof item] as React.ReactNode;
            }}
            enableSearch={true}
            searchTerm={tableSearch.country}
            onSearchChange={setSearchFor('country')}
            disableClientSearch={true}
            searchPlaceholder="Search countries..."
            emptyMessage="No countries found"
            pagination={true}
            pageSize={10}
            leftActions={
            <Dialog open={isAddCountryOpen} onOpenChange={setIsAddCountryOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className={addButtonClass}>
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
                  <div className="fm-action-bar">
                    <button type="button" className="fm-action-secondary" onClick={() => setIsAddCountryOpen(false)}>
                      Cancel
                    </button>
                    <button type="button" className="fm-action-primary" onClick={handleAddCountry}>
                      Add Country
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            }
          />
        </TabsContent>

        <TabsContent value="region" className="space-y-4">
          <EnhancedTable
            data={regionRows}
            columns={regionColumns}
            getItemId={(item) => String(item._index)}
            storageKey="account-region-table"
            renderCell={(item, columnKey) => {
              if (columnKey === 'status') {
                return (
                  <Switch
                    checked={item.status}
                    onCheckedChange={(checked) => handleRegionStatusChange(item._index, checked)}
                    className={brandSwitchClass}
                  />
                );
              }
              return item[columnKey as keyof typeof item] as React.ReactNode;
            }}
            enableSearch={true}
            searchTerm={tableSearch.region}
            onSearchChange={setSearchFor('region')}
            disableClientSearch={true}
            searchPlaceholder="Search regions..."
            emptyMessage="No regions found"
            pagination={true}
            pageSize={10}
            leftActions={
            <Dialog open={isAddRegionOpen} onOpenChange={setIsAddRegionOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className={addButtonClass}>
                  <Plus className="w-4 h-4 mr-2" />
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
                  <div className="fm-action-bar">
                    <button type="button" className="fm-action-secondary" onClick={() => setIsAddRegionOpen(false)}>
                      Cancel
                    </button>
                    <button type="button" className="fm-action-primary" onClick={handleAddRegion}>
                      Add Region
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            }
          />
        </TabsContent>

        <TabsContent value="zone" className="space-y-4">
          <EnhancedTable
            data={zoneRows}
            columns={zoneColumns}
            getItemId={(item) => String(item._index)}
            storageKey="account-zone-table"
            renderCell={(item, columnKey) => {
              if (columnKey === 'status') {
                return (
                  <Switch
                    checked={item.status}
                    onCheckedChange={(checked) => handleZoneStatusChange(item._index, checked)}
                    className={brandSwitchClass}
                  />
                );
              }
              if (columnKey === 'icon') {
                return (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <img src={item.icon} alt="Zone icon" className="w-6 h-6" />
                  </div>
                );
              }
              return item[columnKey as keyof typeof item] as React.ReactNode;
            }}
            enableSearch={true}
            searchTerm={tableSearch.zone}
            onSearchChange={setSearchFor('zone')}
            disableClientSearch={true}
            searchPlaceholder="Search zones..."
            emptyMessage="No zones found"
            pagination={true}
            pageSize={10}
            leftActions={
            <div className="flex gap-2">
              <Dialog open={isAddZoneOpen} onOpenChange={setIsAddZoneOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className={addButtonClass}>
                    <Plus className="w-4 h-4 mr-2" />
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
                    <div className="fm-action-bar">
                      <button type="button" className="fm-action-secondary" onClick={() => setIsAddZoneOpen(false)}>
                        Cancel
                      </button>
                      <button type="button" className="fm-action-primary" onClick={handleAddZone}>
                        Add Zone
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isEditZoneOpen} onOpenChange={setIsEditZoneOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-9 px-4 text-sm font-medium">
                    <Edit className="w-4 h-4 mr-2" />
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
                    <div className="fm-action-bar pt-4">
                      <button type="button" className="fm-action-primary" onClick={handleEditSelectedZones}>
                        Edit Selected Zone
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            }
          />
        </TabsContent>

        <TabsContent value="site" className="space-y-4">
          <EnhancedTable
            data={siteRows}
            columns={siteColumns}
            getItemId={(item) => String(item._index)}
            storageKey="account-site-table"
            renderCell={(item, columnKey) => {
              if (columnKey === 'status') {
                return (
                  <Switch
                    checked={item.status}
                    onCheckedChange={(checked) => handleSiteStatusChange(item._index, checked)}
                    className={brandSwitchClass}
                  />
                );
              }
              if (columnKey === 'qrCode') {
                return (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <img src={item.qrCode} alt="QR Code" className="w-6 h-6" />
                  </div>
                );
              }
              return item[columnKey as keyof typeof item] as React.ReactNode;
            }}
            enableSearch={true}
            searchTerm={tableSearch.site}
            onSearchChange={setSearchFor('site')}
            disableClientSearch={true}
            searchPlaceholder="Search sites..."
            emptyMessage="No sites found"
            pagination={true}
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="entity" className="space-y-4">
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
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={handleSampleFormat}
                    variant="outline"
                  >
                    ðŸ“ Sample Format
                  </Button>
                  <Button
                    onClick={handleImportEntity}
                  >
                    + Import
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <EnhancedTable
            data={entityRows}
            columns={entityColumns}
            getItemId={(item) => String(item._index)}
            storageKey="account-entity-table"
            renderCell={(item, columnKey) => {
              if (columnKey === 'status') {
                return (
                  <Switch
                    checked={item.status}
                    onCheckedChange={(checked) => handleEntityStatusChange(item._index, checked)}
                    className={brandSwitchClass}
                  />
                );
              }
              return item[columnKey as keyof typeof item] as React.ReactNode;
            }}
            renderActions={() => (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            )}
            enableSearch={true}
            searchTerm={tableSearch.entity}
            onSearchChange={setSearchFor('entity')}
            disableClientSearch={true}
            searchPlaceholder="Search entities..."
            emptyMessage="No entities found"
            pagination={true}
            pageSize={10}
            leftActions={
              <Button
                size="sm"
                className={addButtonClass}
                onClick={() => setShowEntityForm(!showEntityForm)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entity
              </Button>
            }
          />
        </TabsContent>

        <TabsContent value="user-category" className="space-y-4">
          <EnhancedTable
            data={userCategoryRows}
            columns={userCategoryColumns}
            getItemId={(item) => String(item.id ?? item._index)}
            storageKey="account-user-category-table"
            renderCell={(item, columnKey) => {
              if (columnKey === 'created_at') {
                return new Date(item.created_at).toLocaleDateString();
              }
              return item[columnKey] as React.ReactNode;
            }}
            renderActions={(item) => (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => handleEditUserCategory(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            enableSearch={true}
            searchTerm={tableSearch.userCategory}
            onSearchChange={setSearchFor('userCategory')}
            disableClientSearch={true}
            searchPlaceholder="Search user categories..."
            emptyMessage="No user categories found"
            loading={isLoadingUserCategories}
            loadingMessage="Loading user categories..."
            pagination={true}
            pageSize={10}
            leftActions={
            <Dialog open={isAddUserCategoryOpen} onOpenChange={setIsAddUserCategoryOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className={addButtonClass}>
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
                  <div className="fm-action-bar">
                    <button type="button" className="fm-action-secondary" onClick={() => setIsAddUserCategoryOpen(false)}>
                      Cancel
                    </button>
                    <button type="button" className="fm-action-primary" onClick={handleSubmitUserCategory}>
                      Add User Category
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            }
          />

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
                <div className="fm-action-bar">
                  <button type="button" className="fm-action-secondary" onClick={() => setIsEditUserCategoryOpen(false)}>
                    Cancel
                  </button>
                  <button type="button" className="fm-action-primary" onClick={handleUpdateUserCategory}>
                    Update User Category
                  </button>
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

            <AttachmentUpload
              label="Upload Image"
              chooseText="Choose Zone Image"
              uploadText="Upload Zone Image"
              emptyText="No image chosen"
              accept="image/*"
              files={zoneImageFile ? [zoneImageFile] : []}
              onFilesSelected={handleZoneFileUpload}
              onRemove={() => setZoneImageFile(null)}
            />

            <div className="fm-action-bar pt-4">
              <button type="button" className="fm-action-primary" onClick={handleSaveZoneChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
