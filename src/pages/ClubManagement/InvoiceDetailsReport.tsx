import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceDetailRow {
  id: string;
  invoiceId?: string | number;
  status: "Overdue" | "Sent" | "";
  invoiceDate: string;
  dueDate: string;
  invoiceNo: string;
  orderNumber: string;
  customerName: string;
  total: number;
  balance: number;
}

const statusColorMap: Record<string, string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Sent: "bg-blue-100 text-blue-700",
};

const columns: ColumnConfig[] = [
  { key: "status", label: "Status", sortable: true },
  { key: "invoiceDate", label: "Invoice Date", sortable: true },
  { key: "dueDate", label: "Due Date", sortable: true },
  { key: "invoiceNo", label: "Invoice#", sortable: true },
  { key: "orderNumber", label: "Order Number", sortable: true },
  { key: "customerName", label: "Customer Name", sortable: true },
  { key: "total", label: "Total", sortable: true },
  { key: "balance", label: "Balance", sortable: true },
];

const formatCurrency = (value: number): string => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const InvoiceDetailsReport: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<InvoiceDetailRow[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Date filters
  const [filters, setFilters] = useState({
    fromDate: "01/03/2026",
    toDate: "12/03/2026",
  });

   const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  // ✅ Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const formatted = value
      ? value.split("-").reverse().join("/") // YYYY-MM-DD → DD/MM/YYYY
      : "";

    setFilters((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  const formatDate = (dateStr: string) => {
  if (!dateStr) return "--";

  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};
  // ✅ API call
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://${baseUrl}/lock_account_invoices.json`,
        {
          params: {
            lock_account_id: lock_account_id,
            "q[date_gteq]": filters.fromDate,
            "q[date_lteq]": filters.toDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const apiData = res?.data || [];

      const mapped: InvoiceDetailRow[] = apiData.map(
        (item: any, index: number) => ({
          id: item.id ? String(item.id) : `row-${index}`,
          invoiceId: item.id || "",
          status: item.status === "overdue" ? "Overdue" : "Sent",
          invoiceDate: formatDate(item.date) || "--",
          dueDate: formatDate(item.due_date) || "--",
          invoiceNo: item.invoice_number || "--",
          orderNumber: item.order_number || "--",
          customerName: item.customer_name || "Lockated",
          total: Number(item.total_amount || 0),
          balance: Number(item.balance_due || 0),
        })
      );

      setRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  // ✅ Initial load
  useEffect(() => {
    fetchInvoices();
  }, []);

  

  // ✅ Totals
  const totals = rows.reduce(
    (acc, item) => ({
      total: acc.total + item.total,
      balance: acc.balance + item.balance,
    }),
    { total: 0, balance: 0 }
  );

  // ✅ Render row
  // const renderRow = (row: InvoiceDetailRow) => ({
  //   status: (
  //     <span
  //       className={`px-2 py-1 rounded-full text-xs font-medium ${
  //         statusColorMap[row.status] || "bg-gray-100"
  //       }`}
  //     >
  //       {row.status}
  //     </span>
  //   ),
  //   invoiceDate: <span className="text-sm">{row.invoiceDate}</span>,
  //   dueDate: <span className="text-sm">{row.dueDate}</span>,
  //   invoiceNo: (
  //     <span className="text-blue-600 font-medium">{row.invoiceNo}</span>
  //   ),
  //   orderNumber: <span>{row.orderNumber || "--"}</span>,
  //   customerName: (
  //     <span className="text-blue-600 font-medium">
  //       {row.customerName}
  //     </span>
  //   ),
  //   total: <span>{formatCurrency(row.total)}</span>,
  //   balance: <span>{formatCurrency(row.balance)}</span>,
  // });


//   const renderRow = (row: InvoiceDetailRow) => {
//   const isTotalRow = row.id === "total-row";

//   return {
//     status: <span>{isTotalRow ? "" : row.status}</span>,

//     invoiceDate: <span>{isTotalRow ? "" : row.invoiceDate}</span>,

//     dueDate: <span>{isTotalRow ? "" : row.dueDate}</span>,

//     invoiceNo: <span>{isTotalRow ? "" : row.invoiceNo}</span>,

//     orderNumber: <span>{isTotalRow ? "" : row.orderNumber}</span>,

//     customerName: (
//       <span className={`font-semibold ${isTotalRow ? "text-black" : "text-blue-600"}`}>
//         {row.customerName}
//       </span>
//     ),

//     total: (
//       <span className={`font-semibold ${isTotalRow ? "text-blue-700" : ""}`}>
//         {formatCurrency(row.total)}
//       </span>
//     ),

//     balance: (
//       <span className={`font-semibold ${isTotalRow ? "text-black" : ""}`}>
//         {formatCurrency(row.balance)}
//       </span>
//     ),
//   };
// };


const renderRow = (row: InvoiceDetailRow) => {
  const isTotalRow = row.id === "total-row";

  return {
    status: isTotalRow ? (
      <span className="font-semibold text-black">Total</span>
    ) : (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColorMap[row.status] || "bg-gray-100"
        }`}
      >
        {row.status}
      </span>
    ),

    invoiceDate: <span className="text-sm text-gray-600">{isTotalRow ? "" : row.invoiceDate}</span>,
    dueDate: <span className="text-sm text-gray-600">{isTotalRow ? "" : row.dueDate}</span>,
    invoiceNo: isTotalRow ? <span /> : (
      <button
        onClick={() => navigate(`/accounting/dashboard/invoices/${row.invoiceId || ""}`)}
        className="text-sm font-medium !text-blue-600 hover:underline text-left"
      >
        {row.invoiceNo}
      </button>
    ),
    orderNumber: <span className="text-sm text-gray-600">{isTotalRow ? "" : row.orderNumber}</span>,

    customerName: (
      <span className={isTotalRow ? "font-semibold text-black" : "text-blue-600"}>
        {isTotalRow ? "" : row.customerName}
      </span>
    ),

    total: (
      <span className="font-semibold text-blue-700">
        {formatCurrency(row.total)}
      </span>
    ),

    balance: (
      <span className="font-semibold text-black">
        {formatCurrency(row.balance)}
      </span>
    ),
  };
};

const totalsRow: InvoiceDetailRow = {
  id: "total-row", // ✅ unique id
  status: "",
  invoiceDate: "",
  dueDate: "",
  invoiceNo: "",
  orderNumber: "",
  customerName: "Total",
  total: totals.total,
  balance: totals.balance,
};

  return (
    <div className="w-full bg-[#f9f7f2] p-6 min-h-screen">

      {/* FILTER SECTION */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-[#E5E0D3] rounded-full">
            <NotepadText color="#d32f2f" />
          </div>
          <h3 className="text-lg font-semibold">Invoice Details</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* FROM DATE */}
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />

          {/* TO DATE */}
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />

          {/* BUTTON */}
          <Button
            onClick={fetchInvoices}
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
          >
            View
          </Button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-lg border overflow-hidden">
       

        <div className="p-4">
           <div className="px-6 py-5 text-center border-b bg-[#F8F9FC]">
          {/* <p className="text-sm text-gray-500">Lockated</p> */}
          <h1 className="text-2xl font-semibold">Invoice Details</h1>
          <p className="text-sm text-gray-500">
            From {filters.fromDate} To {filters.toDate}
          </p>
        </div>
          <EnhancedTaskTable
            // data={rows}
            data={[...rows, totalsRow]}
            columns={columns}
            renderRow={renderRow}
            storageKey="invoice-details-report"
            loading={loading}
            // enableSearch
            hideTableExport
            hideColumnsButton={true}
          />

          {/* TOTAL ROW */}
          {/* <div className="mt-3 text-right font-semibold border-t pt-3">
            Total:{" "}
            <span className="text-blue-600">
              {formatCurrency(totals.total)}
            </span>
            {" | "}
            Balance:{" "}
            <span className="text-gray-900">
              {formatCurrency(totals.balance)}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsReport;