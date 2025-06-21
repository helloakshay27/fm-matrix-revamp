
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid3X3, FileDown, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const InvoicesDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [invoicesData, setInvoicesData] = useState([
    { id: 'INV001', vendor: 'ABC Supplies', amount: '₹50,000', date: '2024-03-15', status: 'Paid', dueDate: '2024-03-30' },
    { id: 'INV002', vendor: 'XYZ Services', amount: '₹25,000', date: '2024-03-14', status: 'Pending', dueDate: '2024-03-29' },
    { id: 'INV003', vendor: 'DEF Materials', amount: '₹75,000', date: '2024-03-13', status: 'Overdue', dueDate: '2024-03-28' }
  ]);

  const filteredInvoices = invoicesData.filter(invoice =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddInvoice = () => {
    console.log('Adding new invoice...');
    toast({
      title: "Add Invoice",
      description: "Add invoice functionality initiated",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleGridView = () => {
    console.log('Switching to grid view...');
    toast({
      title: "Grid View",
      description: "Switching to grid view",
    });
  };

  const handleExport = () => {
    console.log('Exporting invoices...');
    toast({
      title: "Export",
      description: "Exporting invoice data",
    });
  };

  const handleInvoiceClick = (invoiceId: string) => {
    console.log('Opening invoice:', invoiceId);
    toast({
      title: "Invoice Details",
      description: `Opening details for ${invoiceId}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search invoices..."
                className="pl-10 w-80"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleGridView}>
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleExport}>
              <FileDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-start">
          <Button 
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={handleAddInvoice}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Invoice
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline"
                        onClick={() => handleInvoiceClick(invoice.id)}>
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleInvoiceClick(invoice.id)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white"
                          onClick={() => {
                            console.log('Editing invoice:', invoice.id);
                            toast({
                              title: "Edit Invoice",
                              description: `Editing ${invoice.id}`,
                            });
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No invoices found matching your search.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
