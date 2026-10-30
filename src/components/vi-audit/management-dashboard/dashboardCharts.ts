import { OBS_JOURNEY_COLORS, type ChartSpec } from "./data";
import type { ActionPlanSlice, AgingBucket, ClosureRow, VolumeRow } from "./managementDashboardApi";

const AUDIT_OBS = "rgb(47, 48, 67)";
const AUDIT_BAR = "rgb(255, 143, 107)";
const PAST_TARGET = "rgb(238, 39, 55)";
const EXTENDED = "rgb(47, 48, 67)";

const volumeSpec = (id: string, rows: VolumeRow[], includeAudits: boolean): ChartSpec => ({
  id,
  labels: rows.map((row) => row.name),
  datasets: [
    ...(includeAudits ? [{ label: "Audits", data: rows.map((row) => row.audits), barColor: AUDIT_BAR }] : []),
    { label: "Observations", data: rows.map((row) => row.observations), barColor: includeAudits ? AUDIT_OBS : OBS_JOURNEY_COLORS[0] },
    { label: "CAPA Assigned", data: rows.map((row) => row.capaAssigned), barColor: OBS_JOURNEY_COLORS[1] },
    { label: "CAPA Closed", data: rows.map((row) => row.capaClosed), barColor: OBS_JOURNEY_COLORS[2] },
  ],
  defaultType: "bar",
});

export const auditsByFunctionSpec = (rows: VolumeRow[]) => volumeSpec("auditFunc", rows, true);
export const auditsByCircleSpec = (rows: VolumeRow[]) => volumeSpec("auditCircle", rows, true);
export const observationsByFunctionSpec = (rows: VolumeRow[]) => volumeSpec("obsFunc", rows, false);
export const observationsByCircleSpec = (rows: VolumeRow[]) => volumeSpec("obsCircle", rows, false);

const sumStatus = (rows: ActionPlanSlice[], kind: "corrective" | "preventive", field: keyof ActionPlanSlice["corrective"]) =>
  rows.reduce((total, row) => total + row[kind][field], 0);

export const capaStatusSpec = (rows: ActionPlanSlice[]): ChartSpec => ({
  id: "capaStatus",
  labels: ["Corrective", "Preventive"],
  datasets: [
    { label: "Not started", data: [sumStatus(rows, "corrective", "notStarted"), sumStatus(rows, "preventive", "notStarted")], barColor: OBS_JOURNEY_COLORS[0] },
    { label: "Pending By Action Owner", data: [sumStatus(rows, "corrective", "pending"), sumStatus(rows, "preventive", "pending")], barColor: OBS_JOURNEY_COLORS[1] },
    { label: "Closed By Action Owner", data: [sumStatus(rows, "corrective", "closed"), sumStatus(rows, "preventive", "closed")], barColor: OBS_JOURNEY_COLORS[2] },
  ],
  defaultType: "bar",
  stacked: true,
});

export const spocAgingSpec = (buckets: AgingBucket[]): ChartSpec => ({
  id: "capaAging",
  labels: buckets.map((bucket) => bucket.name),
  datasets: [{ label: "Observations", data: buckets.map((bucket) => bucket.count), barColor: AUDIT_BAR }],
  defaultType: "bar",
});

export const pastTargetSpec = (labels: string[], values: number[]): ChartSpec => ({
  id: "capaOverdue",
  labels,
  datasets: [{ label: "Past target date", data: values, barColor: PAST_TARGET }],
  defaultType: "bar",
});

/** extended_capa is the 5th closure column. */
export const extendedCapaSpec = (rows: ClosureRow[]): ChartSpec => ({
  id: "capaExt",
  labels: rows.map((row) => row.circle),
  datasets: [{ label: "Extended CAPA %", data: rows.map((row) => row.values[4] ?? 0), barColor: EXTENDED }],
  defaultType: "bar",
});
