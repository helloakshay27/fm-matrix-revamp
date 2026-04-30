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

interface House {
    id: number;
    name: string;
    floor_count: number;
}

const HouseSetupPage = () => {
    const [houses, setHouses] = useState<House[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHouse, setEditingHouse] = useState<House | null>(null);
    const [formData, setFormData] = useState({ name: '', floor_count: 0 });

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
            setFormData({ name: house.name, floor_count: house.floor_count });
        } else {
            setEditingHouse(null);
            setFormData({ name: '', floor_count: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingHouse(null);
        setFormData({ name: '', floor_count: 0 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!editingHouse;
        const url = isEditing
            ? `/houses/${editingHouse.id}`
            : `/houses`;

        try {
            const payload = {
                house: {
                    name: formData.name,
                    floor_count: Number(formData.floor_count)
                }
            };

            if (isEditing) {
                await api.put(url, payload);
            } else {
                await api.post(url, payload);
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
        { key: 'floor_count', label: 'Member Count', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false },
    ], []);

    const renderCell = (item: House, columnKey: string) => {
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
    )

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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingHouse ? 'Edit House' : 'Add House'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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
                        {/* <div className="space-y-2">
                            <Label htmlFor="floor_count">Floor Count</Label>
                            <Input
                                id="floor_count"
                                type="text"
                                value={formData.floor_count}
                                onChange={(e) => setFormData({ ...formData, floor_count: parseInt(e.target.value) || 0 })}
                                placeholder="Enter floor count"
                                required
                            />
                        </div> */}
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
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