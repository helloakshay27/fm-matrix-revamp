import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { toast } from 'sonner';
import { DUMMY_DISPATCH_RECORDS, DispatchRecord } from '@/data/wasteDispatchDummyData';

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

const RECYCLING_STATUS_OPTIONS = ['Fully Recycled', 'Partially Recycled', 'Rejected by Vendor'];
const RECYCLING_METHOD_OPTIONS = ['Material Recovery / Recycled', 'Reused', 'Downcycled', 'Energy Recovery'];

const statusBadgeClass = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('delivered')) return 'bg-blue-100 text-blue-700';
  if (s.includes('transit')) return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-700';
};

const categoryBadgeClass = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes('hazard')) return 'bg-red-100 text-red-700';
  if (c.includes('e-waste')) return 'bg-purple-100 text-purple-700';
  if (c.includes('recycl')) return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-700';
};

// "250 Kg | 80 Litre" — always shows both units side by side; a unit the
// record doesn't carry a number for just shows a dash instead of being hidden.
const formatDual = (kg: number | null | undefined, ltr: number | null | undefined) => {
  const kgPart = kg != null ? `${kg.toLocaleString('en-IN')} Kg` : '- Kg';
  const ltrPart = ltr != null ? `${ltr.toLocaleString('en-IN')} Litre` : '- Litre';
  return `${kgPart} | ${ltrPart}`;
};

const parseNum = (raw: string): number | null => {
  if (!raw) return null;
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
};

type Field = { label: string; value: string | number | null | undefined };

const hasData = (value: string | number | null | undefined) =>
  value !== null && value !== undefined && value !== '';

// Renders a field list as two side-by-side columns, matching the pattern
// used on WasteDispatchDetailPage.tsx / WasteGenerationDetailsPage.tsx.
const FieldColumns = ({ fields }: { fields: Field[] }) => {
  const visible = fields.filter((f) => hasData(f.value));
  if (visible.length === 0) {
    return <p className="text-sm text-gray-500">No data available.</p>;
  }
  const midpoint = Math.ceil(visible.length / 2);
  const colA = visible.slice(0, midpoint);
  const colB = visible.slice(midpoint);
  return (
    <div className="flex flex-col sm:flex-row gap-10">
      {[colA, colB].map((col, ci) => (
        <div key={ci} className="flex flex-col gap-4 min-w-[280px] flex-1">
          {col.map((field) => (
            <div key={field.label} className="flex text-[14px] leading-snug min-w-0">
              <div className="w-[200px] flex-shrink-0 text-[#6B6B6B] font-medium">
                {field.label}
              </div>
              <div className="flex-1 text-[14px] font-semibold text-[#1A1A1A] break-words overflow-wrap-anywhere min-w-0">
                {String(field.value)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const CardShell = ({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card className="w-full bg-white rounded-lg shadow-sm border mb-6">
    <div className="flex items-center justify-between gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
      <h3 className="text-lg font-semibold uppercase text-black">{title}</h3>
      {badge}
    </div>
    <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-4">{children}</div>
  </Card>
);

const RecycleEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const selectedRecord: DispatchRecord | null = useMemo(() => {
    const fromState = (location.state as { record?: DispatchRecord } | null)?.record;
    if (fromState) return fromState;
    return DUMMY_DISPATCH_RECORDS.find((r) => r.id === id) ?? DUMMY_DISPATCH_RECORDS[0] ?? null;
  }, [location.state, id]);

  const [attachmentName, setAttachmentName] = useState('');
  const [formData, setFormData] = useState({
    recycledQuantityKg: '',
    recycledQuantityLtr: '',
    recyclingMethodKg: '',
    recyclingMethodLtr: '',
    confirmationDate: '',
    recyclingStatus: '',
    certificateNumber: '',
    confirmedBy: '',
    comments: '',
  });

  const recycledQuantityKg = useMemo(() => parseNum(formData.recycledQuantityKg), [formData.recycledQuantityKg]);
  const recycledQuantityLtr = useMemo(() => parseNum(formData.recycledQuantityLtr), [formData.recycledQuantityLtr]);

  const wastageKg = useMemo(() => {
    if (selectedRecord?.dispatchWeightKg == null || recycledQuantityKg == null) return null;
    return Math.max(selectedRecord.dispatchWeightKg - recycledQuantityKg, 0);
  }, [selectedRecord, recycledQuantityKg]);

  const wastageLtr = useMemo(() => {
    if (selectedRecord?.dispatchWeightLtr == null || recycledQuantityLtr == null) return null;
    return Math.max(selectedRecord.dispatchWeightLtr - recycledQuantityLtr, 0);
  }, [selectedRecord, recycledQuantityLtr]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachmentName(e.target.files?.[0]?.name || '');
  };

  const handleBack = () => navigate('/maintenance/waste/dispatch');

  const handleSave = () => {
    if (!selectedRecord) {
      toast.error('Validation Error: No dispatch selected to record recycling against.');
      return;
    }
    if (!formData.recycledQuantityKg && !formData.recycledQuantityLtr) {
      toast.error('Validation Error: Enter a Recycled Quantity (Kg) or (Litre).');
      return;
    }
    if (!formData.confirmationDate) {
      toast.error('Validation Error: Recycling Confirmation Date is required.');
      return;
    }
    if (!formData.recyclingStatus) {
      toast.error('Validation Error: Recycling Status is required.');
      return;
    }

    // TODO: wire this up to a real recycle-entry API endpoint once the backend exposes one.
    const payload = {
      dispatch_id: selectedRecord.dispatchId,
      recycled_quantity_kg: recycledQuantityKg,
      recycled_quantity_ltr: recycledQuantityLtr,
      recycling_method_kg: formData.recyclingMethodKg || null,
      recycling_method_ltr: formData.recyclingMethodLtr || null,
      wastage_kg: wastageKg,
      wastage_ltr: wastageLtr,
      confirmation_date: formData.confirmationDate,
      recycling_status: formData.recyclingStatus,
      certificate_number: formData.certificateNumber || null,
      confirmed_by: formData.confirmedBy || null,
      comments: formData.comments || null,
      attachment_name: attachmentName || null,
    };
    console.log('Recycle entry payload (pending backend integration):', payload);
    toast.success('Recycle entry saved.');
    navigate('/maintenance/waste/dispatch');
  };

  const dispatchFields: Field[] = selectedRecord
    ? [
        { label: 'Dispatch ID', value: selectedRecord.dispatchId },
        { label: 'Waste Type', value: selectedRecord.wasteItem },
        { label: 'Waste Category', value: selectedRecord.category },
        { label: 'Status', value: selectedRecord.status },
        {
          label: 'Dispatch Date & Time',
          value: `${selectedRecord.dispatchDate} ${selectedRecord.dispatchTime}`.trim(),
        },
        { label: 'Vendor / Facility', value: selectedRecord.destination },
        { label: 'Destination Facility', value: selectedRecord.destinationFacility },
        { label: 'Vehicle No.', value: selectedRecord.vehicleNumber },
        { label: 'Driver Name', value: selectedRecord.driverName },
        { label: 'Contact No.', value: selectedRecord.contactNo },
        { label: 'Manifest No.', value: selectedRecord.manifestNumber },
        { label: 'Site', value: selectedRecord.site },
        { label: 'Disposal Method', value: selectedRecord.disposalMethod },
        {
          label: 'Supporting Documents',
          value: selectedRecord.supportingDocumentsCount > 0 ? `${selectedRecord.supportingDocumentsCount} file(s)` : '-',
        },
        { label: 'Vendor Acknowledge', value: selectedRecord.vendorAcknowledge },
        { label: 'Dispatched By', value: selectedRecord.dispatchedBy },
        {
          label: 'Total Generated Weight (Kg)',
          value: selectedRecord.totalGeneratedWeightKg != null ? `${selectedRecord.totalGeneratedWeightKg} Kg` : undefined,
        },
        {
          label: 'Total Generated Weight (Ltr)',
          value: selectedRecord.totalGeneratedWeightLtr != null ? `${selectedRecord.totalGeneratedWeightLtr} Ltr` : undefined,
        },
        {
          label: 'Dispatch Weight (Kg)',
          value: selectedRecord.dispatchWeightKg != null ? `${selectedRecord.dispatchWeightKg} Kg` : undefined,
        },
        {
          label: 'Dispatch Weight (Ltr)',
          value: selectedRecord.dispatchWeightLtr != null ? `${selectedRecord.dispatchWeightLtr} Ltr` : undefined,
        },
      ]
    : [];

  if (!selectedRecord) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Button variant="ghost" onClick={handleBack} className="p-0 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center text-gray-500 py-16">Dispatch record not found.</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Button variant="ghost" onClick={handleBack} className="p-0 mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">RECYCLE ENTRY</h1>
        <p className="text-sm text-gray-600 mt-1">
          Record the vendor's confirmation of recycled quantity against a completed dispatch.
        </p>
      </div>

      {/* Dispatch Details — all dispatch-related information */}
      <CardShell
        title="Dispatch Details"
        badge={
          <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${statusBadgeClass(selectedRecord.status)}`}>
            {selectedRecord.status}
          </span>
        }
      >
        <div className="mb-3">
          <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${categoryBadgeClass(selectedRecord.category)}`}>
            {selectedRecord.category}
          </span>
        </div>
        <FieldColumns fields={dispatchFields} />
      </CardShell>

      {/* Summary cards — both units shown together in each card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-gray-400 bg-white">
          <p className="text-xs text-gray-500 mb-1">Dispatch Quantity</p>
          <p className="text-lg font-bold text-gray-900">
            {formatDual(selectedRecord.dispatchWeightKg, selectedRecord.dispatchWeightLtr)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-green-700 bg-white">
          <p className="text-xs text-gray-500 mb-1">Recycled Quantity</p>
          <p className="text-lg font-bold text-gray-900">
            {formatDual(recycledQuantityKg, recycledQuantityLtr)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-red-600 bg-white">
          <p className="text-xs text-gray-500 mb-1">Wastage / Loss</p>
          <p className="text-lg font-bold text-gray-900">
            {formatDual(wastageKg, wastageLtr)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Recycle Confirmation */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-1">Recycle Confirmation</h2>
          <p className="text-xs text-gray-500 mb-4">
            Enter the quantity the vendor confirms was recycled, per unit. Wastage is calculated automatically.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TextField
              label="Recycled Quantity (Kg)"
              placeholder="e.g. 250"
              type="number"
              value={formData.recycledQuantityKg}
              onChange={(e) => handleChange('recycledQuantityKg', e.target.value)}
              fullWidth
              variant="outlined"
              inputProps={{ min: '0' }}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label="Recycled Quantity (Litre)"
              placeholder="e.g. 80"
              type="number"
              value={formData.recycledQuantityLtr}
              onChange={(e) => handleChange('recycledQuantityLtr', e.target.value)}
              fullWidth
              variant="outlined"
              inputProps={{ min: '0' }}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <FormControl fullWidth>
              <InputLabel shrink id="recycling-method-kg-label" sx={{ backgroundColor: 'white', px: 1 }}>
                Recycling Method (Kg)
              </InputLabel>
              <Select
                labelId="recycling-method-kg-label"
                value={formData.recyclingMethodKg}
                onChange={(e: SelectChangeEvent<string>) => handleChange('recyclingMethodKg', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Method</em>
                </MenuItem>
                {RECYCLING_METHOD_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel shrink id="recycling-method-ltr-label" sx={{ backgroundColor: 'white', px: 1 }}>
                Recycling Method (Litre)
              </InputLabel>
              <Select
                labelId="recycling-method-ltr-label"
                value={formData.recyclingMethodLtr}
                onChange={(e: SelectChangeEvent<string>) => handleChange('recyclingMethodLtr', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Method</em>
                </MenuItem>
                {RECYCLING_METHOD_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextField
              label={<span>Recycling Confirmation Date <span className="text-red-500">*</span></span>}
              type="date"
              value={formData.confirmationDate}
              onChange={(e) => handleChange('confirmationDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <FormControl fullWidth>
              <InputLabel shrink id="recycling-status-label" sx={{ backgroundColor: 'white', px: 1 }}>
                Recycling Status <span className="text-red-500">*</span>
              </InputLabel>
              <Select
                labelId="recycling-status-label"
                value={formData.recyclingStatus}
                onChange={(e: SelectChangeEvent<string>) => handleChange('recyclingStatus', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Status</em>
                </MenuItem>
                {RECYCLING_STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Recycling Certificate No."
              placeholder="Enter certificate / reference no."
              value={formData.certificateNumber}
              onChange={(e) => handleChange('certificateNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label="Confirmed By (Vendor Contact)"
              placeholder="Enter vendor contact name"
              value={formData.confirmedBy}
              onChange={(e) => handleChange('confirmedBy', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>
        </div>

        {/* Attachment */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-2">Attachment</h2>
          <p className="text-xs text-gray-500 mb-3">
            Attach the vendor's recycling certificate or confirmation receipt.
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
          <Button onClick={handleSave} className="fm-button-fix fm-button-brand px-4 py-2">
            Save Recycle Entry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecycleEntryPage;
