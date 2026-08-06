import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useDailyReport } from "../context/DailyReportContext";

export const SubmitBar = () => {
  const {
    submitError,
    submitSuccess,
    currentReportId,
    isAbsent,
    accomplishments,
    autoAddedAccomplishments,
    handleSubmit,
    isSubmitting,
    submitDateLabel,
  } = useDailyReport();

  return (
    <>
      {submitError && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 border border-red-100">
          <AlertCircle size={16} />
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 border border-green-100">
          <CheckCircle2 size={16} />
          {currentReportId
            ? "Daily report updated successfully. Redirecting to history..."
            : "Daily report submitted successfully. Redirecting to history..."}
        </div>
      )}
      {!isAbsent &&
        accomplishments.filter((a) => a.completed).length === 0 &&
        autoAddedAccomplishments.length === 0 && (
          <p className="text-xs text-red-500 text-center font-bold">
            Please complete at least one accomplishment before submitting
          </p>
        )}
      <button
        type="button"
        className="bc-submit-btn"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            {currentReportId ? "Updating..." : "Submitting..."}
          </>
        ) : (
          <>
            <Send size={18} />
            {currentReportId ? "Update" : "Submit"} Daily Report (
            {submitDateLabel})
          </>
        )}
      </button>
    </>
  );
};
