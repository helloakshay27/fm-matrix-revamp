import React, { useCallback, useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { Scale, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import axios from "axios";
import { toast } from "sonner";

export type TrialBalanceRowKind =
  | "section"
  | "subgroup"
  | "account"
  | "subtotal"
  | "grand_total";

export interface TrialBalanceRow {
  id: string;
  kind: TrialBalanceRowKind;
  label: string;
  accountCode?: string;
  netDebit: number;
  netCredit: number;
  indent: number;
  ledgerId?: number | string;
}

const formatCurrency = (value: number) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const columns: ColumnConfig[] = [
  { key: "label", label: "Account", sortable: true, defaultVisible: true },
  { key: "accountCode", label: "Account Code", sortable: true, defaultVisible: true },
  { key: "netDebit", label: "Net Debit", sortable: true, defaultVisible: true },
  { key: "netCredit", label: "Net Credit", sortable: true, defaultVisible: true },
];


interface TrialBalanceLedger {
  ledger_id?: number;
  id?: number;
  lock_account_ledger_id?: number;
  lock_account_ledger?: {
    id?: number;
    ledger_id?: number;
  };
  ledger_name?: string;
  name?: string;
  account_code?: string;
  code?: string;
  total_credits?: number;
  total_debits?: number;
  credit?: number;
  debit?: number;
}

interface TrialBalanceGroup {
  group_id?: number;
  id?: number;
  group_name?: string;
  name?: string;
  total_credits?: number;
  total_debits?: number;
  children?: TrialBalanceGroup[];
  ledgers?: TrialBalanceLedger[];
}

interface TrialBalanceResponse {
  lock_account_name?: string;
  assets?: TrialBalanceGroup;
  liabilities?: TrialBalanceGroup;
  equities?: TrialBalanceGroup;
  equity?: TrialBalanceGroup;
  income?: TrialBalanceGroup;
  expenses?: TrialBalanceGroup;
  expense?: TrialBalanceGroup;
  totals?: Record<string, number | undefined>;
}

const toNumber = (value: unknown) => Number(value || 0);

const getLedgerId = (ledger: TrialBalanceLedger) =>
  ledger.ledger_id ??
  ledger.lock_account_ledger_id ??
  ledger.lock_account_ledger?.id ??
  ledger.lock_account_ledger?.ledger_id ??
  ledger.id;

const mapGroupRows = (
  group: TrialBalanceGroup,
  level: number,
  path: string
): TrialBalanceRow[] => {
  const groupId = group.group_id ?? group.id ?? path;
  const rows: TrialBalanceRow[] = [
    {
      id: `group-${path}-${groupId}`,
      kind: "subgroup",
      label: group.group_name || group.name || "Group",
      netDebit: toNumber(group.total_debits),
      netCredit: toNumber(group.total_credits),
      indent: level,
    },
  ];

  (group.ledgers || []).forEach((ledger, index) => {
    const ledgerId = getLedgerId(ledger);
    rows.push({
      id: `ledger-${path}-${ledgerId ?? index}`,
      kind: "account",
      label: ledger.ledger_name || ledger.name || "Ledger",
      accountCode: ledger.account_code || ledger.code || "",
      netDebit: toNumber(ledger.total_debits ?? ledger.debit),
      netCredit: toNumber(ledger.total_credits ?? ledger.credit),
      indent: level + 1,
      ledgerId,
    });
  });

  (group.children || []).forEach((child, index) => {
    rows.push(...mapGroupRows(child, level + 1, `${path}-${index}`));
  });

  return rows;
};

const mapTrialBalanceRows = (data: TrialBalanceResponse | null): TrialBalanceRow[] => {
  if (!data) return [];

  const sections: Array<[string, TrialBalanceGroup | undefined]> = [
    ["Assets", data.assets],
    ["Liabilities", data.liabilities],
    ["Equities", data.equities || data.equity],
    ["Income", data.income],
    ["Expense", data.expenses || data.expense],
  ];
  const rows: TrialBalanceRow[] = [];

  sections.forEach(([label, group]) => {
    const hasRows = Boolean(
      group &&
        (((group.children || []).length > 0) || ((group.ledgers || []).length > 0))
    );

    if (!hasRows || !group) return;

    rows.push({
      id: `section-${label.toLowerCase()}`,
      kind: "section",
      label,
      netDebit: 0,
      netCredit: 0,
      indent: 0,
    });

    (group.ledgers || []).forEach((ledger, index) => {
      const ledgerId = getLedgerId(ledger);
      rows.push({
        id: `ledger-${label}-${ledgerId ?? index}`,
        kind: "account",
        label: ledger.ledger_name || ledger.name || "Ledger",
        accountCode: ledger.account_code || ledger.code || "",
        netDebit: toNumber(ledger.total_debits ?? ledger.debit),
        netCredit: toNumber(ledger.total_credits ?? ledger.credit),
        indent: 1,
        ledgerId,
      });
    });

    (group.children || []).forEach((child, index) => {
      rows.push(...mapGroupRows(child, 1, `${label.toLowerCase()}-${index}`));
    });
  });

  if (rows.length > 0) {
    const debitFromTotals =
      toNumber(data.totals?.total_assets_debits) +
      toNumber(data.totals?.total_liabilities_debits) +
      toNumber(data.totals?.total_equity_debits) +
      toNumber(data.totals?.total_income_debits) +
      toNumber(data.totals?.total_expense_debits);
    const creditFromTotals =
      toNumber(data.totals?.total_assets_credits) +
      toNumber(data.totals?.total_liabilities_credits) +
      toNumber(data.totals?.total_equity_credits) +
      toNumber(data.totals?.total_income_credits) +
      toNumber(data.totals?.total_expense_credits);

    rows.push({
      id: "grand",
      kind: "grand_total",
      label: "Total for Trial Balance",
      netDebit:
        debitFromTotals ||
        rows.reduce((sum, row) => (row.kind === "account" ? sum + row.netDebit : sum), 0),
      netCredit:
        creditFromTotals ||
        rows.reduce((sum, row) => (row.kind === "account" ? sum + row.netCredit : sum), 0),
      indent: 0,
    });
  }

  return rows;
};

const getDefaultDateRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    fromDate: firstDay.toISOString().split("T")[0],
    toDate: lastDay.toISOString().split("T")[0],
  };
};

function formatDisplayDate(value: string) {
  if (!value) return "";
  const d = new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB").format(d);
}

const TrialBalance: React.FC = () => {
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lockAccountId = localStorage.getItem("lock_account_id");
  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [trialBalanceData, setTrialBalanceData] = useState<TrialBalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const rows = useMemo(() => mapTrialBalanceRows(trialBalanceData), [trialBalanceData]);

  const periodLabel = useMemo(
    () =>
      `From ${formatDisplayDate(filters.fromDate)} To ${formatDisplayDate(filters.toDate)}`,
    [filters.fromDate, filters.toDate]
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const reportDateStr = useMemo(
    () => new Intl.DateTimeFormat("en-GB").format(new Date()),
    []
  );

  const fetchTrialBalance = useCallback(async () => {
    if (!baseUrl || !lockAccountId) {
      setTrialBalanceData(null);
      toast.error("Missing account configuration for trial balance");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<TrialBalanceResponse>(
        `https://${baseUrl}/lock_accounts/${lockAccountId}/lock_account_transactions/trial_balance_sheet.json`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        }
      );

      setTrialBalanceData(response.data);
    } catch (error) {
      console.error("Error fetching trial balance:", error);
      setTrialBalanceData(null);
      toast.error("Failed to load trial balance data");
    } finally {
      setLoading(false);
    }
  }, [baseUrl, lockAccountId, token]);

  useEffect(() => {
    fetchTrialBalance();
  }, [fetchTrialBalance]);

  const handleView = () => {
    fetchTrialBalance();
  };

  const openLedger = (id?: number | string) => {
    if (id != null) {
      navigate(`/accounting/reports/trial-balance/details/${encodeURIComponent(String(id))}`);
    }
  };


  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div className="mb-6 rounded-lg border-2 border-[#D5DbDB] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <Scale className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Trial Balance
          </h3>
        </div>

        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
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
          <Button
            type="button"
            onClick={handleView}
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
          >
            View
          </Button>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg border border-[#D5DbDB] bg-white">
        <div className="border-b border-[#EAECF0] bg-[#F8F9FC] px-6 py-6 text-center">
          <p className="text-sm text-[#667085]">
            {trialBalanceData?.lock_account_name || "Lockated"}
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-[#111827]">Trial Balance</h1>
          <p className="mt-2 text-sm text-[#667085]">
            <span className="font-medium text-[#344054]">Basis</span> : Accrual
          </p>
          <p className="mt-1 text-sm text-[#667085]">{periodLabel}</p>
          <p className="mt-0.5 text-sm text-[#667085]">Report Date: {reportDateStr}</p>
        </div>

        <div className="p-6">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            storageKey="trial-balance"
            enableSearch={true}
            enableExport={true}
            exportFileName="trial-balance"
            searchPlaceholder="Search accounts..."
            emptyMessage="No data available for selected date range."
            loading={loading}
            onRowClick={(item) => {
              if (item.kind === "account" && item.ledgerId != null) {
                openLedger(item.ledgerId);
              }
            }}
            renderCell={(item, columnKey) => {
              const pad = 8 + (item.indent || 0) * 16;
              
              switch (columnKey) {
                case "label":
                  if (item.kind === "section") {
                    return (
                      <div
                        className="text-sm font-bold text-[#111827]"
                        style={{ paddingLeft: pad }}
                      >
                        {item.label}
                      </div>
                    );
                  }
                  if (item.kind === "subgroup") {
                    return (
                      <div
                        className="text-sm font-semibold text-[#111827]"
                        style={{ paddingLeft: pad }}
                      >
                        <span className="inline-flex items-center gap-1 text-[#111827]">
                          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
                          {item.label}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div
                      className="text-sm"
                      style={{ paddingLeft: pad }}
                    >
                      {item.ledgerId != null ? (
                        <a
                          href={`/accounting/reports/trial-balance/details/${encodeURIComponent(String(item.ledgerId))}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            openLedger(item.ledgerId);
                          }}
                          className="text-left text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span className="text-[#111827]">{item.label}</span>
                      )}
                    </div>
                  );
                case "accountCode":
                  if (item.kind === "section" || item.kind === "subgroup") {
                    return <div />;
                  }
                  return (
                    <div className="text-center text-sm text-[#4a4a4a]">
                      {item.accountCode || ""}
                    </div>
                  );
                case "netDebit":
                  return (
                    <div
                      className={`text-right text-sm ${
                        item.kind === "subtotal" || item.kind === "grand_total"
                          ? "font-bold text-[#111827]"
                          : "text-[#111827]"
                      }`}
                    >
                      {formatCurrency(item.netDebit)}
                    </div>
                  );
                case "netCredit":
                  return (
                    <div
                      className={`text-right text-sm ${
                        item.kind === "subtotal" || item.kind === "grand_total"
                          ? "font-bold text-[#111827]"
                          : "text-[#111827]"
                      }`}
                    >
                      {formatCurrency(item.netCredit)}
                    </div>
                  );
                default:
                  return item[columnKey];
              }
            }}
            getRowClassName={(item) => {
              if (item.kind === "section") {
                return "bg-white";
              }
              if (item.kind === "subtotal") {
                return "bg-gray-100";
              }
              if (item.kind === "grand_total") {
                return "bg-[#E5E0D3] font-bold";
              }
              if (item.kind === "account" && item.ledgerId != null) {
                return "cursor-pointer hover:bg-blue-50";
              }
              return "";
            }}
            headerCellClassName="bg-[#E5E0D3] text-xs font-semibold uppercase tracking-wide text-[#1A1A1A]"
            cellClassName="border border-gray-300 px-4 py-2.5"
            tableWrapperClassName="border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;

