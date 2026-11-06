// Shared types and helpers for the Inspection management dashboard (all figures come from the API).

export type Persona = "admin" | "circle";
export type ModuleKey = "inspection";

export const fmt = (n: number | string) => (typeof n === "string" ? n : Number(n).toLocaleString("en-IN"));

// SVG path data ("|"-separated) for the KPI card icons.
export const KPI_ICONS = {
  document: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z|M14 2v6h6",
  clock: "M12 8v4l3 3|M12 22a10 10 0 100-20 10 10 0 000 20z",
  pen: "M12 20h9|M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z",
  check: "M22 11.08V12a10 10 0 11-5.93-9.14|M22 4L12 14.01l-3-3",
};
