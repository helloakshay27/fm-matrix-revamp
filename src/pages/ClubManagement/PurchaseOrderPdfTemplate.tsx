import React from "react";
import { numberToIndianCurrencyWords } from "@/utils/amountToText";

export const getAccountingPdfStatusStyle = (status) => {
  const styles = {
    draft: {
      backgroundColor: "#f3f4f6",
      color: "#1f2937",
      borderColor: "#e5e7eb",
    },
    sent: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      borderColor: "#bfdbfe",
    },
    open: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      borderColor: "#bfdbfe",
    },
    accepted: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      borderColor: "#bbf7d0",
    },
    approved: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      borderColor: "#bbf7d0",
    },
    paid: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      borderColor: "#bbf7d0",
    },
    delivered: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      borderColor: "#bbf7d0",
    },
    confirmed: {
      backgroundColor: "#dbeafe",
      color: "#1d4ed8",
      borderColor: "#bfdbfe",
    },
    processing: {
      backgroundColor: "#fef9c3",
      color: "#854d0e",
      borderColor: "#fde68a",
    },
    pending_approval: {
      backgroundColor: "#ffedd5",
      color: "#9a3412",
      borderColor: "#fed7aa",
    },
    overdue: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      borderColor: "#fecaca",
    },
    declined: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      borderColor: "#fecaca",
    },
    rejected: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      borderColor: "#fecaca",
    },
    cancelled: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      borderColor: "#fecaca",
    },
    expired: {
      backgroundColor: "#ffedd5",
      color: "#9a3412",
      borderColor: "#fed7aa",
    },
    shipped: {
      backgroundColor: "#f3e8ff",
      color: "#6b21a8",
      borderColor: "#e9d5ff",
    },
    converted: {
      backgroundColor: "#f3e8ff",
      color: "#6b21a8",
      borderColor: "#e9d5ff",
    },
    closed: {
      backgroundColor: "#16a34a",
      color: "#ffffff",
      borderColor: "#16a34a",
    },
  };

  return (
    styles[String(status || "").toLowerCase()] || styles.draft
  );
};

const formatStatus = (status) => {
  const label = String(status || "draft").replace(/_/g, " ");

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
          address.pin_code ? `, ${address.pin_code}` : ""
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

// Helper: aggregate tax rows by rate
const aggregateTax = (items, type) => {
  const map = {};
  items.forEach((item) => {
    const rate =
      type === "cgst"
        ? item.cgst_rate
        : type === "sgst"
          ? item.sgst_rate
          : item.igst_rate;
    const amt =
      type === "cgst"
        ? item.cgst_amount
        : type === "sgst"
          ? item.sgst_amount
          : item.igst_amount;
    if (rate != null && amt != null && amt !== 0) {
      map[rate] = (map[rate] ?? 0) + amt;
    }
  });
  return Object.entries(map).map(([r, a]) => ({
    rate: Number(r),
    amount: a,
  }));
};

export const PurchaseDocumentPdf = ({
  documentTitle = "PURCHASE ORDER",
  documentNumber,
  documentDate,
  status,
  customerName,
  vendorName,
  partyLabel = "Vendor Address",
  items = [],
  data = {},
  taxRows = [],
  formatDate,
  formatCurrency,
  secondaryDateLabel,
  secondaryDate,
  referenceNumber,
  bankDetail,
}) => {
  const statusDisplay = formatStatus(data?.status || status);

  const partyName = vendorName || data?.supplier_name || customerName;

  const billingAddress =
    data?.address_detail?.billing_address ||
    data?.billing_address;

  const shippingAddress =
    data?.address_detail?.shipping_address ||
    data?.shipping_address;

  const totalInWords =
    data?.amount_in_words ||
    data?.total_in_words ||
    numberToIndianCurrencyWords(
      Number(data?.total_amount || data?.amount || 0)
    );

  // Aggregate taxes from items
  const cgstRows = aggregateTax(items, "cgst");
  const sgstRows = aggregateTax(items, "sgst");
  const igstRows = aggregateTax(items, "igst");

  // Calculate subtotal from items
  const calculatedSubTotal = items.reduce(
    (s, i) => s + (i.total_value || 0),
    0
  );
  const subTotal =
    data?.sub_total_amount ||
    data?.sub_total ||
    calculatedSubTotal;

  const totalAmount =
    data?.total_amount || data?.amount || 0;

  return (
    <div
      className="bg-white p-8 flex justify-center"
      style={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <div
        className="bg-white shadow border relative"
        style={{
          width: "794px",
          minHeight: "1123px",
        }}
      >
        {/* STATUS RIBBON */}
        {/* {status || data?.status ? (
          <div
            className="absolute top-[35px] left-[-34px] rotate-[-45deg] text-white text-[10px] font-bold px-10 py-1 uppercase z-20"
            style={{
              backgroundColor:
                getAccountingPdfStatusStyle(
                  data?.status || status
                ).backgroundColor,
              color: getAccountingPdfStatusStyle(
                data?.status || status
              ).color,
            }}
          >
            {statusDisplay}
          </div>
        ) : null} */}

        {/* MAIN CONTENT */}
        <div className="px-10 py-8">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-300">
            {/* COMPANY INFO */}
            <div className="text-[11px] leading-[16px]">
              <h2 className="text-[18px] font-bold mb-3">
                {localStorage.getItem("companyName") ||
                  "Lockated"}
              </h2>

              <p className="mb-1">
                {localStorage.getItem("companyAddress") ||
                  "Pune Maharashtra 411006"}
              </p>

              <p className="mb-1">
                {localStorage.getItem("companyCountry") ||
                  "India"}
              </p>

              <p className="mb-1">
                {localStorage.getItem("companyEmail") ||
                  "info@lockated.com"}
              </p>

              <p>
                GSTIN:{" "}
                {data?.address_detail?.gst_detail
                  ?.gstin ||
                  localStorage.getItem("gstin") ||
                  "27AGOPL6958QABC"}
              </p>
            </div>

            {/* TITLE AND STATUS BADGE */}
            <div className="text-right">
              {/* Status Badge */}
              {status || data?.status ? (
                <div
                  className="inline-flex items-center border px-3 py-1 text-[10px] font-bold mb-3"
                  style={getAccountingPdfStatusStyle(
                    data?.status || status
                  )}
                >
                  {statusDisplay}
                </div>
              ) : null}

              <h1 className="text-[40px] font-serif tracking-wide mb-2">
                {documentTitle}
              </h1>

              <p className="text-[12px] font-semibold">
                {documentNumber ||
                  data?.po_number ||
                  "PO-00001"}
              </p>
            </div>
          </div>

          {/* PO DETAILS AND ADDRESSES */}
          <div className="grid grid-cols-2 gap-16 mb-8 pb-6 border-b border-gray-300 text-[11px]">
            {/* VENDOR INFO */}
            <div>
              <h3 className="font-bold mb-3 text-[12px]">
                {partyLabel}
              </h3>

              <p className="font-bold text-blue-700 mb-2">
                {partyName || "Vendor"}
              </p>

              {data?.supplier_address && (
                <p className="mb-1">
                  {data.supplier_address}
                </p>
              )}

              {data?.supplier_email && (
                <p className="mb-1">
                  Email: {data.supplier_email}
                </p>
              )}

              {data?.supplier_phone && (
                <p className="mb-1">
                  Phone: {data.supplier_phone}
                </p>
              )}
            </div>

            {/* DELIVERY AND PO DETAILS */}
            <div>
              <h3 className="font-bold mb-3 text-[12px]">
                Deliver To
              </h3>

              <p className="font-bold text-blue-700 mb-2">
                {localStorage.getItem("companyName") ||
                  "Lockated"}
              </p>

              {data?.delivery_address && (
                <p className="mb-2">
                  {data.delivery_address}
                </p>
              )}

              <div className="mt-4 space-y-1 text-[10px]">
                <div className="flex">
                  <span className="w-[70px]">
                    PO Date
                  </span>
                  <span>
                    :{" "}
                    {formatDate
                      ? formatDate(
                          documentDate ||
                            data?.po_date
                        )
                      : documentDate ||
                        data?.po_date}
                  </span>
                </div>

                {data?.reference_number && (
                  <div className="flex">
                    <span className="w-[70px]">
                      Reference
                    </span>
                    <span>
                      : {data.reference_number}
                    </span>
                  </div>
                )}

                {data?.payment_terms && (
                  <div className="flex">
                    <span className="w-[70px]">
                      Payment Terms
                    </span>
                    <span>
                      : {data.payment_terms}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="mt-8 mb-6 border border-gray-400">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#3f3f3c] text-white">
                  <th className="border-r border-gray-400 p-2 w-[40px] text-center">
                    #
                  </th>
                  <th className="border-r border-gray-400 p-2 text-left">
                    Item & Description
                  </th>
                  <th className="border-r border-gray-400 p-2 text-right w-[70px]">
                    Qty
                  </th>
                  <th className="border-r border-gray-400 p-2 text-right w-[85px]">
                    Rate
                  </th>
                  <th className="p-2 text-right w-[100px]">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="border-t border-r border-gray-300 p-2 align-top text-center">
                        {index + 1}
                      </td>
                      <td className="border-t border-r border-gray-300 p-2 align-top">
                        <p className="font-semibold">
                          {item.inventory?.name ||
                            item.prod_desc ||
                            "N/A"}
                        </p>
                        {item.inventory?.name &&
                          item.prod_desc && (
                            <p className="text-[10px] text-gray-600 mt-1">
                              {item.prod_desc}
                            </p>
                          )}
                      </td>
                      <td className="border-t border-r border-gray-300 p-2 align-top text-right">
                        <p>
                          {Number(
                            item.quantity || 0
                          ).toFixed(2)}
                        </p>
                        {item.unit && (
                          <p className="text-[10px]">
                            {item.unit}
                          </p>
                        )}
                      </td>
                      <td className="border-t border-r border-gray-300 p-2 align-top text-right">
                        {formatCurrency
                          ? formatCurrency(
                              item.rate || 0
                            )
                          : Number(
                              item.rate || 0
                            ).toFixed(2)}
                      </td>
                      <td className="border-t border-gray-300 p-2 align-top text-right font-semibold">
                        {formatCurrency
                          ? formatCurrency(
                              item.total_value || 0
                            )
                          : Number(
                              item.total_value || 0
                            ).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-gray-500"
                    >
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* CALCULATIONS SUMMARY */}
          <div className="flex justify-end mb-6">
            <div className="w-[360px] text-[11px] border border-gray-400 bg-white">
              {/* Sub Total */}
              <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                <span className="font-medium">
                  Sub Total
                </span>
                <span className="font-semibold">
                  {formatCurrency
                    ? formatCurrency(subTotal)
                    : Number(subTotal).toFixed(2)}
                </span>
              </div>

              {/* Discount */}
              {(data?.discount_amount || 0) > 0 && (
                <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                  <span className="font-medium">
                    Discount
                  </span>
                  <span className="font-semibold text-red-600">
                    (-)
                    {formatCurrency
                      ? formatCurrency(
                          data.discount_amount
                        )
                      : Number(
                          data.discount_amount || 0
                        ).toFixed(2)}
                  </span>
                </div>
              )}

              {/* CGST rows */}
              {cgstRows.map(({ rate, amount }) => (
                <div
                  key={`cgst-${rate}`}
                  className="flex justify-between px-4 py-2 border-b border-gray-300"
                >
                  <span>CGST ({rate}%)</span>
                  <span className="font-semibold">
                    {formatCurrency
                      ? formatCurrency(amount)
                      : Number(amount).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* SGST rows */}
              {sgstRows.map(({ rate, amount }) => (
                <div
                  key={`sgst-${rate}`}
                  className="flex justify-between px-4 py-2 border-b border-gray-300"
                >
                  <span>SGST ({rate}%)</span>
                  <span className="font-semibold">
                    {formatCurrency
                      ? formatCurrency(amount)
                      : Number(amount).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* IGST rows */}
              {igstRows.map(({ rate, amount }) => (
                <div
                  key={`igst-${rate}`}
                  className="flex justify-between px-4 py-2 border-b border-gray-300"
                >
                  <span>IGST ({rate}%)</span>
                  <span className="font-semibold">
                    {formatCurrency
                      ? formatCurrency(amount)
                      : Number(amount).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* Amount Withheld */}
              {(data?.lock_account_tax_amount || 0) >
                0 && (
                <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                  <span className="font-medium">
                    Amount Withheld
                  </span>
                  <span className="font-semibold text-red-600">
                    (-)
                    {formatCurrency
                      ? formatCurrency(
                          data.lock_account_tax_amount
                        )
                      : Number(
                          data.lock_account_tax_amount ||
                            0
                        ).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Adjustment */}
              {(data?.adjustment || 0) !== 0 && (
                <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                  <span className="font-medium">
                    Adjustment
                  </span>
                  <span className="font-semibold">
                    {formatCurrency
                      ? formatCurrency(
                          data.adjustment
                        )
                      : Number(
                          data.adjustment || 0
                        ).toFixed(2)}
                  </span>
                </div>
              )}

              {/* TOTAL */}
              <div className="flex justify-between px-4 py-3 font-bold text-[12px] bg-gray-100 border-t-2 border-gray-400">
                <span>TOTAL</span>
                <span>
                  {formatCurrency
                    ? formatCurrency(totalAmount)
                    : Number(totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* AMOUNT IN WORDS */}
          {totalInWords && (
            <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-300 rounded text-[11px]">
              <p className="font-bold text-blue-900 mb-1">
                Amount in Words
              </p>
              <p className="italic font-semibold text-blue-900">
                {totalInWords}
              </p>
            </div>
          )}

          {/* BANK DETAILS */}
          {/* {bankDetail && (
            <div className="mb-6 text-[11px]">
              <p className="font-bold mb-2">
                Bank Details
              </p>
              <p className="mb-1">
                {bankDetail.bankName} - A/C {bankDetail.accountNo}
              </p>
              <p>
                {bankDetail.beneficiaryName}
                {bankDetail.ifscCode ? `, IFSC: ${bankDetail.ifscCode}` : ""}
                {bankDetail.branch ? `, ${bankDetail.branch}` : ""}
              </p>
            </div>
          )} */}

          {bankDetail && (
  <div className="mb-4">
    <p className="font-bold">Bank Details</p>

    <div className="mt-2 space-y-1 text-[11px]">
      {[
        ["Bank Name", bankDetail.bankName],
        ["A/c No.", bankDetail.accountNo],
        ["Beneficiary / Account Name", bankDetail.beneficiaryName],
        ["A/c Type", bankDetail.accountType],
        ["IFSC Code", bankDetail.ifscCode],
        ["Swift Code", bankDetail.swiftCode],
        ["Branch", bankDetail.branch],
      ]
        .filter(([, value]) => value)
        .map(([label, value]) => (
          <div key={label} className="flex gap-2">
            <span className="font-semibold min-w-[150px]">
              {label}:
            </span>
            <span>{value}</span>
          </div>
        ))}
    </div>
  </div>
)}

          {/* TERMS & CONDITIONS */}
          {data?.terms_conditions && (
            <div className="mb-6 text-[11px]">
              <p className="font-bold mb-2">
                Terms & Conditions
              </p>
              <p className="whitespace-pre-wrap leading-relaxed">
                {data?.terms_conditions}
              </p>
            </div>
          )}

          {/* SIGNATURE */}
          <div className="mt-10 flex justify-between items-end pt-6 border-t border-gray-300">
            <div />

            <div className="text-right text-[11px]">
              <p className="font-bold mb-6">
                For{" "}
                {localStorage.getItem("companyName") ||
                  "Lockated"}
              </p>

              <div className="border-t border-black w-[180px] pt-2 text-center font-semibold">
                Authorized Signature
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDocumentPdf;