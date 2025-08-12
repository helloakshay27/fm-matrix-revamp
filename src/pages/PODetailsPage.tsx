import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from 'react-router-dom';
import { Printer, MessageSquare, Edit, Copy, Rss } from 'lucide-react';

export const PODetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const items = [
    {
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
    },
    {
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
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleFeeds = () => {
    navigate(`/finance/po/feeds/${id}`);
  };

  return (
    <div className="p-6 mx-auto max-w-7xl bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Purchase Order &gt; Purchase Order Details
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Purchase Order DETAILS</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">L1 Approval:</span>
            <span className="px-3 py-1 bg-green-500 text-white text-sm rounded font-medium">
              Approved
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <Button 
          variant="outline"
          className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
        >
          <Copy className="w-4 h-4 mr-2" />
          Clone
        </Button>
        <Button 
          variant="outline"
          className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
          onClick={handleFeeds}
        >
          <Rss className="w-4 h-4 mr-2" />
          Feeds
        </Button>
        <Button 
          variant="outline"
          className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
          onClick={handlePrint}
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        
        {/* Logo placeholder */}
        <div className="ml-8 w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500 text-xs">logo</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg p-6 mb-6">
        {/* Contact Information Section */}
        <div className="grid grid-cols-2 gap-12 mb-8 pb-6 border-b border-gray-200">
          <div className="space-y-3">
            <div className="flex">
              <span className="text-gray-600 w-24 flex-shrink-0">Phone</span>
              <span className="font-medium">: {poDetails.phone}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-24 flex-shrink-0">Email</span>
              <span className="font-medium">: {poDetails.email}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-24 flex-shrink-0">PAN</span>
              <span className="font-medium">: {poDetails.pan}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex">
              <span className="text-gray-600 w-24 flex-shrink-0">Fax</span>
              <span className="font-medium">: NA</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-24 flex-shrink-0">GST</span>
              <span className="font-medium">: {poDetails.gst}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-24 flex-shrink-0">Address</span>
              <span className="font-medium">: {poDetails.address}</span>
            </div>
          </div>
        </div>

        {/* Purchase Order Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-6">Purchase Order</h3>
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">PO No.</span>
                <span className="font-medium">: {poDetails.poNumber}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">PO Date</span>
                <span className="font-medium">: 23-04-25</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Plant Detail</span>
                <span className="font-medium">: --Test-123</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Address</span>
                <span className="font-medium">: {orderDetails.address}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Email</span>
                <span className="font-medium">: {orderDetails.email}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">PAN</span>
                <span className="font-medium">: {orderDetails.pan}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Phone</span>
                <span className="font-medium">: {orderDetails.phone}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Related To</span>
                <span className="font-medium">: {poDetails.relatedTo}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Retention(%)</span>
                <span className="font-medium">: {poDetails.retention}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">QC(%)</span>
                <span className="font-medium">: {poDetails.qc}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Reference No.</span>
                <span className="font-medium">: {orderDetails.referenceNo}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">ID</span>
                <span className="font-medium">: {orderDetails.id}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Supplier</span>
                <span className="font-medium">: {poDetails.supplier}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Phone</span>
                <span className="font-medium">: NA</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">GST</span>
                <span className="font-medium">: {poDetails.gst}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Delivery Address</span>
                <span className="font-medium">: {poDetails.deliveryAddress}<br />demo world</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Email</span>
                <span className="font-medium">: {poDetails.email}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Payment Tenure(In Days)</span>
                <span className="font-medium">: {poDetails.paymentTenure}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">TDS(%)</span>
                <span className="font-medium">: {poDetails.tds}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-40 flex-shrink-0">Advance Amount</span>
                <span className="font-medium">: {poDetails.advanceAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">S.No.</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Item</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Availability</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">SAC/HSN Code</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Expected Date</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Product Description</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Quantity</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Unit</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Moving Avg Rate</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Rate</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Amount</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Approved Qty</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Transfer Qty</th>
                <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Wbs Code</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.sNo}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
