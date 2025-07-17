import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WingData {
  site: string;
  building: string;
  wing: string;
  status: boolean;
}

const sampleWings: WingData[] = [
  { site: 'Lockated', building: 'kite', wing: 'Wing 1', status: true },
  { site: 'Lockated', building: 'sebc', wing: 'TA Wing 2', status: true },
  { site: 'Lockated', building: 'Hay', wing: 'TA Wing 1', status: false },
  { site: 'Lockated', building: 'star', wing: 'East & West', status: true },
  { site: 'Lockated', building: 'business bay', wing: 'Wing2', status: true },
  { site: 'Lockated', building: 'RVG_New', wing: 'Wing1', status: false },
  { site: 'Lockated', building: 'RVG_Old', wing: 'B', status: true },
  { site: 'Lockated', building: 'Aurum Grande', wing: 'A', status: true },
  { site: 'Lockated', building: 'jyoti tower', wing: 'A12', status: false },
];

const buildings = ['kite', 'sebc', 'Hay', 'star', 'business bay', 'RVG_New', 'RVG_Old', 'Aurum Grande', 'jyoti tower'];

export function WingPage() {
  const [wings, setWings] = useState<WingData[]>(sampleWings);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [newWingName, setNewWingName] = useState('');

  const filteredWings = wings.filter(wing =>
    wing.wing.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wing.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wing.site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddWing = () => {
    if (selectedBuilding && newWingName.trim()) {
      const newWing: WingData = {
        site: 'Lockated',
        building: selectedBuilding,
        wing: newWingName,
        status: true
      };
      setWings([...wings, newWing]);
      setSelectedBuilding('');
      setNewWingName('');
      setShowAddDialog(false);
    }
  };

  const toggleStatus = (index: number) => {
    const updatedWings = [...wings];
    updatedWings[index].status = !updatedWings[index].status;
    setWings(updatedWings);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Account &gt; Wing</div>
        <h1 className="text-2xl font-bold">WING</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Wing
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWings.map((wing, index) => (
              <TableRow key={index}>
                <TableCell>{wing.site}</TableCell>
                <TableCell>{wing.building}</TableCell>
                <TableCell>{wing.wing}</TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleStatus(index)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      wing.status ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                        wing.status ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Wing Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ADD WING</DialogTitle>
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
              <label className="text-sm font-medium">Wing Name</label>
              <Input
                value={newWingName}
                onChange={(e) => setNewWingName(e.target.value)}
                placeholder="Enter wing name"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddWing}>Submit</Button>
              <Button variant="outline">Sample Format</Button>
              <Button variant="outline">Import</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}