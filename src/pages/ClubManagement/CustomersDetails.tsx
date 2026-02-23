import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Phone, MapPin } from "lucide-react";
import { TextField, FormControl, InputLabel, Select, MenuItem, ThemeProvider, createTheme } from "@mui/material";
import { toast } from "sonner";
import axios from "axios";

// Custom theme for MUI components
const muiTheme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: "16px",
                },
            },
            defaultProps: {
                shrink: true,
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        height: "36px",
                        "@media (min-width: 768px)": {
                            height: "45px",
                        },
                    },
                    "& .MuiOutlinedInput-input": {
                        padding: "8px 14px",
                        "@media (min-width: 768px)": {
                            padding: "12px 14px",
                        },
                    },
                },
            },
            defaultProps: {
                InputLabelProps: {
                    shrink: true,
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        height: "36px",
                        "@media (min-width: 768px)": {
                            height: "45px",
                        },
                    },
                    "& .MuiSelect-select": {
                        padding: "8px 14px",
                        "@media (min-width: 768px)": {
                            padding: "12px 14px",
                        },
                    },
                },
            },
        },
    },
});

interface ContactPerson {
    id?: number;
    salutation: string;
    first_name: string;
    last_name: string;
    email: string;
    work_phone: string;
    mobile: string;
}

interface Address {
    id?: number;
    attention: string;
    address: string;
    address_line_two: string;
    address_line_three: string;
    country: string;
    state: string;
    city: string;
    pin_code: string;
    telephone_number: string;
    fax_number: string;
    mobile: string;
    contact_person: string;
}

interface CustomerData {
    id: number;
    lock_account_id: number;
    customer_type: string;
    salutation?: string;
    first_name: string;
    last_name: string;
    company_name: string;
    name: string;
    email: string;
    mobile: string;
    work_phone: string;
    pan: string;
    language_code: string;
    currency_code: string;
    opening_balance: number;
    enable_portal: boolean;
    remarks: string;
    payment_term_id?: number;
    created_at: string;
    updated_at: string;
    billing_address?: Address;
    shipping_address?: Address;
    contact_persons?: ContactPerson[];
}

export const CustomersDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [customerData, setCustomerData] = useState<CustomerData | null>(null);

    const fetchCustomerDetails = async () => {
        setLoading(true);
        try {
                // Use provided API endpoint
                const apiUrl = `https://${baseUrl}/lock_account_customers/${id}.json`;
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCustomerData(response.data);
        } catch (error) {
            console.error("Error fetching customer details:", error);
            toast.error("Failed to fetch customer details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCustomerDetails();
        }
    }, [id]);

    const handleEditClick = () => {
        navigate(`/accounting/customers/edit/${id}`);
    };

    const handleClose = () => {
        navigate("/accounting/customers");
    };

    if (loading) {
        return (
            <div className="p-6 bg-white">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
                </div>
            </div>
        );
    }

    if (!customerData) {
        return (
            <div className="p-6 bg-white">
                <Button variant="ghost" onClick={handleClose} className="p-0 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Customers
                </Button>
                <div className="text-center text-gray-500">Customer not found</div>
            </div>
        );
    }

    return (
        <ThemeProvider theme={muiTheme}>
            <div className="p-6 bg-white">
                <div className="mb-6">
                    <div className="flex items-end justify-between gap-2">
                        <Button variant="ghost" onClick={handleClose} className="p-0">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Customers
                        </Button>
                        <div className="flex items-center gap-2">
                            {/* <Button
                                variant="outline"
                                onClick={handleEditClick}
                                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                            >
                                Edit
                            </Button> */}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Customer Overview Section */}
                    <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                                    Customer Details
                                </h3>
                                {/* <p className="text-sm text-gray-500">
                                    {customerData.name || customerData.company_name}
                                </p> */}
                            </div>
                        </div>

                        {/* Customer Basic Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* Customer Type */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Customer Type</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium capitalize">
                                        {customerData.customer_type || "-"}
                                    </span>
                                </div>

                                {/* Company Name */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Company Name</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">
                                        {customerData.company_name || "-"}
                                    </span>
                                </div>

                                {/* Display Name */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Display Name</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">
                                        {customerData.name || "-"}
                                    </span>
                                </div>

                                {/* First Name */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">First Name</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">
                                        {customerData.first_name || "-"}
                                    </span>
                                </div>

                                {/* Last Name */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Last Name</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">
                                        {customerData.last_name || "-"}
                                    </span>
                                </div>

                                {/* PAN */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">PAN</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">
                                        {customerData.pan || "-"}
                                    </span>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {/* Email */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Email</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-blue-600 font-medium">
                                        <a href={`mailto:${customerData.email}`}>
                                            {customerData.email || "-"}
                                        </a>
                                    </span>
                                </div>

                                {/* Work Phone */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Work Phone</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">
                                        {customerData.work_phone || "-"}
                                    </span>
                                </div>

                                {/* Mobile */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Mobile</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">
                                        {customerData.mobile || "-"}
                                    </span>
                                </div>

                                {/* Language */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Language</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">
                                        {customerData.language_code || "-"}
                                    </span>
                                </div>

                                {/* Currency */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Currency</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">
                                        {customerData.currency_code || "-"}
                                    </span>
                                </div>

                                {/* Opening Balance */}
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Opening Balance</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">
                                        ₹ {Number(customerData.opening_balance || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Portal Access and Remarks */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 pt-4 border-t">
                            {/* Portal Access */}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Portal Access</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {customerData.enable_portal ? "Enabled" : "Disabled"}
                                </span>
                            </div>

                            {/* Created On */}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Created On</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {customerData.created_at
                                        ? new Date(customerData.created_at).toLocaleDateString("en-GB")
                                        : "-"}
                                </span>
                            </div>
                        </div>

                        {/* Remarks */}
                        {customerData.remarks && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Remarks</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">
                                        {customerData.remarks}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Billing Address Section */}
                    {customerData.billing_address && (
                        <div className="bg-white rounded-lg border-2 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                                    Billing Address
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    {/* Contact Person */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Contact Person</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.billing_address.contact_person || "-"}
                                        </span>
                                    </div>

                                    {/* Address Line 1 */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Address Line 1</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.billing_address.address || "-"}
                                        </span>
                                    </div>

                                    {/* Address Line 2 */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Address Line 2</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.billing_address.address_line_two || "-"}
                                        </span>
                                    </div>

                                    {/* City */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">City</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.billing_address.city || "-"}
                                        </span>
                                    </div>

                                    {/* State */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">State</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.billing_address.state || "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    {/* Country */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Country</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.billing_address.country || "-"}
                                        </span>
                                    </div>

                                    {/* Pin Code */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Pin Code</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.billing_address.pin_code || "-"}
                                        </span>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Phone</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.billing_address.telephone_number || "-"}
                                        </span>
                                    </div>

                                    {/* Mobile */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Mobile</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.billing_address.mobile || "-"}
                                        </span>
                                    </div>

                                    {/* Fax */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Fax</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.billing_address.fax_number || "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shipping Address Section */}
                    {customerData.shipping_address && (
                        <div className="bg-white rounded-lg border-2 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                                    Shipping Address
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    {/* Contact Person */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Contact Person</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.shipping_address.contact_person || "-"}
                                        </span>
                                    </div>

                                    {/* Address Line 1 */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Address Line 1</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.shipping_address.address || "-"}
                                        </span>
                                    </div>

                                    {/* Address Line 2 */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Address Line 2</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.shipping_address.address_line_two || "-"}
                                        </span>
                                    </div>

                                    {/* City */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">City</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.shipping_address.city || "-"}
                                        </span>
                                    </div>

                                    {/* State */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">State</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.shipping_address.state || "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    {/* Country */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Country</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.shipping_address.country || "-"}
                                        </span>
                                    </div>

                                    {/* Pin Code */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Pin Code</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.shipping_address.pin_code || "-"}
                                        </span>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Phone</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.shipping_address.telephone_number || "-"}
                                        </span>
                                    </div>

                                    {/* Mobile */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Mobile</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.shipping_address.mobile || "-"}
                                        </span>
                                    </div>

                                    {/* Fax */}
                                    <div className="flex items-start">
                                        <span className="text-gray-500 min-w-[140px]">Fax</span>
                                        <span className="text-gray-500 mx-2">:</span>
                                        <span className="text-gray-900 font-medium">
                                            {customerData.shipping_address.fax_number || "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Persons Section */}
                    {customerData.contact_persons && customerData.contact_persons.length > 0 && (
                        <div className="bg-white rounded-lg border-2 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                    <User className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                                    Contact Persons
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-separate border-spacing-y-1">
                                    <thead>
                                        <tr className="bg-[#E5E0D3] text-[#1A1A1A] text-sm">
                                            <th className="px-3 py-2 text-left rounded-l-lg">Salutation</th>
                                            <th className="px-3 py-2 text-left">First Name</th>
                                            <th className="px-3 py-2 text-left">Last Name</th>
                                            <th className="px-3 py-2 text-left">Email</th>
                                            <th className="px-3 py-2 text-left">Work Phone</th>
                                            <th className="px-3 py-2 text-left rounded-r-lg">Mobile</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerData.contact_persons.map((person, idx) => (
                                            <tr key={idx} className="bg-white text-sm border-t border-gray-200">
                                                <td className="px-3 py-2">{person.salutation || "-"}</td>
                                                <td className="px-3 py-2">{person.first_name || "-"}</td>
                                                <td className="px-3 py-2">{person.last_name || "-"}</td>
                                                <td className="px-3 py-2">
                                                    <a href={`mailto:${person.email}`} className="text-blue-600">
                                                        {person.email || "-"}
                                                    </a>
                                                </td>
                                                <td className="px-3 py-2">{person.work_phone || "-"}</td>
                                                <td className="px-3 py-2">{person.mobile || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
};
