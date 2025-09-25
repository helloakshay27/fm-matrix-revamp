import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Plus, Edit, Trash2 } from "lucide-react";
import { AddWBSDialog } from "@/components/AddWBSDialog";
import { BulkUploadDialog } from "@/components/BulkUploadDialog";
import { toast } from "sonner";
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useAppDispatch } from '@/store/hooks';
import { createWBSCode, fetchWBSList, updateWBSCode } from '@/store/slices/wbsSlice';
import { EditWBSDialog } from '@/components/EditWBSDialog';

interface WBSElement {
  id: string;
  plant_code: string;
  category: string;
  category_wbs_code: string;
  wbs_name: string;
  wbs_code: string;
  site: string;
}

const columns: ColumnConfig[] = [
  { key: 'plant_code', label: 'Plant Code', sortable: true, defaultVisible: true },
  { key: 'category', label: 'Category', sortable: true, defaultVisible: true },
  { key: 'category_wbs_code', label: 'Category WBS Code', sortable: true, defaultVisible: true },
  { key: 'wbs_name', label: 'WBS Name', sortable: true, defaultVisible: true },
  { key: 'wbs_code', label: 'WBS Code', sortable: true, defaultVisible: true },
  { key: 'site_name', label: 'Site', sortable: true, defaultVisible: true },
];

export const WBSElementDashboard = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [wbsData, setWbsData] = useState<WBSElement[]>([]);
  const [selectedWBS, setSelectedWBS] = useState<WBSElement | null>(null);

  const fetchWbsData = async () => {
    try {
      const response = await dispatch(fetchWBSList({ baseUrl, token })).unwrap();
      setWbsData(response.wbs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWbsData();
  }, [dispatch, baseUrl, token]);

  const handleAddWBS = async (data: Omit<WBSElement, 'id'>) => {
    const payload = {
      wbs_cost: {
        plant_code: data.plant_code,
        category: data.category,
        category_wbs_code: data.category_wbs_code,
        wbs_name: data.wbs_name,
        wbs_code: data.wbs_code,
        active: true
      }
    };
    try {
      await dispatch(createWBSCode({ baseUrl, token, data: payload })).unwrap();
      toast.success('WBS created successfully');
      setIsAddDialogOpen(false);
      fetchWbsData();
    } catch (error) {
      console.log(error);
      toast.error('Failed to create WBS');
    }
  };

  const handleEditWBS = (item: WBSElement) => {
    setSelectedWBS(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteWBS = async (id: string) => {
    try {
      await dispatch(updateWBSCode({ baseUrl, token, data: { active: false }, id: Number(id) })).unwrap();
      toast.success('WBS deleted successfully');
      fetchWbsData();
    } catch (error) {
      console.log(error)
    }
  };

  const handleBulkImport = (file: File) => {
    // Implement bulk import functionality here
  };

  const handleUpdateWBS = async (data: WBSElement) => {
    if (!selectedWBS) return;
    const payload = {
      wbs_cost: {
        plant_code: data.plant_code,
        category: data.category,
        category_wbs_code: data.category_wbs_code,
        wbs_name: data.wbs_name,
        wbs_code: data.wbs_code,
        active: true
      }
    };
    try {
      await dispatch(updateWBSCode({ baseUrl, token, data: payload, id: Number(selectedWBS.id) })).unwrap();
      toast.success('WBS updated successfully');
      setIsEditDialogOpen(false);
      setSelectedWBS(null);
      fetchWbsData();
    } catch (error) {
      console.log(error);
      toast.error('Failed to update WBS');
    }
  };

  const renderActions = (item: WBSElement) => (
    <div className="flex gap-2 justify-center">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleEditWBS(item)}
        className="h-8 w-8 p-0 hover:bg-gray-100"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleDeleteWBS(item.id)}
        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const leftAction = (
    <div className="flex gap-3">
      <Button
        style={{ backgroundColor: '#C72030' }}
        className="text-white hover:bg-[#C72030]/90"
        onClick={() => setIsAddDialogOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add
      </Button>
      <Button
        variant="outline"
        className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
        onClick={() => setIsBulkUploadOpen(true)}
      >
        <Download className="h-4 w-4 mr-2" />
        Import
      </Button>
    </div>
  );

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      default:
        return item[columnKey] || "-";
    }
  };

  return (
    <div className="p-6">
      <EnhancedTable
        data={wbsData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftAction}
        storageKey="wbs-table"
        emptyMessage="No WBS elements found"
        pagination={true}
        pageSize={10}
        hideTableExport={true}
        hideTableSearch={false}
        hideColumnsButton={false}
      />

      <AddWBSDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddWBS}
      />

      <EditWBSDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedWBS(null);
        }}
        onSubmit={handleUpdateWBS}
        wbsElement={selectedWBS}
      />

      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title="Bulk Upload WBS"
        onImport={handleBulkImport}
      />
    </div>
  );
};