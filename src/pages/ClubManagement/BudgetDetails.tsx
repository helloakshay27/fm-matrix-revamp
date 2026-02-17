import React, { useState } from "react";

/* ================= TYPES ================= */

type Row = {
  id: string;
  name: string;
  opening?: number;
  values: number[];
};

type Section = {
  id: string;
  name: string;
  expanded: boolean;
  rows: Row[];
  children?: Section[];
};

/* ================= CONSTANTS ================= */

const MONTHS = [
  "Apr 2025", "May 2025", "Jun 2025", "Jul 2025",
  "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025",
  "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026",
];

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const collectRows = (section: Section): Row[] => {
  let r = [...section.rows];
  section.children?.forEach(c => (r = r.concat(collectRows(c))));
  return r;
};

/* ================= DATA ================= */

const profitLossData: Section[] = [
  {
    id: "income",
    name: "Income",
    expanded: true,
    rows: [
      { id: "sales", name: "Sales", values: [50000, 60000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    id: "expense",
    name: "Expenses",
    expanded: true,
    rows: [
      { id: "rent", name: "Rent Expense", values: [10000, 10000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
];

const balanceSheetData: Section[] = [
  {
    id: "assets",
    name: "Assets",
    expanded: true,
    rows: [
      { id: "cash", name: "Cash", values: [20000, 25000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    id: "liabilities",
    name: "Liabilities",
    expanded: true,
    rows: [
      { id: "loan", name: "Loan Payable", values: [15000, 15000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    id: "equity",
    name: "Equity",
    expanded: true,
    rows: [
      { id: "capital", name: "Owner Capital", values: [5000, 10000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
];

const cashFlowData: Section[] = [
  {
    id: "cash-flow",
    name: "Cash Flow",
    expanded: true,
    rows: [
      {
        id: "opening",
        name: "Beginning Cash Balance",
        opening: 0,
        values: [0, 11000, 21000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    children: [
      {
        id: "operating",
        name: "Cash Flow from Operating Activities",
        expanded: true,
        rows: [
          {
            id: "net-income",
            name: "Net Income",
            opening: 0,
            values: [-17000, 2000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function BudgetDetails() {
  const [activeTab, setActiveTab] = useState<"PL" | "BS" | "CF">("CF");
  const [data, setData] = useState<Record<string, Section[]>>({
    PL: profitLossData,
    BS: balanceSheetData,
    CF: cashFlowData,
  });

  const toggle = (tab: string, id: string) => {
    const walk = (list: Section[]): Section[] =>
      list.map(s => ({
        ...s,
        expanded: s.id === id ? !s.expanded : s.expanded,
        children: s.children ? walk(s.children) : s.children,
      }));

    setData(prev => ({
      ...prev,
      [tab]: walk(prev[tab]),
    }));
  };

  const renderSection = (tab: string, s: Section, level = 0): React.ReactNode => {
    const rows = collectRows(s);
    const indent = { paddingLeft: 16 + level * 18 };

    return (
      <React.Fragment key={s.id}>
        <tr className="section-row">
          <td style={indent} onClick={() => toggle(tab, s.id)}>
            {s.children && (s.expanded ? "▼" : "▶")} {s.name}
          </td>

          {activeTab === "CF" && (
            <td>{sum(rows.map(r => r.opening || 0)).toLocaleString()}</td>
          )}

          {MONTHS.map((_, i) => (
            <td key={i}>
              {rows.reduce((t, r) => t + (r.values[i] || 0), 0).toLocaleString()}
            </td>
          ))}
        </tr>

        {s.expanded &&
          s.rows.map(r => (
            <tr key={r.id} className="data-row">
              <td style={{ paddingLeft: 36 + level * 18 }}>{r.name}</td>
              {activeTab === "CF" && <td>{r.opening?.toLocaleString()}</td>}
              {r.values.map((v, i) => (
                <td key={i}>{v.toLocaleString()}</td>
              ))}
            </tr>
          ))}

        {s.expanded &&
          s.children?.map(c => renderSection(tab, c, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="p-6 bg-white rounded-md border">
      {/* TABS */}
      <div className="tabs">
        <button onClick={() => setActiveTab("PL")} className={activeTab === "PL" ? "active" : ""}>
          Profit and Loss
        </button>
        <button onClick={() => setActiveTab("BS")} className={activeTab === "BS" ? "active" : ""}>
          Balance Sheet
        </button>
        <button onClick={() => setActiveTab("CF")} className={activeTab === "CF" ? "active" : ""}>
          Cash Flow Statement
        </button>
      </div>

      {/* TABLE */}
      <div className="table-scroll">
        <table className="zoho-table">
          <thead>
            <tr>
              <th>ACCOUNT</th>
              {activeTab === "CF" && <th>OPENING BALANCE</th>}
              {MONTHS.map(m => (
                <th key={m}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data[activeTab].map(s => renderSection(activeTab, s))}
          </tbody>
        </table>
      </div>

      {/* CSS (EXACT SAME FOR ALL TABS) */}
      <style>{`
        .tabs {
          display: flex;
          gap: 24px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 12px;
        }
        .tabs button {
          padding: 10px 2px;
          font-size: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
        }
        .tabs button.active {
          color: #2563eb;
          font-weight: 600;
          border-bottom: 2px solid #2563eb;
        }
        .table-scroll {
          overflow-x: auto;
        }
        .zoho-table {
          width: 100%;
          min-width: 1500px;
          border-collapse: collapse;
          font-size: 13px;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 10px;
          text-align: right;
          white-space: nowrap;
        }
        th:first-child, td:first-child {
          text-align: left;
          position: sticky;
          left: 0;
          background: #fff;
          z-index: 1;
          min-width: 280px;
        }
        th {
          background: #f7f8fa;
          font-weight: 600;
        }
        .section-row td {
          background: #f3f4f6;
          font-weight: 600;
          cursor: pointer;
        }
        .data-row:hover td {
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
}
