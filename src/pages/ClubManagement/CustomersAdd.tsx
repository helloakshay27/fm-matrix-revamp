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
import axios from "axios";


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

const TABS = [
    { key: "other", label: "Other Details" },
    { key: "address", label: "Address" },
    { key: "contact", label: "Contact Persons" },
    { key: "custom", label: "Custom Fields" },
    { key: "reporting", label: "Reporting Tags" },
    { key: "remarks", label: "Remarks" },
];


 // TAB 2 → ADDRESS
    //
    const AddressTab = ({ billing, setBilling, shipping, setShipping }) => {

        const handleBillingChange = (e) => {
            const { name, value } = e.target;
            setBilling((prev) => ({ ...prev, [name]: value }));
        };
        const handleShippingChange = (e) => {
            const { name, value } = e.target;
            setShipping((prev) => ({ ...prev, [name]: value }));
        };
        const copyBillingToShipping = () => {
            setShipping({ ...billing });
        };

        // Sample country and state options
        const countryOptions = [
            { code: 'IN', name: 'India' },
            { code: 'US', name: 'United States' },
            { code: 'GB', name: 'United Kingdom' },
        ];
        const stateOptions = {
            IN: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'],
            US: ['California', 'Texas', 'New York', 'Florida'],
            GB: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
        };
        const billingStates = stateOptions[billing.country] || [];
        const shippingStates = stateOptions[shipping.country] || [];

        return (
            <div className="grid grid-cols-2 gap-8">
                {/* Billing */}
                <div>
                    <h3 className="font-semibold mb-3">Billing Address</h3>
                    <div className="space-y-3">
                        <TextField label="Attention" name="attention" value={billing.attention} onChange={handleBillingChange} fullWidth />
                        <FormControl fullWidth>
                            <InputLabel>Country/Region</InputLabel>
                            <Select
                                name="country"
                                value={billing.country}
                                label="Country/Region"
                                onChange={handleBillingChange}
                            >
                                <MenuItem value="" disabled>Select country</MenuItem>
                                {countryOptions.map(opt => (
                                    <MenuItem key={opt.code} value={opt.code}>{opt.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField label="Street 1" name="street1" value={billing.street1} onChange={handleBillingChange} fullWidth />
                        <TextField label="Street 2" name="street2" value={billing.street2} onChange={handleBillingChange} fullWidth />
                        <TextField label="City" name="city" value={billing.city} onChange={handleBillingChange} fullWidth />
                        <FormControl fullWidth>
                            <InputLabel>State</InputLabel>
                            <Select
                                name="state"
                                value={billing.state}
                                label="State"
                                onChange={handleBillingChange}
                                disabled={!billing.country}
                            >
                                <MenuItem value="" disabled>Select state</MenuItem>
                                {billingStates.map(state => (
                                    <MenuItem key={state} value={state}>{state}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField label="Pin Code" name="pincode" value={billing.pincode} onChange={handleBillingChange} fullWidth />
                        <TextField label="Phone" name="phone" value={billing.phone} onChange={handleBillingChange} fullWidth />
                        <TextField label="Fax Number" name="fax" value={billing.fax} onChange={handleBillingChange} fullWidth />
                    </div>
                </div>

                {/* Shipping */}
                <div>
                    <h3 className="font-semibold mb-3">
                        Shipping Address
                        <span className="text-blue-600 text-sm ml-2 cursor-pointer" onClick={copyBillingToShipping}>
                            (Copy billing address)
                        </span>
                    </h3>

                    <div className="space-y-3">
                        <TextField label="Attention" name="attention" value={shipping.attention} onChange={handleShippingChange} fullWidth />
                        <FormControl fullWidth>
                            <InputLabel>Country/Region</InputLabel>
                            <Select
                                name="country"
                                value={shipping.country}
                                label="Country/Region"
                                onChange={handleShippingChange}
                            >
                                <MenuItem value="" disabled>Select country</MenuItem>
                                {countryOptions.map(opt => (
                                    <MenuItem key={opt.code} value={opt.code}>{opt.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField label="Street 1" name="street1" value={shipping.street1} onChange={handleShippingChange} fullWidth />
                        <TextField label="Street 2" name="street2" value={shipping.street2} onChange={handleShippingChange} fullWidth />
                        <TextField label="City" name="city" value={shipping.city} onChange={handleShippingChange} fullWidth />
                        <FormControl fullWidth>
                            <InputLabel>State</InputLabel>
                            <Select
                                name="state"
                                value={shipping.state}
                                label="State"
                                onChange={handleShippingChange}
                                disabled={!shipping.country}
                            >
                                <MenuItem value="" disabled>Select state</MenuItem>
                                {shippingStates.map(state => (
                                    <MenuItem key={state} value={state}>{state}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField label="Pin Code" name="pincode" value={shipping.pincode} onChange={handleShippingChange} fullWidth />
                        <TextField label="Phone" name="phone" value={shipping.phone} onChange={handleShippingChange} fullWidth />
                        <TextField label="Fax Number" name="fax" value={shipping.fax} onChange={handleShippingChange} fullWidth />
                    </div>
                </div>
            </div>
        );
    };
 const OtherDetailsTab = ({ selectedTerm, setSelectedTerm, paymentTerms, setPaymentTerms, fetchPaymentTerms, form, handleChange }) => {

        const [showMore, setShowMore] = React.useState(false);
        // paymentTerms and setPaymentTerms now come from props
        const [editTerms, setEditTerms] = React.useState([]);
        // const [selectedTerm, setSelectedTerm] = React.useState('Due on Receipt');
        const [showConfig, setShowConfig] = React.useState(false);
        const [searchTerm, setSearchTerm] = React.useState('');
        const [newRows, setNewRows] = React.useState([]); // Editable new rows
        React.useEffect(() => {
            if (showConfig) {
                setEditTerms(paymentTerms.map(term => ({ id: term.id, name: term.name, days: term.days })));
            }
        }, [showConfig]);
        const filteredTerms = paymentTerms.filter(term =>
            term.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const handleAddNewTerm = () => {
            setEditTerms([...editTerms, { name: '', days: '' }]);
        };

        const handleNewRowChange = (idx, field, value) => {
            setEditTerms(rows => rows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
        };

        const handleRemoveNewRow = (idx) => {
            setEditTerms(rows => rows.filter((_, i) => i !== idx));
        };


        const handleSaveTerms = async () => {

            // Only add valid new rows
            const validEdit = editTerms.filter(row => row.name.trim());
            setEditTerms([]);
            setShowConfig(false);
            const baseUrl = localStorage.getItem("baseUrl");
            const token = localStorage.getItem("token");

            // Build payment_terms array for API
            const paymentTermsPayload = validEdit.map(term => ({
                id: term.id ?? null,
                name: term.name,
                no_of_days: term.days || 0
            }));
            console.log("Saving Payment Terms Payload:", paymentTermsPayload);
            const payload = {
                payment_terms: paymentTermsPayload,
                lock_account_id: 1
            };

            await axios.post(
                `https://${baseUrl}/payment_terms.json?lock_account_id=1`,
                payload,
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then(res => {
                    // Optionally handle success
                })
                .catch(err => {
                    alert('Failed to save payment terms');
                });

            // Refresh payment terms list after save
            fetchPaymentTerms();
        };

        // Remove (deactivate) payment term by id
        const handleRemovePaymentTerm = async (id, idx) => {
            const baseUrl = localStorage.getItem("baseUrl");
            const token = localStorage.getItem("token");
            try {
                await axios.patch(
                    `https://${baseUrl}/payment_terms/${id}.json`,
                    { payment_term: { id, active: false } },
                    {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : undefined,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } catch (err) {
                alert('Failed to deactivate payment term');
            }
            setEditTerms(terms => terms.filter((_, i) => i !== idx));
            fetchPaymentTerms();
        };
        return (
            <div className="grid grid-cols-2 gap-4">
                {/* <TextField label="PAN" fullWidth /> */}
                <TextField
                    label="PAN"
                    name="pan"
                    value={form.pan}
                    onChange={handleChange}
                    fullWidth
                />

                {/* <TextField select label="Currency" fullWidth>
                    <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                </TextField> */}

                <TextField
                    select
                    label="Currency"
                    name="currency"
                    value={form.currency || ""}
                    onChange={handleChange}
                    fullWidth
                >
                    <MenuItem value="">Select currency</MenuItem>
                    <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                </TextField>


                <TextField label="Opening Balance" fullWidth />

                {/* Payment Terms dropdown with search and configure */}
                <FormControl fullWidth>
                    <InputLabel>Payment Terms</InputLabel>
                    <Select
                        value={selectedTerm}
                        label="Payment Terms"
                        onChange={e => setSelectedTerm(e.target.value)}
                        renderValue={val => val}
                    >
                        <MenuItem value="" disabled>Search or select payment term</MenuItem>
                        {/* <MenuItem>
                            <TextField
                                placeholder="Search Payment Terms"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                size="small"
                                fullWidth
                            />
                        </MenuItem> */}
                        {filteredTerms.map(term => (
                            <MenuItem key={term.name} value={term.name}>{term.name}</MenuItem>
                        ))}
                        <MenuItem>
                            <span className="text-blue-600 cursor-pointer" onClick={() => setShowConfig(true)}>
                                Configure Terms
                            </span>
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* Configure Payment Terms Modal */}
                {showConfig && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Configure Payment Terms</h2>
                            <table className="w-full mb-4 text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Term Name</th>
                                        <th className="p-2 border">Number of Days</th>
                                        <th className="p-2 border"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editTerms.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="border p-2">
                                                <input
                                                    className="border rounded px-2 py-1 w-full"
                                                    placeholder="Term Name"
                                                    value={row.name}
                                                    onChange={e => handleNewRowChange(idx, 'name', e.target.value)}
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <input
                                                    className="border rounded px-2 py-1 w-full"
                                                    placeholder="Days"
                                                    type="number"
                                                    value={row.days}
                                                    onChange={e => handleNewRowChange(idx, 'days', e.target.value)}
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <button className="text-red-600 text-xs" onClick={async () => {
                                                    if (row.id) {
                                                        await handleRemovePaymentTerm(row.id, idx);
                                                    } else {
                                                        handleRemoveNewRow(idx);
                                                    }
                                                }}>Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex gap-2 mb-2">
                                <button
                                    className="text-blue-600 text-sm"
                                    onClick={handleAddNewTerm}
                                >
                                    + Add New
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 rounded"
                                    onClick={handleSaveTerms}
                                >
                                    Save
                                </button>
                                <button
                                    className="bg-gray-200 px-4 py-2 rounded"
                                    onClick={() => {
                                        setEditTerms(paymentTerms.map(term => ({ ...term })));
                                        setShowConfig(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Documents upload */}
                <div className="col-span-2 flex items-center gap-4">
                    <label className="font-medium">Documents</label>
                    <input type="file" multiple className="border rounded px-2 py-1" />
                    <span className="text-xs text-gray-500">You can upload a maximum of 10 files, 10MB each</span>
                </div>

                <div className="col-span-2">
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Allow portal access for this customer"
                    />
                </div>

                {/* More Details toggle */}
                <div className="col-span-2">
                    <span className="text-blue-600 text-sm cursor-pointer" onClick={() => setShowMore(v => !v)}>
                        {showMore ? 'Hide More Details' : 'Add More Details'}
                    </span>
                </div>

                {showMore && (
                    <>
                        <TextField label="Website URL" fullWidth placeholder="ex: www.zylker.com" />
                        <TextField label="Department" fullWidth />
                        <TextField label="Designation" fullWidth />

                        {/* X (social link) */}
                        <div className="col-span-1">
                            <TextField
                                label="X"
                                placeholder="https://x.com/username"
                                fullWidth
                            />
                        </div>

                        {/* Skype Name/Number */}
                        <div className="col-span-1">
                            <TextField
                                label="Skype Name/Number"
                                placeholder="Skype ID or number"
                                fullWidth
                            />
                        </div>

                        {/* Facebook */}
                        <div className="col-span-1">
                            <TextField
                                label="Facebook"
                                placeholder="http://www.facebook.com/username"
                                fullWidth
                            />
                        </div>
                    </>
                )}

                {/* Customer Owner info (display only) */}
                {/* <div className="col-span-2 text-xs text-gray-500 mt-2">
                    Customer Owner: Assign a user as the customer owner to provide access only to the data of this customer. <a href="#" className="text-blue-600">Learn More</a>
                </div> */}
            </div>
        );
    };

    //
   
    //
    // TAB 3 → CONTACT PERSONS
    //
    const ContactPersonsTab = ({ rows, setRows }) => {
        // const [rows, setRows] = React.useState([
        //     { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' }
        // ]);

        const handleRowChange = (idx, field, value) => {
            setRows(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
        };

        const handleAddRow = () => {
            setRows(prev => [...prev, { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' }]);
        };

        const handleDeleteRow = (idx) => {
            setRows(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx));
        };

        return (
            <div>
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Salutation</th>
                            <th className="p-2 border">First Name</th>
                            <th className="p-2 border">Last Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Work Phone</th>
                            <th className="p-2 border">Mobile</th>
                            <th className="p-2 border"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                <td className="border p-2">
                                    <select
                                        className="border rounded px-2 py-1 w-full"
                                        value={row.salutation}
                                        onChange={e => handleRowChange(idx, 'salutation', e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="Mr">Mr</option>
                                        <option value="Ms">Ms</option>
                                        <option value="Mrs">Mrs</option>
                                    </select>
                                </td>
                                <td className="border p-2">
                                    <input
                                        className="border rounded px-2 py-1 w-full"
                                        value={row.firstName}
                                        onChange={e => handleRowChange(idx, 'firstName', e.target.value)}
                                        placeholder="First Name"
                                    />
                                </td>
                                <td className="border p-2">
                                    <input
                                        className="border rounded px-2 py-1 w-full"
                                        value={row.lastName}
                                        onChange={e => handleRowChange(idx, 'lastName', e.target.value)}
                                        placeholder="Last Name"
                                    />
                                </td>
                                <td className="border p-2">
                                    <input
                                        className="border rounded px-2 py-1 w-full"
                                        value={row.email}
                                        onChange={e => handleRowChange(idx, 'email', e.target.value)}
                                        placeholder="Email"
                                        type="email"
                                    />
                                </td>
                                <td className="border p-2">
                                    <input
                                        className="border rounded px-2 py-1 w-full"
                                        value={row.workPhone}
                                        onChange={e => handleRowChange(idx, 'workPhone', e.target.value)}
                                        placeholder="Work Phone"
                                        type="tel"
                                    />
                                </td>
                                <td className="border p-2">
                                    <input
                                        className="border rounded px-2 py-1 w-full"
                                        value={row.mobile}
                                        onChange={e => handleRowChange(idx, 'mobile', e.target.value)}
                                        placeholder="Mobile"
                                        type="tel"
                                    />
                                </td>
                                <td className="border p-2 text-center">
                                    <button
                                        type="button"
                                        className="text-red-500 text-lg px-2"
                                        onClick={() => handleDeleteRow(idx)}
                                        title="Delete Row"
                                        disabled={rows.length === 1}
                                    >
                                        &#10005;
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    type="button"
                    className="mt-3 text-blue-600 text-sm"
                    onClick={handleAddRow}
                >
                    + Add Contact Person
                </button>
            </div>
        );
    };

    const CustomFieldsTab = () => (
        <div className="text-sm text-gray-500">
            No custom fields configured.
        </div>
    );
    const ReportingTagsTab = () => (
        <div className="text-sm text-gray-500">
            No reporting tags available.
        </div>
    );

    const RemarksTab = ({ remarks, setRemarks }) => (
        <TextField
            label="Remarks"
            multiline
            rows={4}
            fullWidth
            placeholder="Enter remarks"
        />
    );

const CustomersAdd = () => {
    // Payment Terms state and fetch logic lifted to parent
    // const [paymentTerms, setPaymentTerms] = React.useState([]);
    // const fetchPaymentTerms = React.useCallback(async () => {
    const fetchPaymentTerms = async () => {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        try {
            const res = await axios?.get?.(
                `https://${baseUrl}/payment_terms.json?lock_account_id=1`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res && res.data && Array.isArray(res.data)) {
                setPaymentTerms(res.data.map(pt => ({ id: pt.id, name: pt.name, days: pt.no_of_days })));
            }
        } catch (err) {
            // Optionally handle error
        }
    };
    React.useEffect(() => {
        fetchPaymentTerms();
    }, []);
    // React.useEffect(() => {
    //     fetchPaymentTerms();
    // }, [fetchPaymentTerms]);
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    const [activeTab, setActiveTab] = useState("other");
    const [form, setForm] = useState({
        customer_type: "business",
        salutation: "",
        first_name: "",
        last_name: "",
        company_name: "",
        display_name: "",
        email: "",
        work_phone: "",
        mobile: "",
        language: "English",
        currency: "INR",
        pan: "",
        opening_balance: 0,
        enable_portal: false,
        remarks: "",
    });

    // ADDRESS
    const [billing, setBilling] = useState({
        attention: "",
        country: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        fax: "",
    });

    const [shipping, setShipping] = useState({
        attention: "",
        country: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        fax: "",
        mobile: "",
        email: "",
    });

    // CONTACT PERSONS
    const [contactPersons, setContactPersons] = useState([
        { salutation: "", firstName: "", lastName: "", email: "", workPhone: "", mobile: "" }
    ]);

    // REMARKS
    const [remarks, setRemarks] = useState("");

    // PAYMENT TERM
    const [selectedTerm, setSelectedTerm] = useState("");

    // Lift paymentTerms state to CustomersAdd
    const [paymentTerms, setPaymentTerms] = React.useState([]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };


   
    const handleSubmit = () => {
        // Build customer payload for API from all tabs
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");

        // Get payment term id
        const paymentTerm = paymentTerms.find(pt => pt.name === selectedTerm);
        const payment_term_id = paymentTerm ? paymentTerm.id : null;

        // Use lifted billing, shipping, contactPersons, remarks state
        const billingPayload = {
            attention: billing.attention || '',
            address: billing.street1 || '',
            active: true,
            address_line_two: billing.street2 || '',
            address_line_three: '',
            country: billing.country || 'India',
            state: billing.state || '',
            city: billing.city || '',
            pin_code: billing.pincode || '',
            telephone_number: billing.phone || '',
            fax_number: billing.fax || '',
            mobile: form.mobile || '',
            contact_person: billing.attention || ''
        };

        const shippingPayload = {
            attention: shipping.attention || '',
            address: shipping.street1 || '',
            active: true,
            email: shipping.email || '',
            address_line_two: shipping.street2 || '',
            address_line_three: '',
            country: shipping.country || 'India',
            state: shipping.state || '',
            city: shipping.city || '',
            pin_code: shipping.pincode || '',
            telephone_number: shipping.phone || '',
            fax_number: shipping.fax || '',
            mobile: shipping.mobile || '',
            contact_person: shipping.attention || ''
        };

        const contactPersonsPayload = contactPersons.map(row => ({
            first_name: row.firstName,
            last_name: row.lastName,
            salutation: row.salutation,
            email: row.email,
            mobile: row.mobile,
            work_phone: row.workPhone
        }));

        // Use lifted remarks state
        const remarksPayload = remarks || '';

        // Build main payload
        const payload = {
            lock_account_customer: {
                customer_type: form.customer_type,
                company_name: form.company_name,
                name: form.display_name || form.company_name,
                salutation: form.salutation,
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                mobile: form.mobile,
                work_phone: form.work_phone,
                pan: form.pan || '',
                language_code: 'en',
                currency_code: 'INR',
                opening_balance: form.opening_balance || 0,
                payment_term_id,
                enable_portal: form.enable_portal || false,
                remarks: remarksPayload,
                billing_address_attributes: billingPayload,
                shipping_address_attributes: shippingPayload,
                contact_persons_attributes: contactPersonsPayload
            }
        };
        console.log("Submitting Customer Payload:", payload);
        axios.post(
            `https://${baseUrl}/lock_account_customers.json?lock_account_id=1`,
            payload,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(res => {
                toast.success("Customer saved successfully!");
                navigate("/accounting/customers");
            })
            .catch(err => {
                toast.error("Failed to save customer");
                console.error("Customer save error:", err);
            });
    };


    return (
        <ThemeProvider theme={muiTheme}>
            <div className="p-6 bg-white min-h-screen">
                <h1 className="text-2xl font-semibold mb-6">New Customer</h1>

                {/* CUSTOMER TYPE */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="font-medium w-40">Customer Type</div>

                    <RadioGroup
                        row
                        name="customer_type"
                        value={form.customer_type}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="business" control={<Radio />} label="Business" />
                        <FormControlLabel value="individual" control={<Radio />} label="Individual" />
                    </RadioGroup>
                </div>

                {/* PRIMARY CONTACT */}
                <div className="grid md:grid-cols-[160px_1fr] items-center gap-4 mb-4">
                    <div>Primary Contact</div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <FormControl>
                            <InputLabel>Salutation</InputLabel>
                            <Select
                                name="salutation"
                                value={form.salutation}
                                label="Salutation"
                                onChange={handleChange}
                            >
                                <MenuItem value="Mr">Mr</MenuItem>
                                <MenuItem value="Ms">Ms</MenuItem>
                                <MenuItem value="Mrs">Mrs</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            name="first_name"
                            label="First Name"
                            value={form.first_name}
                            onChange={handleChange}
                        />

                        <TextField
                            name="last_name"
                            label="Last Name"
                            value={form.last_name}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* COMPANY NAME */}
                <div className="grid md:grid-cols-[160px_1fr] items-center gap-4 mb-4">
                    <div>Company Name</div>
                    <TextField
                        name="company_name"
                        value={form.company_name}
                        onChange={handleChange}
                    />
                </div>

                {/* DISPLAY NAME */}
                <div className="grid md:grid-cols-[160px_1fr] items-center gap-4 mb-4">
                    <div className="text-red-600">Display Name *</div>
                    <TextField
                        name="display_name"
                        placeholder="Select or type to add"
                        value={form.display_name}
                        onChange={handleChange}
                    />
                </div>

                {/* EMAIL */}
                <div className="grid md:grid-cols-[160px_1fr] items-center gap-4 mb-4">
                    <div>Email Address</div>
                    <TextField
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>

                {/* PHONE */}
                <div className="grid md:grid-cols-[160px_1fr] items-center gap-4 mb-4">
                    <div>Phone</div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <TextField
                            name="work_phone"
                            label="Work Phone"
                            value={form.work_phone}
                            onChange={handleChange}
                        />

                        <TextField
                            name="mobile"
                            label="Mobile"
                            value={form.mobile}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* LANGUAGE */}
                <div className="grid md:grid-cols-[160px_1fr] items-center gap-4 mb-6">
                    <div>Customer Language</div>
                    <FormControl>
                        <Select
                            name="language"
                            value={form.language}
                            onChange={handleChange}
                        >
                            <MenuItem value="English">English</MenuItem>
                            <MenuItem value="Hindi">Hindi</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* TABS PLACEHOLDER */}
                {/* <div className="p-4"> */}
                {/* Tabs Header */}
                <div className="bg-white rounded-lg border p-6 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-b mb-6">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-3 text-sm font-semibold transition-colors
                ${activeTab === tab.key
                                        ? "text-[#C72030] border-b-2 border-[#C72030] bg-[#f9f7f2]/50"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}
              `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    {/* </div> */}

                    {/* Tab Content */}
                    {/* <div className="mt-4">
                        {activeTab === "other" && <OtherDetailsTab />}
                        {activeTab === "address" && <AddressTab />}
                        {activeTab === "contact" && <ContactPersonsTab />}

                        {activeTab === "custom" && <CustomFieldsTab />}
                        {activeTab === "reporting" && <ReportingTagsTab />}
                        {activeTab === "remarks" && <RemarksTab />}

                    </div> */}

                    {activeTab === "other" && (
                        <OtherDetailsTab
                            selectedTerm={selectedTerm}
                            setSelectedTerm={setSelectedTerm}
                            paymentTerms={paymentTerms}
                            setPaymentTerms={setPaymentTerms}
                            fetchPaymentTerms={fetchPaymentTerms}
                            form={form}
                            handleChange={handleChange}
                        />
                    )}

                    {activeTab === "address" && (
                        <AddressTab
                            billing={billing}
                            setBilling={setBilling}
                            shipping={shipping}
                            setShipping={setShipping}
                        />
                    )}

                    {activeTab === "contact" && (
                        <ContactPersonsTab
                            rows={contactPersons}
                            setRows={setContactPersons}
                        />
                    )}

                    {activeTab === "custom" && <CustomFieldsTab />}
                    {activeTab === "reporting" && <ReportingTagsTab />}

                    {activeTab === "remarks" && (
                        <RemarksTab remarks={remarks} setRemarks={setRemarks} />
                    )}
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#C72030] hover:bg-[#A01020] text-white"
                    >
                        Save
                    </Button>

                    <Button variant="outline" onClick={() => navigate("/accounting/customers")}>
                        Cancel
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
};


export default CustomersAdd;
