import { useMemo, useState } from "react";
import { FormControl, MenuItem, Select as MuiSelect } from "@mui/material";
import { AuditChart, ChartSwitch } from "./AuditChart";
import { OBS_JOURNEY_COLORS, fmt, type ChartKind, type ChartSpec } from "./data";
import type { JourneyGroup, JourneyNode } from "./viAuditDashboardApi";

interface CategoryJourneyCardProps {
  title: string;
  sub: string;
  dimensionLabel: string;
  allLabel: string;
  groups: JourneyGroup[] | null;
  loading: boolean;
  showSubCategory?: boolean;
}

const ALL = "__all__";
const VI_FOCUS = "#EE2737";
const selectSx = {
  height: 30,
  backgroundColor: "#fff",
  borderRadius: "8px",
  fontSize: "11.5px",
  fontFamily: "'Poppins', sans-serif",
  "& .MuiSelect-select": { padding: "5px 28px 5px 12px", fontSize: "11.5px", fontFamily: "'Poppins', sans-serif" },
  "& fieldset": { borderColor: "#e5e7eb" },
  "&:hover fieldset": { borderColor: VI_FOCUS },
  "&.Mui-focused fieldset": { borderColor: VI_FOCUS },
};
const menuItemSx = { fontSize: "12px", fontFamily: "'Poppins', sans-serif" };
const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 320,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const mergeNodes = (nodes: JourneyNode[]): JourneyNode[] => {
  const byName = new Map<string, JourneyNode>();
  nodes.forEach((node) => {
    const current = byName.get(node.name);
    if (!current) {
      byName.set(node.name, { ...node, children: mergeNodes(node.children) });
      return;
    }
    current.observations += node.observations;
    current.initiated += node.initiated;
    current.closed += node.closed;
    current.children = mergeNodes([...current.children, ...node.children]);
  });
  return [...byName.values()];
};

interface TableRow {
  key: string;
  label: string;
  level: 0 | 1 | 2;
  node: JourneyNode;
}

const flatten = (nodes: JourneyNode[], showSubCategory: boolean, prefix = ""): TableRow[] =>
  nodes.flatMap((node) => {
    const key = `${prefix}/${node.name}`;
    const row: TableRow = { key, label: node.name, level: 0, node };
    const categories = node.children.flatMap((category) => {
      const categoryKey = `${key}/${category.name}`;
      const categoryRow: TableRow = { key: categoryKey, label: category.name, level: 1, node: category };
      const subs = showSubCategory
        ? category.children.map((sub) => ({ key: `${categoryKey}/${sub.name}`, label: sub.name, level: 2 as const, node: sub }))
        : [];
      return [categoryRow, ...subs];
    });
    return [row, ...categories];
  });

export function CategoryJourneyCard({ title, sub, dimensionLabel, allLabel, groups, loading, showSubCategory = false }: CategoryJourneyCardProps) {
  const [type, setType] = useState<ChartKind>("bar");
  const [selected, setSelected] = useState(ALL);
  const list = groups ?? [];
  const active = selected === ALL ? null : list.find((group) => group.id === selected);
  const classifications = useMemo(
    () => (selected === ALL || !active ? mergeNodes(list.flatMap((group) => group.nodes)) : active.nodes),
    [active, list, selected],
  );
  const categories = useMemo(() => mergeNodes(classifications.flatMap((node) => node.children)), [classifications]);

  const spec = useMemo<ChartSpec>(() => ({
    id: `${title}-${selected}`,
    labels: categories.map((category) => category.name),
    datasets: [
      { label: "Observations", data: categories.map((category) => category.observations), barColor: OBS_JOURNEY_COLORS[0] },
      { label: "CAPA Plan Initiated", data: categories.map((category) => category.initiated), barColor: OBS_JOURNEY_COLORS[1] },
      { label: "CAPA Plan Closed", data: categories.map((category) => category.closed), barColor: OBS_JOURNEY_COLORS[2] },
    ],
    defaultType: "bar",
  }), [categories, selected, title]);

  const rows = useMemo(() => flatten(classifications, showSubCategory), [classifications, showSubCategory]);
  const message = loading ? "Loading…" : !groups ? "Couldn’t load data" : rows.length === 0 ? "No data for these filters" : "";

  return (
    <div className="card">
      <div className="card-hd">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-sub">{sub}</div>
        </div>
        {!message && (
          <div className="card-actions-row">
            <FormControl variant="outlined" size="small" sx={{ minWidth: 130, maxWidth: 170 }}>
              <MuiSelect
                value={list.some((group) => group.id === selected) ? selected : ALL}
                onChange={(event) => setSelected(String(event.target.value))}
                inputProps={{ "aria-label": dimensionLabel }}
                sx={selectSx}
                MenuProps={selectMenuProps}
              >
                <MenuItem value={ALL} sx={menuItemSx}>{allLabel}</MenuItem>
                {list.map((group) => (
                  <MenuItem key={group.id} value={group.id} sx={menuItemSx}>{group.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <ChartSwitch options={["bar", "table"]} value={type} onChange={setType} />
          </div>
        )}
      </div>
      {message ? (
        <div className="card-sub" style={{ padding: "28px 0", textAlign: "center" }}>{message}</div>
      ) : type === "table" ? (
        <div className="chart-as-table tall">
          <table>
            <thead>
              <tr>
                <th style={{ whiteSpace: "normal" }}>{showSubCategory ? "Classification › Category › Sub Category" : "Classification › Category"}</th>
                <th style={{ textAlign: "right", whiteSpace: "normal" }}>Observations</th>
                <th style={{ textAlign: "right", whiteSpace: "normal" }}>CAPA Plan Initiated</th>
                <th style={{ textAlign: "right", whiteSpace: "normal" }}>CAPA Plan Closed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td style={{ paddingLeft: 10 + row.level * 16, fontWeight: row.level === 0 ? 700 : 400 }}>{row.label}</td>
                  <td>{fmt(row.node.observations)}</td>
                  <td>{fmt(row.node.initiated)}</td>
                  <td>{fmt(row.node.closed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-wrap">
          <AuditChart spec={spec} type="bar" />
        </div>
      )}
    </div>
  );
}
