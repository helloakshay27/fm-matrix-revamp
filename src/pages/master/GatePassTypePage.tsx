import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { gatePassTypeService } from '@/services/gatePassTypeService';
import { toast } from 'sonner';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

export interface GatePassType {
  id: number;
  name: string;
  value: string;
  active: boolean;
}

const GatePassTypePage = () => {
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const [gatePassTypes, setGatePassTypes] = useState<GatePassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimisticActive, setOptimisticActive] = useState<Record<number, boolean>>({});

  // Helper to determine if active is ON
  const isActiveValue = (val: any) => val === null || String(val) === 'true' || String(val) === '1';
  // Toggle handler for status switch
  const handleToggleActive = async (id: number) => {
    const item = gatePassTypes.find(gpt => gpt.id === id);
    if (!item) return;
    const newActive = !(optimisticActive[id] !== undefined ? optimisticActive[id] : isActiveValue(item.active));
    setOptimisticActive(prev => ({ ...prev, [id]: newActive }));
    try {
      await gatePassTypeService.updateGatePassType(id, { gate_pass_type: { active: newActive } });
      setGatePassTypes(gatePassTypes => gatePassTypes.map(gpt => gpt.id === id ? { ...gpt, active: newActive } : gpt));
      toast.success(`Gate pass type ${newActive ? 'activated' : 'deactivated'} successfully.`);
    } catch (error) {
      toast.error('Failed to update status.');
      setOptimisticActive(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  useEffect(() => {
    const fetchGatePassTypes = async () => {
      try {
        setLoading(true);
        const data = await gatePassTypeService.getGatePassTypes();
        setGatePassTypes(data);
      } catch (error) {
        toast.error('Failed to fetch gate pass types.');
      } finally {
        setLoading(false);
      }
    };

    fetchGatePassTypes();
  }, []);

  const [showActionPanel, setShowActionPanel] = useState(false);
  const handleAdd = () => {
    navigate('/master/gate-pass-type/add');
  };

  const handleEdit = (id: number) => {
    navigate(`/master/gate-pass-type/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded shadow-md max-w-sm">
        <div>Are you sure you want to delete this gate pass type?</div>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={async () => {
              toast.dismiss(t);
              try {
                await gatePassTypeService.deleteGatePassType(id);
                setGatePassTypes(gatePassTypes => gatePassTypes.filter(gpt => gpt.id !== id));
                toast.success('Gate pass type deleted successfully.');
              } catch (error) {
                toast.error('Failed to delete gate pass type.');
              }
            }}
          >
            Yes
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.dismiss(t)}
          >
            No
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gate Pass Types</h1>
      </div>
      {showActionPanel && shouldShow('gate-pass-type', 'add') && (
        <SelectionPanel
          actions={[
            { label: 'Add', icon: Plus, onClick: handleAdd },
          ]}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}
      <EnhancedTable
        loading={loading}
        columns={[
          { key: 'srno', label: 'Sr. No.' },
          ...(shouldShow('gate-pass-type', 'edit') || shouldShow('gate-pass-type', 'delete') ? [{ key: 'actions', label: 'Actions' }] : []),
          { key: 'name', label: 'Name' },
          { key: 'value', label: 'Value' },
          { key: 'active', label: 'Status' },
        ]}
        data={gatePassTypes.map((gpt, idx) => ({ ...gpt, srno: idx + 1 }))}
        leftActions={
          shouldShow('gate-pass-type', 'add') && (
            <Button
              onClick={() => setShowActionPanel((prev) => !prev)}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium mr-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Action
            </Button>
          )
        }

        renderCell={(item, columnKey) => {
          if (columnKey === 'srno') return <span>{item[columnKey]}</span>;
          if (columnKey === 'actions') {
            return (
              <div className="flex gap-2 justify-center items-center">
                {shouldShow('gate-pass-type', 'edit') && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleEdit(item.id)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {shouldShow('gate-pass-type', 'delete') && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          }
          if (columnKey === 'active') {
            // Treat null, true, or 1 as active (ON)
            const isActive = (optimisticActive[item.id] !== undefined)
              ? optimisticActive[item.id]
              : isActiveValue(item.active);
            return (
              <div className="flex items-center justify-center">
                <div
                  className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                  onClick={() => handleToggleActive(item.id)}
                  aria-label={isActive ? 'Deactivate' : 'Activate'}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </div>
              </div>
            );
          }
          return item[columnKey];
        }}
        emptyMessage="No gate pass types found."
      />
    </div>
  );
};

export default GatePassTypePage;
