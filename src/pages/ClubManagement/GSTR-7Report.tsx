// import React, { useMemo, useState } from "react";
// import TextField from "@mui/material/TextField";
// import { Button } from "@/components/ui/button";
// import { NotepadText } from "lucide-react";
// import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
// import { ColumnConfig } from "@/hooks/useEnhancedTable";

// interface GSTR7Row {
//   id: string;
//   gstin: string;
//   vendor: string;
//   amountPaid: number;
//   integratedTax: number;
//   centralTax: number;
//   stateTax: number;
//   totalTax: number;
// }

// const columns: ColumnConfig[] = [
//   { key: "gstin", label: "GSTIN OF DEDUCTEE", sortable: true },
//   { key: "vendor", label: "VENDOR NAME", sortable: true },
//   {
//     key: "amountPaid",
//     label: "AMOUNT PAID TO DEDUCTEE ON WHICH TAX IS DEDUCTED",
//     sortable: true,
//   },
//   { key: "integratedTax", label: "INTEGRATED TAX", sortable: true },
//   { key: "centralTax", label: "CENTRAL TAX", sortable: true },
//   { key: "stateTax", label: "STATE/UT TAX", sortable: true },
//   {
//     key: "totalTax",
//     label: "TOTAL TAX DEDUCTED AT SOURCE",
//     sortable: true,
//   },
// ];

// const toInputDate = (ddmmyyyy: string) => {
//   const [day, month, year] = ddmmyyyy.split("/");
//   return `${year}-${month}-${day}`;
// };

// const formatCurrency = (value: number) =>
//   `₹${Number(value || 0).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// const GSTR7Report: React.FC = () => {

//   const defaultDateRange = useMemo(() => {
//     const today = new Date();
//     const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
//     const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

//     return {
//       fromDate: firstDay.toLocaleDateString("en-GB"),
//       toDate: lastDay.toLocaleDateString("en-GB"),
//     };
//   }, []);

//   const [filters, setFilters] = useState(defaultDateRange);

//   // Dummy data for UI preview
//   const [data] = useState<GSTR7Row[]>([
//     {
//       id: "1",
//       gstin: "27ABCDE1234F1Z5",
//       vendor: "ABC Vendor Pvt Ltd",
//       amountPaid: 25000,
//       integratedTax: 0,
//       centralTax: 225,
//       stateTax: 225,
//       totalTax: 450,
//     },
//   ]);

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const formatted = value ? value.split("-").reverse().join("/") : "";

//     setFilters((prev) => ({
//       ...prev,
//       [name]: formatted,
//     }));
//   };

//   const handleView = () => {
//     // API call will be wired here.
//   };

//   const totals = useMemo(
//     () =>
//       data.reduce(
//         (acc, row) => ({
//           amountPaid: acc.amountPaid + row.amountPaid,
//           integratedTax: acc.integratedTax + row.integratedTax,
//           centralTax: acc.centralTax + row.centralTax,
//           stateTax: acc.stateTax + row.stateTax,
//           totalTax: acc.totalTax + row.totalTax,
//         }),
//         {
//           amountPaid: 0,
//           integratedTax: 0,
//           centralTax: 0,
//           stateTax: 0,
//           totalTax: 0,
//         }
//       ),
//     [data]
//   );

//   const totalRow: GSTR7Row = {
//     id: "total-row",
//     gstin: "",
//     vendor: "",
//     amountPaid: totals.amountPaid,
//     integratedTax: totals.integratedTax,
//     centralTax: totals.centralTax,
//     stateTax: totals.stateTax,
//     totalTax: totals.totalTax,
//   };

//   const renderRow = (row: GSTR7Row) => {
//     const isTotalRow = row.id === "total-row";

//     return {
//       gstin: (
//         <span className="text-[13px] font-semibold text-[#111827]">
//           {isTotalRow ? "" : row.gstin}
//         </span>
//       ),
//       vendor: (
//         <span className="text-[13px] font-semibold text-[#2563eb]">
//           {isTotalRow ? "Total" : row.vendor}
//         </span>
//       ),
//       amountPaid: (
//         <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#111827]">
//           {formatCurrency(row.amountPaid)}
//         </span>
//       ),
//       integratedTax: (
//         <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#111827]">
//           {formatCurrency(row.integratedTax)}
//         </span>
//       ),
//       centralTax: (
//         <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#111827]">
//           {formatCurrency(row.centralTax)}
//         </span>
//       ),
//       stateTax: (
//         <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#111827]">
//           {formatCurrency(row.stateTax)}
//         </span>
//       ),
//       totalTax: (
//         <span className="inline-flex w-full justify-end text-[13px] font-bold text-[#2563eb]">
//           {formatCurrency(row.totalTax)}
//         </span>
//       ),
//     };
//   };

//   return (
//     <div className="w-full min-h-screen bg-white">

//       {/* FILTER SECTION */}
//       <div className="mb-6 rounded-lg border border-[#EAECF0] bg-white p-6">

//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
//             <NotepadText className="w-6 h-6" />
//           </div>
//           <h3 className="text-lg font-semibold text-[#111827]">
//             GSTR-7 Report
//           </h3>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

//           <TextField
//             label="From Date"
//             type="date"
//             name="fromDate"
//             value={toInputDate(filters.fromDate)}
//             onChange={handleDateChange}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//             size="small"
//           />

//           <TextField
//             label="To Date"
//             type="date"
//             name="toDate"
//             value={toInputDate(filters.toDate)}
//             onChange={handleDateChange}
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//             size="small"
//           />

//           <Button
//             onClick={handleView}
//             className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
//           >
//             View
//           </Button>

//         </div>

//       </div>

//       {/* TABLE */}

//       <div className="overflow-hidden rounded-lg border border-[#EAECF0] bg-white">
//         <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-5 text-center">
//           <h1 className="text-2xl font-semibold text-[#111827]">GSTR-7 Report</h1>
//           <p className="text-sm text-[#667085]">
//             From {filters.fromDate} To {filters.toDate}
//           </p>
//         </div>

//         <div className="p-4">
//           <EnhancedTaskTable
//             data={[...data, totalRow]}
//             columns={columns}
//             renderRow={renderRow}
//             storageKey="gstr-7-report"
//             hideTableExport
//             hideColumnsButton={true}
//           />
//         </div>
//       </div>

//     </div>
//   );
// };

// export default GSTR7Report;

import React, { useMemo, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface GSTR7Row {
  id: string;
  gstin: string;
  vendor: string;
  amountPaid: number;
  integratedTax: number;
  centralTax: number;
  stateTax: number;
  totalTax: number;
}

const columns: ColumnConfig[] = [
  { key: "gstin", label: "GSTIN OF DEDUCTEE", sortable: true },
  { key: "vendor", label: "VENDOR NAME", sortable: true },
  {
    key: "amountPaid",
    label: "AMOUNT PAID TO DEDUCTEE ON WHICH TAX IS DEDUCTED",
    sortable: true,
  },
  { key: "integratedTax", label: "INTEGRATED TAX", sortable: true },
  { key: "centralTax", label: "CENTRAL TAX", sortable: true },
  { key: "stateTax", label: "STATE/UT TAX", sortable: true },
  {
    key: "totalTax",
    label: "TOTAL TAX DEDUCTED AT SOURCE",
    sortable: true,
  },
];

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const GSTR7Report: React.FC = () => {
  const defaultDateRange = useMemo(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      fromDate: firstDay.toLocaleDateString("en-GB"),
      toDate: lastDay.toLocaleDateString("en-GB"),
    };
  }, []);

  const [filters, setFilters] = useState(defaultDateRange);
  const [data, setData] = useState<GSTR7Row[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = value ? value.split("-").reverse().join("/") : "";

    setFilters((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  const handleView = async () => {
    try {
      setLoading(true);

      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      if (!baseUrl || !token || !lockAccountId) {
        console.error("Missing required localStorage values");
        return;
      }

      const formatToApiDate = (date: string) => {
        const [day, month, year] = date.split("/");
        return `${year}-${month}-${day}`;
      };

      const from_date = formatToApiDate(filters.fromDate);
      const to_date = formatToApiDate(filters.toDate);

      const response = await axios.get(
        `https://${baseUrl}/lock_accounts/${lockAccountId}/lock_account_transactions/gstr7.json`,
        {
          params: { from_date, to_date },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.code === 0) {
        const apiData = response.data.gstr7 || [];

        const mappedData: GSTR7Row[] = apiData.map(
          (item: any, index: number) => ({
            id: String(index + 1),
            gstin: item.gstin_of_deductee || "-",
            vendor: item.vendor_name || "-",
            amountPaid:
              item.amount_paid_to_deductee_on_which_tax_is_deducted || 0,
            integratedTax: item.integrated_tax || 0,
            centralTax: item.central_tax || 0,
            stateTax: item.state_ut_tax || 0,
            totalTax: item.total_tax_deducted_at_source || 0,
          })
        );

        setData(mappedData);
      }
    } catch (error) {
      console.error("GSTR-7 API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleView();
  }, []);

  const totals = useMemo(
    () =>
      data.reduce(
        (acc, row) => ({
          amountPaid: acc.amountPaid + row.amountPaid,
          integratedTax: acc.integratedTax + row.integratedTax,
          centralTax: acc.centralTax + row.centralTax,
          stateTax: acc.stateTax + row.stateTax,
          totalTax: acc.totalTax + row.totalTax,
        }),
        {
          amountPaid: 0,
          integratedTax: 0,
          centralTax: 0,
          stateTax: 0,
          totalTax: 0,
        }
      ),
    [data]
  );

  const totalRow: GSTR7Row = {
    id: "total-row",
    gstin: "",
    vendor: "",
    amountPaid: totals.amountPaid,
    integratedTax: totals.integratedTax,
    centralTax: totals.centralTax,
    stateTax: totals.stateTax,
    totalTax: totals.totalTax,
  };

  const renderRow = (row: GSTR7Row) => {
    const isTotalRow = row.id === "total-row";

    return {
      gstin: (
        <span className="text-[13px] font-semibold text-[#111827]">
          {isTotalRow ? "" : row.gstin}
        </span>
      ),
      vendor: (
        <span className="text-[13px] font-semibold text-[#2563eb]">
          {isTotalRow ? "Total" : row.vendor}
        </span>
      ),
      amountPaid: (
        <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#111827]">
          {formatCurrency(row.amountPaid)}
        </span>
      ),
      integratedTax: (
        <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#111827]">
          {formatCurrency(row.integratedTax)}
        </span>
      ),
      centralTax: (
        <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#111827]">
          {formatCurrency(row.centralTax)}
        </span>
      ),
      stateTax: (
        <span className="inline-flex w-full justify-end text-[13px] font-semibold text-[#111827]">
          {formatCurrency(row.stateTax)}
        </span>
      ),
      totalTax: (
        <span className="inline-flex w-full justify-end text-[13px] font-bold text-[#2563eb]">
          {formatCurrency(row.totalTax)}
        </span>
      ),
    };
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* FILTER SECTION */}
      <div className="mb-6 rounded-lg border border-[#EAECF0] bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#111827]">
            GSTR-7 Report
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={toInputDate(filters.fromDate)}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />

          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={toInputDate(filters.toDate)}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />

          <Button
            onClick={handleView}
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
          >
            View
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-5 text-center">
          <h1 className="text-2xl font-semibold text-[#111827]">
            GSTR-7 Report
          </h1>
          <p className="text-sm text-[#667085]">
            From {filters.fromDate} To {filters.toDate}
          </p>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : (
            <EnhancedTaskTable
              data={[...data, totalRow]}
              columns={columns}
              renderRow={renderRow}
              storageKey="gstr-7-report"
              hideTableExport
              hideColumnsButton={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GSTR7Report;