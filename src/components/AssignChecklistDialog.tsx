import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from "@mui/material";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

interface SnagQuestionOption {
  qname: string;
}

interface SnagQuestion {
  id: number;
  descr: string;
  qtype: string;
  quest_mandatory?: boolean | number;
  snag_quest_options?: SnagQuestionOption[];
}

interface ChecklistOption {
  id: string;
  name: string;
  snag_questions: SnagQuestion[];
}

interface AssignChecklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkpointIds: number[];
  onAssigned?: () => void;
}

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

const selectMenuProps = {
  PaperProps: { style: { maxHeight: 224 } },
};

const INPUT_TYPE_LABELS: Record<string, string> = {
  multiple: "Multiple Choice",
  yesno: "Yes/No",
  rating: "Rating",
  input: "Text Input",
  description: "Description",
  emoji: "Emoji",
};

export const AssignChecklistDialog: React.FC<AssignChecklistDialogProps> = ({
  open,
  onOpenChange,
  checkpointIds,
  onAssigned,
}) => {
  const [checklistOptions, setChecklistOptions] = useState<ChecklistOption[]>([]);
  const [selectedChecklistId, setSelectedChecklistId] = useState("");
  const [isChecklistLoading, setIsChecklistLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedChecklistId("");

    const fetchChecklists = async () => {
      setIsChecklistLoading(true);
      try {
        const response = await fetch(
          getFullUrl("/pms/admin/snag_checklists.json?q[check_type_eq]=patrolling"),
          {
            method: "GET",
            headers: {
              Authorization: getAuthHeader(),
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Support both array and wrapped responses, same as the create page
        const checklists = Array.isArray(data)
          ? data
          : Array.isArray(data.snag_checklists)
            ? data.snag_checklists
            : data.id && data.name
              ? [data]
              : [];
        setChecklistOptions(
          checklists.map((item) => ({
            id: item.id.toString(),
            name: item.name,
            snag_questions: item.snag_questions || [],
          }))
        );
      } catch (error) {
        console.error("Error fetching checklists:", error);
        toast.error("Failed to load checklists");
        setChecklistOptions([]);
      } finally {
        setIsChecklistLoading(false);
      }
    };

    fetchChecklists();
  }, [open]);

  const selectedChecklist = checklistOptions.find((c) => c.id === selectedChecklistId);

  const handleSubmit = async () => {
    if (!selectedChecklistId) {
      toast.error("Please select a checklist");
      return;
    }

    setIsSubmitting(true);
    try {
      const results = await Promise.allSettled(
        checkpointIds.map(async (checkpointId) => {
          const response = await fetch(
            getFullUrl(`/api/v1/patrolling/checkpoints/${checkpointId}/assign_checklist`),
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: getAuthHeader(),
              },
              body: JSON.stringify({ checklist_id: Number(selectedChecklistId) }),
            }
          );
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        })
      );

      const failedCount = results.filter((r) => r.status === "rejected").length;
      if (failedCount === 0) {
        toast.success(`Checklist assigned to ${checkpointIds.length} checkpoint(s)`);
        onOpenChange(false);
        onAssigned?.();
      } else if (failedCount < checkpointIds.length) {
        toast.error(`Failed to assign checklist to ${failedCount} of ${checkpointIds.length} checkpoint(s)`);
        onOpenChange(false);
        onAssigned?.();
      } else {
        toast.error("Failed to assign checklist");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !isSubmitting && onOpenChange(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 18, fontWeight: 600 }}
      >
        Assign Checklist
        <IconButton size="small" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <div className="space-y-4 py-2">
          <FormControl fullWidth variant="outlined" sx={{ "& .MuiInputBase-root": fieldStyles }}>
            <InputLabel shrink>
              Checklist<span className="text-red-500">*</span>
            </InputLabel>
            <MuiSelect
              value={selectedChecklistId}
              onChange={(e) => setSelectedChecklistId(e.target.value as string)}
              label="Checklist*"
              notched
              displayEmpty
              disabled={isSubmitting || isChecklistLoading}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                {isChecklistLoading ? "Loading checklists..." : "Select Checklist"}
              </MenuItem>
              {checklistOptions.map((opt) => (
                <MenuItem key={opt.id} value={opt.id}>
                  {opt.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          {selectedChecklist && selectedChecklist.snag_questions.length === 0 && (
            <p className="text-sm text-gray-500">No questions in this checklist.</p>
          )}

          {selectedChecklist?.snag_questions.map((q, idx) => {
            const options = q.snag_quest_options?.map((opt) => opt.qname) || [];
            return (
              <div key={q.id} className="rounded-md border border-dashed bg-muted/30 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`assign-mandatory-${idx}`}
                    checked={!!q.quest_mandatory}
                    className="w-4 h-4 rounded accent-brand"
                    disabled
                  />
                  <label htmlFor={`assign-mandatory-${idx}`} className="text-sm font-medium text-gray-700">
                    Mandatory
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="Question"
                    value={q.descr || ""}
                    fullWidth
                    variant="outlined"
                    slotProps={{ inputLabel: { shrink: true } }}
                    InputProps={{ sx: fieldStyles }}
                    disabled
                  />
                  <TextField
                    label="Input Type"
                    value={INPUT_TYPE_LABELS[q.qtype] || q.qtype || ""}
                    fullWidth
                    variant="outlined"
                    slotProps={{ inputLabel: { shrink: true } }}
                    InputProps={{ sx: fieldStyles }}
                    disabled
                  />
                </div>

                {q.qtype === "multiple" && options.length > 0 && (
                  <div className="mt-4 p-2 bg-gray-50 border border-gray-200 rounded text-xs">
                    <p className="font-medium text-gray-800 mb-1">Options ({options.length}):</p>
                    <div className="flex flex-wrap gap-1">
                      {options.map((option, optIdx) => (
                        <span key={optIdx} className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          className="bg-brand hover:bg-brand-hover text-white"
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedChecklistId}
        >
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
