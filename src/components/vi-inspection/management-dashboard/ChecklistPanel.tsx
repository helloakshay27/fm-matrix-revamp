import { CHARTS } from "./data";
import { ChartCard } from "./ChartCard";
import { DownloadIcon } from "./icons";

export function ChecklistPanel({ highlighted, onExcel }: { highlighted: boolean; onExcel: (section: string) => void }) {
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-chk">
      <div className="acc-hd">
        <div><div className="acc-title">Checklist &amp; Findings</div><div className="acc-sub">What the checklists say: compliance, the questions that fail most, and where</div></div>
        <div className="acc-hd-actions">
          <button type="button" className="acc-dl-btn" onClick={() => onExcel("Checklist")}><DownloadIcon />Excel</button>
        </div>
      </div>
      <div className="g g3">
        <ChartCard title="Checklist Answers" sub="Yes · No · NA across submitted checklists" spec={CHARTS.chkOverall} options={["donut", "bar"]} />
        <ChartCard title="Checklist Compliance · 12 Months" sub="Yes ÷ (Yes + No)" spec={CHARTS.chkTrend} options={["line", "bar"]} />
        <ChartCard title="Non-compliant Answers by Circle" sub="Count of “No” answers" spec={CHARTS.chkCircle} options={["bar", "table"]} />
      </div>
      <div className="g g1" style={{ marginTop: 16 }}>
        <ChartCard title="Compliance by Checklist Question" sub="Share of Yes, No and NA per question" spec={CHARTS.chkQuestions} options={["bar"]} />
      </div>
    </div>
  );
}
