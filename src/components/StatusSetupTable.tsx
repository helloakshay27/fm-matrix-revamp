
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AddStatusModal } from './AddStatusModal';
import { EditStatusModal } from './EditStatusModal';
import { StatusBadge } from './ui/status-badge';
import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppDispatch } from '@/store/hooks';
import { createRestaurantStatus, deleteRestaurantStatus, editRestaurantStatus, fetchRestaurantStatuses } from '@/store/slices/f&bSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { SelectionPanel } from './water-asset-details/PannelTab';

export interface StatusItem {
  id: number;
  position: string;
  name: string;
  display: string;
  fixed_state: string;
  mail: boolean;
  sms: boolean;
  cancel: boolean;
  color_code: string;
}

const columns: ColumnConfig[] = [
  { key: 'order', label: 'Order', sortable: true, hideable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
  { key: 'display', label: 'Display', sortable: true, hideable: true, draggable: true },
  { key: 'fixedStatus', label: 'Fixed Status', sortable: true, hideable: true, draggable: true },
  { key: 'mail', label: 'Mail', sortable: true, hideable: true, draggable: true },
  { key: 'sms', label: 'SMS', sortable: true, hideable: true, draggable: true },
  { key: 'cancel', label: 'Can Cancel', sortable: true, hideable: true, draggable: true },
  { key: 'color', label: 'Color', sortable: true, hideable: true, draggable: true },
];

export const StatusSetupTable = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [statusItems, setStatusItems] = useState<StatusItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusItem | null>(null);
  const [showActionPanel, setShowActionPanel] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await dispatch(fetchRestaurantStatuses({ baseUrl, token, id: Number(id) })).unwrap();
      setStatusItems(response);
      console.log(response)
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchStatus();
  }, [])

  const handleAddStatus = async (newStatus: any) => {
    const payload = {
      name: newStatus.status,
      display: newStatus.displayName,
      fixed_state: newStatus.fixedState,
      position: newStatus.order,
      color_code: newStatus.color
    }

    try {
      await dispatch(createRestaurantStatus({
        baseUrl,
        token,
        data: payload,
        id: Number(id)
      })).unwrap();

      fetchStatus();
      toast.success('Status added successfully');
    } catch (error) {
      console.log(error)
    }
  };

  const handleEditStatus = (status: StatusItem) => {
    setSelectedStatus(status);
    setIsEditModalOpen(true);
  };

  const handleDeleteStatus = async (sid: number) => {
    const payload = { active: 0 };
    try {
      await dispatch(deleteRestaurantStatus({ baseUrl, token, id: Number(id), statusId: sid, data: payload })).unwrap();
      fetchStatus();
      toast.success('Status deleted successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete status');
    }
  };

  const toggleCheckbox = (id: number, field: 'mail' | 'sms' | 'cancel') => {
    setStatusItems(statusItems.map(item =>
      item.id === id ? { ...item, [field]: !item[field] } : item
    ));
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100";
      case "inactive":
        return "bg-red-100";
      case "pending":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  const renderRow = (item: StatusItem) => ({
    order: item.position,
    status: (
      <div className={`px-2 py-1 flex items-center gap-2 text-sm ${getStatusVariant(item.name)}`} style={{ borderRadius: '4px', justifyContent: 'center' }}>
        <span className={`rounded-full w-2 h-2 inline-block ${item.name === "Inactive"
          ? "bg-[#D92E14]"
          : item.name === "Active"
            ? "bg-[#16B364]"
            : "bg-[#D9CA20]"
          }`}></span>
        {item.name}
      </div>
    ),
    display: item.display,
    fixedStatus: item.fixed_state.slice(0, 1).toUpperCase() + item.fixed_state.slice(1),
    mail: (
      <Checkbox
        checked={item.mail}
        onCheckedChange={() => toggleCheckbox(item.id, 'mail')}
      />
    ),
    sms: (
      <Checkbox
        checked={item.sms}
        onCheckedChange={() => toggleCheckbox(item.id, 'sms')}
      />
    ),
    cancel: (
      <Checkbox
        checked={item.cancel}
        onCheckedChange={() => toggleCheckbox(item.id, 'cancel')}
      />
    ),
    color: (
      <div
        className="w-8 h-6 border rounded mx-auto"
        style={{ backgroundColor: item.color_code }}
      />
    ),
  });

  const renderActions = (item: StatusItem) => (
    <div className="flex justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEditStatus(item)}
        className="text-blue-600 hover:text-blue-800"
      >
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDeleteStatus(item.id)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {showActionPanel && (
        <SelectionPanel
          onAdd={() => setIsAddModalOpen(true)}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}

      <EnhancedTable
        data={statusItems}
        columns={columns}
        renderRow={renderRow}
        renderActions={renderActions}
        enableSearch={true}
        enableSelection={true}
        storageKey="status-table"
        pagination={true}
        pageSize={5}
        leftActions={
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white w-[106px] h-[36px] py-[10px] px-[20px]"
              onClick={() => setShowActionPanel(true)}
            >
              <Plus className="w-4 h-4" />
              Action
            </Button>
          </div>
        }
      />

      <AddStatusModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddStatus}
      />

      <EditStatusModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        status={selectedStatus}
        fetchStatus={fetchStatus}
      />
    </div>
  );
};
