import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Printer, Copy, Rss } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { approvePO } from '@/store/slices/purchaseOrderSlice';
import { fetchSingleGRN, approveGRN } from '@/store/slices/grnSlice';

export const GRNDetailsPage = () => {
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

  const [grnDetails, setGrnDetails] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchSingleGRN({ baseUrl, token, id: Number(id) })).unwrap();
        setGrnDetails(response.grn || {});
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };
    if (id) fetchData();
  }, [dispatch, baseUrl, token, id]);

  // Helper for safe access
  const purchaseOrder = grnDetails.purchase_order || {};
  const supplier = grnDetails.supplier || {};
  const billingAddress = purchaseOrder.billing_address || {};
  const approvalStatus = grnDetails.approval_status || {};

  const handlePrint = () => {
    window.print();
  };
  const handleFeeds = () => {
    navigate(`/finance/po/feeds/${id}`);
  };

  const handleApprove = async () => {
    const payload = {
      level_id: levelId,
      approve: "true",
      user_id: userId
    };
    try {
      await dispatch(approveGRN({ baseUrl, token, id: Number(id), data: payload })).unwrap();
      toast.success('GRN approved successfully');
      navigate(`/finance/pending-approvals`);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
    {/* Header */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
      <div className="flex flex-col">
        <h1 className="font-work-sans font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2">
          GRN DETAILS
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">L1 Approval:</span>
          <span className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium">
            {approvalStatus.all_level_approved ? "Approved" : approvalStatus.all_level_approved === false ? "Rejected" : "Pending"}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
        <div className="flex gap-2 flex-wrap">
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{billingAddress.building_name}</h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Contact details */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Phone</span>
              <span className="ml-8">: {billingAddress.phone}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Fax</span>
              <span className="ml-12">: {billingAddress.fax}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Email</span>
              <span className="ml-8">: {billingAddress.email}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">GST</span>
              <span className="ml-11">: {billingAddress.gst_number}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">PAN</span>
              <span className="ml-9">: {billingAddress.pan_number}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Address</span>
              <span className="ml-5">: {billingAddress.address}</span>
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
        GRN
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Invoice Number</span>
            <span className="text-sm">: {grnDetails.invoice_no}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Invoice Date</span>
            <span className="text-sm">: {grnDetails.bill_date}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Posting Date</span>
            <span className="text-sm">: {grnDetails.posting_date}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Retention Amount</span>
            <span className="text-sm">: {grnDetails.retention_amount}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">TDS Amount</span>
            <span className="text-sm">: {grnDetails.tds_amount}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">PO Reference Number</span>
            <span className="text-sm">: {purchaseOrder.reference_number}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">GRN Amount</span>
            <span className="text-sm">: {grnDetails.grn_amount}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Payment Mode</span>
            <span className="text-sm">: {grnDetails.payment_mod}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Payable Amount</span>
            <span className="text-sm">: {grnDetails.payable_amount}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Related To</span>
            <span className="text-sm">: {grnDetails.related_to}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Physical Invoice sent to</span>
            <span className="text-sm">: {grnDetails.invoice_sent_at}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Gross Amount</span>
            <span className="text-sm">: {grnDetails.amount}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Notes</span>
            <span className="text-sm">: {grnDetails.notes}</span>
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Reference No.</span>
            <span className="text-sm">: {purchaseOrder.reference_number}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">ID</span>
            <span className="text-sm">: {grnDetails.id}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Supplier Name</span>
            <span className="text-sm">: {supplier.company_name}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">PO Number</span>
            <span className="text-sm">: {purchaseOrder.reference_number}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">QC Amount</span>
            <span className="text-sm">: {grnDetails.qh_amount}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Total Taxes</span>
            <span className="text-sm">: {grnDetails.total_taxes}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">PO Amount</span>
            <span className="text-sm">: {purchaseOrder.amount}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Invoice Amount</span>
            <span className="text-sm">: {grnDetails.invoice_amount}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">GRN Amount</span>
            <span className="text-sm">: {grnDetails.grn_amount}</span>
          </div>
          <div className="flex">
            <span className="text-sm font-medium text-gray-700 w-44">Physical Invoice received on</span>
            <span className="text-sm">: {grnDetails.invoice_received_at}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Items Table Section */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 min-w-[1800px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">S.No.</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Inventory</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Expected Quantity</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Received Quantity</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Unit</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Approved Qty</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Rejected Qty</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">CGST Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">CGST Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">SGST Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">SGST Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">IGST Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">IGST Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">TCS Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">TCS Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Total Taxes</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {grnDetails.grn_inventories?.map((item: any, index: number) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 text-sm text-center">{index + 1}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.inventory_name}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.expected_quantity}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.received_quantity}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.unit_type}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.rate}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.approved_qty}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.rejected_qty}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.cgst_rate}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.cgst_amount}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.sgst_rate}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.sgst_amount}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.igst_rate}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.igst_amount}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.tcs_rate}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.tcs_amount}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.taxable_value}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{item.total_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Other Expenses Section */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Other Expense:</span>
            <span className="font-medium">{grnDetails.other_expenses}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Loading Expense:</span>
            <span className="font-medium">{grnDetails.loading_expense}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Adjustment Amount:</span>
            <span className="font-medium">{grnDetails.adj_amount}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Attachments Section */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
      <div className="flex flex-col gap-2 text-blue-600">
        {grnDetails.attachments?.general_attachments?.map((att: any) => (
          <div key={att.id} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <a href={decodeURIComponent(att.document_url)} target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:underline">{att.filename}</a>
          </div>
        ))}
      </div>
    </div>

    {/* Debit Note Details Card */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Debit Note Details</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">ID</th>
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
            {grnDetails.debit_notes?.length ? grnDetails.debit_notes.map((note: any) => (
              <tr key={note.id}>
                <td className="border border-gray-300 px-3 py-2 text-sm">{note.id}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{note.amount}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{note.description}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{note.approved ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{note.approved_on}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{note.approved_by}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{note.created_on}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{note.created_by}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{note.attachment ? <a href={note.attachment} target="_blank" rel="noopener noreferrer">View</a> : '-'}</td>
              </tr>
            )) : <tr><td colSpan={9} className="text-center py-2">No data</td></tr>}
          </tbody>
        </table>
      </div>
    </div>

    {/* Payment Details Card */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Action</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payment Mode</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Transaction Number</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Status</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payment Date</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Note</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Date of Entry</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grnDetails.payment_details?.length ? grnDetails.payment_details.map((pay: any, idx: number) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-3 py-2 text-sm">{pay.action}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{pay.amount}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{pay.payment_mode}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{pay.transaction_number}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{pay.status}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{pay.payment_date}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{pay.note}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{pay.date_of_entry}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">-</td>
              </tr>
            )) : <tr><td colSpan={9} className="text-center py-2">No data</td></tr>}
          </tbody>
        </table>
      </div>
    </div>

    {/* Retention Payment Details Card */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Retention Payment Details</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Action</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payment Mode</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Transaction Number</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Status</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payment Date</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Note</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Date of Entry</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grnDetails.retention_payment_details?.length ? grnDetails.retention_payment_details.map((ret: any, idx: number) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-3 py-2 text-sm">{ret.action}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{ret.amount}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{ret.payment_mode}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{ret.transaction_number}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{ret.status}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{ret.payment_date}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{ret.note}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{ret.date_of_entry}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">-</td>
              </tr>
            )) : <tr><td colSpan={9} className="text-center py-2">No data</td></tr>}
          </tbody>
        </table>
      </div>
    </div>

    {/* QC Payment Details Card */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">QC Payment Details</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payment Mode</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Transaction Number</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Status</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Payment Date</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Note</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Date of Entry</th>
              <th className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grnDetails.qc_payment_details?.length ? grnDetails.qc_payment_details.map((qc: any, idx: number) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-3 py-2 text-sm">{qc.amount}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{qc.payment_mode}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{qc.transaction_number}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{qc.status}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{qc.payment_date}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{qc.note}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{qc.date_of_entry}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">-</td>
              </tr>
            )) : <tr><td colSpan={8} className="text-center py-2">No data</td></tr>}
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