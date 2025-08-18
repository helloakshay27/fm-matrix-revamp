import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Printer, Copy, Rss } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { getMaterialPRById } from '@/store/slices/materialPRSlice';
import { numberToIndianCurrencyWords } from '@/utils/amountToText';
import { approvePO } from '@/store/slices/purchaseOrderSlice';

export const PODetailsPage = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const levelId = searchParams.get("level_id");
  const userId = searchParams.get("user_id");

  const shouldShowButtons = Boolean(levelId && userId);

  const navigate = useNavigate();
  const { id } = useParams();

  const [poDetails, setpoDetails] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getMaterialPRById({ baseUrl, token, id })).unwrap();
        setpoDetails(response);
      } catch (error) {
        console.log(error)
        toast.error(error)
      }
    }

    fetchData();
  }, [])

  const poDetail = {
    poNumber: "121240",
    createdBy: "Sony Bhosle",
    createdOn: "22/04/2025",
    supplier: "ABC",
    status: "L1 Approval - Approved",
    phone: "7234013238",
    email: "xyz@zaamserveyservice@gmail.com",
    pan: "BCCGP779796",
    address: "demo world",
    gst: "NA",
    deliveryAddress: "jyoti",
    paymentTenure: "-",
    tds: "NA",
    advanceAmount: "-",
    relatedTo: "NA",
    retention: "-",
    qc: "-"
  };

  const handlePrint = () => {
    window.print();
  };
  const handleFeeds = () => {
    navigate(`/finance/po/feeds/${id}`);
  };

  const handleApprove = async () => {
    const payload = {
      pms_purchase_order: {
        id: Number(id),
        pms_pr_inventories_attributes: poDetails.pms_po_inventories.map((item) => ({
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
      await dispatch(approvePO({ baseUrl, token, id: Number(id), data: payload })).unwrap();
      toast.success('PO approved successfully');
      navigate(`/finance/pending-approvals`)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  };

  return <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
    {/* Header */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
      <div className="flex flex-col">
        <h1 className="font-work-sans font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2">
          PURCHASE ORDER DETAILS
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">L1 Approval:</span>
          <span className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium">
            {poDetails.all_level_approved ? "Approved" : poDetail.all_level_approved === false ? "Rejected" : "Pending"}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700">
            <Copy className="w-4 h-4 mr-1" />
            Clone
          </Button>
          <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700" onClick={handleFeeds}>
            <Rss className="w-4 h-4 mr-1" />
            Feeds
          </Button>
          <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
        </div>

        {/* Logo placeholder */}

      </div>
    </div>

    {/* Vendor/Contact Details Section */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">jyoti</h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Contact details */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Phone</span>
              <span className="ml-8">: {poDetails.billing_address?.phone}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Fax</span>
              <span className="ml-12">: {poDetails.billing_address?.fax}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Email</span>
              <span className="ml-8">: {poDetails.billing_address?.email}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">GST</span>
              <span className="ml-11">: {poDetails.billing_address?.gst_number}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">PAN</span>
              <span className="ml-9">: {poDetails.billing_address?.pan_number}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Address</span>
              <span className="ml-5">: {poDetails.billing_address?.address}</span>
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

    {/* Purchase Order Details Section */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
        Purchase Order (Approved)
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">PO No.</span>
            <span className="text-sm">: {poDetails.external_id}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">PO Date</span>
            <span className="text-sm">: {poDetails.po_date}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Plant Detail</span>
            <span className="text-sm">: {poDetails.plant_detail?.name}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Address</span>
            <span className="text-sm">: {poDetails.supplier?.address}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Email</span>
            <span className="text-sm">: {poDetails.supplier?.email}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">PAN</span>
            <span className="text-sm">: {poDetails.supplier?.pan_number}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Phone</span>
            <span className="text-sm">: {poDetails.supplier?.mobile1}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Related To</span>
            <span className="text-sm">: {poDetails.related_to}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Retention(%)</span>
            <span className="text-sm">: {poDetails.retention}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">QC(%)</span>
            <span className="text-sm">: {poDetails.quality_holding}</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Reference No.</span>
            <span className="text-sm">: {poDetails.reference_number}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">ID</span>
            <span className="text-sm">: {poDetails.id}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Supplier</span>
            <span className="text-sm">: {poDetails.supplier?.company_name}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Phone</span>
            <span className="text-sm">: NA</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">GST</span>
            <span className="text-sm">: {poDetail.gst}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Delivery Address</span>
            <span className="text-sm">: {poDetail.deliveryAddress}<br />demo world</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Email</span>
            <span className="text-sm">: {poDetail.email}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Payment Tenure(In Days)</span>
            <span className="text-sm">: {poDetails.payment_tenure}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">TDS(%)</span>
            <span className="text-sm">: {poDetails.tds}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Advance Amount</span>
            <span className="text-sm">: {poDetails.advance_amount}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Items Table Section */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 min-w-[1200px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">S.No.</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Item</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Availability</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">SAC/HSN Code</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Expected Date</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Product Description</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Quantity</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Unit</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Moving Avg Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Approved Qty</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Transfer Qty</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Wbs Code</th>
            </tr>
          </thead>
          <tbody>
            {poDetails.pms_pr_inventories?.map((item, index) => <tr key={item.sNo} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-3 py-2 text-sm text-center">{index + 1}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.inventory?.name}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm"></td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.sacHsnCode}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.expected_date.split('T')[0]}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.prod_desc}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.quantity}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.unit}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.movingAvgRate}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.rate}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.total_value}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.approved_qty}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.transfer_qty}</td>
              <td className="border border-gray-300 px-3 py-2 text-sm">{item.wbs_code}</td>
            </tr>)}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Net Amount (INR):</span>
            <span className="font-medium">{poDetails.net_amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Taxable Value Of PO:</span>
            <span className="font-medium">{poDetails.total_tax_amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Taxes (INR):</span>
            <span className="font-medium">{poDetails.taxes}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total PO Value (INR):</span>
            <span className="font-medium">{poDetails.total_amount}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="font-medium text-gray-700">Amount In Words:</span>
            <span className="font-medium">{numberToIndianCurrencyWords(poDetails.total_amount)}</span>
          </div>
        </div>
      </div>

    </div>

    {/* Notes and Terms Section */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes:</h3>
          <p className="text-gray-700 ml-4">NA</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Terms & Conditions:</h3>
          <p className="text-gray-700 ml-4">NA</p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-900 font-medium mb-8">For NA we Confirm & Accept,</p>
        </div>

        <div>
          <p className="text-gray-900 font-medium">Authorised Signatory</p>
        </div>
      </div>
    </div>

    {/* Attachments Section */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
      <div className="flex items-center gap-2 text-blue-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="cursor-pointer hover:underline">PSIPL_Feedback_QR_code.pptx.pdf</span>
      </div>
    </div>

    {/* GRN Details Table */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">GRN Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 min-w-[1800px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Action</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">ID</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Inventory</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Supplier</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Invoice Number</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Total GRN Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payable Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Retention Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">TDS Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">QC Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Invoice Date</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payment Mode</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Other Expense</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Loading Expense</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Adjustment Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">QC Approval Status</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">HSE Approval Status</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Admin Approval Status</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Physical Invoice Sent to Accounts</th>
            </tr>
          </thead>
          <tbody>
            {/* Empty rows for now */}
            <tr>
              <td className="border border-gray-300 px-3 py-2 text-sm text-center" colSpan={19}>
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Payment Details Table */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">GRN ID</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payment Mode</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Transaction Number</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Status</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payment Date</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Note</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Date Of Entry</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2 text-sm text-center" colSpan={8}>
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Debit/Credit Note Details Table */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Debit/Credit Note Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">ID</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Type</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Description</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Approved</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Approved On</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Approved By</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Created On</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Created By</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Attachment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2 text-sm text-center" colSpan={10}>
                No data available
              </td>
            </tr>
          </tbody>
        </table>
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
  </div>;
};