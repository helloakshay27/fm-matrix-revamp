import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { POFilterDialog } from "@/components/POFilterDialog";
import { ColumnConfig } from '@/hooks/useEnhancedTable'; // Adjust the import path as needed
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';

export const PODashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const poData = [
    {
      id: 10712,
      poNumber: "NA",
      referenceNo: "121240",
      createdBy: "Sony Bhosle",
      createdOn: "22/04/2025",
      supplier: "ABC",
      paymentTenure: "",
      activeInactive: true,
      lastApprovedBy: "Sony Bhosle",
      approvalStatus: "Approved",
      advanceAmount: "2720.00",
      poAmount: "",
      retention: "0",
      tds: "",
      qc: "",
      tdsAmount: "0",
      retentionAmount: "0", // New column
      retentionOutstanding: "0.0", // New column
      qcAmount: "0", // New column
      qcOutstanding: "0.0", // New column
      noOfGrns: "0", // New column
      totalAmountPaid: "0.0", // New column
      outstanding: "130.0", // New column (mapped to advanceAmount where possible)
      debitCreditNoteRaised: "No", // New column
    },
    {
      id: 10501,
      poNumber: "NA",
      referenceNo: "121248",
      createdBy: "Sony B Bhosle",
      createdOn: "01/04/2025",
      supplier: "ABC",
      paymentTenure: "",
      activeInactive: true,
      lastApprovedBy: "Sony B Bhosle",
      approvalStatus: "Approved",
      advanceAmount: "7000.00",
      poAmount: "",
      retention: "0.0",
      tds: "",
      qc: "",
      tdsAmount: "0",
      retentionAmount: "0", // New column
      retentionOutstanding: "0.0", // New column
      qcAmount: "0", // New column
      qcOutstanding: "0.0", // New column
      noOfGrns: "1", // New column (based on image data)
      totalAmountPaid: "0.0", // New column
      outstanding: "7000.0", // New column (mapped to advanceAmount)
      debitCreditNoteRaised: "No", // New column
    },
    {
      id: 10405,
      poNumber: "NA",
      referenceNo: "121243",
      createdBy: "Sony B Bhosle",
      createdOn: "26/03/2025",
      supplier: "ACHLA CORPORATION",
      paymentTenure: "",
      activeInactive: true,
      lastApprovedBy: "",
      approvalStatus: "Pending",
      advanceAmount: "130.00",
      poAmount: "",
      retention: "0",
      tds: "",
      qc: "",
      tdsAmount: "0",
      retentionAmount: "0", // New column
      retentionOutstanding: "0.0", // New column
      qcAmount: "0", // New column
      qcOutstanding: "0.0", // New column
      noOfGrns: "0", // New column
      totalAmountPaid: "0.0", // New column
      outstanding: "130.0", // New column (mapped to advanceAmount)
      debitCreditNoteRaised: "No", // New column
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "approvalStatus":
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              item.approvalStatus
            )}`}
          >
            {item.approvalStatus}
          </span>
        );
      case "activeInactive":
        return (
          <input
            type="checkbox"
            checked={item.activeInactive}
            readOnly
            className="w-4 h-4"
          />
        );
      case "referenceNo":
        return (
          <span className="text-blue-600 hover:underline cursor-pointer">
            {item.referenceNo}
          </span>
        );
      case "debitCreditNoteRaised":
        return (
          <span
            className={
              item.debitCreditNoteRaised.toLowerCase() === "yes"
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {item.debitCreditNoteRaised}
          </span>
        );
      default:
        return item[columnKey] || "";
    }
  };

  const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
    { key: "poNumber", label: "PO No.", sortable: true, draggable: true, defaultVisible: true },
    {
      key: "referenceNo",
      label: "Reference No.",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    { key: "createdBy", label: "Created by", sortable: true, draggable: true, defaultVisible: true },
    { key: "createdOn", label: "Created on", sortable: true, draggable: true, defaultVisible: true },
    { key: "supplier", label: "Supplier", sortable: true, draggable: true, defaultVisible: true },
    {
      key: "paymentTenure",
      label: "Payment Tenure(in Days)",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "activeInactive",
      label: "Active/Inactive",
      sortable: false,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "lastApprovedBy",
      label: "Last Approved By",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "approvalStatus",
      label: "Approval status",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "advanceAmount",
      label: "Advance Amount",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    { key: "poAmount", label: "PO Amount", sortable: true, draggable: true, defaultVisible: true },
    { key: "retention", label: "Retention(%)", sortable: true, draggable: true, defaultVisible: true },
    { key: "tds", label: "TDS(%)", sortable: true, draggable: true, defaultVisible: true },
    { key: "qc", label: "QC(%)", sortable: true, draggable: true, defaultVisible: true },
    { key: "tdsAmount", label: "TDS Amount", sortable: true, draggable: true, defaultVisible: true },
    {
      key: "retentionAmount",
      label: "Retention Amount",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "retentionOutstanding",
      label: "Retention Outstanding",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "qcAmount",
      label: "QC Amount",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "qcOutstanding",
      label: "QC Outstanding",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    { key: "noOfGrns", label: "No of Grns", sortable: true, draggable: true, defaultVisible: true },
    {
      key: "totalAmountPaid",
      label: "Total Amount Paid",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    { key: "outstanding", label: "Outstanding", sortable: true, draggable: true, defaultVisible: true },
    {
      key: "debitCreditNoteRaised",
      label: "Debit/Credit Note Raised",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
  ];

  const renderActions = (item: any) => (
    <Button
      size="sm"
      variant="ghost"
      className="p-1"
      onClick={() => navigate(`/finance/po/details/${item.id}`)}
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  const leftActions = (
    <>
      <Button
        style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
        className="hover:bg-[#F2EEE9]/90"
        onClick={() => navigate('/finance/po/add')}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-gray-600">PO</div>

      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4">PURCHASE ORDER LIST</h1>

      {/* Enhanced Table */}
      <EnhancedTable
        data={poData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="po-dashboard-columns"
        className="min-w-[1100px]"
        emptyMessage="No purchase orders found"
        selectAllLabel="Select all POs"
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search POs..."
        enableExport={true}
        exportFileName="purchase-orders"
        pagination={true}
        pageSize={2}
        enableSearch={true}
        leftActions={leftActions}
        onFilterClick={() => setIsFilterDialogOpen(true)}
      />

      {/* Filter Dialog */}
      <POFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
      />
    </div>
  );
};