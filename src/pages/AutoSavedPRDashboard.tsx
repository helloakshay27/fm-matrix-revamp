import { useEffect, useState } from 'react';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';
import { useProcurementEvents } from '@/components/PostHogProcurementEvents';

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
  const { shouldShow } = useDynamicPermissions()
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('page')) || 1;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [savedPR, setSavedPR] = useState<PRData[]>([]);
  const [loading, setLoading] = useState(true);
  const procurementEvents = useProcurementEvents();

  useEffect(() => {
    navigate(`${location.pathname}?page=${currentPage}`, { replace: true });
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/temp_records.json`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setSavedPR(formattedData(response.data.system_logs));
        try { procurementEvents.onPrDraftReopened(null, null); } catch (err) {}
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
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

    try { procurementEvents.onPrDraftReopened(item.id, null); } catch (err) {}
    navigate(url);
  }

  const renderActions = (item: PRData) => {
    return (
      <div className="flex space-x-2 justify-center">
        {
          shouldShow("Auto Saved PR", "show") && (
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
          )
        }

      </div>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`${location.pathname}?page=${page}`, { replace: true });
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">Temp Requests</h1>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f6f4ee]">
                <TableHead className="font-medium">Actions</TableHead>
                <TableHead className="font-medium">Type</TableHead>
                <TableHead className="font-medium">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} className="pt-4 pb-16">
                  <div className="w-full flex items-center justify-start gap-3 pl-4">
                    <div
                      className="h-5 w-5 rounded-full animate-spin"
                      style={{ border: "2px solid #000000", borderTopColor: "transparent" }}
                    />
                    <span className="text-sm text-black">Loading ...</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
      <EnhancedTable
        data={[...savedPR].reverse()}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="auto-saved-pr-dashboard"
        className="bg-white rounded-lg shadow overflow-x-auto"
        emptyMessage=""
        searchPlaceholder="Search temp requests..."
        enableExport={true}
        exportFileName="temp-requests"
        pagination={true}
        pageSize={10}
        hideColumnsButton={true}
        hideTableExport={true}
        hideTableSearch={true}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      )}
    </div>
  );
};