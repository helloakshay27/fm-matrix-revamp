import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import { Printer, MessageSquare } from 'lucide-react';

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
    <div className="p-6 mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Purchase Order &gt; Purchase Order Details
      </div>

      {/* Page Title and Actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">PURCHASE ORDER DETAILS</h1>
        <div className="flex gap-3">
          <div className="bg-green-500 text-white px-3 py-1 rounded text-sm">
            {poDetails.status}
          </div>
          <Button
            onClick={handleFeeds}
            style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
            className="hover:bg-[#F2EEE9]/90"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Feeds
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
            className="hover:bg-[#F2EEE9]/90"
          >
            Debit/Credit Note
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Jyoti</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Phone:</span>
                <span>{poDetails.phone}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Email:</span>
                <span>{poDetails.email}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">PAN:</span>
                <span>{poDetails.pan}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Address:</span>
                <span>{poDetails.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Purchase Order</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Reference No:</span>
                <span>{orderDetails.referenceNo}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">ID:</span>
                <span>{orderDetails.id}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Address:</span>
                <span>{orderDetails.address}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Email:</span>
                <span>{orderDetails.email}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">PAN:</span>
                <span>{orderDetails.pan}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Phone:</span>
                <span>{orderDetails.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PO Details Table */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2">
              <span className="text-gray-600">PO No:</span>
              <span>-</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">PO Date:</span>
              <span>23.04.25</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Supplier:</span>
              <span>ABC</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Phone:</span>
              <span>NA</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">GST:</span>
              <span>NA</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Delivery Address:</span>
              <span>jyoti</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Email:</span>
              <span>xyz@zaamserveyservice@gmail.com</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Payment Tenure(In Days):</span>
              <span>-</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">TDS(%):</span>
              <span>-</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Advance Amount:</span>
              <span>-</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Related To:</span>
              <span>NA</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Retention(%):</span>
              <span>-</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">QC(%):</span>
              <span>-</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-2 py-2">S.No.</th>
                <th className="border border-gray-300 px-2 py-2">Item Details</th>
                <th className="border border-gray-300 px-2 py-2">SAC/HSN Code</th>
                <th className="border border-gray-300 px-2 py-2">Expected Date</th>
                <th className="border border-gray-300 px-2 py-2">Quantity</th>
                <th className="border border-gray-300 px-2 py-2">Unit</th>
                <th className="border border-gray-300 px-2 py-2">Rate</th>
                <th className="border border-gray-300 px-2 py-2">WBS Code</th>
                <th className="border border-gray-300 px-2 py-2">CGST Rate(%)</th>
                <th className="border border-gray-300 px-2 py-2">CGST Amount</th>
                <th className="border border-gray-300 px-2 py-2">SGST Rate(%)</th>
                <th className="border border-gray-300 px-2 py-2">SGST Amount</th>
                <th className="border border-gray-300 px-2 py-2">IGST Rate(%)</th>
                <th className="border border-gray-300 px-2 py-2">IGST Amount</th>
                <th className="border border-gray-300 px-2 py-2">TDS Rate(%)</th>
                <th className="border border-gray-300 px-2 py-2">TDS Amount</th>
                <th className="border border-gray-300 px-2 py-2">Tax Amount</th>
                <th className="border border-gray-300 px-2 py-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.sNo}>
                  <td className="border border-gray-300 px-2 py-2 text-center">{item.sNo}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.itemDetails}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.sacHsnCode}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.expectedDate}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.quantity}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.unit}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.rate}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.wbsCode}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.cgstRate}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.cgstAmount}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.sgstRate}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.sgstAmount}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.igstRate}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.igstAmount}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.tdsRate}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.tdsAmount}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.taxAmount}</td>
                  <td className="border border-gray-300 px-2 py-2 font-medium">{item.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Net Amount(INR):</span>
              <span className="font-medium">2360.00</span>
            </div>
            <div className="flex justify-between">
              <span>Gross Amount:</span>
              <span className="font-medium">2360.00</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes:</span>
              <span className="font-medium">0.00</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Net Invoice Amount:</span>
              <span className="font-medium">2360.00</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="font-medium mb-2">Amount in Words: Two Thousand, Three Hundred, Sixty Rupees Only</div>
        </div>

        {/* Notes and Terms */}
        <div className="space-y-4 mb-8">
          <div>
            <h4 className="font-medium mb-2">Notes:</h4>
            <p className="text-sm">1. test</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Terms & Conditions:</h4>
            <p className="text-sm">NA</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm">For Jyoti we Confirm & Accept,</p>
          <div className="mt-8">
            <p className="text-sm font-medium">Authorised Signatory</p>
          </div>
        </div>

        {/* Attachments */}
        <div className="mb-8">
          <h4 className="font-medium mb-4">Attachments</h4>
          <div className="flex items-center gap-4">
            <img src="/placeholder.svg" alt="Steel attachment" className="w-16 h-16 object-cover rounded" />
            <span className="text-sm text-blue-600">steel.jpg</span>
          </div>
        </div>

        {/* GRN Details, Payment Details, and Debit/Credit Note Details sections would go here */}
        {/* Simplified for now */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">GRN Details</h4>
            <div className="text-sm text-gray-500">No GRN details available</div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Payment Details</h4>
            <div className="text-sm text-gray-500">No payment details available</div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Debit/Credit Note Details</h4>
            <div className="text-sm text-gray-500">No debit/credit note details available</div>
          </div>
        </div>
      </div>
    </div>
  );
};
