
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Copy, Printer, Rss, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { getWorkOrderById } from '@/store/slices/workOrderSlice';
import { numberToIndianCurrencyWords } from '@/utils/amountToText';
import axios from 'axios';

export const ServicePRDetailsPage = () => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const navigate = useNavigate();
  const { id } = useParams();

  const [servicePR, setServicePR] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getWorkOrderById({ baseUrl, token, id })).unwrap();
        setServicePR(response.page)
      } catch (error) {
        toast.error(error)
      }
    }

    fetchData();
  }, [])

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
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

  const handleSendToSap = async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/pms/work_orders/${id}.json?send_sap=yes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send to SAP");
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="font-work-sans font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2">
            SERVICE PR DETAILS
          </h1>
          <div className="flex items-center gap-3">
            {/* {
                servicePR?.approvals?.map(level => (
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
              } */}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 bg-purple-600 text-white sap_button"
              onClick={handleSendToSap}
            >
              Send To SAP Team
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700">
              <Copy className="w-4 h-4 mr-1" />
              Clone
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300">
              <Rss className="w-4 h-4 mr-1" />
              Feeds
            </Button>
          </div>
        </div>
      </div>

      {/* Vendor/Contact Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{servicePR.company?.site_name}</h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Contact details */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <span className="ml-8">: {servicePR.company?.phone}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Fax</span>
                <span className="ml-12">: {servicePR.company?.fax}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="ml-8">: {servicePR.company?.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">GST</span>
                <span className="ml-11">: {servicePR.company?.gst}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">PAN</span>
                <span className="ml-9">: {servicePR.company?.pan}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Address</span>
                <span className="ml-5">: {servicePR.company?.address}</span>
              </div>
            </div>
          </div>

          {/* Center - Contractor name */}
          <div className="flex flex-col items-center justify-center lg:min-w-[200px]">
            <div className="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-500">image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service PR Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Service Purchase Request ({servicePR.work_order?.wo_status})
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">SPR Number</span>
              <span className="text-sm">: {servicePR.work_order?.number || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">SPR Date</span>
              <span className="text-sm">: {servicePR.work_order?.wo_date}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Kind Attention</span>
              <span className="text-sm">: {servicePR.work_order?.kind_attention || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Subject</span>
              <span className="text-sm">: {servicePR.work_order?.subject || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Related To</span>
              <span className="text-sm">: {servicePR.work_order?.related_to || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Payment Tenure(In Days)</span>
              <span className="text-sm">: {servicePR.work_order?.payment_terms?.payment_tenure}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Retention(%)</span>
              <span className="text-sm">: {servicePR.work_order?.payment_terms?.retention}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">TDS(%)</span>
              <span className="text-sm">: {servicePR.work_order?.payment_terms?.tds || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">QC(%)</span>
              <span className="text-sm">: {servicePR.work_order?.payment_terms?.qc || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Advance Amount</span>
              <span className="text-sm">: {servicePR.work_order?.advance_amount || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Description</span>
              <span className="text-sm">: {servicePR.work_order?.description || '-'}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Reference No.</span>
              <span className="text-sm">: {servicePR.work_order?.reference_no}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">ID</span>
              <span className="text-sm">: {servicePR.work_order?.id}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Contractor</span>
              <span className="text-sm">: {servicePR.work_order?.supplier_details?.company_name}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Address</span>
              <span className="text-sm">: {servicePR.work_order?.supplier_address?.address}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Phone</span>
              <span className="text-sm">: {servicePR.work_order?.supplier_details?.mobile1}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Email</span>
              <span className="text-sm">: {servicePR.work_order?.supplier_details?.email}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">GST</span>
              <span className="text-sm">: {servicePR.work_order?.supplier_details?.gstin_number}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">PAN</span>
              <span className="text-sm">: {servicePR.work_order?.supplier_details?.pan_number}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Work Category</span>
              <span className="text-sm">: {servicePR.work_order?.work_category}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Plant Detail</span>
              <span className="text-sm">: {servicePR.work_order?.plant_detail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Items Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Items Details</h3>
        <div className="overflow-x-auto">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-xs">S.No</TableHead>
                <TableHead className="font-semibold text-xs">BOQ Details</TableHead>
                <TableHead className="font-semibold text-xs">Quantity</TableHead>
                <TableHead className="font-semibold text-xs">UOM</TableHead>
                <TableHead className="font-semibold text-xs">Expected Date</TableHead>
                <TableHead className="font-semibold text-xs">Product Description</TableHead>
                <TableHead className="font-semibold text-xs">Rate</TableHead>
                <TableHead className="font-semibold text-xs">Wbs Code</TableHead>
                <TableHead className="font-semibold text-xs">CGST Rate(%)</TableHead>
                <TableHead className="font-semibold text-xs">CGST Amount</TableHead>
                <TableHead className="font-semibold text-xs">SGST Rate(%)</TableHead>
                <TableHead className="font-semibold text-xs">SGST Amount</TableHead>
                <TableHead className="font-semibold text-xs">IGST Rate(%)</TableHead>
                <TableHead className="font-semibold text-xs">IGST Amount</TableHead>
                <TableHead className="font-semibold text-xs">TCS Amount</TableHead>
                <TableHead className="font-semibold text-xs">Tax Amount</TableHead>
                <TableHead className="font-semibold text-xs">Total Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicePR.inventories?.map((item) => (
                <TableRow key={item.sno} className="hover:bg-gray-50">
                  <TableCell className="text-sm">{item.sno}</TableCell>
                  <TableCell className="text-sm">{item.boq_details}</TableCell>
                  <TableCell className="text-sm">{item.quantity}</TableCell>
                  <TableCell className="text-sm">{item.uom}</TableCell>
                  <TableCell className="text-sm">{item.expected_date}</TableCell>
                  <TableCell className="text-sm">{item.product_description}</TableCell>
                  <TableCell className="text-sm">{item.rate}</TableCell>
                  <TableCell className="text-sm">{item.wbs_code}</TableCell>
                  <TableCell className="text-sm">{item.cgst_rate}</TableCell>
                  <TableCell className="text-sm">{item.cgst_amount}</TableCell>
                  <TableCell className="text-sm">{item.sgst_rate}</TableCell>
                  <TableCell className="text-sm">{item.sgst_amount}</TableCell>
                  <TableCell className="text-sm">{item.igst_rate}</TableCell>
                  <TableCell className="text-sm">{item.igst_amount}</TableCell>
                  <TableCell className="text-sm">{item.tcs_amount}</TableCell>
                  <TableCell className="text-sm">{item.tax_amount}</TableCell>
                  <TableCell className="text-sm font-medium">{item.total_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary Section */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Net Amount (INR):</span>
            <span className="font-medium">{servicePR.totals?.net_amount}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Total Taxable Value Of Service PR:</span>
            <span className="font-medium">{servicePR.totals?.total_taxable}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Taxes (INR):</span>
            <span className="font-medium">{servicePR.totals?.taxes}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t">
            <span className="font-semibold text-gray-900">Total Service PR Value (INR):</span>
            <span className="font-semibold">{servicePR.totals?.total_value}</span>
          </div>
          <div className="mt-4">
            <span className="font-medium text-gray-700">Amount In Words: </span>
            <span className="text-gray-900">{numberToIndianCurrencyWords(servicePR.totals?.total_value)}</span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions :</h3>
        <p className="text-gray-700">{servicePRData.termsConditions}</p>

        <div className="mt-6">
          <p className="text-gray-900 font-medium">For {servicePRData.contractor} We Confirm & Accept,</p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="font-medium text-gray-900">PREPARED BY: {servicePRData.preparedBy}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">SIGNATURE: {servicePRData.signature || '-'}</p>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
        <div className='flex items-center gap-4 flex-wrap'>
          {
            servicePR.attachments?.map(attachment => (
              <img src={attachment.url} alt="" height={100} width={100} />
            ))
          }
        </div>
      </div>
    </div>
  );
};
