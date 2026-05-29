
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Download, Upload, Filter, Search } from 'lucide-react';
import { CreateInvoiceReceiptModal } from '@/components/CreateInvoiceReceiptModal';
import { ImportReceiptModal } from '@/components/ImportReceiptModal';
import { OSRReceiptFilterModal } from '@/components/OSRReceiptFilterModal';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { toast } from 'sonner';

export const OSRGenerateReceiptPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const iconButtonClass = 'fm-button-fix border border-[#da7756] !text-[#da7756] hover:!bg-[#da7756]/10 hover:!text-[#da7756] px-4 py-2P [&_svg]:!text-[#da7756] [&_svg]:!stroke-[#da7756]';

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

  const columns: ColumnConfig[] = [
    { key: 'receiptNumber', label: 'Receipt Number', sortable: true, hideable: true, defaultVisible: true },
    { key: 'invoiceNumber', label: 'Invoice Number', sortable: true, hideable: true, defaultVisible: true },
    { key: 'flat', label: 'Flat', sortable: true, hideable: true, defaultVisible: true },
    { key: 'customerName', label: 'Customer Name', sortable: true, hideable: true, defaultVisible: true },
    { key: 'amountReceived', label: 'Amount Received', sortable: true, hideable: true, defaultVisible: true },
    { key: 'paymentMode', label: 'Payment Mode', sortable: true, hideable: true, defaultVisible: true },
    { key: 'transactionNumber', label: 'Transaction Number', sortable: true, hideable: true, defaultVisible: true },
    { key: 'paymentDate', label: 'Payment Date', sortable: true, hideable: true, defaultVisible: true },
    { key: 'receiptDate', label: 'Receipt Date', sortable: true, hideable: true, defaultVisible: true },
    { key: 'mailSent', label: 'Mail Sent', sortable: true, hideable: true, defaultVisible: true },
    { key: 'attachments', label: 'Attachment', sortable: true, hideable: true, defaultVisible: true }
  ];

  const visibleColumns = columns.filter(column => columnVisibility[column.key as keyof typeof columnVisibility]);
  const receiptData = useMemo<Record<string, string>[]>(() => [], []);
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return receiptData;

    const query = searchTerm.toLowerCase();
    return receiptData.filter(receipt =>
      Object.values(receipt).some(value => String(value).toLowerCase().includes(query))
    );
  }, [receiptData, searchTerm]);

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  const handleAddReceipt = () => {
    setShowCreateModal(true);
  };

  const handleImportReceipts = () => {
    setShowImportModal(true);
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

  const handleFilterClick = () => {
    setShowFilterModal(true);
  };

  const handleCreateReceipt = (_data: unknown) => {
    toast.success('Receipt created successfully!');
  };

  const handleImportReceiptsFile = (_file: File) => {
    toast.success('Receipts imported successfully!');
  };

  const handleApplyFilters = (_filters: unknown) => {
    toast.success('Filters applied successfully!');
  };

  const handleResetFilters = () => {
    toast.success('Filters reset successfully!');
  };

  const leftActions = (
    <Button
      onClick={handleAddReceipt}
      className="fm-button-fix fm-button-brand px-8 py-2"
    >
      <Plus className="w-4 h-4" />
      Add
    </Button>
  );

  const rightActions = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-64"
        />
      </div>

      <Button
        onClick={handleFilterClick}
        className={`${iconButtonClass} !bg-white`}
        title="Filters"
      >
        <Filter className="w-4 h-4" />
      </Button>

      <Button
        onClick={handleImportReceipts}
        className={`${iconButtonClass} !bg-white`}
        title="Import"
      >
        <Upload className="w-4 h-4" />
      </Button>

      <Button
        onClick={handleExportReceipts}
        className={iconButtonClass}
        title="Export"
      >
        <Download className="w-4 h-4" />
      </Button>

      <ColumnVisibilityDropdown
        columns={columnOptions}
        onColumnToggle={handleColumnToggle}
      />
    </div>
  );

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <EnhancedTable
          data={filteredData}
          columns={visibleColumns}
          leftActions={leftActions}
          rightActions={rightActions}
          hideTableSearch={true}
          hideColumnsButton={true}
          hideTableExport={true}
          storageKey="osr-generate-receipts"
          emptyMessage="No Matching Records Found"
          getItemId={(item) => item.id || item.receiptNumber || item.invoiceNumber || ''}
        />
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
