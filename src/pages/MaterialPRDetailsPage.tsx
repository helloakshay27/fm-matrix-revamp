
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';

export const MaterialPRDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - in real app this would come from API based on id
  const prData = {
    id: id || '11045',
    prNumber: '121250',
    referenceNo: '110318',
    adminApproval: 'Approved',
    date: '27/03/25',
    supplier: 'ABC',
    phone: 'rgfrgrthyjtgj',
    email: 'Neptune@gmail.com',
    gst: 'grjghlkngltn',
    deliveryAddress: 'Neptune\nNA',
    paymentTenure: '',
    tds: '',
    advanceAmount: '',
    plantDetail: '1212323234-Default Site Org-Plant for Lockated Site 1',
    address: 'Thane',
    pan: 'jknjknjfjkenkfk',
    relatedTo: 'Test',
    retention: '',
    qc: '',
    netAmount: '1000.00',
    amountInWords: 'One Thousand Rupees Only',
    items: [
      {
        sNo: 1,
        item: 'A4 Size Papers 3',
        availability: 'NA',
        sacHsnCode: '',
        expectedDate: '27/03/25',
        productDescription: 'Test',
        quantity: '10.0',
        unit: 'Piece',
        movingAvgRate: '',
        rate: '100.00',
        amount: '1000.00',
        approvedQty: '10',
        transferQty: '',
        wbsCode: ''
      }
    ],
    attachments: 'No attachments',
    termsConditions: ['Test'],
    sapResponse: {
      code: '',
      message: 'An internal server error occurred. The MPL ID for the failed message is : AGmImAmKt@pKgrTmKOa_VgGr_'
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Material PR {'>'} Material PR Details
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">MATERIAL PR DETAILS</h1>
          <span className="px-3 py-1 bg-green-500 text-white text-sm rounded">
            admin Approval: {prData.adminApproval}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={() => navigate(`/finance/material-pr/clone/${id}`)}
          >
            Clone
          </Button>
          <Button 
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={() => navigate(`/finance/material-pr/feeds/${id}`)}
          >
            Feeds
          </Button>
          <Button 
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={() => window.open(`/finance/material-pr/print/${id}`, '_blank')}
          >
            Print
          </Button>
          <div className="text-sm text-gray-600 bg-yellow-100 px-3 py-1 rounded flex items-center gap-2">
            🔒 LOCKATED
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-6">
        Page 1 - 27/03/2025
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border">
        {/* Contact Information Section */}
        <div className="grid grid-cols-2 gap-8 p-6 border-b">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <span className="text-gray-600">Phone</span>
              <span>: NA</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="text-gray-600">Email</span>
              <span>: Neptune@gmail.com</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="text-gray-600">PAN</span>
              <span>: NA</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <span className="text-gray-600">Fax</span>
              <span>: NA</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="text-gray-600">GST</span>
              <span>: NA</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="text-gray-600">Address</span>
              <span>: NA</span>
            </div>
          </div>
        </div>

        {/* Material PR Section */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Material PR</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">MPR No.</span>
                <span>: {prData.prNumber}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">MPR Date</span>
                <span>: {prData.date}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Plant Detail</span>
                <span>: {prData.plantDetail}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Address</span>
                <span>: {prData.address}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Email</span>
                <span>: xyz@gmail.com</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">PAN</span>
                <span>: {prData.pan}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Phone</span>
                <span>: NA</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Related To</span>
                <span>: {prData.relatedTo}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Retention(%)</span>
                <span>: -</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">QC(%)</span>
                <span>: -</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Reference No.</span>
                <span>: {prData.referenceNo}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">ID</span>
                <span>: 10435</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Supplier</span>
                <span>: {prData.supplier}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Phone</span>
                <span>: {prData.phone}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">GST</span>
                <span>: {prData.gst}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Delivery Address</span>
                <span>: {prData.deliveryAddress}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Email</span>
                <span>: {prData.email}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Payment Tenure(in Days)</span>
                <span>: -</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">TDS(%)</span>
                <span>: -</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600">Advance Amount</span>
                <span>: -</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6 border-b">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">S No.</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Item</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Availability</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">SAC/HSN Code</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Expected Date</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Product Description</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Quantity</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Unit</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Moving Avg Rate</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Rate</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Approved Qty</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Transfer Qty</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs text-left">Wbs Code</th>
                </tr>
              </thead>
              <tbody>
                {prData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.sNo}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.item}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.availability}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.sacHsnCode}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.expectedDate}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.productDescription}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.quantity}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.unit}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.movingAvgRate}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.rate}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.amount}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.approvedQty}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.transferQty}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{item.wbsCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-sm">
              <div><strong>Net Amount(INR):</strong> {prData.netAmount}</div>
              <div><strong>Amount In Words:</strong> {prData.amountInWords}</div>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-2">Attachments</h3>
          <p className="text-gray-600">{prData.attachments}</p>
        </div>

        {/* Terms & Conditions Section */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-2">Terms & Conditions:</h3>
          <ol className="list-decimal list-inside">
            {prData.termsConditions.map((term, index) => (
              <li key={index} className="text-gray-700">{term}</li>
            ))}
          </ol>
        </div>

        {/* SAP Response Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">SAP Response</h3>
          <div className="space-y-2">
            <div><strong>Code:</strong> {prData.sapResponse.code}</div>
            <div><strong>Message:</strong> {prData.sapResponse.message}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
