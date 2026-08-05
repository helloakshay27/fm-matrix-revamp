import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDailyReport } from "../context/DailyReportContext";

export const AbsenceCard = () => {
  const { isAbsent, absenceReason, setAbsenceReason, markDraftDirty } =
    useDailyReport();

  if (!isAbsent) return null;

  return (
    <div className="bc-daily-card">
      <div className="bc-daily-card-body space-y-4">
        <Label className="text-sm font-bold text-gray-700 flex items-center gap-1">
          Reason for Absence <span className="text-red-500">*</span>
        </Label>
        <Input
          placeholder="Why are you absent today?"
          value={absenceReason}
          onChange={(e) => {
            markDraftDirty();
            setAbsenceReason(e.target.value);
          }}
          className="h-12 rounded-[10px] border-gray-200 focus:ring-[#DA7756]/20"
        />
      </div>
    </div>
  );
};
