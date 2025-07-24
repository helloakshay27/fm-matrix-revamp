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
import { useAppDispatch } from '@/store/hooks';
import { createMasterUnit, fetchMasterUnits } from '@/store/slices/unitMaster';
import { toast } from 'sonner';

interface AddMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMeterModal = ({ isOpen, onClose }: AddMeterModalProps) => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    meterType: '',
    meterCategory: '',
    unitName: ''
  });

  const handleSubmit = async () => {
    const payload = {
      pms_meter_type: {
        name: formData.meterCategory,
        meter_type: formData.meterType,
      },
      meter_type_tags: formData.unitName.split(',')
    }
    try {
      await dispatch(createMasterUnit({ baseUrl, token, data: payload })).unwrap();
      setFormData({ meterType: '', meterCategory: '', unitName: '' });
      toast.success('Meter added successfully');
    } catch (error) {
      console.log(error)
      toast.error('Failed to add meter');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">New Meter Type</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm">Meter Type</Label>
            <Select value={formData.meterType} onValueChange={(value) => setFormData({ ...formData, meterType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Energy">Energy</SelectItem>
                <SelectItem value="Water">Water</SelectItem>
                <SelectItem value="STP">STP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">
              Meter Category <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.meterCategory}
              onChange={(e) => setFormData({ ...formData, meterCategory: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">
              Unit Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.unitName}
              onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
              placeholder="Enter Unit Name"
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button
              className="bg-[#8B5A99] hover:bg-[#8B5A99]/90 text-white px-8"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  meterData?: any;
}

const EditMeterModal = ({ isOpen, onClose, meterData }: EditModalProps) => {
  const [formData, setFormData] = useState({
    meterType: "",
    meterCategory: "",
    unitType: [],
  });

  useEffect(() => {
    if (!meterData) return
    setFormData({
      meterType: meterData?.meter_type,
      meterCategory: meterData?.name,
      unitType: meterData.meter_unit_types.map((unitType: any) => unitType),
    })
  }, [meterData])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Meter Type</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Meter Type*</Label>
            <Select value={formData.meterType} onValueChange={(value) => setFormData({ ...formData, meterType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select meter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Energy">Energy</SelectItem>
                <SelectItem value="Water">Water</SelectItem>
                <SelectItem value="STP">STP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Meter Category</Label>
            <Input
              value={formData.meterCategory}
              onChange={(e) => setFormData({ ...formData, meterCategory: e.target.value })}
              className="bg-gray-50"
              readOnly
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Meter Unit</Label>

            {
              formData.unitType.map((unitType: any) => (
                <div key={unitType.id} className="flex items-center justify-between">
                  <Label>{unitType.unit_name}</Label>
                  <Switch
                    checked={unitType.active}
                  // onCheckedChange={(checked) => setFormData({ ...formData, kwEnabled: checked })}
                  />
                </div>
              ))
            }
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
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const { setCurrentSection } = useLayout();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [meters, setMeters] = useState([]);

  useEffect(() => {
    const fetchMeters = async () => {
      try {
        const response = await dispatch(fetchMasterUnits({ baseUrl, token })).unwrap();
        setMeters(response);
      } catch (error) {
        console.log(error)
      }
    }

    fetchMeters();
  }, [])

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
          <Button
            className="bg-[#C72030] hover:bg-[#C72030]/90"
            onClick={() => setAddModalOpen(true)}
          >
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
                       className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
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

        <AddMeterModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
        />

        <EditMeterModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          meterData={selectedMeter}
        />
      </div>
    </div>
  );
};