
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InvoicesSESFilterDialog } from '@/components/InvoicesSESFilterDialog';

export const InvoicesDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [invoicesData, setInvoicesData] = useState([
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
      remarks: 'Payment processed'
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
      remarks: 'Under review'
    },
    { 
      id: 3,
      invoiceNumber: 'INV-2024-003', 
      invoiceDate: '2024-03-13', 
      supplier: 'DEF Materials Corp', 
      woNumber: 'WO-003',
      woAmount: '₹75,000',
      totalInvoiceAmount: '₹82,500',
      lastApprovedBy: 'Mike Johnson',
      approvedStatus: 'Rejected',
      payableAmount: '₹0',
      adjustmentAmount: '₹-5,000',
      remarks: 'Documentation incomplete'
    }
  ]);

  const [filteredInvoices, setFilteredInvoices] = useState(invoicesData);

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    const filtered = invoicesData.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.woNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.approvedStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(filtered);
    toast({
      title: "Search Applied",
      description: `Found ${filtered.length} matching records`,
    });
  };

  const handleReset = () => {
    console.log('Resetting search...');
    setSearchTerm('');
    setFilteredInvoices(invoicesData);
    toast({
      title: "Search Reset",
      description: "All records are now displayed",
    });
  };

  const handleFilterApply = (filters: {
    invoiceNumber: string;
    invoiceDate: string;
    supplierName: string;
  }) => {
    console.log('Applying filters:', filters);
    let filtered = invoicesData;

    if (filters.invoiceNumber) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(filters.invoiceNumber.toLowerCase())
      );
    }

    if (filters.invoiceDate) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceDate === filters.invoiceDate
      );
    }

    if (filters.supplierName) {
      filtered = filtered.filter(invoice =>
        invoice.supplier.toLowerCase().includes(filters.supplierName.toLowerCase())
      );
    }

    setFilteredInvoices(filtered);
    toast({
      title: "Filters Applied",
      description: `Found ${filtered.length} matching records`,
    });
  };

  const handleViewInvoice = (invoiceId: number) => {
    console.log('Viewing invoice:', invoiceId);
    toast({
      title: "View Invoice",
      description: `Opening details for Invoice ID ${invoiceId}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">WORK ORDER INVOICES/SES</h1>
        </div>

        {/* Filter and Search Section */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setShowFilterDialog(true)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                className="pl-10 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              Go!
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">W.O. Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WO Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Invoice Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Approved By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payable Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjustment Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewInvoice(invoice.id)}
                        className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white"
                      >
                        View
                      </Button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.invoiceDate}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.supplier}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.woNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {invoice.woAmount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {invoice.totalInvoiceAmount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.lastApprovedBy}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.approvedStatus)}`}>
                        {invoice.approvedStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {invoice.payableAmount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.adjustmentAmount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* No Results Message */}
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No invoices found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Filter Dialog */}
        <InvoicesSESFilterDialog
          open={showFilterDialog}
          onOpenChange={setShowFilterDialog}
          onApply={handleFilterApply}
        />
      </div>
    </Layout>
  );
};
