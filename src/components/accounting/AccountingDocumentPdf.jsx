import React from "react";
import { numberToIndianCurrencyWords } from "@/utils/amountToText";

export const getAccountingPdfStatusStyle = (status) => {
  const styles = {
    draft: { backgroundColor: "#f3f4f6", color: "#1f2937", borderColor: "#e5e7eb" },
    sent: { backgroundColor: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe" },
    open: { backgroundColor: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe" },
    accepted: { backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" },
    approved: { backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" },
    paid: { backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" },
    delivered: { backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" },
    confirmed: { backgroundColor: "#dbeafe", color: "#1d4ed8", borderColor: "#bfdbfe" },
    processing: { backgroundColor: "#fef9c3", color: "#854d0e", borderColor: "#fde68a" },
    pending_approval: { backgroundColor: "#ffedd5", color: "#9a3412", borderColor: "#fed7aa" },
    overdue: { backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" },
    declined: { backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" },
    rejected: { backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" },
    cancelled: { backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" },
    expired: { backgroundColor: "#ffedd5", color: "#9a3412", borderColor: "#fed7aa" },
    shipped: { backgroundColor: "#f3e8ff", color: "#6b21a8", borderColor: "#e9d5ff" },
    converted: { backgroundColor: "#f3e8ff", color: "#6b21a8", borderColor: "#e9d5ff" },
  };
  return styles[String(status || "").toLowerCase()] || styles.draft;
};

const formatStatus = (status) => {
  const label = String(status || "draft").replace(/_/g, " ");
  return label.replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatAddressBlock = (address) => {
  if (!address) return ["N/A"];
  const cityLine = [address.city, address.state, address.country].filter(Boolean).join(", ");

  return [
    address.address,
    address.address_line_two,
    cityLine ? `${cityLine}${address.pin_code ? `, ${address.pin_code}` : ""}` : "",
    address.contact_person ? `Contact: ${address.contact_person}` : "",
    address.telephone_number ? `Phone: ${address.telephone_number}` : "",
  ].filter(Boolean);
};

export const AccountingDocumentPdf = ({
  documentTitle,
  documentNumber,
  documentDate,
  status,
  customerName,
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
  const statusDisplay = formatStatus(status);
  const billingAddress = data?.address_detail?.billing_address || data?.billing_address;
  const shippingAddress = data?.address_detail?.shipping_address || data?.shipping_address;
  const notes = data?.customer_notes ?? data?.notes ?? data?.note ?? "";
  const terms = data?.terms_and_conditions ?? data?.terms ?? data?.terms_condition ?? "";
  const totalInWords =
    data?.amount_in_words ||
    data?.total_in_words ||
    numberToIndianCurrencyWords(Number(data?.total_amount || 0));

  return (
    <div className="bg-white text-black p-8 text-[11px] leading-tight" style={{ width: "794px", minHeight: "1123px", overflow: "visible" }}>
      <div className="relative mx-auto mt-6" style={{ width: "700px", overflow: "visible" }}>
        <div className="border border-gray-500 bg-white">
          <div className="grid grid-cols-[1fr_230px] border-b border-gray-500">
            <div className="p-3 min-h-[96px]">
              <h2 className="text-[17px] font-bold mb-2">{localStorage.getItem("companyName") || "Lockated"}</h2>
              <div className="space-y-1">
                <p>{localStorage.getItem("companyAddress") || "pune Maharashtra 411006"}</p>
                <p>{localStorage.getItem("companyCountry") || "India"}</p>
                <p>{localStorage.getItem("companyEmail") || "ajay.pihulkar@lockated.com"}</p>
                <p>GSTIN: {data?.address_detail?.gst_detail?.gstin || localStorage.getItem("gstin") || "27AGOPL6958QABC"}</p>
              </div>
            </div>
            <div className="p-3 flex flex-col items-end justify-end gap-3">
              <span className="inline-flex items-center border px-3 py-1 text-[11px] font-bold" style={getAccountingPdfStatusStyle(status)}>
                {statusDisplay}
              </span>
              <h1 className="text-[30px] font-serif font-normal tracking-wide text-right">{documentTitle}</h1>
            </div>
          </div>

          <div className="grid grid-cols-[160px_190px_1fr] border-b border-gray-500 min-h-[50px]">
            <div className="p-2 border-r border-gray-500">#</div>
            <div className="p-2 border-r border-gray-500">
              <p className="font-bold">: {documentNumber || "N/A"}</p>
              <p className="font-bold">: {formatDate(documentDate)}</p>
            </div>
            <div className="p-2">
              {data?.place_of_supply && (
                <div className="flex mb-1">
                  <span className="w-24">Place Of Supply</span>
                  <span className="font-bold">: {data.place_of_supply}</span>
                </div>
              )}
              {referenceNumber && (
                <div className="flex mb-1">
                  <span className="w-24">Reference</span>
                  <span>: {referenceNumber}</span>
                </div>
              )}
              {secondaryDate && (
                <div className="flex mb-1">
                  <span className="w-24">{secondaryDateLabel}</span>
                  <span>: {formatDate(secondaryDate)}</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="w-24">Status</span>
                <span>: </span>
                <span className="inline-flex items-center border px-2 py-0.5 text-[10px] font-bold ml-1" style={getAccountingPdfStatusStyle(status)}>
                  {statusDisplay}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 border-b border-gray-500 bg-gray-100 font-bold">
            <div className="px-2 py-1 border-r border-gray-500">Bill To</div>
            <div className="px-2 py-1">Ship To</div>
          </div>
          <div className="grid grid-cols-2 border-b border-gray-500 min-h-[30px]">
            <div className="px-2 py-2 border-r border-gray-500">
              <p className="font-bold text-blue-700">{customerName || "N/A"}</p>
              {formatAddressBlock(billingAddress).map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <div className="px-2 py-2">
              <p className="font-bold text-blue-700">{customerName || "N/A"}</p>
              {formatAddressBlock(shippingAddress || billingAddress).map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-r border-gray-500 p-2 text-center w-[36px]">#</th>
                <th className="border-b border-r border-gray-500 p-2 text-left">Item & Description</th>
                <th className="border-b border-r border-gray-500 p-2 text-right w-[74px]">Qty</th>
                <th className="border-b border-r border-gray-500 p-2 text-right w-[90px]">Rate</th>
                <th className="border-b border-gray-500 p-2 text-right w-[100px]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="border-b border-r border-gray-400 p-2 text-center align-top">{index + 1}</td>
                    <td className="border-b border-r border-gray-400 p-2 align-top">
                      <p className="font-bold">{item.item_name || item.name || "N/A"}</p>
                      {item.description && <p className="text-[10px] text-gray-700 mt-1">{item.description}</p>}
                    </td>
                    <td className="border-b border-r border-gray-400 p-2 text-right align-top">
                      <p>{Number(item.quantity || 0).toFixed(2)}</p>
                      <p className="text-[10px]">{item.item_unit || ""}</p>
                    </td>
                    <td className="border-b border-r border-gray-400 p-2 text-right align-top">{Number(item.rate || 0).toFixed(2)}</td>
                    <td className="border-b border-gray-400 p-2 text-right align-top">{Number(item.total_amount || item.amount || 0).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={5}>No items found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="grid grid-cols-[1fr_305px] border-b border-gray-500">
            <div className="p-3 border-r border-gray-500 min-h-[118px]">
              <p className="font-bold">Total In Words</p>
              <p className="font-bold italic mt-2">{totalInWords}</p>
            </div>
            <div className="p-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span>{Number(data?.sub_total_amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount({data?.discount_per || 0}%)</span>
                  <span>(-) {Number(data?.discount_amount || 0).toFixed(2)}</span>
                </div>
                {data?.lock_account_tax_amount ? (
                  <div className="flex justify-between">
                    <span>Amount Withheld</span>
                    <span className="text-red-600">(-) {Number(data?.lock_account_tax_amount || 0).toFixed(2)}</span>
                  </div>
                ) : null}
                {taxRows.map(([name, tax], index) => (
                  <div key={index} className="flex justify-between">
                    <span>{name} ({tax.rate}%)</span>
                    <span>{Number(tax.amount || 0).toFixed(2)}</span>
                  </div>
                ))}
                {data?.charge_amount ? (
                  <div className="flex justify-between">
                    <span>{data?.charge_name || "Adjustment"}</span>
                    <span>{Number(data?.charge_amount || 0).toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-gray-500 pt-2 font-bold text-[12px]">
                  <span>Total</span>
                  <span>{formatCurrency(data?.total_amount || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_305px]">
            <div className="p-3 border-r border-gray-500 min-h-[190px]">
              {/* {bankDetail && (
                <div className="mb-4">
                  <p className="font-bold">Bank Details</p>
                  <p className="mt-1">{bankDetail.bankName} - A/C {bankDetail.accountNo}</p>
                  <p>{bankDetail.beneficiaryName}{bankDetail.ifscCode ? `, IFSC: ${bankDetail.ifscCode}` : ""}{bankDetail.branch ? `, ${bankDetail.branch}` : ""}</p>
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
              <div className="mb-4">
                <p className="font-bold">Notes</p>
                <p className="whitespace-pre-wrap mt-1">{notes || "-"}</p>
              </div>
              <div>
                <p className="font-bold">Terms & Conditions</p>
                <p className="whitespace-pre-wrap mt-1">{terms || "-"}</p>
              </div>
            </div>
            <div className="p-3 min-h-[190px] flex flex-col justify-end">
              <div className="text-right">
                <p className="font-bold mb-12">For {localStorage.getItem("companyName") || "Lockated"}</p>
                <div className="border-t border-gray-500 ml-auto w-[170px] pt-2 text-center font-bold">
                  Authorized Signature
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingDocumentPdf;
