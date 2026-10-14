import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField } from "@mui/material";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TransportDriver } from "../types/transportDriver";

export interface VehicleFilterValues {
    // "" = all drivers.
    driverId: string;
    activeOnly: boolean;
}

export const EMPTY_VEHICLE_FILTERS: VehicleFilterValues = { driverId: "", activeOnly: false };

interface VehicleFilterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    drivers: TransportDriver[];
    value: VehicleFilterValues;
    onApply: (value: VehicleFilterValues) => void;
}

const fieldSx = {
    "& .MuiOutlinedInput-root": { backgroundColor: "white" },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--color-primary)",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
};

export const driverDisplayName = (driver: TransportDriver) =>
    [driver.firstname, driver.lastname].filter(Boolean).join(" ") || `Driver #${driver.id}`;

// Filters map to the list API's query params: driver -> ?driver_id=, status -> ?active=true.
export function VehicleFilterDialog({ open, onOpenChange, drivers, value, onApply }: VehicleFilterDialogProps) {
    // Edits stay in a draft until Apply, so closing the dialog discards them.
    const [draft, setDraft] = useState<VehicleFilterValues>(value);

    useEffect(() => {
        if (open) setDraft(value);
    }, [open, value]);

    const apply = (next: VehicleFilterValues) => {
        onApply(next);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onClose={() => onOpenChange(false)} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 600, pr: 6 }}>
                Filter Vehicles
                <IconButton
                    aria-label="Close"
                    onClick={() => onOpenChange(false)}
                    sx={{ position: "absolute", right: 12, top: 12 }}
                >
                    <X className="w-4 h-4" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <div className="grid grid-cols-1 gap-4 pt-1">
                    <TextField
                        select
                        label="Driver"
                        value={draft.driverId}
                        onChange={(e) => setDraft((d) => ({ ...d, driverId: e.target.value }))}
                        fullWidth
                        size="small"
                        slotProps={{ inputLabel: { shrink: true }, select: { displayEmpty: true } }}
                        sx={fieldSx}
                    >
                        <MenuItem value="">All drivers</MenuItem>
                        {drivers.map((driver) => (
                            <MenuItem key={driver.id} value={String(driver.id)}>
                                {driverDisplayName(driver)}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Status"
                        value={draft.activeOnly ? "active" : "all"}
                        onChange={(e) => setDraft((d) => ({ ...d, activeOnly: e.target.value === "active" }))}
                        fullWidth
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={fieldSx}
                    >
                        <MenuItem value="all">All statuses</MenuItem>
                        <MenuItem value="active">Active only</MenuItem>
                    </TextField>
                </div>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button type="button" variant="outline" onClick={() => apply(EMPTY_VEHICLE_FILTERS)}>
                    Reset
                </Button>
                <Button
                    type="button"
                    className="!bg-brand hover:!bg-brand-hover !text-white"
                    onClick={() => apply(draft)}
                >
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    );
}
