import { ACTION_TYPE_LABEL, formatInspectionDate, type ViInspectionRecord } from "./viInspectionData";

const escapeHtml = (value: unknown) => String(value ?? "-").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]!));

/** Download one inspection (from GET /vi_inspections/:id.json) with its checklist, plans and actions taken. */
export function downloadInspectionReport(inspection: ViInspectionRecord) {
  const fields = (entries: [string, unknown][]) => `<dl>${entries.map(([label, value]) =>
    `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || "-")}</dd>`).join("")}</dl>`;
  const date = formatInspectionDate;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
    <title>Inspection ${escapeHtml(inspection.inspectionNo)} Report</title>
    <style>body{font:14px Arial,sans-serif;color:#1a1a18;max-width:900px;margin:40px auto;padding:0 24px}h1{font-size:24px}h2{font-size:18px;margin-top:28px}h3{font-size:15px}h4{font-size:14px;margin:16px 0 4px}dl{display:grid;grid-template-columns:180px 1fr;gap:8px}dt{color:#555}dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}section{border-top:1px solid #ddd;padding:12px 0}p{white-space:pre-wrap;overflow-wrap:anywhere}</style>
    </head><body><h1>Inspection ${escapeHtml(inspection.inspectionNo)} Report</h1>
    ${fields([
      ["Status", inspection.workflowLabel],
      ["Date of Inspection", date(inspection.inspectionDate)], ["Inspection Type", inspection.inspectionType],
      ["Inspection Location", inspection.inspectorLocation], ["Circle", inspection.circle],
      ["Personnel Area", inspection.personalArea], ["Work Location", inspection.workLocation],
      ["Type of Facility", inspection.facilityType], ["Function", inspection.department],
      ["Inspector", inspection.inspector?.name], ["Inspector Email", inspection.inspector?.email],
      ["SPOC", inspection.spoc?.name], ["Functional Head", inspection.functionalHead?.name],
      ["Target Date", date(inspection.targetDate)],
    ])}<h2>Inspection Checklist</h2>
    ${inspection.checklistResponses.map((item, index) => `<section><h3>${index + 1}. ${escapeHtml(item.question)}</h3>
      ${fields([["Answer", item.answer], ["Remarks", item.remark], ["Attachments", item.attachments.map((a) => a.name).join(", ")]])}
      ${item.actionPlans.map((plan) => `<h4>${ACTION_TYPE_LABEL[plan.actionType]} Action Plan</h4>${fields([
        ["Description", plan.description], ["Target Date", date(plan.targetDate)],
        ["Extended Target Date", date(plan.extendTargetDate)], ["Reason for Extension", plan.extensionReason],
        ["Responsible Persons", plan.assignments.map((a) => a.owner?.name).filter(Boolean).join(", ")],
      ])}${plan.assignments.flatMap((a) => a.actionTakens.map((t) => fields([
        ["Action Taken By", a.owner?.name], ["Action Taken", t.description], ["Closure Date", date(t.closureDate)],
        ["Attachments", t.attachments.map((f) => f.name).join(", ")],
      ]))).join("")}`).join("")}
      </section>`).join("")}</body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `inspection-${inspection.inspectionNo || inspection.id}-report.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
