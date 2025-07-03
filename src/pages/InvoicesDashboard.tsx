import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { InvoicesFilterDialog } from '@/components/InvoicesFilterDialog';

interface InvoiceData {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  supplier: string;
  woNumber: string;
  woAmount: string;
  totalInvoiceAmount: string;
  lastApprovedBy: string;
  approvedStatus: string;
  payableAmount: string;
  adjustmentAmount: string;
  retentionAmount: string;
  ksAmount: string;
  physicalInvoiceSentToAccounts: string;
  physicalInvoiceReceivedByAccounts: string;
  daysPassed: number;
  accountPaid: string;
  balanceAmount: string;
  paymentStatus: string;
  aging: string;
  createdOn: string;
  createdBy: string;
}

export const InvoicesDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    supplierName: ''
  });

  const [invoicesData] = useState<InvoiceData[]>([
    {
      id: 1,
      invoiceNumber: 'INV-2024-001',
      invoiceDate: '2024-03-15',
      supplier: 'ABC Supplies Ltd',
      woNumber: 'WO-001',
      woAmount: '₹50,000',
      totalInvoiceAmount: '₹55,000',
      lastApprovedBy: 'John Doe',
      approvedStatus: 'Approved',
      payableAmount: '₹55,000',
      adjustmentAmount: '₹0',
      retentionAmount: '₹5,500',
      ksAmount: '₹2,750',
      physicalInvoiceSentToAccounts: 'Yes',
      physicalInvoiceReceivedByAccounts: 'Yes',
      daysPassed: 15,
      accountPaid: '₹47,500',
      balanceAmount: '₹7,500',
      paymentStatus: 'Partial',
      aging: '15 days',
      createdOn: '2024-03-15',
      createdBy: 'Admin'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-002',
      invoiceDate: '2024-03-14',
      supplier: 'XYZ Services Pvt Ltd',
      woNumber: 'WO-002',
      woAmount: '₹25,000',
      totalInvoiceAmount: '₹27,500',
      lastApprovedBy: 'Jane Smith',
      approvedStatus: 'Pending',
      payableAmount: '₹27,500',
      adjustmentAmount: '₹0',
      retentionAmount: '₹2,750',
      ksAmount: '₹1,375',
      physicalInvoiceSentToAccounts: 'No',
      physicalInvoiceReceivedByAccounts: 'No',
      daysPassed: 8,
      accountPaid: '₹0',
      balanceAmount: '₹27,500',
      paymentStatus: 'Pending',
      aging: '8 days',
      createdOn: '2024-03-14',
      createdBy: 'User1'
    }
  ]);

  const handleFilterApply = (filters: typeof appliedFilters) => {
    setAppliedFilters(filters);
    toast.success('Filters applied successfully');
  };

  const applyFilters = (data: InvoiceData[]) => {
    return data.filter(invoice => {
      const matchesSearch = searchTerm === '' || 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.woNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.approvedStatus.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = 
        (!appliedFilters.invoiceNumber || invoice.invoiceNumber.toLowerCase().includes(appliedFilters.invoiceNumber.toLowerCase())) &&
        (!appliedFilters.supplierName || invoice.supplier.toLowerCase().includes(appliedFilters.supplierName.toLowerCase())) &&
        (!appliedFilters.invoiceDate || invoice.invoiceDate.includes(appliedFilters.invoiceDate));

      return matchesSearch && matchesFilters;
    });
  };

  const filteredInvoices = applyFilters(invoicesData);

  const handleSearch = () => {
    const filtered = applyFilters(invoicesData);
    toast.success(`Found ${filtered.length} matching records`);
  };

  const handleReset = () => {
    setSearchTerm('');
    setAppliedFilters({
      invoiceNumber: '',
      invoiceDate: '',
      supplierName: ''
    });
    toast.success('Search reset successfully');
  };

  const handleViewInvoice = (invoiceId: number) => {
    toast.info(`Opening invoice details for ID: ${invoiceId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-sm text-gray-600">Home &gt; Finance &gt; Invoices</div>
      <h1 className="text-2xl font-bold">WORK ORDER INVOICES/SES</h1>

      {/* Responsive Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
        <div className="flex-shrink-0">
          <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)} className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-full h-[36px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={handleSearch} style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }} className="hover:bg-[#F2EEE9]/90 w-full sm:w-auto">
              Go!
            </Button>
            <Button variant="outline" onClick={handleReset} className="hover:bg-gray-50 w-full sm:w-auto">
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[1400px]">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>View</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>W.O. Number</TableHead>
                <TableHead>WO Amount</TableHead>
                <TableHead>Total Invoice Amount</TableHead>
                <TableHead>Last Approved By</TableHead>
                <TableHead>Approved Status</TableHead>
                <TableHead>Payable Amount</TableHead>
                <TableHead>Adjustment Amount</TableHead>
                <TableHead>Retention Amount</TableHead>
                <TableHead>KS Amount</TableHead>
                <TableHead>Physical Invoice Sent to Accounts</TableHead>
                <TableHead>Physical Invoice Received by Accounts</TableHead>
                <TableHead>Days Passed</TableHead>
                <TableHead>Account Paid</TableHead>
                <TableHead>Balance Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Aging</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={23} className="text-center py-8 text-gray-500">
                    No invoices found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewInvoice(invoice.id)}>
                        View
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell className="text-blue-600 cursor-pointer hover:underline">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.invoiceDate}</TableCell>
                    <TableCell>{invoice.supplier}</TableCell>
                    <TableCell>{invoice.woNumber}</TableCell>
                    <TableCell className="font-medium">{invoice.woAmount}</TableCell>
                    <TableCell className="font-medium">{invoice.totalInvoiceAmount}</TableCell>
                    <TableCell>{invoice.lastApprovedBy}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.approvedStatus)}`}>
                        {invoice.approvedStatus}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{invoice.payableAmount}</TableCell>
                    <TableCell>{invoice.adjustmentAmount}</TableCell>
                    <TableCell>{invoice.retentionAmount}</TableCell>
                    <TableCell>{invoice.ksAmount}</TableCell>
                    <TableCell>{invoice.physicalInvoiceSentToAccounts}</TableCell>
                    <TableCell>{invoice.physicalInvoiceReceivedByAccounts}</TableCell>
                    <TableCell>{invoice.daysPassed}</TableCell>
                    <TableCell className="font-medium">{invoice.accountPaid}</TableCell>
                    <TableCell className="font-medium">{invoice.balanceAmount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.paymentStatus)}`}>
                        {invoice.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell>{invoice.aging}</TableCell>
                    <TableCell>{invoice.createdOn}</TableCell>
                    <TableCell>{invoice.createdBy}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <InvoicesFilterDialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen} onApply={handleFilterApply} />
    </div>
  );
};