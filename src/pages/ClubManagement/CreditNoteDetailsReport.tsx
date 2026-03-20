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
  { key: "credit_reference_number", label: "CREDIT NOTE#", sortable: true, hideable: false, draggable: true },
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

  const renderRow = (row: CreditNoteRow) => ({
    status: <span className="text-[13px] text-[#2563eb]">{row.status}</span>,
    credit_date: <span className="text-[13px] text-[#111827]">{formatDate(row.credit_date)}</span>,
    credit_note_number: (
      <button
        onClick={() => navigate(`/accounting/credit-note/${row.id}`)}
        className="text-[13px] font-semibold text-[#2563eb]"
      >
        {row.credit_note_number}
      </button>
    ),
    credit_reference_number: <span className="text-[13px] text-[#111827]">{row.credit_reference_number}</span>,
    customer_name: (
      <button
        onClick={() => navigate(`/accounting/credit-note/${row.id}`)}
        className="text-[13px] font-semibold text-[#2563eb]"
      >
        {row.customer_name}
      </button>
    ),
    credit_note_amount: (
      <span className="text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.credit_note_amount)}</span>
    ),
    balance_amount: (
      <span className="text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.balance_amount)}</span>
    ),
  });

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="overflow-hidden border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-white px-6 py-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E5E0D3]">
              <NotepadText color="#d32f2f" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Credit Note Details</h3>
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
              onClick={() => fetchCreditNotes(filters.fromDate, filters.toDate)}
              className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
            >
              View
            </Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Credit Note Details</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="credit-note-details-report-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="No credit note details found"
            toolbarClassName="hidden"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F7F7FB] text-[#5F6293] text-[12px] font-semibold uppercase tracking-[0.02em] hover:bg-[#F7F7FB]"
            rowClassName="hover:bg-transparent shadow-none"
            cellClassName="px-8 py-3 border-b border-[#EAECF0] hover:bg-transparent align-top"
          />

          <div className="grid grid-cols-[1fr_1.1fr_1.1fr_1.1fr_1.5fr_1.1fr_1.1fr] border-b border-[#EAECF0] bg-white px-8 py-3 text-[14px] text-[#111827]">
            <div>Total</div>
            <div />
            <div />
            <div />
            <div />
            <div className="text-right font-medium">{formatCurrency(totals.credit_note_amount)}</div>
            <div className="text-right font-medium">{formatCurrency(totals.balance_amount)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditNoteDetailsReport;