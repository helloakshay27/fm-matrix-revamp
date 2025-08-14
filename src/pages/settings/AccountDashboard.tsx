
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Upload, X, Edit, CalendarDays, Filter, MoreVertical } from 'lucide-react';
import { AddCountryDialog } from '@/components/AddCountryDialog';
import { AddRegionDialog } from '@/components/AddRegionDialog';
import { AddZoneDialog } from '@/components/AddZoneDialog';
import { EditZoneDialog } from '@/components/EditZoneDialog';
import { AddEntityDialog } from '@/components/AddEntityDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export const AccountDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('organization');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [isAddRegionOpen, setIsAddRegionOpen] = useState(false);
  const [isAddZoneOpen, setIsAddZoneOpen] = useState(false);
  const [isEditZoneOpen, setIsEditZoneOpen] = useState(false);
  const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
  const [companyName, setCompanyName] = useState('Sanket Enterprise');
  const [removeLogo, setRemoveLogo] = useState(false);
  const [dailyReport, setDailyReport] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [entityName, setEntityName] = useState('');
  const [holidaySearchTerm, setHolidaySearchTerm] = useState('');

  // Holiday Calendar data
  const [holidays, setHolidays] = useState([
    {
      id: '1',
      holidayName: 'Republic Day',
      date: '26 January 2025',
      recurring: true,
      applicableLocation: 'Location 1-4',
      holidayType: 'Public',
      applicableFor: 'FM'
    },
    {
      id: '2',
      holidayName: 'Maha Shivratri',
      date: '26 February 2025',
      recurring: false,
      applicableLocation: 'Location 1-4',
      holidayType: 'Festival',
      applicableFor: 'Customers'
    },
    {
      id: '3',
      holidayName: 'Holi',
      date: '14 March 2025',
      recurring: false,
      applicableLocation: 'Location 1-4',
      holidayType: 'Maintenance',
      applicableFor: 'FM'
    },
    {
      id: '4',
      holidayName: 'Mahashivratri Day/Labour Day',
      date: '1 May 2025',
      recurring: true,
      applicableLocation: 'Location 1-4',
      holidayType: 'Public',
      applicableFor: 'FM'
    },
    {
      id: '5',
      holidayName: 'Independence Day',
      date: '15 August 2025',
      recurring: true,
      applicableLocation: 'Location 1-4',
      holidayType: 'Festival',
      applicableFor: 'Customers'
    }
  ]);

  // Holiday Calendar columns
  const holidayColumns: ColumnConfig[] = [
    {
      key: 'holidayName',
      label: 'Holiday Name',
      sortable: true,
      hideable: false,
      draggable: true,
      defaultVisible: true
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      hideable: true,
      draggable: true,
      defaultVisible: true
    },
    {
      key: 'recurring',
      label: 'Recurring',
      sortable: true,
      hideable: true,
      draggable: true,
      defaultVisible: true
    },
    {
      key: 'applicableLocation',
      label: 'Applicable Location',
      sortable: true,
      hideable: true,
      draggable: true,
      defaultVisible: true
    },
    {
      key: 'holidayType',
      label: 'Holiday Type',
      sortable: true,
      hideable: true,
      draggable: true,
      defaultVisible: true
    },
    {
      key: 'applicableFor',
      label: 'Applicable for',
      sortable: true,
      hideable: true,
      draggable: true,
      defaultVisible: true
    }
  ];

  // Sample data with state management
  const [countries, setCountries] = useState([
    { name: 'Afghanistan', status: false },
    { name: 'Albania', status: false },
    { name: 'Algeria', status: false },
    { name: 'Andorra', status: true },
    { name: 'Angola', status: true },
    { name: 'Anguilla', status: true },
    { name: 'Antigua&Barbuda', status: true },
    { name: 'Argentina', status: true },
    { name: 'Armenia', status: true },
    { name: 'Australia', status: true },
  ]);

  const [regions, setRegions] = useState([
    { country: 'Australia', region: 'VICTORIA', status: false },
    { country: 'France', region: 'IT-S', status: false },
    { country: 'India', region: 'bng', status: true },
    { country: 'India', region: 'North', status: true },
    { country: 'India', region: 'West', status: true },
    { country: 'India', region: 'Area 1', status: true },
    { country: 'India', region: 'Demo1', status: true },
    { country: 'India', region: 'Demo', status: true },
    { country: 'India', region: 'MP', status: false },
    { country: 'India', region: 'Hyderabad', status: false },
  ]);

  const [zones, setZones] = useState([
    { country: 'India', region: 'West', zone: 'Maharashtra', status: true, icon: '/lovable-uploads/placeholder.svg' },
    { country: 'India', region: 'Chennai', zone: 'South Zone', status: true, icon: null },
    { country: 'India', region: 'Kolkata', zone: 'East Zone', status: true, icon: null },
    { country: 'India', region: 'Mumbai', zone: 'West Zone', status: true, icon: null },
  ]);

  const [sites, setSites] = useState([
    { country: 'India', region: 'Mumbai', zone: 'West Zone', site: 'Lockated Site 2', latitude: '19.1249466', longitude: '72.8302155', status: false, qrCode: '/lovable-uploads/placeholder.svg' },
    { country: 'India', region: 'Mumbai', zone: 'West Zone', site: 'Lockated Site 1', latitude: '18.5509109', longitude: '73.8910294', status: false, qrCode: '/lovable-uploads/placeholder.svg' },
  ]);

  const [entities, setEntities] = useState([
    { entity: 'demo', status: true },
    { entity: 'Haven Infoline', status: true },
    { entity: 'Demo', status: false },
    { entity: 'HDFC Bank', status: true },
    { entity: 'Mastercard', status: true },
    { entity: 'Tata Consultancy', status: true },
    { entity: 'Deutsche bank', status: true },
    { entity: 'Coca Cola', status: true },
    { entity: 'Infinity', status: true },
    { entity: 'HSBC', status: true },
    { entity: 'Awfis', status: true },
  ]);

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
    toast.success('Entity added successfully');
    setEntityName('');
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

  // Holiday Calendar functions
  const renderHolidayCell = (holiday: any, columnKey: string) => {
    switch (columnKey) {
      case 'holidayName':
        return <span className="text-gray-900 font-medium">{holiday.holidayName}</span>;
      
      case 'date':
        return <span className="text-gray-900">{holiday.date}</span>;
      
      case 'recurring':
        return (
          <span className="text-gray-900">
            {holiday.recurring ? 'Yes' : 'No'}
          </span>
        );
      
      case 'applicableLocation':
        return <span className="text-gray-900">{holiday.applicableLocation}</span>;
      
      case 'holidayType':
        return (
          <Badge 
            variant={
              holiday.holidayType === 'Public' 
                ? 'default' 
                : holiday.holidayType === 'Festival' 
                ? 'secondary' 
                : 'outline'
            }
            className="bg-gray-100 text-gray-900 hover:bg-gray-200"
          >
            {holiday.holidayType}
          </Badge>
        );
      
      case 'applicableFor':
        return <span className="text-gray-900">{holiday.applicableFor}</span>;
      
      default:
        return holiday[columnKey];
    }
  };

  const renderHolidayActions = (holiday: any) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit Holiday</DropdownMenuItem>
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Handle URL-based tab selection
  useEffect(() => {
    console.log('AccountDashboard mounted, location:', location.pathname);
    if (location.pathname.includes('/holiday-calendar')) {
      console.log('Setting tab to holiday-calendar');
      setActiveTab('holiday-calendar');
    }
  }, [location.pathname]);

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
          <TabsTrigger value="holiday-calendar">Holiday Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Haven Infoline</h2>
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
                  value={companyName}
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
            <Button
              onClick={() => setIsAddCountryOpen(true)}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Countries
            </Button>
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
                    <TableHead className="font-semibold">Country</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countries.map((country, index) => (
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
            <Button
              onClick={() => setIsAddRegionOpen(true)}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              Add Region
            </Button>
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
              <Button
                onClick={() => setIsAddZoneOpen(true)}
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
              >
                Add Zone
              </Button>
              <Button
                onClick={() => setIsEditZoneOpen(true)}
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
              >
                Edit Zone
              </Button>
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
                <Button size="sm" variant="outline">Search</Button>
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
                  {zones.map((zone, index) => (
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
                        {zone.icon ? (
                          <img src={zone.icon} alt="Zone icon" className="w-12 h-8 object-cover rounded" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="text-sm text-gray-600">
            Showing 1 to 4 of 4 entries
          </div>
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
                        <img src={site.qrCode} alt="QR Code" className="w-8 h-8" />
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
              onClick={() => setIsAddEntityOpen(true)}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entity
            </Button>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Enter Entity Name"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                />
                <Button
                  onClick={handleSubmitEntity}
                  className="bg-[#C72030] hover:bg-[#A01020] text-white"
                >
                  Submit
                </Button>
                <Button
                  onClick={handleSampleFormat}
                  variant="outline"
                  className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
                >
                  Sample Format
                </Button>
                <Button
                  onClick={handleImportEntity}
                  className="bg-[#C72030] hover:bg-[#A01020] text-white"
                >
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Actions</TableHead>
                    <TableHead className="font-semibold">Active/Inactive</TableHead>
                    <TableHead className="font-semibold">Entity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entities.map((entity, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#C72030] hover:bg-[#C72030] hover:text-white p-1"
                        >
                          <Edit className="w-4 h-4" />
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

        <TabsContent value="holiday-calendar" className="space-y-4">
          <div className="flex min-h-screen bg-[#f6f4ee]">
            {/* Main Content */}
            <div className="flex-1">
              <div className="p-6">
                {/* Header Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="h-5 w-5 text-gray-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Holiday Calendar</h2>
                  </div>
                  <p className="text-gray-600">Manage Holidays</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-3">
                    <Button 
                      className="bg-[#8B5A3C] hover:bg-[#7A4A2A] text-white flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Holiday
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-[#8B5A3C] text-[#8B5A3C] hover:bg-[#8B5A3C] hover:text-white flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Bulk Upload
                    </Button>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline">
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                  <Input
                    placeholder="Search holidays..."
                    value={holidaySearchTerm}
                    onChange={(e) => setHolidaySearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
                  <div className="max-h-[600px] overflow-auto">
                    <EnhancedTable
                      data={holidays}
                      columns={holidayColumns}
                      renderCell={renderHolidayCell}
                      renderActions={renderHolidayActions}
                      searchTerm={holidaySearchTerm}
                      onSearchChange={setHolidaySearchTerm}
                      storageKey="holiday-calendar-table"
                      emptyMessage="No holidays found"
                      className="min-w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Empty as shown in image */}
            <div className="w-80 bg-gray-300 border-l border-gray-400">
              {/* Empty sidebar as shown in the reference image */}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AddCountryDialog 
        open={isAddCountryOpen}
        onOpenChange={setIsAddCountryOpen}
      />
      <AddRegionDialog 
        open={isAddRegionOpen}
        onOpenChange={setIsAddRegionOpen}
      />
      <AddZoneDialog 
        open={isAddZoneOpen}
        onOpenChange={setIsAddZoneOpen}
      />
      <EditZoneDialog 
        open={isEditZoneOpen}
        onOpenChange={setIsEditZoneOpen}
      />
      <AddEntityDialog 
        open={isAddEntityOpen}
        onOpenChange={setIsAddEntityOpen}
      />
    </div>
  );
};
