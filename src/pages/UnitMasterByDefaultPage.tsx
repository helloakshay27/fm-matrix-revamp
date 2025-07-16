import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Edit, Plus } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';

// Mock data for meter types
const meterData = [
  {
    id: 1,
    meterCategory: 'Electric Meter',
    unitName: 'Electricity',
    meterType: 'Digital',
    status: true
  },
  {
    id: 2,
    meterCategory: 'Water Meter',
    unitName: 'Water',
    meterType: 'Analog',
    status: true
  },
  {
    id: 3,
    meterCategory: 'Gas Meter',
    unitName: 'Gas',
    meterType: 'Smart',
    status: false
  }
];

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  meterData?: any;
}

const EditMeterModal = ({ isOpen, onClose, meterData }: EditModalProps) => {
  const [formData, setFormData] = useState({
    meterType: meterData?.meterType || '',
    meterCategory: meterData?.meterCategory || 'Electric Meter',
    kwEnabled: true,
    kwhEnabled: false,
    unitType: ''
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Meter Type</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Meter Type*</Label>
            <Select value={formData.meterType} onValueChange={(value) => setFormData({...formData, meterType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select meter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Digital">Digital</SelectItem>
                <SelectItem value="Analog">Analog</SelectItem>
                <SelectItem value="Smart">Smart</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Meter Category</Label>
            <Input
              value={formData.meterCategory}
              onChange={(e) => setFormData({...formData, meterCategory: e.target.value})}
              className="bg-gray-50"
              readOnly
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Meter Unit</Label>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="kw">KW</Label>
              <Switch
                id="kw"
                checked={formData.kwEnabled}
                onCheckedChange={(checked) => setFormData({...formData, kwEnabled: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="kwh">Kwh</Label>
              <Switch
                id="kwh"
                checked={formData.kwhEnabled}
                onCheckedChange={(checked) => setFormData({...formData, kwhEnabled: checked})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Button className="w-full bg-transparent text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Unit Type
            </Button>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              className="bg-[#C72030] hover:bg-[#C72030]/90"
              onClick={onClose}
            >
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const UnitMasterByDefaultPage = () => {
  const { setCurrentSection } = useLayout();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [meters, setMeters] = useState(meterData);

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);

  const handleEditClick = (meter: any) => {
    setSelectedMeter(meter);
    setEditModalOpen(true);
  };

  const handleStatusToggle = (id: number) => {
    setMeters(meters.map(meter => 
      meter.id === id ? { ...meter, status: !meter.status } : meter
    ));
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] p-6">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">UNIT MASTER (BY DEFAULT)</h1>
          <Button className="bg-[#C72030] hover:bg-[#C72030]/90">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f6f4ee]">
                <TableHead className="font-medium">Meter Category</TableHead>
                <TableHead className="font-medium">Unit name</TableHead>
                <TableHead className="font-medium">Meter Type</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meters.map((meter) => (
                <TableRow key={meter.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{meter.meterCategory}</TableCell>
                  <TableCell>{meter.unitName}</TableCell>
                  <TableCell>{meter.meterType}</TableCell>
                  <TableCell>
                    <Switch
                      checked={meter.status}
                      onCheckedChange={() => handleStatusToggle(meter.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditClick(meter)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <EditMeterModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          meterData={selectedMeter}
        />
      </div>
    </div>
  );
};