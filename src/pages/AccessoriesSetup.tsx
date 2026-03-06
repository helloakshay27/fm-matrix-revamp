import AddAccessoriesModal from '@/components/AddAccessoriesModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable'
import { Button } from '@/components/ui/button';
import { ColumnConfig } from '@/hooks/useEnhancedTable'
import axios from 'axios';
import { Eye, Pencil, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fa } from 'zod/v4/locales';

import { Radio, RadioGroup, FormControlLabel } from '@mui/material';

const columns: ColumnConfig[] = [
    {
        key: 'id',
        label: 'ID',
        sortable: true,
        draggable: true,
    },
    {
        key: 'name',
        label: 'Plan Name',
        sortable: true,
        draggable: true,
    },
    {
        key: 'quantity',
        label: 'Quantity',
        sortable: true,
        draggable: true,
    },
    {
        key: 'unit',
        label: 'Unit',
        sortable: true,
        draggable: true,
    },
    {
        key: 'cost',
        label: 'Cost',
        sortable: true,
        draggable: true,
    },
    {
        key: 'status',
        label: 'Status',
        sortable: false,
        draggable: true,
    },
]

const AccessoriesSetup = () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAccessory, setEditingAccessory] = useState(null);
    const [accessories, setAccessories] = useState([]);

    const fetchAccessories = async () => {
        try {
            const reseponse = await axios.get(`https://${baseUrl}/pms/inventories.json`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setAccessories(reseponse.data.inventories);
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddOpen = () => {
        setEditingAccessory(null);
        setIsAddModalOpen(true);
    }

    const handleEditOpen = (accessory) => {
        setEditingAccessory(accessory);
        setIsAddModalOpen(true);
    }

    const handleModalClose = () => {
        setIsAddModalOpen(false);
        setEditingAccessory(null);
        fetchAccessories();
    }

    useEffect(() => {
        fetchAccessories();
    }, []);

    const handleStatusToggle = async (id) => {
        setAccessories(prev => prev.map(acc =>
            acc.id === id ? { ...acc, active: !acc.active } : acc
        ));
        // Optionally, call API to persist status change here
    };

    const renderCell = (item, columnKey: string) => {
        if (columnKey === 'status') {
            return (
                <div className="flex items-center justify-center">
                    <div
                        className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-300'}`}
                        onClick={() => handleStatusToggle(item.id)}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.active ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </div>
                </div>
            );
        }
        return item[columnKey];
    };

    const renderActions = (accessory) => (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate(`/settings/accessories/${accessory.id}`)}
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEditOpen(accessory)}
            >
                <Pencil className="w-4 h-4" />
            </Button>
        </div>
    );

    const leftActions = (
        <div className="flex items-center gap-2">
            <Button
                onClick={handleAddOpen}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
            >
                <Plus className="w-4 h-4" />
                Add
            </Button>
        </div>
    );

    return (
        <div className="p-6">
            <EnhancedTable
                data={accessories}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                storageKey="accessories-table"
                className="min-w-full"
                emptyMessage={"No accessories data found"}
                leftActions={leftActions}
                enableSearch={true}
                enableSelection={false}
                hideTableExport={true}
                pagination={true}
                pageSize={10}
            />

            <AddAccessoriesModal
                open={isAddModalOpen}
                onOpenChange={handleModalClose}
                editingAccessory={editingAccessory}
            />
        </div>
    )
}

export default AccessoriesSetup