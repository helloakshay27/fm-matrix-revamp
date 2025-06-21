
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
    console.log('Searching for:', e.target.value);
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

  const handleViewInvoice = (invoiceId: string) => {
    console.log('Viewing invoice:', invoiceId);
    toast({
      title: "View Invoice",
      description: `Viewing details for ${invoiceId}`,
    });
  };

  const handleEditInvoice = (invoiceId: string) => {
    console.log('Editing invoice:', invoiceId);
    toast({
      title: "Edit Invoice",
      description: `Editing ${invoiceId}`,
    });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
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

        {/* Add Invoice Button */}
        <div className="flex justify-start">
          <Button 
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={handleAddInvoice}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Invoice
          </Button>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
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
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline"
                        onClick={() => handleInvoiceClick(invoice.id)}>
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                          onClick={() => handleViewInvoice(invoice.id)}
                          className="hover:bg-gray-100"
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white"
                          onClick={() => handleEditInvoice(invoice.id)}
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
          
          {/* No Results Message */}
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No invoices found matching your search.</p>
              <p className="text-sm mt-2">Try adjusting your search criteria or add a new invoice.</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Invoices</h3>
            <p className="text-2xl font-bold text-gray-900">{invoicesData.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Pending Invoices</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {invoicesData.filter(inv => inv.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Overdue Invoices</h3>
            <p className="text-2xl font-bold text-red-600">
              {invoicesData.filter(inv => inv.status === 'Overdue').length}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
