import React from "react";
import { numberToIndianCurrencyWords } from "@/utils/amountToText";

export const getAccountingPdfStatusStyle = (status) => {
  const styles = {
    draft: { backgroundColor: "#f3f4f6", color: "#1f2937", borderColor: "#e5e7eb" },
    paid: { backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" },
    partial: { backgroundColor: "#fef9c3", color: "#854d0e", borderColor: "#fde68a" },
    cancelled: { backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" },
  };

  return styles[String(status || "").toLowerCase()] || styles.draft;
};

const formatStatus = (status) => {
  const label = String(status || "draft").replace(/_/g, " ");
  return label.replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatAddressBlock = (address) => {
  if (!address) return ["N/A"];

  const cityLine = [address.city, address.state, address.country]
    .filter(Boolean)
    .join(", ");

  return [
    address.address,
    address.address_line_two,
    cityLine
      ? `${cityLine}${address.pin_code ? `, ${address.pin_code}` : ""}`
      : "",
    address.contact_person
      ? `Contact: ${address.contact_person}`
      : "",
    address.telephone_number
      ? `Phone: ${address.telephone_number}`
      : "",
  ].filter(Boolean);
};

const PaymentReceivedPdf = ({
  data = {},
  invoices = [],
  formatDate,
  formatCurrency,
}) => {
  const companyName =
    localStorage.getItem("companyName") || "Lockated";

  const companyAddress =
    localStorage.getItem("companyAddress") ||
    "Pune Maharashtra 411006";

  const companyCountry =
    localStorage.getItem("companyCountry") || "India";

  const companyEmail =
    localStorage.getItem("companyEmail") ||
    "ajay.pihulkar@lockated.com";

  const gstin =
    data?.address_detail?.gst_detail?.gstin ||
    localStorage.getItem("gstin") ||
    "27AGOPL6958QABC";

  const customer =
    data?.customer_name ||
    data?.customer?.display_name ||
    "N/A";

  const billingAddress =
    data?.address_detail?.billing_address ||
    data?.billing_address;

  const totalAmount = Number(data?.amount || 0);

  const amountInWords =
    data?.amount_in_words ||
    numberToIndianCurrencyWords(totalAmount);

  const statusDisplay = formatStatus(
    data?.status || "paid"
  );

  return (
    <div
      className="bg-white text-black p-8 text-[11px] leading-tight"
      style={{
        width: "794px",
        minHeight: "1123px",
      }}
    >
      <div
        className="mx-auto border border-gray-400 bg-white"
        style={{ width: "700px" }}
      >
        {/* Header */}
        <div className="relative border-b border-gray-400 p-6">
          <div className="absolute top-0 left-0">
            <div
              className="bg-green-500 text-white text-[10px] px-8 py-1 rotate-[-45deg] translate-x-[-28px] translate-y-[18px]"
            >
              PAID
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-[22px] font-bold mb-2">
                {companyName}
              </h1>

              <div className="space-y-1 text-[11px]">
                <p>{companyAddress}</p>
                <p>{companyCountry}</p>
                <p>{companyEmail}</p>
                <p>GSTIN: {gstin}</p>
              </div>
            </div>

            <div className="text-right">
              <span
                className="inline-flex items-center border px-3 py-1 text-[11px] font-bold mb-3"
                style={getAccountingPdfStatusStyle(data?.status)}
              >
                {statusDisplay}
              </span>

              <h2 className="text-[28px] font-serif tracking-wide">
                PAYMENT RECEIPT
              </h2>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-b border-gray-400 p-6">
          <div className="grid grid-cols-[1fr_170px] gap-6">
            <div>
              <div className="grid grid-cols-[160px_1fr] gap-y-3">
                <p className="text-gray-600">
                  Payment Date
                </p>
                <p className="font-semibold">
                  {formatDate(data?.payment_date)}
                </p>

                <p className="text-gray-600">
                  Reference Number
                </p>
                <p className="font-semibold">
                  {data?.reference_number || "-"}
                </p>

                <p className="text-gray-600">
                  Payment Mode
                </p>
                <p className="font-semibold">
                  {data?.payment_mode || "-"}
                </p>

                <p className="text-gray-600">
                  Amount Received In Words
                </p>
                <p className="font-semibold italic">
                  {amountInWords}
                </p>
              </div>
            </div>

            <div className="border border-green-300 bg-green-50 flex flex-col justify-center items-center p-4 h-fit">
              <p className="text-[11px] text-gray-600 mb-2">
                Amount Received
              </p>

              <p className="text-[24px] font-bold text-green-700">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Received From */}
        <div className="border-b border-gray-400 p-6">
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="font-bold mb-3">
                Received From
              </p>

              <p className="font-bold text-blue-700 mb-2">
                {customer}
              </p>

              {formatAddressBlock(billingAddress).map(
                (line, index) => (
                  <p key={index}>{line}</p>
                )
              )}
            </div>

            <div className="flex items-end justify-end">
              <div className="text-right">
                <p className="font-bold mb-14">
                  For {companyName}
                </p>

                <div className="border-t border-gray-500 w-[170px] pt-2 text-center font-bold">
                  Authorized Signature
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="p-6">
          <p className="font-bold mb-4 text-[13px]">
            Payment For
          </p>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-2 text-left">
                  Invoice Number
                </th>

                <th className="border border-gray-400 p-2 text-left">
                  Invoice Date
                </th>

                <th className="border border-gray-400 p-2 text-right">
                  Invoice Amount
                </th>

                <th className="border border-gray-400 p-2 text-right">
                  Payment Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {invoices.length > 0 ? (
                invoices.map((invoice, index) => (
                  <tr key={invoice.id || index}>
                    <td className="border border-gray-300 p-2 text-blue-700">
                      {invoice.invoice_number ||
                        invoice.number ||
                        "-"}
                    </td>

                    <td className="border border-gray-300 p-2">
                      {formatDate(
                        invoice.invoice_date
                      )}
                    </td>

                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(
                        invoice.invoice_amount || 0
                      )}
                    </td>

                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(
                        invoice.payment_amount || 0
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-gray-300 p-6 text-center text-gray-500"
                  >
                    No invoices linked
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceivedPdf;