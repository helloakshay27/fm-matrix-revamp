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
import { createMasterUnit, fetchMasterUnits, fetchMeterType, updateMeterUnitType, updateMeterType } from '@/store/slices/unitMaster';
import { toast } from 'sonner';

interface AddMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMeterModal = ({ isOpen, onClose, onSuccess }: AddMeterModalProps) => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    meterType: '',
    meterCategory: '',
    unitName: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.meterCategory || !formData.unitName) {
      toast.error('Please fill all required fields');
      return;
    }
    setIsLoading(true);
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
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error)
      toast.error('Failed to add meter');
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
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
  onSuccess: () => void;
  meterData?: any;
}

const EditMeterModal = ({ isOpen, onClose, onSuccess, meterData }: EditModalProps) => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    meterType: "",
    meterCategory: "",
    unitType: [] as any[],
  });
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMeterDetails = async () => {
    if (!meterData?.id) return;
    try {
      const response = await dispatch(fetchMeterType({ baseUrl, token, id: meterData.id })).unwrap();
      setFormData({
        meterType: response?.meter_type || "",
        meterCategory: response?.name || "",
        unitType: response?.meter_unit_types || [],
      });
    } catch (error) {
      toast.error('Failed to fetch meter details');
    }
  };

  useEffect(() => {
    if (isOpen && meterData) {
      fetchMeterDetails();
      setIsAddingUnit(false);
      setNewUnitName("");
    }
  }, [isOpen, meterData]);

  const handleToggleUnit = async (unitTypeId: number, isChecked: boolean) => {
    const type = isChecked ? 'activate' : 'delete';
    try {
      await dispatch(updateMeterUnitType({ baseUrl, token, unitTypeId, type })).unwrap();
      toast.success(`Unit type ${isChecked ? 'activated' : 'deactivated'}`);
      fetchMeterDetails(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update unit type');
    }
  };

  const handleUpdate = async () => {
    try {
      if (!meterData?.id) return;

      const payload: any = {
        pms_meter_type: {
          meter_type: formData.meterType,
          name: formData.meterCategory,
        }
      };

      if (newUnitName.trim()) {
        payload.pms_meter_type.meter_unit_types_attributes = {
          [Date.now().toString()]: {
            unit_name: newUnitName.trim()
          }
        };
      }

      await dispatch(updateMeterType({ baseUrl, token, id: meterData.id, data: payload })).unwrap();
      toast.success('Meter updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update meter');
    }
  };

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
                    onCheckedChange={(checked) => handleToggleUnit(unitType.id, checked)}
                  />
                </div>
              ))
            }

            {isAddingUnit && (
              <div className="space-y-2 pt-2">
                <Label>New Unit Name</Label>
                <Input
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  placeholder="Enter unit name"
                  autoFocus
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              className="w-full bg-transparent text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white"
              onClick={() => setIsAddingUnit(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Unit Type
            </Button>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              className="bg-[#C72030] hover:bg-[#C72030]/90"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update'}
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

  const fetchMeters = async () => {
    try {
      const response = await dispatch(fetchMasterUnits({ baseUrl, token })).unwrap();
      setMeters(response);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMeters();
  }, [])

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);

  const handleEditClick = (meter: any) => {
    setSelectedMeter(meter);
    setEditModalOpen(true);
  };

  const handleStatusToggle = async (id: number, checked: boolean) => {
    try {
      const payload = {
        pms_meter_type: {
          active: checked
        }
      };
      await dispatch(updateMeterType({ baseUrl, token, id, data: payload })).unwrap();
      toast.success('Status updated successfully');
      fetchMeters();
    } catch (error) {
      toast.error('Failed to update status');
    }
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
                  <TableCell className="font-medium">{meter.name}</TableCell>
                  <TableCell>
                    {Array.isArray(meter.unit_name) ? meter.unit_name.join(', ') : meter.unit_name}
                  </TableCell>
                  <TableCell>{meter.meter_type}</TableCell>
                  <TableCell>
                    <Switch
                      checked={meter.active}
                      onCheckedChange={(checked) => handleStatusToggle(meter.id, checked)}
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
          onSuccess={fetchMeters}
        />

        <EditMeterModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={fetchMeters}
          meterData={selectedMeter}
        />
      </div>
    </div>
  );
};