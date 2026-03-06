import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_CONFIG } from '@/config/apiConfig';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Section {
  id: number;
  name: string;
  tax_type: string;
  group_name: string | null;
  active: boolean;
}

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
  { key: 'name', label: 'Section Name', sortable: true, hideable: true, draggable: true },
  { key: 'tax_type', label: 'Tax Type', sortable: true, hideable: true, draggable: true },
  { key: 'group_name', label: 'Group Name', sortable: true, hideable: true, draggable: true },
];

const TAX_TYPE_OPTIONS = [
  { value: 'tds', label: 'TDS' },
  { value: 'tcs', label: 'TCS' },
];

export const SectionMaster: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  // Add modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', tax_type: 'tds', group_name: '' });
  const [addErrors, setAddErrors] = useState<{ name?: string; tax_type?: string; group_name?: string }>({});
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: 0, name: '', tax_type: 'tds', group_name: '' });
  const [editErrors, setEditErrors] = useState<{ name?: string; tax_type?: string; group_name?: string }>({});
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch all sections
  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const url = getFullUrl('/lock_account_tax_sections.json');
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Section[] = await response.json();
      setSections(data);
      setTotalRecords(data.length);
      setTotalPages(Math.ceil(data.length / perPage));
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to load sections');
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Paginated data slice
  const paginatedSections = sections.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Open edit modal and fetch by ID
  const handleOpenEdit = async (id: number) => {
    setEditModalOpen(true);
    setEditLoading(true);
    try {
      const url = getFullUrl(`/lock_account_tax_sections/${id}.json`);
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Section = await response.json();
      setEditForm({
        id: data.id,
        name: data.name,
        tax_type: data.tax_type || 'tds',
        group_name: data.group_name || '',
      });
    } catch (error) {
      console.error('Error fetching section by id:', error);
      toast.error('Failed to load section details');
      setEditModalOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  // Create section
  const handleAddSection = async () => {
    const errs: { name?: string; tax_type?: string; group_name?: string } = {};
    if (!addForm.name.trim()) errs.name = 'Name is required';
    if (!addForm.tax_type) errs.tax_type = 'Tax Type is required';
    if (!addForm.group_name.trim()) errs.group_name = 'Group Name is required';
    if (Object.keys(errs).length > 0) {
      setAddErrors(errs);
      return;
    }
    setAddErrors({});
    setAddSubmitting(true);
    try {
      const url = getFullUrl('/lock_account_tax_sections.json');
      const options = getAuthenticatedFetchOptions('POST', {
        lock_account_tax_section: {
          name: addForm.name,
          tax_type: addForm.tax_type,
          group_name: addForm.group_name,
        },
      });
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      toast.success('Section added successfully');
      setAddModalOpen(false);
      setAddForm({ name: '', tax_type: 'tds', group_name: '' });
      fetchSections();
    } catch (error) {
      console.error('Error creating section:', error);
      toast.error('Failed to add section');
    } finally {
      setAddSubmitting(false);
    }
  };

  // Update section
  const handleEditSection = async () => {
    const errs: { name?: string; tax_type?: string; group_name?: string } = {};
    if (!editForm.name.trim()) errs.name = 'Name is required';
    if (!editForm.tax_type) errs.tax_type = 'Tax Type is required';
    if (!editForm.group_name.trim()) errs.group_name = 'Group Name is required';
    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      return;
    }
    setEditErrors({});
    setEditSubmitting(true);
    try {
      const url = getFullUrl(`/lock_account_tax_sections/${editForm.id}.json`);
      const options = getAuthenticatedFetchOptions('PUT', {
        lock_account_tax_section: {
          name: editForm.name,
          tax_type: editForm.tax_type,
          group_name: editForm.group_name,
        },
      });
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      toast.success('Section updated successfully');
      setEditModalOpen(false);
      fetchSections();
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
    } finally {
      setEditSubmitting(false);
    }
  };

  const renderRow = (section: Section) => ({
    actions: (
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          title="Edit"
          onClick={() => handleOpenEdit(section.id)}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    ),
    name: <span>{section.name}</span>,
    tax_type: <span className="uppercase">{section.tax_type}</span>,
    group_name: <span>{section.group_name || '—'}</span>,
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sections </h1>
      </header>

      <EnhancedTaskTable
        data={paginatedSections}
        columns={columns}
        renderRow={renderRow}
        storageKey="section-master-dashboard-v1"
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
      <Dialog open={addModalOpen} onOpenChange={(open) => { setAddModalOpen(open); if (!open) { setAddErrors({}); setAddForm({ name: '', tax_type: 'tds', group_name: '' }); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="add-name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="add-name"
                value={addForm.name}
                onChange={(e) => { setAddForm((s) => ({ ...s, name: e.target.value })); if (e.target.value.trim()) setAddErrors((s) => ({ ...s, name: undefined })); }}
                placeholder="Enter section name"
                className={addErrors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {addErrors.name && <p className="text-xs text-red-500">{addErrors.name}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="add-tax-type">Tax Type <span className="text-red-500">*</span></Label>
              <Select
                value={addForm.tax_type}
                onValueChange={(val) => { setAddForm((s) => ({ ...s, tax_type: val })); setAddErrors((s) => ({ ...s, tax_type: undefined })); }}
              >
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
            <div className="space-y-1">
              <Label htmlFor="add-group-name">Group Name <span className="text-red-500">*</span></Label>
              <Input
                id="add-group-name"
                value={addForm.group_name}
                onChange={(e) => { setAddForm((s) => ({ ...s, group_name: e.target.value })); if (e.target.value.trim()) setAddErrors((s) => ({ ...s, group_name: undefined })); }}
                placeholder="Enter group name"
                className={addErrors.group_name ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {addErrors.group_name && <p className="text-xs text-red-500">{addErrors.group_name}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setAddModalOpen(false); setAddErrors({}); setAddForm({ name: '', tax_type: 'tds', group_name: '' }); }} disabled={addSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddSection} disabled={addSubmitting}>
              {addSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setEditErrors({}); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>
          {editLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label htmlFor="edit-name">Name <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => { setEditForm((s) => ({ ...s, name: e.target.value })); if (e.target.value.trim()) setEditErrors((s) => ({ ...s, name: undefined })); }}
                  placeholder="Enter section name"
                  className={editErrors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {editErrors.name && <p className="text-xs text-red-500">{editErrors.name}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-tax-type">Tax Type <span className="text-red-500">*</span></Label>
                <Select
                  value={editForm.tax_type}
                  onValueChange={(val) => { setEditForm((s) => ({ ...s, tax_type: val })); setEditErrors((s) => ({ ...s, tax_type: undefined })); }}
                >
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
              <div className="space-y-1">
                <Label htmlFor="edit-group-name">Group Name <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-group-name"
                  value={editForm.group_name}
                  onChange={(e) => { setEditForm((s) => ({ ...s, group_name: e.target.value })); if (e.target.value.trim()) setEditErrors((s) => ({ ...s, group_name: undefined })); }}
                  placeholder="Enter group name"
                  className={editErrors.group_name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {editErrors.group_name && <p className="text-xs text-red-500">{editErrors.group_name}</p>}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setEditModalOpen(false); setEditErrors({}); }} disabled={editSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditSection} disabled={editSubmitting || editLoading}>
              {editSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionMaster;
