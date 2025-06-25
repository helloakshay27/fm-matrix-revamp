
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Download, Upload, Filter, RefreshCw, Grid3X3, MoreHorizontal } from 'lucide-react';
import { CreateInvoiceReceiptModal } from '@/components/CreateInvoiceReceiptModal';
import { ImportReceiptModal } from '@/components/ImportReceiptModal';
import { OSRReceiptFilterModal } from '@/components/OSRReceiptFilterModal';
import { toast } from 'sonner';

export const OSRGenerateReceiptPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleCreateReceipt = (data: any) => {
    console.log('Creating receipt with data:', data);
    toast.success('Receipt created successfully!');
  };

  const handleImportReceipts = (file: File) => {
    console.log('Importing receipts from file:', file.name);
    toast.success('Receipts imported successfully!');
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applying filters:', filters);
    toast.success('Filters applied successfully!');
  };

  const handleResetFilters = () => {
    console.log('Resetting filters');
    toast.success('Filters reset successfully!');
  };

  const handleExportReceipts = () => {
    // Create sample data for export
    const exportData = [
      ['Receipt Number', 'Invoice Number', 'Flat', 'Customer Name', 'Amount Received', 'Payment Mode', 'Transaction Number', 'Payment Date', 'Receipt Date', 'Mail Sent', 'Attachment'],
      ['1001', 'INV001', 'A-101', 'John Doe', '5000', 'Cash', 'TXN001', '2025-01-15', '2025-01-15', 'Yes', 'receipt_001.pdf'],
      ['1002', 'INV002', 'A-102', 'Jane Smith', '7500', 'Bank Transfer', 'TXN002', '2025-01-16', '2025-01-16', 'No', 'receipt_002.pdf']
    ];

    // Convert to CSV
    const csvContent = exportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice_receipts.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Receipts exported successfully!');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header with Action Buttons */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
            
            <Button 
              onClick={() => setShowImportModal(true)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Import
            </Button>
            
            <Button 
              onClick={handleExportReceipts}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Export
            </Button>
            
            <Button 
              onClick={() => setShowFilterModal(true)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Search and Action Icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-gray-300 rounded-none"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-left font-semibold">Actions</TableHead>
                <TableHead className="text-left font-semibold">Receipt Number</TableHead>
                <TableHead className="text-left font-semibold">Invoice Number</TableHead>
                <TableHead className="text-left font-semibold">Flat</TableHead>
                <TableHead className="text-left font-semibold">Customer Name</TableHead>
                <TableHead className="text-left font-semibold">Amount Received</TableHead>
                <TableHead className="text-left font-semibold">Payment Mode</TableHead>
                <TableHead className="text-left font-semibold">Transaction Number</TableHead>
                <TableHead className="text-left font-semibold">Payment Date</TableHead>
                <TableHead className="text-left font-semibold">Receipt Date</TableHead>
                <TableHead className="text-left font-semibold">Mail Sent</TableHead>
                <TableHead className="text-left font-semibold">Attachment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Empty state */}
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8">
                  <span className="text-red-600 font-medium">No Matching Records Found</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <div className="text-sm text-gray-600">
            Powered by <span className="font-semibold">LOCKATED</span>
          </div>
        </div>
      </div>

      {/* Support Button */}
      <div className="fixed bottom-4 right-4">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-none transform rotate-90 origin-center">
          SUPPORT
        </Button>
      </div>

      {/* Modals */}
      <CreateInvoiceReceiptModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateReceipt}
      />

      <ImportReceiptModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportReceipts}
      />

      <OSRReceiptFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
};
