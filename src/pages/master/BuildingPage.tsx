import React, { useState } from 'react';
import { Search, Plus, Copy, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BuildingData {
  site: string;
  region: string;
  country: string;
  building: string;
  wing: boolean;
  floor: boolean;
  area: boolean;
  room: boolean;
  status: boolean;
}

const sampleBuildings: BuildingData[] = [
  { site: 'Lockated', region: 'Region 1', country: 'UAE', building: 'kite', wing: true, floor: true, area: true, room: false, status: true },
  { site: 'Lockated', region: 'Region 1', country: 'UAE', building: 'sebc', wing: true, floor: true, area: true, room: true, status: true },
  { site: 'Lockated', region: 'Region 1', country: 'UAE', building: 'Hay', wing: false, floor: true, area: true, room: false, status: false },
  { site: 'Lockated', region: 'Region 1', country: 'UAE', building: 'star', wing: true, floor: false, area: true, room: true, status: true },
  { site: 'Lockated', region: 'Region 1', country: 'UAE', building: 'business bay', wing: true, floor: true, area: false, room: false, status: true },
  { site: 'Lockated', region: 'Region 1', country: 'UAE', building: 'RVG_New', wing: false, floor: true, area: true, room: true, status: false },
  { site: 'Lockated', region: 'Region 1', country: 'UAE', building: 'RVG_Old', wing: true, floor: false, area: false, room: true, status: true },
  { site: 'Lockated', region: 'Region 1', country: 'UAE', building: 'Aurum Grande', wing: true, floor: true, area: true, room: false, status: true },
  { site: 'Lockated', region: 'Region 1', country: 'UAE', building: 'jyoti tower', wing: false, floor: true, area: false, room: true, status: false },
];

export function BuildingPage() {
  const [buildings, setBuildings] = useState<BuildingData[]>(sampleBuildings);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [newBuilding, setNewBuilding] = useState('');
  const [cloneFrom, setCloneFrom] = useState({ site: '', building: '' });
  const [cloneTo, setCloneTo] = useState('');

  const filteredBuildings = buildings.filter(building =>
    building.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBuilding = () => {
    if (newBuilding.trim()) {
      const building: BuildingData = {
        site: 'Lockated',
        region: 'Region 1',
        country: 'UAE',
        building: newBuilding,
        wing: false,
        floor: false,
        area: false,
        room: false,
        status: true
      };
      setBuildings([...buildings, building]);
      setNewBuilding('');
      setShowAddDialog(false);
    }
  };

  const handleCloneBuilding = () => {
    if (cloneFrom.site && cloneFrom.building && cloneTo.trim()) {
      const sourceBuilding = buildings.find(b => 
        b.site === cloneFrom.site && b.building === cloneFrom.building
      );
      if (sourceBuilding) {
        const clonedBuilding: BuildingData = {
          ...sourceBuilding,
          site: cloneTo
        };
        setBuildings([...buildings, clonedBuilding]);
        setCloneFrom({ site: '', building: '' });
        setCloneTo('');
        setShowCloneDialog(false);
      }
    }
  };

  const toggleStatus = (index: number, field: keyof BuildingData) => {
    const updatedBuildings = [...buildings];
    if (typeof updatedBuildings[index][field] === 'boolean') {
      (updatedBuildings[index] as any)[field] = !updatedBuildings[index][field];
      setBuildings(updatedBuildings);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Account &gt; Building</div>
        <h1 className="text-2xl font-bold">BUILDING</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Building
          </Button>
          <Button variant="outline" onClick={() => setShowCloneDialog(true)} className="gap-2">
            <Copy className="h-4 w-4" />
            Clone
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Show</span>
            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm">entries</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBuildings.map((building, index) => (
              <TableRow key={index}>
                <TableCell>{building.site}</TableCell>
                <TableCell>{building.region}</TableCell>
                <TableCell>{building.country}</TableCell>
                <TableCell>{building.building}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {building.wing ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-red-600">✗</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {building.floor ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-red-600">✗</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {building.area ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-red-600">✗</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {building.room ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-red-600">✗</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleStatus(index, 'status')}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      building.status ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                        building.status ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Building Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ADD BUILDING</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Building Name</label>
              <Input
                value={newBuilding}
                onChange={(e) => setNewBuilding(e.target.value)}
                placeholder="Enter building name"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddBuilding}>Submit</Button>
              <Button variant="outline">Sample Format</Button>
              <Button variant="outline">Import</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clone Dialog */}
      <Dialog open={showCloneDialog} onOpenChange={setShowCloneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Clone From Site</label>
              <Select value={cloneFrom.site} onValueChange={(value) => setCloneFrom({...cloneFrom, site: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lockated">Lockated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Clone From Building</label>
              <Select value={cloneFrom.building} onValueChange={(value) => setCloneFrom({...cloneFrom, building: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building, index) => (
                    <SelectItem key={index} value={building.building}>
                      {building.building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Clone To Site</label>
              <Input
                value={cloneTo}
                onChange={(e) => setCloneTo(e.target.value)}
                placeholder="Enter destination site"
              />
            </div>
            <Button onClick={handleCloneBuilding}>Clone</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}