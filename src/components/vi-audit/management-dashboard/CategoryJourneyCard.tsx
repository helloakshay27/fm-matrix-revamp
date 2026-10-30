import { useMemo, useState } from "react";
import { FormControl, MenuItem, Select as MuiSelect } from "@mui/material";
import { AuditChart, ChartSwitch } from "./AuditChart";
import {
  CAPA_CLOSED_RATIO,
  CAPA_INITIATED_RATIO,
  OBS_CATEGORY_TREE,
  OBS_CLASSIFICATIONS,
  OBS_JOURNEY_COLORS,
  fmt,
  type ChartKind,
  type ChartSpec,
} from "./data";

interface CategoryJourneyCardProps {
  title: string;
  sub: string;
  dimensionLabel: string;
  allLabel: string;
  labels: string[];
  totals: number[];
  showSubCategory?: boolean;
}

interface Counts {
  observations: number;
  initiated: number;
  closed: number;
}

const toCounts = (observations: number): Counts => ({
  observations: Math.round(observations),
  initiated: Math.round(observations * CAPA_INITIATED_RATIO),
  closed: Math.round(observations * CAPA_CLOSED_RATIO),
});

const ALL = "__all__";

// Mirrors the filter bar's Select styling so the dropdown matches the rest of the dashboard.
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

export function CategoryJourneyCard({ title, sub, dimensionLabel, allLabel, labels, totals, showSubCategory = false }: CategoryJourneyCardProps) {
  const [type, setType] = useState<ChartKind>("bar");
  const [selected, setSelected] = useState(ALL);

  const total = selected === ALL ? totals.reduce((sum, value) => sum + value, 0) : totals[labels.indexOf(selected)] ?? 0;

  const spec = useMemo<ChartSpec>(() => {
    const counts = OBS_CATEGORY_TREE.map((category) => toCounts(total * category.share));
    return {
      id: `${title}-${selected}`,
      labels: OBS_CATEGORY_TREE.map((category) => category.label),
      datasets: [
        { label: "Observations", data: counts.map((count) => count.observations), barColor: OBS_JOURNEY_COLORS[0] },
        { label: "CAPA Plan Initiated", data: counts.map((count) => count.initiated), barColor: OBS_JOURNEY_COLORS[1] },
        { label: "CAPA Plan Closed", data: counts.map((count) => count.closed), barColor: OBS_JOURNEY_COLORS[2] },
      ],
      defaultType: "bar",
    };
  }, [selected, title, total]);

  const rows = useMemo(() => {
    const result: { key: string; label: string; level: 0 | 1 | 2; counts: Counts }[] = [];
    OBS_CLASSIFICATIONS.forEach((classification) => {
      const classTotal = total * classification.share;
      result.push({ key: classification.label, label: classification.label, level: 0, counts: toCounts(classTotal) });
      OBS_CATEGORY_TREE.forEach((category) => {
        const categoryTotal = classTotal * category.share;
        result.push({ key: `${classification.label}/${category.label}`, label: category.label, level: 1, counts: toCounts(categoryTotal) });
        if (showSubCategory) {
          category.subs.forEach(([subLabel, subShare]) => {
            result.push({ key: `${classification.label}/${category.label}/${subLabel}`, label: subLabel, level: 2, counts: toCounts(categoryTotal * subShare) });
          });
        }
      });
    });
    return result;
  }, [showSubCategory, total]);

  return (
    <div className="card">
      <div className="card-hd">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-sub">{sub}</div>
        </div>
        <div className="card-actions-row">
          <FormControl variant="outlined" size="small" sx={{ minWidth: 130, maxWidth: 170 }}>
            <MuiSelect
              value={selected}
              onChange={(event) => setSelected(String(event.target.value))}
              inputProps={{ "aria-label": dimensionLabel }}
              sx={selectSx}
              MenuProps={selectMenuProps}
            >
              <MenuItem value={ALL} sx={menuItemSx}>
                {allLabel}
              </MenuItem>
              {labels.map((label) => (
                <MenuItem key={label} value={label} sx={menuItemSx}>
                  {label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
          <ChartSwitch options={["bar", "table"]} value={type} onChange={setType} />
        </div>
      </div>
      {type === "table" ? (
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
                  <td>{fmt(row.counts.observations)}</td>
                  <td>{fmt(row.counts.initiated)}</td>
                  <td>{fmt(row.counts.closed)}</td>
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
