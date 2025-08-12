import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Copy, Printer, Rss, Home, ChevronRight, Download } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
export const MaterialPRDetailsPage = () => {
  const navigate = useNavigate();
  const {
    id
  } = useParams();

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
    items: [{
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
    }],
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
  return <div className="p-6 mx-auto max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/finance">Finance</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/finance/material-pr">Material PR</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Material PR Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Material PR Details</h1>
          <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-md font-medium">
            {prData.adminApproval}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleClone}>
            <Copy className="w-4 h-4 mr-2" />
            Clone
          </Button>
          <Button variant="outline" size="sm" onClick={handleFeeds}>
            <Rss className="w-4 h-4 mr-2" />
            Feeds
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Contact Information Card */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-muted-foreground w-24">Phone</span>
                  <span className="font-medium">: {prData.phone || 'NA'}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">Email</span>
                  <span className="font-medium">: {prData.email}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">PAN</span>
                  <span className="font-medium">: {prData.pan}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-muted-foreground w-24">Fax</span>
                  <span className="font-medium">: NA</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">GST</span>
                  <span className="font-medium">: {prData.gst}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">Address</span>
                  <span className="font-medium">: {prData.address}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Material PR Card */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Material Purchase Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-muted-foreground w-40">MPR No.</span>
                  <span className="font-medium">: {prData.prNumber}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">MPR Date</span>
                  <span className="font-medium">: {prData.date}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Plant Detail</span>
                  <span className="font-medium">: {prData.plantDetail}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Address</span>
                  <span className="font-medium">: {prData.address}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Related To</span>
                  <span className="font-medium">: {prData.relatedTo}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-muted-foreground w-40">Reference No.</span>
                  <span className="font-medium">: {prData.referenceNo}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">ID</span>
                  <span className="font-medium">: {prData.id}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Supplier</span>
                  <span className="font-medium">: {prData.supplier}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Email</span>
                  <span className="font-medium">: {prData.email}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Admin Approval</span>
                  <span className="font-medium">: {prData.adminApproval}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table Card */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Items Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">S No.</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Item</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Availability</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">SAC/HSN Code</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Expected Date</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Product Description</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Quantity</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Unit</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Moving Avg Rate</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Rate</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Amount</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Approved Qty</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Transfer Qty</th>
                    <th className="border border-border px-3 py-2 text-sm text-left font-medium">Wbs Code</th>
                  </tr>
                </thead>
                <tbody>
                  {prData.items.map((item, index) => <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                      <td className="border border-border px-3 py-2 text-sm">{item.sNo}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.item}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.availability}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.sacHsnCode}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.expectedDate}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.productDescription}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.quantity}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.unit}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.movingAvgRate}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.rate}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.amount}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.approvedQty}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.transferQty}</td>
                      <td className="border border-border px-3 py-2 text-sm">{item.wbsCode}</td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            
            {/* Net Amount Summary */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-lg font-semibold">Net Amount(INR): ₹{prData.netAmount}</div>
                  <div className="text-sm text-muted-foreground">Amount In Words: {prData.amountInWords}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attachments Card */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            {prData.attachments === 'No attachments' ? <p className="text-muted-foreground">{prData.attachments}</p> : <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <Button variant="outline" size="sm">
                  Download PDF
                </Button>
              </div>}
          </CardContent>
        </Card>

        {/* Terms & Conditions Card */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              {prData.termsConditions.map((term, index) => <li key={index} className="text-sm">{term}</li>)}
            </ol>
          </CardContent>
        </Card>

        {/* SAP Response Card */}
        
      </div>
    </div>;
};