import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Button } from "./ui/button";

interface BroadcastFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (data: { status: string }) => void;
}

export const BroadcastFilterModal = ({ open, onOpenChange, onApply }: BroadcastFilterModalProps) => {
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState("");

  const handleReset = () => {
    setStatus("");
    setDateRange("");
    onOpenChange(false);
  };

  const handleApply = async () => {
    const data = { status };
    onApply(data);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="600">
          Filter
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Status */}
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="1">Published</MenuItem>
              <MenuItem value="2">Disabled</MenuItem>
              <MenuItem value="0">Rejected</MenuItem>
            </Select>
          </FormControl>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button
          onClick={handleApply}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};
