
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoicesSESFilterDialog } from "@/components/InvoicesSESFilterDialog";
import { useAppDispatch } from '@/store/hooks';
import { getInvoinces } from '@/store/slices/invoicesSlice';
import { toast } from 'sonner';

export const InvoicesSESDashboard = () => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    supplierName: ''
  });
  const [invoicesData, setInvoicesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (filters = appliedFilters, search = searchQuery) => {
    setLoading(true);
    try {
      const response = await dispatch(getInvoinces({
        baseUrl,
        token,
        page: 1,
        search,
        invoice_number: filters.invoiceNumber,
        invoice_date: filters.invoiceDate,
        supplier_name: filters.supplierName,
      })).unwrap();
      setInvoicesData(response.work_order_invoices || []);
    } catch (error) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterApply = (filters: typeof appliedFilters) => {
    setAppliedFilters(filters);
    fetchData(filters, searchQuery);
  };

  const handleSearch = () => {
    fetchData(appliedFilters, searchQuery);
  };

  const handleReset = () => {
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">WORK ORDER INVOICES/SES</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsFilterDialogOpen(true)}
              className="flex items-center gap-2"
            >
              🏷️ Filters
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 w-64 h-[36px]"
                style={{ height: '36px' }}
              />
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              onClick={handleSearch}
            >
              Go!
            </Button>
            <Button
              variant="outline"
              className="px-4"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">View</TableHead>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Invoice Number</TableHead>
                <TableHead className="font-semibold">Invoice Date</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">W.O. Number</TableHead>
                <TableHead className="font-semibold">Reference Number</TableHead>
                <TableHead className="font-semibold">WO Amount</TableHead>
                <TableHead className="font-semibold">Total Invoice Amount</TableHead>
                <TableHead className="font-semibold">Last Approved By</TableHead>
                <TableHead className="font-semibold">Approved Status</TableHead>
                <TableHead className="font-semibold">Payable Amount</TableHead>
                <TableHead className="font-semibold">Adjustment Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8 text-gray-500">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : invoicesData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8 text-gray-500">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                invoicesData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="p-1">
                        👁️
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.invoice_number || '-'}</TableCell>
                    <TableCell>{item.invoice_date || '-'}</TableCell>
                    <TableCell>{item.supplier || '-'}</TableCell>
                    <TableCell className="text-blue-600">{item.wo_number || '-'}</TableCell>
                    <TableCell>{item.external_id || '-'}</TableCell>
                    <TableCell className="font-medium">{item.wo_amount || '-'}</TableCell>
                    <TableCell className="font-medium">{item.total_invoice_amount || '-'}</TableCell>
                    <TableCell>{item.last_approved_by || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.approved_status)}`}>
                        {item.approved_status || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{item.payment_status || '-'}</TableCell>
                    <TableCell className="font-medium">{item.adjustment_amount || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <InvoicesSESFilterDialog
          open={isFilterDialogOpen}
          onOpenChange={setIsFilterDialogOpen}
          onApply={handleFilterApply}
        />
      </div>
    </Layout>
  );
};
