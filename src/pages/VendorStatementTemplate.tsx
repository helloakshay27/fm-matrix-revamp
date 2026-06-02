import React from "react";

export const getVendorStatementStatusStyle = (status) => {
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
        unpaid: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderColor: "#fecaca",
        },
        overdue: {
            backgroundColor: "#ffedd5",
            color: "#9a3412",
            borderColor: "#fed7aa",
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

export const VendorStatementPdf = ({
    vendorName = "Vendor",
    vendorGstin = "",
    statementFrom,
    statementTo,
    openingBalance = 0,
    billedAmount = 0,
    amountPaid = 0,
    balanceDue = 0,
    transactions = [],
    status = "draft",
    formatDate,
    formatCurrency,
}) => {
    const statusDisplay = formatStatus(status);

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
                {/* MAIN CONTENT */}
                <div className="px-10 py-8">
                    {/* HEADER */}
                    <div className="flex justify-between items-start mb-8">
                        {/* LEFT */}
                        <div>
                            <h1 className="text-[26px] font-serif tracking-wide">
                                Vendor Statement
                            </h1>

                            {/* <p className="text-[12px] text-gray-600 mt-2">
                From{" "}
                {formatDate
                  ? formatDate(statementFrom)
                  : statementFrom}{" "}
                To{" "}
                {formatDate
                  ? formatDate(statementTo)
                  : statementTo}
              </p> */}
                        </div>

                        {/* RIGHT */}
                        <div className="text-right">
                            <div
                                className="inline-flex items-center border px-3 py-1 text-[10px] font-bold mb-4"
                                style={getVendorStatementStatusStyle(status)}
                            >
                                {statusDisplay}
                            </div>

                            <h2 className="text-[18px] font-bold mb-2">
                                {localStorage.getItem("companyName") ||
                                    "Lockated"}
                            </h2>

                            <p className="text-[11px] leading-[18px]">
                                {localStorage.getItem("companyAddress") ||
                                    "Pune Maharashtra 411006"}
                            </p>

                            <p className="text-[11px] leading-[18px]">
                                {localStorage.getItem("companyCountry") ||
                                    "India"}
                            </p>

                            <p className="text-[11px] leading-[18px]">
                                {localStorage.getItem("companyEmail") ||
                                    "info@lockated.com"}
                            </p>

                            <p className="text-[11px] leading-[18px]">
                                GSTIN:{" "}
                                {localStorage.getItem("gstin") ||
                                    "27AGOPL6958QABC"}
                            </p>
                        </div>
                    </div>

                    {/* VENDOR + SUMMARY */}
                    <div className="flex justify-between items-start mt-10 mb-10">
                        {/* VENDOR DETAILS */}
                        <div className="text-[11px]">
                            <p className="mb-2 font-bold">To</p>

                            <p className="font-bold text-blue-700 mb-1">
                                {vendorName}
                            </p>

                            {vendorGstin && (
                                <p>GSTIN: {vendorGstin}</p>
                            )}
                        </div>

                        {/* SUMMARY */}
                        {/* <div className="w-[260px] border border-gray-400">
              <div className="bg-gray-200 px-4 py-2 border-b border-gray-400">
                <p className="font-bold text-[12px]">
                  Statement of Accounts
                </p>

                <p className="text-[10px] mt-1">
                  {formatDate
                    ? formatDate(statementFrom)
                    : statementFrom}{" "}
                  To{" "}
                  {formatDate
                    ? formatDate(statementTo)
                    : statementTo}
                </p>
              </div>

              <div className="px-4 py-3 text-[11px]">
                <div className="flex justify-between mb-2">
                  <span>Opening Balance</span>

                  <span className="font-semibold">
                    {formatCurrency
                      ? formatCurrency(openingBalance)
                      : openingBalance}
                  </span>
                </div>

                <div className="flex justify-between mb-2">
                  <span>Billed Amount</span>

                  <span className="font-semibold">
                    {formatCurrency
                      ? formatCurrency(billedAmount)
                      : billedAmount}
                  </span>
                </div>

                <div className="flex justify-between mb-2">
                  <span>Amount Paid</span>

                  <span className="font-semibold">
                    {formatCurrency
                      ? formatCurrency(amountPaid)
                      : amountPaid}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-gray-400">
                  <span className="font-bold">
                    Balance Due
                  </span>

                  <span className="font-bold">
                    {formatCurrency
                      ? formatCurrency(balanceDue)
                      : balanceDue}
                  </span>
                </div>
              </div>
            </div> */}

                        <div
                            className="border border-gray-500"
                            style={{
                                width: "240px",
                                fontSize: "10px",
                            }}
                        >
                            {/* TITLE */}
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "10px 8px 6px",
                                    borderBottom: "1px solid #000",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "700",
                                        fontFamily: "serif",
                                        marginBottom: "4px",
                                        lineHeight: "28px",
                                    }}
                                >
                                    Statement of Accounts
                                </p>

                                {/* <p
      style={{
        fontSize: "10px",
      }}
    >
      {formatDate
        ? formatDate(statementFrom)
        : statementFrom}{" "}
      To{" "}
      {formatDate
        ? formatDate(statementTo)
        : statementTo}

    </p> */}
                                <p style={{ fontSize: "10px" }}>
                                    {`01/${String(
                                        new Date().getMonth() + 1
                                    ).padStart(2, "0")}/${new Date().getFullYear()} To ${new Date(
                                        new Date().getFullYear(),
                                        new Date().getMonth() + 1,
                                        0
                                    )
                                        .getDate()
                                        .toString()
                                        .padStart(2, "0")}/${String(
                                            new Date().getMonth() + 1
                                        ).padStart(2, "0")}/${new Date().getFullYear()}`}
                                </p>
                            </div>

                            {/* SUMMARY */}
                            <div>
                                <div
                                    style={{
                                        background: "#d9d9d9",
                                        padding: "4px 8px",
                                        fontWeight: "700",
                                        borderBottom: "1px solid #bdbdbd",
                                    }}
                                >
                                    Account Summary
                                </div>

                                <div
                                    style={{
                                        padding: "6px 8px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        <span>Opening Balance</span>

                                        <span>
                                            {formatCurrency
                                                ? formatCurrency(openingBalance)
                                                : openingBalance}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        <span>Billed Amount</span>

                                        <span>
                                            {formatCurrency
                                                ? formatCurrency(billedAmount)
                                                : billedAmount}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        <span>Amount Paid</span>

                                        <span>
                                            {formatCurrency
                                                ? formatCurrency(amountPaid)
                                                : amountPaid}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            borderTop: "1px solid #000",
                                            paddingTop: "6px",
                                            fontWeight: "700",
                                        }}
                                    >
                                        <span>Balance Due</span>

                                        <span>
                                            {formatCurrency
                                                ? formatCurrency(balanceDue)
                                                : balanceDue}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="border border-gray-400 mt-6">
                        <table className="w-full border-collapse text-[11px]">
                            <thead>
                                <tr className="bg-[#3f3f3c] text-white">
                                    <th className="p-2 text-left border-r border-gray-400">
                                        Date
                                    </th>

                                    <th className="p-2 text-left border-r border-gray-400">
                                        Transactions
                                    </th>

                                    <th className="p-2 text-left border-r border-gray-400">
                                        Details
                                    </th>

                                    <th className="p-2 text-right border-r border-gray-400">
                                        Amount
                                    </th>

                                    <th className="p-2 text-right border-r border-gray-400">
                                        Payments
                                    </th>

                                    <th className="p-2 text-right">
                                        Balance
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border-t border-r border-gray-300 p-2">
                                                {formatDate
                                                    ? formatDate(item.date)
                                                    : item.date}
                                            </td>

                                            <td className="border-t border-r border-gray-300 p-2">
                                                {item.transaction}
                                            </td>

                                            <td className="border-t border-r border-gray-300 p-2">
                                                {item.details || "-"}
                                            </td>

                                            <td className="border-t border-r border-gray-300 p-2 text-right">
                                                {formatCurrency
                                                    ? formatCurrency(
                                                        item.amount || 0
                                                    )
                                                    : item.amount || 0}
                                            </td>

                                            <td className="border-t border-r border-gray-300 p-2 text-right">
                                                {formatCurrency
                                                    ? formatCurrency(
                                                        item.payment || 0
                                                    )
                                                    : item.payment || 0}
                                            </td>

                                            <td className="border-t border-gray-300 p-2 text-right font-semibold">
                                                {formatCurrency
                                                    ? formatCurrency(
                                                        item.balance || 0
                                                    )
                                                    : item.balance || 0}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-6 text-center text-gray-500"
                                        >
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER BALANCE */}
                    <div className="flex justify-end mt-6">
                        <div className="w-[250px] border border-gray-400">
                            <div className="flex justify-between px-4 py-3 bg-gray-100 text-[12px] font-bold">
                                <span>Balance Due</span>

                                <span>
                                    {formatCurrency
                                        ? formatCurrency(balanceDue)
                                        : balanceDue}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SIGNATURE */}
                    <div className="mt-16 flex justify-end">
                        <div className="text-center text-[11px]">
                            <p className="font-bold mb-10">
                                For{" "}
                                {localStorage.getItem("companyName") ||
                                    "Lockated"}
                            </p>

                            <div className="border-t border-black w-[180px] pt-2">
                                Authorized Signature
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorStatementPdf;