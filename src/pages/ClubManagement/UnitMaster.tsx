import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogContent, TextField } from '@mui/material';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import axios from 'axios';

interface Uom {
    id: number;
    name: string;
    short_name: string;
    active: boolean;
}

const columns: ColumnConfig[] = [
    { key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false },
    { key: 'sr_no', label: 'Sr No', sortable: false, hideable: false, draggable: false },
    { key: 'name', label: 'UOM Name', sortable: true, hideable: true, draggable: true },
    { key: 'short_name', label: 'UOM Short Name', sortable: true, hideable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: false, hideable: true, draggable: true },
];

const emptyForm = { name: '', short_name: '' };

const UnitMaster: React.FC = () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const lock_account_id = localStorage.getItem('lock_account_id');

    const [uoms, setUoms] = useState<Uom[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDeleteUom, setSelectedDeleteUom] = useState<Uom | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const headers = { Authorization: `Bearer ${token}` };

    const fetchUoms = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `https://${baseUrl}/erp_uoms.json?lock_account_id=${lock_account_id}`,
                { headers }
            );
            const data = Array.isArray(res.data) ? res.data : (res.data?.erp_uoms || res.data?.data || []);
            setUoms(data);
        } catch {
            toast.error('Failed to load UOMs');
        } finally {
            setLoading(false);
        }
    }, [baseUrl, token, lock_account_id]);

    useEffect(() => {
        fetchUoms();
    }, [fetchUoms]);

    const validate = () => {
        if (!form.name.trim()) { toast.error('UOM Name is required'); return false; }
        if (!form.short_name.trim()) { toast.error('UOM Short Name is required'); return false; }
        return true;
    };

    const handleAdd = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            await axios.post(
                `https://${baseUrl}/erp_uoms.json?lock_account_id=${lock_account_id}`,
                { erp_uom: { name: form.name, short_name: form.short_name } },
                { headers }
            );
            toast.success('UOM created successfully');
            setAddOpen(false);
            setForm(emptyForm);
            fetchUoms();
        } catch {
            toast.error('Failed to create UOM');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            await axios.patch(
                `https://${baseUrl}/erp_uoms/${editId}.json?lock_account_id=${lock_account_id}`,
                { erp_uom: { name: form.name, short_name: form.short_name } },
                { headers }
            );
            toast.success('UOM updated successfully');
            setEditOpen(false);
            setForm(emptyForm);
            setEditId(null);
            fetchUoms();
        } catch {
            toast.error('Failed to update UOM');
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteDialog = (uom: Uom) => {
        setSelectedDeleteUom(uom);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedDeleteUom) return;
        setDeleteLoading(true);
        try {
            await axios.delete(
                `https://${baseUrl}/erp_uoms/${selectedDeleteUom.id}.json?lock_account_id=${lock_account_id}`,
                { headers }
            );
            toast.success('UOM deleted successfully');
            setDeleteDialogOpen(false);
            setSelectedDeleteUom(null);
            fetchUoms();
        } catch {
            toast.error('Failed to delete UOM');
        } finally {
            setDeleteLoading(false);
        }
    };

    const openEdit = (uom: Uom) => {
        setEditId(uom.id);
        setForm({ name: uom.name, short_name: uom.short_name });
        setEditOpen(true);
    };

    const handleToggleStatus = async (uom: Uom) => {
        try {
            await axios.patch(
                `https://${baseUrl}/erp_uoms/${uom.id}/toggle_active.json?lock_account_id=${lock_account_id}`,
                null,
                { headers }
            );
            toast.success('Status updated successfully');
            fetchUoms();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const renderRow = (uom: Uom, index: number) => ({
        actions: (
            <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={() => openEdit(uom)} title="Edit">
                    <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => openDeleteDialog(uom)} title="Delete">
                    <Trash2 className="w-4 h-4 " />
                </Button>
            </div>
        ),
        sr_no: <span>{index + 1}</span>,
        name: <span>{uom.name}</span>,
        short_name: <span>{uom.short_name}</span>,
        status: (
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => handleToggleStatus(uom)}
                    className={`status-toggle relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${uom.active ? 'bg-brand' : 'bg-gray-300'}`}
                >
                    <span
                        className={`status-toggle-thumb inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${uom.active ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </button>
            </div>
        ),
    });

    const modalFields = (
        <>
            <style>{`
                .uom-modal-form .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
                    border-color: #DA7756 !important;
                }
                .uom-modal-form .MuiInputLabel-root.Mui-focused {
                    color: #DA7756 !important;
                }
            `}</style>
            <div className="uom-modal-form space-y-4 pt-2">
                <TextField
                    fullWidth
                    margin="normal"
                    label={<span>UOM Name<span style={{ color: '#C72030' }}>*</span></span>}
                    placeholder="Enter UOM name"
                    InputLabelProps={{ shrink: true }}
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label={<span>UOM Short Name<span style={{ color: '#C72030' }}>*</span></span>}
                    placeholder="Enter short name"
                    InputLabelProps={{ shrink: true }}
                    value={form.short_name}
                    onChange={(e) => setForm((p) => ({ ...p, short_name: e.target.value }))}
                />
            </div>
        </>
    );

    return (
        <div className="p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Unit of Measurement</h1>
            </header>

            <EnhancedTaskTable
                data={uoms}
                columns={columns}
                renderRow={renderRow}
                storageKey="unit-master-v1"
                hideTableExport
                enableSearch
                loading={loading}
                leftActions={
                    <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => { setForm(emptyForm); setAddOpen(true); }}
                    >
                        <Plus className="w-4 h-4 mr-2 !text-white" />
                        <span className="!text-white">Add</span>
                    </Button>
                }
            />

            {/* Add Modal */}
            <Dialog open={addOpen} onClose={() => { setAddOpen(false); setForm(emptyForm); }} fullWidth maxWidth="sm">
                <div className="flex items-center justify-between px-6 pt-6">
                    <h5 className="text-lg font-semibold">UOM Master</h5>
                </div>
                <DialogContent>
                    {modalFields}
                    <div className="mt-4 pt-5 flex justify-center gap-3">
                        <Button onClick={handleAdd} disabled={submitting}
                            style={{ backgroundColor: "#C72030" }}
                            className="text-white hover:bg-[#C72030]/90 min-w-[100px]">
                            {submitting ? 'Creating...' : 'Add'}
                        </Button>
                        <Button variant="outline" onClick={() => setAddOpen(false)} className="min-w-[100px]">Cancel</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
                setDeleteDialogOpen(open);
                if (!open) setSelectedDeleteUom(null);
            }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete UOM</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedDeleteUom?.name ?? 'this UOM'}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={deleteLoading}
                            style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none' }}
                        >
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Modal */}
            <Dialog open={editOpen} onClose={() => { setEditOpen(false); setForm(emptyForm); setEditId(null); }} fullWidth maxWidth="sm">
                <div className="flex items-center justify-between px-6 pt-6">
                    <h5 className="text-lg font-semibold">Edit UOM</h5>
                </div>
                <DialogContent>
                    {modalFields}
                    <div className="mt-4 pt-5 flex justify-center gap-3">
                        <Button onClick={handleUpdate} disabled={submitting}
                            style={{ backgroundColor: "#C72030" }}
                            className="text-white hover:bg-[#C72030]/90 min-w-[100px]">
                            {submitting ? 'Updating...' : 'Update'}
                        </Button>
                        <Button variant="outline" onClick={() => setEditOpen(false)} className="min-w-[100px]">Cancel</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UnitMaster;
export { UnitMaster };
