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

const ChargeSetupAdd: React.FC = () => {
    const [form, setForm] = useState({
        chargeName: "",
        description: "",
        igstRate: "",
        cgstRate: "",
        sgstRate: "",
        basis: "",
        hsnCode: "",
        chargeType: "",

    });
    const [description, setDescription] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (name === "description") {
            setDescription(value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Submit logic here
        alert("Saved!");
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <form
                className="w-full bg-white p-6"
                style={{ minHeight: '100vh', boxSizing: 'border-box' }}
                onSubmit={handleSubmit}
            >
                {/* Charge Setup Section */}
                <div className="bg-white rounded-lg border-2 p-6 space-y-6 col-span-2 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                            <FileCog className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Charge Setup</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
                        <TextField
                            label={<span>Charge Name <span className="text-red-600">*</span></span>}
                            size="small"
                            variant="outlined"
                            name="chargeName"
                            value={form.chargeName}
                            onChange={handleChange}
                            className="w-full"
                            required
                        />

                        <TextField
                            label={<span>Igst Rate (%)</span>}
                            size="small"
                            variant="outlined"
                            name="igstRate"
                            value={form.igstRate}
                            onChange={handleChange}
                            className="w-full"
                            type="number"
                        />
                        <TextField
                            label={<span>Cgst Rate (%)</span>}
                            size="small"
                            variant="outlined"
                            name="cgstRate"
                            value={form.cgstRate}
                            onChange={handleChange}
                            className="w-full"
                            type="number"
                        />
                        <TextField
                            label={<span>Sgst Rate (%)</span>}
                            size="small"
                            variant="outlined"
                            name="sgstRate"
                            value={form.sgstRate}
                            onChange={handleChange}
                            className="w-full"
                            type="number"
                        />
                        <TextField
                            label={<span>Basis</span>}
                            size="small"
                            variant="outlined"
                            name="basis"
                            value={form.basis}
                            onChange={handleChange}
                            className="w-full"
                        />
                        <TextField
                            label={<span>HSN Code</span>}
                            size="small"
                            variant="outlined"
                            name="hsnCode"
                            value={form.hsnCode}
                            onChange={handleChange}
                            className="w-full"
                        />
                        <FormControl size="small" fullWidth>
                            <InputLabel id="charge-type-label">Charge Type <span style={{ color: '#C72030' }}>*</span></InputLabel>
                            <Select
                                labelId="charge-type-label"
                                id="charge-type-select"
                                name="chargeType"
                                value={form.chargeType}
                                label={<span>Charge Type <span style={{ color: '#C72030' }}>*</span></span>}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value=""><span style={{ color: '#888' }}>Select</span></MenuItem>
                                <MenuItem value="recurring">Recurring</MenuItem>
                                <MenuItem value="one-time">One Time</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {/* Description field in a separate row */}
                    <div className="mt-6">
                        <TextField
                            label={<span>Description<span style={{ color: '#C72030' }}>*</span></span>}
                            name="description"
                            value={description}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ maxLength: 500 }}
                            sx={{
                                // mt: 1,
                                "& .MuiOutlinedInput-root": {
                                    // height: "auto !important",
                                    // padding: "2px !important",
                                    // display: "flex",
                                },
                                "& .MuiInputBase-input[aria-hidden='true']": {
                                    flex: 0,
                                    width: 0,
                                    height: 0,
                                    padding: "0 !important",
                                    margin: 0,
                                    display: "none",
                                },
                                "& .MuiInputBase-input": {
                                    resize: "none !important",
                                },
                            }}
                            helperText={<span style={{ textAlign: 'right', display: 'block' }}>{`${description.length}/500 characters`}</span>}
                            error={description.length > 500}
                        />
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
                        className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px]"
                    >
                         Save & Configure New Charge
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

export default ChargeSetupAdd;
