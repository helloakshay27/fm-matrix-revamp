import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  // Fetch all taxes
  const fetchTaxes = useCallback(async () => {
    setLoading(true);
    try {
      const url = getFullUrl('/lock_account_taxes.json?lock_account_id=1');
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
    if (!form.percentage || parseFloat(form.percentage) < 0) errs.percentage = 'Valid Rate (%) is required';
    if (!form.tax_type) errs.tax_type = 'Tax Type is required';
    if (!form.lock_account_tax_section_id) errs.lock_account_tax_section_id = 'Section is required';
    if (!form.start_date) errs.start_date = 'Start Date is required';
    if (!form.end_date) errs.end_date = 'End Date is required';
    if (form.higher_rate && !form.diff_rate_reason.trim()) errs.diff_rate_reason = 'Reason for Higher Rate is required';
    return errs;
  };

  // Create tax
  const handleAddTax = async () => {
    const errs = validateForm(addForm);
    if (Object.keys(errs).length > 0) {
      setAddErrors(errs);
      return;
    }
    setAddErrors({});
    setAddSubmitting(true);
    try {
      const url = getFullUrl('/lock_account_taxes.json?lock_account_id=1');
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
    <div className="p-6 space-y-6">
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
            <Plus className="w-4 h-4 mr-2" /> Add
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
        onOpenChange={(open) => {
          setAddModalOpen(open);
          if (!open) {
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
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New {addForm.tax_type.toUpperCase()}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            {/* Row 1: Tax Name and Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="add-name">Tax Name <span className="text-red-500">*</span></Label>
                <Input
                  id="add-name"
                  value={addForm.name}
                  onChange={(e) => {
                    setAddForm((s) => ({ ...s, name: e.target.value }));
                    if (e.target.value.trim()) setAddErrors((s) => ({ ...s, name: undefined }));
                  }}
                  placeholder="Enter tax name"
                  className={addErrors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {addErrors.name && <p className="text-xs text-red-500">{addErrors.name}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="add-percentage">Rate (%) <span className="text-red-500">*</span></Label>
                <Input
                  id="add-percentage"
                  type="number"
                  value={addForm.percentage}
                  onChange={(e) => {
                    setAddForm((s) => ({ ...s, percentage: e.target.value }));
                    if (e.target.value) setAddErrors((s) => ({ ...s, percentage: undefined }));
                  }}
                  placeholder="Enter tax rate"
                  className={addErrors.percentage ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  step="0.01"
                />
                {addErrors.percentage && <p className="text-xs text-red-500">{addErrors.percentage}</p>}
              </div>
            </div>

            {/* Row 2: Tax Type */}
            <div className="space-y-1">
              <Label htmlFor="add-tax-type">Tax Type <span className="text-red-500">*</span></Label>
              <Select value={addForm.tax_type} onValueChange={handleAddTaxTypeChange}>
                <SelectTrigger id="add-tax-type" className={addErrors.tax_type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select tax type" />
                </SelectTrigger>
                <SelectContent>
                  {TAX_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {addErrors.tax_type && <p className="text-xs text-red-500">{addErrors.tax_type}</p>}
            </div>

            {/* Row 3: Section */}
            <div className="space-y-1">
              <Label htmlFor="add-section">Section <span className="text-red-500">*</span></Label>
              <Select
                value={addForm.lock_account_tax_section_id}
                onValueChange={(value) => {
                  setAddForm((s) => ({ ...s, lock_account_tax_section_id: value }));
                  setAddErrors((s) => ({ ...s, lock_account_tax_section_id: undefined }));
                }}
                disabled={loadingSections || sections.length === 0}
              >
                <SelectTrigger
                  id="add-section"
                  className={addErrors.lock_account_tax_section_id ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder={loadingSections ? 'Loading sections...' : 'Select a Tax Type.'} />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((sec) => (
                    <SelectItem key={sec.id} value={sec.id.toString()}>
                      {sec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {addErrors.lock_account_tax_section_id && (
                <p className="text-xs text-red-500">{addErrors.lock_account_tax_section_id}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
              <span className="font-semibold">ℹ</span> By default, {addForm.tax_type.toUpperCase()} will be tracked under {addForm.tax_type === 'tds' ? 'TDS Payable and TDS Receivable' : 'TCS Payable and TCS Receivable'} accounts.
            </div>

            {/* Higher Rate Checkbox */}
            <div className="flex items-center gap-2">
              <input
                id="add-higher-rate"
                type="checkbox"
                checked={addForm.higher_rate}
                onChange={(e) => {
                  setAddForm((s) => ({ ...s, higher_rate: e.target.checked }));
                  if (!e.target.checked) setAddErrors((s) => ({ ...s, diff_rate_reason: undefined }));
                }}
                className="w-4 h-4"
                aria-label="This is a Higher Tax Rate"
              />
              <Label htmlFor="add-higher-rate" className="cursor-pointer">
                This is a Higher {addForm.tax_type.toUpperCase()} Rate
              </Label>
            </div>

            {/* Reason for Higher Rate (appears when checkbox is checked) */}
            {addForm.higher_rate && (
              <div className="space-y-1">
                <Label htmlFor="add-reason">Reason for Higher {addForm.tax_type.toUpperCase()} Rate <span className="text-red-500">*</span></Label>
                <Input
                  id="add-reason"
                  value={addForm.diff_rate_reason}
                  onChange={(e) => {
                    setAddForm((s) => ({ ...s, diff_rate_reason: e.target.value }));
                    if (e.target.value.trim()) setAddErrors((s) => ({ ...s, diff_rate_reason: undefined }));
                  }}
                  placeholder="Enter reason"
                  className={addErrors.diff_rate_reason ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {addErrors.diff_rate_reason && <p className="text-xs text-red-500">{addErrors.diff_rate_reason}</p>}
              </div>
            )}

            {/* Applicable Period */}
            <div>
              <Label className="text-sm font-semibold">Applicable Period</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-1">
                  <Label htmlFor="add-start-date">Start Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="add-start-date"
                    type="date"
                    value={addForm.start_date}
                    onChange={(e) => {
                      setAddForm((s) => ({ ...s, start_date: e.target.value }));
                      if (e.target.value) setAddErrors((s) => ({ ...s, start_date: undefined }));
                    }}
                    className={addErrors.start_date ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {addErrors.start_date && <p className="text-xs text-red-500">{addErrors.start_date}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="add-end-date">End Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="add-end-date"
                    type="date"
                    value={addForm.end_date}
                    onChange={(e) => {
                      setAddForm((s) => ({ ...s, end_date: e.target.value }));
                      if (e.target.value) setAddErrors((s) => ({ ...s, end_date: undefined }));
                    }}
                    className={addErrors.end_date ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {addErrors.end_date && <p className="text-xs text-red-500">{addErrors.end_date}</p>}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
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
            >
              Cancel
            </Button>
            <Button onClick={handleAddTax} disabled={addSubmitting}>
              {addSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) {
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
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit {editForm.tax_type.toUpperCase()}</DialogTitle>
          </DialogHeader>
          {editLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
              {/* Row 1: Tax Name and Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="edit-name">Tax Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => {
                      setEditForm((s) => ({ ...s, name: e.target.value }));
                      if (e.target.value.trim()) setEditErrors((s) => ({ ...s, name: undefined }));
                    }}
                    placeholder="Enter tax name"
                    className={editErrors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {editErrors.name && <p className="text-xs text-red-500">{editErrors.name}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-percentage">Rate (%) <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-percentage"
                    type="number"
                    value={editForm.percentage}
                    onChange={(e) => {
                      setEditForm((s) => ({ ...s, percentage: e.target.value }));
                      if (e.target.value) setEditErrors((s) => ({ ...s, percentage: undefined }));
                    }}
                    placeholder="Enter tax rate"
                    className={editErrors.percentage ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    step="0.01"
                  />
                  {editErrors.percentage && <p className="text-xs text-red-500">{editErrors.percentage}</p>}
                </div>
              </div>

              {/* Row 2: Tax Type */}
              <div className="space-y-1">
                <Label htmlFor="edit-tax-type">Tax Type <span className="text-red-500">*</span></Label>
                <Select value={editForm.tax_type} onValueChange={handleEditTaxTypeChange}>
                  <SelectTrigger id="edit-tax-type" className={editErrors.tax_type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAX_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editErrors.tax_type && <p className="text-xs text-red-500">{editErrors.tax_type}</p>}
              </div>

              {/* Row 3: Section */}
              <div className="space-y-1">
                <Label htmlFor="edit-section">Section <span className="text-red-500">*</span></Label>
                <Select
                  value={editForm.lock_account_tax_section_id}
                  onValueChange={(value) => {
                    setEditForm((s) => ({ ...s, lock_account_tax_section_id: value }));
                    setEditErrors((s) => ({ ...s, lock_account_tax_section_id: undefined }));
                  }}
                  disabled={loadingSections || sections.length === 0}
                >
                  <SelectTrigger
                    id="edit-section"
                    className={editErrors.lock_account_tax_section_id ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder={loadingSections ? 'Loading sections...' : 'Select a Tax Type.'} />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((sec) => (
                      <SelectItem key={sec.id} value={sec.id.toString()}>
                        {sec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editErrors.lock_account_tax_section_id && (
                  <p className="text-xs text-red-500">{editErrors.lock_account_tax_section_id}</p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
                <span className="font-semibold">ℹ</span> By default, {editForm.tax_type.toUpperCase()} will be tracked under {editForm.tax_type === 'tds' ? 'TDS Payable and TDS Receivable' : 'TCS Payable and TCS Receivable'} accounts.
              </div>

              {/* Higher Rate Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="edit-higher-rate"
                  type="checkbox"
                  checked={editForm.higher_rate}
                  onChange={(e) => {
                    setEditForm((s) => ({ ...s, higher_rate: e.target.checked }));
                    if (!e.target.checked) setEditErrors((s) => ({ ...s, diff_rate_reason: undefined }));
                  }}
                  className="w-4 h-4"
                  aria-label="This is a Higher Tax Rate"
                />
                <Label htmlFor="edit-higher-rate" className="cursor-pointer">
                  This is a Higher {editForm.tax_type.toUpperCase()} Rate
                </Label>
              </div>

              {/* Reason for Higher Rate (appears when checkbox is checked) */}
              {editForm.higher_rate && (
                <div className="space-y-1">
                  <Label htmlFor="edit-reason">Reason for Higher {editForm.tax_type.toUpperCase()} Rate <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-reason"
                    value={editForm.diff_rate_reason}
                    onChange={(e) => {
                      setEditForm((s) => ({ ...s, diff_rate_reason: e.target.value }));
                      if (e.target.value.trim()) setEditErrors((s) => ({ ...s, diff_rate_reason: undefined }));
                    }}
                    placeholder="Enter reason"
                    className={editErrors.diff_rate_reason ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {editErrors.diff_rate_reason && <p className="text-xs text-red-500">{editErrors.diff_rate_reason}</p>}
                </div>
              )}

              {/* Applicable Period */}
              <div>
                <Label className="text-sm font-semibold">Applicable Period</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1">
                    <Label htmlFor="edit-start-date">Start Date <span className="text-red-500">*</span></Label>
                    <Input
                      id="edit-start-date"
                      type="date"
                      value={editForm.start_date}
                      onChange={(e) => {
                        setEditForm((s) => ({ ...s, start_date: e.target.value }));
                        if (e.target.value) setEditErrors((s) => ({ ...s, start_date: undefined }));
                      }}
                      className={editErrors.start_date ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {editErrors.start_date && <p className="text-xs text-red-500">{editErrors.start_date}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-end-date">End Date <span className="text-red-500">*</span></Label>
                    <Input
                      id="edit-end-date"
                      type="date"
                      value={editForm.end_date}
                      onChange={(e) => {
                        setEditForm((s) => ({ ...s, end_date: e.target.value }));
                        if (e.target.value) setEditErrors((s) => ({ ...s, end_date: undefined }));
                      }}
                      className={editErrors.end_date ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {editErrors.end_date && <p className="text-xs text-red-500">{editErrors.end_date}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="ghost"
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
            >
              Cancel
            </Button>
            <Button onClick={handleEditTax} disabled={editSubmitting || editLoading}>
              {editSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxSetupMaster;
