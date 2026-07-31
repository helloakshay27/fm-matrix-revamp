import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

// "210 L" / "1.2 t" / "340 kg" -> { value: 210, unit: 'L' }
const parseQuantity = (raw: string): { value: number; unit: string } => {
  const match = raw.trim().match(/^([\d.,]+)\s*(.*)$/);
  if (!match) return { value: 0, unit: '' };
  return { value: parseFloat(match[1].replace(/,/g, '')) || 0, unit: match[2] || '' };
};

const RecycleEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const initialRecord = useMemo(() => {
    const fromState = (location.state as { record?: DispatchRecord } | null)?.record;
    if (fromState) return fromState;
    return DUMMY_DISPATCH_RECORDS.find((r) => r.id === id) ?? DUMMY_DISPATCH_RECORDS[0] ?? null;
  }, [location.state, id]);

  const [selectedDispatchId, setSelectedDispatchId] = useState(initialRecord?.id ?? '');
  const [attachmentName, setAttachmentName] = useState('');
  const [formData, setFormData] = useState({
    recycledQuantity: '',
    confirmationDate: '',
    recyclingStatus: '',
    recyclingMethod: '',
    certificateNumber: '',
    confirmedBy: '',
    comments: '',
  });

  const selectedRecord = useMemo(
    () => DUMMY_DISPATCH_RECORDS.find((r) => r.id === selectedDispatchId) ?? null,
    [selectedDispatchId]
  );

  const dispatchedQuantity = useMemo(
    () => (selectedRecord ? parseQuantity(selectedRecord.dispatchWeight) : { value: 0, unit: '' }),
    [selectedRecord]
  );

  const recycledQuantity = useMemo(() => parseQuantity(formData.recycledQuantity), [formData.recycledQuantity]);

  const wastage = useMemo(() => {
    if (!formData.recycledQuantity) return null;
    return Math.max(dispatchedQuantity.value - recycledQuantity.value, 0);
  }, [dispatchedQuantity, recycledQuantity, formData.recycledQuantity]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachmentName(e.target.files?.[0]?.name || '');
  };

  const handleBack = () => navigate('/maintenance/waste/dispatch');

  const handleSave = () => {
    if (!selectedRecord) {
      toast.error('Validation Error: Select a dispatch to record recycling against.');
      return;
    }
    if (!formData.recycledQuantity) {
      toast.error('Validation Error: Recycled Quantity is required.');
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
      recycled_quantity: formData.recycledQuantity,
      wastage: wastage != null ? `${wastage} ${dispatchedQuantity.unit}` : null,
      confirmation_date: formData.confirmationDate,
      recycling_status: formData.recyclingStatus,
      recycling_method: formData.recyclingMethod || null,
      certificate_number: formData.certificateNumber || null,
      confirmed_by: formData.confirmedBy || null,
      comments: formData.comments || null,
      attachment_name: attachmentName || null,
    };
    console.log('Recycle entry payload (pending backend integration):', payload);
    toast.success('Recycle entry saved.');
    navigate('/maintenance/waste/dispatch');
  };

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

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Against Dispatch */}
        

        {/* Dispatch reference, auto-filled */}
        {selectedRecord && (
          <div className="mb-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-gray-900">
                  {selectedRecord.dispatchId} · {selectedRecord.wasteItem}
                </span>
                <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${statusBadgeClass(selectedRecord.status)}`}>
                  {selectedRecord.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Category</p>
                  <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${categoryBadgeClass(selectedRecord.category)}`}>
                    {selectedRecord.category}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dispatch Weight</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedRecord.dispatchWeight}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Vendor / Facility</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedRecord.destination}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dispatch Date</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedRecord.dispatchDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Vehicle No.</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedRecord.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Manifest No.</p>
                  <p className="text-sm font-semibold text-brand">{selectedRecord.manifestNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Site</p>
                  <p className="text-sm font-semibold text-brand">{selectedRecord.site}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dispatched By</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedRecord.dispatchedBy}</p>
                </div>
              </div>
            </div>
          </div>
        )}

         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-gray-400">
              <p className="text-xs text-gray-500 mb-1">Dispatched Quantity</p>
              <p className="text-xl font-bold text-gray-900">
                {dispatchedQuantity.value.toLocaleString('en-IN')} <span className="text-sm font-medium text-gray-500">{dispatchedQuantity.unit}</span>
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-green-700">
              <p className="text-xs text-gray-500 mb-1">Recycled Quantity</p>
              <p className="text-xl font-bold text-gray-900">
                {formData.recycledQuantity ? (
                  <>
                    {recycledQuantity.value.toLocaleString('en-IN')}{' '}
                    <span className="text-sm font-medium text-gray-500">{recycledQuantity.unit || dispatchedQuantity.unit}</span>
                  </>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 border-l-4 border-l-red-600">
              <p className="text-xs text-gray-500 mb-1">Wastage / Loss</p>
              <p className="text-xl font-bold text-gray-900">
                {wastage != null ? (
                  <>
                    {wastage.toLocaleString('en-IN')} <span className="text-sm font-medium text-gray-500">{dispatchedQuantity.unit}</span>
                  </>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </p>
            </div>
          </div>

        {/* Recycle Confirmation */}
        <div className="mb-8 mt-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Recycle Confirmation</h2>
          <p className="text-xs text-gray-500 mb-4">
            Enter the quantity the vendor confirms was recycled. Wastage is calculated automatically.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextField
              label={<span>Recycled Quantity <span className="text-red-500">*</span></span>}
              placeholder="e.g. 205 L"
              value={formData.recycledQuantity}
              onChange={(e) => handleChange('recycledQuantity', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
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
            <FormControl fullWidth>
              <InputLabel shrink id="recycling-method-label" sx={{ backgroundColor: 'white', px: 1 }}>
                Recycling Method
              </InputLabel>
              <Select
                labelId="recycling-method-label"
                value={formData.recyclingMethod}
                onChange={(e: SelectChangeEvent<string>) => handleChange('recyclingMethod', e.target.value)}
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
