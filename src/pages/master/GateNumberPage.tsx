import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { gateNumberService } from '@/services/gateNumberService';
import { toast } from 'sonner';

export interface GateNumber {
  id: number;
  gate_number: string;
  company_name: string;
  pms_site_name: string;
  building_name: string;
  active: boolean | null;
}

const GateNumberPage = () => {
  const navigate = useNavigate();
  const [gateNumbers, setGateNumbers] = useState<GateNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimisticActive, setOptimisticActive] = useState<Record<number, boolean>>({});
  // Helper to determine if active is ON
  const isActiveValue = (val: any) => val === null || String(val) === 'true' || String(val) === '1';

  // Toggle handler for status switch
  const handleToggleActive = async (id: number) => {
    const item = gateNumbers.find(gn => gn.id === id);
    if (!item) return;
    const newActive = !(optimisticActive[id] !== undefined ? optimisticActive[id] : isActiveValue(item.active));
    setOptimisticActive(prev => ({ ...prev, [id]: newActive }));
    try {
      await gateNumberService.updateGateNumber(id, { gate_number: { active: newActive } });
      setGateNumbers(gateNumbers => gateNumbers.map(gn => gn.id === id ? { ...gn, active: newActive } : gn));
      toast.success(`Gate number ${newActive ? 'activated' : 'deactivated'} successfully.`);
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
    const fetchGateNumbers = async () => {
      try {
        setLoading(true);
  const data = await gateNumberService.getGateNumbers(undefined);
        setGateNumbers(data);
      } catch (error) {
        toast.error('Failed to fetch gate numbers.');
      } finally {
        setLoading(false);
      }
    };

    fetchGateNumbers();
  }, []);

  const [showActionPanel, setShowActionPanel] = useState(false);
  const handleAddGateNumber = () => {
    navigate('/master/gate-number/add');
  };

  const handleEdit = (id: number) => {
    navigate(`/master/gate-number/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded shadow-md max-w-sm">
        <div>Are you sure you want to delete this gate number?</div>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={async () => {
              toast.dismiss(t);
              try {
                await gateNumberService.deleteGateNumber(id);
                setGateNumbers(gateNumbers => gateNumbers.filter(gn => gn.id !== id));
                toast.success('Gate number deleted successfully.');
              } catch (error) {
                toast.error('Failed to delete gate number.');
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
        <h1 className="text-2xl font-bold">Gate Numbers</h1>
      </div>
      {showActionPanel && (
        <SelectionPanel
          actions={[
            { label: 'Add', icon: Plus, onClick: handleAddGateNumber },
          ]}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}
      <EnhancedTable
        loading={loading}
        columns={[
          { key: 'srno', label: 'Sr. No.' },
          { key: 'actions', label: 'Actions' },
          { key: 'gate_number', label: 'Gate Number' },
          { key: 'company_name', label: 'Company' },
          { key: 'pms_site_name', label: 'Project' },
          { key: 'building_name', label: 'Building' },
          { key: 'active', label: 'Status' },
        ]}
        data={gateNumbers.map((gn, idx) => ({ ...gn, srno: idx + 1 }))}
        leftActions={
          <Button
            onClick={() => setShowActionPanel((prev) => !prev)}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium mr-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Action
          </Button>
        }
        renderCell={(row, key) => {
          if (key === 'srno') return <span>{row[key]}</span>;
          if (key === 'actions') {
            return (
              <div className="flex gap-2 justify-center items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleEdit(row.id)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            );
          }
          if (key === 'active') {
            const isActive = (optimisticActive[row.id] !== undefined)
              ? optimisticActive[row.id]
              : isActiveValue(row.active);
            return (
              <div className="flex items-center justify-center">
                <div
                  className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                  onClick={() => handleToggleActive(row.id)}
                  aria-label={isActive ? 'Deactivate' : 'Activate'}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </div>
              </div>
            );
          }
          return row[key];
        }}
        emptyMessage="No gate numbers found."
      />
    </div>
  );
};

export default GateNumberPage;
