import { useEffect, useState } from 'react';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface PRData {
  id: string;
  type: string;
  lastUpdated: string;
}

const columns: ColumnConfig[] = [
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'lastUpdated',
    label: 'Last Updated',
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

const formattedData = (data: any) => {
  return data.map((item: any) => ({
    id: item.id,
    type: item.log_type === "Pms::PurchaseOrder"
      ? "Material PR"
      : item.log_type === "Pms::WorkOrder"
        ? "Service PR"
        : item.log_type === "Pms::Grn"
          ? "GRN"
          : "",
    lastUpdated: format(item.updated_at, "dd/MM/yyyy hh:mm a"),
  }))
}

export const AutoSavedPRDashboard = () => {
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [savedPR, setSavedPR] = useState<PRData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/temp_records.json`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setSavedPR(formattedData(response.data.system_logs));
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  const renderCell = (item: PRData, columnKey: string) => {
    return item[columnKey as keyof PRData];
  };

  const handleNavigate = (item: PRData) => {
    const url = item.type === "Material PR"
      ? `/finance/material-pr/add?saved_pr_id=${item.id}`
      : item.type === "Service PR"
        ? `/finance/service-pr/add?saved_pr_id=${item.id}`
        : item.type === "GRN"
          ? `/finance/grn-srn/add?saved_pr_id=${item.id}`
          : "";

    navigate(url);
  }

  const renderActions = (item: PRData) => {
    return (
      <div className="flex space-x-2 justify-center">
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate(item);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">Temp Requests</h1>

      <EnhancedTable
        data={[...savedPR].reverse()}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="auto-saved-pr-dashboard"
        className="bg-white rounded-lg shadow overflow-x-auto"
        emptyMessage="No temp requests available"
        searchPlaceholder="Search temp requests..."
        enableExport={true}
        exportFileName="temp-requests"
        pagination={true}
        pageSize={10}
        hideColumnsButton={true}
        hideTableExport={true}
        hideTableSearch={true}
      />
    </div>
  );
};