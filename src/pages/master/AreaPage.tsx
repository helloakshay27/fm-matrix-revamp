import React, { useState } from 'react';
import { Search, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AreaData {
  site: string;
  building: string;
  wing: string;
  area: string;
  status: boolean;
}

const sampleAreas: AreaData[] = [
  { site: 'Lockated', building: 'kite', wing: 'Wing 1', area: 'tested', status: true },
  { site: 'Lockated', building: 'sebc', wing: 'TA Wing 2', area: 'Common Area Edited', status: true },
  { site: 'Lockated', building: 'Hay', wing: 'TA Wing 1', area: 'Reading Zone', status: false },
  { site: 'Lockated', building: 'star', wing: 'East & West', area: 'Audio Zone', status: true },
  { site: 'Lockated', building: 'business bay', wing: 'Wing2', area: 'Multi purpose Hall', status: true },
  { site: 'Lockated', building: 'RVG_New', wing: 'Wing1', area: 'Library', status: false },
  { site: 'Lockated', building: 'RVG_Old', wing: 'B', area: 'Banquet hall', status: true },
  { site: 'Lockated', building: 'Aurum Grande', wing: 'A', area: 'Fitnesh Zone', status: true },
  { site: 'Lockated', building: 'jyoti tower', wing: 'A12', area: 'GR Floor', status: false },
];

const buildings = ['kite', 'sebc', 'Hay', 'star', 'business bay', 'RVG_New', 'RVG_Old', 'Aurum Grande', 'jyoti tower'];
const wings = ['Wing 1', 'TA Wing 2', 'TA Wing 1', 'East & West', 'Wing2', 'Wing1', 'B', 'A', 'A12'];

export function AreaPage() {
  const [areas, setAreas] = useState<AreaData[]>(sampleAreas);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedWing, setSelectedWing] = useState('');
  const [newAreaName, setNewAreaName] = useState('');

  const filteredAreas = areas.filter(area =>
    area.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.wing.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddArea = () => {
    if (selectedBuilding && selectedWing && newAreaName.trim()) {
      const newArea: AreaData = {
        site: 'Lockated',
        building: selectedBuilding,
        wing: selectedWing,
        area: newAreaName,
        status: true
      };
      setAreas([...areas, newArea]);
      setSelectedBuilding('');
      setSelectedWing('');
      setNewAreaName('');
      setShowAddDialog(false);
    }
  };

  const toggleStatus = (index: number) => {
    const updatedAreas = [...areas];
    updatedAreas[index].status = !updatedAreas[index].status;
    setAreas(updatedAreas);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Account &gt; Area</div>
        <h1 className="text-2xl font-bold">AREA</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Area
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
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAreas.map((area, index) => (
              <TableRow key={index}>
                <TableCell>{area.site}</TableCell>
                <TableCell>{area.building}</TableCell>
                <TableCell>{area.wing}</TableCell>
                <TableCell>{area.area}</TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleStatus(index)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      area.status ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                        area.status ? 'translate-x-7' : 'translate-x-1'
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

      {/* Add Area Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ADD AREA</DialogTitle>
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
              <label className="text-sm font-medium">Area Name</label>
              <Input
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                placeholder="Enter area name"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddArea}>Submit</Button>
              <Button variant="outline">Sample Format</Button>
              <Button variant="outline">Import</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}