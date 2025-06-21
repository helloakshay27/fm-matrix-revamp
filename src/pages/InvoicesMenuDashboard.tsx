
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InvoicesFilterDialog } from '@/components/InvoicesFilterDialog';

export const InvoicesMenuDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDialog, setShowFilterDialog] = useState(false);

  // Empty data as shown in the image
  const invoicesData: any[] = [];
  const [filteredInvoices, setFilteredInvoices] = useState(invoicesData);

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    toast({
      title: "Search Applied",
      description: `Searching for: ${searchTerm}`,
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
    toast({
      title: "Filters Applied",
      description: `Filters applied successfully`,
    });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">WORK ORDER INVOICES/SES</h1>
        </div>

        {/* Filter and Search Section */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowFilterDialog(true)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder=""
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

        {/* Table */}
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
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={13} className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg">No invoices found</p>
                        <p className="text-sm mt-2">No data available matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Filter Dialog */}
        <InvoicesFilterDialog
          open={showFilterDialog}
          onOpenChange={setShowFilterDialog}
          onApply={handleFilterApply}
        />
      </div>
    </Layout>
  );
};
