import React, { useState } from "react";
import {
    // TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    RadioGroup,
    Radio,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { InputAdornment, TextField } from "@mui/material";

// const muiTheme = createTheme({
//   components: {
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           width: "100%",
//           "& .MuiOutlinedInput-root": {
//             borderRadius: "6px",
//             height: "44px",
//           },
//         },
//       },
//     },
//     MuiFormControl: {
//       styleOverrides: {
//         root: {
//           width: "100%",
//           "& .MuiOutlinedInput-root": {
//             borderRadius: "6px",
//             height: "44px",
//           },
//         },
//       },
//     },
//   },
// });




const muiTheme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        height: "44px",
                    },
                },
            },
        },

        MuiFormControl: {
            styleOverrides: {
                root: {
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        height: "44px",
                    },
                },
            },
        },

        // ✅ Checkbox color
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: "#bf213e",
                    "&.Mui-checked": {
                        color: "#bf213e",
                    },
                },
            },
        },

        // ✅ Radio button color
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: "#bf213e",
                    "&.Mui-checked": {
                        color: "#bf213e",
                    },
                },
            },
        },

        // ✅ Disabled input background + text
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "&.Mui-disabled": {
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                    },
                },
                input: {
                    "&.Mui-disabled": {
                        WebkitTextFillColor: "#9e9e9e",
                    },
                },
            },
        },

        // ✅ Disabled label color
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    "&.Mui-disabled": {
                        color: "#9e9e9e",
                    },
                },
            },
        },
    },
});



const ItemsAdd = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        type: "goods",
        name: "",
        unit: "",

        sellable: true,
        purchasable: true,

        selling_price: "",
        sales_account: "",
        sales_description: "",

        cost_price: "",
        purchase_account: "",
        purchase_description: "",
        preferred_vendor: "",
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setForm((p) => ({
            ...p,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = () => {
        console.log("Item payload:", form);
        toast.success("Item saved (dummy)");
        navigate("/items");
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <div className="p-6 bg-white min-h-screen">
                <h1 className="text-2xl font-semibold mb-6">New Item</h1>

                {/* TYPE */}
                <div className="mb-6 flex items-center gap-8">
                    <div className="text-m font-semibold min-w-[60px]">Type</div>

                    <RadioGroup
                        row
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="flex items-center"
                    >
                        <FormControlLabel
                            value="goods"
                            control={<Radio />}
                            label="Goods"
                        />

                        <FormControlLabel
                            value="service"
                            control={<Radio />}
                            label="Service"
                        />
                    </RadioGroup>
                </div>



                {/* BASIC INFO */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <TextField
                        label="Name *"
                        name="name"
                        placeholder="Enter item name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <FormControl>
                        <InputLabel>Usage Unit</InputLabel>
                        <Select
                            name="unit"
                            value={form.unit}
                            label="Usage Unit"
                            onChange={handleChange}
                        >
                            <MenuItem value="" disabled>Select unit</MenuItem>
                            <MenuItem value="box">BOX - box</MenuItem>
                            <MenuItem value="cm">CMS - cm</MenuItem>
                            <MenuItem value="dz">DOZ - dz</MenuItem>
                            <MenuItem value="ft">FTS - ft</MenuItem>
                            <MenuItem value="g">GMS - g</MenuItem>
                            <MenuItem value="in">INC - in</MenuItem>
                            <MenuItem value="kg">KGS - kg</MenuItem>
                            <MenuItem value="km">KME - km</MenuItem>
                            <MenuItem value="lb">LBS - lb</MenuItem>
                            <MenuItem value="mg">MGS - mg</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* SALES & PURCHASE */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* SALES */}
                    <div className="border rounded-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Sales Information</h2>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.sellable}
                                        name="sellable"
                                        onChange={handleChange}
                                    />
                                }
                                label="Sellable"
                            />
                        </div>

                        <div className="grid gap-6">
                            {/* <TextField
                                disabled={!form.sellable}
                                label="Selling Price"
                                name="selling_price"
                                placeholder="Enter selling price"
                                type="number"
                                value={form.selling_price}
                                onChange={handleChange}
                            /> */}


                            <TextField
                                placeholder="Enter selling price"
                                fullWidth
                                label="Selling Price"
                                name="selling_price"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                            sx={{
                                                backgroundColor: "#f3f3f3",
                                                borderRight: "1px solid #dcdcdc",
                                                height: "44px",
                                                maxHeight: "44px",
                                                display: "flex",
                                                alignItems: "center",
                                                px: 1.5,
                                                color: "#555",
                                                fontWeight: 500,
                                            }}
                                        >
                                            INR
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        paddingLeft: 0, // removes gap between INR and input
                                    },
                                    "& input": {
                                        paddingLeft: "12px",
                                    },
                                }}
                            />


                            <FormControl disabled={!form.sellable}>
                                <InputLabel>Account</InputLabel>
                                <Select
                                    name="sales_account"
                                    value={form.sales_account}
                                    label="Account"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="" disabled>Select account</MenuItem>
                                    <MenuItem value="Sales">Sales</MenuItem>
                                    <MenuItem value="Income">Income</MenuItem>
                                    <MenuItem value="Discount">Discount</MenuItem>
                                    <MenuItem value="General Income">General Income</MenuItem>
                                    <MenuItem value="Interest Income">Interest Income</MenuItem>
                                    <MenuItem value="Late Fee Income">Late Fee Income</MenuItem>
                                    <MenuItem value="Other Charges">Other Charges</MenuItem>

                                </Select>
                            </FormControl>

                            <TextField
                                disabled={!form.sellable}
                                label="Description"
                                name="sales_description"
                                placeholder="Enter sales description"
                                value={form.sales_description}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* PURCHASE */}
                    <div className="border rounded-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Purchase Information</h2>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.purchasable}
                                        name="purchasable"
                                        onChange={handleChange}
                                    />
                                }
                                label="Purchasable"
                            />
                        </div>

                        <div className="grid gap-6">
                            {/* <TextField
                                disabled={!form.purchasable}
                                label="Cost Price"
                                name="cost_price"
                                type="number"
                                placeholder="Enter cost price"
                                value={form.cost_price}
                                onChange={handleChange}
                            /> */}

                            <TextField
                                placeholder="Enter cost price"
                                fullWidth
                                label="Cost Price"
                                name="cost_price"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                            sx={{
                                                backgroundColor: "#f3f3f3",
                                                borderRight: "1px solid #dcdcdc",
                                                height: "44px",
                                                maxHeight: "44px",
                                                display: "flex",
                                                alignItems: "center",
                                                px: 1.5,
                                                color: "#555",
                                                fontWeight: 500,
                                            }}
                                        >
                                            INR
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        paddingLeft: 0,
                                    },
                                    "& input": {
                                        paddingLeft: "12px",
                                    },
                                }}
                            />

                            <FormControl disabled={!form.purchasable}>
                                <InputLabel>Account</InputLabel>
                                <Select
                                    name="purchase_account"
                                    value={form.purchase_account}
                                    label="Account"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="" disabled>Select account</MenuItem>
                                    <MenuItem value="Other Current Asset">Other Current Asset</MenuItem>
                                    <MenuItem value="Advance Tax">Advance Tax</MenuItem>
                                    <MenuItem value="Employee Advance">Employee Advance</MenuItem>
                                    <MenuItem value="Prepaid Expenses">Prepaid Expenses</MenuItem>
                                    <MenuItem value="TDS Receivable">TDS Receivable</MenuItem>
                                    <MenuItem value="Fixed Asset">Fixed Asset</MenuItem>
                                    <MenuItem value="Furniture and Equipment">
                                        Furniture and Equipment
                                    </MenuItem>

                                </Select>
                            </FormControl>

                            <TextField
                                disabled={!form.purchasable}
                                label="Description"
                                name="purchase_description"
                                value={form.purchase_description}
                                placeholder="Enter purchase description"
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />

                            <FormControl disabled={!form.purchasable}>
                                <InputLabel>Preferred Vendor</InputLabel>
                                <Select
                                    name="preferred_vendor"
                                    value={form.preferred_vendor}
                                    label="Preferred Vendor"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="" disabled>Select vendor</MenuItem>
                                    <MenuItem value="Vendor 1">Vendor 1</MenuItem>
                                    <MenuItem value="Vendor 2">Vendor 2</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 mt-10 mb-5 justify-center">
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    >
                        Save
                    </Button>

                    <Button variant="outline" onClick={() => navigate("/items")}>
                        Cancel
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default ItemsAdd;
