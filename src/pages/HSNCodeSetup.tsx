import React, { useEffect, useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HSNCode {
    id: number;
    code: string;
    category: string;
}

const HSNCodeSetup = () => {
    const [hsnCodes, setHsnCodes] = useState<HSNCode[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHsn, setEditingHsn] = useState<HSNCode | null>(null);
    const [formData, setFormData] = useState({ code: '' });

    // Get config from localStorage
    const baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';

    const api = useMemo(() => axios.create({
        baseURL: `https://${baseUrl}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }), [baseUrl, token]);

    const getErrorMessage = (error: any): string => {
        // Check for structured field errors
        if (error.response?.data && typeof error.response.data === 'object') {
            const errorData = error.response.data;

            // Handle simple message field
            if (errorData.message && typeof errorData.message === 'string') {
                return errorData.message;
            }

            // Handle structured field errors
            const errorMessages: string[] = [];
            Object.entries(errorData).forEach(([field, messages]: [string, any]) => {
                if (Array.isArray(messages)) {
                    messages.forEach((msg: string) => {
                        // Format: "field: error message"
                        const fieldName = field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.replace(/_/g, ' ').slice(1);
                        errorMessages.push(`${fieldName}: ${msg}`);
                    });
                } else if (typeof messages === 'string') {
                    const fieldName = field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.replace(/_/g, ' ').slice(1);
                    errorMessages.push(`${fieldName}: ${messages}`);
                }
            });

            if (errorMessages.length > 0) {
                return errorMessages.join(', ');
            }
        }

        // Fallback to standard error message
        return error.message || 'Error saving HSN code';
    };

    const fetchHsnCodes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/pms/hsns/get_hsns.json');
            const data = response.data;
            setHsnCodes(Array.isArray(data) ? data : (data.pms_hsns || []));
        } catch (error: any) {
            console.error('Error fetching HSN codes:', error);
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (baseUrl && token) {
            fetchHsnCodes();
        } else {
            toast.error('API configuration missing in storage');
        }
    }, [baseUrl, token]);

    const handleOpenModal = (hsn?: HSNCode) => {
        if (hsn) {
            setEditingHsn(hsn);
            setFormData({ code: hsn.code });
        } else {
            setEditingHsn(null);
            setFormData({ code: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingHsn(null);
        setFormData({ code: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!editingHsn;
        const url = isEditing
            ? `/pms/hsns/${editingHsn.id}.json`
            : `/pms/hsns.json`;

        try {
            const payload = {
                pms_hsn: {
                    code: formData.code,
                    category: "Site"
                }
            };

            if (isEditing) {
                await api.put(url, payload);
            } else {
                await api.post(url, payload);
            }

            toast.success(`HSN code ${isEditing ? 'updated' : 'added'} successfully`);
            handleCloseModal();
            fetchHsnCodes();
        } catch (error: any) {
            console.error('Error saving HSN code:', error);
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this HSN code?')) return;

        try {
            await api.delete(`/pms/hsns/${id}.json`);
            toast.success('HSN code deleted successfully');
            fetchHsnCodes();
        } catch (error: any) {
            console.error('Error deleting HSN code:', error);
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        }
    };

    const columns = useMemo(() => [
        { key: 'actions', label: 'Actions', sortable: false },
        { key: 'id', label: 'ID', sortable: true },
        { key: 'code', label: 'Code', sortable: true },
        { key: 'category', label: 'Category', sortable: true },
    ], []);

    const renderCell = (item: HSNCode, columnKey: string) => {
        if (columnKey === 'actions') {
            return (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    {/* <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button> */}
                </div>
            );
        }
        return (item as any)[columnKey] ?? '--';
    };

    const leftActions = (
        <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" />
            Add HSN Code
        </Button>
    )

    return (
        <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
            <div className="overflow-x-auto">
                <EnhancedTable
                    data={hsnCodes}
                    columns={columns}
                    renderCell={renderCell}
                    hideTableExport={true}
                    leftActions={leftActions}
                    loading={loading}
                    searchPlaceholder="Search HSN codes..."
                    storageKey="hsn-code-setup-table"
                    enableExport={true}
                    exportFileName="hsn-codes-list"
                />
            </div>

            <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingHsn ? 'Edit HSN Code' : 'Add HSN Code'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">HSN Code</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="Enter HSN code"
                                required
                            />
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                                {editingHsn ? 'Update' : 'Add'} HSN Code
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HSNCodeSetup;
