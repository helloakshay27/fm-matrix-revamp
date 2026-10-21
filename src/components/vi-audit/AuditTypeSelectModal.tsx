import { Building2, Grid3x3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ViAuditType = "corporate" | "circle";

export const VI_AUDIT_TYPES: { value: ViAuditType; label: string; icon: typeof Building2 }[] = [
  { value: "corporate", label: "Corporate", icon: Building2 },
  { value: "circle", label: "Circle", icon: Grid3x3 },
];

export const isViAuditType = (value: string | null): value is ViAuditType =>
  value === "corporate" || value === "circle";

// "Select type of audit" step shown before the Add Audit form.
export const AuditTypeSelectModal = ({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (type: ViAuditType) => void;
}) => (
  <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
    <DialogContent className="sm:max-w-md rounded-2xl p-8">
      <DialogHeader className="items-center text-center">
        <DialogTitle className="text-lg font-semibold text-[#1A1A18]">Audit</DialogTitle>
        <DialogDescription className="text-sm text-[rgba(26,26,24,0.48)]">
          Select type of audit
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4 flex justify-center gap-5">
        {VI_AUDIT_TYPES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className="flex h-36 w-40 flex-col items-center justify-center gap-4 rounded-2xl border border-[rgba(26,26,24,0.12)] bg-white transition-colors hover:border-[#1A1A18] hover:bg-[#F7F6F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A18]"
          >
            <Icon className="h-12 w-12 text-[#1A1A18]" strokeWidth={1.5} />
            <span className="text-[15px] font-medium text-[#1A1A18]">{label}</span>
          </button>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);
