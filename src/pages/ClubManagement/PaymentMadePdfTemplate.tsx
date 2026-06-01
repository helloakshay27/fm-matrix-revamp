import React from "react";
import { numberToIndianCurrencyWords } from "@/utils/amountToText";

export const getAccountingPdfStatusStyle = (status) => {
  const styles = {
    draft: {
      backgroundColor: "#f3f4f6",
      color: "#1f2937",
      borderColor: "#e5e7eb",
    },
    paid: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      borderColor: "#bbf7d0",
    },
    partial: {
      backgroundColor: "#fef9c3",
      color: "#854d0e",
      borderColor: "#fde68a",
    },
    cancelled: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      borderColor: "#fecaca",
    },
  };

  return (
    styles[String(status || "").toLowerCase()] ||
    styles.draft
  );
};

const formatStatus = (status) => {
  const label = String(status || "draft").replace(
    /_/g,
    " "
  );

  return label.replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );
};

const formatAddressBlock = (address) => {
  if (!address) return ["N/A"];

  const cityLine = [
    address.city,
    address.state,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    address.address,
    address.address_line_two,
    cityLine
      ? `${cityLine}${
          address.pin_code
            ? `, ${address.pin_code}`
            : ""
        }`
      : "",
    address.contact_person
      ? `Contact: ${address.contact_person}`
      : "",
    address.telephone_number
      ? `Phone: ${address.telephone_number}`
      : "",
  ].filter(Boolean);
};

const PaymentMadePdf = ({
  data = {},
  bills = [],
  formatDate,
  formatCurrency,
}) => {
  const companyName =
    localStorage.getItem("companyName") ||
    "Lockated";

  const companyAddress =
    localStorage.getItem("companyAddress") ||
    "Pune Maharashtra 411006";

  const companyCountry =
    localStorage.getItem("companyCountry") ||
    "India";

  const companyEmail =
    localStorage.getItem("companyEmail") ||
    "ajay.pihulkar@lockated.com";

  const gstin =
    data?.address_detail?.gst_detail?.gstin ||
    localStorage.getItem("gstin") ||
    "27AGOPL6958QABC";

  const vendor =
    data?.vendor_name ||
    data?.vendor?.display_name ||
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
      className="bg-[#f5f5f5] p-8"
      style={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <div
        className="mx-auto bg-white border border-gray-300 shadow-sm"
        style={{
          width: "720px",
          minHeight: "1020px",
        }}
      >
        {/* HEADER */}
        <div className="relative p-8 border-b border-gray-300">
          {/* Ribbon */}
          <div className="absolute top-0 left-0">
            <div
              className="bg-green-500 text-white text-[10px] px-8 py-1 rotate-[-45deg] translate-x-[-28px] translate-y-[18px] uppercase tracking-wide"
            >
              Paid
            </div>
          </div>

          <div className="flex justify-between items-start">
            {/* Company */}
            <div>
              <h1 className="text-[22px] font-bold mb-2">
                {companyName}
              </h1>

              <div className="space-y-1 text-[11px] text-gray-700">
                <p>{companyAddress}</p>
                <p>{companyCountry}</p>
                <p>{companyEmail}</p>
                <p>GSTIN: {gstin}</p>
              </div>
            </div>

            {/* Right */}
            <div className="text-right">
              <span
                className="inline-flex items-center border px-3 py-1 text-[11px] font-bold mb-4"
                style={getAccountingPdfStatusStyle(
                  data?.status
                )}
              >
                {statusDisplay}
              </span>

              <h2 className="text-[34px] font-serif leading-none tracking-wide">
                PAYMENTS
                <br />
                MADE
              </h2>
            </div>
          </div>
        </div>

        {/* PAYMENT DETAILS */}
        <div className="border-b border-gray-300 p-8">
          <div className="grid grid-cols-[1fr_180px] gap-8">
            {/* Left */}
            <div>
              <div className="grid grid-cols-[180px_1fr] gap-y-4 text-[12px]">
                <p className="text-gray-600">
                  Payment #
                </p>

                <p className="font-semibold">
                  {data?.payment_number || "-"}
                </p>

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
                  Paid To
                </p>

                <p className="font-semibold text-blue-700">
                  {vendor}
                </p>

                <p className="text-gray-600">
                  Place Of Supply
                </p>

                <p className="font-semibold">
                  {billingAddress?.state || "-"}
                </p>

                <p className="text-gray-600">
                  Payment Mode
                </p>

                <p className="font-semibold">
                  {data?.payment_mode || "-"}
                </p>

                <p className="text-gray-600">
                  Paid Through
                </p>

                <p className="font-semibold">
                  {data?.paid_through || "-"}
                </p>

                <p className="text-gray-600">
                  Amount Paid In Words
                </p>

                <p className="font-semibold italic">
                  {amountInWords}
                </p>
              </div>
            </div>

            {/* Amount Box */}
            <div className="bg-green-50 border border-green-300 flex flex-col justify-center items-center h-fit p-5">
              <p className="text-[11px] text-gray-600 mb-2">
                Amount Paid
              </p>

              <p className="text-[24px] font-bold text-green-700">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* PAID TO */}
        <div className="border-b border-gray-300 p-8">
          <div className="grid grid-cols-2 gap-10">
            {/* Left */}
            <div>
              <p className="font-bold mb-3">
                Paid To
              </p>

              <p className="font-bold text-blue-700 mb-2">
                {vendor}
              </p>

              {formatAddressBlock(
                billingAddress
              ).map((line, index) => (
                <p
                  key={index}
                  className="text-[11px] mb-1"
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-end justify-end">
              <div className="text-right">
                <p className="font-bold mb-16">
                  For {companyName}
                </p>

                <div className="border-t border-gray-500 w-[180px] pt-2 text-center font-bold text-[11px]">
                  Authorized Signature
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BILLS TABLE */}
        <div className="p-8">
          <p className="font-bold mb-4 text-[13px]">
            Payment For
          </p>

          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">
                  Bill Number
                </th>

                <th className="border border-gray-300 p-2 text-left">
                  Bill Date
                </th>

                <th className="border border-gray-300 p-2 text-right">
                  Bill Amount
                </th>

                <th className="border border-gray-300 p-2 text-right">
                  Payment Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {bills.length > 0 ? (
                bills.map((bill, index) => (
                  <tr key={bill.id || index}>
                    <td className="border border-gray-300 p-2 text-blue-700">
                      {bill.bill_number ||
                        bill.number ||
                        "-"}
                    </td>

                    <td className="border border-gray-300 p-2">
                      {formatDate(
                        bill.bill_date
                      )}
                    </td>

                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(
                        bill.bill_amount || 0
                      )}
                    </td>

                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(
                        bill.payment_amount || 0
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
                    No bills linked
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

export default PaymentMadePdf;