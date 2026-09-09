import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Receipt, Printer, Ban, Wallet } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppDispatch } from "@/store/hooks";
import { cancelCustomerBill, createCustomerBillPayment, getCustomerBillById } from "@/store/slices/customerBillsSlice";
import { toast } from "sonner";
import { UpdatePaymentModal, type UpdatePaymentSubmitData } from "@/components/UpdatePaymentModal";
import { CancelBillModal } from "@/components/CancelBillModal";

interface CustomerBillDetail {
  id: number;
  bill_number: string;
  status: string;
  total_amount: number;
  due_date: string;
  entity_name: string;
  publish: boolean;
  note: string | null;
  payments: Array<Record<string, unknown>>;
}

const paymentColumns: ColumnConfig[] = [
  { key: "date", label: "Date", sortable: false, defaultVisible: true },
  { key: "amount", label: "Amount", sortable: false, defaultVisible: true },
  { key: "mode", label: "Mode", sortable: false, defaultVisible: true },
  { key: "reference", label: "Reference", sortable: false, defaultVisible: true },
];

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return format(date, "dd/MM/yyyy");
};

const formatIndian = (val: unknown): string => {
  const n = typeof val === "number" ? val : parseFloat(String(val));
  if (isNaN(n)) return "-";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

export const CustomerBillDetailsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("token") ?? "";
  const baseUrl = localStorage.getItem("baseUrl") ?? "";
  const currency = localStorage.getItem("currency") || "";

  const [bill, setBill] = useState<CustomerBillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const fetchBill = () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    dispatch(getCustomerBillById({ baseUrl, token, id }))
      .unwrap()
      .then((response) => setBill(response))
      .catch((error) => {
        console.error("Error fetching customer bill:", error);
        toast.error(String(error) || "Failed to fetch customer bill");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBill();
  }, [dispatch, baseUrl, token, id]);

  const paidSoFar = (bill?.payments || []).reduce(
    (sum, payment) => sum + (Number((payment as Record<string, unknown>).amount) || 0),
    0
  );
  const pendingAmount = (bill?.total_amount || 0) - paidSoFar;

  const handleSubmitPayment = async (data: UpdatePaymentSubmitData) => {
    if (!id) return;
    setIsSubmittingPayment(true);
    try {
      await dispatch(
        createCustomerBillPayment({
          baseUrl,
          token,
          id,
          data: {
            lock_payment: {
              total_amount: data.amountPaid,
              payment_method: data.paymentMode,
              payment_mode: data.paymentMode,
              pg_transaction_id: data.transactionNumber || null,
              cheque_date: data.paymentDate || null,
              notes: data.note,
            },
            cusdirect: null,
          },
        })
      ).unwrap();
      toast.success("Payment recorded successfully");
      setIsPaymentModalOpen(false);
      fetchBill();
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error(String(error) || "Failed to record payment");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleCancelBill = async (cancelNote: string) => {
    if (!id) return;
    setIsSubmittingCancel(true);
    try {
      await dispatch(cancelCustomerBill({ baseUrl, token, id, cancelNote })).unwrap();
      toast.success("Bill cancelled successfully");
      setIsCancelModalOpen(false);
      fetchBill();
    } catch (error) {
      console.error("Error cancelling bill:", error);
      toast.error(String(error) || "Failed to cancel bill");
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-brand-text">Loading bill details...</p>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2 p-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <p className="text-brand-text-light">Bill not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2 p-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-brand-text">Customer Bill</h1>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => {}}>
            <Printer className="w-4 h-4 mr-1" />
            Print Invoice
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsCancelModalOpen(true)}>
            <Ban className="w-4 h-4 mr-1" />
            Cancel Invoice
          </Button>
          <Button
            size="sm"
            className="bg-brand hover:bg-brand-hover text-white"
            onClick={() => setIsPaymentModalOpen(true)}
          >
            <Wallet className="w-4 h-4 mr-1" />
            Receive Payment
          </Button>
        </div>
      </div>

      {/* Bill Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-light text-brand">
            <Receipt className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-brand-text">{bill.entity_name}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <span className="text-brand-text-light min-w-[180px]">ID</span>
            <span className="text-brand-text-light mx-2">:</span>
            <span className="text-brand-text font-medium">{bill.id}</span>
          </div>
          <div className="flex items-start">
            <span className="text-brand-text-light min-w-[180px]">Bill Number</span>
            <span className="text-brand-text-light mx-2">:</span>
            <span className="text-brand-text font-medium">{bill.bill_number}</span>
          </div>
          <div className="flex items-start">
            <span className="text-brand-text-light min-w-[180px]">Customer</span>
            <span className="text-brand-text-light mx-2">:</span>
            <span className="text-brand-text font-medium">{bill.entity_name}</span>
          </div>
          <div className="flex items-start">
            <span className="text-brand-text-light min-w-[180px]">Total Amount</span>
            <span className="text-brand-text-light mx-2">:</span>
            <span className="text-brand-text font-medium">
              {currency} {formatIndian(bill.total_amount)}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-brand-text-light min-w-[180px]">Due Date</span>
            <span className="text-brand-text-light mx-2">:</span>
            <span className="text-brand-text font-medium">{formatDate(bill.due_date)}</span>
          </div>
          <div className="flex items-start">
            <span className="text-brand-text-light min-w-[180px]">Status</span>
            <span className="text-brand-text-light mx-2">:</span>
            <span className="text-brand-text font-medium">
              {bill.status ? <StatusBadge status={bill.status}>{bill.status}</StatusBadge> : "-"}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-brand-text-light min-w-[180px]">Published</span>
            <span className="text-brand-text-light mx-2">:</span>
            <span className="text-brand-text font-medium">{bill.publish ? "Yes" : "No"}</span>
          </div>
          <div className="flex items-start">
            <span className="text-brand-text-light min-w-[180px]">Note</span>
            <span className="text-brand-text-light mx-2">:</span>
            <span className="text-brand-text font-medium">{bill.note || "-"}</span>
          </div>
        </div>
      </div>

      {/* Payments Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-3 pb-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-light text-brand">
            <Receipt className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-brand-text">Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={bill.payments || []}
            columns={paymentColumns}
            storageKey="customer-bill-payments-table"
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            pagination={false}
            emptyMessage="No payments recorded"
            renderCell={(item: Record<string, unknown>, columnKey: string) => {
              if (columnKey === "amount") return formatIndian(item.amount);
              if (columnKey === "date") return formatDate(item.date as string);
              return (item[columnKey] as string) ?? "-";
            }}
          />
        </div>
      </div>

      <UpdatePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        pendingAmount={pendingAmount}
        isSubmitting={isSubmittingPayment}
        onSubmit={handleSubmitPayment}
      />

      <CancelBillModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        isSubmitting={isSubmittingCancel}
        onSubmit={handleCancelBill}
      />
    </div>
  );
};
