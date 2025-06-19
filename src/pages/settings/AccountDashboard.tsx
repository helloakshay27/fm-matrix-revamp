
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Upload, X } from 'lucide-react';
import { AddCountryDialog } from '@/components/AddCountryDialog';
import { AddRegionDialog } from '@/components/AddRegionDialog';
import { AddZoneDialog } from '@/components/AddZoneDialog';
import { EditZoneDialog } from '@/components/EditZoneDialog';
import { toast } from 'sonner';

export const AccountDashboard = () => {
  const [activeTab, setActiveTab] = useState('organization');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [isAddRegionOpen, setIsAddRegionOpen] = useState(false);
  const [isAddZoneOpen, setIsAddZoneOpen] = useState(false);
  const [isEditZoneOpen, setIsEditZoneOpen] = useState(false);
  const [companyName, setCompanyName] = useState('Sanket Enterprise');
  const [removeLogo, setRemoveLogo] = useState(false);
  const [dailyReport, setDailyReport] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState('25');

  // Sample data
  const countries = [
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
  ];

  const regions = [
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
  ];

  const zones = [
    { country: 'India', region: 'West', zone: 'Maharashtra', status: true, icon: '/lovable-uploads/placeholder.svg' },
    { country: 'India', region: 'Chennai', zone: 'South Zone', status: true, icon: null },
    { country: 'India', region: 'Kolkata', zone: 'East Zone', status: true, icon: null },
    { country: 'India', region: 'Mumbai', zone: 'West Zone', status: true, icon: null },
  ];

  const sites = [
    { country: 'India', region: 'Mumbai', zone: 'West Zone', site: 'Lockated Site 2', latitude: '19.1249466', longitude: '72.8302155', status: false, qrCode: '/lovable-uploads/placeholder.svg' },
    { country: 'India', region: 'Mumbai', zone: 'West Zone', site: 'Lockated Site 1', latitude: '18.5509109', longitude: '73.8910294', status: false, qrCode: '/lovable-uploads/placeholder.svg' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success('File uploaded successfully');
    }
  };

  const handleSubmitCompany = () => {
    toast.success('Company details updated successfully');
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ACCOUNT</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="country">Country</TabsTrigger>
          <TabsTrigger value="region">Region</TabsTrigger>
          <TabsTrigger value="zone">Zone</TabsTrigger>
          <TabsTrigger value="site">Site</TabsTrigger>
          <TabsTrigger value="entity">Entity</TabsTrigger>
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
                  className="bg-purple-700 hover:bg-purple-800 text-white px-8"
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
              className="bg-purple-700 hover:bg-purple-800 text-white"
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
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-40"
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
                        <Switch checked={country.status} />
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
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-40"
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
                        <Switch checked={region.status} />
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
                className="bg-purple-700 hover:bg-purple-800 text-white"
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
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-40"
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
                        <Switch checked={zone.status} />
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
                        <Switch checked={site.status} />
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
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600 text-center">Entity management content will be displayed here.</p>
            </CardContent>
          </Card>
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
    </div>
  );
};
