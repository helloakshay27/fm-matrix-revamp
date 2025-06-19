
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Clone, Print } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditStatusDialog } from '@/components/EditStatusDialog';

export const ServicePRDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Mock data - in real app this would come from API based on ID
  const servicePRData = {
    id: id,
    prNumber: "10060",
    referenceNo: "10060",
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
    netAmount: 700.00,
    totalTaxableValue: 700.00,
    taxes: 28.00,
    totalValue: 728.00,
    amountInWords: "Seven Hundred Twenty Eight Rupees Only",
    termsConditions: "NA",
    preparedBy: "Amit Acc",
    signature: ""
  };

  const handleEditClick = () => {
    setShowEditDialog(true);
  };

  const handleCloneClick = () => {
    navigate(`/finance/service-pr/clone/${id}`);
  };

  const handlePrintClick = () => {
    window.print();
  };

  const handleFeedsClick = () => {
    navigate(`/finance/service-pr/feeds/${id}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/finance/service-pr')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Service PR
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-2">Service PR &gt; Service PR Details</p>
            <h1 className="text-2xl font-bold">SERVICE PR DETAILS</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleEditClick}
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              onClick={handleCloneClick}
              className="bg-[#8B4B8C] hover:bg-[#7A427B] text-white"
            >
              Clone
            </Button>
            <Button 
              onClick={handlePrintClick}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              <Print className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button 
              onClick={handleFeedsClick}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              Feeds
            </Button>
          </div>
        </div>
      </div>

      {/* Company Header */}
      <div className="bg-white rounded-lg border mb-6 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold mb-4">Jyoti Tower</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Phone:</span> {servicePRData.phone}</p>
                <p><span className="font-medium">Email:</span> {servicePRData.email}</p>
                <p><span className="font-medium">PAN:</span> {servicePRData.pan}</p>
              </div>
              <div>
                <p><span className="font-medium">Fax:</span> {servicePRData.fax}</p>
                <p><span className="font-medium">GST:</span> {servicePRData.gst}</p>
                <p><span className="font-medium">Address:</span> {servicePRData.address}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="w-32 h-16 bg-gray-200 flex items-center justify-center text-gray-500 mb-2">
              LOGO
            </div>
          </div>
        </div>
      </div>

      {/* Service PR Details */}
      <div className="bg-white rounded-lg border mb-6 p-6">
        <h3 className="text-lg font-bold text-center mb-6">Service PR (Pending)</h3>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p><span className="font-medium">PR Number:</span> {servicePRData.prNumber}</p>
            <p><span className="font-medium">PR Date:</span> {servicePRData.prDate}</p>
            <p><span className="font-medium">Kind Attention:</span> {servicePRData.kindAttention}</p>
            <p><span className="font-medium">Subject:</span> {servicePRData.subject}</p>
            <p><span className="font-medium">Related To:</span> {servicePRData.relatedTo}</p>
            <p><span className="font-medium">Payment Tenure(in Days):</span> {servicePRData.paymentTenure}</p>
            <p><span className="font-medium">Retention(%):</span> {servicePRData.retention}</p>
            <p><span className="font-medium">TDS(%):</span> {servicePRData.tds}</p>
            <p><span className="font-medium">QC(%):</span> {servicePRData.qc}</p>
            <p><span className="font-medium">Advance Amount:</span> {servicePRData.advanceAmount}</p>
            <p><span className="font-medium">Description:</span> {servicePRData.description}</p>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium">Reference No.:</span> {servicePRData.referenceNo}</p>
            <p><span className="font-medium">ID:</span> {servicePRData.id}</p>
            <p><span className="font-medium">Contractor:</span> {servicePRData.contractor}</p>
            <p><span className="font-medium">Address:</span> </p>
            <p><span className="font-medium">Phone:</span> 9413681004</p>
            <p><span className="font-medium">Email:</span> lockatedeveind@gmail.com</p>
            <p><span className="font-medium">GST:</span> GST 1234</p>
            <p><span className="font-medium">PAN:</span> PAN 1234</p>
            <p><span className="font-medium">Work Category:</span> {servicePRData.workCategory}</p>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg border mb-6 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left border">S.No.</th>
              <th className="p-2 text-left border">BOQ Details</th>
              <th className="p-2 text-left border">Quantity</th>
              <th className="p-2 text-left border">UOM</th>
              <th className="p-2 text-left border">Expected Date</th>
              <th className="p-2 text-left border">Product Description</th>
              <th className="p-2 text-left border">Rate</th>
              <th className="p-2 text-left border">Wbs Code</th>
              <th className="p-2 text-left border">CGST Rate(%)</th>
              <th className="p-2 text-left border">CGST Amount</th>
              <th className="p-2 text-left border">SGST Rate(%)</th>
              <th className="p-2 text-left border">SGST Amount</th>
              <th className="p-2 text-left border">IGST Rate(%)</th>
              <th className="p-2 text-left border">IGST Amount</th>
              <th className="p-2 text-left border">TCS Amount</th>
              <th className="p-2 text-left border">Tax Amount</th>
              <th className="p-2 text-left border">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {servicePRData.services.map((service, index) => (
              <tr key={index}>
                <td className="p-2 border">{service.sno}</td>
                <td className="p-2 border">{service.boqDetails}</td>
                <td className="p-2 border">{service.quantity}</td>
                <td className="p-2 border">{service.uom}</td>
                <td className="p-2 border">{service.expectedDate}</td>
                <td className="p-2 border">{service.productDescription}</td>
                <td className="p-2 border">{service.rate}</td>
                <td className="p-2 border">{service.wbsCode}</td>
                <td className="p-2 border">{service.cgstRate}</td>
                <td className="p-2 border">{service.cgstAmount}</td>
                <td className="p-2 border">{service.sgstRate}</td>
                <td className="p-2 border">{service.sgstAmount}</td>
                <td className="p-2 border">{service.igstRate}</td>
                <td className="p-2 border">{service.igstAmount}</td>
                <td className="p-2 border">{service.tcsAmount}</td>
                <td className="p-2 border">{service.taxAmount}</td>
                <td className="p-2 border">{service.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-4 border-t text-sm">
          <div className="flex justify-end space-y-1">
            <div className="text-right">
              <p>Net Amount(INR): {servicePRData.netAmount}</p>
              <p>Total Taxable Value Of LCI: {servicePRData.totalTaxableValue}</p>
              <p>Taxes (INR): {servicePRData.taxes}</p>
              <p>Total LCI Value (INR): {servicePRData.totalValue}</p>
              <p className="font-medium">Amount in Words: {servicePRData.amountInWords}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-white rounded-lg border mb-6 p-6">
        <h4 className="font-medium mb-2">Terms & Conditions:</h4>
        <p className="text-sm">{servicePRData.termsConditions}</p>
        <p className="text-sm mt-4">For Jyoti Tower We Confirm & Accept.</p>
        <div className="mt-6 text-sm">
          <p><span className="font-medium">PREPARED BY:</span> {servicePRData.preparedBy}</p>
          <p><span className="font-medium">SIGNATURE:</span></p>
        </div>
      </div>

      {/* Attachments */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-medium mb-2">Attachments</h4>
        <p className="text-sm text-gray-500">No attachments</p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-gray-600">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>

      {/* Edit Status Dialog */}
      <EditStatusDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </div>
  );
};
