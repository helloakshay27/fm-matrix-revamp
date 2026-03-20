import React, { useEffect, useState } from "react";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalesOrderRow {
  id: string;
  status: string;
  date: string;
  shipmentDate: string;
  salesOrderNo: string;
  customerName: string;
  amount: number;
}

const statusColorMap: Record<string, string> = {
  Draft: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-green-100 text-green-700",
};

const columns: ColumnConfig[] = [
  { key: "status", label: "Status", sortable: true },
  { key: "date", label: "Date", sortable: true },
  { key: "shipmentDate", label: "Shipment Date", sortable: true },
  { key: "salesOrderNo", label: "Sales Order#", sortable: true },
  { key: "customerName", label: "Customer Name", sortable: true },
  { key: "amount", label: "Amount", sortable: true },
];

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

const SalesOrderDetailsReport: React.FC = () => {
  const [rows, setRows] = useState<SalesOrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: "01/03/2026",
    toDate: "12/03/2026",
  });

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

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

  // ✅ API CALL (UPDATED)
  const fetchSalesOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://${baseUrl}/sale_orders.json`,
        {
          params: {
            lock_account_id: lock_account_id,
            "q[date_gteq]": filters.fromDate,
            "q[date_lteq]": filters.toDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apiData = res?.data || [];

      const mapped: SalesOrderRow[] = apiData.map(
        (item: any, index: number) => ({
          id: item.id ? String(item.id) : `row-${index}`, // ✅ FIX duplicate key
          status: item.status || "--",
          date: formatDate(item.date),
          shipmentDate: formatDate(item.expected_shipment_date),
          salesOrderNo: item.sales_order_number || "--",
          customerName: item.customer_name || "--",
          amount: Number(item.amount || 0),
        })
      );

      setRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  // ✅ TOTAL
  const totals = rows.reduce(
    (acc, row) => ({
      amount: acc.amount + row.amount,
    }),
    { amount: 0 }
  );

  // ✅ RENDER ROW
  const renderRow = (row: SalesOrderRow) => {
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

      date: <span>{isTotalRow ? "" : row.date}</span>,
      shipmentDate: <span>{isTotalRow ? "" : row.shipmentDate}</span>,
      salesOrderNo: <span>{isTotalRow ? "" : row.salesOrderNo}</span>,
      customerName: <span>{isTotalRow ? "" : row.customerName}</span>,

      amount: (
        <span className="font-semibold text-blue-700">
          {formatCurrency(row.amount)}
        </span>
      ),
    };
  };

  const totalsRow: SalesOrderRow = {
    id: "total-row",
    status: "",
    date: "",
    shipmentDate: "",
    salesOrderNo: "",
    customerName: "",
    amount: totals.amount,
  };

  return (
    <div className="w-full bg-[#f9f7f2] p-6 min-h-screen">
      
      {/* FILTER */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E5E0D3]">
            <NotepadText  color="#d32f2f" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Sales Order Details
            </h3>
            {/* <p className="text-sm text-gray-500">
              Track and manage sales orders
            </p> */}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
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

          <Button
            onClick={fetchSalesOrders}
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
          >
            View
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border overflow-hidden">
       

        <div className="p-4">
           <div className="px-6 py-5 text-center border-b bg-[#F8F9FC]">
          <h1 className="text-2xl font-semibold">
            Sales Order Details
          </h1>
          <p className="text-sm text-gray-500">
            From {filters.fromDate} To {filters.toDate}
          </p>
        </div>
          <EnhancedTaskTable
            data={[...rows, totalsRow]} // ✅ total row inside table
            columns={columns}
            renderRow={renderRow}
            storageKey="sales-order-details"
            loading={loading}
            hideTableExport
            hideColumnsButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesOrderDetailsReport;