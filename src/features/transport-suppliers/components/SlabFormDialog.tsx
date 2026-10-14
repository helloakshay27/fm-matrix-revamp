import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    MenuItem,
    Switch,
    TextField,
    type TextFieldProps,
} from "@mui/material";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCreateSupplierSlabMutation } from "../hooks/useCreateSupplierSlabMutation";
import { useUpdateSupplierSlabMutation } from "../hooks/useUpdateSupplierSlabMutation";
import {
    toCreateSlabPayload,
    toSlabFormValues,
    toUpdateSlabPayload,
    transportSlabDefaultValues,
    transportSlabSchema,
    type TransportSlabFormData,
} from "../schemas/transportSlabSchema";
import { SLAB_RATE_BASIS_OPTIONS } from "../const/transportSupplierConstants";
import type { TransportSlab } from "../types/transportSlab";
import { getApiErrorMessage } from "../utils/apiErrorMessage";

interface SlabFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplierId: number;
    // When set, the dialog edits this slab; otherwise it creates one.
    slab?: TransportSlab | null;
}

type TextFieldName = Exclude<keyof TransportSlabFormData, "available_24_7">;

const fieldSx = {
    "& .MuiOutlinedInput-root": { backgroundColor: "white" },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--color-primary)",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
};

const switchSx = {
    "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--color-primary)" },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
        backgroundColor: "var(--color-primary)",
    },
};

// Decimal fields: keep digits and a single dot. Integer fields: digits only.
const sanitizeDecimal = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "");
    const [whole, ...rest] = cleaned.split(".");
    return rest.length ? `${whole}.${rest.join("")}` : whole;
};
const sanitizeInteger = (value: string) => value.replace(/\D/g, "");

interface SlabTextFieldProps extends Omit<TextFieldProps, "name"> {
    name: TextFieldName;
    control: Control<TransportSlabFormData>;
    sanitize?: (value: string) => string;
}

function SlabTextField({ name, control, sanitize, disabled, slotProps, ...props }: SlabTextFieldProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...props}
                    {...field}
                    onChange={(e) => field.onChange(sanitize ? sanitize(e.target.value) : e.target.value)}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    disabled={disabled}
                    fullWidth
                    size="small"
                    slotProps={{ ...slotProps, inputLabel: { shrink: true } }}
                    sx={fieldSx}
                />
            )}
        />
    );
}

export function SlabFormDialog({ open, onOpenChange, supplierId, slab = null }: SlabFormDialogProps) {
    const isEdit = slab !== null;

    const createSlab = useCreateSupplierSlabMutation();
    const updateSlab = useUpdateSupplierSlabMutation();
    const isSubmitting = createSlab.isPending || updateSlab.isPending;

    // Keep an existing slab's basis selectable even if it isn't in the
    // known options yet, so the select doesn't render blank.
    const rateBasisOptions = useMemo(() => {
        const basis = slab?.rate_basis;
        return basis && !SLAB_RATE_BASIS_OPTIONS.some((option) => option.value === basis)
            ? [...SLAB_RATE_BASIS_OPTIONS, { value: basis, label: basis }]
            : SLAB_RATE_BASIS_OPTIONS;
    }, [slab]);

    const { control, handleSubmit, reset } = useForm<TransportSlabFormData>({
        resolver: zodResolver(transportSlabSchema),
        defaultValues: transportSlabDefaultValues,
    });

    const available247 = useWatch({ control, name: "available_24_7" });
    const effectiveFrom = useWatch({ control, name: "effective_from" });

    // Reset on every open: blank for create, the slab's values for edit.
    useEffect(() => {
        if (open) reset(slab ? toSlabFormValues(slab) : transportSlabDefaultValues);
    }, [open, slab, reset]);

    const handleClose = () => {
        if (!isSubmitting) onOpenChange(false);
    };

    const onSubmit = async (values: TransportSlabFormData) => {
        try {
            if (slab) {
                await updateSlab.mutateAsync({
                    supplierId,
                    slabId: slab.id,
                    payload: toUpdateSlabPayload(values),
                });
                toast.success("Slab updated successfully");
            } else {
                await createSlab.mutateAsync({ supplierId, payload: toCreateSlabPayload(values) });
                toast.success("Slab created successfully");
            }
            onOpenChange(false);
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, isEdit ? "Failed to update slab" : "Failed to create slab"));
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 600, pr: 6 }}>
                {isEdit ? "Edit Slab" : "Create Slab"}
                <IconButton
                    aria-label="Close"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    sx={{ position: "absolute", right: 12, top: 12 }}
                >
                    <X className="w-4 h-4" />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent dividers>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <SlabTextField
                            name="rate_basis"
                            control={control}
                            label="Rate Basis"
                            required
                            select
                            disabled={isSubmitting}
                        >
                            {rateBasisOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </SlabTextField>

                        <SlabTextField
                            name="rate_amount"
                            control={control}
                            label="Rate Amount (₹)"
                            placeholder="e.g. 12.5"
                            required
                            sanitize={sanitizeDecimal}
                            disabled={isSubmitting}
                            slotProps={{ htmlInput: { inputMode: "decimal" } }}
                        />

                        <SlabTextField
                            name="max_rides_per_day"
                            control={control}
                            label="Max Rides / Day"
                            placeholder="e.g. 40"
                            sanitize={sanitizeInteger}
                            disabled={isSubmitting}
                            slotProps={{ htmlInput: { inputMode: "numeric" } }}
                        />

                        <SlabTextField
                            name="max_km_per_day"
                            control={control}
                            label="Max KM / Day"
                            placeholder="e.g. 800"
                            sanitize={sanitizeDecimal}
                            disabled={isSubmitting}
                            slotProps={{ htmlInput: { inputMode: "decimal" } }}
                        />

                        <SlabTextField
                            name="effective_from"
                            control={control}
                            label="Effective From"
                            type="date"
                            required
                            disabled={isSubmitting}
                        />

                        <SlabTextField
                            name="effective_to"
                            control={control}
                            label="Effective To"
                            type="date"
                            disabled={isSubmitting}
                            slotProps={{ htmlInput: { min: effectiveFrom || undefined } }}
                        />

                        <Controller
                            name="available_24_7"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    className="sm:col-span-2"
                                    control={
                                        <Switch
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                            disabled={isSubmitting}
                                            sx={switchSx}
                                        />
                                    }
                                    label="Available 24/7"
                                />
                            )}
                        />

                        {!available247 && (
                            <>
                                <SlabTextField
                                    name="start_time"
                                    control={control}
                                    label="Available From"
                                    type="time"
                                    required
                                    disabled={isSubmitting}
                                />
                                <SlabTextField
                                    name="end_time"
                                    control={control}
                                    label="Available Until"
                                    type="time"
                                    required
                                    disabled={isSubmitting}
                                />
                            </>
                        )}
                    </div>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="!bg-brand hover:!bg-brand-hover !text-white"
                    >
                        {isEdit ? (isSubmitting ? "Saving..." : "Save") : isSubmitting ? "Creating..." : "Create"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
