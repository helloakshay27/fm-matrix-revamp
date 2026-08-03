import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Trash2, RefreshCw, Droplet, Package, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { toast } from 'sonner';
import { SupplierSearchSelect } from '@/components/SupplierSearchSelect';
import { fetchBuildings, Building, WasteGeneration } from '@/services/wasteGenerationAPI';
import { useAppDispatch } from '@/store/hooks';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';

interface FMUser {
  id: number;
  full_name: string;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

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

const DESTINATION_TYPE_OPTIONS = [
  'Recycling Facility',
  'Landfill',
  'Treatment / Incineration Facility',
  'Authorized Vendor',
  'Scrap Buyer',
];

const DISPOSAL_METHOD_OPTIONS = ['Recycle', 'Incinerate', 'Landfill', 'Compost', 'Resell / Reuse'];

const DEPARTMENT_OPTIONS = [
  'Facilities Management',
  'EHS (Environment, Health & Safety)',
  'Operations',
];

// Table 1.3 "Dispatch Table" columns — a subset of the Waste Generation list
// page's columns (UtilityWasteGenerationDashboard.tsx), mapped the same way.
const DISPATCH_ITEM_COLUMNS = [
  { key: 'generation_id', label: 'Generation ID' },
  { key: 'date_time', label: 'Date & Time' },
  { key: 'building', label: 'Building' },
  { key: 'floor', label: 'Floor' },
  { key: 'user_type', label: 'User Type' },
  { key: 'client_name', label: 'Client Name' },
  { key: 'waste_category', label: 'Waste Category' },
  { key: 'total_bags', label: 'Total Bags' },
  { key: 'quantity_kg', label: 'Quantity (Kg)' },
  { key: 'quantity_ltr', label: 'Quantity (Ltr)' },
];

const renderWasteGenerationCell = (item: WasteGeneration, key: string) => {
  if (key === 'generation_id') return item.id ?? '-';
  if (key === 'date_time') {
    const datePart = item.wg_date ? item.wg_date.split('T')[0] : null;
    let timePart: string | null = null;
    if (item.created_at) {
      try { timePart = new Date(item.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
      catch { timePart = null; }
    }
    if (!datePart && !timePart) return '-';
    return [datePart, timePart].filter(Boolean).join(' ');
  }
  if (key === 'building') return item.building_name || '-';
  // No dedicated "floor" field on the waste generation record — Area is the
  // closest/most granular location field the API returns.
  if (key === 'floor') return item.area_name || item.wing_name || '-';
  if (key === 'user_type') return item.user_type || item.resource_type || '-';
  if (key === 'client_name') return item.client_name || item.vendor?.company_name || item.agency_name || '-';
  if (key === 'waste_category') return item.category?.category_name || '-';
  if (key === 'total_bags') return item.bag_counts != null ? item.bag_counts.toString() : '-';
  // The API doesn't distinguish Kg vs Ltr — waste_unit is assumed to be in Kg
  // (matching how this figure is labeled everywhere else in the app).
  if (key === 'quantity_kg') return item.waste_unit != null ? `${item.waste_unit}` : '-';
  if (key === 'quantity_ltr') return '-';
  return '-';
};

const WasteDispatchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const items = useMemo(
    () => (location.state as { items?: WasteGeneration[] } | null)?.items ?? [],
    [location.state]
  );

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');
  const [users, setUsers] = useState<FMUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [formData, setFormData] = useState({
    destinationType: '',
    vendorId: '',
    buildingId: '',
    vehicleNumber: '',
    driverName: '',
    driverContact: '',
    dispatchDate: '',
    dispatchWeightKg: '',
    disposalMethodKg: '',
    dispatchWeightLtr: '',
    disposalMethodLtr: '',
    manifestNumber: '',
    department: '',
    approvedBy: '',
    approvalStatus: 'Pending Approval',
    comments: '',
  });

  const [authorizeBy, setAuthorizeBy] = useState({ department: true, user: false });

  const siteLabel = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('selectedSiteName') || localStorage.getItem('selectedSite') || '';
  }, []);

  useEffect(() => {
    const loadBuildings = async () => {
      setLoadingBuildings(true);
      try {
        const data = await fetchBuildings();
        setBuildings(Array.isArray(data) ? data : []);
      } catch {
        setBuildings([]);
      } finally {
        setLoadingBuildings(false);
      }
    };
    loadBuildings();
  }, []);

  // Fetch FM users lazily, only once the "User" authorization option is switched on
  useEffect(() => {
    if (!authorizeBy.user || users.length > 0) return;
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await dispatch(fetchFMUsers()).unwrap();
        setUsers(Array.isArray(response?.users) ? response.users : []);
      } catch {
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, [authorizeBy.user, users.length, dispatch]);

  const totalCaptured = useMemo(
    () => items.reduce((sum, item) => sum + (item.waste_unit || 0), 0),
    [items]
  );

  // Summary cards scoped to just the selected items (client-side, since
  // dispatch has no aggregation API yet).
  const summaryCards = useMemo(() => {
    const totalWasteKg = items.reduce((sum, item) => sum + (item.waste_unit || 0), 0);
    const totalRecycled = items.reduce((sum, item) => sum + (item.recycled_unit || 0), 0);
    const dryWaste = Math.max(totalWasteKg - totalRecycled, 0);
    const hazardousWaste = items
      .filter((item) => (item.category?.category_name || '').toLowerCase().includes('hazard'))
      .reduce((sum, item) => sum + (item.waste_unit || 0), 0);

    return [
      { label: 'Total Weight (Kg)', value: `${totalWasteKg.toLocaleString('en-IN')} KG`, icon: <Trash2 className="w-6 h-6 text-[#C72030]" /> },
      // The API doesn't return a separate litre-based quantity for waste
      // generation records, so this can't be computed from real data yet.
      { label: 'Total Weight (Litre)', value: '—', icon: <Droplet className="w-6 h-6 text-[#C72030]" /> },
      { label: 'Dry Waste', value: `${dryWaste.toLocaleString('en-IN')} KG`, icon: <Package className="w-6 h-6 text-[#C72030]" /> },
      { label: 'Wet Waste', value: `${totalRecycled.toLocaleString('en-IN')} KG`, icon: <RefreshCw className="w-6 h-6 text-[#C72030]" /> },
      { label: 'Hazardous Waste', value: `${hazardousWaste.toLocaleString('en-IN')} KG`, icon: <Activity className="w-6 h-6 text-[#C72030]" /> },
    ];
  }, [items]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachmentName(e.target.files?.[0]?.name || '');
  };

  const handleBack = () => navigate('/maintenance/waste/generation');

  const handleDispatch = () => {
    if (items.length === 0) {
      toast.error('No waste items selected to dispatch.');
      return;
    }
    if (!formData.destinationType) {
      toast.error('Validation Error: Destination Type is required.');
      return;
    }
    if (!formData.vendorId) {
      toast.error('Validation Error: Vendor / Facility Name is required.');
      return;
    }
    if (!formData.vehicleNumber) {
      toast.error('Validation Error: Vehicle Number is required.');
      return;
    }
    if (!formData.dispatchDate) {
      toast.error('Validation Error: Dispatch Date is required.');
      return;
    }
    if (!formData.dispatchWeightKg) {
      toast.error('Validation Error: Dispatch Weight (Kg) is required.');
      return;
    }
    if (parseFloat(formData.dispatchWeightKg) > totalCaptured) {
      toast.error('Dispatch Weight (Kg) cannot exceed total waste captured for the selected items.');
      return;
    }
    if (!formData.disposalMethodKg) {
      toast.error('Validation Error: Disposal Method (Kg) is required.');
      return;
    }

    // TODO: wire this up to the real dispatch API endpoint once the backend exposes one.
    const payload = {
      waste_generation_ids: items.map((item) => item.id),
      destination_type: formData.destinationType,
      vendor_id: formData.vendorId,
      building_id: formData.buildingId || null,
      vehicle_number: formData.vehicleNumber,
      driver_name: formData.driverName,
      driver_contact: formData.driverContact,
      dispatch_date: formData.dispatchDate,
      total_waste_captured_kg: totalCaptured,
      dispatch_weight_kg: parseFloat(formData.dispatchWeightKg),
      disposal_method_kg: formData.disposalMethodKg,
      dispatch_weight_ltr: formData.dispatchWeightLtr ? parseFloat(formData.dispatchWeightLtr) : null,
      disposal_method_ltr: formData.disposalMethodLtr || null,
      manifest_number: formData.manifestNumber,
      authorized_by_department: authorizeBy.department ? formData.department : null,
      authorized_by_user: authorizeBy.user ? formData.approvedBy : null,
      approval_status: formData.approvalStatus,
      comments: formData.comments,
      attachment_name: attachmentName || null,
    };
    console.log('Waste dispatch payload (pending backend integration):', payload);
    toast.success('Waste dispatch submitted.');
    navigate('/maintenance/waste/generation');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Button variant="ghost" onClick={handleBack} className="p-0 mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">WASTE DISPATCH</h1>
        <p className="text-sm text-gray-600 mt-1">
          Dispatch the selected waste items to a vendor, recycler, or disposal facility.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 hover:shadow-lg transition-shadow duration-300">
            <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center shrink-0">
              {card.icon}
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#1A1A1A]">{card.value}</div>
              <div className="text-sm font-medium text-[#1A1A1A]">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Selected waste items */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {DISPATCH_ITEM_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="text-left font-semibold text-gray-500 uppercase text-xs px-3 py-3 border-b border-gray-200 whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={DISPATCH_ITEM_COLUMNS.length} className="text-center text-gray-400 py-6">
                    No waste items selected.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    {DISPATCH_ITEM_COLUMNS.map((col) => (
                      <td key={col.key} className="px-3 py-3 border-b border-gray-100 whitespace-nowrap">
                        {renderWasteGenerationCell(item, col.key)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dispatch To */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">Dispatch To</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormControl fullWidth>
              <InputLabel shrink id="destination-type-label" sx={{ backgroundColor: 'white', px: 1 }}>
                Destination Type <span className="text-red-500">*</span>
              </InputLabel>
              <Select
                labelId="destination-type-label"
                value={formData.destinationType}
                onChange={(e: SelectChangeEvent<string>) => handleChange('destinationType', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Destination Type</em>
                </MenuItem>
                {DESTINATION_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <SupplierSearchSelect
              value={formData.vendorId}
              onChange={(vendorId) => handleChange('vendorId', vendorId)}
              label={<span>Vendor / Facility Name <span style={{ color: '#C72030' }}>*</span></span>}
              size="schedule"
            />

            <TextField
              label="Source Site"
              value={siteLabel}
              fullWidth
              variant="outlined"
              disabled
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <FormControl fullWidth disabled={loadingBuildings}>
              <InputLabel shrink id="source-building-label" sx={{ backgroundColor: 'white', px: 1 }}>
                Source Building
              </InputLabel>
              <Select
                labelId="source-building-label"
                value={formData.buildingId}
                onChange={(e: SelectChangeEvent<string>) => handleChange('buildingId', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>{loadingBuildings ? 'Loading...' : 'Select Building'}</em>
                </MenuItem>
                {buildings.map((b) => (
                  <MenuItem key={b.id} value={b.id.toString()}>{b.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={<span>Vehicle Number <span className="text-red-500">*</span></span>}
              placeholder="e.g. MH-04-AB-1234"
              value={formData.vehicleNumber}
              onChange={(e) => handleChange('vehicleNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              label="Driver Name"
              placeholder="Enter driver name"
              value={formData.driverName}
              onChange={(e) => handleChange('driverName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              label="Driver Contact"
              placeholder="Enter phone number"
              value={formData.driverContact}
              onChange={(e) => handleChange('driverContact', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              label={<span>Dispatch Date <span className="text-red-500">*</span></span>}
              type="date"
              value={formData.dispatchDate}
              onChange={(e) => handleChange('dispatchDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>
        </div>

        {/* Dispatch Details */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">Dispatch Details</h2>

          {/* KG Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">KG Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextField
                label={<span>Total Waste Captured (Kg) <span className="text-red-500">*</span></span>}
                value={`${totalCaptured.toLocaleString('en-IN')} KG`}
                fullWidth
                variant="outlined"
                disabled
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label={<span>Dispatch Weight (Kg) <span className="text-red-500">*</span></span>}
                placeholder="e.g. 550"
                type="number"
                value={formData.dispatchWeightKg}
                onChange={(e) => handleChange('dispatchWeightKg', e.target.value)}
                fullWidth
                variant="outlined"
                inputProps={{ min: '0' }}
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <FormControl fullWidth>
                <InputLabel shrink id="disposal-method-kg-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  Disposal Method <span className="text-red-500">*</span>
                </InputLabel>
                <Select
                  labelId="disposal-method-kg-label"
                  value={formData.disposalMethodKg}
                  onChange={(e: SelectChangeEvent<string>) => handleChange('disposalMethodKg', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>Select Disposal Method</em>
                  </MenuItem>
                  {DISPOSAL_METHOD_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Dispatch weight cannot exceed total waste captured in the system for the selected items.
            </p>
          </div>

          {/* Litre Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Litre Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextField
                label="Total Waste Captured (Litre)"
                value="—"
                fullWidth
                variant="outlined"
                disabled
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Dispatch Weight (Litre)"
                placeholder="e.g. 210"
                type="number"
                value={formData.dispatchWeightLtr}
                onChange={(e) => handleChange('dispatchWeightLtr', e.target.value)}
                fullWidth
                variant="outlined"
                inputProps={{ min: '0' }}
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <FormControl fullWidth>
                <InputLabel shrink id="disposal-method-ltr-label" sx={{ backgroundColor: 'white', px: 1 }}>
                  Disposal Method
                </InputLabel>
                <Select
                  labelId="disposal-method-ltr-label"
                  value={formData.disposalMethodLtr}
                  onChange={(e: SelectChangeEvent<string>) => handleChange('disposalMethodLtr', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>Select Disposal Method</em>
                  </MenuItem>
                  {DISPOSAL_METHOD_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Shared across both sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextField
              label="Waste Transfer Note / Manifest No."
              placeholder="Enter manifest number"
              value={formData.manifestNumber}
              onChange={(e) => handleChange('manifestNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>
        </div>

        {/* Authorized By */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">Authorized By</h2>
          <div className="flex items-center gap-6 mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
              <input
                type="checkbox"
                checked={authorizeBy.department}
                onChange={(e) => setAuthorizeBy((prev) => ({ ...prev, department: e.target.checked }))}
                className="accent-brand w-4 h-4"
              />
              Department
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
              <input
                type="checkbox"
                checked={authorizeBy.user}
                onChange={(e) => setAuthorizeBy((prev) => ({ ...prev, user: e.target.checked }))}
                className="accent-brand w-4 h-4"
              />
              User
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormControl fullWidth>
              <InputLabel shrink id="department-label" sx={{ backgroundColor: 'white', px: 1 }}>
                Department
              </InputLabel>
              <Select
                labelId="department-label"
                value={formData.department}
                onChange={(e: SelectChangeEvent<string>) => handleChange('department', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Department</em>
                </MenuItem>
                {DEPARTMENT_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!authorizeBy.user || loadingUsers}>
              <InputLabel shrink id="approved-by-label" sx={{ backgroundColor: 'white', px: 1 }}>
                Approved By
              </InputLabel>
              <Select
                labelId="approved-by-label"
                value={formData.approvedBy}
                onChange={(e: SelectChangeEvent<string>) => handleChange('approvedBy', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>
                    {!authorizeBy.user
                      ? 'Enable "User" above first'
                      : loadingUsers
                      ? 'Loading...'
                      : 'Select User'}
                  </em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id.toString()}>{user.full_name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel shrink id="approval-status-label" sx={{ backgroundColor: 'white', px: 1 }}>
                Approval Status
              </InputLabel>
              <Select
                labelId="approval-status-label"
                value={formData.approvalStatus}
                onChange={(e: SelectChangeEvent<string>) => handleChange('approvalStatus', e.target.value)}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Attachment */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-2">Attachment</h2>
          <p className="text-xs text-gray-500 mb-3">
            Attach weighbridge slip, waste transfer note, or manifest copy.
          </p>
          <div className="flex items-center gap-3">
            <label className="bg-gray-100 border border-gray-300 rounded px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-200">
              Choose File
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            <span className="text-sm text-gray-500">{attachmentName || 'No file chosen'}</span>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">Comments</h2>
          <textarea
            value={formData.comments}
            onChange={(e) => handleChange('comments', e.target.value)}
            placeholder="Add comments"
            rows={4}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button onClick={handleDispatch} className="fm-button-fix fm-button-brand px-4 py-2">
            <Truck className="w-4 h-4 mr-2" />
            Dispatch Waste
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WasteDispatchPage;
