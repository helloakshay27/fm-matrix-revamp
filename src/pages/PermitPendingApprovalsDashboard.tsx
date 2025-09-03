
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";

interface PendingApproval {
  resource_id: number;
  resource_type: string;
  invoice_approval_level_id: number;
  created_at: string;
  level_name: string;
  level_id: number;
  site_name: string;
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

  const handleViewPermit = (permitId: number, levelId: number, invoiceApprovalLevelId: number) => {
    const userId = localStorage.getItem('user_id') || localStorage.getItem('userId') || '';

    const queryParams = new URLSearchParams({
      level_id: levelId.toString(),
      user_id: userId,
      invoice_approval_history_id: invoiceApprovalLevelId.toString(),
      approve: 'true',
      type: 'approval'
    });

    navigate(`/safety/permit/details/${permitId}?${queryParams.toString()}`);
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>View</TableHead>
              <TableHead>Permit Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference No</TableHead>
              <TableHead>Site Name</TableHead>
              <TableHead>Level ID</TableHead>
              <TableHead>History ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading pending approvals...
                  </div>
                </TableCell>
              </TableRow>
            ) : pendingApprovals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No pending approvals found
                </TableCell>
              </TableRow>
            ) : (
              pendingApprovals.map((approval) => (
                <TableRow key={`${approval.resource_type}-${approval.resource_id}`}>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPermit(approval.resource_id, approval.level_id, approval.invoice_approval_level_id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{getPermitType(approval.resource_type)}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Pending
                    </span>
                  </TableCell>
                  <TableCell>{approval.resource_id}</TableCell>
                  <TableCell>{approval.site_name}</TableCell>
                  <TableCell>{approval.level_id}</TableCell>
                  <TableCell>{approval.invoice_approval_level_id}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PermitPendingApprovalsDashboard;
