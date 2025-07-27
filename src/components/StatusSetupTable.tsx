
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
  position: number;
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
  { key: 'canCancel', label: 'Can Cancel', sortable: true, hideable: true, draggable: true },
  { key: 'color', label: 'Color', sortable: true, hideable: true, draggable: true },
  { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false }
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

  const toggleCheckbox = (id: number, field: 'mail' | 'sms' | 'canCancel') => {
    setStatusItems(statusItems.map(item =>
      item.id === id ? { ...item, [field]: !item[field] } : item
    ));
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'accepted';
      case 'inactive':
        return 'rejected';
      case 'pending':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const renderRow = (item: StatusItem) => ({
    order: item.position,
    status: (
      <StatusBadge status={getStatusVariant(item.name)}>
        {item.name}
      </StatusBadge>
    ),
    display: item.display,
    fixedStatus: (
      <select className="border rounded px-2 py-1 text-sm">
        <option value={item.fixed_state}>{item.fixed_state}</option>
      </select>
    ),
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
    canCancel: (
      <Checkbox
        checked={item.cancel}
        onCheckedChange={() => toggleCheckbox(item.id, 'canCancel')}
      />
    ),
    color: (
      <div
        className="w-8 h-6 border rounded mx-auto"
        style={{ backgroundColor: item.color_code }}
      />
    ),
    actions: (
      <div className="flex justify-center gap-2">
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
    )
  });

  return (
    <div className="space-y-4">
      {/* <div className="flex justify-start">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-black" />
          Add
        </Button>
      </div> */}

      {showActionPanel && (
        <SelectionPanel
          // actions={selectionActions}
          onAdd={() => setIsAddModalOpen(true)}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}

      <EnhancedTable
        data={statusItems}
        columns={columns}
        renderRow={renderRow}
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
