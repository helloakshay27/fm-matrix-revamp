import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";

interface CreditNoteApi {
  id: number;
  credit_note_number?: string;
  reference_number?: string;
  customer_name?: string;
  customer?: {
    name?: string;
    company_name?: string;
    first_name?: string;
    last_name?: string;
  };
  date?: string;
  bill_date?: string;
  status?: string;
  total_amount?: number | string;
  amount?: number | string;
  balance_due?: number | string;
  balance_amount?: number | string;
}

interface CreditNoteRow {
  id: number;
  status: string;
  credit_date: string;
  credit_note_number: string;
  credit_reference_number: string;
  customer_name: string;
  credit_note_amount: number;
  balance_amount: number;
}

const columns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "credit_date", label: "CREDIT DATE", sortable: true, hideable: false, draggable: true },
  { key: "credit_note_number", label: "CREDIT NOTE#", sortable: true, hideable: false, draggable: true },
  { key: "credit_reference_number", label: "REFERENCE#", sortable: true, hideable: false, draggable: true },
  { key: "customer_name", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
  { key: "credit_note_amount", label: "CREDIT NOTE AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "balance_amount", label: "BALANCE AMOUNT", sortable: true, hideable: false, draggable: true },
];

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatCurrency = (value: number) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const toNumber = (value?: string | number) => {
  return parseFloat(String(value ?? 0)) || 0;
};

const getCustomerName = (note: CreditNoteApi) => {
  if (note.customer_name) {
    return note.customer_name;
  }

  if (note.customer?.company_name) {
    return note.customer.company_name;
  }

  const fullName = [note.customer?.first_name, note.customer?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || note.customer?.name || "-";
};

const CreditNoteDetailsReport: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<CreditNoteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "01/03/2026",
    toDate: "31/03/2026",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const formatted = value ? value.split("-").reverse().join("/") : "";

    setFilters((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  const fetchCreditNotes = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);

    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(
        `https://${baseUrl}/lock_account_credit_notes.json`,
        {
          params: {
            lock_account_id: lockAccountId,
            "q[date_gteq]": fromDate,
            "q[date_lteq]": toDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apiData = response.data;
      const creditNotes: CreditNoteApi[] = apiData?.data || apiData || [];

      const mappedRows = creditNotes.map((note) => ({
        id: note.id,
        status: note.status ? note.status.charAt(0).toUpperCase() + note.status.slice(1) : "-",
        credit_date: note.date || note.bill_date || "",
        credit_note_number: note.credit_note_number || `CN-${note.id}`,
        credit_reference_number: note.reference_number || String(note.id),
        customer_name: getCustomerName(note),
        credit_note_amount: toNumber(note.total_amount ?? note.amount),
        balance_amount: toNumber(note.balance_due ?? note.balance_amount ?? note.total_amount ?? note.amount),
      }));

      setRows(mappedRows);
    } catch (error) {
      console.error("Failed to load credit note details report", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreditNotes("01/03/2026", "31/03/2026");
  }, [fetchCreditNotes]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (accumulator, row) => ({
          credit_note_amount: accumulator.credit_note_amount + row.credit_note_amount,
          balance_amount: accumulator.balance_amount + row.balance_amount,
        }),
        { credit_note_amount: 0, balance_amount: 0 }
      ),
    [rows]
  );

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: -1,
        status: "__total__",
        credit_date: "",
        credit_note_number: "Total",
        credit_reference_number: "",
        customer_name: "",
        credit_note_amount: totals.credit_note_amount,
        balance_amount: totals.balance_amount,
      },
    ];
  }, [rows, totals]);

  const statusColorMap: Record<string, string> = {
    Draft: "bg-gray-100 text-gray-700",
    Open: "bg-blue-100 text-blue-700",
    Sent: "bg-blue-100 text-blue-700",
    Paid: "bg-green-100 text-green-700",
    Void: "bg-red-100 text-red-700",
    Closed: "bg-green-100 text-green-700",
  };

  const renderRow = (row: CreditNoteRow) => {
    const isTotal = row.status === "__total__";
    return {
      status: isTotal ? <span /> : (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorMap[row.status] || "bg-gray-100 text-gray-700"}`}>
          {row.status}
        </span>
      ),
      credit_date: <span className="text-sm text-gray-600">{isTotal ? "" : formatDate(row.credit_date)}</span>,
      credit_note_number: (
        <span
          onClick={() => !isTotal && navigate(`/accounting/credit-note/${row.id}`)}
          className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600 cursor-pointer hover:underline"}`}
        >
          {row.credit_note_number}
        </span>
      ),
      credit_reference_number: <span className="text-sm text-gray-600">{isTotal ? "" : row.credit_reference_number}</span>,
      customer_name: (
        <span
          onClick={() => !isTotal && navigate(`/accounting/credit-note/${row.id}`)}
          className={`text-sm font-medium ${isTotal ? "" : "text-blue-600 cursor-pointer hover:underline"}`}
        >
          {isTotal ? "" : row.customer_name}
        </span>
      ),
      credit_note_amount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {formatCurrency(row.credit_note_amount)}
        </span>
      ),
      balance_amount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {formatCurrency(row.balance_amount)}
        </span>
      ),
    };
  };

  return (
    <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>

      {/* Filter */}
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Credit Note Details</h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <Button
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() => fetchCreditNotes(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Credit Note Details</h1>
          <p className="mt-1 text-sm text-[#475467]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="credit-note-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="No credit note details found"
          />
        </div>
      </div>
    </div>
  );
};

export default CreditNoteDetailsReport;