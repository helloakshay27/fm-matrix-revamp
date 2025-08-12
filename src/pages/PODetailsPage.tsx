import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from 'react-router-dom';
import { Printer, MessageSquare, Edit, Copy, Rss } from 'lucide-react';
export const PODetailsPage = () => {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const poDetails = {
    poNumber: "121240",
    createdBy: "Sony Bhosle",
    createdOn: "22/04/2025",
    supplier: "ABC",
    status: "L1 Approval - Approved",
    phone: "7234013238",
    email: "xyz@zaamserveyservice@gmail.com",
    pan: "BCCGP779796",
    address: "demo world",
    gst: "NA",
    deliveryAddress: "jyoti",
    paymentTenure: "-",
    tds: "NA",
    advanceAmount: "-",
    relatedTo: "NA",
    retention: "-",
    qc: "-"
  };
  const orderDetails = {
    referenceNo: "121249",
    id: "10712",
    address: "MUMBAI MH - INDIA",
    email: "rajnish.patil@loclated.com",
    pan: "NA",
    phone: "7234013238"
  };
  const items = [{
    sNo: 1,
    itemDetails: "Carpet Brush",
    sacHsnCode: "NA",
    expectedDate: "23/04/25",
    quantity: "10.0",
    unit: "",
    rate: "70.00",
    wbsCode: "",
    cgstRate: "9.00",
    cgstAmount: "63.00",
    sgstRate: "9.00",
    sgstAmount: "63.00",
    igstRate: "0.00",
    igstAmount: "0.00",
    ugstRate: "0.00",
    ugstAmount: "0.00",
    tdsRate: "0.00",
    tdsAmount: "0.00",
    taxAmount: "",
    totalAmount: "826.00"
  }, {
    sNo: 2,
    itemDetails: "Chair Set",
    sacHsnCode: "NA",
    expectedDate: "23/04/25",
    quantity: "10.0",
    unit: "",
    rate: "190.00",
    wbsCode: "",
    cgstRate: "9.00",
    cgstAmount: "117.00",
    sgstRate: "9.00",
    sgstAmount: "117.00",
    igstRate: "0.00",
    igstAmount: "0.00",
    ugstRate: "0.00",
    ugstAmount: "0.00",
    tdsRate: "0.00",
    tdsAmount: "0.00",
    taxAmount: "",
    totalAmount: "1534.00"
  }];
  const handlePrint = () => {
    window.print();
  };
  const handleFeeds = () => {
    navigate(`/finance/po/feeds/${id}`);
  };
  return <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-gray-600">
        <span className="cursor-pointer hover:text-[#C72030]" onClick={() => navigate('/finance/po')}>
          Purchase Order
        </span>
        {' > '}
        <span>Purchase Order Details</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="font-work-sans font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2">
            PURCHASE ORDER DETAILS
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">L1 Approval:</span>
            <span className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium">
              Approved
            </span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700">
              <Copy className="w-4 h-4 mr-1" />
              Clone
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700" onClick={handleFeeds}>
              <Rss className="w-4 h-4 mr-1" />
              Feeds
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
          </div>
          
          {/* Logo placeholder */}
          
        </div>
      </div>

      {/* Vendor/Contact Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Contact details */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <span className="ml-8">: {poDetails.phone}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Fax</span>
                <span className="ml-12">: NA</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="ml-8">: {poDetails.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">GST</span>
                <span className="ml-11">: {poDetails.gst}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">PAN</span>
                <span className="ml-9">: {poDetails.pan}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Address</span>
                <span className="ml-5">: {poDetails.address}</span>
              </div>
            </div>
          </div>

          {/* Center - Vendor name */}
          <div className="flex flex-col items-center justify-center lg:min-w-[200px]">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">jyoti</h2>
            <div className="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-500">image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Order Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Purchase Order (Approved)
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">PO No.</span>
              <span className="text-sm">: {poDetails.poNumber}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">PO Date</span>
              <span className="text-sm">: 23-04-25</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Plant Detail</span>
              <span className="text-sm">: --Test-123</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Address</span>
              <span className="text-sm">: {orderDetails.address}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Email</span>
              <span className="text-sm">: {orderDetails.email}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">PAN</span>
              <span className="text-sm">: {orderDetails.pan}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Phone</span>
              <span className="text-sm">: {orderDetails.phone}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Related To</span>
              <span className="text-sm">: {poDetails.relatedTo}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Retention(%)</span>
              <span className="text-sm">: {poDetails.retention}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">QC(%)</span>
              <span className="text-sm">: {poDetails.qc}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Reference No.</span>
              <span className="text-sm">: {orderDetails.referenceNo}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">ID</span>
              <span className="text-sm">: {orderDetails.id}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Supplier</span>
              <span className="text-sm">: {poDetails.supplier}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Phone</span>
              <span className="text-sm">: NA</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">GST</span>
              <span className="text-sm">: {poDetails.gst}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Delivery Address</span>
              <span className="text-sm">: {poDetails.deliveryAddress}<br />demo world</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Email</span>
              <span className="text-sm">: {poDetails.email}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Payment Tenure(In Days)</span>
              <span className="text-sm">: {poDetails.paymentTenure}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">TDS(%)</span>
              <span className="text-sm">: {poDetails.tds}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-44">Advance Amount</span>
              <span className="text-sm">: {poDetails.advanceAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 min-w-[1200px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">S.No.</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Item</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Availability</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">SAC/HSN Code</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Expected Date</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Product Description</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Quantity</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Unit</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Moving Avg Rate</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Rate</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Amount</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Approved Qty</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Transfer Qty</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Wbs Code</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => <tr key={item.sNo} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 text-sm text-center">{item.sNo}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.itemDetails}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm"></td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.sacHsnCode}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.expectedDate}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">Testing</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.quantity}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">Piece</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">70.0</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.rate}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.totalAmount}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">20.0</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm"></td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.wbsCode}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
        
        {/* Summary Section */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Net Amount (INR):</span>
            <span className="font-medium">3,560.00</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Total Taxable Value Of PO:</span>
            <span className="font-medium">3,560.00</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Taxes (INR):</span>
            <span className="font-medium">0.00</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t">
            <span className="font-semibold text-gray-900">Total PO Value (INR):</span>
            <span className="font-semibold">3,560.00</span>
          </div>
          <div className="mt-4">
            <span className="font-medium text-gray-700">Amount In Words: </span>
            <span className="text-gray-900">Three Thousand, Five Hundred, Sixty Rupees Only</span>
          </div>
        </div>
      </div>

      {/* Notes and Terms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="font-semibold text-gray-800">Notes</span>
          </div>
          <div className="text-gray-600 bg-white rounded p-3 border">
            NA
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-5 border border-green-200">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-semibold text-gray-800">Terms & Conditions</span>
          </div>
          <div className="text-gray-600 bg-white rounded p-3 border">
            NA
          </div>
        </div>
      </div>

      {/* Enhanced Signature Section */}
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 mb-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Document Approval
          </div>
          <p className="text-gray-700 font-medium text-lg">For NA we Confirm & Accept</p>
        </div>
        
        <div className="flex justify-center">
          <div className="text-center">
            <div className="w-64 h-20 border-2 border-dashed border-gray-400 rounded bg-white flex items-center justify-center mb-3">
              <span className="text-gray-400 text-sm">Signature Area</span>
            </div>
            <div className="border-t-2 border-gray-800 w-48 mx-auto mb-2"></div>
            <span className="font-semibold text-gray-800">Authorised Signatory</span>
            <div className="text-xs text-gray-500 mt-1">Date: _______________</div>
          </div>
        </div>
      </div>
        
      {/* Attachments Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
        <div className="flex items-center gap-2 text-blue-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="cursor-pointer hover:underline">PSIPL_Feedback_QR_code.pptx.pdf</span>
        </div>
      </div>

      {/* GRN Details Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">GRN Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 min-w-[1600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Action</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">ID</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Inventory</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Supplier</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Invoice Number</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Total GRN Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Payable Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Retention Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">TDS Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">QC Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Invoice Date</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Payment Mode</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Other Expense</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Loading Expense</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Adjustment Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">QC Approval Status</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">HSE Approval Status</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Admin Approval Status</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left font-semibold">Physical Invoice Sent to Accounts</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center text-gray-500">
                  <td colSpan={19} className="border border-gray-300 px-3 py-4 text-sm">
                    No GRN data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 min-w-[800px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">GRN ID</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Amount</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payment Mode</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Transaction Number</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Status</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payment Date</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Note</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Date Of Entry</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center text-gray-500">
                  <td colSpan={8} className="border border-gray-300 px-3 py-4 text-sm">
                    No payment data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Debit/Credit Note Details Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Debit/Credit Note Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 min-w-[1000px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">ID</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Type</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Amount</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Description</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Approved</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Approved On</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Approved By</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Created On</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Created By</th>
                  <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Attachment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center text-gray-500">
                  <td colSpan={10} className="border border-gray-300 px-3 py-4 text-sm">
                    No debit/credit note data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};