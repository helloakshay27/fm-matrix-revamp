import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchCustomers, topupWallet } from "@/store/slices/walletListSlice";
import axios from "axios";
import { toast } from "sonner";

interface Customer {
    id: number;
    name: string;
}

interface RecurringRule {
    points: number;
    active: boolean;
}

interface TopUpData {
    customer_id: string;
    credit_points: string;
    transaction_note: string;
    is_recurring: boolean;
}

interface TopupModalProps {
    open: boolean;
    onClose: () => void;
}

const TopupModal: React.FC<TopupModalProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem("baseUrl") || "";
    const token = localStorage.getItem("token") || "";

    const [recurringPoints, setRecurringPoints] = useState<boolean>(true);
    const [customerNames, setCustomerNames] = useState<Customer[]>([]);
    const [recurringRule, setRecurringRule] = useState<RecurringRule | null>(null);
    const [customerId, setCustomerId] = useState<number | undefined>(undefined);
    const [topUpData, setTopUpData] = useState<TopUpData>({
        customer_id: "",
        credit_points: "",
        transaction_note: "",
        is_recurring: recurringPoints,
    });

    useEffect(() => {
        setTopUpData((prev) => ({ ...prev, is_recurring: recurringPoints }));
    }, [recurringPoints]);

    const fetchCustomersData = async () => {
        try {
            const response = await dispatch(
                fetchCustomers({
                    baseUrl,
                    token,
                    id: Number(localStorage.getItem("selectedSiteId")),
                })
            ).unwrap();
            setCustomerNames(response.entities as Customer[]);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
            toast.error("Failed to load customers");
        }
    };

    useEffect(() => {
        fetchCustomersData();
    }, []);

    useEffect(() => {
        const fetchRecurringRules = async () => {
            if (!customerId) return;
            try {
                const response = await axios.get<{
                    recurring_rules: RecurringRule[];
                }>(
                    `https://${baseUrl}/get_wallet_recurring_rules.json?entity_id=${customerId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const activeRule =
                    response.data.recurring_rules.find((rule) => rule.active) || null;
                setRecurringRule(activeRule);
            } catch (error) {
                console.error("Failed to fetch recurring rules:", error);
                toast.error("Failed to load recurring rules");
            }
        };

        fetchRecurringRules();
    }, [customerId, baseUrl, token]);

    const validateForm = () => {
        if (!topUpData.customer_id) {
            toast.error("Customer selection is required");
            return false;
        }
        if (!topUpData.credit_points) {
            toast.error("Credit points are required");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("entity_id", topUpData.customer_id);
        formData.append("amount", topUpData.credit_points);
        formData.append("transaction_note", topUpData.transaction_note);
        formData.append("is_recurring", String(topUpData.is_recurring));

        try {
            await dispatch(
                topupWallet({
                    baseUrl,
                    token,
                    data: formData,
                })
            ).unwrap();
            toast.success("Wallet topped up successfully");
            setTopUpData({
                customer_id: "",
                credit_points: "",
                transaction_note: "",
                is_recurring: recurringPoints,
            });
            setCustomerId(undefined);
            onClose();
        } catch (error) {
            console.error("Failed to top up wallet:", error);
            toast.error("Failed to top up wallet");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Top-Up Wallet</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Customer Name</InputLabel>
                    <Select
                        value={topUpData.customer_id}
                        onChange={(e: SelectChangeEvent<string>) => {
                            const value = e.target.value;
                            setTopUpData({ ...topUpData, customer_id: value });
                            setCustomerId(value ? Number(value) : undefined);
                        }}
                        label="Customer Name"
                        required
                    >
                        <MenuItem value="">Select Customer</MenuItem>
                        {customerNames.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id.toString()}>
                                {customer.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Credit Points"
                    type="number"
                    value={topUpData.credit_points}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTopUpData({ ...topUpData, credit_points: e.target.value })
                    }
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Transaction Notes"
                    value={topUpData.transaction_note}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTopUpData({ ...topUpData, transaction_note: e.target.value })
                    }
                    multiline
                    rows={2}
                    sx={{
                        mt: 1,
                        "& .MuiOutlinedInput-root": {
                            height: "auto !important",
                            padding: "2px !important",
                        },
                    }}
                />
                <div style={{ marginTop: "16px" }}>
                    <div className="mt-3 mb-2 fw-semibold">
                        {recurringPoints
                            ? `Active Recurring Points: ${recurringRule?.points ?? 0}`
                            : "New Recurring Points"}
                    </div>
                    <Switch
                        checked={recurringPoints}
                        onChange={(_e, checked: boolean) => setRecurringPoints(checked)}
                        color="success"
                    />
                </div>
                <div
                    style={{
                        marginTop: "16px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                    }}
                >
                    <Button
                        onClick={handleSubmit}
                        style={{ backgroundColor: "#C72030" }}
                        className="text-white hover:bg-[#C72030]/90 flex-1"
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TopupModal;