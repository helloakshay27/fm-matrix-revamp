import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Printer, Rss } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getWorkOrderById } from '@/store/slices/workOrderSlice';
import { numberToIndianCurrencyWords } from '@/utils/amountToText';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';

const boqColumns: ColumnConfig[] = [
  { key: 'sno', label: 'S.No', sortable: true, draggable: true },
  { key: 'boq_details', label: 'BOQ Details', sortable: true, draggable: true },
  { key: 'quantity', label: 'Quantity', sortable: true, draggable: true },
  { key: 'uom', label: 'UOM', sortable: true, draggable: true },
  { key: 'expected_date', label: 'Expected Date', sortable: true, draggable: true },
  { key: 'product_description', label: 'Product Description', sortable: true, draggable: true },
  { key: 'rate', label: 'Rate', sortable: true, draggable: true },
  { key: 'wbs_code', label: 'Wbs Code', sortable: true, draggable: true },
  { key: 'cgst_rate', label: 'CGST Rate(%)', sortable: true, draggable: true },
  { key: 'cgst_amount', label: 'CGST Amount', sortable: true, draggable: true },
  { key: 'sgst_rate', label: 'SGST Rate(%)', sortable: true, draggable: true },
  { key: 'sgst_amount', label: 'SGST Amount', sortable: true, draggable: true },
  { key: 'igst_rate', label: 'IGST Rate(%)', sortable: true, draggable: true },
  { key: 'igst_amount', label: 'IGST Amount', sortable: true, draggable: true },
  { key: 'tcs_rate', label: 'TCS Rate(%)', sortable: true, draggable: true },
  { key: 'tcs_amount', label: 'TCS Amount', sortable: true, draggable: true },
  { key: 'tax_amount', label: 'Tax Amount', sortable: true, draggable: true },
  { key: 'total_amount', label: 'Total Amount', sortable: true, draggable: true },
];

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

  const [workOrder, setWorkOrder] = useState({
    letter_of_indent: false,
    plant_detail_id: null,
    external_id: null,
    all_level_approved: false,
    lup: { has: { send_to_sap: { create: false } } },
    id: id,
    company: { site_name: '', phone: '', fax: '', email: '', gst: '', pan: '', address: '' },
    work_order: { wo_status: '', number: '', wo_date: '', kind_attention: '', subject: '', related_to: '', advance_amount: '', description: '', reference_number: '', id: '', contractor: '', contractorAddress: '', supplier_details: { mobile1: '', email: '', gstin_number: '', pan_number: '' }, work_category: '' },
    payment_terms: { payment_tenure: '', retention: '', tds: '', qc: '' },
    inventories: [],
    totals: { net_amount: '', total_taxable: '', taxes: '', total_value: '' },
    pms_po_inventories: [],
  })

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
      <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="font-work-sans font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2">
            WORK ORDER DETAILS
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Level 1 Approval:</span>
            {/* <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(woDetails.level1Approval)}`}>
              {woDetails.level1Approval}
            </span> */}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          {/* <span className={`px-4 py-2 rounded text-sm font-medium ${getStatusColor(woDetails.status)}`}>
            Status:- {woDetails.status}
          </span> */}
          <div className="flex gap-2 flex-wrap">
            {/* Conditional SAP and WBS buttons */}
            {workOrder.letter_of_indent === true &&
              workOrder.plant_detail_id &&
              !workOrder.external_id &&
              workOrder.all_level_approved &&
              workOrder.lup?.has?.send_to_sap?.create && (
                <>
                  <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white sap_button mr-2" onClick={() => navigate(`/pms/work_orders/${workOrder.id}?send_sap=yes`)}>
                    Send To SAP Team
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-300 btn-primary mr-2" data-bs-toggle="modal" data-bs-target="#wbsBulkModal">
                    Edit WBS Codes
                  </Button>
                </>
              )}
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
          <EnhancedTable
            data={workOrder.inventories}
            columns={boqColumns}
            storageKey="boq-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            exportFileName="boq-details"
            pagination={true}
            pageSize={10}
            emptyMessage="No BOQ data available"
            className="min-w-[1200px] h-max"
            renderCell={(item, columnKey) => {
              if (columnKey === 'total_amount') {
                return <span className="font-medium">{item[columnKey]}</span>;
              }
              return item[columnKey];
            }}
          />
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

      {/* Invoices/SES Details Section with EnhancedTable */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoices/SES Details</h3>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={invoiceData}
            columns={[
              { key: 'actions', label: 'Actions', draggable: false },
              { key: 'id', label: 'ID', sortable: true, draggable: true },
              { key: 'invoice_number', label: 'Invoice Number', sortable: true, draggable: true },
              { key: 'invoice_date', label: 'Invoice Date', sortable: true, draggable: true },
              { key: 'total_invoice_amount', label: 'Total Invoice Amount', sortable: true, draggable: true },
              { key: 'payable_amount', label: 'Payable Amount', sortable: true, draggable: true },
              { key: 'retention_amount', label: 'Retention Amount', sortable: true, draggable: true },
              { key: 'tds_amount', label: 'TDS Amount', sortable: true, draggable: true },
              { key: 'qc_amount', label: 'QC Amount', sortable: true, draggable: true },
              { key: 'wo_number', label: 'W.O. Number', sortable: true, draggable: true },
              { key: 'physical_invoice_sent', label: 'Physical Invoice Sent to Accounts', sortable: true, draggable: true },
              { key: 'physical_invoice_received', label: 'Physical Invoice Received', sortable: true, draggable: true },
            ]}
            storageKey="invoice-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            exportFileName="invoice-details"
            pagination={true}
            pageSize={10}
            emptyMessage="No invoice data available"
            className="min-w-[1000px] h-max"
          />
        </div>
      </div>

      {/* Payment Details Section with EnhancedTable */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={paymentData}
            columns={[
              { key: 'invoice_id', label: 'Invoice ID', sortable: true, draggable: true },
              { key: 'amount', label: 'Amount', sortable: true, draggable: true },
              { key: 'payment_mode', label: 'Payment Mode', sortable: true, draggable: true },
              { key: 'transaction_number', label: 'Transaction Number', sortable: true, draggable: true },
              { key: 'status', label: 'Status', sortable: true, draggable: true },
              { key: 'payment_date', label: 'Payment Date', sortable: true, draggable: true },
              { key: 'note', label: 'Note', sortable: true, draggable: true },
              { key: 'date_of_entry', label: 'Date of Entry', sortable: true, draggable: true },
            ]}
            storageKey="payment-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            exportFileName="payment-details"
            pagination={true}
            pageSize={10}
            emptyMessage="No payment data available"
            className="min-w-[800px] h-max"
          />
        </div>
      </div>

      {/* Debit/Credit Note Details Section with EnhancedTable */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Debit/Credit Note Details</h3>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={[]}
            columns={[
              { key: 'id', label: 'ID', sortable: true, draggable: true },
              { key: 'type', label: 'Type', sortable: true, draggable: true },
              { key: 'amount', label: 'Amount', sortable: true, draggable: true },
              { key: 'description', label: 'Description', sortable: true, draggable: true },
              { key: 'approved', label: 'Approved', sortable: true, draggable: true },
              { key: 'approved_on', label: 'Approved On', sortable: true, draggable: true },
              { key: 'approved_by', label: 'Approved By', sortable: true, draggable: true },
              { key: 'created_on', label: 'Created On', sortable: true, draggable: true },
              { key: 'created_by', label: 'Created By', sortable: true, draggable: true },
              { key: 'attachments', label: 'Attachments', sortable: true, draggable: true },
            ]}
            storageKey="debit-credit-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            exportFileName="debit-credit-details"
            pagination={true}
            pageSize={10}
            emptyMessage="No data available"
            className="min-w-[1000px] h-max"
          />
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