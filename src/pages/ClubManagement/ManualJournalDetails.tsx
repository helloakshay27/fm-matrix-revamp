import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, DollarSign, NotepadText } from "lucide-react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, ThemeProvider, createTheme } from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

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

// Available amenities options
const AMENITIES_OPTIONS = [
    "Swimming Pool",
    "Gym",
    "Spa",
    "Tennis Court",
    "Basketball Court",
    "Badminton Court",
    "Yoga Studio",
    "Meditation Room",
    "Sauna",
    "Steam Room",
    "Jacuzzi",
    "Kids Play Area",
    "Game Room",
    "Library",
    "Conference Room",
    "Business Center",
    "Lounge",
    "Restaurant",
    "Cafe",
    "Bar",
];
interface ManualJournalRecord {
    id: number;
    ledger_id: number;
    ledger_name: string;
    tr_type: string;
    amount: number;
    cost_centre_id: number | null;
}
interface ManualJournalTransaction {
    id: number;
    lock_account_id: number;
    transaction_type: string;
    reference: string | null;
    voucher_number: string | null;
    transaction_date: string;
    description: string;
    records: ManualJournalRecord[];
    created_at: string;
    updated_at: string;
}

export const ManualJournalDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ManualJournalTransaction | null>(null);


    const [amenities, setAmenities] = useState([])
    const [formData, setFormData] = useState({

        date: "",
        journalNo: "",
        referenceNo: "",
        notes: "",
        reportingMethod: "",
        currency: "",
        journalRows: [],

        //   createdAt: "",
        //   createdBy: "",
        //   active: true,
    });

    const getAmenities = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/membership_plans/amenitiy_list.json`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            setAmenities(response.data.ameneties)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAmenities()
    }, [])

    const fetchMembershipPlanDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://${baseUrl}/lock_accounts/1/lock_account_transactions/${id}.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })

            const data = response.data;
            setFormData({
                date: data.transaction_date
                    ? data.transaction_date.split("-").reverse().join("-")
                    : "",
                journalNo: data.voucher_number || "",
                referenceNo: data.reference || "",
                notes: data.description || "",
                reportingMethod: "", // Not present in API
                currency: "", // Not present in API
                journalRows: Array.isArray(data.records) ? data.records.map((rec: any) => ({
                    accountName: rec.ledger_name || "",
                    description: data.description || "",
                    contactName: "", // Not present in API
                    debit: rec.tr_type === "dr" ? rec.amount.toFixed(2) : "0.00",
                    credit: rec.tr_type === "cr" ? rec.amount.toFixed(2) : "0.00",
                })) : [],
                // createdAt, createdBy, active are not present in this API
            });
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMembershipPlanDetails();
    }, [id])

    const handleEditClick = () => {
        navigate(`/settings/vas/membership-plan/setup/edit/${id}`);
    };

    const handleClose = () => {
        navigate("/settings/manual-journal");
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

    return (
        <ThemeProvider theme={muiTheme}>
            <div className="p-6 bg-white">
                <div className="mb-6">
                    <div className="flex items-end justify-between gap-2">
                        <Button
                            variant="ghost"
                            onClick={handleClose}
                            className="p-0"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Manual Journal List
                        </Button>
                        {/* <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={handleEditClick}
                                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                            >
                                Edit
                            </Button>
                        </div> */}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                <NotepadText className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                                Manual Journal Details
                            </h3>
                        </div>


                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                            {/* Date */}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Date</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {formData.date || "-"}
                                </span>
                            </div>

                            {/* Journal# */}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Journal#</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {formData.journalNo || "-"}
                                </span>
                            </div>

                            {/* Reference# */}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Reference#</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {formData.referenceNo || "-"}
                                </span>
                            </div>

                            {/* Notes */}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Notes</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {formData.notes || "-"}
                                </span>
                            </div>

                            {/* Reporting Method */}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Reporting Method</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {formData.reportingMethod || "-"}
                                </span>
                            </div>

                            {/* Currency */}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Currency</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {formData.currency || "-"}
                                </span>
                            </div>

                            {/* Created On */}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Created On</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {formData.createdAt
                                        ? new Date(formData.createdAt).toLocaleDateString("en-GB")
                                        : "-"}
                                </span>
                            </div>

                            {/* Created By */}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Created By</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {formData.createdBy || "-"}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Status</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {formData.active ? "Active" : "Inactive"}
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* Journal Table Section */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <div className="bg-white rounded-lg border-2 p-6 h-full">
                                <table className="min-w-full border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="bg-[#E5E0D3] text-[#1A1A1A] text-sm">
                                            <th className="px-3 py-2 text-left rounded-l-lg">Account</th>
                                            <th className="px-3 py-2 text-left">Description</th>
                                            <th className="px-3 py-2 text-left">Contact (INR)</th>
                                            <th className="px-3 py-2 text-left">Debits</th>
                                            <th className="px-3 py-2 text-left rounded-r-lg">Credits</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(formData.journalRows && formData.journalRows.length > 0) ? (
                                            formData.journalRows.map((row, idx) => (
                                                <tr key={idx} className="bg-white text-sm">
                                                    <td className="px-3 py-2 border-t border-gray-200">{row.accountName || '-'}</td>
                                                    <td className="px-3 py-2 border-t border-gray-200">{row.note || '-'}</td>
                                                    <td className="px-3 py-2 border-t border-gray-200">{row.contactName || '-'}</td>
                                                    <td className="px-3 py-2 border-t border-gray-200">{row.debit || '0.00'}</td>
                                                    <td className="px-3 py-2 border-t border-gray-200">{row.credit || '0.00'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center text-gray-400 py-4">No journal entries</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* Subtotal Card */}


                    {/* Subtotal Card with concise calculation and display */}
                    <div className="flex justify-end mt-6">
                        <div className="bg-white rounded-lg shadow p-6 min-w-[320px] max-w-[500px] w-[500px]">
                            {(() => {
                                const rows = formData.journalRows || [];
                                const totalDebits = rows.reduce((sum, r) => sum + Number(r.debit || 0), 0);
                                const totalCredits = rows.reduce((sum, r) => sum + Number(r.credit || 0), 0);
                                return (
                                    <>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium text-gray-700">Sub Total</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold text-lg">Total (₹)</span>
                                            <span className="font-semibold text-lg">
                                                {totalDebits.toFixed(2)}&nbsp;&nbsp;{totalCredits.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-500">Debits</span>
                                            <span className="text-gray-700">{totalDebits.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-500">Credits</span>
                                            <span className="text-gray-700">{totalCredits.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between mt-4">
                                            <span className="font-medium text-gray-700">Difference</span>
                                            <span className="font-semibold text-red-500">{(totalDebits - totalCredits).toFixed(2)}</span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};
