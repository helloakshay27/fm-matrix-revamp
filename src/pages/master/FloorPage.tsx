import React, { useState } from 'react';
import { Search, Plus, Edit, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FloorData {
  site: string;
  building: string;
  wing: string;
  area: string;
  floor: string;
  status: boolean;
}

const sampleFloors: FloorData[] = [
  { site: 'Lockated', building: 'kite', wing: 'Wing 1', area: 'tested', floor: 'Basement', status: true },
  { site: 'Lockated', building: 'sebc', wing: 'TA Wing 2', area: 'Common Area Edited', floor: '12', status: true },
  { site: 'Lockated', building: 'Hay', wing: 'TA Wing 1', area: 'Reading Zone', floor: '6', status: false },
  { site: 'Lockated', building: 'star', wing: 'East & West', area: 'Audio Zone', floor: '7', status: true },
  { site: 'Lockated', building: 'business bay', wing: 'Wing2', area: 'Multi purpose Hall', floor: '10', status: true },
  { site: 'Lockated', building: 'RVG_New', wing: 'Wing1', area: 'Library', floor: 'Basement', status: false },
  { site: 'Lockated', building: 'RVG_Old', wing: 'B', area: 'Banquet hall', floor: '12', status: true },
  { site: 'Lockated', building: 'Aurum Grande', wing: 'A', area: 'Fitnesh Zone', floor: '6', status: true },
  { site: 'Lockated', building: 'jyoti tower', wing: 'A12', area: 'GR Floor', floor: '7', status: false },
];

const buildings = ['kite', 'sebc', 'Hay', 'star', 'business bay', 'RVG_New', 'RVG_Old', 'Aurum Grande', 'jyoti tower'];
const wings = ['Wing 1', 'TA Wing 2', 'TA Wing 1', 'East & West', 'Wing2', 'Wing1', 'B', 'A', 'A12'];
const areas = ['tested', 'Common Area Edited', 'Reading Zone', 'Audio Zone', 'Multi purpose Hall', 'Library', 'Banquet hall', 'Fitnesh Zone', 'GR Floor'];

export function FloorPage() {
  const [floors, setFloors] = useState<FloorData[]>(sampleFloors);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedWing, setSelectedWing] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [newFloorName, setNewFloorName] = useState('');

  const filteredFloors = floors.filter(floor =>
    floor.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    floor.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    floor.wing.toLowerCase().includes(searchTerm.toLowerCase()) ||
    floor.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    floor.site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFloor = () => {
    if (selectedBuilding && selectedWing && selectedArea && newFloorName.trim()) {
      const newFloor: FloorData = {
        site: 'Lockated',
        building: selectedBuilding,
        wing: selectedWing,
        area: selectedArea,
        floor: newFloorName,
        status: true
      };
      setFloors([...floors, newFloor]);
      setSelectedBuilding('');
      setSelectedWing('');
      setSelectedArea('');
      setNewFloorName('');
      setShowAddDialog(false);
    }
  };

  const toggleStatus = (index: number) => {
    const updatedFloors = [...floors];
    updatedFloors[index].status = !updatedFloors[index].status;
    setFloors(updatedFloors);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Account &gt; Floor</div>
        <h1 className="text-2xl font-bold">FLOOR</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Building className="h-4 w-4" />
            Add Floor
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
              <TableHead>Building</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFloors.map((floor, index) => (
              <TableRow key={index}>
                <TableCell>{floor.site}</TableCell>
                <TableCell>{floor.building}</TableCell>
                <TableCell>{floor.wing}</TableCell>
                <TableCell>{floor.area}</TableCell>
                <TableCell>{floor.floor}</TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleStatus(index)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      floor.status ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                        floor.status ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Floor Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ADD FLOOR</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Building</label>
              <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                <SelectTrigger>
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building} value={building}>
                      {building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Select Wing</label>
              <Select value={selectedWing} onValueChange={setSelectedWing}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wing" />
                </SelectTrigger>
                <SelectContent>
                  {wings.map((wing) => (
                    <SelectItem key={wing} value={wing}>
                      {wing}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Select Area</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Enter Floor Name</label>
              <Input
                value={newFloorName}
                onChange={(e) => setNewFloorName(e.target.value)}
                placeholder="Enter floor name"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddFloor}>Submit</Button>
              <Button variant="outline">Sample Format</Button>
              <Button variant="outline">Import</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}