import React, { useMemo, useState } from "react";
import { Webhook } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

const USED_COLOR = "#1e3a8a";
const REMAINING_COLOR = "#7dd3fc";

interface ApiUsageRow {
  id: string;
  users: string;
  ipAddresses: string;
  totalCount: number;
}

const columns: ColumnConfig[] = [
  {
    key: "users",
    label: "USERS",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "ipAddresses",
    label: "IP ADDRESSES",
    sortable: true,
    hideable: false,
    draggable: true,
  },
  {
    key: "totalCount",
    label: "TOTAL COUNT",
    sortable: true,
    hideable: false,
    draggable: true,
  },
];

/** Replace with API; empty shows "No Records Found". */
const MOCK_ROWS: ApiUsageRow[] = [];

const APIUsage: React.FC = () => {
  const [totalApiCalls] = useState(2000);
  const [usedCalls] = useState(0);

  const remainingCalls = useMemo(
    () => Math.max(0, totalApiCalls - usedCalls),
    [totalApiCalls, usedCalls]
  );

  const pieData = useMemo(
    () => [
      { name: "Used API Calls", value: usedCalls, fill: USED_COLOR },
      {
        name: "Remaining API Calls",
        value: remainingCalls,
        fill: REMAINING_COLOR,
      },
    ],
    [usedCalls, remainingCalls]
  );

  const renderRow = (row: ApiUsageRow) => ({
    users: (
      <span className="text-[13px] text-[#111827]">{row.users}</span>
    ),
    ipAddresses: (
      <span className="text-[13px] text-[#111827]">{row.ipAddresses}</span>
    ),
    totalCount: (
      <span className="text-[13px] tabular-nums text-[#111827]">
        {row.totalCount}
      </span>
    ),
  });

  return (
    <div className="min-h-screen w-full bg-[#f9f7f2] p-6">
      <div className="mb-6 rounded-lg border-2 border-[#EAECF0] bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <Webhook className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase tracking-wide text-[#1A1A1A]">
            API Usage
          </h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-white px-6 py-8 text-center">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            API Usage
          </h1>
        </div>

        <div className="flex flex-col items-center border-b border-[#EAECF0] px-6 py-10">
          <div className="h-[280px] w-full max-w-md">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={120}
                  paddingAngle={usedCalls > 0 && remainingCalls > 0 ? 2 : 0}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => value}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #EAECF0",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-4 text-base font-semibold text-[#101828]">
            Total API Calls: {totalApiCalls}
          </p>

          <div className="mt-6 flex flex-col gap-3 text-left sm:flex-row sm:gap-10">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: USED_COLOR }}
              />
              <span className="text-sm text-[#475467]">
                Used API Calls:{" "}
                <span className="font-semibold text-[#101828]">
                  {usedCalls}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: REMAINING_COLOR }}
              />
              <span className="text-sm text-[#475467]">
                Remaining API Calls:{" "}
                <span className="font-semibold text-[#101828]">
                  {remainingCalls}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={MOCK_ROWS}
            columns={columns}
            renderRow={renderRow}
            storageKey="api-usage-v1"
            hideTableExport
            hideColumnsButton
            emptyMessage="No Records Found"
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

export default APIUsage;
