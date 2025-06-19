
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Copy, MessageSquare, Printer, Lock } from "lucide-react";

export const MaterialPRDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data - in real app this would be fetched based on ID
  const materialPRData = {
    11045: {
      id: 11045,
      prNumber: "121250",
      referenceNo: "121250",
      supplierName: "ABC",
      createdBy: "Abhishek Sharma",
      createdOn: "15/05/2025",
      lastApprovedBy: "",
      approvedStatus: "Pending",
      prAmount: "₹ 3,560",
      activeInactive: true,
      details: {
        phone: "NA",
        email: "Neptune@gmail.com",
        pan: "NA",
        fax: "NA",
        gst: "NA",
        address: "NA",
        mprNo: "",
        mprDate: "27-03-25",
        plantDetail: "121233234-Default Sale Org-Plant for Locktated Site 1",
        addressDetail: "Thane",
        emailDetail: "xyz@gmail.com",
        panDetail: "jknknjkjnkenkfk",
        phoneDetail: "NA",
        relatedTo: "Test",
        retention: "",
        qc: "",
        referenceNumber: "110318",
        idNumber: "10435",
        supplier: "ABC",
        phoneNumber: "rgrgrtvjgj",
        gstNumber: "grjghjngjfn",
        deliveryAddress: "Neptune\nNA",
        emailAddress: "Neptune@gmail.com",
        paymentTenure: "",
        tds: "",
        advanceAmount: ""
      },
      items: [
        {
          sNo: 1,
          item: "A4 Size Papers 3",
          availability: "NA",
          sacHsnCode: "",
          expectedDate: "27/03/25",
          productDescription: "Test",
          quantity: "10.0",
          unit: "Piece",
          movingAvgRate: "",
          rate: "100.00",
          amount: "1000.00",
          approvedQty: "10",
          transferQty: "",
          wbsCode: ""
        }
      ],
      netAmount: "1000.00",
      amountInWords: "One Thousand Rupees Only",
      attachments: "No attachments",
      termsConditions: ["Test"],
      sapResponse: {
        code: "",
        message: "An internal server error occurred. The MPL ID for the failed message is : AGmIImAnM8pXgrTmkiOz_WgF..."
      }
    }
  };

  const currentPR = materialPRData[id as keyof typeof materialPRData] || materialPRData[11045];

  const handleClone = () => {
    navigate('/finance/material-pr/clone');
  };

  const handleFeeds = () => {
    navigate(`/finance/material-pr/feeds/${id}`);
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Material PR - ${currentPR.prNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .logo { font-weight: bold; font-size: 18px; }
            .status { background: #22c55e; color: white; padding: 4px 8px; border-radius: 4px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .detail-item { margin: 5px 0; }
            .detail-label { font-weight: bold; display: inline-block; width: 150px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f5f5f5; }
            .total-section { margin: 20px 0; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">NEPTUNE</div>
            <div>
              <span>admin Approval: </span>
              <span class="status">Approved</span>
            </div>
          </div>
          
          <h2>MATERIAL PR</h2>
          <p>Pspl 1 - 27/03/2025</p>
          
          <div class="details-grid">
            <div>
              <div class="detail-item">
                <span class="detail-label">MPR No.:</span> ${currentPR.details.mprNo}
              </div>
              <div class="detail-item">
                <span class="detail-label">MPR Date:</span> ${currentPR.details.mprDate}
              </div>
              <div class="detail-item">
                <span class="detail-label">Plant Detail:</span> ${currentPR.details.plantDetail}
              </div>
              <div class="detail-item">
                <span class="detail-label">Address:</span> ${currentPR.details.addressDetail}
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span> ${currentPR.details.emailDetail}
              </div>
              <div class="detail-item">
                <span class="detail-label">PAN:</span> ${currentPR.details.panDetail}
              </div>
            </div>
            
            <div>
              <div class="detail-item">
                <span class="detail-label">Reference No.:</span> ${currentPR.details.referenceNumber}
              </div>
              <div class="detail-item">
                <span class="detail-label">ID:</span> ${currentPR.details.idNumber}
              </div>
              <div class="detail-item">
                <span class="detail-label">Supplier:</span> ${currentPR.details.supplier}
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone:</span> ${currentPR.details.phoneNumber}
              </div>
              <div class="detail-item">
                <span class="detail-label">GST:</span> ${currentPR.details.gstNumber}
              </div>
              <div class="detail-item">
                <span class="detail-label">Delivery Address:</span> ${currentPR.details.deliveryAddress}
              </div>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Item</th>
                <th>Availability</th>
                <th>SAC/HSN Code</th>
                <th>Expected Date</th>
                <th>Product Description</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Moving Avg Rate</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Approved Qty</th>
                <th>Transfer Qty</th>
                <th>Wbs Code</th>
              </tr>
            </thead>
            <tbody>
              ${currentPR.items.map(item => `
                <tr>
                  <td>${item.sNo}</td>
                  <td>${item.item}</td>
                  <td>${item.availability}</td>
                  <td>${item.sacHsnCode}</td>
                  <td>${item.expectedDate}</td>
                  <td>${item.productDescription}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unit}</td>
                  <td>${item.movingAvgRate}</td>
                  <td>${item.rate}</td>
                  <td>${item.amount}</td>
                  <td>${item.approvedQty}</td>
                  <td>${item.transferQty}</td>
                  <td>${item.wbsCode}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div><strong>Net Amount(INR): ${currentPR.netAmount}</strong></div>
            <div><strong>Amount In Words: ${currentPR.amountInWords}</strong></div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">
          Material PR &gt; Material PR Details
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Material PR DETAILS</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm">admin Approval:</span>
            <Badge className="bg-green-500 text-white">Approved</Badge>
            <div className="flex items-center gap-1 text-gray-500">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">LOCKTATED</span>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Pspl 1 - 27/03/2025
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button 
          onClick={handleClone}
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
        >
          <Copy className="w-4 h-4 mr-2" />
          Clone
        </Button>
        <Button 
          onClick={handleFeeds}
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Feeds
        </Button>
        <Button 
          onClick={handlePrint}
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          <div className="flex">
            <span className="w-20 text-gray-600">Phone</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.phone}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-gray-600">Fax</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.fax}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-gray-600">Email</span>
            <span className="text-gray-600 mr-4">:</span>
            <span className="text-blue-600">{currentPR.details.email}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-gray-600">GST</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.gst}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-gray-600">PAN</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.pan}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-gray-600">Address</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.address}</span>
          </div>
        </div>
      </div>

      {/* Material PR Details */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Material PR</h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          <div className="flex">
            <span className="w-32 text-gray-600">MPR No.</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.mprNo}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Reference No.</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.referenceNumber}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">MPR Date</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.mprDate}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">ID</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.idNumber}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Plant Detail</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.plantDetail}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Supplier</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.supplier}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Address</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.addressDetail}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Phone</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.phoneNumber}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Email</span>
            <span className="text-gray-600 mr-4">:</span>
            <span className="text-blue-600">{currentPR.details.emailDetail}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">GST</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.gstNumber}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">PAN</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.panDetail}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Delivery Address</span>
            <span className="text-gray-600 mr-4">:</span>
            <span className="whitespace-pre-line">{currentPR.details.deliveryAddress}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Phone</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.phoneDetail}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Email</span>
            <span className="text-gray-600 mr-4">:</span>
            <span className="text-blue-600">{currentPR.details.emailAddress}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Related To</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.relatedTo}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Payment Tenure(in Days)</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.paymentTenure}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Retention(%)</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.retention}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">TDS(%)</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.tds}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">QC(%)</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.qc}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Advance Amount</span>
            <span className="text-gray-600 mr-4">:</span>
            <span>{currentPR.details.advanceAmount}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg border p-6 mb-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-left">S.No.</th>
              <th className="border border-gray-300 p-2 text-left">Item</th>
              <th className="border border-gray-300 p-2 text-left">Availability</th>
              <th className="border border-gray-300 p-2 text-left">SAC/HSN Code</th>
              <th className="border border-gray-300 p-2 text-left">Expected Date</th>
              <th className="border border-gray-300 p-2 text-left">Product Description</th>
              <th className="border border-gray-300 p-2 text-left">Quantity</th>
              <th className="border border-gray-300 p-2 text-left">Unit</th>
              <th className="border border-gray-300 p-2 text-left">Moving Avg Rate</th>
              <th className="border border-gray-300 p-2 text-left">Rate</th>
              <th className="border border-gray-300 p-2 text-left">Amount</th>
              <th className="border border-gray-300 p-2 text-left">Approved Qty</th>
              <th className="border border-gray-300 p-2 text-left">Transfer Qty</th>
              <th className="border border-gray-300 p-2 text-left">Wbs Code</th>
            </tr>
          </thead>
          <tbody>
            {currentPR.items.map((item) => (
              <tr key={item.sNo}>
                <td className="border border-gray-300 p-2">{item.sNo}</td>
                <td className="border border-gray-300 p-2">{item.item}</td>
                <td className="border border-gray-300 p-2">{item.availability}</td>
                <td className="border border-gray-300 p-2">{item.sacHsnCode}</td>
                <td className="border border-gray-300 p-2">{item.expectedDate}</td>
                <td className="border border-gray-300 p-2">{item.productDescription}</td>
                <td className="border border-gray-300 p-2">{item.quantity}</td>
                <td className="border border-gray-300 p-2">{item.unit}</td>
                <td className="border border-gray-300 p-2">{item.movingAvgRate}</td>
                <td className="border border-gray-300 p-2">{item.rate}</td>
                <td className="border border-gray-300 p-2">{item.amount}</td>
                <td className="border border-gray-300 p-2">{item.approvedQty}</td>
                <td className="border border-gray-300 p-2">{item.transferQty}</td>
                <td className="border border-gray-300 p-2">{item.wbsCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4 text-right">
          <div className="font-semibold">Net Amount(INR): {currentPR.netAmount}</div>
          <div className="font-semibold">Amount In Words: {currentPR.amountInWords}</div>
        </div>
      </div>

      {/* Attachments */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Attachments</h3>
        <p className="text-gray-600">{currentPR.attachments}</p>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Terms & Conditions:</h3>
        <ol className="list-decimal list-inside">
          {currentPR.termsConditions.map((term, index) => (
            <li key={index} className="text-gray-700">{term}</li>
          ))}
        </ol>
      </div>

      {/* SAP Response */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">SAP Response</h3>
        <div className="space-y-2">
          <div className="flex">
            <span className="w-16 text-gray-600">Code:</span>
            <span>{currentPR.sapResponse.code}</span>
          </div>
          <div className="flex">
            <span className="w-16 text-gray-600 align-top">Message:</span>
            <span className="break-all">{currentPR.sapResponse.message}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
