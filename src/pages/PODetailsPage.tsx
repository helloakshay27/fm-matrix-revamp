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
        
        {/* Enhanced Amount Summary */}
        
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
        
      {/* Terms & Conditions Section */}
      
    </div>;
};