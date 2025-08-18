import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Copy, Printer, Rss } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getWorkOrderById } from '@/store/slices/workOrderSlice';
import { numberToIndianCurrencyWords } from '@/utils/amountToText';

export const WODetailsPage = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const levelId = searchParams.get("level_id");
  const userId = searchParams.get("user_id");

  const shouldShowButtons = Boolean(levelId && userId);

  const { id } = useParams();
  const navigate = useNavigate();

  const [workOrder, setWorkOrder] = useState({})

  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        const response = await dispatch(getWorkOrderById({ baseUrl, token, id })).unwrap();
        setWorkOrder(response.page);
      } catch (error) {
        console.log(error)
        toast.error(error)
      }
    }

    fetchWorkOrder();
  }, [])

  // Mock data - in real app, this would come from API
  const woDetails = {
    id: id,
    status: 'Pending',
    level1Approval: 'Pending',
    // Contact/Vendor details
    vendorName: 'jyoti',
    phone: '7239013238',
    email: 'xtylizzsamerxyz146@gmail.com',
    pan: '86868779796',
    fax: 't78788ugjyfr65r65',
    gst: 'r7gfyy87176657',
    address: 'demo world',
    // Work Order details
    woNumber: '',
    woDate: '02-04-24',
    kindAttention: '',
    subject: '',
    relatedTo: '',
    paymentTenure: '',
    retention: '',
    tds: '',
    qc: '',
    advanceAmount: '',
    description: '',
    referenceNo: '10009',
    woId: '9175',
    contractor: 'MODWIN NETWORKS PVT.LTD',
    contractorAddress: 'Mumbai Maharashtra - India',
    contractorPhone: '9382875928',
    contractorEmail: 'vinod@modwin.com',
    contractorGst: 'NA',
    contractorPan: 'NA',
    workCategory: 'NA'
  };

  // Mock BOQ data
  const boqData = [
    {
      sNo: 1,
      boqDetails: '- Housekeeping',
      quantity: 10.0,
      uom: 'NA',
      expectedDate: 'NA',
      productDescription: 'Housekeeping',
      rate: 100.00,
      wbsCode: '',
      cgstRate: 0.00,
      cgstAmount: 0.00,
      sgstRate: 0.00,
      sgstAmount: 0.00,
      igstRate: 0.00,
      igstAmount: 0.00,
      tcsRate: 0.00,
      tcsAmount: 0.00,
      taxAmount: 0.00,
      totalAmount: 1000.000
    }
  ];

  // Mock invoice data
  const invoiceData = [];

  // Mock payment data  
  const paymentData = [];

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

  const handleApprove = async () => {
    const payload = {
      pms_purchase_order: {
        id: Number(id),
        pms_pr_inventories_attributes: workOrder.pms_po_inventories.map((item) => ({
          id: item.id,
          rate: item.rate,
          total_value: item.total_value,
          approved_qty: item.quantity,
          transfer_qty: item.transfer_qty
        })),
      },
      level_id: Number(levelId),
      user_id: Number(userId),
      approve: true
    }
    try {
      // await dispatch(approvePO({ baseUrl, token, id: Number(id), data: payload })).unwrap();
      toast.success('PO approved successfully');
      navigate(`/finance/pending-approvals`)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="font-work-sans font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2">
            WORK ORDER DETAILS
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Level 1 Approval:</span>
            <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(woDetails.level1Approval)}`}>
              {woDetails.level1Approval}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <span className={`px-4 py-2 rounded text-sm font-medium ${getStatusColor(woDetails.status)}`}>
            Status:- {woDetails.status}
          </span>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" className="border-gray-300">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700">
              <Copy className="w-4 h-4 mr-1" />
              Clone
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700">
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{workOrder.company?.site_name}</h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Contact details */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <span className="ml-8">: {workOrder.company?.phone}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Fax</span>
                <span className="ml-12">: {workOrder.company?.fax}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="ml-8">: {workOrder.company?.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">GST</span>
                <span className="ml-11">: {workOrder.company?.gst}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">PAN</span>
                <span className="ml-9">: {workOrder.company?.pan}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Address</span>
                <span className="ml-5">: {workOrder.company?.address}</span>
              </div>
            </div>
          </div>

          {/* Center - Vendor name */}
          <div className="flex flex-col items-center justify-center lg:min-w-[200px]">
            <div className="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-500">image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Work Order Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Work Order ({workOrder.work_order?.wo_status})
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">WO Number</span>
              <span className="text-sm">: {workOrder.work_order?.number || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">WO Date</span>
              <span className="text-sm">: {workOrder.work_order?.wo_date}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Kind Attention</span>
              <span className="text-sm">: {workOrder.work_order?.kind_attention || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Subject</span>
              <span className="text-sm">: {workOrder.work_order?.subject || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Related To</span>
              <span className="text-sm">: {workOrder.work_order?.related_to || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Payment Tenure(In Days)</span>
              <span className="text-sm">: {workOrder.payment_terms?.payment_tenure || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Retention(%)</span>
              <span className="text-sm">: {workOrder.payment_terms?.retention || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">TDS(%)</span>
              <span className="text-sm">: {workOrder.payment_terms?.tds || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">QC(%)</span>
              <span className="text-sm">: {workOrder.payment_terms?.qc || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Advance Amount</span>
              <span className="text-sm">: {workOrder.work_order?.advance_amount || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Description</span>
              <span className="text-sm">: {workOrder.work_order?.description || '-'}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Reference No.</span>
              <span className="text-sm">: {workOrder.work_order?.reference_number}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">ID</span>
              <span className="text-sm">: {workOrder.work_order?.id}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Contractor</span>
              <span className="text-sm">: {workOrder.work_order?.contractor}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Address</span>
              <span className="text-sm">: {workOrder.work_order?.contractorAddress}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Phone</span>
              <span className="text-sm">: {workOrder.work_order?.supplier_details?.mobile1}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Email</span>
              <span className="text-sm">: {workOrder.work_order?.supplier_details?.email}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">GST</span>
              <span className="text-sm">: {workOrder.work_order?.supplier_details?.gstin_number}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">PAN</span>
              <span className="text-sm">: {workOrder.work_order?.supplier_details?.pan_number}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Work Category</span>
              <span className="text-sm">: {workOrder.work_order?.work_category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOQ Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">BOQ Details</h3>
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
                <TableHead className="font-semibold text-xs">TCS Rate(%)</TableHead>
                <TableHead className="font-semibold text-xs">TCS Amount</TableHead>
                <TableHead className="font-semibold text-xs">Tax Amount</TableHead>
                <TableHead className="font-semibold text-xs">Total Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrder.inventories?.map((item) => (
                <TableRow key={item.sNo} className="hover:bg-gray-50">
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
                  <TableCell className="text-sm">{item.tcs_rate}</TableCell>
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
            <span className="font-medium">{workOrder.totals?.net_amount}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Total Taxable Value Of WO:</span>
            <span className="font-medium">{workOrder.totals?.total_taxable}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700">Taxes (INR):</span>
            <span className="font-medium">{workOrder.totals?.taxes}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t">
            <span className="font-semibold text-gray-900">Total WO Value (INR):</span>
            <span className="font-semibold">{workOrder.totals?.total_value}</span>
          </div>
          <div className="mt-4">
            <span className="font-medium text-gray-700">Amount In Words: </span>
            <span className="text-gray-900">{numberToIndianCurrencyWords(workOrder.totals?.total_value)}</span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions :</h3>
        <p className="text-gray-700">NA</p>

        <div className="mt-6">
          <p className="text-gray-900 font-medium">For jyoti We Confirm & Accept,</p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="font-medium text-gray-900">PREPARED BY: Robert Day2</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">SIGNATURE:</p>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
        <p className="text-gray-500">No attachments</p>
      </div>

      {/* Invoices/SES Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoices/SES Details</h3>
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-xs">Actions</TableHead>
                <TableHead className="font-semibold text-xs">ID</TableHead>
                <TableHead className="font-semibold text-xs">Invoice Number</TableHead>
                <TableHead className="font-semibold text-xs">Invoice Date</TableHead>
                <TableHead className="font-semibold text-xs">Total Invoice Amount</TableHead>
                <TableHead className="font-semibold text-xs">Payable Amount</TableHead>
                <TableHead className="font-semibold text-xs">Retention Amount</TableHead>
                <TableHead className="font-semibold text-xs">TDS Amount</TableHead>
                <TableHead className="font-semibold text-xs">QC Amount</TableHead>
                <TableHead className="font-semibold text-xs">W.O. Number</TableHead>
                <TableHead className="font-semibold text-xs">Physical Invoice Sent to Accounts</TableHead>
                <TableHead className="font-semibold text-xs">Physical Invoice Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center text-gray-500 py-8">
                    No invoice data available
                  </TableCell>
                </TableRow>
              ) : (
                invoiceData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {/* Table rows would go here if there was data */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Payment Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-xs">Invoice ID</TableHead>
                <TableHead className="font-semibold text-xs">Amount</TableHead>
                <TableHead className="font-semibold text-xs">Payment Mode</TableHead>
                <TableHead className="font-semibold text-xs">Transaction Number</TableHead>
                <TableHead className="font-semibold text-xs">Status</TableHead>
                <TableHead className="font-semibold text-xs">Payment Date</TableHead>
                <TableHead className="font-semibold text-xs">Note</TableHead>
                <TableHead className="font-semibold text-xs">Date of Entry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    No payment data available
                  </TableCell>
                </TableRow>
              ) : (
                paymentData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {/* Table rows would go here if there was data */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Debit/Credit Note Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Debit/Credit Note Details</h3>
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-xs">ID</TableHead>
                <TableHead className="font-semibold text-xs">Type</TableHead>
                <TableHead className="font-semibold text-xs">Amount</TableHead>
                <TableHead className="font-semibold text-xs">Description</TableHead>
                <TableHead className="font-semibold text-xs">Approved</TableHead>
                <TableHead className="font-semibold text-xs">Approved On</TableHead>
                <TableHead className="font-semibold text-xs">Approved By</TableHead>
                <TableHead className="font-semibold text-xs">Created On</TableHead>
                <TableHead className="font-semibold text-xs">Created By</TableHead>
                <TableHead className="font-semibold text-xs">Attachments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {
        shouldShowButtons && (
          <div className='flex items-center justify-center gap-4'>
            <button className='bg-green-600 text-white py-2 px-4 rounded-md' onClick={handleApprove}>Approve</button>
            <button className='bg-[#C72030] text-white py-2 px-4 rounded-md'>Reject</button>
          </div>
        )
      }
    </div>
  );
};