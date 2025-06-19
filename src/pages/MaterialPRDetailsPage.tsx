
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import { MessageSquare, Printer } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const MaterialPRDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const prDetails = {
    prNumber: "110318",
    createdBy: "admin",
    createdOn: "27-03-25",
    supplier: "ABC",
    status: "Approved",
    phone: "NA",
    email: "Neptune@gmail.com",
    pan: "jknjknjfnkenkfk",
    address: "Thane",
    gst: "grjghjngjgj",
    deliveryAddress: "Neptune NA",
    paymentTenure: "",
    tds: "",
    advanceAmount: "",
    relatedTo: "Test",
    retention: "",
    qc: ""
  };

  const orderDetails = {
    referenceNo: "110318",
    id: "10435",
    mprDate: "27-03-25",
    plantDetail: "1212323234-Default Sale Org-Plant for Lockated Site 1",
    address: "Thane",
    email: "xyz@gmail.com"
  };

  const items = [
    {
      sNo: 1,
      item: "A4 Size Papers 3",
      availability: "",
      sacHsnCode: "NA",
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
  ];

  const handleClone = () => {
    navigate('/finance/material-pr/add');
    toast({
      title: "Cloning Material PR",
      description: "Opening new Material PR form with copied data",
    });
  };

  const handleFeeds = () => {
    navigate(`/finance/material-pr/feeds/${id}`);
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Material PR - ${prDetails.prNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { margin: 20px 0; }
              .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .table th, .table td { border: 1px solid #000; padding: 8px; text-align: left; }
              .table th { background-color: #f0f0f0; }
              .logo { float: right; }
              .approval-status { background-color: green; color: white; padding: 4px 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">
                <div style="border: 1px solid #000; padding: 10px; display: inline-block;">
                  <div class="approval-status">admin Approved: Approved</div>
                  <div>Page 1 - Document</div>
                </div>
              </div>
              <h2>NEPTUNE</h2>
              <p>MATERIAL PR</p>
            </div>

            <div class="details">
              <div style="display: flex; justify-content: space-between;">
                <div>
                  <p><strong>Phone:</strong> ${prDetails.phone}</p>
                  <p><strong>Email:</strong> ${prDetails.email}</p>
                  <p><strong>PAN:</strong> ${prDetails.pan}</p>
                  <p><strong>Address:</strong> ${prDetails.address}</p>
                </div>
                <div>
                  <p><strong>Reference No:</strong> ${orderDetails.referenceNo}</p>
                  <p><strong>ID:</strong> ${orderDetails.id}</p>
                  <p><strong>Supplier:</strong> ${prDetails.supplier}</p>
                  <p><strong>Phone:</strong> ${prDetails.phone}</p>
                  <p><strong>GST:</strong> ${prDetails.gst}</p>
                  <p><strong>Delivery Address:</strong> ${prDetails.deliveryAddress}</p>
                </div>
              </div>
            </div>

            <table class="table">
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
                ${items.map(item => `
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

            <div style="margin-top: 20px;">
              <p><strong>Net Amount(INR):</strong> 1000.00</p>
              <p><strong>Amount in Words:</strong> One Thousand Rupees Only</p>
            </div>

            <div style="margin-top: 30px;">
              <h4>Terms & Conditions:</h4>
              <p>1. Test</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Material PR &gt; Material PR Details
      </div>

      {/* Page Title and Actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MATERIAL PR DETAILS</h1>
        <div className="flex gap-3">
          <div className="bg-green-500 text-white px-3 py-1 rounded text-sm">
            {prDetails.status}
          </div>
          <Button
            onClick={handleClone}
            className="text-white"
            style={{ backgroundColor: '#C72030' }}
          >
            Clone
          </Button>
          <Button
            onClick={handleFeeds}
            className="text-white"
            style={{ backgroundColor: '#C72030' }}
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
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Phone:</span>
                <span>{prDetails.phone}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Email:</span>
                <span>{prDetails.email}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">PAN:</span>
                <span>{prDetails.pan}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Address:</span>
                <span>{prDetails.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Material PR</h3>
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
                <span className="text-gray-600">MPR Date:</span>
                <span>{orderDetails.mprDate}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Plant Detail:</span>
                <span>{orderDetails.plantDetail}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Address:</span>
                <span>{orderDetails.address}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Email:</span>
                <span>{orderDetails.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PR Details Table */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2">
              <span className="text-gray-600">PAN:</span>
              <span>{prDetails.pan}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Phone:</span>
              <span>{prDetails.phone}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Related To:</span>
              <span>{prDetails.relatedTo}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Retention(%):</span>
              <span>{prDetails.retention}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">QC(%):</span>
              <span>{prDetails.qc}</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2">
              <span className="text-gray-600">GST:</span>
              <span>{prDetails.gst}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Delivery Address:</span>
              <span>{prDetails.deliveryAddress}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Payment Tenure(In Days):</span>
              <span>{prDetails.paymentTenure}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">TDS(%):</span>
              <span>{prDetails.tds}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-600">Advance Amount:</span>
              <span>{prDetails.advanceAmount}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-2 py-2">S.No.</th>
                <th className="border border-gray-300 px-2 py-2">Item</th>
                <th className="border border-gray-300 px-2 py-2">Availability</th>
                <th className="border border-gray-300 px-2 py-2">SAC/HSN Code</th>
                <th className="border border-gray-300 px-2 py-2">Expected Date</th>
                <th className="border border-gray-300 px-2 py-2">Product Description</th>
                <th className="border border-gray-300 px-2 py-2">Quantity</th>
                <th className="border border-gray-300 px-2 py-2">Unit</th>
                <th className="border border-gray-300 px-2 py-2">Moving Avg Rate</th>
                <th className="border border-gray-300 px-2 py-2">Rate</th>
                <th className="border border-gray-300 px-2 py-2">Amount</th>
                <th className="border border-gray-300 px-2 py-2">Approved Qty</th>
                <th className="border border-gray-300 px-2 py-2">Transfer Qty</th>
                <th className="border border-gray-300 px-2 py-2">Wbs Code</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.sNo}>
                  <td className="border border-gray-300 px-2 py-2 text-center">{item.sNo}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.item}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.availability}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.sacHsnCode}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.expectedDate}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.productDescription}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.quantity}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.unit}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.movingAvgRate}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.rate}</td>
                  <td className="border border-gray-300 px-2 py-2 font-medium">{item.amount}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.approvedQty}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.transferQty}</td>
                  <td className="border border-gray-300 px-2 py-2">{item.wbsCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Net Amount(INR):</span>
              <span className="font-medium">1000.00</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="font-medium mb-2">Amount in Words: One Thousand Rupees Only</div>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-4 mb-8">
          <div>
            <h4 className="font-medium mb-2">Attachments</h4>
            <p className="text-sm">No attachments</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Terms & Conditions:</h4>
            <p className="text-sm">1. Test</p>
          </div>
        </div>

        {/* SAP Response */}
        <div className="mb-8">
          <h4 className="font-medium mb-4">SAP Response</h4>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm"><strong>Code:</strong></p>
            <p className="text-sm text-red-600">Message: An internal server error occurred. The MPR ID for the failed message is : AGIIlliAmAuXI@irXqrTImkiCU_y'WgFz.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
