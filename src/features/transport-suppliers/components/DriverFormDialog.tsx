import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "../utils/zodResolver";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCreateSupplierDriverMutation } from "../hooks/useCreateSupplierDriverMutation";
import { useUpdateSupplierDriverMutation } from "../hooks/useUpdateSupplierDriverMutation";
import {
    transportDriverDefaultValues,
    transportDriverSchema,
    type TransportDriverFormData,
} from "../schemas/transportDriverSchema";
import type { TransportDriver, UpdateTransportDriverPayload } from "../types/transportDriver";
import { getApiErrorMessage } from "../utils/apiErrorMessage";

interface DriverFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplierId: number;
    // When set, the dialog edits this driver; otherwise it adds one.
    driver?: TransportDriver | null;
}

interface FieldConfig {
    name: keyof TransportDriverFormData;
    label: string;
    placeholder: string;
    required?: boolean;
    type?: string;
    numeric?: boolean;
    lettersOnly?: boolean;
    maxLength?: number;
    editOnly?: boolean;
}

const fields: FieldConfig[] = [
    { name: "firstname", label: "First Name", placeholder: "Enter first name", required: true, lettersOnly: true },
    { name: "lastname", label: "Last Name", placeholder: "Enter last name", lettersOnly: true },
    { name: "email", label: "Email", placeholder: "Enter email", required: true, type: "email" },
    { name: "mobile", label: "Mobile", placeholder: "Enter 10-digit mobile", numeric: true, maxLength: 10 },
    { name: "latitude", label: "Latitude", placeholder: "e.g. 18.5308", editOnly: true },
    { name: "longitude", label: "Longitude", placeholder: "e.g. 73.8475", editOnly: true },
];

const fieldSx = {
    "& .MuiOutlinedInput-root": { backgroundColor: "white" },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--color-primary)",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
};

// The API sends 0/0 for "no location" — show that as blank, not 0.
const toFormValues = (driver: TransportDriver): TransportDriverFormData => {
    const hasLocation =
        driver.latitude != null &&
        driver.longitude != null &&
        !(driver.latitude === 0 && driver.longitude === 0);
    return {
        firstname: driver.firstname ?? "",
        lastname: driver.lastname ?? "",
        email: driver.email ?? "",
        mobile: driver.mobile ?? "",
        latitude: hasLocation ? String(driver.latitude) : "",
        longitude: hasLocation ? String(driver.longitude) : "",
    };
};

export function DriverFormDialog({ open, onOpenChange, supplierId, driver = null }: DriverFormDialogProps) {
    const isEdit = driver !== null;

    const createDriver = useCreateSupplierDriverMutation();
    const updateDriver = useUpdateSupplierDriverMutation();
    const isSubmitting = createDriver.isPending || updateDriver.isPending;

    const { control, handleSubmit, reset } = useForm<TransportDriverFormData>({
        resolver: zodResolver(transportDriverSchema),
        defaultValues: transportDriverDefaultValues,
    });

    // Reset on every open: blank for add, the driver's values for edit.
    useEffect(() => {
        if (open) reset(driver ? toFormValues(driver) : transportDriverDefaultValues);
    }, [open, driver, reset]);

    const handleClose = () => {
        if (!isSubmitting) onOpenChange(false);
    };

    const onSubmit = async ({ latitude, longitude, ...values }: TransportDriverFormData) => {
        try {
            if (driver) {
                const payload: UpdateTransportDriverPayload = {
                    ...values,
                    ...(latitude && longitude ? { latitude, longitude } : {}),
                };
                await updateDriver.mutateAsync({ supplierId, driverId: driver.id, payload });
                toast.success("Driver updated successfully");
            } else {
                await createDriver.mutateAsync({ supplierId, payload: values });
                toast.success("Driver added successfully");
            }
            onOpenChange(false);
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, isEdit ? "Failed to update driver" : "Failed to add driver"));
        }
    };

    const visibleFields = fields.filter((field) => isEdit || !field.editOnly);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 600, pr: 6 }}>
                {isEdit ? "Edit Driver" : "Add Driver"}
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
                        {visibleFields.map((field) => (
                            <Controller
                                key={field.name}
                                name={field.name}
                                control={control}
                                render={({ field: input, fieldState }) => (
                                    <TextField
                                        {...input}
                                        onChange={(e) =>
                                            input.onChange(
                                                field.numeric
                                                    ? e.target.value.replace(/\D/g, "")
                                                    : field.lettersOnly
                                                      ? e.target.value.replace(/[^A-Za-z\s]/g, "")
                                                      : e.target.value
                                            )
                                        }
                                        label={field.label}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        type={field.type ?? "text"}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="small"
                                        slotProps={{
                                            inputLabel: { shrink: true },
                                            htmlInput: {
                                                maxLength: field.maxLength,
                                                inputMode: field.numeric
                                                    ? "numeric"
                                                    : field.editOnly
                                                      ? "decimal"
                                                      : undefined,
                                            },
                                        }}
                                        sx={fieldSx}
                                    />
                                )}
                            />
                        ))}
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
                        {isEdit ? (isSubmitting ? "Saving..." : "Save") : isSubmitting ? "Adding..." : "Add"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
