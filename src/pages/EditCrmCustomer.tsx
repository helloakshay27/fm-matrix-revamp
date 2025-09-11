import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { Button } from "../components/ui/button";
import { Calendar, Trash2, Settings, ArrowLeft } from "lucide-react";
import { TextField, Card, CardContent } from "@mui/material";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { toast } from "sonner";
import { editCustomer, getCustomerById } from "@/store/slices/cusomerSlice";

interface Lease {
    id?: number;
    leaseStartDate: string;
    leaseEndDate: string;
    freeParking: string;
    paidParking: string;
}

export const EditCrmCustomer = () => {
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    const { id } = useParams();
    const navigate = useNavigate();
    const { setCurrentSection } = useLayout();
    const [formData, setFormData] = useState({
        customerName: "",
        email: "",
        mobile: "",
        colorCode: "#000",
        ssid: "",
    });
    const [leases, setLeases] = useState<Lease[]>([
        {
            id: undefined,
            leaseStartDate: "",
            leaseEndDate: "",
            freeParking: "",
            paidParking: "",
        },
    ]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await dispatch(
                    getCustomerById({ id: Number(id), baseUrl, token })
                ).unwrap();
                setFormData({
                    customerName: response.entity.name,
                    email: response.entity.email,
                    mobile: response.entity.mobile,
                    colorCode: response.entity.color_code,
                    ssid: response.entity.ssid,
                });
                setLeases(
                    response.customer_leases.map((lease) => ({
                        id: lease.id,
                        leaseStartDate: lease.lease_start_date,
                        leaseEndDate: lease.lease_end_date,
                        freeParking: lease.free_parking,
                        paidParking: lease.paid_parking,
                    }))
                );
            } catch (error: unknown) {
                const errorMessage =
                    error instanceof Error ? error.message : "Failed to fetch customer";
                console.error(errorMessage);
                toast.error(errorMessage);
            }
        };

        fetchCustomer();
    }, [dispatch, id, baseUrl, token]);

    useEffect(() => {
        setCurrentSection("CRM");
    }, [setCurrentSection]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleLeaseChange = (index: number, field: string, value: string) => {
        setLeases((prev) =>
            prev.map((lease, i) =>
                i === index
                    ? {
                        ...lease,
                        [field]: value,
                    }
                    : lease
            )
        );
    };

    const addNewLease = () => {
        const newLease = {
            id: undefined,
            leaseStartDate: "",
            leaseEndDate: "",
            freeParking: "",
            paidParking: "",
        };
        setLeases((prev) => [...prev, newLease]);
    };

    const removeLease = (index: number) => {
        if (leases.length > 1) {
            setLeases((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = async () => {
        if (!formData.customerName) {
            toast.error("Customer Name is required");
            return;
        }
        for (const lease of leases) {
            if (!lease.leaseStartDate || !lease.freeParking) {
                toast.error("Lease Start Date and Free Parking are required for all leases");
                return;
            }
        }
        if (isSaving) return;
        setIsSaving(true);
        const payload = {
            entity: {
                name: formData.customerName,
                email: formData.email,
                mobile: formData.mobile,
                color_code: formData.colorCode,
                ssid: formData.ssid,
                customer_leases_attributes: leases.map((lease) => ({
                    ...(lease.id != null && { id: lease.id }),
                    site_id: localStorage.getItem("selectedSiteId"),
                    lease_start_date: lease.leaseStartDate,
                    lease_end_date: lease.leaseEndDate,
                    free_parking: lease.freeParking,
                    paid_parking: lease.paidParking,
                })),
            },
        };

        try {
            await dispatch(
                editCustomer({ baseUrl, token, data: payload, id: Number(id) })
            ).unwrap();
            toast.success("Customer updated successfully");
            navigate(`/crm/customers`);
        } catch (error) {
            console.log(error);
            toast.error("Failed to update customer");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <p className="text-gray-600 text-sm">Back</p>
                    </button>
                </div>
            </div>
            <Card
                sx={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Settings className="w-5 h-5" />
                            <h3 className="text-lg font-semibold">BASIC DETAILS</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div>
                                <TextField
                                    label="Customer Name*"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formData.customerName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[A-Za-z\s]*$/.test(value)) {
                                            handleInputChange("customerName", value);
                                        }
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                        },
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                        if (value && !emailRegex.test(value)) {
                                            toast.error("Please enter a valid email address");
                                        }
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                        },
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Mobile"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formData.mobile}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,10}$/.test(value)) {
                                            handleInputChange("mobile", value);
                                        }
                                    }}
                                    inputProps={{
                                        maxLength: 10,
                                        inputMode: "numeric",
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                        },
                                    }}
                                />
                            </div>
                            <div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={formData.colorCode}
                                            onChange={(e) => handleInputChange("colorCode", e.target.value)}
                                            className="w-10 h-10 rounded border border-gray-300 cursor-pointer flex-shrink-0 hover:border-gray-400 transition-colors"
                                        />
                                        <TextField
                                            label="Color Code"
                                            variant="outlined"
                                            size="small"
                                            value={formData.colorCode}
                                            onChange={(e) => handleInputChange("colorCode", e.target.value)}
                                            sx={{
                                                flex: 1,
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "8px",
                                                    height: "40px",
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar className="w-5 h-5" />
                            <h3 className="text-lg font-semibold">LEASE INFORMATION</h3>
                        </div>
                        {leases.map((lease, index) => (
                            <Card
                                key={index}
                                sx={{
                                    mb: 3,
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {index > 0 && (
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-md font-medium text-gray-700">Lease {index + 1}</h4>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <TextField
                                                label="Lease Start Date*"
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                type="date"
                                                value={lease.leaseStartDate}
                                                onChange={(e) => handleLeaseChange(index, "leaseStartDate", e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                label="Lease End Date"
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                type="date"
                                                value={lease.leaseEndDate}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (lease.leaseStartDate && value < lease.leaseStartDate) {
                                                        toast.error("End date cannot be earlier than start date");
                                                        return;
                                                    }
                                                    handleLeaseChange(index, "leaseEndDate", value);
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                inputProps={{ min: lease.leaseStartDate || undefined }}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                label="Free Parking*"
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                type="number"
                                                value={lease.freeParking}
                                                onChange={(e) => handleLeaseChange(index, "freeParking", e.target.value)}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <div className="flex items-end gap-2">
                                                <TextField
                                                    label="Paid Parking"
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    type="number"
                                                    value={lease.paidParking}
                                                    onChange={(e) => handleLeaseChange(index, "paidParking", e.target.value)}
                                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="p-2 h-10"
                                                    onClick={() => removeLease(index)}
                                                    disabled={leases.length === 1}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <div className="mt-4">
                            <Button
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                                onClick={addNewLease}
                            >
                                Add Lease
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <Button
                            onClick={handleSave}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};