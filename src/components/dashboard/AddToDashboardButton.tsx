import { useState } from "react";
import { Plus, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useMyDashboardStore } from "@/stores/myDashboardStore";
import { formatChartLabel } from "@/utils/formatChartLabel";
import { deleteDashboardLayout } from "@/services/dashboardLayoutAPI";

interface AddToDashboardButtonProps {
  chartId: string;
  moduleKey: string;
  subTab: string;
  /** Grid row units from the source card's layout, e.g. "3" — sent to the backend as `height` on Save. */
  height: string;
  /** Grid column units from the source card's layout, e.g. "6" — sent to the backend as `width` on Save. */
  width: string;
  /** "x,y" grid coordinates from the source card's layout — sent to the backend as `position` on Save. */
  position: string;
  label?: string;
  className?: string;
}

export function AddToDashboardButton({
  chartId,
  moduleKey,
  subTab,
  height,
  width,
  position,
  label,
  className,
}: AddToDashboardButtonProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isSaved = useMyDashboardStore((state) => state.isSaved(chartId));
  const serverId = useMyDashboardStore((state) => state.getCard(chartId)?.serverId);
  const addCard = useMyDashboardStore((state) => state.addCard);
  const removeCard = useMyDashboardStore((state) => state.removeCard);

  const displayLabel = label || formatChartLabel(chartId);

  const handleConfirm = async () => {
    if (isSaved) {
      setIsProcessing(true);
      try {
        if (serverId) {
          await deleteDashboardLayout(serverId);
        }
        removeCard(chartId);
        toast.success(`Removed "${displayLabel}" from My Dashboard`);
      } catch (error) {
        console.error("Error deleting dashboard layout:", error);
        // Still drop it locally — an orphaned server row is cheap to clean up later,
        // being stuck with a card you can't remove because of a network blip is not.
        removeCard(chartId);
        toast.error(`Removed locally, but couldn't delete "${displayLabel}" from the server.`);
      } finally {
        setIsProcessing(false);
      }
    } else {
      addCard({ chartId, label: displayLabel, moduleKey, subTab, height, width, position });
      toast.success(`Added "${displayLabel}" to My Dashboard`);
    }
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        aria-label={isSaved ? "Remove from My Dashboard" : "Add to My Dashboard"}
        title={isSaved ? "Remove from My Dashboard" : "Add to My Dashboard"}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(
          "no-drag absolute top-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-colors",
          isSaved
            ? "bg-brand-success-bg border-brand-success text-brand-success hover:bg-brand-success-bg"
            : "bg-white border-gray-300 text-gray-500 hover:border-[#C72030] hover:text-[#C72030]",
          className
        )}
      >
        {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
      </button>

      <AlertDialogContent className="no-drag">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isSaved ? "Remove card from My Dashboard?" : "Add card to My Dashboard?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isSaved ? (
              <>
                <strong>{displayLabel}</strong> is currently on your My Dashboard. Do you want to
                remove it?
              </>
            ) : (
              <>
                Do you want to add <strong>{displayLabel}</strong> to My Dashboard? It will show up
                on your My Dashboard tab so you can check it at a glance.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isSaved ? (
              "Remove"
            ) : (
              "Yes, add it"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
