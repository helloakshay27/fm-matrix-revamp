import { useState } from "react";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import { TextField } from "@mui/material";
import { toast } from "sonner";
import { FormSection, FormActionBar, assetFieldStyles } from "@/components/common/FormSection";
import type { SupplierFormFields } from "../types/supplier";

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
    /** Breadcrumb current item, e.g. "Create New Supplier" */
    currentLabel: string;
    /** Page heading, e.g. "NEW SUPPLIER" */
    headerTitle: string;
    submitLabel: string;
    isSubmitting: boolean;
    initialValues?: Partial<SupplierFormFields>;
    onSubmit: (payload: SupplierFormFields) => void | Promise<void>;
    onCancel: () => void;
}

export function SupplierForm({
    currentLabel,
    headerTitle,
    submitLabel,
    isSubmitting,
    initialValues,
    onSubmit,
    onCancel,
}: SupplierFormProps) {
    const [form, setForm] = useState<SupplierFormState>(() => buildInitialState(initialValues));

    const setField = (field: keyof SupplierFormState) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const setMobileField = (field: "mobile1" | "mobile2") => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
        setForm((prev) => ({ ...prev, [field]: digitsOnly }));
    };

    const MOBILE_PATTERN = /^\d{10}$/;
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async () => {
        if (
            !form.first_name.trim() ||
            !form.last_name.trim() ||
            !form.email.trim() ||
            !form.company_name.trim() ||
            !form.mobile1.trim()
        ) {
            toast.error(
                "First name, last name, email, company name, and mobile are required"
            );
            return;
        }

        if (!EMAIL_PATTERN.test(form.email.trim())) {
            toast.error("Enter a valid email address");
            return;
        }

        if (!MOBILE_PATTERN.test(form.mobile1.trim())) {
            toast.error("Mobile 1 must be a 10 digit number");
            return;
        }

        if (form.mobile2.trim() && !MOBILE_PATTERN.test(form.mobile2.trim())) {
            toast.error("Mobile 2 must be a 10 digit number");
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
            ...(form.category.trim() ? { category: form.category.trim() } : {}),
        };

        await onSubmit(payload);
    };

    return (
        <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span>Supplier List</span>
                <span>{">"}</span>
                <span className="text-gray-900 font-medium">{currentLabel}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{headerTitle}</h1>
            </div>

            <div className="space-y-4 sm:space-y-6">
                <FormSection title="SUPPLIER DETAILS" icon={Building2}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                label={<>First Name <Required /></>}
                                placeholder="Enter First Name"
                                value={form.first_name}
                                onChange={setField("first_name")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label={<>Last Name <Required /></>}
                                placeholder="Enter Last Name"
                                value={form.last_name}
                                onChange={setField("last_name")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label={<>Company Name <Required /></>}
                                placeholder="Enter Company Name"
                                value={form.company_name}
                                onChange={setField("company_name")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label={<>Email <Required /></>}
                                placeholder="Enter Email"
                                value={form.email}
                                onChange={setField("email")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label={<>Mobile 1 <Required /></>}
                                placeholder="Enter Mobile Number"
                                value={form.mobile1}
                                onChange={setMobileField("mobile1")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ inputMode: "numeric", maxLength: 10 }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="Mobile 2"
                                placeholder="Enter Alternate Mobile Number"
                                value={form.mobile2}
                                onChange={setMobileField("mobile2")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ inputMode: "numeric", maxLength: 10 }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="GSTIN Number"
                                placeholder="Enter GSTIN Number"
                                value={form.gstin_number}
                                onChange={setField("gstin_number")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="PAN Number"
                                placeholder="Enter PAN Number"
                                value={form.pan_number}
                                onChange={setField("pan_number")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="Category"
                                placeholder="Enter Category"
                                value={form.category}
                                onChange={setField("category")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                        </div>
                </FormSection>

                <FormSection title="ADDRESS" icon={MapPin}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                label="Address"
                                placeholder="Enter Address"
                                value={form.address}
                                onChange={setField("address")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="Address 2"
                                placeholder="Enter Address Line 2"
                                value={form.address2}
                                onChange={setField("address2")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="Country"
                                placeholder="Enter Country"
                                value={form.country}
                                onChange={setField("country")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="State"
                                placeholder="Enter State"
                                value={form.state}
                                onChange={setField("state")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="City"
                                placeholder="Enter City"
                                value={form.city}
                                onChange={setField("city")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                            <TextField
                                label="Pincode"
                                placeholder="Enter Pincode"
                                value={form.pincode}
                                onChange={setField("pincode")}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ sx: assetFieldStyles }}
                            />
                        </div>
                </FormSection>

                <FormActionBar
                    onCancel={onCancel}
                    onSubmit={handleSubmit}
                    submitLabel={submitLabel}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
