
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Copy, Printer, Rss, Home, ChevronRight, Download } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { EditStatusDialog } from '@/components/EditStatusDialog';

export const ServicePRDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Mock data - in real app this would come from API based on ID
  const servicePRData = {
    id: id || '12985',
    prNumber: "10060",
    referenceNo: "10060",
    adminApproval: 'Pending',
    prDate: "18-03-21",
    contractor: "Harells Corp",
    address: "2nd Floor, Jyoti Tower, Opp. Versova Police Station, Andheri (West), Mumbai 400053, India",
    phone: "+91 9954568992",
    email: "customercare@lockated.com",
    fax: "dvdkv",
    pan: "fcfdsf",
    gst: "dssdff",
    kindAttention: "",
    subject: "",
    relatedTo: "",
    paymentTenure: "7",
    retention: "10.0",
    tds: "10.0",
    qc: "10.0",
    advanceAmount: "",
    description: "",
    workCategory: "Serv1.1",
    plantDetail: "Jyoti Tower - Default Site Org-Plant for Lockated Site 1",
    services: [
      {
        sno: 1,
        boqDetails: "P034",
        quantity: 70.0,
        uom: "NA",
        expectedDate: "NA",
        productDescription: "P034",
        rate: 10.00,
        wbsCode: "",
        cgstRate: 2.00,
        cgstAmount: 14.00,
        sgstRate: 2.00,
        sgstAmount: 14.00,
        igstRate: 0.00,
        igstAmount: 0.00,
        tcsAmount: 0.00,
        taxAmount: 28.00,
        totalAmount: 700.00
      }
    ],
    netAmount: '700.00',
    totalTaxableValue: 700.00,
    taxes: 28.00,
    totalValue: 728.00,
    amountInWords: "Seven Hundred Twenty Eight Rupees Only",
    termsConditions: "NA",
    preparedBy: "Amit Acc",
    signature: "",
    attachments: 'No attachments',
    sapResponse: {
      code: '',
      message: 'Service PR submitted successfully'
    }
  };

  const handleEditClick = () => {
    setShowEditDialog(true);
  };

  const handleClone = () => {
    navigate(`/finance/service-pr/clone/${id}`);
  };

  const handleFeeds = () => {
    navigate(`/finance/service-pr/feeds/${id}`);
  };

  const handlePrint = () => {
    // Create a print-friendly version of the page
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Service PR Details - ${servicePRData.prNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; }
            .title { font-size: 18px; margin: 10px 0; }
            .approval-status { background: orange; color: white; padding: 5px 10px; border-radius: 3px; }
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
            <div class="company-name">JYOTI TOWER</div>
            <div class="title">SERVICE PR</div>
            <div>Page 1 - ${servicePRData.prDate}</div>
            <div class="approval-status">Admin Approval: ${servicePRData.adminApproval}</div>
          </div>
          
          <div class="details-grid">
            <div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${servicePRData.phone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${servicePRData.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">PAN:</span>
                <span class="detail-value">${servicePRData.pan}</span>
              </div>
            </div>
            <div>
              <div class="detail-row">
                <span class="detail-label">Fax:</span>
                <span class="detail-value">${servicePRData.fax}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">GST:</span>
                <span class="detail-value">${servicePRData.gst}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${servicePRData.address}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Service PR</div>
            <div class="details-grid">
              <div>
                <div class="detail-row">
                  <span class="detail-label">SPR No.:</span>
                  <span class="detail-value">${servicePRData.prNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">SPR Date:</span>
                  <span class="detail-value">${servicePRData.prDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Plant Detail:</span>
                  <span class="detail-value">${servicePRData.plantDetail}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">${servicePRData.address}</span>
                </div>
              </div>
              <div>
                <div class="detail-row">
                  <span class="detail-label">Reference No.:</span>
                  <span class="detail-value">${servicePRData.referenceNo}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">ID:</span>
                  <span class="detail-value">${servicePRData.id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Contractor:</span>
                  <span class="detail-value">${servicePRData.contractor}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${servicePRData.email}</span>
                </div>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>S No.</th>
                <th>BOQ Details</th>
                <th>Quantity</th>
                <th>UOM</th>
                <th>Expected Date</th>
                <th>Product Description</th>
                <th>Rate</th>
                <th>Wbs Code</th>
                <th>CGST Rate(%)</th>
                <th>CGST Amount</th>
                <th>SGST Rate(%)</th>
                <th>SGST Amount</th>
                <th>IGST Rate(%)</th>
                <th>IGST Amount</th>
                <th>TCS Amount</th>
                <th>Tax Amount</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${servicePRData.services.map(service => `
                <tr>
                  <td>${service.sno}</td>
                  <td>${service.boqDetails}</td>
                  <td>${service.quantity}</td>
                  <td>${service.uom}</td>
                  <td>${service.expectedDate}</td>
                  <td>${service.productDescription}</td>
                  <td>${service.rate}</td>
                  <td>${service.wbsCode}</td>
                  <td>${service.cgstRate}</td>
                  <td>${service.cgstAmount}</td>
                  <td>${service.sgstRate}</td>
                  <td>${service.sgstAmount}</td>
                  <td>${service.igstRate}</td>
                  <td>${service.igstAmount}</td>
                  <td>${service.tcsAmount}</td>
                  <td>${service.taxAmount}</td>
                  <td>${service.totalAmount}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div><strong>Net Amount(INR):</strong> ${servicePRData.netAmount}</div>
            <div><strong>Amount In Words:</strong> ${servicePRData.amountInWords}</div>
          </div>

          <div class="section">
            <div class="section-title">Attachments</div>
            <div>${servicePRData.attachments}</div>
          </div>

          <div class="section">
            <div class="section-title">Terms & Conditions:</div>
            <div>${servicePRData.termsConditions}</div>
          </div>

          <div class="section">
            <div class="section-title">SAP Response</div>
            <div><strong>Code:</strong> ${servicePRData.sapResponse.code}</div>
            <div><strong>Message:</strong> ${servicePRData.sapResponse.message}</div>
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
              <BreadcrumbLink href="/finance/service-pr">Service PR</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Service PR Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Service PR Details</h1>
          <div className={`px-3 py-1 text-sm rounded-md font-medium ${
            servicePRData.adminApproval === 'Approved' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {servicePRData.adminApproval}
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
                  <span className="font-medium">: {servicePRData.phone}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">Email</span>
                  <span className="font-medium">: {servicePRData.email}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">PAN</span>
                  <span className="font-medium">: {servicePRData.pan}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-muted-foreground w-24">Fax</span>
                  <span className="font-medium">: {servicePRData.fax}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">GST</span>
                  <span className="font-medium">: {servicePRData.gst}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">Address</span>
                  <span className="font-medium">: {servicePRData.address}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service PR Card */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Service Purchase Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-muted-foreground w-40">SPR No.</span>
                  <span className="font-medium">: {servicePRData.prNumber}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">SPR Date</span>
                  <span className="font-medium">: {servicePRData.prDate}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Plant Detail</span>
                  <span className="font-medium">: {servicePRData.plantDetail}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Address</span>
                  <span className="font-medium">: {servicePRData.address}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Payment Tenure(Days)</span>
                  <span className="font-medium">: {servicePRData.paymentTenure}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Retention(%)</span>
                  <span className="font-medium">: {servicePRData.retention}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">TDS(%)</span>
                  <span className="font-medium">: {servicePRData.tds}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">QC(%)</span>
                  <span className="font-medium">: {servicePRData.qc}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-muted-foreground w-40">Reference No.</span>
                  <span className="font-medium">: {servicePRData.referenceNo}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">ID</span>
                  <span className="font-medium">: {servicePRData.id}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Contractor</span>
                  <span className="font-medium">: {servicePRData.contractor}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Email</span>
                  <span className="font-medium">: {servicePRData.email}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Work Category</span>
                  <span className="font-medium">: {servicePRData.workCategory}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Advance Amount</span>
                  <span className="font-medium">: {servicePRData.advanceAmount || 'NA'}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-40">Admin Approval</span>
                  <span className="font-medium">: {servicePRData.adminApproval}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Services Table */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Services</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-semibold text-foreground border-r border-border min-w-[60px]">S.No.</th>
                    <th className="text-left p-3 font-semibold text-foreground border-r border-border min-w-[120px]">BOQ Details</th>
                    <th className="text-left p-3 font-semibold text-foreground border-r border-border min-w-[80px]">Quantity</th>
                    <th className="text-left p-3 font-semibold text-foreground border-r border-border min-w-[60px]">UOM</th>
                    <th className="text-left p-3 font-semibold text-foreground border-r border-border min-w-[100px]">Expected<br/>Date</th>
                    <th className="text-left p-3 font-semibold text-foreground border-r border-border min-w-[140px]">Product<br/>Description</th>
                    <th className="text-left p-3 font-semibold text-foreground border-r border-border min-w-[80px]">Rate</th>
                    <th className="text-left p-3 font-semibold text-foreground border-r border-border min-w-[80px]">Wbs<br/>Code</th>
                    <th className="text-center p-3 font-semibold text-foreground border-r border-border min-w-[80px]">CGST<br/>Rate(%)</th>
                    <th className="text-center p-3 font-semibold text-foreground border-r border-border min-w-[80px]">CGST<br/>Amount</th>
                    <th className="text-center p-3 font-semibold text-foreground border-r border-border min-w-[80px]">SGST<br/>Rate(%)</th>
                    <th className="text-center p-3 font-semibold text-foreground border-r border-border min-w-[80px]">SGST<br/>Amount</th>
                    <th className="text-center p-3 font-semibold text-foreground border-r border-border min-w-[80px]">IGST<br/>Rate(%)</th>
                    <th className="text-center p-3 font-semibold text-foreground border-r border-border min-w-[80px]">IGST<br/>Amount</th>
                    <th className="text-center p-3 font-semibold text-foreground border-r border-border min-w-[80px]">TCS<br/>Rate(%)</th>
                    <th className="text-center p-3 font-semibold text-foreground border-r border-border min-w-[80px]">Tax<br/>Amount</th>
                    <th className="text-center p-3 font-semibold text-foreground min-w-[100px]">Total<br/>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {servicePRData.services.map((service, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 border-r border-border text-center font-medium">{service.sno}</td>
                      <td className="p-3 border-r border-border font-medium">{service.boqDetails}</td>
                      <td className="p-3 border-r border-border text-center">{service.quantity.toFixed(1)}</td>
                      <td className="p-3 border-r border-border text-center">{service.uom}</td>
                      <td className="p-3 border-r border-border text-center">{service.expectedDate}</td>
                      <td className="p-3 border-r border-border">{service.productDescription}</td>
                      <td className="p-3 border-r border-border text-right font-medium">{service.rate.toFixed(2)}</td>
                      <td className="p-3 border-r border-border text-center">{service.wbsCode || '-'}</td>
                      <td className="p-3 border-r border-border text-center">{service.cgstRate.toFixed(2)}</td>
                      <td className="p-3 border-r border-border text-right">{service.cgstAmount.toFixed(2)}</td>
                      <td className="p-3 border-r border-border text-center">{service.sgstRate.toFixed(2)}</td>
                      <td className="p-3 border-r border-border text-right">{service.sgstAmount.toFixed(2)}</td>
                      <td className="p-3 border-r border-border text-center">{service.igstRate.toFixed(2)}</td>
                      <td className="p-3 border-r border-border text-right">{service.igstAmount.toFixed(2)}</td>
                      <td className="p-3 border-r border-border text-center">{service.tcsAmount.toFixed(2)}</td>
                      <td className="p-3 border-r border-border text-right">{service.taxAmount.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold text-primary">{service.totalAmount.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Enhanced Summary Section */}
            <div className="border-t border-border bg-muted/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Summary */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="font-medium text-muted-foreground">Net Amount (INR):</span>
                    <span className="font-bold text-lg">{servicePRData.netAmount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="font-medium text-muted-foreground">Total Taxable Value Of LOI:</span>
                    <span className="font-semibold">{servicePRData.totalTaxableValue.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="font-medium text-muted-foreground">Taxes (INR):</span>
                    <span className="font-semibold">{servicePRData.taxes.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t-2 border-primary/20 bg-primary/5 px-4 rounded-lg">
                    <span className="font-bold text-foreground">Total LOI Value (INR):</span>
                    <span className="font-bold text-xl text-primary">{servicePRData.totalValue.toFixed(2)}</span>
                  </div>
                </div>

                {/* Amount in Words */}
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <h4 className="font-semibold text-accent-foreground mb-2">Amount In Words:</h4>
                  <p className="text-sm font-medium text-accent-foreground/80">{servicePRData.amountInWords}</p>
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
            <div className="text-muted-foreground">{servicePRData.attachments}</div>
          </CardContent>
        </Card>

        {/* Terms & Conditions Card */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">{servicePRData.termsConditions}</p>
              <p className="text-sm font-medium">For Jyoti Tower We Confirm & Accept</p>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm"><span className="font-medium">PREPARED BY:</span> {servicePRData.preparedBy}</p>
                    <p className="text-sm mt-2"><span className="font-medium">SIGNATURE:</span></p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-16 border-2 border-dashed border-muted-foreground rounded bg-muted/20 flex items-center justify-center mb-2">
                      <span className="text-muted-foreground text-xs">Signature Area</span>
                    </div>
                    <div className="border-t-2 border-foreground w-24 mx-auto mb-1"></div>
                    <span className="text-xs font-medium">Authorised Signatory</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SAP Response Card */}
        <Card className="shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">SAP Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex">
                <span className="text-muted-foreground w-20">Code:</span>
                <span className="font-medium">{servicePRData.sapResponse.code || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-20">Message:</span>
                <span className="font-medium">{servicePRData.sapResponse.message}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Status Dialog */}
      <EditStatusDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </div>
  );
};
