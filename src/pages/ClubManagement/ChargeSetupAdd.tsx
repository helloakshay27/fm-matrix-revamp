import React, { useState, useEffect } from "react";
import axios from "axios";
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
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import { useNavigate, useParams } from "react-router-dom";

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
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        chargeName: "",
        description: "",
        igstRate: "",
        cgstRate: "",
        sgstRate: "",
        basis: "",
        hsnCode: "",
        chargeType: "",
        uom: "",
        chargeCategoryId: "", // for category selection
        value: "", // for value input
        ledgers: [] as number[], // for Expense Based multi-select
    });
    const [categories, setCategories] = useState<{ id: number; category: string }[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [ledgers, setLedgers] = useState<{ id: number; name: string }[]>([]);
    const [ledgersLoading, setLedgersLoading] = useState(false);

    // Fetch charge categories on mount (with axios, baseUrl, token)
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            try {
                const url = `https://${baseUrl}/account/charge_setups/charge_categories.json`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                    },
                });
                const data = response.data;
                setCategories(Array.isArray(data.categories) ? data.categories : []);
            } catch (err) {
                setCategories([]);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch ledgers for Expense Based multi-select
    useEffect(() => {
        if (!form.chargeCategoryId) return;
        // Find selected category
        const selectedCat = categories.find(cat => cat.id === Number(form.chargeCategoryId));
        if (!selectedCat || selectedCat.category !== 'Expense Based') return;
        setLedgersLoading(true);
        const fetchLedgers = async () => {
            try {
                // You may want to update the endpoint as per your API
                const url = `https://${baseUrl}/lock_accounts/1/lock_account_ledgers.json`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                    },
                });
                // Assume API returns array of ledgers with id and name
                setLedgers(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setLedgers([]);
            } finally {
                setLedgersLoading(false);
            }
        };
        fetchLedgers();
    }, [form.chargeCategoryId, categories, baseUrl, token]);
    const [description, setDescription] = useState("");

    // Use correct event types for TextField and Select
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // If chargeCategoryId is changed, reset value and ledgers appropriately
        if (name === "chargeCategoryId") {
            // Find the selected category
            const selectedCat = categories.find(cat => cat.id === Number(value));
            if (selectedCat) {
                if (["Fixed", "Equal", "Per Square Feet"].includes(selectedCat.category)) {
                    setForm((prev) => ({
                        ...prev,
                        [name]: value,
                        value: "",
                        ledgers: [],
                    }));
                } else if (selectedCat.category === "Expense Based") {
                    setForm((prev) => ({
                        ...prev,
                        [name]: value,
                        value: "",
                        ledgers: [],
                    }));
                } else {
                    setForm((prev) => ({
                        ...prev,
                        [name]: value,
                        value: "",
                        ledgers: [],
                    }));
                }
            } else {
                setForm((prev) => ({
                    ...prev,
                    [name]: value,
                    value: "",
                    ledgers: [],
                }));
            }
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
            if (name === "description") {
                setDescription(value);
            }
        }
    };

    // For Expense Based ledger multi-select
    const handleLedgerChange = (event: any) => {
        const value = event.target.value;
        setForm(prev => ({
            ...prev,
            ledgers: Array.isArray(value) ? value : [],
            value: "", // Reset value when ledgers are selected
        }));
    };

    const payload = {
        charge_setup: {
            name: form.chargeName,
            value: form.value !== "" ? Number(form.value) : null,
            charge_category_id: Number(form.chargeCategoryId) || 1,
            gst_applicable: true,
            basis: form.basis,
            hsn_code: form.hsnCode,
            igst_rate: Number(form.igstRate) || 0,
            cgst_rate: Number(form.cgstRate) || 0,
            sgst_rate: Number(form.sgstRate) || 0,
            uom: form.uom || "per_kwh",
            assigned_ledgers: form.ledgers,
            description: form.description || "",
        },
        charge_setup_flats: [
            // { flat_type_id: 1, amount: 500.0 },
            // { flat_type_id: 2, amount: 750.0 },
        ],

    };
    // For debugging
    console.log("Payload to be sent:", payload);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Build payload
        // const payload = {
        //     charge_setup: {
        //         name: form.chargeName,
        //         value: form.value !== "" ? Number(form.value) : null,
        //         charge_category_id: Number(form.chargeCategoryId) || 1,
        //         gst_applicable: true,
        //         basis: form.basis,
        //         hsn_code: form.hsnCode,
        //         igst_rate: Number(form.igstRate) || 0,
        //         cgst_rate: Number(form.cgstRate) || 0,
        //         sgst_rate: Number(form.sgstRate) || 0,
        //         uom: form.uom || "per_kwh",
        //         ledgers: form.ledgers,
        //     },
        //     charge_setup_flats: [
        //         // { flat_type_id: 1, amount: 500.0 },
        //         // { flat_type_id: 2, amount: 750.0 },
        //     ],

        // };

        const payload = {
            charge_setup: {
                name: form.chargeName,
                value: form.value !== "" ? Number(form.value) : null,
                charge_category_id: Number(form.chargeCategoryId) || 1,
                gst_applicable: true,
                basis: form.basis,
                hsn_code: form.hsnCode,
                igst_rate: Number(form.igstRate) || 0,
                cgst_rate: Number(form.cgstRate) || 0,
                sgst_rate: Number(form.sgstRate) || 0,
                uom: form.uom || "per_kwh",
                assigned_ledgers: form.ledgers,
                description: form.description || "",
            },
            charge_setup_flats: [
                // { flat_type_id: 1, amount: 500.0 },
                // { flat_type_id: 2, amount: 750.0 },
            ],

        };
        try {
            const baseUrl = localStorage.getItem("baseUrl");
            const token = localStorage.getItem("token");
            const url = `https://${baseUrl}/account/charge_setups.json`;
            const res = await axios.post(url, payload, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                },
            });
            toast.success("Charge setup created successfully!");
            navigate(`/accounting/charge-setup`);
        } catch (err: any) {
            toast.error("Failed to create charge setup");
        }
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
                        <TextField
                            label={<span>UOM</span>}
                            size="small"
                            variant="outlined"
                            name="uom"
                            value={form.uom}
                            onChange={handleChange}
                            className="w-full"
                        />
                        <FormControl size="small" fullWidth>
                            <InputLabel id="charge-category-label">Charge Type<span style={{ color: '#C72030' }}>*</span></InputLabel>
                            <Select
                                labelId="charge-category-label"
                                id="charge-category-select"
                                name="chargeCategoryId"
                                value={form.chargeCategoryId || ""}
                                label={<span>Charge Type <span style={{ color: '#C72030' }}>*</span></span>}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value=""><span style={{ color: '#888' }}>Select</span></MenuItem>
                                {categoriesLoading ? (
                                    <MenuItem value="" disabled>Loading...</MenuItem>
                                ) : categories.length === 0 ? (
                                    <MenuItem value="" disabled>No categories found</MenuItem>
                                ) : (
                                    categories.map(cat => (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.category}</MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                        {/* Conditionally show value input or ledger multi-select */}
                        {(() => {
                            const selectedCat = categories.find(cat => cat.id === Number(form.chargeCategoryId));
                            if (!selectedCat) return null;
                            if (["Fixed", "Equal", "Per Square Feet"].includes(selectedCat.category)) {
                                return (
                                    <TextField
                                        label={<span>Value <span className="text-red-600">*</span></span>}
                                        size="small"
                                        variant="outlined"
                                        name="value"
                                        value={form.value}
                                        onChange={handleChange}
                                        className="w-full"
                                        type="number"
                                    // required
                                    />
                                );
                            }
                            if (selectedCat.category === "Expense Based") {
                                return (
                                    <FormControl fullWidth >
                                        <InputLabel id="ledger-multiselect-label">Select Ledgers</InputLabel>
                                        <Select
                                            labelId="ledger-multiselect-label"
                                            multiple
                                            value={form.ledgers}
                                            onChange={handleLedgerChange}
                                            input={
                                                <OutlinedInput
                                                    label="Select Ledgers"
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
                                                        maxHeight: 40, // approx one line of chips
                                                        overflowY: 'auto',
                                                    }}
                                                >
                                                    {(selected as number[]).map((id) => {
                                                        const ledger = ledgers.find(l => l.id === id);
                                                        return ledger ? <Chip key={id} label={ledger.name} /> : null;
                                                    })}
                                                </div>
                                            )}
                                            sx={{ minWidth: 320, width: '100%', minHeight: 40, height: 'auto' }}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                    },
                                                },
                                            }}
                                        >
                                            {ledgersLoading ? (
                                                <MenuItem value="" disabled>Loading...</MenuItem>
                                            ) : ledgers.length === 0 ? (
                                                <MenuItem value="" disabled>No ledgers found</MenuItem>
                                            ) : (
                                                ledgers.map(ledger => (
                                                    <MenuItem key={ledger.id} value={ledger.id}>{ledger.name}</MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                );
                            }
                            return null;
                        })()}
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
