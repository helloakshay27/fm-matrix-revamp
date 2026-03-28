import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';

// TypeScript Interfaces for API Response
interface Ledger {
  ledger_id: number;
  ledger_name: string;
  total: number;
  fixed_type: string | null;
}

interface ChildGroup {
  group_id: number;
  group_name: string;
  total: number;
  children: ChildGroup[];
  ledgers: Ledger[];
}

interface GroupData {
  group_id: number;
  group_name: string;
  total: number;
  children: ChildGroup[];
  ledgers: Ledger[];
}

interface BalanceSheetResponse {
  lock_account_id: number;
  lock_account_name: string;
  assets: GroupData;
  liabilities: GroupData;
  totals: {
    total_assets: number;
    total_liabilities: number;
    total_equity: number;
  };
}

const BalanceSheetReport: React.FC = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");
  const navigate = useNavigate();
  const [balanceSheetData, setBalanceSheetData] =
    useState<BalanceSheetResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  // Fetch Balance Sheet Data
  const fetchBalanceSheet = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_transactions/balance_sheet.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setBalanceSheetData(response.data);

    } catch (err: unknown) {
      console.error("Error fetching balance sheet:", err);
      setError("Failed to load balance sheet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceSheet();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = () => {
    if (!filters.fromDate || !filters.toDate) {
      alert("Please select From Date and To Date");
      return;
    }
    fetchBalanceSheet();
  };


  const renderGroupRows = (
    group: ChildGroup,
    level: number = 0,
  ): JSX.Element[] => {

    const rows: JSX.Element[] = [];

    const indent = level * 20;

    // font style based on level
    let fontClass = "font-normal";

    if (level === 0) fontClass = "font-bold";        // main group
    else if (level === 1) fontClass = "font-semibold"; // sub group

    rows.push(
      <tr key={`group-${group.group_id}`}>

        <td className="border border-gray-300 px-4 py-3 text-right">
          {group.total.toFixed(2)}
        </td>

        <td
          className={`border border-gray-300 px-4 py-3 ${fontClass}`}
          style={{ paddingLeft: `${indent}px` }}
        >
          {group.group_name}
        </td>

        <td className="border border-gray-300 px-4 py-3 text-right">
          {group.total.toFixed(2)}
        </td>

        <td className="border border-gray-300 px-4 py-3 text-right">
          {group.total.toFixed(2)}
        </td>

      </tr>
    );

    // render child groups
    group.children?.forEach((child) => {
      rows.push(...renderGroupRows(child, level + 1));
    });

    // render ledgers
    group.ledgers?.forEach((ledger) => {
      rows.push(
        <tr key={`ledger-${ledger.ledger_id}`}>

          <td className="border border-gray-300 px-4 py-3 text-right">
            {ledger.total.toFixed(2)}
          </td>

          <td
            className="border border-gray-300 px-4 py-3 font-normal"
            style={{ paddingLeft: `${(level + 1) * 20}px` }}
          >
            <span
              className="text-blue-700 cursor-pointer hover:underline"
              onClick={() => navigate(`/accounting/reports/balance-sheet/details/${ledger.ledger_id}`)}
            >
              {ledger.ledger_name}
            </span>
          </td>

          <td className="border border-gray-300 px-4 py-3 text-right">
            {ledger.total.toFixed(2)}
          </td>

          <td className="border border-gray-300 px-4 py-3 text-right">
            {ledger.total.toFixed(2)}
          </td>

        </tr>
      );
    });

    return rows;
  };





  const renderAccounts = (nodes: any[], level: number = 0): JSX.Element[] => {
    const rows: JSX.Element[] = [];

    nodes.forEach((node) => {
      const indent = node.depth_indent || level * 20;
      const amount = node.values?.[0]?.total_formatted || "0.00";

      const isLedger = node.ledger_id;

      rows.push(
        <tr
          // key={node.group_id || node.ledger_id}
          key={
            node.ledger_id
              ? `ledger-${node.ledger_id}`
              : `group-${node.group_id}`
          }>
          {/* ACCOUNT */}
          <td
            className={`border px-4 py-2 ${!isLedger ? "font-semibold" : ""}`}
            style={{ paddingLeft: `${indent}px` }}
          >
            {isLedger ? (
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() =>
                  navigate(`/accounting/reports/balance-sheet/details/${node.ledger_id}`)
                }
              >
                {node.name}
              </span>
            ) : (
              node.name
            )}
          </td>

          {/* ACCOUNT CODE */}
          <td className="border px-4 py-2 text-center">
            {node.account_code || "-"}
          </td>

          {/* TOTAL */}
          <td className="border px-4 py-2 text-right">{amount}</td>
        </tr>
      );

      if (node.accounts && node.accounts.length > 0) {
        rows.push(...renderAccounts(node.accounts, level + 1));
      }

      if (node.total_label) {
        rows.push(
          <tr key={`total-${node.group_id || node.name || Math.random()} `} className="font-semibold bg-gray-200">
            <td className="border px-4 py-2">{node.total_label}</td>
            <td className="border px-4 py-2"></td>
            <td className="border px-4 py-2 text-right">{amount}</td>
          </tr>
        );
      }
    });

    return rows;
  };


  const flattenAccounts = (nodes: any[], level: number = 0): any[] => {
    let rows: any[] = [];

    nodes.forEach((node) => {
      const indent = node.depth_indent || level * 20;
      const amount = node.values?.[0]?.total_formatted || "0.00";
      const isLedger = node.ledger_id;

      rows.push({
        name: node.name,
        account_code: node.account_code || "-",
        total: amount,
        indent,
        isLedger,
        ledger_id: node.ledger_id,
        isGroup: !isLedger,
      });

      if (node.accounts?.length > 0) {
        rows = rows.concat(flattenAccounts(node.accounts, level + 1));
      }

      if (node.total_label) {
        rows.push({
          name: node.total_label,
          account_code: "",
          total: amount,
          indent,
          isTotal: true,
        });
      }
    });

    return rows;
  };

  const assets =
    balanceSheetData?.balance_sheet?.accounts?.find(
      (a: any) => a.node_name === "assets"
    );

  const liabilities =
    balanceSheetData?.balance_sheet?.accounts?.find(
      (a: any) => a.node_name === "liability_and_equity"
    );

  const tableData = [
    { name: "Assets", isHeader: true },
    ...(assets ? flattenAccounts(assets.accounts) : []),

    { name: "Liabilities", isHeader: true },
    ...(liabilities ? flattenAccounts(liabilities.accounts) : []),
  ];

  const columns: ColumnConfig[] = [
    {
      key: "name",
      label: "Account",
      draggable: false,
      hideable: false,
    },
    {
      key: "account_code",
      label: "Account Code",
      draggable: false,
      hideable: false,
    },
    {
      key: "total",
      label: "Total",
      draggable: false,
      hideable: false,
    },
  ];

  // const renderRow = (row: any) => ({
  //   name: row.isHeader ? (
  //     <span className="font-bold">{row.name}</span>
  //   ) : (
  //     <span
  //       style={{ paddingLeft: `${row.indent}px` }}
  //       className={row.isGroup ? "font-semibold" : ""}
  //     >
  //       {row.isLedger ? (
  //         <span
  //           className="text-blue-600 cursor-pointer hover:underline"
  //           onClick={() =>
  //             navigate(
  //               `/accounting/reports/balance-sheet/details/${row.ledger_id}`
  //             )
  //           }
  //         >
  //           {row.name}
  //         </span>
  //       ) : (
  //         row.name
  //       )}
  //     </span>
  //   ),

  //   account_code: (
  //     <div className="text-center">{row.account_code}</div>
  //   ),

  //   total: (
  //     <div className="text-right">
  //       {row.total}
  //     </div>
  //   ),
  // });


  // const renderRow = (row: any) => ({
  //   name: row.isHeader ? (
  //     // 🔥 Assets / Liabilities Header
  //     <div className="bg-gray-100 font-bold px-2 py-1 w-full">
  //       {row.name}
  //     </div>
  //   ) : row.isTotal ? (
  //     // 🔥 Total Row
  //     <div
  //       style={{ paddingLeft: `${row.indent}px` }}
  //       className="font-semibold bg-gray-200 px-2 py-1 w-full"
  //     >
  //       {row.name}
  //     </div>
  //   ) : (
  //     // 🔥 Normal + Group + Ledger
  //     <div
  //       style={{ paddingLeft: `${row.indent}px` }}
  //       className={`px-2 py-1 ${
  //         row.isGroup ? "font-semibold" : "font-normal"
  //       }`}
  //     >
  //       {row.isLedger ? (
  //         <span
  //           className="text-blue-600 cursor-pointer hover:underline"
  //           onClick={() =>
  //             navigate(
  //               `/accounting/reports/balance-sheet/details/${row.ledger_id}`
  //             )
  //           }
  //         >
  //           {row.name}
  //         </span>
  //       ) : (
  //         row.name
  //       )}
  //     </div>
  //   ),

  //   account_code: row.isHeader ? (
  //     ""
  //   ) : row.isTotal ? (
  //     <div className="bg-gray-200"></div>
  //   ) : (
  //     <div className="text-center px-2 py-1">{row.account_code}</div>
  //   ),

  //   total: row.isHeader ? (
  //     ""
  //   ) : (
  //     <div
  //       className={`text-right px-2 py-1 ${
  //         row.isTotal ? "font-semibold bg-gray-200" : ""
  //       }`}
  //     >
  //       {row.total}
  //     </div>
  //   ),
  // });



  // const renderRow = (row: any) => ({
  //   name: (
  //     <div
  //       style={{ paddingLeft: `${row.indent || 0}px` }}
  //       className={`w-full py-2 ${
  //         row.isHeader
  //           ? "font-bold"
  //           : row.isTotal
  //           ? "font-semibold"
  //           : row.isGroup
  //           ? "font-semibold"
  //           : "font-normal"
  //       }`}
  //     >
  //       {row.isLedger ? (
  //         <span
  //           className="text-blue-600 cursor-pointer hover:underline"
  //           onClick={() =>
  //             navigate(
  //               `/accounting/reports/balance-sheet/details/${row.ledger_id}`
  //             )
  //           }
  //         >
  //           {row.name}
  //         </span>
  //       ) : (
  //         row.name
  //       )}
  //     </div>
  //   ),

  //   account_code: (
  //     <div className="text-center w-full py-2">
  //       {row.isHeader ? "" : row.account_code}
  //     </div>
  //   ),

  //   total: (
  //     <div className="text-right w-full py-2">
  //       {row.isHeader ? "" : row.total}
  //     </div>
  //   ),
  // });


  const renderRow = (row: any) => ({
    name: (
      <div
        style={{ paddingLeft: `${row.indent || 0}px` }}
        className={`w-full px-4 py-2 ${row.isHeader
            ? "font-bold bg-gray-100"
            : row.isTotal
              ? "font-semibold bg-gray-200"
              : row.isGroup
                ? "font-semibold"
                : ""
          }`}
      >
        {row.isLedger ? (
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() =>
              navigate(
                `/accounting/reports/balance-sheet/details/${row.ledger_id}`
              )
            }
          >
            {row.name}
          </span>
        ) : (
          row.name
        )}
      </div>
    ),

    account_code: (
      <div
        className={`text-center w-full px-4 py-2 ${row.isHeader
            ? "bg-gray-100"
            : row.isTotal
              ? "bg-gray-200"
              : ""
          }`}
      >
        {row.isHeader ? "" : row.account_code}
      </div>
    ),

    total: (
      <div
        className={`text-right w-full px-4 py-2 ${row.isHeader
            ? "bg-gray-100"
            : row.isTotal
              ? "bg-gray-200 font-semibold"
              : ""
          }`}
      >
        {row.isHeader ? "" : row.total}
      </div>
    ),
  });

  const BalanceSheetTable = () => {
    const assets =
      balanceSheetData?.balance_sheet?.accounts?.find(
        (a: any) => a.node_name === "assets"
      );

    const liabilities =
      balanceSheetData?.balance_sheet?.accounts?.find(
        (a: any) => a.node_name === "liability_and_equity"
      );
    console.log("liability:", liabilities, balanceSheetData)

    return (
      <table className="w-full border border-gray-300">

        <thead className="bg-[#E5E0D3]">
          <tr>
            <th className="border px-4 py-2 text-left">Account</th>
            <th className="border px-4 py-2 text-center">Account Code</th>
            <th className="border px-4 py-2 text-right">Total</th>
          </tr>
        </thead>

        <tbody>

          {/* ASSETS HEADER */}
          <tr className="bg-gray-100 font-bold">
            <td colSpan={3} className="border px-4 py-2">
              Assets
            </td>
          </tr>

          {assets && renderAccounts(assets.accounts)}

          {/* LIABILITIES HEADER */}
          <tr className="bg-gray-100 font-bold">
            <td colSpan={3} className="border px-4 py-2">
              Liabilities
            </td>
          </tr>

          {liabilities && renderAccounts(liabilities.accounts)}

        </tbody>
      </table>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }




  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="bg-white rounded-lg border-2 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Balance Sheet
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* FROM DATE */}
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />

          {/* TO DATE */}
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />

          {/* VIEW BUTTON */}
          <Button
            onClick={handleView}
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
          >
            View
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">
            Balance Sheet
          </h1>
        </div>
        <BalanceSheetTable />


        {/* <EnhancedTable
          data={tableData}
          columns={columns}
          renderRow={renderRow}
          storageKey="balance-sheet"

          hideTableExport={true}
          hideTableSearch={true}
          enableSearch={false}

          hideColumnReset={true}   // 👈 your main requirement

          isLoading={loading}

          rowClassName={(row: any) =>
            row.isHeader
              ? "bg-gray-100 font-bold"
              : row.isTotal
                ? "bg-gray-200 font-semibold"
                : ""
          }
        /> */}
      </div>
    </div>
  );
};

export default BalanceSheetReport;
