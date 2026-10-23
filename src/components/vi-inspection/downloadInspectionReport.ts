import { getInspectionDisplayStatus, type ViInspectionRecord } from "./viInspectionData";

const escapeHtml = (value: unknown) => String(value ?? "-").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]!));

/** Download only the selected inspection, including its checklist and action plans. */
export function downloadInspectionReport(inspection: ViInspectionRecord) {
  const fields = (entries: [string, unknown][]) => `<dl>${entries.map(([label, value]) =>
    `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || "-")}</dd>`).join("")}</dl>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
    <title>Inspection ${inspection.inspectionId} Report</title>
    <style>body{font:14px Arial,sans-serif;color:#1a1a18;max-width:900px;margin:40px auto;padding:0 24px}h1{font-size:24px}h2{font-size:18px;margin-top:28px}h3{font-size:15px}dl{display:grid;grid-template-columns:180px 1fr;gap:8px}dt{color:#555}dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}section{border-top:1px solid #ddd;padding:12px 0}p{white-space:pre-wrap;overflow-wrap:anywhere}</style>
    </head><body><h1>Inspection ${inspection.inspectionId} Report</h1>
    ${fields([
      ["Inspection", inspection.title], ["Status", getInspectionDisplayStatus(inspection.status)],
      ["Date of Inspection", inspection.dateOfInspection], ["Type", inspection.inspectionType],
      ["Location", inspection.inspectionLocation], ["Circle", inspection.circle],
      ["Personnel Area", inspection.personnelArea], ["Work Location", inspection.workLocation],
      ["Facility Type", inspection.facilityType], ["Function", inspection.function],
      ["Inspector", inspection.inspector.name], ["Inspector Email", inspection.inspector.mailId],
      ["Employer", inspection.inspector.employer], ["SPOC", inspection.spoc],
      ["Functional Head", inspection.functionalHead], ["Target Date", inspection.targetDate],
    ])}<h2>Inspection Checklist</h2>
    ${inspection.checklist.map((item, index) => `<section><h3>${index + 1}. ${escapeHtml(item.question)}</h3>
      ${fields([["Answer", item.answer], ["Finding", item.finding], ["Remarks", item.remarks],
        ["Status", getInspectionDisplayStatus(item.status)], ["SPOC", item.spoc], ["Functional Head", item.functionalHead],
        ["Target Date", item.targetDate], ["Attachments", item.attachments.join(", ")]])}
      ${([ ["Corrective Action Plans", item.correctivePlans], ["Preventive Action Plans", item.preventivePlans] ] as const).map(([title, plans]) =>
        `<h3>${title}</h3>${plans.length ? plans.map((plan) => fields([["Plan ID", plan.id], ["Description", plan.description], ["Action Owner", plan.actionOwner], ["Target Date", plan.targetDate]])).join("") : "<p>No plans available</p>"}`).join("")}
      </section>`).join("")}</body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `inspection-${inspection.inspectionId}-report.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
