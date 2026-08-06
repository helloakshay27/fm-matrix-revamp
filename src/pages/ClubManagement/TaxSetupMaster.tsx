import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { toast } from 'sonner';
import { API_CONFIG } from '@/config/apiConfig';

interface Tax {
  id: number;
  name: string;
  percentage: number;
  tax_type: 'tds' | 'tcs';
  higher_rate: boolean;
  diff_rate_reason: string | null;
  start_date: string;
  end_date: string;
  lock_account_tax_section_id: number;
  active: boolean;
}

interface TaxSection {
  id: number;
  name: string;
  tax_type: 'tds' | 'tcs';
  group_name: string | null;
  active: boolean;
}

const TAX_TYPE_OPTIONS = [
  { value: 'tds', label: 'TDS' },
  { value: 'tcs', label: 'TCS' },
];

const getFullUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL?.replace(/\/$/, '') || '';
  return `${baseUrl}${endpoint}`;
};

const getAuthenticatedFetchOptions = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
): RequestInit => {
  const token = API_CONFIG.TOKEN;
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }
  return options;
};

const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false },
  { key: 'name', label: 'Tax Name', sortable: true, hideable: true, draggable: true },
  { key: 'percentage', label: 'Rate (%)', sortable: true, hideable: true, draggable: true },
  { key: 'tax_type', label: 'Tax Type', sortable: true, hideable: true, draggable: true },
  { key: 'start_date', label: 'Start Date', sortable: true, hideable: true, draggable: true },
  { key: 'end_date', label: 'End Date', sortable: true, hideable: true, draggable: true },
];

export const TaxSetupMaster: React.FC = () => {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<TaxSection[]>([]);
  const [loadingSections, setLoadingSections] = useState(false);

  // Add modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    percentage: '',
    tax_type: '',
    higher_rate: false,
    diff_rate_reason: '',
    start_date: '',
    end_date: '',
    lock_account_tax_section_id: '',
  });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: 0,
    name: '',
    percentage: '',
    tax_type: '',
    higher_rate: false,
    diff_rate_reason: '',
    start_date: '',
    end_date: '',
    lock_account_tax_section_id: '',
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const lock_account_id = localStorage.getItem("lock_account_id");

  // Fetch all taxes
  const fetchTaxes = useCallback(async () => {
    setLoading(true);
    try {
      const url = getFullUrl(`/lock_account_taxes.json?lock_account_id=${lock_account_id}`);
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Tax[] = await response.json();
      setTaxes(data);
      setTotalRecords(data.length);
      setTotalPages(Math.ceil(data.length / perPage));
    } catch (error) {
      console.error('Error fetching taxes:', error);
      toast.error('Failed to load taxes');
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  // Fetch sections based on tax type
  const fetchSectionsByTaxType = useCallback(async (taxType: string) => {
    setLoadingSections(true);
    try {
      const url = getFullUrl(`/lock_account_tax_sections.json?q[tax_type_eq]=${taxType}`);
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: TaxSection[] = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to load sections');
      setSections([]);
    } finally {
      setLoadingSections(false);
    }
  }, []);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  // Handle tax type change in add form
  const handleAddTaxTypeChange = (value: string) => {
    setAddForm((prev) => ({
      ...prev,
      tax_type: value as 'tds' | 'tcs',
      lock_account_tax_section_id: '',
    }));
    setAddErrors((prev) => ({ ...prev, tax_type: undefined }));
    fetchSectionsByTaxType(value);
  };

  // Handle tax type change in edit form
  const handleEditTaxTypeChange = (value: string) => {
    setEditForm((prev) => ({
      ...prev,
      tax_type: value as 'tds' | 'tcs',
      lock_account_tax_section_id: '',
    }));
    setEditErrors((prev) => ({ ...prev, tax_type: undefined }));
    fetchSectionsByTaxType(value);
  };

  // Paginated data slice
  const paginatedTaxes = taxes.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Open edit modal and fetch by ID
  const handleOpenEdit = async (id: number) => {
    setEditModalOpen(true);
    setEditLoading(true);
    try {
      const url = getFullUrl(`/lock_account_taxes/${id}.json`);
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Tax = await response.json();
      setEditForm({
        id: data.id,
        name: data.name,
        percentage: data.percentage.toString(),
        tax_type: data.tax_type,
        higher_rate: data.higher_rate,
        diff_rate_reason: data.diff_rate_reason || '',
        start_date: data.start_date,
        end_date: data.end_date,
        lock_account_tax_section_id: data.lock_account_tax_section_id.toString(),
      });
      // Fetch sections for the tax type
      await fetchSectionsByTaxType(data.tax_type);
    } catch (error) {
      console.error('Error fetching tax by id:', error);
      toast.error('Failed to load tax details');
      setEditModalOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  // Validate form
  const validateForm = (form: typeof addForm): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Tax Name is required';
    const percentage = parseFloat(form.percentage);
    if (!form.percentage) {
      errs.percentage = 'Rate (%) is required';
    } else if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      errs.percentage = 'Rate (%) must be between 0 and 100';
    }
    if (!form.tax_type) errs.tax_type = 'Tax Type is required';
    if (!form.lock_account_tax_section_id) errs.lock_account_tax_section_id = 'Section is required';
    if (!form.start_date) errs.start_date = 'Start Date is required';
    if (!form.end_date) errs.end_date = 'End Date is required';
    if (form.start_date && form.end_date) {
      const startDate = new Date(form.start_date);
      const endDate = new Date(form.end_date);
      if (endDate < startDate) {
        errs.end_date = 'End Date must be on or after Start Date';
      }
    }
    if (form.higher_rate && !form.diff_rate_reason.trim()) errs.diff_rate_reason = 'Reason for Higher Rate is required';
    return errs;
  };

  // Create tax
  const handleAddTax = async () => {
    const errs = validateForm(addForm);
    if (Object.keys(errs).length > 0) {
      setAddErrors(errs);
      // Show all errors as toast
      Object.values(errs).forEach((msg) => {
        if (msg) toast.error(msg);
      });
      return;
    }
    setAddErrors({});
    setAddSubmitting(true);
    try {
      const url = getFullUrl(`/lock_account_taxes.json?lock_account_id=${lock_account_id}`);
      const options = getAuthenticatedFetchOptions('POST', {
        lock_account_tax: {
          name: addForm.name,
          percentage: parseFloat(addForm.percentage),
          tax_type: addForm.tax_type,
          higher_rate: addForm.higher_rate,
          diff_rate_reason: addForm.higher_rate ? addForm.diff_rate_reason : null,
          start_date: addForm.start_date,
          end_date: addForm.end_date,
          lock_account_tax_section_id: parseInt(addForm.lock_account_tax_section_id, 10),
        },
      });
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      toast.success('Tax added successfully');
      setAddModalOpen(false);
      setAddForm({
        name: '',
        percentage: '',
        tax_type: '',
        higher_rate: false,
        diff_rate_reason: '',
        start_date: '',
        end_date: '',
        lock_account_tax_section_id: '',
      });
      setSections([]);
      fetchTaxes();
    } catch (error) {
      console.error('Error creating tax:', error);
      toast.error('Failed to add tax');
    } finally {
      setAddSubmitting(false);
    }
  };

  // Update tax
  const handleEditTax = async () => {
    const errs = validateForm(editForm);
    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      // Show all errors as toast
      Object.values(errs).forEach((msg) => {
        if (msg) toast.error(msg);
      });
      return;
    }
    setEditErrors({});
    setEditSubmitting(true);
    try {
      const url = getFullUrl(`/lock_account_taxes/${editForm.id}.json`);
      const options = getAuthenticatedFetchOptions('PUT', {
        lock_account_tax: {
          name: editForm.name,
          percentage: parseFloat(editForm.percentage),
          tax_type: editForm.tax_type,
          higher_rate: editForm.higher_rate,
          diff_rate_reason: editForm.higher_rate ? editForm.diff_rate_reason : null,
          start_date: editForm.start_date,
          end_date: editForm.end_date,
          lock_account_tax_section_id: parseInt(editForm.lock_account_tax_section_id, 10),
        },
      });
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      toast.success('Tax updated successfully');
      setEditModalOpen(false);
      setSections([]);
      fetchTaxes();
    } catch (error) {
      console.error('Error updating tax:', error);
      toast.error('Failed to update tax');
    } finally {
      setEditSubmitting(false);
    }
  };

  // Delete tax
  const handleDeleteTax = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tax?')) return;
    try {
      const url = getFullUrl(`/lock_account_taxes/${id}.json`);
      const options = getAuthenticatedFetchOptions('DELETE');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      toast.success('Tax deleted successfully');
      fetchTaxes();
    } catch (error) {
      console.error('Error deleting tax:', error);
      toast.error('Failed to delete tax');
    }
  };

  const renderRow = (tax: Tax) => ({
    actions: (
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          title="Edit"
          onClick={() => handleOpenEdit(tax.id)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          title="Delete"
          onClick={() => handleDeleteTax(tax.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
    name: <span>{tax.name}</span>,
    percentage: <span>{tax.percentage}%</span>,
    tax_type: <span className="uppercase font-semibold">{tax.tax_type}</span>,
    start_date: <span>{new Date(tax.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>,
    end_date: <span>{new Date(tax.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>,
  });

  return (
    <div className="p-2 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tax Setup </h1>
      </header>

      <EnhancedTaskTable
        data={paginatedTaxes}
        columns={columns}
        renderRow={renderRow}
        storageKey="tax-setup-master-v1"
        hideTableExport={true}
        hideTableSearch={false}
        enableSearch={true}
        loading={loading}
        leftActions={(
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2 !text-white" />
            <span className="!text-white" >Add</span>
          </Button>
        )}
      />

      {totalRecords > 0 && (
        <TicketPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          perPage={perPage}
          isLoading={loading}
          onPageChange={(page) => setCurrentPage(page)}
          onPerPageChange={(pp) => {
            setPerPage(pp);
            setCurrentPage(1);
            setTotalPages(Math.ceil(totalRecords / pp));
          }}
        />
      )}

      {/* Add Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setAddErrors({});
          setAddForm({
            name: '',
            percentage: '',
            tax_type: '',
            higher_rate: false,
            diff_rate_reason: '',
            start_date: '',
            end_date: '',
            lock_account_tax_section_id: '',
          });
          setSections([]);
        }}
        fullWidth
        maxWidth="sm"
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <h5 className="text-lg font-semibold">New {addForm.tax_type.toUpperCase()}</h5>
        </div>
        <DialogContent>
          <style>{`
            .tax-setup-form .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
              border-color: #DA7756 !important;
            }
            .tax-setup-form .MuiInputLabel-root.Mui-focused {
              color: #DA7756 !important;
            }
            .tax-setup-form [class*="MuiFormControl"]:has(.MuiInputBase-multiline) [class*="MuiInputLabel"].Mui-focused,
            .tax-setup-form [class*="MuiFormControl"]:has(textarea) [class*="MuiInputLabel"].Mui-focused {
              color: #DA7756 !important;
            }
            .tax-setup-form .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline {
              border-color: #DA7756 !important;
            }
            .tax-setup-form .MuiInputLabel-root.Mui-error {
              color: #DA7756 !important;
            }
            .tax-setup-form .MuiFormHelperText-root.Mui-error {
              color: #DA7756 !important;
            }
          `}</style>
          <form className="tax-setup-form space-y-2 max-h-[60vh] overflow-y-auto">
            {/* Row 1: Tax Name and Rate */}
            <div className="grid grid-cols-2 gap-4">
              <TextField
                fullWidth
                margin="normal"
                label={<span>Tax Name<span style={{ color: '#C72030' }}>*</span></span>}
                name="name"
                placeholder="Enter tax name"
                InputLabelProps={{ shrink: true }}
                value={addForm.name}
                onChange={(e) => {
                  setAddForm((s) => ({ ...s, name: e.target.value }));
                  if (e.target.value.trim()) setAddErrors((s) => ({ ...s, name: undefined }));
                }}
                error={!!addErrors.name}
                helperText={addErrors.name}
              />
              <TextField
                fullWidth
                margin="normal"
                type="number"
                label={<span>Rate (%)<span style={{ color: '#C72030' }}>*</span></span>}
                name="percentage"
                placeholder="Enter tax rate"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
                value={addForm.percentage}
                onChange={(e) => {
                  let value = e.target.value;
                  const regex = /^\d{0,3}(\.\d{0,2})?$/;
                  if (!regex.test(value)) return;
                  if (Number(value) > 100) value = "100";
                  setAddForm((s) => ({ ...s, percentage: value }));
                  if (value) setAddErrors((s) => ({ ...s, percentage: undefined }));
                }}
                error={!!addErrors.percentage}
                helperText={addErrors.percentage}
              />
            </div>

            {/* Row 2: Tax Type */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="add-tax-type-label" shrink error={!!addErrors.tax_type}>
                Tax Type<span style={{ color: '#C72030' }}>*</span>
              </InputLabel>
              <Select
                labelId="add-tax-type-label"
                label="Tax Type*"
                displayEmpty
                notched
                value={addForm.tax_type}
                onChange={(e) => handleAddTaxTypeChange(e.target.value)}
                error={!!addErrors.tax_type}
              >
                <MenuItem value="" disabled>Select tax type</MenuItem>
                {TAX_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
              {addErrors.tax_type && <p className="text-xs mt-1" style={{ color: '#DA7756' }}>{addErrors.tax_type}</p>}
            </FormControl>

            {/* Row 3: Section */}
            <FormControl fullWidth margin="normal" disabled={loadingSections || sections.length === 0}>
              <InputLabel id="add-section-label" shrink error={!!addErrors.lock_account_tax_section_id}>
                Section<span style={{ color: '#C72030' }}>*</span>
              </InputLabel>
              <Select
                labelId="add-section-label"
                label="Section*"
                displayEmpty
                notched
                value={addForm.lock_account_tax_section_id}
                onChange={(e) => {
                  setAddForm((s) => ({ ...s, lock_account_tax_section_id: e.target.value }));
                  setAddErrors((s) => ({ ...s, lock_account_tax_section_id: undefined }));
                }}
                error={!!addErrors.lock_account_tax_section_id}
              >
                <MenuItem value="" disabled>{loadingSections ? 'Loading sections...' : 'Select a Tax Type.'}</MenuItem>
                {sections.map((sec) => (
                  <MenuItem key={sec.id} value={sec.id.toString()}>{sec.name}</MenuItem>
                ))}
              </Select>
              {addErrors.lock_account_tax_section_id && (
                <p className="text-xs mt-1" style={{ color: '#DA7756' }}>{addErrors.lock_account_tax_section_id}</p>
              )}
            </FormControl>

            {/* Info Box */}
            <div className="bg-brand-light border border-brand/20 rounded-md p-3 text-sm text-brand mt-2">
              <span className="font-semibold">ℹ</span> By default, {addForm.tax_type.toUpperCase()} will be tracked under {addForm.tax_type === 'tds' ? 'TDS Payable and TDS Receivable' : 'TCS Payable and TCS Receivable'} accounts.
            </div>

            {/* Higher Rate Checkbox */}
            <div className="flex items-center gap-2 mt-3">
              <Checkbox
                id="add-higher-rate"
                checked={addForm.higher_rate}
                onCheckedChange={(checked) => {
                  setAddForm((s) => ({ ...s, higher_rate: !!checked }));
                  if (!checked) setAddErrors((s) => ({ ...s, diff_rate_reason: undefined }));
                }}
              />
              <label htmlFor="add-higher-rate" className="text-sm cursor-pointer">
                This is a Higher {addForm.tax_type.toUpperCase()} Rate
              </label>
            </div>

            {/* Reason for Higher Rate (appears when checkbox is checked) */}
            {addForm.higher_rate && (
              <TextField
                fullWidth
                margin="normal"
                label={<span>Reason for Higher {addForm.tax_type.toUpperCase()} Rate<span style={{ color: '#C72030' }}>*</span></span>}
                name="diff_rate_reason"
                placeholder="Enter reason"
                InputLabelProps={{ shrink: true }}
                value={addForm.diff_rate_reason}
                onChange={(e) => {
                  setAddForm((s) => ({ ...s, diff_rate_reason: e.target.value }));
                  if (e.target.value.trim()) setAddErrors((s) => ({ ...s, diff_rate_reason: undefined }));
                }}
                error={!!addErrors.diff_rate_reason}
                helperText={addErrors.diff_rate_reason}
              />
            )}

            {/* Applicable Period */}
            <p className="text-sm font-semibold mt-3 mb-1">Applicable Period</p>
            <div className="grid grid-cols-2 gap-4">
              <TextField
                fullWidth
                margin="normal"
                type="date"
                label={<span>Start Date<span style={{ color: '#C72030' }}>*</span></span>}
                name="start_date"
                InputLabelProps={{ shrink: true }}
                value={addForm.start_date}
                onChange={(e) => {
                  setAddForm((s) => ({ ...s, start_date: e.target.value }));
                  if (e.target.value) setAddErrors((s) => ({ ...s, start_date: undefined }));
                }}
                error={!!addErrors.start_date}
                helperText={addErrors.start_date}
              />
              <TextField
                fullWidth
                margin="normal"
                type="date"
                label={<span>End Date<span style={{ color: '#C72030' }}>*</span></span>}
                name="end_date"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: addForm.start_date || undefined }}
                value={addForm.end_date}
                onChange={(e) => {
                  const val = e.target.value;
                  if (addForm.start_date && val && val < addForm.start_date) {
                    setAddForm((s) => ({ ...s, end_date: '' }));
                    setAddErrors((s) => ({ ...s, end_date: 'End Date must be on or after Start Date' }));
                  } else {
                    setAddForm((s) => ({ ...s, end_date: val }));
                    if (val) setAddErrors((s) => ({ ...s, end_date: undefined }));
                  }
                }}
                error={!!addErrors.end_date}
                helperText={addErrors.end_date}
              />
            </div>

            <div className="mt-4 pt-5 flex justify-center gap-3">
              <Button
                type="button"
                onClick={handleAddTax}
                disabled={addSubmitting}
                style={{ backgroundColor: "#C72030" }}
                className="text-white hover:bg-[#C72030]/90 min-w-[100px]"
              >
                {addSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddModalOpen(false);
                  setAddErrors({});
                  setAddForm({
                    name: '',
                    percentage: '',
                    tax_type: '',
                    higher_rate: false,
                    diff_rate_reason: '',
                    start_date: '',
                    end_date: '',
                    lock_account_tax_section_id: '',
                  });
                  setSections([]);
                }}
                disabled={addSubmitting}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditErrors({});
          setEditForm({
            id: 0,
            name: '',
            percentage: '',
            tax_type: '',
            higher_rate: false,
            diff_rate_reason: '',
            start_date: '',
            end_date: '',
            lock_account_tax_section_id: '',
          });
          setSections([]);
        }}
        fullWidth
        maxWidth="sm"
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <h5 className="text-lg font-semibold">Edit {editForm.tax_type.toUpperCase()}</h5>
        </div>
        <DialogContent>
          <style>{`
            .tax-setup-form .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
              border-color: #DA7756 !important;
            }
            .tax-setup-form .MuiInputLabel-root.Mui-focused {
              color: #DA7756 !important;
            }
            .tax-setup-form [class*="MuiFormControl"]:has(.MuiInputBase-multiline) [class*="MuiInputLabel"].Mui-focused,
            .tax-setup-form [class*="MuiFormControl"]:has(textarea) [class*="MuiInputLabel"].Mui-focused {
              color: #DA7756 !important;
            }
            .tax-setup-form .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline {
              border-color: #DA7756 !important;
            }
            .tax-setup-form .MuiInputLabel-root.Mui-error {
              color: #DA7756 !important;
            }
            .tax-setup-form .MuiFormHelperText-root.Mui-error {
              color: #DA7756 !important;
            }
          `}</style>
          {editLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <form className="tax-setup-form space-y-2 max-h-[60vh] overflow-y-auto">
              {/* Row 1: Tax Name and Rate */}
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  margin="normal"
                  label={<span>Tax Name<span style={{ color: '#C72030' }}>*</span></span>}
                  name="name"
                  placeholder="Enter tax name"
                  InputLabelProps={{ shrink: true }}
                  value={editForm.name}
                  onChange={(e) => {
                    setEditForm((s) => ({ ...s, name: e.target.value }));
                    if (e.target.value.trim()) setEditErrors((s) => ({ ...s, name: undefined }));
                  }}
                  error={!!editErrors.name}
                  helperText={editErrors.name}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  label={<span>Rate (%)<span style={{ color: '#C72030' }}>*</span></span>}
                  name="percentage"
                  placeholder="Enter tax rate"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  value={editForm.percentage}
                  onChange={(e) => {
                    let value = e.target.value;
                    const regex = /^\d{0,3}(\.\d{0,2})?$/;
                    if (!regex.test(value)) return;
                    if (Number(value) > 100) value = "100";
                    setEditForm((s) => ({ ...s, percentage: value }));
                    if (value) setEditErrors((s) => ({ ...s, percentage: undefined }));
                  }}
                  error={!!editErrors.percentage}
                  helperText={editErrors.percentage}
                />
              </div>

              {/* Row 2: Tax Type */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="edit-tax-type-label" shrink error={!!editErrors.tax_type}>
                  Tax Type<span style={{ color: '#C72030' }}>*</span>
                </InputLabel>
                <Select
                  labelId="edit-tax-type-label"
                  label="Tax Type*"
                  displayEmpty
                  notched
                  value={editForm.tax_type}
                  onChange={(e) => handleEditTaxTypeChange(e.target.value)}
                  error={!!editErrors.tax_type}
                >
                  <MenuItem value="" disabled>Select tax type</MenuItem>
                  {TAX_TYPE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
                {editErrors.tax_type && <p className="text-xs mt-1" style={{ color: '#DA7756' }}>{editErrors.tax_type}</p>}
              </FormControl>

              {/* Row 3: Section */}
              <FormControl fullWidth margin="normal" disabled={loadingSections || sections.length === 0}>
                <InputLabel id="edit-section-label" shrink error={!!editErrors.lock_account_tax_section_id}>
                  Section<span style={{ color: '#C72030' }}>*</span>
                </InputLabel>
                <Select
                  labelId="edit-section-label"
                  label="Section*"
                  displayEmpty
                  notched
                  value={editForm.lock_account_tax_section_id}
                  onChange={(e) => {
                    setEditForm((s) => ({ ...s, lock_account_tax_section_id: e.target.value }));
                    setEditErrors((s) => ({ ...s, lock_account_tax_section_id: undefined }));
                  }}
                  error={!!editErrors.lock_account_tax_section_id}
                >
                  <MenuItem value="" disabled>{loadingSections ? 'Loading sections...' : 'Select a Tax Type.'}</MenuItem>
                  {sections.map((sec) => (
                    <MenuItem key={sec.id} value={sec.id.toString()}>{sec.name}</MenuItem>
                  ))}
                </Select>
                {editErrors.lock_account_tax_section_id && (
                  <p className="text-xs mt-1" style={{ color: '#DA7756' }}>{editErrors.lock_account_tax_section_id}</p>
                )}
              </FormControl>

              {/* Info Box */}
              <div className="bg-brand-light border border-brand/20 rounded-md p-3 text-sm text-brand mt-2">
                <span className="font-semibold">ℹ</span> By default, {editForm.tax_type.toUpperCase()} will be tracked under {editForm.tax_type === 'tds' ? 'TDS Payable and TDS Receivable' : 'TCS Payable and TCS Receivable'} accounts.
              </div>

              {/* Higher Rate Checkbox */}
              <div className="flex items-center gap-2 mt-3">
                <Checkbox
                  id="edit-higher-rate"
                  checked={editForm.higher_rate}
                  onCheckedChange={(checked) => {
                    setEditForm((s) => ({ ...s, higher_rate: !!checked }));
                    if (!checked) setEditErrors((s) => ({ ...s, diff_rate_reason: undefined }));
                  }}
                />
                <label htmlFor="edit-higher-rate" className="text-sm cursor-pointer">
                  This is a Higher {editForm.tax_type.toUpperCase()} Rate
                </label>
              </div>

              {/* Reason for Higher Rate (appears when checkbox is checked) */}
              {editForm.higher_rate && (
                <TextField
                  fullWidth
                  margin="normal"
                  label={<span>Reason for Higher {editForm.tax_type.toUpperCase()} Rate<span style={{ color: '#C72030' }}>*</span></span>}
                  name="diff_rate_reason"
                  placeholder="Enter reason"
                  InputLabelProps={{ shrink: true }}
                  value={editForm.diff_rate_reason}
                  onChange={(e) => {
                    setEditForm((s) => ({ ...s, diff_rate_reason: e.target.value }));
                    if (e.target.value.trim()) setEditErrors((s) => ({ ...s, diff_rate_reason: undefined }));
                  }}
                  error={!!editErrors.diff_rate_reason}
                  helperText={editErrors.diff_rate_reason}
                />
              )}

              {/* Applicable Period */}
              <p className="text-sm font-semibold mt-3 mb-1">Applicable Period</p>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  margin="normal"
                  type="date"
                  label={<span>Start Date<span style={{ color: '#C72030' }}>*</span></span>}
                  name="start_date"
                  InputLabelProps={{ shrink: true }}
                  value={editForm.start_date}
                  onChange={(e) => {
                    setEditForm((s) => ({ ...s, start_date: e.target.value }));
                    if (e.target.value) setEditErrors((s) => ({ ...s, start_date: undefined }));
                  }}
                  error={!!editErrors.start_date}
                  helperText={editErrors.start_date}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  type="date"
                  label={<span>End Date<span style={{ color: '#C72030' }}>*</span></span>}
                  name="end_date"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: editForm.start_date || undefined }}
                  value={editForm.end_date}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (editForm.start_date && val && val < editForm.start_date) {
                      setEditForm((s) => ({ ...s, end_date: '' }));
                      setEditErrors((s) => ({ ...s, end_date: 'End Date must be on or after Start Date' }));
                    } else {
                      setEditForm((s) => ({ ...s, end_date: val }));
                      if (val) setEditErrors((s) => ({ ...s, end_date: undefined }));
                    }
                  }}
                  error={!!editErrors.end_date}
                  helperText={editErrors.end_date}
                />
              </div>

              <div className="mt-4 pt-5 flex justify-center gap-3">
                <Button
                  type="button"
                  onClick={handleEditTax}
                  disabled={editSubmitting}
                  style={{ backgroundColor: "#C72030" }}
                  className="text-white hover:bg-[#C72030]/90 min-w-[100px]"
                >
                  {editSubmitting ? 'Updating...' : 'Update'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditErrors({});
                    setEditForm({
                      id: 0,
                      name: '',
                      percentage: '',
                      tax_type: '',
                      higher_rate: false,
                      diff_rate_reason: '',
                      start_date: '',
                      end_date: '',
                      lock_account_tax_section_id: '',
                    });
                    setSections([]);
                  }}
                  disabled={editSubmitting}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxSetupMaster;
