import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Square, Plus, FileDown } from 'lucide-react';

interface UnitData {
  id: number;
  active: boolean;
  site: string;
  building: string;
  wing: string;
  area: string;
  floor: string;
  unit: string;
  entity: string;
}

const initialUnits: UnitData[] = [
  { id: 1, active: true, site: 'Lockated', building: 'kite', wing: 'Wing 1', area: 'Common Area', floor: 'Basement', unit: '111', entity: '278' },
  { id: 2, active: true, site: 'Lockated', building: 'sebc', wing: 'TA Wing 2', area: 'Reading Zone', floor: '12', unit: '278', entity: '278' },
  { id: 3, active: false, site: 'Lockated', building: 'Hay', wing: 'TA Wing 1', area: 'Audio Zone', floor: '6', unit: '278', entity: 'Noid 62' },
  { id: 4, active: true, site: 'Lockated', building: 'star', wing: 'East & West', area: 'Multi purpose Hall', floor: '7', unit: 'HELP DESK', entity: 'TCS' },
  { id: 5, active: true, site: 'Lockated', building: 'business bay', wing: 'Wing2', area: 'Library', floor: '10', unit: 'Reception', entity: 'GoPhygital' },
  { id: 6, active: false, site: 'Lockated', building: 'RVG_New', wing: 'Wing1', area: 'Banquet hall', floor: 'Basement', unit: '101 TCS', entity: 'TCS' },
  { id: 7, active: true, site: 'Lockated', building: 'RVG_Old', wing: 'B', area: 'Fitnesh Zone', floor: '12', unit: '512', entity: '278' },
  { id: 8, active: true, site: 'Lockated', building: 'Aurum Grande', wing: 'A', area: 'GR Floor', floor: '6', unit: '1110', entity: 'GoPhygital' },
];

export const UnitPage = () => {
  const [units, setUnits] = useState<UnitData[]>(initialUnits);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({
    building: '',
    wing: '',
    area: '',
    floor: '',
    entity: '',
    unitName: '',
    areaSize: ''
  });

  const filteredUnits = units.filter(unit =>
    Object.values(unit).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleActiveStatus = (id: number) => {
    setUnits(prev => prev.map(unit =>
      unit.id === id ? { ...unit, active: !unit.active } : unit
    ));
  };

  const handleAddUnit = () => {
    const newUnitData: UnitData = {
      id: units.length + 1,
      active: true,
      site: 'Lockated',
      building: newUnit.building,
      wing: newUnit.wing,
      area: newUnit.area,
      floor: newUnit.floor,
      unit: newUnit.unitName,
      entity: newUnit.entity
    };
    
    setUnits(prev => [...prev, newUnitData]);
    setNewUnit({
      building: '',
      wing: '',
      area: '',
      floor: '',
      entity: '',
      unitName: '',
      areaSize: ''
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 ml-64">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">Account &gt; Unit</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">UNIT</h1>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#C72030] hover:bg-[#B01E2E] text-white flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  Add Unit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Square className="w-5 h-5" />
                    Add Unit
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="building">Select Building</Label>
                    <Select value={newUnit.building} onValueChange={(value) => setNewUnit(prev => ({ ...prev, building: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Building" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kite">Kite</SelectItem>
                        <SelectItem value="sebc">SEBC</SelectItem>
                        <SelectItem value="hay">Hay</SelectItem>
                        <SelectItem value="star">Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wing">Select Wing</Label>
                    <Select value={newUnit.wing} onValueChange={(value) => setNewUnit(prev => ({ ...prev, wing: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Wing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wing1">Wing 1</SelectItem>
                        <SelectItem value="wing2">Wing 2</SelectItem>
                        <SelectItem value="east-west">East & West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Select Area</Label>
                    <Select value={newUnit.area} onValueChange={(value) => setNewUnit(prev => ({ ...prev, area: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common">Common Area</SelectItem>
                        <SelectItem value="reading">Reading Zone</SelectItem>
                        <SelectItem value="audio">Audio Zone</SelectItem>
                        <SelectItem value="library">Library</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="floor">Select Floor</Label>
                    <Select value={newUnit.floor} onValueChange={(value) => setNewUnit(prev => ({ ...prev, floor: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Floor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basement">Basement</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="entity">Select Entity</Label>
                    <Select value={newUnit.entity} onValueChange={(value) => setNewUnit(prev => ({ ...prev, entity: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Entity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="278">278</SelectItem>
                        <SelectItem value="tcs">TCS</SelectItem>
                        <SelectItem value="gophygital">GoPhygital</SelectItem>
                        <SelectItem value="noid62">Noid 62</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unitName">Unit Name</Label>
                    <Input
                      id="unitName"
                      value={newUnit.unitName}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, unitName: e.target.value }))}
                      placeholder="Enter Unit Name"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="areaSize">Area</Label>
                    <Input
                      id="areaSize"
                      value={newUnit.areaSize}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, areaSize: e.target.value }))}
                      placeholder="Enter Area (Sq.Mtr)"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddUnit} className="bg-[#C72030] hover:bg-[#B01E2E] text-white">
                    Submit
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    Sample Format
                  </Button>
                  <Button variant="outline" className="border-gray-300 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Import
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
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
                <span className="text-sm text-gray-600">entries</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Search:</span>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
                placeholder="Search units..."
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actions</TableHead>
                  <TableHead>Active/Inactive</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Wing</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Entity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4 text-[#C72030]" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={unit.active}
                        onCheckedChange={() => toggleActiveStatus(unit.id)}
                      />
                    </TableCell>
                    <TableCell>{unit.site}</TableCell>
                    <TableCell>{unit.building}</TableCell>
                    <TableCell>{unit.wing}</TableCell>
                    <TableCell>{unit.area}</TableCell>
                    <TableCell>{unit.floor}</TableCell>
                    <TableCell>{unit.unit}</TableCell>
                    <TableCell>{unit.entity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination info */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600">
              Showing 1 to {Math.min(parseInt(entriesPerPage), filteredUnits.length)} of {filteredUnits.length} entries
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};