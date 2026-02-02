import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileCog } from "lucide-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { toast } from "sonner";

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
    const [form, setForm] = useState({
        billCycleName: "",
        startDate: "",
        endDate: "",
        paymentDueDays: "",
        billCycleFrequency: "",
        fine: "",
        interest: "",
        charges: [],
        expense: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleChargesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setForm((prev) => ({ ...prev, charges: selected }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Saved!");
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
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="quarterly">Quarterly</MenuItem>
                                <MenuItem value="yearly">Yearly</MenuItem>
                            </Select>
                        </FormControl>
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
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="fixed">Fixed</MenuItem>
                                <MenuItem value="percentage">Percentage</MenuItem>
                            </Select>
                        </FormControl>
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
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="fixed">Fixed</MenuItem>
                                <MenuItem value="percentage">Percentage</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {/* Charges and Expense */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6 mt-6 items-center">
                        <FormControl size="small" fullWidth>
                            <InputLabel id="charges-label">Charges</InputLabel>
                            <Select
                                labelId="charges-label"
                                id="charges-select"
                                name="charges"
                                multiple
                                value={form.charges}
                                onChange={handleChargesChange}
                                renderValue={(selected) => (selected as string[]).join(', ')}
                            >
                                <MenuItem value="Access Card Charges">Access Card Charges</MenuItem>
                                <MenuItem value="Arrears(P)">Arrears(P)</MenuItem>
                                <MenuItem value="CGST">CGST</MenuItem>
                                <MenuItem value="Club Memberships">Club Memberships</MenuItem>
                            </Select>
                        </FormControl>
                        <div className="flex items-center">
                            <span className="mr-2">Expense</span>
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
