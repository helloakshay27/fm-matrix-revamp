
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Copy, Printer, Rss } from 'lucide-react';

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

  const handleClone = () => {
    navigate(`/finance/material-pr/clone/${id}`);
  };

  const handleFeeds = () => {
    navigate(`/finance/material-pr/feeds/${id}`);
  };

  const handlePrint = () => {
    // Create a print-friendly version of the page
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Material PR Details - ${prData.prNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; }
            .title { font-size: 18px; margin: 10px 0; }
            .approval-status { background: green; color: white; padding: 5px 10px; border-radius: 3px; }
            .section { margin: 20px 0; }
            .section-title { font-weight: bold; margin-bottom: 10px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .detail-row { display: flex; margin: 5px 0; }
            .detail-label { width: 200px; font-weight: bold; }
            .detail-value { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f5f5f5; }
            .totals { text-align: right; margin: 20px 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">NEPTUNE</div>
            <div class="title">MATERIAL PR</div>
            <div>Page 1 - ${prData.date}</div>
            <div class="approval-status">admin Approval: ${prData.adminApproval}</div>
          </div>
          
          <div class="details-grid">
            <div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">NA</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${prData.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">PAN:</span>
                <span class="detail-value">NA</span>
              </div>
            </div>
            <div>
              <div class="detail-row">
                <span class="detail-label">Fax:</span>
                <span class="detail-value">NA</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">GST:</span>
                <span class="detail-value">NA</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">NA</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Material PR</div>
            <div class="details-grid">
              <div>
                <div class="detail-row">
                  <span class="detail-label">MPR No.:</span>
                  <span class="detail-value">${prData.prNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">MPR Date:</span>
                  <span class="detail-value">${prData.date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Plant Detail:</span>
                  <span class="detail-value">${prData.plantDetail}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">${prData.address}</span>
                </div>
              </div>
              <div>
                <div class="detail-row">
                  <span class="detail-label">Reference No.:</span>
                  <span class="detail-value">${prData.referenceNo}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">ID:</span>
                  <span class="detail-value">10435</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Supplier:</span>
                  <span class="detail-value">${prData.supplier}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${prData.email}</span>
                </div>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>S No.</th>
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
              ${prData.items.map(item => `
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

          <div class="totals">
            <div><strong>Net Amount(INR):</strong> ${prData.netAmount}</div>
            <div><strong>Amount In Words:</strong> ${prData.amountInWords}</div>
          </div>

          <div class="section">
            <div class="section-title">Attachments</div>
            <div>${prData.attachments}</div>
          </div>

          <div class="section">
            <div class="section-title">Terms & Conditions:</div>
            <ol>
              ${prData.termsConditions.map(term => `<li>${term}</li>`).join('')}
            </ol>
          </div>

          <div class="section">
            <div class="section-title">SAP Response</div>
            <div><strong>Code:</strong> ${prData.sapResponse.code}</div>
            <div><strong>Message:</strong> ${prData.sapResponse.message}</div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">WORK ORDER DETAILS</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Level 1 Approval:</span>
            <span className="px-3 py-1 bg-yellow-500 text-white text-sm rounded font-medium">
              Pending
            </span>
          </div>
        </div>
        
        {/* Status and Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-yellow-500 text-white rounded font-medium">
            Status- Pending
          </div>
          <Button 
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => {}}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleClone}
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
                  <span className="font-medium">: 7239013238</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">Email</span>
                  <span className="font-medium">: xtylizzsamerxyز146@gmail.com</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">PAN</span>
                  <span className="font-medium">: 868687779796</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-gray-600 w-24">Fax</span>
                  <span className="font-medium">: t78788ugjyfr65r65</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">GST</span>
                  <span className="font-medium">: r7gfyv87176657</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">Address</span>
                  <span className="font-medium">: demo world</span>
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

        {/* Work Order Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">Work Order (Pending)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-gray-600 w-40">WO Number</span>
                  <span className="font-medium">: -</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">WO Date</span>
                  <span className="font-medium">: 02-04-24</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Kind Attention</span>
                  <span className="font-medium">: -</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Subject</span>
                  <span className="font-medium">: -</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Related To</span>
                  <span className="font-medium">: -</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Payment Tenure(In Days)</span>
                  <span className="font-medium">: -</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Retention(%)</span>
                  <span className="font-medium">: -</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-gray-600 w-40">Reference No.</span>
                  <span className="font-medium">: 10009</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">ID</span>
                  <span className="font-medium">: 9175</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Contractor</span>
                  <span className="font-medium">: MODWIN NETWORKS PVT.LTD</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Address</span>
                  <span className="font-medium">: Mumbai Maharashtra - India</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Phone</span>
                  <span className="font-medium">: 9382875928</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">Email</span>
                  <span className="font-medium">: vinod@modwin.com</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">GST</span>
                  <span className="font-medium">: NA</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-40">PAN</span>
                  <span className="font-medium">: NA</span>
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
                    <th className="border border-gray-300 px-3 py-2 text-sm text-left font-medium">S No.</th>
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
                  {prData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.sNo}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.item}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.availability}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.sacHsnCode}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.expectedDate}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.productDescription}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.quantity}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.unit}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.movingAvgRate}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.rate}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.amount}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.approvedQty}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.transferQty}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.wbsCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-right">
                <div className="text-sm font-medium"><strong>Net Amount(INR):</strong> {prData.netAmount}</div>
                <div className="text-sm"><strong>Amount In Words:</strong> {prData.amountInWords}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attachments Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{prData.attachments}</p>
            </CardContent>
          </Card>

          {/* Terms & Conditions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-1">
                {prData.termsConditions.map((term, index) => (
                  <li key={index} className="text-gray-700">{term}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* SAP Response Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SAP Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div><strong>Code:</strong> {prData.sapResponse.code || 'N/A'}</div>
              <div><strong>Message:</strong> <span className="text-red-600">{prData.sapResponse.message}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
