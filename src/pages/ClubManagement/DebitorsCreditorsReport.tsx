import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DebtorsCreditorsReport() {
    const [debtors, setDebtors] = useState([]);
    const [creditors, setCreditors] = useState([]);
    const [loading, setLoading] = useState(false);
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const lock_account_id = localStorage.getItem("lock_account_id");
    const api = axios.create({
        baseURL: baseUrl,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    });
    const getDebtorsReport = async () => {
        try {
            const res = await api.get(
                `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_transactions/debtors_report.json`
            );

            setDebtors(res.data);
        } catch (error) {
            console.error("Debtors API error", error);
        }
    };

    const getCreditorsReport = async () => {
        try {
            const res = await api.get(
                `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_transactions/creditors_report.json`
            );

            setCreditors(res.data);
        } catch (error) {
            console.error("Creditors API error", error);
        }
    };

    useEffect(() => {
        setLoading(true);

        //   Promise.all([
        getDebtorsReport(),
            getCreditorsReport()
        //   ]).finally(() => {
        //     setLoading(false);
        //   });

    }, []);

    {
        loading && (
            <div className="text-center py-6">
                Loading report...
            </div>
        )
    }

    const receivableTotal = debtors?.totals?.closing_balance || 0;
    const payableTotal = creditors?.totals?.closing_balance || 0;

    const netPosition = receivableTotal - payableTotal;


    const totalReceivable = debtors?.totals?.closing_balance || 0;
    const totalPayable = creditors?.totals?.closing_balance || 0;

    // const netPosition = totalReceivable - totalPayable;
    // ledger counts
    const debtorLedgerCount = debtors?.ledgers?.length || 0;
    const creditorLedgerCount = creditors?.ledgers?.length || 0;

    // transaction counts
    const debtorTransactions =
        debtors?.ledgers?.reduce(
            (sum, ledger) => sum + ledger.transactions.length,
            0
        ) || 0;

    const creditorTransactions =
        creditors?.ledgers?.reduce(
            (sum, ledger) => sum + ledger.transactions.length,
            0
        ) || 0;

    // today's date
    const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };
    return (
        <div className="p-6 bg-white">

            {/* HEADER */}
            <h1 className="text-2xl font-semibold text-gray-900">
                Debtors & Creditors Report
            </h1>

            <p className="text-sm text-gray-500 mb-6">
                Outstanding receivables and payables
            </p>


            {/* FILTER */}
            {/* <div className="flex gap-3 items-center mb-6">

        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />

        <span className="text-gray-500">To</span>

        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
          Apply
        </button>

        <button className="border border-gray-300 px-4 py-2 rounded text-sm">
          Export CSV
        </button>
      </div> */}


            {/* SUMMARY CARDS */}

            {/* <div className="grid grid-cols-4 gap-4 mb-8">

        <div className="border rounded-md p-4">
          <p className="text-xs text-gray-500 uppercase">
            Total Receivable
          </p>

          <p className="text-lg font-semibold text-blue-600">
            ₹575.00
          </p>

          <p className="text-xs text-gray-500">
            1 ledger • 5 transactions
          </p>
        </div>


        <div className="border rounded-md p-4">
          <p className="text-xs text-gray-500 uppercase">
            Total Payable
          </p>

          <p className="text-lg font-semibold text-red-600">
            ₹2,596.00
          </p>

          <p className="text-xs text-gray-500">
            2 ledgers • 7 transactions
          </p>
        </div>


        <div className="border rounded-md p-4">
          <p className="text-xs text-gray-500 uppercase">
            Net Position
          </p>

          <p className="text-lg font-semibold text-green-600">
            -₹2,021.00
          </p>

          <p className="text-xs text-gray-500">
            Payable exceeds receivable
          </p>
        </div>


        <div className="border rounded-md p-4">
          <p className="text-xs text-gray-500 uppercase">
            As Of Date
          </p>

          <p className="text-lg font-semibold">
            17 Mar 2026
          </p>

          <p className="text-xs text-gray-500">
            All figures inclusive
          </p>
        </div>

      </div> */}
            <div className="grid grid-cols-4 gap-4 mb-8">

                {/* TOTAL RECEIVABLE */}

                <div className="border rounded-md p-4">
                    <p className="text-xs text-gray-500 uppercase">
                        Total Receivable
                    </p>

                    <p className="text-lg font-semibold text-blue-600">
                        ₹{totalReceivable.toFixed(2)}
                    </p>

                    <p className="text-xs text-gray-500">
                        {debtorLedgerCount} ledger • {debtorTransactions} transactions
                    </p>
                </div>


                {/* TOTAL PAYABLE */}

                <div className="border rounded-md p-4">
                    <p className="text-xs text-gray-500 uppercase">
                        Total Payable
                    </p>

                    <p className="text-lg font-semibold text-red-600">
                        ₹{totalPayable.toFixed(2)}
                    </p>

                    <p className="text-xs text-gray-500">
                        {creditorLedgerCount} ledger • {creditorTransactions} transactions
                    </p>
                </div>


                {/* NET POSITION */}

                <div className="border rounded-md p-4">
                    <p className="text-xs text-gray-500 uppercase">
                        Net Position
                    </p>

                    <p
                        className={`text-lg font-semibold ${netPosition >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        ₹{netPosition.toFixed(2)}
                    </p>

                    <p className="text-xs text-gray-500">
                        {netPosition < 0
                            ? "Payable exceeds receivable"
                            : "Receivable exceeds payable"}
                    </p>
                </div>


                {/* DATE */}

                <div className="border rounded-md p-4">
                    <p className="text-xs text-gray-500 uppercase">
                        As Of Date
                    </p>

                    <p className="text-lg font-semibold">
                        {today}
                    </p>

                    <p className="text-xs text-gray-500">
                        All figures inclusive
                    </p>
                </div>

            </div>


            {/* DEBTORS */}

            <div className="border rounded-md mb-8">

                <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                    <h2 className="font-medium text-gray-800">
                        Debtors (Receivables)
                    </h2>
                </div>


                <div className="overflow-x-auto">

                    <table className="w-full border-collapse text-sm">

                        <thead>
                            <tr className="bg-[#E5E0D3]">
                                <th className="border border-gray-300 px-4 py-3 text-left">
                                    Date
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-left">
                                    Type
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-left">
                                    Description
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-left">
                                    Voucher #
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-right">
                                    Debit
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-right">
                                    Credit
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-right">
                                    Running Balance
                                </th>
                            </tr>
                        </thead>


                        {/* <tbody>

              <tr className="hover:bg-gray-50">

                <td className="border px-4 py-3">15 Mar 2026</td>

                <td className="border px-4 py-3">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                    Invoice
                  </span>
                </td>

                <td className="border px-4 py-3">
                  Invoice INV-100020
                </td>

                <td className="border px-4 py-3">
                  INV-100020
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹204.00
                </td>

                <td className="border px-4 py-3 text-right">
                  -
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹204.00
                </td>

              </tr>


            </tbody> */}


                        {/* <tbody>
  {debtors?.map((item, index) => (
    <tr key={index} className="hover:bg-gray-50">

      <td className="border px-4 py-3">
        {item.date}
      </td>

      <td className="border px-4 py-3">
        {item.transaction_type}
      </td>

      <td className="border px-4 py-3">
        {item.description}
      </td>

      <td className="border px-4 py-3">
        {item.voucher_number}
      </td>

      <td className="border px-4 py-3 text-right">
        ₹{item.debit}
      </td>

      <td className="border px-4 py-3 text-right">
        ₹{item.credit}
      </td>

      <td className="border px-4 py-3 text-right">
        ₹{item.running_balance}
      </td>

    </tr>
  ))}
</tbody> */}


                        <tbody>
                            {debtors?.ledgers?.map((ledger) => (
                                <>
                                    {/* Ledger Header */}
                                    <tr key={ledger.ledger_id} className="bg-gray-100 font-semibold">
                                        <td colSpan={7} className="px-4 py-2">
                                            {ledger.ledger_name} ({ledger.group_name})
                                        </td>
                                    </tr>

                                    {/* Transactions */}
                                    {ledger.transactions.map((txn) => (
                                        <tr key={txn.transaction_id} className="hover:bg-gray-50">

                                            <td className="border px-4 py-3">
                                                {formatDate(txn.date)}
                                            </td>

                                            <td className="border px-4 py-3">
                                                {txn.transaction_type}
                                            </td>

                                            <td className="border px-4 py-3">
                                                {txn.description}
                                            </td>

                                            <td className="border px-4 py-3">
                                                {txn.voucher_number || "-"}
                                            </td>

                                            <td className="border px-4 py-3 text-right">
                                                ₹{txn.debit}
                                            </td>

                                            <td className="border px-4 py-3 text-right">
                                                ₹{txn.credit}
                                            </td>

                                            <td className="border px-4 py-3 text-right">
                                                ₹{txn.running_balance}
                                            </td>

                                        </tr>
                                    ))}

                                    {/* Ledger Total */}
                                    <tr className="bg-blue-50 font-semibold">
                                        <td colSpan={4} className="border px-4 py-3 text-right">
                                            Ledger Total
                                        </td>

                                        <td className="border px-4 py-3 text-right">
                                            ₹{ledger.total_debits}
                                        </td>

                                        <td className="border px-4 py-3 text-right">
                                            ₹{ledger.total_credits}
                                        </td>

                                        <td className="border px-4 py-3 text-right">
                                            ₹{ledger.closing_balance}
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>

                </div>


                <div className="bg-[#0f1c3f] text-white text-right px-6 py-3 font-medium">
                    {/* TOTAL RECEIVABLE ₹575.00 */}
                    {/* TOTAL RECEIVABLE ₹{debtors?.totals?.closing_balance} */}
                    TOTAL RECEIVABLE ₹{receivableTotal}
                </div>

            </div>




            {/* CREDITORS */}

            <div className="border rounded-md mb-8">

                <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                    <h2 className="font-medium text-gray-800">
                        Creditors (Payables)
                    </h2>
                </div>


                <div className="overflow-x-auto">

                    <table className="w-full border-collapse text-sm">

                        <thead>
                            <tr className="bg-[#E5E0D3]">

                                <th className="border border-gray-300 px-4 py-3 text-left">
                                    Date
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-left">
                                    Type
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-left">
                                    Description
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-left">
                                    Voucher #
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-right">
                                    Debit
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-right">
                                    Credit
                                </th>

                                <th className="border border-gray-300 px-4 py-3 text-right">
                                    Running Balance
                                </th>

                            </tr>
                        </thead>


                        {/* <tbody>

              <tr className="hover:bg-gray-50">

                <td className="border px-4 py-3">
                  17 Mar 2026
                </td>

                <td className="border px-4 py-3">

                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                    Bill
                  </span>

                </td>

                <td className="border px-4 py-3">
                  Bill 3
                </td>

                <td className="border px-4 py-3">
                  BILL-003
                </td>

                <td className="border px-4 py-3 text-right">
                  -
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹116.00
                </td>

                <td className="border px-4 py-3 text-right">
                  ₹116.00
                </td>

              </tr>

            </tbody> */}


                        {/* <tbody>
  {creditors?.map((item, index) => (
    <tr key={index} className="hover:bg-gray-50">

      <td className="border px-4 py-3">
        {item.date}
      </td>

      <td className="border px-4 py-3">
        {item.transaction_type}
      </td>

      <td className="border px-4 py-3">
        {item.description}
      </td>

      <td className="border px-4 py-3">
        {item.voucher_number}
      </td>

      <td className="border px-4 py-3 text-right">
        ₹{item.debit}
      </td>

      <td className="border px-4 py-3 text-right">
        ₹{item.credit}
      </td>

      <td className="border px-4 py-3 text-right">
        ₹{item.running_balance}
      </td>

    </tr>
  ))}
</tbody> */}


                        <tbody>
                            {creditors?.ledgers?.map((ledger) => (
                                <>
                                    {/* Ledger Header */}
                                    <tr key={ledger.ledger_id} className="bg-gray-100 font-semibold">
                                        <td colSpan={7} className="px-4 py-2">
                                            {ledger.ledger_name} ({ledger.group_name})
                                        </td>
                                    </tr>

                                    {/* Transactions */}
                                    {ledger.transactions.map((txn) => (
                                        <tr key={txn.transaction_id} className="hover:bg-gray-50">

                                            <td className="border px-4 py-3">
                                                {formatDate(txn.date)}
                                            </td>

                                            <td className="border px-4 py-3">
                                                {txn.transaction_type}
                                            </td>

                                            <td className="border px-4 py-3">
                                                {txn.description}
                                            </td>

                                            <td className="border px-4 py-3">
                                                {txn.voucher_number || "-"}
                                            </td>

                                            <td className="border px-4 py-3 text-right">
                                                ₹{txn.debit}
                                            </td>

                                            <td className="border px-4 py-3 text-right">
                                                ₹{txn.credit}
                                            </td>

                                            <td className="border px-4 py-3 text-right">
                                                ₹{txn.running_balance}
                                            </td>

                                        </tr>
                                    ))}

                                    {/* Ledger Total */}
                                    <tr className="bg-blue-50 font-semibold">
                                        <td colSpan={4} className="border px-4 py-3 text-right">
                                            Ledger Total
                                        </td>

                                        <td className="border px-4 py-3 text-right">
                                            ₹{ledger.total_debits}
                                        </td>

                                        <td className="border px-4 py-3 text-right">
                                            ₹{ledger.total_credits}
                                        </td>

                                        <td className="border px-4 py-3 text-right">
                                            ₹{ledger.closing_balance}
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>

                    </table>

                </div>


                <div className="bg-[#0f1c3f] text-white text-right px-6 py-3 font-medium">
                    {/* TOTAL PAYABLE ₹2,596.00 */}
                    TOTAL PAYABLE ₹{payableTotal}
                </div>

            </div>



            {/* GRAND SUMMARY */}

            {/* <div className="border rounded-md p-5 flex justify-between">

        <p className="font-semibold">
          Grand Summary
        </p>

        <div className="flex gap-6 text-sm">

          <p className="text-green-600 font-semibold"> */}
            {/* TOTAL RECEIVABLE ₹575.00 */}
            {/* TOTAL RECEIVABLE ₹{debtors?.totals?.closing_balance} */}
            {/* TOTAL RECEIVABLE ₹{receivableTotal}
          </p> */}

            {/* <p className="text-red-600 font-semibold"> */}
            {/* TOTAL PAYABLE ₹2,596.00 */}
            {/* TOTAL PAYABLE ₹{payableTotal}
          </p> */}

            {/* <p className="text-red-600 font-semibold"> */}
            {/* NET POSITION -₹2,021.00 */}
            {/* NET POSITION ₹{netPosition.toFixed(2)}
          </p>

        </div>

      </div> */}


            <div className="border rounded-md p-5">

                <p className="font-semibold mb-4">
                    Grand Summary
                </p>

                <div className="flex justify-end gap-6">

                    {/* Total Receivable */}
                    <div className="text-right bg-green-50 border border-green-200 rounded-md px-6 py-3">
                        <p className="text-xs text-green-700 uppercase">
                            Total Receivable
                        </p>

                        <p className="text-lg font-semibold text-green-600">
                            ₹{receivableTotal.toFixed(2)}
                        </p>
                    </div>

                    {/* Total Payable */}
                    <div className="text-right bg-red-50 border border-red-200 rounded-md px-6 py-3">
                        <p className="text-xs text-red-700 uppercase">
                            Total Payable
                        </p>

                        <p className="text-lg font-semibold text-red-600">
                            ₹{payableTotal.toFixed(2)}
                        </p>
                    </div>

                    {/* Net Position */}
                    <div
                        className={`text-right border rounded-md px-6 py-3 ${netPosition >= 0
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200"
                            }`}
                    >
                        <p
                            className={`text-xs uppercase ${netPosition >= 0 ? "text-green-700" : "text-red-700"
                                }`}
                        >
                            Net Position
                        </p>

                        <p
                            className={`text-lg font-semibold ${netPosition >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            ₹{netPosition.toFixed(2)}
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}