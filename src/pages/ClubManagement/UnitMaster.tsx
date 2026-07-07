import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
                    <Trash2 className="w-4 h-4 text-red-500" />
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
                    className={`relative inline-flex h-6 w-11 items-center rounded-full !rounded-full transition-colors ${uom.active ? 'bg-red-500' : 'bg-gray-300'}`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full !rounded-full bg-white transition-transform ${uom.active ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </button>

                <span
                    className={`text-sm font-medium ${uom.active ? 'text-red-600' : 'text-red-600'}`}
                >
                    {/* {uom.active ? 'Active' : 'Inactive'} */}
                </span>
            </div>
        ),
    });

    const modalFields = (
        <div className="space-y-4 pt-2">
            <div>
                <Label>UOM Name <span className="text-red-500">*</span></Label>
                <Input
                    className="mt-1 rounded-none"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Enter UOM name"
                />
            </div>
            <div>
                <Label>UOM Short Name <span className="text-red-500">*</span></Label>
                <Input
                    className="mt-1 rounded-none"
                    value={form.short_name}
                    onChange={(e) => setForm((p) => ({ ...p, short_name: e.target.value }))}
                    placeholder="Enter short name"
                />
            </div>
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Unit of Measurement</h1>
            </header>

            <div className="[&_*]:!rounded-none [&_.rounded-lg]:!rounded-none [&_.rounded-md]:!rounded-none [&_.rounded]:!rounded-none">
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
            </div>

            {/* Add Modal */}
            <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) setForm(emptyForm); }}>
                <DialogContent className="rounded-none border border-gray-300">
                    <DialogHeader>
                        <DialogTitle>UOM Master</DialogTitle>
                    </DialogHeader>
                    {modalFields}
                    <div className="flex justify-center gap-3 mt-4">
                        <Button onClick={handleAdd} disabled={submitting}
                            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white">
                            {submitting ? 'Creating...' : 'Add'}
                        </Button>
                        <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
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
            <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) { setForm(emptyForm); setEditId(null); } }}>
                <DialogContent className="rounded-none border border-gray-300">
                    <DialogHeader>
                        <DialogTitle>Edit UOM</DialogTitle>
                    </DialogHeader>
                    {modalFields}
                    <div className="flex justify-center gap-3 mt-4">
                        <Button onClick={handleUpdate} disabled={submitting}
                            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white">
                            {submitting ? 'Updating...' : 'Update'}
                        </Button>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UnitMaster;
export { UnitMaster };
