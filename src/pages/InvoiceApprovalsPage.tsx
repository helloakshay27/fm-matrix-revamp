
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

interface InvoiceApproval {
  id: number;
  approval_function_name: string;
  created_at: string;
  created_by: string;
  active: boolean;
}

// Function to format date from ISO string to DD/MM/YYYY
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Status Dropdown Component
const StatusDropdown = ({
  id,
  active,
  onStatusChange,
}: {
  id: number;
  active: boolean;
  onStatusChange: (id: number, newActive: boolean) => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isActive = active !== false; // treat undefined/null as active

  const handleSelect = async (value: boolean) => {
    if (value === isActive) {
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(false);
    await onStatusChange(id, value);
    setLoading(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-200 ${
          isActive
            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
        } ${loading ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}
        />
        {loading ? 'Updating…' : isActive ? 'Active' : 'Inactive'}
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-36 rounded-lg shadow-lg bg-white border border-gray-200 py-1 left-0">
            <button
              onClick={() => handleSelect(true)}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isActive && <Check className="w-3.5 h-3.5 mr-2 text-green-600" />}
              {!isActive && <span className="w-3.5 h-3.5 mr-2" />}
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Active
              </span>
            </button>
            <button
              onClick={() => handleSelect(false)}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {!isActive && <Check className="w-3.5 h-3.5 mr-2 text-gray-600" />}
              {isActive && <span className="w-3.5 h-3.5 mr-2" />}
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                Inactive
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export const InvoiceApprovalsPage = () => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem('baseUrl') || '';
  const lockAccountId = localStorage.getItem('lock_account_id');
  const normalizedBaseUrl = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const shouldPassLockAccountId = normalizedBaseUrl === 'club-uat-api.lockated.com';
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceApprovals, setInvoiceApprovals] = useState<InvoiceApproval[]>([]);
  const [filteredData, setFilteredData] = useState<InvoiceApproval[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch invoice approvals data from API
  useEffect(() => {
    const fetchInvoiceApprovals = async () => {
      try {
        setLoading(true);
        const listUrl = shouldPassLockAccountId
          ? `/pms/admin/invoice_approvals.json?lock_account_id=${lockAccountId}`
          : '/pms/admin/invoice_approvals.json';
        const response = await apiClient.get(listUrl);
        const data = response.data;

        // Handle different response formats
        let approvals: InvoiceApproval[] = [];
        if (Array.isArray(data)) {
          approvals = data;
        } else if (data && Array.isArray(data.invoice_approvals)) {
          approvals = data.invoice_approvals;
        } else {
          console.error('Unexpected data format:', data);
        }

        setInvoiceApprovals(approvals);
        setFilteredData(approvals);
      } catch (error) {
        console.error('Error fetching invoice approvals:', error);
        toast.error('Failed to load invoice approvals');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceApprovals();
  }, []);

  // Handle status change via PATCH API
  const handleStatusChange = async (id: number, newActive: boolean) => {
    try {
      const url = shouldPassLockAccountId
        ? `/pms/admin/invoice_approvals/${id}.json?lock_account_id=${lockAccountId}`
        : `/pms/admin/invoice_approvals/${id}.json`;

      await apiClient.patch(url, {
        invoice_approval: { active: newActive },
      });

      // Update local state
      const updater = (list: InvoiceApproval[]) =>
        list.map((item) => (item.id === id ? { ...item, active: newActive } : item));
      setInvoiceApprovals(updater);
      setFilteredData(updater);

      toast.success(`Status updated to ${newActive ? 'Active' : 'Inactive'}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = invoiceApprovals.filter((item) =>
      item.approval_function_name.toLowerCase().includes(value.toLowerCase()) ||
      item.created_by.toLowerCase().includes(value.toLowerCase()) ||
      item.id.toString().includes(value)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Setup &gt; Invoice Approvals
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">INVOICE APPROVALS</h1>
        <div className="flex items-center gap-3" />
      </div>

      {/* Add + Search Row */}
      <div className="flex items-center justify-between">
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => navigate('/settings/invoice-approvals/add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-20 text-center">Edit</TableHead>
              <TableHead className="w-24 text-center">Id</TableHead>
              <TableHead className="text-center">Function</TableHead>
              <TableHead className="w-32 text-center">Created On</TableHead>
              <TableHead className="w-32 text-center">Created by</TableHead>
              <TableHead className="w-36 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading invoice approvals...
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      onClick={() => navigate(`/settings/invoice-approvals/edit/${item.id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.approval_function_name}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">
                    {item.created_by}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusDropdown
                      id={item.id}
                      active={item.active}
                      onStatusChange={handleStatusChange}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No invoice approvals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex justify-center pt-8">
        <div className="flex items-center text-sm text-gray-500">
          <span>Powered by</span>
          <span className="ml-2 font-semibold">goPhygital.work</span>
        </div>
      </div>
    </div>
  );
};
