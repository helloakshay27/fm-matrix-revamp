import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { MuiMultiSelect } from "@/components/MuiMultiSelect";
import { useAudienceSitesQuery } from "../hooks/useAudienceSitesQuery";
import { useAudienceUsersQuery } from "../hooks/useAudienceUsersQuery";

const fieldStyles = {
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#ddd" },
    "&:hover fieldset": { borderColor: "var(--color-primary)" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": { color: "var(--color-primary)" },
  },
  height: "45px",
  "& .MuiInputBase-root": { height: "45px" },
};

interface AddApproverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
  onSiteIdChange: (siteId: string) => void;
  userIds: string[];
  onUserIdsChange: (userIds: string[]) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function AddApproverDialog({
  open,
  onOpenChange,
  siteId,
  onSiteIdChange,
  userIds,
  onUserIdsChange,
  onConfirm,
  isSubmitting,
}: AddApproverDialogProps) {
  const userIdRaw = localStorage.getItem("userId");
  const currentUserId = userIdRaw ? parseInt(userIdRaw, 10) : null;

  const { data: sites, isLoading: isSitesLoading } = useAudienceSitesQuery(currentUserId);
  const { data: users, isLoading: isUsersLoading } = useAudienceUsersQuery();

  const userOptions = (users ?? []).map((user) => ({
    label: user.full_name,
    value: String(user.id),
  }));

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 600 }}>Add Approver</DialogTitle>
      <DialogContent>
        <div className="space-y-4 pt-2">
          <FormControl fullWidth>
            <InputLabel id="add-approver-site-label" shrink>
              Site <span className="text-brand-error">*</span>
            </InputLabel>
            <MuiSelect
              labelId="add-approver-site-label"
              value={siteId}
              onChange={(e: SelectChangeEvent) => onSiteIdChange(e.target.value)}
              displayEmpty
              disabled={isSitesLoading}
              sx={fieldStyles}
            >
              <MenuItem value="" disabled>
                {isSitesLoading ? "Loading..." : "Select site"}
              </MenuItem>
              {(sites ?? []).map((site) => (
                <MenuItem key={site.id} value={String(site.id)}>
                  {site.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <MuiMultiSelect
            label={
              <>
                User <span className="text-brand-error">*</span>
              </>
            }
            options={userOptions}
            value={userOptions.filter((option) => userIds.includes(option.value))}
            onChange={(selected) => onUserIdsChange(selected.map((option) => String(option.value)))}
            disabled={isUsersLoading}
            placeholder={isUsersLoading ? "Loading..." : "Select user(s)"}
          />
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isSubmitting || !siteId || userIds.length === 0}
          className="!bg-brand hover:!bg-brand-hover !text-white"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
