import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCog } from "lucide-react";
import { ThemeProvider, createTheme } from "@mui/material";
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

export const ChargeSetupDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    // const [loading, setLoading] = useState(false);

    const [loading, setLoading] = useState(false);
    const [chargeSetup, setChargeSetup] = useState<any | null>(null);

    // Fetch charge setup details
    const fetchChargeSetupDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://${baseUrl}/account/charge_setups/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setChargeSetup(response.data.charge_setup);
        } catch (error) {
            setChargeSetup(null);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChargeSetupDetails();
    }, [id]);

    const handleEditClick = () => {
        navigate(`/settings/vas/membership-plan/setup/edit/${id}`);
    };

    const handleClose = () => {
        navigate("/settings/charge-setup");
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
                            Back to Charge Setup List
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                <FileCog className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                                Charge Setup Details
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Charge Name</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.name || '-'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Charge Category</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.charge_category || '-'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">IGST Rate (%)</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.igst_rate ?? '-'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">CGST Rate (%)</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.cgst_rate ?? '-'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">SGST Rate (%)</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.sgst_rate ?? '-'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Basis</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.basis || '-'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">HSN Code</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.hsn_code || '-'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">UOM</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.uom || '-'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Value</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.value || '-'}</span>
                            </div>
                             <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Selected Ledgers</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.ledgers || '-'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">GST Applicable</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.gst_applicable ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Active</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.active ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        {/* Description field in a separate row */}
                        <div className="mt-6">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Description</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{chargeSetup?.description || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};
