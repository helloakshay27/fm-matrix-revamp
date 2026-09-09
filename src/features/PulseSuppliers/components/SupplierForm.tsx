import { useState } from "react";
import { ArrowLeft, Building2, Send } from "lucide-react";
import { TextField } from "@mui/material";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { SupplierFormFields } from "../types/supplier";

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
};

const singleLineFieldStyles = {
    ...fieldStyles,
    height: "45px",
    "& .MuiOutlinedInput-root": {
        ...fieldStyles["& .MuiOutlinedInput-root"],
        height: "45px",
    },
};

const Required = () => <span className="text-brand-error">*</span>;

interface SupplierFormState {
    first_name: string;
    last_name: string;
    email: string;
    company_name: string;
    mobile1: string;
    mobile2: string;
    gstin_number: string;
    pan_number: string;
    category: string;
    address: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    pincode: string;
}

function buildInitialState(initialValues?: Partial<SupplierFormFields>): SupplierFormState {
    return {
        first_name: initialValues?.first_name ?? "",
        last_name: initialValues?.last_name ?? "",
        email: initialValues?.email ?? "",
        company_name: initialValues?.company_name ?? "",
        mobile1: initialValues?.mobile1 ?? "",
        mobile2: initialValues?.mobile2 ?? "",
        gstin_number: initialValues?.gstin_number ?? "",
        pan_number: initialValues?.pan_number ?? "",
        category: initialValues?.category ?? "",
        address: initialValues?.address ?? "",
        address2: initialValues?.address2 ?? "",
        country: initialValues?.country ?? "",
        state: initialValues?.state ?? "",
        city: initialValues?.city ?? "",
        pincode: initialValues?.pincode ?? "",
    };
}

export interface SupplierFormProps {
    headerTitle: string;
    headerSubtitle: string;
    submitLabel: string;
    submittingLabel: string;
    isSubmitting: boolean;
    initialValues?: Partial<SupplierFormFields>;
    onSubmit: (payload: SupplierFormFields) => void | Promise<void>;
    onCancel: () => void;
}

export function SupplierForm({
    headerTitle,
    headerSubtitle,
    submitLabel,
    submittingLabel,
    isSubmitting,
    initialValues,
    onSubmit,
    onCancel,
}: SupplierFormProps) {
    const [form, setForm] = useState<SupplierFormState>(() => buildInitialState(initialValues));

    const setField = (field: keyof SupplierFormState) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async () => {
        if (
            !form.first_name.trim() ||
            !form.last_name.trim() ||
            !form.email.trim() ||
            !form.company_name.trim() ||
            !form.mobile1.trim() ||
            !form.category.trim()
        ) {
            toast.error(
                "First name, last name, email, company name, mobile, and category are required"
            );
            return;
        }

        const payload: SupplierFormFields = {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            email: form.email.trim(),
            company_name: form.company_name.trim(),
            mobile1: form.mobile1.trim(),
            ...(form.mobile2.trim() ? { mobile2: form.mobile2.trim() } : {}),
            ...(form.gstin_number.trim() ? { gstin_number: form.gstin_number.trim() } : {}),
            ...(form.pan_number.trim() ? { pan_number: form.pan_number.trim() } : {}),
            ...(form.address.trim() ? { address: form.address.trim() } : {}),
            ...(form.address2.trim() ? { address2: form.address2.trim() } : {}),
            ...(form.country.trim() ? { country: form.country.trim() } : {}),
            ...(form.state.trim() ? { state: form.state.trim() } : {}),
            ...(form.city.trim() ? { city: form.city.trim() } : {}),
            ...(form.pincode.trim() ? { pincode: form.pincode.trim() } : {}),
            category: form.category.trim(),
        };

        await onSubmit(payload);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-6">
            <div className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{headerTitle}</h1>
                        <p className="text-sm text-gray-500">{headerSubtitle}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full mx-auto px-6 pb-6 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-brand-bg p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-brand" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Supplier Details</h2>
                                <p className="text-xs text-gray-500">Basic and contact information</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                label={<>First Name <Required /></>}
                                placeholder="Enter First Name"
                                value={form.first_name}
                                onChange={setField("first_name")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label={<>Last Name <Required /></>}
                                placeholder="Enter Last Name"
                                value={form.last_name}
                                onChange={setField("last_name")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label={<>Company Name <Required /></>}
                                placeholder="Enter Company Name"
                                value={form.company_name}
                                onChange={setField("company_name")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label={<>Email <Required /></>}
                                placeholder="Enter Email"
                                value={form.email}
                                onChange={setField("email")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label={<>Mobile 1 <Required /></>}
                                placeholder="Enter Mobile Number"
                                value={form.mobile1}
                                onChange={setField("mobile1")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label="Mobile 2"
                                placeholder="Enter Alternate Mobile Number"
                                value={form.mobile2}
                                onChange={setField("mobile2")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label="GSTIN Number"
                                placeholder="Enter GSTIN Number"
                                value={form.gstin_number}
                                onChange={setField("gstin_number")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label="PAN Number"
                                placeholder="Enter PAN Number"
                                value={form.pan_number}
                                onChange={setField("pan_number")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label={<>Category <Required /></>}
                                placeholder="Enter Category"
                                value={form.category}
                                onChange={setField("category")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-brand-bg p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-brand" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Address</h2>
                                <p className="text-xs text-gray-500">Location details</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                label="Address"
                                placeholder="Enter Address"
                                value={form.address}
                                onChange={setField("address")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label="Address 2"
                                placeholder="Enter Address Line 2"
                                value={form.address2}
                                onChange={setField("address2")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label="Country"
                                placeholder="Enter Country"
                                value={form.country}
                                onChange={setField("country")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label="State"
                                placeholder="Enter State"
                                value={form.state}
                                onChange={setField("state")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label="City"
                                placeholder="Enter City"
                                value={form.city}
                                onChange={setField("city")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                            <TextField
                                label="Pincode"
                                placeholder="Enter Pincode"
                                value={form.pincode}
                                onChange={setField("pincode")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={singleLineFieldStyles}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-end gap-3 px-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="w-full sm:w-40 h-11 !border-brand !text-brand hover:!bg-brand-selected hover:!text-brand"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-40 h-11 !bg-brand hover:!bg-brand-hover !text-white disabled:!opacity-100 disabled:!bg-brand gap-2"
                >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? submittingLabel : submitLabel}
                </Button>
            </div>
        </div>
    );
}
