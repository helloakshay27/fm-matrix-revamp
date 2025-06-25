
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Download, Upload, Filter, RefreshCw, MoreHorizontal } from 'lucide-react';
import { CreateInvoiceReceiptModal } from '@/components/CreateInvoiceReceiptModal';
import { ImportReceiptModal } from '@/components/ImportReceiptModal';
import { OSRReceiptFilterModal } from '@/components/OSRReceiptFilterModal';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import { ExportDropdown } from '@/components/ExportDropdown';
import { toast } from 'sonner';

export const OSRGenerateReceiptPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filters, setFilters] = useState({
    tower: '',
    flat: '',
    invoiceNumber: '',
    receiptNumber: '',
    receiptDate: ''
  });

  const [columnVisibility, setColumnVisibility] = useState({
    actions: true,
    receiptNumber: true,
    invoiceNumber: true,
    flat: true,
    customerName: true,
    amountReceived: true,
    paymentMode: true,
    transactionNumber: true,
    paymentDate: true,
    receiptDate: true,
    mailSent: true,
    attachments: true
  });

  const columnOptions = [
    { key: 'receiptNumber', label: 'Receipt Number', visible: columnVisibility.receiptNumber },
    { key: 'invoiceNumber', label: 'Invoice Number', visible: columnVisibility.invoiceNumber },
    { key: 'flat', label: 'Flat', visible: columnVisibility.flat },
    { key: 'customerName', label: 'Customer Name', visible: columnVisibility.customerName },
    { key: 'amountReceived', label: 'Amount Received', visible: columnVisibility.amountReceived },
    { key: 'paymentMode', label: 'Payment Mode', visible: columnVisibility.paymentMode },
    { key: 'transactionNumber', label: 'Transaction Number', visible: columnVisibility.transactionNumber },
    { key: 'paymentDate', label: 'Payment Date', visible: columnVisibility.paymentDate },
    { key: 'receiptDate', label: 'Receipt Date', visible: columnVisibility.receiptDate },
    { key: 'mailSent', label: 'Mail sent', visible: columnVisibility.mailSent },
    { key: 'attachments', label: 'Attachments', visible: columnVisibility.attachments }
  ];

  const handleApplyFilters = (newFilters: any) => {
    console.log('Applying filters:', newFilters);
    setFilters(newFilters);
    toast.success('Filters applied successfully!');
  };

  const handleResetFilters = () => {
    console.log('Resetting filters');
    const resetFilters = {
      tower: '',
      flat: '',
      invoiceNumber: '',
      receiptNumber: '',
      receiptDate: ''
    };
    setFilters(resetFilters);
    toast.success('Filters reset successfully!');
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    console.log(`Column ${columnKey} toggled to ${visible}`);
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  const handleAddReceipt = () => {
    console.log('Add Receipt button clicked');
    setShowCreateModal(true);
  };

  const handleImportReceipts = () => {
    console.log('Import Receipts button clicked');
    setShowImportModal(true);
  };

  const handleExportReceipts = () => {
    console.log('Export Receipts button clicked');
    const exportData = [
      ['Receipt Number', 'Invoice Number', 'Flat', 'Customer Name', 'Amount Received', 'Payment Mode', 'Transaction Number', 'Payment Date', 'Receipt Date', 'Mail Sent', 'Attachment'],
      ['1001', 'INV001', 'A-101', 'John Doe', '5000', 'Cash', 'TXN001', '2025-01-15', '2025-01-15', 'Yes', 'receipt_001.pdf'],
      ['1002', 'INV002', 'A-102', 'Jane Smith', '7500', 'Bank Transfer', 'TXN002', '2025-01-16', '2025-01-16', 'No', 'receipt_002.pdf']
    ];

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

  const handleRefresh = () => {
    console.log('Refresh button clicked');
    toast.success('Data refreshed successfully!');
  };

  const handleCreateReceipt = (data: any) => {
    console.log('Creating receipt with data:', data);
    toast.success('Receipt created successfully!');
  };

  const handleImportReceiptsFile = (file: File) => {
    console.log('Importing receipts from file:', file.name);
    toast.success('Receipts imported successfully!');
  };

  return (
    <div className="p-0 bg-gray-50 min-h-screen">
      <div className="bg-white">
        {/* Action Buttons Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleAddReceipt}
                className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white px-4 py-2 h-9 text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
              
              <Button 
                onClick={handleImportReceipts}
                className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white px-4 py-2 h-9 text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Import
              </Button>
              
              <Button 
                onClick={handleExportReceipts}
                className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white px-4 py-2 h-9 text-sm flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Export
              </Button>
              
              <Button 
                onClick={() => setShowFilterModal(true)}
                className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white px-4 py-2 h-9 text-sm flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 h-9 border-gray-300 text-sm"
              />
              
              <Button variant="ghost" size="sm" className="p-2 h-9" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4" />
              </Button>
              
              <ColumnVisibilityDropdown
                columns={columnOptions}
                onColumnToggle={handleColumnToggle}
              />
              
              <ExportDropdown />
              
              <Button variant="ghost" size="sm" className="p-2 h-9">
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
                {columnVisibility.actions && (
                  <TableHead className="text-left font-semibold text-sm h-10">Actions</TableHead>
                )}
                {columnVisibility.receiptNumber && (
                  <TableHead className="text-left font-semibold text-sm h-10">Receipt Number</TableHead>
                )}
                {columnVisibility.invoiceNumber && (
                  <TableHead className="text-left font-semibold text-sm h-10">Invoice Number</TableHead>
                )}
                {columnVisibility.flat && (
                  <TableHead className="text-left font-semibold text-sm h-10">Flat</TableHead>
                )}
                {columnVisibility.customerName && (
                  <TableHead className="text-left font-semibold text-sm h-10">Customer Name</TableHead>
                )}
                {columnVisibility.amountReceived && (
                  <TableHead className="text-left font-semibold text-sm h-10">Amount Received</TableHead>
                )}
                {columnVisibility.paymentMode && (
                  <TableHead className="text-left font-semibold text-sm h-10">Payment Mode</TableHead>
                )}
                {columnVisibility.transactionNumber && (
                  <TableHead className="text-left font-semibold text-sm h-10">Transaction Number</TableHead>
                )}
                {columnVisibility.paymentDate && (
                  <TableHead className="text-left font-semibold text-sm h-10">Payment Date</TableHead>
                )}
                {columnVisibility.receiptDate && (
                  <TableHead className="text-left font-semibool text-sm h-10">Receipt Date</TableHead>
                )}
                {columnVisibility.mailSent && (
                  <TableHead className="text-left font-semibold text-sm h-10">Mail Sent</TableHead>
                )}
                {columnVisibility.attachments && (
                  <TableHead className="text-left font-semibold text-sm h-10">Attachment</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8">
                  <span className="text-gray-600 text-sm">No Matching Records Found</span>
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
        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 transform rotate-90 origin-center">
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
        onImport={handleImportReceiptsFile}
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
