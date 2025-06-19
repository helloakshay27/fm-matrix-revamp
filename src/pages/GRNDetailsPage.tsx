import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const GRNDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleFeedsClick = () => {
    navigate(`/finance/grn-srn/feeds/${id}`);
  };

  const grnData = {
    id: "6703",
    supplier: "ABC",
    phone: "7239013238",
    email: "stylorssamenayyo146@gmail.com",
    pan: "BGGBF770796",
    invoiceNumber: "123",
    invoiceDate: "22-04-25",
    postingDate: "22-04-25",
    retentionAmount: "0.0",
    tdsAmount: "0.0",
    poReferenceNumber: "",
    grnAmount: "1800.0",
    paymentMode: "",
    payableAmount: "2124.0",
    relatedTo: "",
    physicalInvoiceSentTo: "",
    grossAmount: "2124.0",
    notes: "",
    jyoti: {
      fax: "178788guy#65r65",
      gst: "7jqfy8N76657",
      address: "demo world"
    },
    grn: {
      referenceNo: "",
      id: "6703",
      supplierName: "ABC",
      poNumber: "121249",
      qcAmount: "0.0",
      totalTaxes: "324.0",
      poAmount: "2720.0",
      invoiceAmount: "2720.0",
      grnAmount: "1800.0",
      physicalInvoiceReceived: ""
    }
  };

  const inventoryData = [
    {
      inventory: "Carpet Brush",
      expectedQuantity: "10.0",
      receivedQuantity: "9",
      unit: "70.0",
      rate: "9.0",
      approvedQty: "0.0",
      rejectedQty: "0.0",
      cgstRate: "9.0",
      cgstAmount: "56.7",
      sgstRate: "9.0",
      sgstAmount: "56.7",
      igstRate: "NA",
      igstAmount: "0.0"
    },
    {
      inventory: "Cruet Set",
      expectedQuantity: "10.0",
      receivedQuantity: "9",
      unit: "130.0",
      rate: "9.0",
      approvedQty: "0.0",
      rejectedQty: "0.0",
      cgstRate: "9.0",
      cgstAmount: "105.3",
      sgstRate: "9.0",
      sgstAmount: "105.3",
      igstRate: "NA",
      igstAmount: "0.0"
    }
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        GRN Order &gt; GRN Details
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">GRN DETAILS</h1>
        <div className="flex gap-2">
          <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
            Print
          </Button>
          <Button 
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={handleFeedsClick}
          >
            Feeds
          </Button>
        </div>
      </div>

      {/* Approval Status */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Level 1 Approval:</span>
          <span className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approved</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Sony Bhosle - 22/04/2025
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Supplier Details */}
        <div className="space-y-6">
          {/* Supplier Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">jyoti</h3>
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">image</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2">{grnData.phone}</span>
              </div>
              <div>
                <span className="text-gray-600">Fax:</span>
                <span className="ml-2">{grnData.jyoti.fax}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2">{grnData.email}</span>
              </div>
              <div>
                <span className="text-gray-600">GST:</span>
                <span className="ml-2">{grnData.jyoti.gst}</span>
              </div>
              <div>
                <span className="text-gray-600">PAN:</span>
                <span className="ml-2">{grnData.pan}</span>
              </div>
              <div>
                <span className="text-gray-600">Address:</span>
                <span className="ml-2">{grnData.jyoti.address}</span>
              </div>
            </div>
          </div>

          {/* GRN Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">GRN</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Invoice Number:</span>
                <span className="ml-2">{grnData.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Reference No.:</span>
                <span className="ml-2">{grnData.grn.referenceNo || '-'}</span>
              </div>
              <div>
                <span className="text-gray-600">Invoice Date:</span>
                <span className="ml-2">{grnData.invoiceDate}</span>
              </div>
              <div>
                <span className="text-gray-600">ID:</span>
                <span className="ml-2">{grnData.grn.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Posting Date:</span>
                <span className="ml-2">{grnData.postingDate}</span>
              </div>
              <div>
                <span className="text-gray-600">Supplier Name:</span>
                <span className="ml-2">{grnData.grn.supplierName}</span>
              </div>
              <div>
                <span className="text-gray-600">Retention Amount:</span>
                <span className="ml-2">{grnData.retentionAmount}</span>
              </div>
              <div>
                <span className="text-gray-600">PO Number:</span>
                <span className="ml-2">{grnData.grn.poNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">TDS Amount:</span>
                <span className="ml-2">{grnData.tdsAmount}</span>
              </div>
              <div>
                <span className="text-gray-600">QC Amount:</span>
                <span className="ml-2">{grnData.grn.qcAmount}</span>
              </div>
              <div>
                <span className="text-gray-600">PO Reference Number:</span>
                <span className="ml-2">{grnData.poReferenceNumber || '-'}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Taxes:</span>
                <span className="ml-2">{grnData.grn.totalTaxes}</span>
              </div>
              <div>
                <span className="text-gray-600">GRN Amount:</span>
                <span className="ml-2">{grnData.grnAmount}</span>
              </div>
              <div>
                <span className="text-gray-600">PO Amount:</span>
                <span className="ml-2">{grnData.grn.poAmount}</span>
              </div>
              <div>
                <span className="text-gray-600">Payment Mode:</span>
                <span className="ml-2">{grnData.paymentMode || '-'}</span>
              </div>
              <div>
                <span className="text-gray-600">Invoice Amount:</span>
                <span className="ml-2">{grnData.grn.invoiceAmount}</span>
              </div>
              <div>
                <span className="text-gray-600">Payable Amount:</span>
                <span className="ml-2">{grnData.payableAmount}</span>
              </div>
              <div>
                <span className="text-gray-600">GRN Amount:</span>
                <span className="ml-2">{grnData.grn.grnAmount}</span>
              </div>
              <div>
                <span className="text-gray-600">Related To:</span>
                <span className="ml-2">{grnData.relatedTo || '-'}</span>
              </div>
              <div>
                <span className="text-gray-600">Physical Invoice received on:</span>
                <span className="ml-2">{grnData.grn.physicalInvoiceReceived || '-'}</span>
              </div>
              <div>
                <span className="text-gray-600">Physical Invoice sent to:</span>
                <span className="ml-2">{grnData.physicalInvoiceSentTo || '-'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Gross Amount:</span>
                <span className="ml-2">{grnData.grossAmount}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Notes:</span>
                <span className="ml-2">{grnData.notes || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column would contain additional details */}
        <div className="space-y-6">
          {/* Placeholder for additional content */}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Inventory</TableHead>
              <TableHead>Expected Quantity</TableHead>
              <TableHead>Received Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Approved Qty</TableHead>
              <TableHead>Rejected Qty</TableHead>
              <TableHead>CGST Rate</TableHead>
              <TableHead>CGST Amount</TableHead>
              <TableHead>SGST Rate</TableHead>
              <TableHead>SGST Amount</TableHead>
              <TableHead>IGST Rate</TableHead>
              <TableHead>IGST Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.inventory}</TableCell>
                <TableCell>{item.expectedQuantity}</TableCell>
                <TableCell>{item.receivedQuantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.rate}</TableCell>
                <TableCell>{item.approvedQty}</TableCell>
                <TableCell>{item.rejectedQty}</TableCell>
                <TableCell>{item.cgstRate}</TableCell>
                <TableCell>{item.cgstAmount}</TableCell>
                <TableCell>{item.sgstRate}</TableCell>
                <TableCell>{item.sgstAmount}</TableCell>
                <TableCell>{item.igstRate}</TableCell>
                <TableCell>{item.igstAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Other Expenses, Loading Expenses, Adjustment Amount sections */}
      <div className="mt-6 space-y-4">
        <div className="bg-gray-100 p-3 rounded">
          <strong>Other Expenses:</strong>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <strong>Loading Expenses:</strong>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <strong>Adjustment Amount:</strong>
        </div>
      </div>

      {/* Attachments */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Attachments</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-200 rounded flex items-center justify-center">
            <span className="text-xs">📄</span>
          </div>
          <span className="text-sm">brick.jpg</span>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Attachments</h4>
          <span className="text-sm text-gray-600">no attachment</span>
        </div>
      </div>

      {/* Additional Tables */}
      <div className="mt-8 space-y-6">
        <div className="bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold p-4 border-b">Debit Note Details</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Approved On</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Attachment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold p-4 border-b">Payment Details</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Transaction Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date of Entry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold p-4 border-b">Retention Payment Details</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Transaction Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date of Entry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold p-4 border-b">QC Payment Details</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Transaction Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date of Entry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
