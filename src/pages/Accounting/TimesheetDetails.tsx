import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useAppSelector } from "@/store/hooks";

interface TimesheetRow {
  id: string;
  loggedAt?: string;
  customer: string;
  task: string;
  staff: string;
  notes: string;
  loggedHours: string;
  status: string;
  /** Used when wiring API to split summary hours */
  hourCategory?: "non-billable" | "billed" | "unbilled";
}

const columns: ColumnConfig[] = [
  {
    key: "customer",
    label: "CUSTOMER",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "task",
    label: "TASK",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "staff",
    label: "STAFF",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "notes",
    label: "NOTES",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "loggedHours",
    label: "LOGGED HOURS",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "status",
    label: "STATUS",
    sortable: true,
    hideable: false,
    draggable: true,
  },
];

const parseHmToMinutes = (s: string): number => {
  const parts = s.split(":");
  const h = Number(parts[0]) || 0;
  const m = Number(parts[1]) || 0;
  return h * 60 + m;
};

const formatMinutesAsHm = (totalMinutes: number): string => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/** Replace with API response; empty matches the reference empty state. */
const MOCK_ROWS: TimesheetRow[] = [];

const TimesheetDetails: React.FC = () => {
  const selectedCompany = useAppSelector((s) => s.project.selectedCompany);
  const companyLabel = selectedCompany?.name ?? "Company";

  const defaultFrom = "2026-03-01";
  const defaultTo = "2026-03-31";

  const [filters, setFilters] = useState({
    fromDate: defaultFrom,
    toDate: defaultTo,
    projectId: "all",
  });
  const [applied, setApplied] = useState({
    fromDate: defaultFrom,
    toDate: defaultTo,
    projectId: "all",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData = useMemo(() => {
    const start = new Date(`${applied.fromDate}T00:00:00`);
    const end = new Date(`${applied.toDate}T23:59:59.999`);
    return MOCK_ROWS.filter((row) => {
      if (!row.loggedAt) return true;
      const t = new Date(row.loggedAt).getTime();
      return t >= start.getTime() && t <= end.getTime();
    });
  }, [applied.fromDate, applied.toDate]);

  const hourSummary = useMemo(() => {
    let logged = 0;
    let nonBillable = 0;
    let billed = 0;
    let unbilled = 0;

    for (const row of filteredData) {
      const mins = parseHmToMinutes(row.loggedHours);
      logged += mins;
      switch (row.hourCategory) {
        case "non-billable":
          nonBillable += mins;
          break;
        case "billed":
          billed += mins;
          break;
        case "unbilled":
          unbilled += mins;
          break;
        default:
          break;
      }
    }

    return {
      logged: formatMinutesAsHm(logged),
      nonBillable: formatMinutesAsHm(nonBillable),
      billed: formatMinutesAsHm(billed),
      unbilled: formatMinutesAsHm(unbilled),
    };
  }, [filteredData]);

  const projectFilterLabel =
    applied.projectId === "all" ? "All Projects" : applied.projectId;

  const renderRow = (row: TimesheetRow) => ({
    customer: (
      <span className="text-[13px] font-medium text-[#111827]">
        {row.customer}
      </span>
    ),
    task: <span className="text-[13px] text-[#111827]">{row.task}</span>,
    staff: <span className="text-[13px] text-[#111827]">{row.staff}</span>,
    notes: <span className="text-[13px] text-[#111827]">{row.notes}</span>,
    loggedHours: (
      <span className="text-[13px] tabular-nums text-[#111827]">
        {row.loggedHours}
      </span>
    ),
    status: <span className="text-[13px] text-[#111827]">{row.status}</span>,
  });

  return (
    <div className="min-h-screen w-full bg-[#f9f7f2] p-6">
      <div className="mb-6 rounded-lg border-2 border-[#EAECF0] bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase tracking-wide text-[#1A1A1A]">
            Timesheet Details
          </h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-4">
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
          <FormControl fullWidth size="small">
            <InputLabel id="timesheet-project-label">Project</InputLabel>
            <Select
              labelId="timesheet-project-label"
              label="Project"
              value={filters.projectId}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  projectId: e.target.value,
                }))
              }
            >
              <MenuItem value="all">All Projects</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() =>
              setApplied({
                fromDate: filters.fromDate,
                toDate: filters.toDate,
                projectId: filters.projectId,
              })
            }
          >
            View
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-white px-6 py-8 text-center">
          <p className="text-sm font-medium text-[#667085]">{companyLabel}</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            Timesheet Details
          </h1>
          <p className="mt-3 text-sm text-[#475467]">
            From{" "}
            {new Date(`${applied.fromDate}T00:00:00`).toLocaleDateString(
              "en-GB"
            )}{" "}
            To{" "}
            {new Date(`${applied.toDate}T00:00:00`).toLocaleDateString("en-GB")}
          </p>
          <p className="mt-2 text-sm font-medium text-[#475467]">
            {projectFilterLabel}
          </p>
        </div>

        <div className="border-b border-[#EAECF0] px-6 py-6">
          <div className="rounded-lg border border-[#EAECF0] bg-white">
            <div className="border-b border-[#EAECF0] px-6 py-6">
              <p className="text-sm font-bold uppercase tracking-wide text-[#101828]">
                LOGGED HOURS:{" "}
                <span className="tabular-nums">{hourSummary.logged}</span>
              </p>
              <p className="mt-2 text-xs text-[#667085]">
                (This includes the time spent on Fixed Rate and Daily Rate
                projects)
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#5F6293]">
                  Non-billable hours
                </p>
                <p className="mt-2 text-lg font-semibold tabular-nums text-[#101828]">
                  {hourSummary.nonBillable}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#5F6293]">
                  Billed hours
                </p>
                <p className="mt-2 text-lg font-semibold tabular-nums text-[#101828]">
                  {hourSummary.billed}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#5F6293]">
                  Unbilled hours
                </p>
                <p className="mt-2 text-lg font-semibold tabular-nums text-[#101828]">
                  {hourSummary.unbilled}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={filteredData}
            columns={columns}
            renderRow={renderRow}
            storageKey="timesheet-details-v1"
            hideTableExport
            hideTableSearch
            hideColumnsButton
            emptyMessage="No data to display"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F7F7FB] text-[#5F6293] text-[12px] font-semibold uppercase tracking-[0.02em] hover:bg-[#F7F7FB]"
            rowClassName="hover:bg-transparent shadow-none"
            cellClassName="px-6 py-4 border-b border-[#EAECF0] hover:bg-transparent align-top"
          />
        </div>
      </div>
    </div>
  );
};

export default TimesheetDetails;
