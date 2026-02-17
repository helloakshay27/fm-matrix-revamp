
import React, { useState } from "react";
import axios from "axios";
import {
    // TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListSubheader,
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
        sku: "",

        sellable: true,
        purchasable: true,

        selling_price: "",
        mrp: "",
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

    // Account groups and ledgers for sales/purchase account dropdowns
    const [accountGroups, setAccountGroups] = React.useState([]);
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const [openSalesAccount, setOpenSalesAccount] = React.useState(false);
    const [openPurchaseAccount, setOpenPurchaseAccount] = React.useState(false);

    React.useEffect(() => {
        const fetchAccountGroups = async () => {
            try {
                // Replace with your actual endpoint for groups/ledgers
                const res = await axios.get(`https://${baseUrl}/lock_accounts/1/lock_account_groups?format=flat`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Account Groups Response:", res.data);
                setAccountGroups(res.data.data || []);
            } catch (e) {
                setAccountGroups([]);
            }
        };
        fetchAccountGroups();
    }, [openSalesAccount, openPurchaseAccount, baseUrl, token]);
    console.log("Account Groups:", accountGroups)

    const payload = {
        lock_account_item: {
            name: form.name,
            sale_description: form.sales_description,
            sale_rate: form.selling_price,
            sale_lock_account_ledger_id: form.sales_account,
            sku: form.sku,
            purchase_rate: form.cost_price,
            purchase_lock_account_ledger_id: form.purchase_account,
            purchase_description: form.purchase_description,
            product_type: form.type,
            pms_supplier_id: form.preferred_vendor,
            unit: form.unit,
            // sale_mrp: form.mrp,
            can_be_sold: form.sellable,
            can_be_purchased: form.purchasable,
            track_inventory: false
        }
    };
    console.log("Payload for submission:", payload)
    const handleSubmit = () => {
        // Validation
        if (!form.name.trim()) {
            toast.error("Please mention the item name.");
            return;
        }
        if (!form.sellable && !form.purchasable) {
            toast.error("Select at least one option from, Sales Information, Purchase Information to proceed.");
            return;
        }
        if (form.sellable) {
            if (!form.selling_price || isNaN(Number(form.selling_price))) {
                toast.error("Selling Price is required for Sellable items");
                return;
            }
            if (!form.sales_account) {
                toast.error("Sales Account is required for Sellable items");
                return;
            }
        }
        if (form.purchasable) {
            if (!form.cost_price || isNaN(Number(form.cost_price))) {
                toast.error("Cost Price is required for Purchasable items");
                return;
            }
            if (!form.purchase_account) {
                toast.error("Purchase Account is required for Purchasable items");
                return;
            }
        }

        const token = localStorage.getItem("token");
        // Build payload conditionally
        const itemPayload = {
            name: form.name,
            sku: form.sku,
            product_type: form.type,
            pms_supplier_id: form.preferred_vendor,
            unit: form.unit,
            can_be_sold: form.sellable,
            can_be_purchased: form.purchasable,
            track_inventory: false
        };
        if (form.sellable) {
            itemPayload.sale_description = form.sales_description;
            itemPayload.sale_rate = form.selling_price;
            itemPayload.sale_lock_account_ledger_id = form.sales_account;
            // itemPayload.sale_mrp = form.mrp;
        }
        if (form.purchasable) {
            itemPayload.purchase_description = form.purchase_description;
            itemPayload.purchase_rate = form.cost_price;
            itemPayload.purchase_lock_account_ledger_id = form.purchase_account;
        }
        const payload = {
            lock_account_item: itemPayload,
            lock_account_id: "1"
        };
        axios.post(
            `https://${baseUrl}/lock_account_items.json`,
            payload,
            {
                headers: {
                    "Authorization": token ? `Bearer ${token}` : undefined,
                    "Content-Type": "application/json"
                }
            }
        )
            .then(res => {
                toast.success("Item saved successfully!");
                navigate("/accounting/items");
            })
            .catch(err => {
                toast.error("Failed to save item");
                console.error("Item save error:", err);
            });
    };
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };
    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
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

                {/* BASIC INFO + ATTACHMENT */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">

                    {/* LEFT SIDE FIELDS */}
                    <div className="lg:col-span-2 grid gap-6">

                        {/* NAME */}
                        <TextField
                            // label="Name *"
                            label={
                                <>
                                    Name <span style={{ color: "red" }}>*</span>
                                </>
                            }

                            name="name"
                            placeholder="Enter item name"
                            value={form.name}
                            onChange={handleChange}
                        />

                        {/* SKU  ✅ NEW */}
                        <TextField
                            label="SKU"
                            name="sku"
                            placeholder="Enter SKU"
                            value={form.sku}
                            onChange={handleChange}
                        />

                        {/* UNIT */}
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

                    {/* RIGHT SIDE ATTACHMENT */}
                    <div>
                        {!preview ? (
                            /* EMPTY STATE */
                            <div className="border-2 border-dashed rounded-lg min-h-[200px] flex flex-col items-center justify-center text-center p-6">
                                <div className="text-gray-400 mb-2">
                                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="3" width="34" height="34" rx="4" />
                                        <circle cx="14" cy="14" r="3" />
                                        <path d="M37 25l-8-8-12 12" />
                                    </svg>
                                </div>

                                <p className="text-gray-600 text-sm">Drag image(s) here or</p>

                                <label className="text-[#1976d2] text-sm font-medium cursor-pointer mt-1">
                                    Browse images
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        ) : (
                            /* PREVIEW STATE */
                            <div className="border rounded-lg p-4 relative">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-full h-[140px] object-contain mb-3"
                                />

                                <div className="flex items-center justify-between">
                                    <label className="text-[#1976d2] font-medium cursor-pointer">
                                        Change Image
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="text-gray-500 hover:text-red-600"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>






                {/* SALES & PURCHASE */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* SALES */}
                    <div
                        className={`border rounded-lg p-5 transition-colors duration-200 ${!form.sellable ? 'bg-gray-100 text-gray-400' : ''}`}
                    >
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
                                label={
                                    <>
                                        Selling Price <span style={{ color: "red" }}>*</span>
                                    </>
                                }
                                name="selling_price"
                                value={form.selling_price}
                                onChange={handleChange}
                                disabled={!form.sellable}
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




                            {/* <TextField
                                disabled={!form.sellable}
                                label="MRP"
                                name="mrp"
                                type="number"
                                placeholder="Enter MRP"
                                value={form.mrp}
                                onChange={handleChange}
                            /> */}


                            <FormControl disabled={!form.sellable} fullWidth margin="normal" sx={{ minWidth: 200 }}>
                                <InputLabel id="sales-account-label" sx={{ color: '#C72030' }}>Account<span style={{ color: '#C72030' }}>*</span></InputLabel>
                                <Select
                                    labelId="sales-account-label"
                                    name="sales_account"
                                    value={form.sales_account}
                                    label="Account*"
                                    onChange={handleChange}
                                    open={openSalesAccount}
                                    onOpen={() => setOpenSalesAccount(true)}
                                    onClose={() => setOpenSalesAccount(false)}
                                    displayEmpty
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 300,
                                                minWidth: 300,
                                                maxWidth: 400,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Account Ledger
                                    </MenuItem>
                                    {accountGroups.map(group => (
                                        group.ledgers && group.ledgers.length > 0 ? [
                                            <ListSubheader key={"group-" + group.id}>{group.group_name}</ListSubheader>,
                                            ...group.ledgers.map(ledger => (
                                                <MenuItem key={ledger.id} value={ledger.id}>
                                                    {ledger.name}
                                                </MenuItem>
                                            ))
                                        ] : null
                                    ))}
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
                    <div
                        className={`border rounded-lg p-5 transition-colors duration-200 ${!form.purchasable ? 'bg-gray-100 text-gray-400' : ''}`}
                    >
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
                                label={
                                    <>
                                        Cost Price <span style={{ color: "red" }}>*</span>
                                    </>
                                }
                                name="cost_price"
                                value={form.cost_price}
                                onChange={handleChange}
                                disabled={!form.purchasable}
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

                            <FormControl disabled={!form.purchasable} fullWidth margin="normal" sx={{ minWidth: 200 }}>
                                <InputLabel id="purchase-account-label" sx={{ color: '#C72030' }}>Account<span style={{ color: '#C72030' }}>*</span></InputLabel>
                                <Select
                                    labelId="purchase-account-label"
                                    name="purchase_account"
                                    value={form.purchase_account}
                                    label="Account*"
                                    onChange={handleChange}
                                    open={openPurchaseAccount}
                                    onOpen={() => setOpenPurchaseAccount(true)}
                                    onClose={() => setOpenPurchaseAccount(false)}
                                    displayEmpty
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 300,
                                                minWidth: 300,
                                                maxWidth: 400,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Account Ledger
                                    </MenuItem>
                                    {accountGroups.map(group => (
                                        group.ledgers && group.ledgers.length > 0 ? [
                                            <ListSubheader key={"group-" + group.id}>{group.group_name}</ListSubheader>,
                                            ...group.ledgers.map(ledger => (
                                                <MenuItem key={ledger.id} value={ledger.id}>
                                                    {ledger.name}
                                                </MenuItem>
                                            ))
                                        ] : null
                                    ))}
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

                    <Button variant="outline" onClick={() => navigate("/accounting/items")}>
                        Cancel
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default ItemsAdd;
