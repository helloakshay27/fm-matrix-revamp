import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
} from "@mui/material";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCreateTransportSupplierMutation } from "../hooks/useCreateTransportSupplierMutation";
import { useUpdateTransportSupplierMutation } from "../hooks/useUpdateTransportSupplierMutation";
import { useTransportSupplierDetailQuery } from "../hooks/useTransportSupplierDetailQuery";
import {
    transportSupplierDefaultValues,
    transportSupplierSchema,
    type TransportSupplierFormData,
} from "../schemas/transportSupplierSchema";
import type { TransportSupplierDetail } from "../types/transportSupplier";
import { getApiErrorMessage } from "../utils/apiErrorMessage";

interface TransportSupplierFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // When set, the dialog edits this supplier; otherwise it creates one.
    supplierId?: number | null;
}

interface FieldConfig {
    name: keyof TransportSupplierFormData;
    label: string;
    placeholder: string;
    required?: boolean;
    type?: string;
    numeric?: boolean;
    maxLength?: number;
    fullRow?: boolean;
    multiline?: boolean;
}

const fields: FieldConfig[] = [
    { name: "company_name", label: "Company Name", placeholder: "Enter company name", required: true, fullRow: true },
    { name: "email", label: "Email", placeholder: "Enter email", type: "email" },
    { name: "mobile1", label: "Mobile", placeholder: "Enter 10-digit mobile", numeric: true, maxLength: 10 },
    { name: "address", label: "Address", placeholder: "Enter address", fullRow: true, multiline: true },
    { name: "city", label: "City", placeholder: "Enter city" },
    { name: "state", label: "State", placeholder: "Enter state" },
    { name: "pincode", label: "Pincode", placeholder: "Enter 6-digit pincode", numeric: true, maxLength: 6 },
];

const fieldSx = {
    "& .MuiOutlinedInput-root": { backgroundColor: "white" },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--color-primary)",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
};

const toFormValues = (supplier: TransportSupplierDetail): TransportSupplierFormData => ({
    company_name: supplier.company_name ?? "",
    email: supplier.email ?? "",
    mobile1: supplier.mobile1 ?? "",
    address: supplier.address ?? "",
    city: supplier.city ?? "",
    state: supplier.state ?? "",
    pincode: supplier.pincode ?? "",
});

export function TransportSupplierFormDialog({
    open,
    onOpenChange,
    supplierId = null,
}: TransportSupplierFormDialogProps) {
    const isEdit = supplierId !== null;

    // The list row doesn't carry address/city/state/pincode, so edit always
    // loads the full record first.
    const detailQuery = useTransportSupplierDetailQuery(open && isEdit ? supplierId : null);
    const supplier = detailQuery.data;

    const createSupplier = useCreateTransportSupplierMutation();
    const updateSupplier = useUpdateTransportSupplierMutation();
    const isSubmitting = createSupplier.isPending || updateSupplier.isPending;
    const isLoadingSupplier = isEdit && detailQuery.isLoading;
    const loadFailed = isEdit && detailQuery.isError;

    const { control, handleSubmit, reset } = useForm<TransportSupplierFormData>({
        resolver: zodResolver(transportSupplierSchema),
        defaultValues: transportSupplierDefaultValues,
    });

    // Reset on every open: blank for create, the loaded supplier for edit.
    useEffect(() => {
        if (!open) return;
        if (!isEdit) {
            reset(transportSupplierDefaultValues);
        } else if (supplier) {
            reset(toFormValues(supplier));
        }
    }, [open, isEdit, supplier, reset]);

    const handleClose = () => {
        if (!isSubmitting) onOpenChange(false);
    };

    const onSubmit = async (values: TransportSupplierFormData) => {
        try {
            if (isEdit) {
                await updateSupplier.mutateAsync({ id: supplierId, payload: values });
                toast.success("Supplier updated successfully");
            } else {
                await createSupplier.mutateAsync(values);
                toast.success("Supplier created successfully");
            }
            onOpenChange(false);
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(error, isEdit ? "Failed to update supplier" : "Failed to create supplier")
            );
        }
    };

    const fieldsDisabled = isSubmitting || isLoadingSupplier || loadFailed;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 600, pr: 6 }}>
                {isEdit ? "Edit Supplier" : "Create Supplier"}
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
                    {loadFailed ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-brand-error">Failed to load supplier.</p>
                            <p className="mt-1 text-xs text-gray-500">
                                {getApiErrorMessage(detailQuery.error, "Unable to reach the server.")}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => detailQuery.refetch()}
                            >
                                Try again
                            </Button>
                        </div>
                    ) : isLoadingSupplier ? (
                        <p className="py-8 text-center text-sm text-gray-500">Loading supplier...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            {fields.map((field) => (
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
                                                        : e.target.value
                                                )
                                            }
                                            label={field.label}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            type={field.type ?? "text"}
                                            multiline={field.multiline}
                                            minRows={field.multiline ? 2 : undefined}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            disabled={fieldsDisabled}
                                            fullWidth
                                            size="small"
                                            slotProps={{
                                                inputLabel: { shrink: true },
                                                htmlInput: {
                                                    maxLength: field.maxLength,
                                                    inputMode: field.numeric ? "numeric" : undefined,
                                                },
                                            }}
                                            sx={fieldSx}
                                            className={field.fullRow ? "sm:col-span-2" : undefined}
                                        />
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={fieldsDisabled}
                        className="!bg-brand hover:!bg-brand-hover !text-white"
                    >
                        {isEdit
                            ? isSubmitting
                                ? "Saving..."
                                : "Save"
                            : isSubmitting
                              ? "Creating..."
                              : "Create"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
