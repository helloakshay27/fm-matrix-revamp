import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    TextField,
} from "@mui/material";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { checkSupplierVehicle } from "../api/transportVehiclesApi";
import { useCreateSupplierVehicleMutation } from "../hooks/useCreateSupplierVehicleMutation";
import { useUpdateSupplierVehicleMutation } from "../hooks/useUpdateSupplierVehicleMutation";
import { useSupplierVehicleDetailQuery } from "../hooks/useSupplierVehicleDetailQuery";
import { useSupplierDriversQuery } from "../hooks/useSupplierDriversQuery";
import { VEHICLE_FUEL_TYPE_OPTIONS } from "../const/transportSupplierConstants";
import {
    transportVehicleDefaultValues,
    transportVehicleSchema,
    type TransportVehicleFormData,
} from "../schemas/transportVehicleSchema";
import type { TransportVehicle } from "../types/transportVehicle";
import { getApiErrorMessage } from "../utils/apiErrorMessage";

interface VehicleFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplierId: number;
    // When set, the dialog edits this vehicle; otherwise it adds one.
    vehicle?: TransportVehicle | null;
}

const fieldSx = {
    "& .MuiOutlinedInput-root": { backgroundColor: "white" },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--color-primary)",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-primary)" },
};

const MAX_ATTACHMENT_MB = 5;

const toFormValues = (vehicle: TransportVehicle): TransportVehicleFormData => ({
    driver_id: vehicle.driver_id != null ? String(vehicle.driver_id) : "",
    car_model_name: vehicle.car_model_name ?? "",
    registration_number: vehicle.registration_number ?? "",
    colour: vehicle.colour ?? "",
    seats: vehicle.seats != null ? String(vehicle.seats) : "",
    fuel_type: vehicle.fuel_type ?? "",
});

// The /check response shape isn't documented yet — treat the common "taken" flags
// as a duplicate and anything else as available.
const isDuplicateRegistration = (body: Record<string, unknown>) =>
    body.exists === true || body.present === true || body.available === false || body.unique === false;

const normaliseRegistration = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

export function VehicleFormDialog({ open, onOpenChange, supplierId, vehicle = null }: VehicleFormDialogProps) {
    const isEdit = vehicle !== null;

    const createVehicle = useCreateSupplierVehicleMutation();
    const updateVehicle = useUpdateSupplierVehicleMutation();
    const [isChecking, setIsChecking] = useState(false);
    const isSubmitting = createVehicle.isPending || updateVehicle.isPending || isChecking;

    const { data: drivers = [] } = useSupplierDriversQuery(supplierId);
    // Edit loads the full record (GET .../vehicles/:id) so the form isn't built from a
    // possibly trimmed list row; the row is used until it arrives.
    const detailQuery = useSupplierVehicleDetailQuery(supplierId, open && vehicle ? vehicle.id : null);
    const editing = detailQuery.data ?? vehicle;

    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { control, handleSubmit, reset, setError, getValues } = useForm<TransportVehicleFormData>({
        resolver: zodResolver(transportVehicleSchema),
        defaultValues: transportVehicleDefaultValues,
    });

    // Reset on every open (and once the detail record lands): blank for add,
    // the vehicle's values for edit.
    useEffect(() => {
        if (!open) return;
        reset(editing ? toFormValues(editing) : transportVehicleDefaultValues);
        setAttachments([]);
    }, [open, editing, reset]);

    const handleClose = () => {
        if (!isSubmitting) onOpenChange(false);
    };

    /** True when /check says the registration number is already used. Lookup failures don't block. */
    const registrationTaken = async (registration: string) => {
        if (isEdit && registration === (editing?.registration_number ?? "")) return false;
        try {
            return isDuplicateRegistration(await checkSupplierVehicle(supplierId, registration));
        } catch {
            return false;
        }
    };

    const flagIfTaken = async () => {
        const registration = getValues("registration_number");
        if (!/^[A-Z0-9]{4,15}$/.test(registration)) return;
        if (await registrationTaken(registration)) {
            setError("registration_number", { message: "This registration number is already registered" });
        }
    };

    const addFiles = (files: FileList | null) => {
        if (!files) return;
        const accepted: File[] = [];
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} is not an image`);
            } else if (file.size > MAX_ATTACHMENT_MB * 1024 * 1024) {
                toast.error(`${file.name} is larger than ${MAX_ATTACHMENT_MB} MB`);
            } else {
                accepted.push(file);
            }
        });
        setAttachments((current) => [...current, ...accepted]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = async (values: TransportVehicleFormData) => {
        const common = {
            car_model_name: values.car_model_name,
            registration_number: values.registration_number,
            colour: values.colour,
            seats: Number(values.seats),
            fuel_type: values.fuel_type,
        };
        try {
            setIsChecking(true);
            const taken = await registrationTaken(values.registration_number);
            setIsChecking(false);
            if (taken) {
                setError("registration_number", { message: "This registration number is already registered" });
                return;
            }

            if (vehicle) {
                await updateVehicle.mutateAsync({ supplierId, vehicleId: vehicle.id, payload: common });
                toast.success("Vehicle updated successfully");
            } else {
                await createVehicle.mutateAsync({
                    supplierId,
                    payload: { driver_id: Number(values.driver_id), ...common },
                    attachments,
                });
                toast.success("Vehicle added successfully");
            }
            onOpenChange(false);
        } catch (error: unknown) {
            setIsChecking(false);
            toast.error(getApiErrorMessage(error, isEdit ? "Failed to update vehicle" : "Failed to add vehicle"));
        }
    };

    // Keep the current driver selectable on edit even if they're inactive or not in the list.
    const driverOptions = drivers
        .filter((driver) => driver.active || String(driver.id) === String(editing?.driver_id ?? ""))
        .map((driver) => ({
            value: String(driver.id),
            label: [driver.firstname, driver.lastname].filter(Boolean).join(" ") || `Driver #${driver.id}`,
        }));
    if (editing?.driver_id != null && !driverOptions.some((option) => option.value === String(editing.driver_id))) {
        const name = [editing.driver?.firstname, editing.driver?.lastname].filter(Boolean).join(" ");
        driverOptions.push({ value: String(editing.driver_id), label: name || `Driver #${editing.driver_id}` });
    }

    // Keep an unknown fuel type selectable so the select doesn't render blank.
    const fuelOptions =
        editing?.fuel_type && !VEHICLE_FUEL_TYPE_OPTIONS.some((option) => option.value === editing.fuel_type)
            ? [...VEHICLE_FUEL_TYPE_OPTIONS, { value: editing.fuel_type, label: editing.fuel_type }]
            : VEHICLE_FUEL_TYPE_OPTIONS;

    const existingAttachments = (editing?.attachments ?? [])
        .map((attachment) => attachment.url ?? attachment.document_url ?? null)
        .filter((url): url is string => !!url);

    const textField = (
        name: keyof TransportVehicleFormData,
        label: string,
        placeholder: string,
        options: { transform?: (value: string) => string; numeric?: boolean; maxLength?: number; onBlur?: () => void } = {}
    ) => (
        <Controller
            name={name}
            control={control}
            render={({ field: input, fieldState }) => (
                <TextField
                    {...input}
                    onChange={(e) => input.onChange(options.transform ? options.transform(e.target.value) : e.target.value)}
                    onBlur={() => {
                        input.onBlur();
                        options.onBlur?.();
                    }}
                    label={label}
                    placeholder={placeholder}
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    disabled={isSubmitting}
                    fullWidth
                    size="small"
                    slotProps={{
                        inputLabel: { shrink: true },
                        htmlInput: { maxLength: options.maxLength, inputMode: options.numeric ? "numeric" : undefined },
                    }}
                    sx={fieldSx}
                />
            )}
        />
    );

    const selectField = (
        name: keyof TransportVehicleFormData,
        label: string,
        options: { value: string; label: string }[],
        { disabled = false, helper }: { disabled?: boolean; helper?: string } = {}
    ) => (
        <Controller
            name={name}
            control={control}
            render={({ field: input, fieldState }) => (
                <TextField
                    {...input}
                    select
                    label={label}
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message ?? helper}
                    disabled={isSubmitting || disabled}
                    fullWidth
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={fieldSx}
                >
                    {options.length === 0 ? (
                        <MenuItem value="" disabled>
                            No options available
                        </MenuItem>
                    ) : (
                        options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))
                    )}
                </TextField>
            )}
        />
    );

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 600, pr: 6 }}>
                {isEdit ? "Edit Vehicle" : "Add Vehicle"}
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
                        {selectField("driver_id", "Driver", driverOptions, {
                            disabled: isEdit,
                            helper: isEdit ? "The driver can't be changed after the vehicle is created" : undefined,
                        })}
                        {textField("car_model_name", "Car Model", "e.g. Toyota Innova")}
                        {textField("registration_number", "Registration Number", "e.g. MH12AB1234", {
                            transform: normaliseRegistration,
                            maxLength: 15,
                            onBlur: flagIfTaken,
                        })}
                        {textField("colour", "Colour", "e.g. White")}
                        {textField("seats", "Seats", "e.g. 7", {
                            transform: (value) => value.replace(/\D/g, ""),
                            numeric: true,
                            maxLength: 2,
                        })}
                        {selectField("fuel_type", "Fuel Type", fuelOptions)}
                    </div>

                    {isEdit ? (
                        existingAttachments.length > 0 && (
                            <div className="mt-5">
                                <p className="text-sm font-medium text-gray-700">Images</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {existingAttachments.map((url) => (
                                        <a key={url} href={url} target="_blank" rel="noreferrer">
                                            <img
                                                src={url}
                                                alt="Vehicle"
                                                className="h-16 w-16 rounded-md border border-gray-200 object-cover"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="mt-5">
                            <p className="text-sm font-medium text-gray-700">Images</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => addFiles(e.target.files)}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                disabled={isSubmitting}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImagePlus className="w-4 h-4 mr-2" /> Add images
                            </Button>
                            <p className="mt-1 text-xs text-gray-500">Images only, up to {MAX_ATTACHMENT_MB} MB each.</p>
                            {attachments.length > 0 && (
                                <ul className="mt-3 space-y-1">
                                    {attachments.map((file, index) => (
                                        <li
                                            key={`${file.name}-${index}`}
                                            className="flex items-center justify-between gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm"
                                        >
                                            <span className="truncate">{file.name}</span>
                                            <button
                                                type="button"
                                                aria-label={`Remove ${file.name}`}
                                                disabled={isSubmitting}
                                                onClick={() =>
                                                    setAttachments((current) => current.filter((_, i) => i !== index))
                                                }
                                                className="text-gray-500 hover:text-gray-900"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
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
