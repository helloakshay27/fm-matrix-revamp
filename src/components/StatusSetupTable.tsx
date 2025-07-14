
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AddStatusModal } from './AddStatusModal';
import { EditStatusModal } from './EditStatusModal';
import { StatusBadge } from './ui/status-badge';
import { EnhancedTable } from "./enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface StatusItem {
  id: number;
  order: number;
  status: string;
  display: string;
  fixedStatus: string;
  mail: boolean;
  sms: boolean;
  canCancel: boolean;
  color: string;
}

const mockStatusData: StatusItem[] = [
  {
    id: 1,
    order: 1,
    status: 'Active',
    display: 'Welcome',
    fixedStatus: 'Table Booking Accepted',
    mail: false,
    sms: false,
    canCancel: false,
    color: '#16B364'
  }
];

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
  const [statusItems, setStatusItems] = useState<StatusItem[]>(mockStatusData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusItem | null>(null);

  const handleAddStatus = (newStatus: any) => {
    const statusItem: StatusItem = {
      id: statusItems.length + 1,
      order: parseInt(newStatus.order),
      status: newStatus.status,
      display: newStatus.status,
      fixedStatus: newStatus.fixedState,
      mail: false,
      sms: false,
      canCancel: false,
      color: newStatus.color
    };
    setStatusItems([...statusItems, statusItem]);
  };

  const handleEditStatus = (status: StatusItem) => {
    setSelectedStatus(status);
    setIsEditModalOpen(true);
  };

  const handleDeleteStatus = (id: number) => {
    setStatusItems(statusItems.filter(item => item.id !== id));
  };

  const toggleCheckbox = (id: number, field: 'mail' | 'sms' | 'canCancel') => {
    setStatusItems(statusItems.map(item => 
      item.id === id ? { ...item, [field]: !item[field] } : item
    ));
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
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
    order: item.order,
    status: (
      <StatusBadge status={getStatusVariant(item.status)}>
        {item.status}
      </StatusBadge>
    ),
    display: item.display,
    fixedStatus: (
      <select className="border rounded px-2 py-1 text-sm">
        <option value={item.fixedStatus}>{item.fixedStatus}</option>
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
        checked={item.canCancel}
        onCheckedChange={() => toggleCheckbox(item.id, 'canCancel')}
      />
    ),
    color: (
      <div
        className="w-8 h-6 border rounded mx-auto"
        style={{ backgroundColor: item.color }}
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
      <div className="flex justify-start">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-black" />
          Add
        </Button>
      </div>

      <EnhancedTable
        data={statusItems}
        columns={columns}
        renderRow={renderRow}
        enableSearch={true}
        enableSelection={true}
        enableExport={true}
        storageKey="status-table"
      />

      <AddStatusModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddStatus}
      />

      <EditStatusModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};
