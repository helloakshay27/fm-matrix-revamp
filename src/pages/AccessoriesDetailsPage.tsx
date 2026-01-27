import { Button } from "@/components/ui/button";
import { createTheme, ThemeProvider } from "@mui/material";
import axios from "axios";
import { ArrowLeft, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const AccessoriesDetailsPage = () => {
    const { id } = useParams();
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();
    const [accessory, setAccessory] = useState({
        name: '',
        quantity: '',
        unit: '',
        max_stock_level: '',
        cost: '',
    });

    const fetchAccessory = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/inventories/${id}.json`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setAccessory(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAccessory();
    }, [id]);

    return (
        <ThemeProvider theme={muiTheme}>
            <div className="p-6 bg-white">
                <div className="mb-6">
                    <div className="flex items-end justify-between gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="p-0"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg border-2 p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                                <User className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                                ACCESORY INFO
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Accessory Name</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {accessory?.name}
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Quantity</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {accessory?.quantity}
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Unit</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {accessory?.unit}
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Maximum Stock Level</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {accessory?.max_stock_level}
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Cost Per Unit</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {accessory?.cost}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default AccessoriesDetailsPage