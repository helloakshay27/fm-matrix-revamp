import { useDailyReport } from "../context/DailyReportContext";

export const PageHeader = () => {
  const { activeTab, setActiveTab } = useDailyReport();

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <h1 className="bc-daily-header-title">Daily Report</h1>
        <p className="bc-daily-header-subtitle">
          Track your daily performance, tasks and accomplishments
        </p>
      </div>
      <button
        type="button"
        className="bc-daily-review-btn shrink-0"
        onClick={() => {
          setActiveTab(activeTab === "history" ? "submit" : "history");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        {activeTab === "history" ? "Back to Report" : "Review History"}
      </button>
    </div>
  );
};
