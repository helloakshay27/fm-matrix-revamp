import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { Plus, Pencil } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { communicationTemplateService } from '@/services/communicationTemplateService';
import { toast } from 'sonner';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

export interface CommunicationTemplate {
  id: number;
  identifier: string;
  identifier_action: string;
  body: string;
  resource_id: number;
  resource_type: string;
  active: boolean | null;
}

const CommunicationTemplateListPage = () => {
  const navigate = useNavigate();
  // Initialize permission hook
  const { shouldShow } = useDynamicPermissions();
  
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimisticActive, setOptimisticActive] = useState<Record<number, boolean>>({});

  // Helper to determine if active is ON
  const isActiveValue = (val: any) => val === null || String(val) === 'true' || String(val) === '1';

  // Toggle handler for status switch
  const handleToggleActive = async (id: number) => {
    const item = templates.find(t => t.id === id);
    if (!item) return;
    const newActive = !(optimisticActive[id] !== undefined ? optimisticActive[id] : isActiveValue(item.active));
    setOptimisticActive(prev => ({ ...prev, [id]: newActive }));
    try {
      await communicationTemplateService.updateCommunicationTemplate(id, {
        communication_template: { active: newActive }
      });
      setTemplates(templates => templates.map(t => t.id === id ? { ...t, active: newActive } : t));
      toast.success(`Template ${newActive ? 'activated' : 'deactivated'} successfully.`);
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
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await communicationTemplateService.getCommunicationTemplates();
        console.log('Fetched templates:', data);
        // Handle if data is array directly or wrapped in object
        setTemplates(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to fetch communication templates.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const [showActionPanel, setShowActionPanel] = useState(false);
  
  const handleAddTemplate = () => {
    navigate('/master/communication-template/add');
  };

  const handleEdit = (id: number) => {
    navigate(`/master/communication-template/edit/${id}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
      </div>
      {showActionPanel && (
        <SelectionPanel
          actions={shouldShow("communication-templates", "add") ? [
            { label: 'Add', icon: Plus, onClick: handleAddTemplate },
          ] : []}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}
      <EnhancedTable
        loading={loading}
        columns={[
          { key: 'srno', label: 'Sr. No.' },
          { key: 'actions', label: 'Actions' },
          { key: 'identifier', label: 'Dropdown' },
          { key: 'identifier_action', label: 'Field Value' },
          { key: 'body', label: 'Description' },
          { key: 'active', label: 'Status' },
        ]}
        data={templates.map((template, idx) => ({ ...template, srno: idx + 1 }))}
        leftActions={
          shouldShow("communication-templates", "add") ? (
            <Button
              onClick={() => setShowActionPanel((prev) => !prev)}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium mr-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Action
            </Button>
          ) : null
        }
        renderCell={(row, key) => {
          if (key === 'srno') return <span>{row[key]}</span>;
          if (key === 'actions') {
            return (
              <div className="flex gap-2 justify-center items-center">
                {shouldShow("communication-templates", "edit") && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleEdit(row.id)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          }
          if (key === 'body') {
            return (
              <div className="max-w-md truncate" title={row[key]}>
                {row[key] || 'N/A'}
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
        emptyMessage="No communication templates found."
      />
    </div>
  );
};

export default CommunicationTemplateListPage;
