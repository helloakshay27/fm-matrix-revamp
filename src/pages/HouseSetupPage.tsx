import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
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

interface House {
    id: number;
    name: string;
    attachments?: { id: number; url: string; filename: string }[];
}

const HouseSetupPage = () => {
    const [houses, setHouses] = useState<House[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHouse, setEditingHouse] = useState<House | null>(null);
    const [formData, setFormData] = useState({ name: '' });
    const [attachment, setAttachment] = useState<File | null>(null);
    const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';

    const api = useMemo(() => axios.create({
        baseURL: `https://${baseUrl}`,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }), [baseUrl, token]);

    const fetchHouses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/houses.json');
            const data = response.data;
            setHouses(Array.isArray(data) ? data : (data.houses || []));
        } catch (error: any) {
            console.error('Error fetching houses:', error);
            toast.error(error.response?.data?.message || error.message || 'Error fetching houses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (baseUrl && token) {
            fetchHouses();
        } else {
            toast.error('API configuration missing in storage');
        }
    }, [baseUrl, token]);

    const handleOpenModal = (house?: House) => {
        if (house) {
            setEditingHouse(house);
            setFormData({ name: house.name });
            if (house.attachments && house.attachments.length > 0) {
                setAttachmentPreview(house.attachments[0].url);
            }
        } else {
            setEditingHouse(null);
            setFormData({ name: '' });
            setAttachmentPreview(null);
        }
        setAttachment(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingHouse(null);
        setFormData({ name: '' });
        setAttachment(null);
        setAttachmentPreview(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachment(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachmentPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAttachment = () => {
        setAttachment(null);
        setAttachmentPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!editingHouse;
        const url = isEditing ? `/houses/${editingHouse.id}` : '/houses';

        try {
            const formDataPayload = new FormData();
            formDataPayload.append('house[name]', formData.name);
            if (attachment) {
                formDataPayload.append('house[attachments][]', attachment);
            }

            if (isEditing) {
                await api.put(url, formDataPayload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await api.post(url, formDataPayload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            toast.success(`House ${isEditing ? 'updated' : 'added'} successfully`);
            handleCloseModal();
            fetchHouses();
        } catch (error: any) {
            console.error('Error saving house:', error);
            toast.error(error.response?.data?.message || error.message || 'Error saving house');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this house?')) return;

        try {
            await api.delete(`/houses/${id}.json`);
            toast.success('House deleted successfully');
            fetchHouses();
        } catch (error: any) {
            console.error('Error deleting house:', error);
            toast.error(error.response?.data?.message || error.message || 'Error deleting house');
        }
    };

    const columns = useMemo(() => [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'icon', label: 'Icon', sortable: false },
        { key: 'actions', label: 'Actions', sortable: false },
    ], []);

    const renderCell = (item: House, columnKey: string) => {
        if (columnKey === 'icon') {
            const iconUrl = item.attachments?.[0]?.url;
            return iconUrl ? (
                <img src={iconUrl} alt={`${item.name} icon`} className="w-10 h-10 rounded object-cover border border-gray-200" />
            ) : (
                <span className="text-gray-400">--</span>
            );
        }
        if (columnKey === 'actions') {
            return (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            );
        }
        return (item as any)[columnKey] ?? '--';
    };

    const leftActions = (
        <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" />
            Add
        </Button>
    );

    return (
        <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
            <div className="overflow-x-auto">
                <EnhancedTable
                    data={houses}
                    columns={columns}
                    renderCell={renderCell}
                    hideTableExport={true}
                    leftActions={leftActions}
                    loading={loading}
                    searchPlaceholder="Search houses..."
                    storageKey="house-setup-table"
                    enableExport={true}
                    exportFileName="houses-list"
                />
            </div>

            <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                        <DialogTitle>{editingHouse ? 'Edit House' : 'Add House'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">House Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter house name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Icon</Label>
                            {attachmentPreview ? (
                                <div className="relative w-full border rounded-md p-2">
                                    <img
                                        src={attachmentPreview}
                                        alt="Icon preview"
                                        className="w-full h-40 object-contain rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveAttachment}
                                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                                >
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Click to upload icon</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                            <Button type="submit" className="bg-[#C72030] hover:bg-[#A01020] text-white">
                                {editingHouse ? 'Update' : 'Add'} House
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HouseSetupPage;
