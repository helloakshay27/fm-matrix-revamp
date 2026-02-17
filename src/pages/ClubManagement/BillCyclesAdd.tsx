import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
// Charge Setup interface for API data
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileCog } from "lucide-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { toast } from "sonner";
import { API_CONFIG } from '@/config/apiConfig';
import { useNavigate, useParams } from "react-router-dom";
interface ChargeSetup {
    id: number;
    name: string;
}
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

const BillCyclesAdd: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        billCycleName: "",
        startDate: "",
        endDate: "",
        paymentDueDays: "",
        billCycleFrequency: "",
        fine: "",
        interest: "",
        charges: [] as number[], // store charge IDs as numbers
        expense: false,
    });

    // Charges API state
    const [chargeSetups, setChargeSetups] = useState<ChargeSetup[]>([]);
    const [chargesLoading, setChargesLoading] = useState(false);

    // Fetch charge setups from API

    const fetchChargeSetups = useCallback(async () => {
        setChargesLoading(true);
        try {
            // const baseUrl = localStorage.getItem("baseUrl");
            // const token = localStorage.getItem("token");
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;

            const res = await axios.get(`${baseUrl}/account/charge_setups.json`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                },
            });
            const data = res.data;
            setChargeSetups(Array.isArray(data.charge_setups) ? data.charge_setups : []);
        } catch (err) {
            setChargeSetups([]);
        } finally {
            setChargesLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChargeSetups();
    }, [fetchChargeSetups]);

    console.log("Charge Setups:", chargeSetups);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // const handleChargesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     // Store selected charge IDs as numbers
    //     const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
    //     setForm((prev) => ({ ...prev, charges: selected }));
    // };

    const handleChargesChange = (e: any) => {
        const value = e.target.value;
        setForm((prev) => ({
            ...prev,
            charges: Array.isArray(value) ? value : [],
        }));
    };

    const payload = {
        society_bill_cycle: {
            name: form.billCycleName,
            start_month: form.startDate,
            end_month: form.endDate,
            payment_due_in: Number(form.paymentDueDays),
            due_date: form.startDate, // You may want to add a separate field for due_date
            society_id: 1, // TODO: Replace with actual society_id if dynamic
            is_cash_ledger: true, // TODO: Map from form if needed
            is_interest_ledger: false, // TODO: Map from form if needed
            is_cycle_complete: false, // TODO: Map from form if needed
            interest_rate: form.interestPercentage || form.interestAmount || 0,
            // interest_type: form.interest === 'percentage' ? 'simple' : 'flat', // Adjust as per your logic
            // fine_type: form.fine === 'percentage' ? 'daily' : 'flat', // Adjust as per your logic
            interest_type: form.interest === 'percentage' ? 'percentage' : 'flat',
            fine_type: form.fine === 'percentage' ? 'percentage' : 'flat',
            fine_rate: form.finePercentage || form.fineAmount || 0,
            frequency: form.billCycleFrequency,
            expense_bill: form.expense,
            active: 1
        },
        charges: form.charges
    };
    console.log("Payload:", payload);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const baseUrl = API_CONFIG.BASE_URL;
            const token = API_CONFIG.TOKEN;
            // Map form fields to API payload
            const payload = {
                society_bill_cycle: {
                    name: form.billCycleName,
                    start_month: form.startDate,
                    end_month: form.endDate,
                    payment_due_in: Number(form.paymentDueDays),
                    due_date: form.startDate, // You may want to add a separate field for due_date
                    society_id: 1, // TODO: Replace with actual society_id if dynamic
                    is_cash_ledger: true, // TODO: Map from form if needed
                    is_interest_ledger: false, // TODO: Map from form if needed
                    is_cycle_complete: false, // TODO: Map from form if needed
                    interest_rate: form.interestPercentage || form.interestAmount || 0,
                    // interest_type: form.interest === 'percentage' ? 'simple' : 'flat', // Adjust as per your logic
                    // fine_type: form.fine === 'percentage' ? 'daily' : 'flat', // Adjust as per your logic
                    interest_type: form.interest === 'percentage' ? 'percentage' : 'flat',
                    fine_type: form.fine === 'percentage' ? 'percentage' : 'flat',
                    fine_rate: form.finePercentage || form.fineAmount || 0,
                    frequency: form.billCycleFrequency,
                    expense_bill: form.expense,
                    active: 1
                },
                charges: form.charges
            };
            const res = await axios.post(`${baseUrl}/account/society_bill_cycles.json`, payload, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Bill cycle created successfully!');

            navigate(`/accounting/bill-cycles`);
        } catch (error: any) {
            toast.error('Failed to create bill cycle.');
        }
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <form
                className="w-full bg-white p-6"
                style={{ minHeight: '100vh', boxSizing: 'border-box' }}
                onSubmit={handleSubmit}
            >
                <div className="bg-white rounded-lg border-2 p-6 space-y-6 col-span-2 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                            <FileCog className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Bill Cycle Setup</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
                        <TextField
                            label={<span>Bill Cycle Name <span className="text-red-600">*</span></span>}
                            name="billCycleName"
                            value={form.billCycleName}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                        // required
                        />
                        <TextField
                            label={<span>Start Date <span className="text-red-600">*</span></span>}
                            name="startDate"
                            type="date"
                            value={form.startDate}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        // required
                        />
                        <TextField
                            label={<span>End Date <span className="text-red-600">*</span></span>}
                            name="endDate"
                            type="date"
                            value={form.endDate}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        // required
                        />
                        <TextField
                            label={<span>Payment Due in (Days) <span className="text-red-600">*</span></span>}
                            name="paymentDueDays"
                            value={form.paymentDueDays}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            type="number"
                        // required
                        />
                        <FormControl size="small" fullWidth>
                            <InputLabel id="bill-cycle-frequency-label">Bill Cycle Frequency <span style={{ color: '#C72030' }}>*</span></InputLabel>
                            <Select
                                labelId="bill-cycle-frequency-label"
                                id="bill-cycle-frequency-select"
                                name="billCycleFrequency"
                                value={form.billCycleFrequency}
                                label={<span>Bill Cycle Frequency <span style={{ color: '#C72030' }}>*</span></span>}
                                onChange={handleChange}
                            // required
                            >
                                <MenuItem value=""><span style={{ color: '#888' }}>Select</span></MenuItem>
                                <MenuItem value="one time">One Time</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="quarterly">Quarterly</MenuItem>
                                 <MenuItem value="half yearly">Half Yearly</MenuItem>
                                <MenuItem value="yearly">Yearly</MenuItem>
                            </Select>
                        </FormControl>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6"></div>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="fine-label">Fine</InputLabel>
                            <Select
                                labelId="fine-label"
                                id="fine-select"
                                name="fine"
                                value={form.fine}
                                label={<span>Fine</span>}
                                onChange={handleChange}
                            >
                                <MenuItem value=""><span style={{ color: '#888' }}>Select</span></MenuItem>
                                {/* <MenuItem value="none">None</MenuItem> */}
                                <MenuItem value="flat">Flat</MenuItem>
                                <MenuItem value="percentage">Percentage</MenuItem>
                            </Select>
                        </FormControl>
                        {/* Fine value input based on type */}
                        {form.fine === 'flat' && (
                            <TextField
                                label={<span>Fine Amount <span className="text-red-600">*</span></span>}
                                name="fineAmount"
                                type="number"
                                value={form.fineAmount || ''}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        )}
                        {form.fine === 'percentage' && (
                            <TextField
                                label={<span>Fine Percentage (%) <span className="text-red-600">*</span></span>}
                                name="finePercentage"
                                type="number"
                                value={form.finePercentage || ''}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
                        <FormControl size="small" fullWidth>
                            <InputLabel id="interest-label">Interest</InputLabel>
                            <Select
                                labelId="interest-label"
                                id="interest-select"
                                name="interest"
                                value={form.interest}
                                label={<span>Interest</span>}
                                onChange={handleChange}
                            >
                                <MenuItem value=""><span style={{ color: '#888' }}>Select</span></MenuItem>
                                <MenuItem value="flat">Flat</MenuItem>
                                <MenuItem value="percentage">Percentage</MenuItem>
                            </Select>
                        </FormControl>
                        {/* Interest value input based on type */}
                        {form.interest === 'flat' && (
                            <TextField
                                label={<span>Interest Amount <span className="text-red-600">*</span></span>}
                                name="interestAmount"
                                type="number"
                                value={form.interestAmount || ''}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        )}
                        {form.interest === 'percentage' && (
                            <TextField
                                label={<span>Interest Percentage (%) <span className="text-red-600">*</span></span>}
                                name="interestPercentage"
                                type="number"
                                value={form.interestPercentage || ''}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        )}
                    </div>
                    {/* Charges and Expense */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6 mt-6 items-center">
                        <FormControl fullWidth size="small">
                            <InputLabel id="charges-label">Charges</InputLabel>
                            <Select
                                labelId="charges-label"
                                id="charges-select"
                                name="charges"
                                multiple
                                value={form.charges}
                                onChange={handleChargesChange}
                                input={
                                    <OutlinedInput
                                        label="Charges"
                                        sx={{
                                            minHeight: 40,
                                            height: 'auto',
                                            paddingTop: '8px',
                                            paddingBottom: '8px',
                                            '& .MuiSelect-multiple': {
                                                minHeight: 40,
                                                height: 'auto',
                                            },
                                        }}
                                    />
                                }
                                renderValue={(selected) => (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 4,
                                            minHeight: 40,
                                            alignItems: 'flex-start',
                                            width: '100%',
                                            maxHeight: 40,
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {(selected as number[]).map((id) => {
                                            const charge = chargeSetups.find(cs => cs.id === id);
                                            return charge ? <Chip key={id} label={charge.name} /> : null;
                                        })}
                                    </div>
                                )}
                                disabled={chargesLoading}
                                sx={{ minWidth: 320, width: '100%', minHeight: 40, height: 'auto' }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                        },
                                    },
                                }}
                            >
                                {chargeSetups.map(cs => (
                                    <MenuItem key={cs.id} value={cs.id}>
                                        {cs.name}
                                    </MenuItem>
                                ))}
                                {chargeSetups.length === 0 && !chargesLoading && (
                                    <MenuItem disabled>No charges found</MenuItem>
                                )}
                                {chargesLoading && (
                                    <MenuItem disabled>Loading...</MenuItem>
                                )}
                            </Select>
                        </FormControl>


                        {/* <FormControl fullWidth>
                            <InputLabel id="charges-multiselect-label">
                                Select Charges
                            </InputLabel>

                            <Select
                                labelId="charges-multiselect-label"
                                multiple
                                value={form.charges}
                                onChange={handleChargesChange}
                                input={
                                    <OutlinedInput
                                        label="Select Charges"
                                        sx={{
                                            minHeight: 40,
                                            height: "auto",
                                            paddingTop: "8px",
                                            paddingBottom: "8px",
                                            "& .MuiSelect-multiple": {
                                                minHeight: 40,
                                                height: "auto",
                                            },
                                        }}
                                    />
                                }
                                renderValue={(selected) => (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 4,
                                            minHeight: 40,
                                            alignItems: "flex-start",
                                            width: "100%",
                                            maxHeight: 40, // one line of chips
                                            overflowY: "auto",
                                        }}
                                    >
                                        {(selected as number[]).map((id) => {
                                            const charge = chargeSetups.find(cs => cs.id === id);
                                            return charge ? (
                                                <Chip key={id} label={charge.name} />
                                            ) : null;
                                        })}
                                    </div>
                                )}
                                sx={{
                                    minWidth: 320,
                                    width: "100%",
                                    minHeight: 40,
                                    height: "auto",
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                        },
                                    },
                                }}
                                disabled={chargesLoading}
                            >
                                {chargesLoading ? (
                                    <MenuItem value="" disabled>
                                        Loading...
                                    </MenuItem>
                                ) : chargeSetups.length === 0 ? (
                                    <MenuItem value="" disabled>
                                        No charges found
                                    </MenuItem>
                                ) : (
                                    chargeSetups.map(cs => (
                                        <MenuItem key={cs.id} value={cs.id}>
                                            {cs.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl> */}

                        <div className="flex items-center">
                            <span className="mr-2 ms-2">Expense</span>
                            <Checkbox
                                checked={form.expense}
                                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, expense: !!checked }))}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 pt-5 mt-5 justify-center">
                    <Button
                        type="submit"
                        className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px]"
                    >
                        Save
                    </Button>
                    <Button
                        type="submit"
                        className="bg-[#1976d2] hover:bg-[#115293] text-white min-w-[140px]"
                    >
                        Save & New
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => window.history.back()}
                        className="min-w-[100px]"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </ThemeProvider>
    );
};

export default BillCyclesAdd;
