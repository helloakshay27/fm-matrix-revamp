
import React, { useState, useEffect } from 'react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";

interface PendingApproval {
  permit_id?: number;
  resource_id: number;
  resource_type: string;
  created_at: string;
  level_name?: string;
  level_id?: number;
  site_name?: string;
}

interface ApiResponse {
  pending_approvals: PendingApproval[];
}

export const PermitPendingApprovalsDashboard = () => {
  const navigate = useNavigate();
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      setLoading(true);
      setError("");
      try {
        let baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');

        if (!baseUrl || !token) {
          throw new Error("Base URL or token not set in localStorage");
        }

        // Ensure protocol is present
        if (!/^https?:\/\//i.test(baseUrl)) {
          baseUrl = `https://${baseUrl}`;
        }

        const url = `${baseUrl}/pms/permits/pending_approvals.json`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch pending approvals");
        }

        const data: ApiResponse = await response.json();
        setPendingApprovals(data.pending_approvals || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching pending approvals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPermitType = (resourceType: string) => {
    if (resourceType.includes('PurchaseOrder')) return 'Purchase Order';
    if (resourceType.includes('WorkOrder')) return 'Work Order';
    return resourceType.split('::').pop() || resourceType;
  };

  const handleViewPermit = (permitId: number, levelId: number, resourceType: string) => {
    const userId = localStorage.getItem('user_id') || localStorage.getItem('userId') || '';

    // Add null/undefined checks before converting to string
    const queryParams = new URLSearchParams({
      level_id: (levelId ?? '').toString(),
      user_id: userId,
      approve: 'true',
      type: 'approval',
      resource_type: resourceType === "Pms::PermitExtend" ? 'permit_extend' : resourceType === "Pms::Permit" ? 'permit' : resourceType === "Pms::PermitClosure" ? 'permit_closure' : "",

    });

    navigate(`/safety/permit/details/${permitId}?${queryParams.toString()}`);
  };

  // Define columns for EnhancedTable
  const columns = [

    {
      key: 'view',
      label: 'View',
      sortable: false,
      draggable: false,
      defaultVisible: true
    },
    {
      key: 'srNo',
      label: 'Sr. No.',
      sortable: false,
      draggable: false,
      defaultVisible: true
    },
    {
      key: 'permit_type',
      label: 'Permit Type',
      sortable: true,
      draggable: true,
      defaultVisible: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      draggable: true,
      defaultVisible: true
    },
    {
      key: 'permit_id',
      label: 'Reference No',
      sortable: true,
      draggable: true,
      defaultVisible: true
    },
    {
      key: 'site_name',
      label: 'Site Name',
      sortable: true,
      draggable: true,
      defaultVisible: true
    },
    {
      key: 'level_id',
      label: 'Level ID',
      sortable: true,
      draggable: true,
      defaultVisible: true
    }
  ];

  // Render cell for EnhancedTable
  const renderCell = (approval: PendingApproval, columnKey: string) => {
    if (columnKey === 'srNo') {
      // Find index in current sortedData for correct Sr. No.
      const index = pendingApprovals.findIndex(a => a.resource_id === approval.resource_id);
      return <span className="font-medium">{index + 1}</span>;
    }
    switch (columnKey) {
      case 'view':
        return (
          // <Button
          //   // variant="outline"
          //   size="sm"
          //   onClick={() => handleViewPermit(
          //     approval.permit_id || 0,
          //     approval.level_id || 0,
          //     approval.resource_type || ''
          //   )}
          // >
          //   <Eye className="h-4 w-4" />
          // </Button>
          <div className="flex items-center gap-2">
            <div title="View permit details">
              <Eye
                className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#C72030]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewPermit(
                    approval.permit_id || 0,
                    approval.level_id || 0,
                    approval.resource_type || ''
                  );
                }}
              />
            </div>
          </div>
        );
      case 'permit_type':
        return getPermitType(approval.resource_type);
      case 'status':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            Pending
          </span>
        );
      case 'permit_id':
        return approval.permit_id;
      case 'site_name':
        return approval.site_name || '';
      case 'level_id':
        return approval.level_id || 'N/A';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
      </div>
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg ">
        <EnhancedTable
          data={pendingApprovals}
          columns={columns}
          renderCell={renderCell}
          emptyMessage={loading ? 'Loading pending approvals...' : 'No pending approvals found'}
          loading={loading}
          pagination={true}
          pageSize={10}
          storageKey="pending-approvals-table"
        />
      </div>
    </div>
  );
};

export default PermitPendingApprovalsDashboard;
