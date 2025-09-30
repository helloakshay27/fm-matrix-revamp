import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ZoneTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  entriesPerPage: string;
  setEntriesPerPage: (entries: string) => void;
}

export const ZoneTab: React.FC<ZoneTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage
}) => {
  // Zone state
  const [zones, setZones] = useState([
    { country: 'India', region: 'West', zone: 'Bali', status: true, icon: '/placeholder.svg' },
    { country: 'India', region: 'North', zone: 'Delhi', status: true, icon: '/placeholder.svg' },
    { country: 'India', region: 'West', zone: 'Mumbai', status: true, icon: '/placeholder.svg' },
  ]);
  
  const [isAddZoneOpen, setIsAddZoneOpen] = useState(false);
  const [isEditZoneOpen, setIsEditZoneOpen] = useState(false);
  const [selectedZonesForEdit, setSelectedZonesForEdit] = useState<string[]>([]);
  const [isEditZoneFormOpen, setIsEditZoneFormOpen] = useState(false);
  const [editZoneData, setEditZoneData] = useState({
    zoneName: '',
    headquarter: '',
    region: ''
  });
  const [newZoneData, setNewZoneData] = useState({
    country: '',
    region: '',
    zoneName: ''
  });

  const handleZoneStatusChange = (index: number, checked: boolean) => {
    const updatedZones = [...zones];
    updatedZones[index].status = checked;
    setZones(updatedZones);
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

  const filteredZones = zones.filter(zone =>
    zone.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    zone.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    zone.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
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
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search zones..."
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
              {filteredZones.map((zone, index) => (
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

      {/* Edit Zone Form Dialog */}
      <Dialog open={isEditZoneFormOpen} onOpenChange={setIsEditZoneFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Zone Details</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsEditZoneFormOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone Name
              </label>
              <input
                type="text"
                value={editZoneData.zoneName}
                onChange={(e) => setEditZoneData({ ...editZoneData, zoneName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                placeholder="Enter zone name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headquarter
              </label>
              <select
                value={editZoneData.headquarter}
                onChange={(e) => setEditZoneData({ ...editZoneData, headquarter: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
              >
                <option value="">Select Headquarter</option>
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
                value={editZoneData.region}
                onChange={(e) => setEditZoneData({ ...editZoneData, region: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
              >
                <option value="">Select Region</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                onChange={handleZoneFileUpload}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                accept="image/*"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditZoneFormOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
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
