import React, { useState, useEffect } from "react";
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
import {
  Plus,
  Eye,
  Filter,
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Download,
  Edit,
  Trash2,
  Settings,
  Upload,
  Flag,
  Star,
  ArrowLeft,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

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

interface Customer {
  id: string;
  name: string;
  // email: string;
  // currency: string;
  // billingAddress: string;
  // shippingAddress: string;
  // customerType: string;
  // paymentTerms: string;
  // portalStatus: string;
  // language: string;
  // outstandingReceivables: number;
  // unusedCredits: number;
  // contactPersons: ContactPerson[];
}

const ItemsAdd = () => {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [form, setForm] = useState({
    type: "goods",
    name: "",
    unit: "",
    sku: "",

    hsn_code: "",
    sac_code: "",

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

    tax_preference: "",
    intra_state_tax: "",
    inter_state_tax: "",
    exemption_reason: "",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Account groups and ledgers for sales/purchase account dropdowns
  const [salesAccountGroups, setSalesAccountGroups] = React.useState([]);
  const [purchaseAccountGroups, setPurchaseAccountGroups] = React.useState([]);
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");
  const [openSalesAccount, setOpenSalesAccount] = React.useState(false);
  const [openPurchaseAccount, setOpenPurchaseAccount] = React.useState(false);
  const [exemptions, setExemptions] = useState([]);
  const [taxSettings, setTaxSettings] = useState<any | null>(null);

  React.useEffect(() => {
    const fetchSalesAccountGroups = async () => {
      try {
        const res = await axios.get(
          `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_groups?format=flat&q[group_type_in][]=sales&q[group_type_in][]=both`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSalesAccountGroups(res.data.data || []);
      } catch (e) {
        setSalesAccountGroups([]);
      }
    };
    fetchSalesAccountGroups();
  }, [baseUrl, token, lock_account_id]);

  React.useEffect(() => {
    const fetchPurchaseAccountGroups = async () => {
      try {
        const res = await axios.get(
          `https://${baseUrl}/lock_accounts/${lock_account_id}/lock_account_groups?format=flat&q[group_type_in][]=purchase&q[group_type_in][]=both`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPurchaseAccountGroups(res.data.data || []);
      } catch (e) {
        setPurchaseAccountGroups([]);
      }
    };
    fetchPurchaseAccountGroups();
  }, [baseUrl, token, lock_account_id]);
  React.useEffect(() => {
    const fetchExemptions = async () => {
      try {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://${baseUrl}/tax_exemptions.json?lock_account_id=${lock_account_id}&q[exemption_type_eq]=item`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );

        console.log("Exemptions:", res.data);
        setExemptions(res.data || []); // adjust path if different
      } catch (err) {
        console.error("Failed to fetch tax exemptions", err);
        setExemptions([]);
      }
    };

    fetchExemptions();
  }, []);

  React.useEffect(() => {
    const fetchTaxSettings = async () => {
      try {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://${baseUrl}/lock_accounts/${lock_account_id}/tax_settings.json`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );

        console.log("Tax settings:", res.data);
        setTaxSettings(res.data || null); // adjust based on response
      } catch (err) {
        console.error("Failed to fetch tax settings", err);
        setTaxSettings(null);
      }
    };

    fetchTaxSettings();
  }, []);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  useEffect(() => {
    setLoadingCustomers(true);

    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    axios
      .get(`https://${baseUrl}/pms/suppliers.json`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("suppliers:", res);
        setCustomers(res?.data?.pms_suppliers || []);
      })
      .catch((err) => {
        console.error("Supplier API error", err);
      })
      .finally(() => {
        setLoadingCustomers(false);
      });
  }, []);
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
      sale_mrp: form.mrp,
      can_be_sold: form.sellable,
      can_be_purchased: form.purchasable,
      track_inventory: false,
    },
  };
  console.log("Payload for Item submission:", payload);
  const handleSubmit = () => {
    // Validation
    if (!form.name.trim()) {
      toast.error("Please mention the item name.");
      return;
    }
    if (!form.sellable && !form.purchasable) {
      toast.error(
        "Select at least one option from, Sales Information, Purchase Information to proceed."
      );
      return;
    }

    if (!form.tax_preference) {
      toast.error("Please select Tax Preference");
      return;
    }

    // ✅ If Non-Taxable
    if (form.tax_preference === "non_taxable") {
      if (!form.exemption_reason) {
        toast.error("Please select Exemption Reason");
        return;
      }
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
      if (
        form.mrp &&
        !isNaN(Number(form.mrp)) &&
        Number(form.selling_price) > Number(form.mrp)
      ) {
        toast.error("Selling Price cannot be greater than MRP.");
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
    // const itemPayload = {
    //     name: form.name,
    //     sku: form.sku,
    //     product_type: form.type,
    //     pms_supplier_id: form.preferred_vendor,
    //     unit: form.unit,
    //     can_be_sold: form.sellable,
    //     can_be_purchased: form.purchasable,
    //     track_inventory: false,
    //     tax_preference: form.tax_preference,
    // };
    // HSN for Goods
    // if (form.type === "goods") {
    //     itemPayload.hsn_code = form.hsn_code;
    // }

    // // SAC for Service
    // if (form.type === "service") {
    //     itemPayload.sac = form.sac_code;
    // }
    // if (form.tax_preference === "taxable" && taxSettings) {
    //     itemPayload.intra_state_tax_rate_id =
    //         taxSettings.intra_state_tax_rate_id;

    //     itemPayload.inter_state_tax_rate_id =
    //         taxSettings.inter_state_tax_rate_id;
    // }

    // if (form.tax_preference === "non_taxable") {
    //     itemPayload.tax_exemption_id = form.exemption_reason;
    // }
    // if (form.sellable) {
    //     itemPayload.sale_description = form.sales_description;
    //     itemPayload.sale_rate = form.selling_price;
    //     itemPayload.sale_lock_account_ledger_id = form.sales_account;
    //     itemPayload.sale_mrp = form.mrp;
    // }
    // if (form.purchasable) {
    //     itemPayload.purchase_description = form.purchase_description;
    //     itemPayload.purchase_rate = form.cost_price;
    //     itemPayload.purchase_lock_account_ledger_id = form.purchase_account;
    // }
    // const payload = {
    //     lock_account_item: itemPayload,
    //     lock_account_id: "1"
    // };

    const formData = new FormData();
    formData.append("lock_account_item[name]", form.name);
    formData.append("lock_account_item[sku]", form.sku);
    formData.append("lock_account_item[product_type]", form.type);
    formData.append(
      "lock_account_item[pms_supplier_id]",
      form.preferred_vendor
    );
    formData.append("lock_account_item[unit]", form.unit);
    formData.append("lock_account_item[can_be_sold]", form.sellable);
    formData.append("lock_account_item[can_be_purchased]", form.purchasable);
    formData.append("lock_account_item[track_inventory]", "false");
    formData.append("lock_account_item[tax_preference]", form.tax_preference);
    if (form.type === "goods") {
      formData.append("lock_account_item[hsn_code]", form.hsn_code);
    }

    if (form.type === "service") {
      formData.append("lock_account_item[sac]", form.sac_code);
    }

    if (form.tax_preference === "taxable" && taxSettings) {
      formData.append(
        "lock_account_item[intra_state_tax_rate_id]",
        taxSettings.intra_state_tax_rate_id
      );

      formData.append(
        "lock_account_item[inter_state_tax_rate_id]",
        taxSettings.inter_state_tax_rate_id
      );
    }

    if (form.tax_preference === "non_taxable") {
      formData.append(
        "lock_account_item[tax_exemption_id]",
        form.exemption_reason
      );
    }

    if (form.sellable) {
      formData.append(
        "lock_account_item[sale_description]",
        form.sales_description
      );
      formData.append("lock_account_item[sale_rate]", form.selling_price);
      formData.append(
        "lock_account_item[sale_lock_account_ledger_id]",
        form.sales_account
      );
      formData.append("lock_account_item[sale_mrp]", form.mrp);
    }
    if (form.purchasable) {
      formData.append(
        "lock_account_item[purchase_description]",
        form.purchase_description
      );
      formData.append("lock_account_item[purchase_rate]", form.cost_price);
      formData.append(
        "lock_account_item[purchase_lock_account_ledger_id]",
        form.purchase_account
      );
    }

    if (image) {
      formData.append("lock_account_item[icon_attributes][document]", image);
    }

    formData.append("lock_account_item[icon_attributes][active]", "true");
    formData.append("lock_account_id", lock_account_id);
    axios
      .post(
        `https://${baseUrl}/lock_account_items.json`,
        // payload,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      )
      .then((res) => {
        toast.success("Item saved successfully!");
        navigate("/accounting/items");
      })
      .catch((err) => {
        console.error("Item save error:", err);
        const errors = err?.response?.data;
        if (errors && typeof errors === "object") {
          const messages = Object.entries(errors)
            .map(
              ([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`
            )
            .join("\n");
          toast.error(messages);
        } else {
          toast.error("Failed to save item");
        }
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
    setOpenDeleteDialog(false);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="p-6 bg-white min-h-screen">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/accounting/items")}
            className="p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Items List
          </Button>
        </div>
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
            <FormControlLabel value="goods" control={<Radio />} label="Goods" />

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
              InputLabelProps={{ shrink: true }}
            />

            {/* SKU  ✅ NEW */}
            <TextField
              label="SKU"
              name="sku"
              placeholder="Enter SKU"
              value={form.sku}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            {/* UNIT */}
            <FormControl>
              <InputLabel>Usage Unit</InputLabel>
              <Select
                name="unit"
                value={form.unit}
                label="Usage Unit"
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="">Select unit</MenuItem>
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

            {/* HSN / SAC Code */}
            {form.type === "goods" ? (
              <TextField
                label="HSN Code"
                name="hsn_code"
                placeholder="Enter HSN Code"
                value={form.hsn_code}
                // onChange={handleChange}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow only numbers and max 8 digits
                  if (/^\d{0,8}$/.test(value)) {
                    handleChange(e);
                  }
                }}
                inputProps={{
                  maxLength: 8,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <TextField
                label="SAC"
                name="sac_code"
                placeholder="Enter SAC Code"
                value={form.sac_code}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            )}

            <FormControl fullWidth>
              <InputLabel>
                Tax Preference <span style={{ color: "red" }}>*</span>{" "}
              </InputLabel>
              <Select
                name="tax_preference"
                value={form.tax_preference}
                label="Tax Preference"
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    tax_preference: value,
                    intra_state_tax: "",
                    inter_state_tax: "",
                    exemption_reason: "",
                  }));
                }}
                displayEmpty
              >
                <MenuItem value=""> Select Tax Preference</MenuItem>
                <MenuItem value="taxable">Taxable</MenuItem>
                <MenuItem value="non_taxable">Non-Taxable</MenuItem>
                <MenuItem value="out_of_scope">Out of Scope</MenuItem>
                <MenuItem value="non_gst_supply">Non-GST Supply</MenuItem>
              </Select>
            </FormControl>

            {form.tax_preference === "non_taxable" && (
              <div className="mt-4">
                <FormControl fullWidth>
                  <InputLabel>
                    Exemption Reason <span style={{ color: "red" }}>*</span>
                  </InputLabel>
                  <Select
                    name="exemption_reason"
                    value={form.exemption_reason}
                    label="Exemption Reason"
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="">Select exemption reason</MenuItem>

                    {exemptions.map((ex) => (
                      <MenuItem key={ex.id} value={ex.id}>
                        {ex.reason}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
            {console.log("exemptions:", exemptions)}
          </div>

          {/* RIGHT SIDE ATTACHMENT */}
          <div>
            {!preview ? (
              /* EMPTY STATE */
              <div className="border-2 border-dashed rounded-lg min-h-[200px] flex flex-col items-center justify-center text-center p-6">
                <div className="text-gray-400 mb-2">
                  <svg
                    width="40"
                    height="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
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
                    // onClick={handleRemoveImage}
                    onClick={() => setOpenDeleteDialog(true)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
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
            className={`border rounded-lg p-5 transition-colors duration-200 ${!form.sellable ? "bg-gray-100 text-gray-400" : ""}`}
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

              {/* <TextField
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
                InputLabelProps={{ shrink: true }}
                value={form.selling_price}
                disabled={!form.sellable}
                onChange={(e) => {
                  let value = e.target.value;

                  // Remove anything except numbers and dot
                  value = value.replace(/[^0-9.]/g, "");

                  // Prevent multiple dots
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts[1];
                  }

                  // Allow only 2 decimal places
                  if (parts[1]?.length > 2) {
                    value = parts[0] + "." + parts[1].slice(0, 2);
                  }

                  setForm((prev) => ({
                    ...prev,
                    selling_price: value,
                  }));
                }}
                onBlur={() => {
                  if (form.selling_price) {
                    setForm((prev) => ({
                      ...prev,
                      selling_price: Number(prev.selling_price).toFixed(2),
                    }));
                  }
                }}
                inputProps={{
                  inputMode: "decimal",
                  pattern: "^\\d*(\\.\\d{0,2})?$",
                }}
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

              {/* <TextField
                                disabled={!form.sellable}
                                label="MRP"
                                name="mrp"
                                type="number"
                                placeholder="Enter MRP"
                                value={form.mrp}
                                onChange={handleChange}
                            /> */}

              <TextField
                disabled={!form.sellable}
                label="MRP"
                name="mrp"
                placeholder="Enter MRP"
                value={form.mrp}
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  let value = e.target.value;

                  // Remove everything except numbers and dot
                  value = value.replace(/[^0-9.]/g, "");

                  const parts = value.split(".");

                  // Prevent multiple dots
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts[1];
                  }

                  // Allow only 2 decimal places
                  if (parts[1]?.length > 2) {
                    value = parts[0] + "." + parts[1].slice(0, 2);
                  }

                  setForm((prev) => ({
                    ...prev,
                    mrp: value,
                  }));
                }}
                onBlur={() => {
                  if (form.mrp) {
                    setForm((prev) => ({
                      ...prev,
                      mrp: Number(prev.mrp).toFixed(2),
                    }));
                  }
                }}
                inputProps={{
                  inputMode: "decimal",
                  pattern: "^\\d*(\\.\\d{0,2})?$",
                }}
              />

              <FormControl
                disabled={!form.sellable}
                fullWidth
                margin="normal"
                sx={{ minWidth: 200 }}
              >
                <InputLabel id="sales-account-label" sx={{ color: "#C72030" }}>
                  Account<span style={{ color: "#C72030" }}>*</span>
                </InputLabel>
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
                  <MenuItem value="">Select Account Ledger</MenuItem>
                  {salesAccountGroups.map((group) =>
                    group.ledgers && group.ledgers.length > 0
                      ? [
                          <ListSubheader key={"group-" + group.id}>
                            {group.group_name}
                          </ListSubheader>,
                          ...group.ledgers.map((ledger) => (
                            <MenuItem key={ledger.id} value={ledger.id}>
                              {ledger.name}
                            </MenuItem>
                          )),
                        ]
                      : null
                  )}
                </Select>
              </FormControl>

              {/* <TextField
                                disabled={!form.sellable}
                                label="Description"
                                name="sales_description"
                                placeholder="Enter sales description"
                                value={form.sales_description}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            /> */}

              <TextField
                disabled={!form.sellable}
                label={<span>Description</span>}
                name="sales_description"
                placeholder="Enter sales description"
                value={form.sales_description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    sales_description: e.target.value,
                  }))
                }
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                InputLabelProps={{ shrink: true }}
                inputProps={{ maxLength: 500 }}
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    height: "auto !important",
                    padding: "2px !important",
                    display: "flex",
                  },
                  "& .MuiInputBase-input[aria-hidden='true']": {
                    flex: 0,
                    width: 0,
                    height: 0,
                    padding: "0 !important",
                    margin: 0,
                    display: "none",
                  },
                  "& textarea": {
                    resize: "none !important", // ✅ removes expand icon
                  },
                }}
                helperText={
                  <span style={{ textAlign: "right", display: "block" }}>
                    {`${form.sales_description?.length || 0}/500 characters`}
                  </span>
                }
                error={(form.sales_description?.length || 0) > 500}
              />
            </div>
          </div>

          {/* PURCHASE */}
          <div
            className={`border rounded-lg p-5 transition-colors duration-200 ${!form.purchasable ? "bg-gray-100 text-gray-400" : ""}`}
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

              {/* <TextField
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
                disabled={!form.purchasable}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  let value = e.target.value;

                  // Remove everything except numbers and dot
                  value = value.replace(/[^0-9.]/g, "");

                  const parts = value.split(".");

                  // Prevent multiple dots
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts[1];
                  }

                  // Allow only 2 decimal places
                  if (parts[1]?.length > 2) {
                    value = parts[0] + "." + parts[1].slice(0, 2);
                  }

                  setForm((prev) => ({
                    ...prev,
                    cost_price: value,
                  }));
                }}
                onBlur={() => {
                  if (form.cost_price) {
                    setForm((prev) => ({
                      ...prev,
                      cost_price: Number(prev.cost_price).toFixed(2),
                    }));
                  }
                }}
                inputProps={{
                  inputMode: "decimal",
                  pattern: "^\\d*(\\.\\d{0,2})?$",
                }}
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
              <FormControl
                disabled={!form.purchasable}
                fullWidth
                margin="normal"
                sx={{ minWidth: 200 }}
              >
                <InputLabel
                  id="purchase-account-label"
                  sx={{ color: "#C72030" }}
                >
                  Account<span style={{ color: "#C72030" }}>*</span>
                </InputLabel>
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
                  <MenuItem value="">Select Account Ledger</MenuItem>
                  {purchaseAccountGroups.map((group) =>
                    group.ledgers && group.ledgers.length > 0
                      ? [
                          <ListSubheader key={"group-" + group.id}>
                            {group.group_name}
                          </ListSubheader>,
                          ...group.ledgers.map((ledger) => (
                            <MenuItem key={ledger.id} value={ledger.id}>
                              {ledger.name}
                            </MenuItem>
                          )),
                        ]
                      : null
                  )}
                </Select>
              </FormControl>

              {/* <TextField
                                disabled={!form.purchasable}
                                label="Description"
                                name="purchase_description"
                                value={form.purchase_description}
                                placeholder="Enter purchase description"
                                onChange={handleChange}
                                multiline
                                rows={3}
                            /> */}

              <TextField
                disabled={!form.purchasable}
                label={<span>Description</span>}
                name="purchase_description"
                value={form.purchase_description}
                placeholder="Enter purchase description"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    purchase_description: e.target.value,
                  }))
                }
                variant="outlined"
                fullWidth
                multiline
                // InputLabelProps={{ shrink: true }}
                rows={4}
                InputLabelProps={{ shrink: true }}
                inputProps={{ maxLength: 500 }}
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    height: "auto !important",
                    padding: "2px !important",
                    display: "flex",
                  },
                  "& .MuiInputBase-input[aria-hidden='true']": {
                    flex: 0,
                    width: 0,
                    height: 0,
                    padding: "0 !important",
                    margin: 0,
                    display: "none",
                  },
                  "& textarea": {
                    resize: "none !important", // ✅ removes resize icon
                  },
                }}
                helperText={
                  <span style={{ textAlign: "right", display: "block" }}>
                    {`${form.purchase_description?.length || 0}/500 characters`}
                  </span>
                }
                error={(form.purchase_description?.length || 0) > 500}
              />

              <FormControl disabled={!form.purchasable}>
                <InputLabel>Preferred Vendor</InputLabel>
                <Select
                  name="preferred_vendor"
                  value={form.preferred_vendor}
                  label="Preferred Vendor"
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">Select vendor</MenuItem>
                  {/* <MenuItem value="Vendor 1">Vendor 1</MenuItem>
                                    <MenuItem value="Vendor 2">Vendor 2</MenuItem> */}
                  {customers.map((supplier: any) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.company_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        {form.tax_preference === "taxable" && taxSettings && (
          <div className="grid md:grid-cols-2 gap-6 mt-4 p-4 border rounded-lg bg-gray-50">
            <div className="md:col-span-2 font-semibold text-gray-700">
              Default Tax Rates
            </div>

            {/* Intra State Tax (CGST + SGST) */}
            <TextField
              label="Intra State Tax Rate"
              value={taxSettings.intra_state_tax_rate || "-"}
              disabled
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            {/* Inter State Tax (IGST) */}
            <TextField
              label="Inter State Tax Rate"
              value={taxSettings.inter_state_tax_rate || "-"}
              disabled
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </div>
        )}
        {/* BUTTONS */}
        <div className="flex gap-3 mt-10 mb-5 justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            Save
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/accounting/items")}
          >
            Cancel
          </Button>
        </div>
      </div>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Image</DialogTitle>

        <DialogContent>Are you sure about deleting this image?</DialogContent>

        <DialogActions>
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={handleRemoveImage}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ItemsAdd;
