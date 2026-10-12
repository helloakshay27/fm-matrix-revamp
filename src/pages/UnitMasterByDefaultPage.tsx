import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Switch } from '@/components/ui/switch';
import { FormControl as MuiFormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';
import { Edit, Plus } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useAppDispatch } from '@/store/hooks';
import { createMasterUnit, fetchMasterUnits, fetchMeterType, updateMeterUnitType, updateMeterType } from '@/store/slices/unitMaster';
import { toast } from 'sonner';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const unitMasterColumns: ColumnConfig[] = [
  { key: 'name', label: 'Meter Category', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'unit_name', label: 'Unit name', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'meter_type', label: 'Meter Type', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'active', label: 'Status', sortable: true, hideable: true, defaultVisible: true, draggable: true },
];

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
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="max-w-md bg-white overflow-visible"
        onPointerDownOutside={(e) => {
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">New Meter Type</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <MuiFormControl fullWidth variant="outlined">
              <InputLabel id="add-meter-type-label">Meter Type</InputLabel>
              <MuiSelect
                labelId="add-meter-type-label"
                label="Meter Type"
                value={formData.meterType}
                onChange={(e) => setFormData({ ...formData, meterType: e.target.value })}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value=""><em>Select Type</em></MenuItem>
                <MenuItem value="Energy">Energy</MenuItem>
                <MenuItem value="Water">Water</MenuItem>
                <MenuItem value="STP">STP</MenuItem>
              </MuiSelect>
            </MuiFormControl>
          </div>

          <div>
            <MuiFormControl fullWidth variant="outlined" required>
              <TextField
                label="Meter Category"
                variant="outlined"
                fullWidth
                value={formData.meterCategory}
                onChange={(e) => setFormData({ ...formData, meterCategory: e.target.value })}
                sx={fieldStyles}
              />
            </MuiFormControl>
          </div>

          <div>
            <MuiFormControl fullWidth variant="outlined" required>
              <TextField
                label="Unit Name"
                variant="outlined"
                fullWidth
                value={formData.unitName}
                onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                placeholder="Enter Unit Name"
                sx={fieldStyles}
              />
            </MuiFormControl>
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
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="max-w-md bg-white overflow-visible"
        onPointerDownOutside={(e) => {
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Meter Type</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <MuiFormControl fullWidth variant="outlined">
              <InputLabel id="edit-meter-type-label">Meter Type</InputLabel>
              <MuiSelect
                labelId="edit-meter-type-label"
                label="Meter Type"
                value={formData.meterType}
                onChange={(e) => setFormData({ ...formData, meterType: e.target.value })}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value=""><em>Select meter type</em></MenuItem>
                <MenuItem value="Energy">Energy</MenuItem>
                <MenuItem value="Water">Water</MenuItem>
                <MenuItem value="STP">STP</MenuItem>
              </MuiSelect>
            </MuiFormControl>
          </div>

          <div>
            <TextField
              label="Meter Category"
              variant="outlined"
              fullWidth
              value={formData.meterCategory}
              onChange={(e) => setFormData({ ...formData, meterCategory: e.target.value })}
              sx={fieldStyles}
              InputProps={{ readOnly: true }}
            />
          </div>

          <div className="space-y-4">
            <span className="text-base font-medium">Meter Unit</span>

            {
              formData.unitType.map((unitType: any) => (
                <div key={unitType.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{unitType.unit_name}</span>
                  <Switch
                    checked={unitType.active}
                    onCheckedChange={(checked) => handleToggleUnit(unitType.id, checked)}
                  />
                </div>
              ))
            }

            {isAddingUnit && (
              <div className="pt-2">
                <TextField
                  label="New Unit Name"
                  variant="outlined"
                  fullWidth
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  placeholder="Enter unit name"
                  autoFocus
                  sx={fieldStyles}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              className="w-full bg-transparent text-[#C72030] border border-[#C72030]"
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
  const { shouldShow } = useDynamicPermissions();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const { setCurrentSection } = useLayout();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMeters = async () => {
    setLoading(true);
    try {
      const response = await dispatch(fetchMasterUnits({ baseUrl, token })).unwrap();
      setMeters(response);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
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

  const getUnitNames = (meter: any) =>
    Array.isArray(meter.unit_name) ? meter.unit_name.join(', ') : meter.unit_name;

  // unit_name array ho sakta hai — isliye EnhancedTable ka client search band karke
  // category / unit name / meter type pe khud filter karte hain
  const query = searchTerm.trim().toLowerCase();
  const filteredMeters = query
    ? meters.filter((meter: any) =>
        [meter.name, getUnitNames(meter), meter.meter_type]
          .some((value) => String(value ?? '').toLowerCase().includes(query))
      )
    : meters;

  const renderCell = (meter: any, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return <span className="font-medium">{meter.name}</span>;
      case 'unit_name':
        return getUnitNames(meter);
      case 'meter_type':
        return meter.meter_type;
      case 'active':
        return (
          <Switch
            checked={meter.active}
            onCheckedChange={(checked) => handleStatusToggle(meter.id, checked)}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
        );
      default:
        return null;
    }
  };

  const renderActions = (meter: any) =>
    shouldShow("Unit Master (By Default)", "update") ? (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEditClick(meter)}
      >
        <Edit className="w-4 h-4" />
      </Button>
    ) : null;

  return (
    <div className="w-full min-h-screen bg-[#fafafa] p-6">
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">UNIT MASTER (BY DEFAULT)</h1>

        <EnhancedTable
          data={filteredMeters}
          columns={unitMasterColumns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(meter: any) => String(meter.id)}
          storageKey="unit-master-by-default-table"
          enableSearch={true}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          disableClientSearch={true}
          searchPlaceholder="Search by meter category, unit name or meter type..."
          emptyMessage="No units found"
          loading={loading}
          pagination={true}
          pageSize={10}
          leftActions={
            shouldShow("Unit Master (By Default)", "create") ? (
              <Button
                className="bg-brand hover:bg-brand-hover text-white"
                onClick={() => setAddModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            ) : null
          }
        />

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