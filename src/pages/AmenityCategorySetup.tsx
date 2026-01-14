import { useEffect, useState } from 'react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit } from 'lucide-react';
import { AmenityCategoryModal } from '@/components/AmenityCategoryModal';
import axios from 'axios';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AmenityCategory {
    id: number;
    name: string;
    description: string;
    active: boolean;
    fac_type: string;
    cover_image_url?: string;
    icon_dark_url?: string;
}

const AmenityCategorySetup = () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    const [categories, setCategories] = useState<AmenityCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<AmenityCategory | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<AmenityCategory | null>(null);

    const columns: ColumnConfig[] = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
        },
        {
            key: 'description',
            label: 'Description',
            sortable: true,
        },
        {
            key: 'fac_type',
            label: 'Type',
            sortable: true,
        },
        {
            key: 'active',
            label: 'Status',
            sortable: true,
        },
    ];

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/facility_categories.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setCategories(response.data || []);
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            toast.error(error.response?.data?.error || 'Failed to fetch categories');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddClick = () => {
        setIsEditing(false);
        setSelectedRecord(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (record: AmenityCategory) => {
        setIsEditing(true);
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (record: AmenityCategory) => {
        setCategoryToDelete(record);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;

        try {
            await axios.delete(
                `https://${baseUrl}/pms/admin/facility_categories/${categoryToDelete.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Amenity Category deleted successfully');
            fetchCategories();
        } catch (error: any) {
            console.error('Error deleting category:', error);
            toast.error(error.response?.data?.error || 'Failed to delete category');
        } finally {
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
        }
    };

    const renderCell = (item: AmenityCategory, columnKey: string) => {
        switch (columnKey) {
            case 'active':
                return (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${item.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {item.active ? 'Active' : 'Inactive'}
                    </span>
                );
            case 'fac_type':
                return (
                    <span className="capitalize">
                        {item.fac_type || '-'}
                    </span>
                );
            case 'description':
                return (
                    <span className="line-clamp-2 max-w-[200px] truncate" title={item.description}>
                        {item.description || '-'}
                    </span>
                );
            default:
                return item[columnKey as keyof AmenityCategory];
        }
    };

    const renderActions = (item: AmenityCategory) => {
        return (
            <div className="flex items-center justify-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(item)}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    title="Edit"
                >
                    <Edit className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(item)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        );
    };

    return (
        <div className="p-6 bg-white">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Amenity Category Setup</h1>
                <p className="text-gray-600 mt-1">Manage amenity categories for your facilities</p>
            </div>

            <EnhancedTable
                data={categories}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                loading={loading}
                pagination={true}
                pageSize={10}
                storageKey="amenity-categories-table"
                leftActions={
                    <Button
                        onClick={handleAddClick}
                        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Category
                    </Button>
                }
            />

            <AmenityCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fetchData={fetchCategories}
                isEditing={isEditing}
                record={selectedRecord}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the category "{categoryToDelete?.name}".
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AmenityCategorySetup;