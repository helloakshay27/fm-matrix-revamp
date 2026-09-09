import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface RemoveApproverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approverName?: string;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function RemoveApproverDialog({
  open,
  onOpenChange,
  approverName,
  onConfirm,
  isSubmitting,
}: RemoveApproverDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Approver</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{approverName ? ` ${approverName}` : " this approver"}{" "}
            from this site's approval matrix?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isSubmitting}
            className="!bg-brand-error hover:!bg-brand-error/90"
          >
            {isSubmitting ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
