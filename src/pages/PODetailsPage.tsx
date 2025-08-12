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
    <div className="p-6 mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">PURCHASE ORDER DETAILS</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Level 1 Approval:</span>
            <span className="px-3 py-1 bg-green-500 text-white text-sm rounded font-medium">
              Approved
            </span>
          </div>
        </div>
        
        {/* Status and Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-500 text-white rounded font-medium">
            Status- Approved
          </div>
          <Button 
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <Copy className="w-4 h-4 mr-2" />
            Clone
          </Button>
          <Button 
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button 
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleFeeds}
          >
            <Rss className="w-4 h-4 mr-2" />
            Feeds
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Contact Information Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-gray-600 w-24">Phone</span>
                  <span className="font-medium">: {poDetails.phone}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">Email</span>
                  <span className="font-medium">: {poDetails.email}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">PAN</span>
                  <span className="font-medium">: {poDetails.pan}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-gray-600 w-24">Fax</span>
                  <span className="font-medium">: NA</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">GST</span>
                  <span className="font-medium">: {poDetails.gst}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">Address</span>
                  <span className="font-medium">: {poDetails.address}</span>
                </div>
              </div>
              
              {/* Image placeholder */}
              <div className="col-span-2 flex justify-end">
                <div className="w-32 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-sm">jyoti</span>
                  <br />
                  <span className="text-gray-400 text-xs">image</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Order Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">Purchase Order (Approved)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-gray-600 w-40">PO Number</span>
                  <span className="font-medium">: {poDetails.poNumber}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">PO Date</span>
                  <span className="font-medium">: 23.04.25</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Supplier</span>
                  <span className="font-medium">: {poDetails.supplier}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Phone</span>
                  <span className="font-medium">: NA</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">GST</span>
                  <span className="font-medium">: {poDetails.gst}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Delivery Address</span>
                  <span className="font-medium">: {poDetails.deliveryAddress}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Payment Tenure(In Days)</span>
                  <span className="font-medium">: {poDetails.paymentTenure}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-gray-600 w-40">Reference No.</span>
                  <span className="font-medium">: {orderDetails.referenceNo}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">ID</span>
                  <span className="font-medium">: {orderDetails.id}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Address</span>
                  <span className="font-medium">: {orderDetails.address}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Email</span>
                  <span className="font-medium">: {orderDetails.email}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">PAN</span>
                  <span className="font-medium">: {orderDetails.pan}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">TDS(%)</span>
                  <span className="font-medium">: {poDetails.tds}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Advance Amount</span>
                  <span className="font-medium">: {poDetails.advanceAmount}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Related To</span>
                  <span className="font-medium">: {poDetails.relatedTo}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Retention(%)</span>
                  <span className="font-medium">: {poDetails.retention}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">QC(%)</span>
                  <span className="font-medium">: {poDetails.qc}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table Card */}
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">S.No.</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Item Details</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">SAC/HSN Code</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Expected Date</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Quantity</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Unit</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Rate</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">WBS Code</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">CGST Rate(%)</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">CGST Amount</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">SGST Rate(%)</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">SGST Amount</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">IGST Rate(%)</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">IGST Amount</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">TDS Rate(%)</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">TDS Amount</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Tax Amount</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.sNo}>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.sNo}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.itemDetails}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.sacHsnCode}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.expectedDate}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.quantity}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.unit}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.rate}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.wbsCode}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.cgstRate}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.cgstAmount}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.sgstRate}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.sgstAmount}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.igstRate}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.igstAmount}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.tdsRate}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.tdsAmount}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.taxAmount}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm font-medium">{item.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Totals Section */}
              <div className="mt-6 flex justify-end">
                <div className="w-80 space-y-2 text-sm border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Amount(INR):</span>
                    <span className="font-medium">2360.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Amount:</span>
                    <span className="font-medium">2360.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes:</span>
                    <span className="font-medium">0.00</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>Net Invoice Amount:</span>
                    <span>2360.00</span>
                  </div>
                  <div className="mt-4 text-gray-700">
                    <strong>Amount in Words:</strong> Two Thousand, Three Hundred, Sixty Rupees Only
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">1. test</p>
            </CardContent>
          </Card>

          {/* Terms & Conditions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">NA</p>
            </CardContent>
          </Card>
        </div>

        {/* Attachments Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img src="/placeholder.svg" alt="Steel attachment" className="w-16 h-16 object-cover rounded border" />
              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">steel.jpg</span>
            </div>
          </CardContent>
        </Card>

        {/* Signature Card */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-700">For Jyoti we Confirm & Accept,</p>
              <div className="mt-8">
                <p className="text-sm font-medium">Authorised Signatory</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">GRN Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No GRN details available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No payment details available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Debit/Credit Note Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No debit/credit note details available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
