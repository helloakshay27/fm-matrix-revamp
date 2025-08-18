import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from 'react-router-dom';
import { Copy, Printer, Rss, Download } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { getMaterialPRById } from '@/store/slices/materialPRSlice';
import { format } from 'date-fns';

export const MaterialPRDetailsPage = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const navigate = useNavigate();
  const { id } = useParams();

  const [pr, setPR] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getMaterialPRById({ baseUrl, token, id })).unwrap();
        setPR(response);
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, []);

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
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">Material PR Details</h1>
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

    <div className='flex items-start gap-4 my-6'>
      {
        pr?.approval_levels?.map(level => (
          <div className='space-y-3'>
            <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-md font-medium w-max">
              {`${level.name} approved : ${level.status_label}`}
            </div>
            {
              level.approved_by && level.approval_date &&
              <div className='ms-2'>
                {
                  `${level.approved_by} (${level.approval_date})`
                }
              </div>
            }
          </div>
        ))
      }
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
                <span className="font-medium">: {pr.billing_address?.phone || 'NA'}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-24">Email</span>
                <span className="font-medium">: {pr.billing_address?.email}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-24">PAN</span>
                <span className="font-medium">: {pr.billing_address?.pan_number}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-muted-foreground w-24">Fax</span>
                <span className="font-medium">: {pr.billing_address?.fax}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-24">GST</span>
                <span className="font-medium">: {pr.billing_address?.gst_number}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-24">Address</span>
                <span className="font-medium">: {pr.billing_address?.address}</span>
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
                <span className="font-medium">: {pr.external_id}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">MPR Date</span>
                <span className="font-medium">: {pr?.po_date && format(pr.po_date, 'dd-MM-yyyy')}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Plant Detail</span>
                <span className="font-medium">: {prData.plantDetail}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Address</span>
                <span className="font-medium">: {pr.supplier?.address}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Related To</span>
                <span className="font-medium">: {pr.related_to}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-muted-foreground w-40">Reference No.</span>
                <span className="font-medium">: {pr.reference_number}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">ID</span>
                <span className="font-medium">: {pr.id}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Supplier</span>
                <span className="font-medium">: {pr.supplier?.company_name}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Email</span>
                <span className="font-medium">: {pr.supplier?.email}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Admin Approval</span>
                <span className="font-medium">: {pr.adminApproval}</span>
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
                {pr?.pms_pr_inventories?.map((item, index) => <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                  <td className="border border-border px-3 py-2 text-sm">{index + 1}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.inventory.name}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.availability}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.sacHsnCode}</td>
                  <td className="border border-border px-3 py-2 text-sm">{format(item.expected_date, 'dd-MM-yyyy')}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.prod_desc}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.quantity}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.unit}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.total_value}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.rate}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.total_value}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.approved_qty}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.transfer_qty}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.wbs_code}</td>
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
          {pr.attachments === 'No attachments' ? (
            <p className="text-muted-foreground">{prData.attachments}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {pr?.attachments?.map((file, idx) => {
                const fileUrl = file.url; // or your path from backend
                const fileName = file.name || `Attachment-${idx + 1}`;
                const fileExt = fileUrl.split('.').pop().toLowerCase();

                if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
                  return (
                    <div key={idx} className="flex flex-col items-start gap-2">
                      <img
                        src={fileUrl}
                        alt={fileName}
                        className="max-h-40 w-40 rounded border"
                      />
                    </div>
                  );
                } else if (fileExt === 'pdf') {
                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <iframe
                        src={fileUrl}
                        className="w-40 h-40 border rounded"
                        title={fileName}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <a
                        href={fileUrl}
                        download={fileName}
                        className="text-blue-500 underline text-sm"
                      >
                        {fileName}
                      </a>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </CardContent>
      </Card>


      {/* Terms & Conditions Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{pr.terms_conditions}</p>
        </CardContent>
      </Card>

      {/* SAP Response Card */}

    </div>
  </div>;
};