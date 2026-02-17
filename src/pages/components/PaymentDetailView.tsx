import React from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  Plus,
  MoreHorizontal,
  Paperclip,
  MessageSquare,
  Edit,
  Printer,
  FileText,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Reuse the Payment interface or import it (if exported)
// ideally it should be imported, but for now I'll redefine or stick to a generic input if not easily shareable without circular deps.
// Better to export it from PaymentsMadePage or a types file.
// For this step I will assume it is passed as a prop with the right shape.

interface Payment {
  id: string;
  payment_number: string;
  vendor_name: string;
  date: string;
  mode: string;
  status: "DRAFT" | "PAID" | "VOID";
  amount: number;
  unused_amount: number;
  bank_reference_number: string;
  paid_through_account: string;
  currency_symbol: string;
}

interface PaymentDetailViewProps {
  payments: Payment[];
  selectedPaymentId: string | null;
  onSelectPayment: (id: string) => void;
  onClose: () => void;
}

export const PaymentDetailView: React.FC<PaymentDetailViewProps> = ({
  payments,
  selectedPaymentId,
  onSelectPayment,
  onClose,
}) => {
  const selectedPayment = payments.find((p) => p.id === selectedPaymentId);

  if (!selectedPayment) return null;

  return (
    <div className="flex h-[calc(100vh-140px)] border-t border-gray-200">
      {/* Sidebar List */}
      <div className="w-[350px] border-r border-gray-200 flex flex-col bg-white">
        {/* Sidebar Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <button className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900">
            All Payments <span className="text-[10px] ml-1">▼</span>
          </button>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white h-8 w-8 p-0 rounded-md"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 border-gray-300 text-gray-600"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Payment List */}
        <div className="flex-1 overflow-y-auto">
          {payments.map((payment) => (
            <div
              key={payment.id}
              onClick={() => onSelectPayment(payment.id)}
              className={cn(
                "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group relative",
                selectedPaymentId === payment.id
                  ? "bg-[#f3f4f6] border-l-[3px] border-l-red-500"
                  : "border-l-[3px] border-l-transparent"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    checked={false} // Placeholder
                    readOnly
                  />
                  <span className="font-medium text-gray-900 text-sm">
                    {payment.vendor_name}
                  </span>
                </div>
                <span className="font-medium text-gray-900 text-sm">
                  {payment.currency_symbol}
                  {payment.amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 pl-5">
                <span>
                  {payment.date} • {payment.mode}
                </span>
              </div>
              <div className="pl-5 mt-1">
                <span
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-wider",
                    payment.status === "PAID"
                      ? "text-green-600"
                      : "text-gray-500"
                  )}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Content */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto relative">
        {/* Detail Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedPayment.payment_number}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-500 hover:bg-red-50"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center gap-2 shadow-sm sticky top-[61px] z-10">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:bg-gray-100 gap-2 h-8"
          >
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <div className="w-px h-4 bg-gray-300"></div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:bg-gray-100 gap-2 h-8"
          >
            <FileText className="h-4 w-4" /> PDF/Print{" "}
            <span className="text-[10px]">▼</span>
          </Button>
          <div className="w-px h-4 bg-gray-300"></div>
          {selectedPayment.status === "DRAFT" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:bg-gray-100 gap-2 h-8"
            >
              <CheckCircle className="h-4 w-4" /> Mark as Paid
            </Button>
          )}
          <div className="w-px h-4 bg-gray-300"></div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-500"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Document Area */}
        <div className="p-8 pb-20 justify-center flex">
          <div className="w-full max-w-4xl space-y-6">
            {/* Next Action Banner */}
            {selectedPayment.status === "DRAFT" && (
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-purple-500 fill-purple-100" />
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900 mr-1">
                      WHAT'S NEXT?
                    </span>
                    <span className="text-gray-600">
                      Mark the payment as Paid to confirm that it has been sent.
                    </span>
                  </div>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white h-8 text-sm px-4">
                  Mark as Paid
                </Button>
              </div>
            )}
            {selectedPayment.status === "PAID" && (
              <div className="bg-gray-200 text-gray-600 px-4 py-3 rounded-md shadow-sm mb-6 flex items-center animate-in fade-in zoom-in-95 duration-200 w-fit">
                <span className="text-sm">
                  The Paid status indicates that your vendor has received this
                  payment.
                </span>
              </div>
            )}

            {/* Receipt Preview */}
            <div className="bg-white shadow-xl min-h-[900px] p-16 relative mx-auto text-gray-800">
              {/* Draft Ribbon */}
              {selectedPayment.status === "DRAFT" && (
                <div className="absolute top-0 left-0">
                  <div className="bg-gray-500 text-white text-xs font-bold px-12 py-1 transform -rotate-45 -translate-x-10 translate-y-8 text-center shadow-md border-b-2 border-gray-600 tracking-wider">
                    DRAFT
                  </div>
                </div>
              )}

              {/* Paid Ribbon (Optional) */}
              {selectedPayment.status === "PAID" && (
                <div className="absolute top-0 left-0">
                  <div className="bg-green-600 text-white text-xs font-bold px-12 py-1 transform -rotate-45 -translate-x-10 translate-y-8 text-center shadow-md border-b-2 border-green-700 tracking-wider">
                    PAID
                  </div>
                </div>
              )}

              {/* Header Info */}
              <div className="mt-8 flex flex-col items-start gap-1">
                <h1 className="font-bold text-2xl text-gray-900 mb-2">
                  Lockated
                </h1>
                <p className="text-sm text-gray-500">pune Maharashtra 411006</p>
                <p className="text-sm text-gray-500">India</p>
                <p className="text-sm text-gray-500">
                  ajay.phulkar@lockated.com
                </p>
              </div>

              {/* Title */}
              <div className="mt-16 mb-12 text-center">
                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 inline-block pb-1">
                  Payments Made
                </h2>
              </div>

              {/* Details and Amount */}
              <div className="flex justify-between items-start">
                <div className="w-2/3 space-y-5">
                  {/* Row 1 */}
                  <div className="grid grid-cols-[160px_1fr] items-center border-b border-gray-100 py-3">
                    <span className="text-gray-600 font-medium text-sm">
                      Payment#
                    </span>
                    <span className="text-gray-900 font-medium text-sm">
                      {selectedPayment.payment_number}
                    </span>
                  </div>
                  {/* Row 2 */}
                  <div className="grid grid-cols-[160px_1fr] items-center border-b border-gray-100 py-3">
                    <span className="text-gray-600 font-medium text-sm">
                      Payment Date
                    </span>
                    <span className="text-gray-900 font-bold text-sm">
                      {selectedPayment.date}
                    </span>
                  </div>
                  {/* Row 3 */}
                  <div className="grid grid-cols-[160px_1fr] items-center border-b border-gray-100 py-3">
                    <span className="text-gray-600 font-medium text-sm">
                      Reference Number
                    </span>
                    <span className="text-gray-900 font-medium text-sm">
                      {selectedPayment.bank_reference_number || ""}
                    </span>
                  </div>
                  {/* Row 4 - Paid To */}
                  <div className="grid grid-cols-[160px_1fr] items-start border-b border-gray-100 py-3">
                    <span className="text-gray-600 font-medium text-sm mt-1">
                      Paid To
                    </span>
                    <div>
                      <div className="text-red-600 font-bold text-sm cursor-pointer hover:underline mb-1">
                        {selectedPayment.vendor_name}
                      </div>
                      <div className="text-gray-500 text-sm">Aland Islands</div>
                    </div>
                  </div>
                  {/* Row 5 */}
                  <div className="grid grid-cols-[160px_1fr] items-center border-b border-gray-100 py-3">
                    <span className="text-gray-600 font-medium text-sm">
                      Payment Mode
                    </span>
                    <span className="text-gray-900 font-medium text-sm">
                      {selectedPayment.mode}
                    </span>
                  </div>
                  {/* Row 6 */}
                  <div className="grid grid-cols-[160px_1fr] items-center border-b border-gray-100 py-3">
                    <span className="text-gray-600 font-medium text-sm">
                      Paid Through
                    </span>
                    <span className="text-gray-900 font-medium text-sm">
                      {selectedPayment.paid_through_account}
                    </span>
                  </div>
                </div>

                {/* Amount Box */}
                <div className="bg-[#78ae54] text-white p-6 w-[240px] text-center flex flex-col justify-center items-center shadow-sm">
                  <div className="text-sm font-medium mb-1 invert-0">
                    Amount Paid
                  </div>
                  <div className="text-2xl font-bold tracking-wide">
                    {selectedPayment.currency_symbol}
                    {selectedPayment.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="grid grid-cols-[160px_1fr] items-start">
                  <span className="text-gray-600 font-medium text-sm">
                    Amount Paid In Words
                  </span>
                  <span className="text-gray-900 font-medium text-sm italic">
                    Indian Rupee One Thousand Two Hundred Thirty Four Only
                  </span>
                </div>
              </div>

              {/* Over Payment Section */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                <span className="text-gray-600 text-sm mr-2">
                  Over payment:
                </span>
                <span className="text-gray-900 font-medium text-sm">
                  {selectedPayment.currency_symbol}
                  {selectedPayment.amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Journal Section */}
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="border-b border-gray-200">
                <button className="px-1 py-2 border-b-2 border-red-600 text-sm font-medium text-gray-900">
                  Journal
                </button>
              </div>
              <div className="py-4 text-gray-500 text-sm w-full">
                {selectedPayment.status === "PAID" ? (
                  <div className="mt-2 w-full">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        Amount is displayed in your base currency
                        <span className="bg-green-600 text-white px-1 text-[10px] font-bold rounded-sm">
                          INR
                        </span>
                      </div>
                      <div className="flex border border-gray-300 rounded overflow-hidden text-xs">
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 font-bold border-r border-gray-300 shadow-inner">
                          Accrual
                        </button>
                        <button className="px-3 py-1 bg-white text-gray-500 hover:bg-gray-50">
                          Cash
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-4 text-base">
                      Vendor Payment - {selectedPayment.payment_number}
                    </h3>

                    <div className="w-full">
                      <div className="grid grid-cols-[1fr_150px_150px] border-b border-gray-200 pb-2 mb-0 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                        <div>ACCOUNT</div>
                        <div className="text-right">DEBIT</div>
                        <div className="text-right">CREDIT</div>
                      </div>
                      <div className="grid grid-cols-[1fr_150px_150px] border-b border-gray-100 py-3 text-sm text-gray-700 items-center hover:bg-gray-50">
                        <div className="text-gray-900 hover:text-blue-600 cursor-pointer">
                          Prepaid Expenses
                        </div>
                        <div className="text-right">
                          {selectedPayment.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-right">0.00</div>
                      </div>
                      <div className="grid grid-cols-[1fr_150px_150px] border-b-2 border-gray-200 py-3 text-sm text-gray-700 items-center hover:bg-gray-50">
                        <div className="text-gray-900 hover:text-blue-600 cursor-pointer">
                          Petty Cash
                        </div>
                        <div className="text-right">0.00</div>
                        <div className="text-right">
                          {selectedPayment.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_150px_150px] pt-3 text-sm font-bold text-gray-900 items-center">
                        <div></div>
                        <div className="text-right">
                          {selectedPayment.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-right">
                          {selectedPayment.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : selectedPayment.status === "DRAFT" ? (
                  "Journal entries will not be available for Payments in the Draft state."
                ) : (
                  "No journal entries found."
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
