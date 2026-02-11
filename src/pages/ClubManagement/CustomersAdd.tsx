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

const TABS = [
  { key: "other", label: "Other Details" },
  { key: "address", label: "Address" },
  { key: "contact", label: "Contact Persons" },
  { key: "custom", label: "Custom Fields" },
  { key: "reporting", label: "Reporting Tags" },
  { key: "remarks", label: "Remarks" },
];

const CustomersAdd = () => {
  const navigate = useNavigate();
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
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };


  const OtherDetailsTab = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <TextField label="PAN" fullWidth />

      <TextField select label="Currency" fullWidth>
        <MenuItem value="INR">INR - Indian Rupee</MenuItem>
      </TextField>

      <TextField label="Opening Balance" fullWidth />

      <TextField select label="Payment Terms" fullWidth>
        <MenuItem value="due">Due on Receipt</MenuItem>
      </TextField>

      <div className="col-span-2">
        <FormControlLabel
          control={<Checkbox />}
          label="Allow portal access for this customer"
        />
      </div>

      <TextField label="Website URL" fullWidth />
      <TextField label="Department" fullWidth />
      <TextField label="Designation" fullWidth />
    </div>
  );
};

//
// TAB 2 → ADDRESS
//
const AddressTab = () => {
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Billing */}
      <div>
        <h3 className="font-semibold mb-3">Billing Address</h3>
        <div className="space-y-3">
          <TextField label="Attention" fullWidth />
          <TextField label="Country/Region" fullWidth />
          <TextField label="Street 1" fullWidth />
          <TextField label="Street 2" fullWidth />
          <TextField label="City" fullWidth />
          <TextField label="State" fullWidth />
          <TextField label="Pin Code" fullWidth />
          <TextField label="Phone" fullWidth />
          <TextField label="Fax Number" fullWidth />
        </div>
      </div>

      {/* Shipping */}
      <div>
        <h3 className="font-semibold mb-3">
          Shipping Address
          <span className="text-blue-600 text-sm ml-2 cursor-pointer">
            Copy billing address
          </span>
        </h3>

        <div className="space-y-3">
          <TextField label="Attention" fullWidth />
          <TextField label="Country/Region" fullWidth />
          <TextField label="Street 1" fullWidth />
          <TextField label="Street 2" fullWidth />
          <TextField label="City" fullWidth />
          <TextField label="State" fullWidth />
          <TextField label="Pin Code" fullWidth />
          <TextField label="Phone" fullWidth />
          <TextField label="Fax Number" fullWidth />
        </div>
      </div>
    </div>
  );
};

//
// TAB 3 → CONTACT PERSONS
//
const ContactPersonsTab = () => {
  const [rows, setRows] = React.useState([
    { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' }
  ]);

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

const RemarksTab = () => (
  <TextField
    label="Remarks"
    multiline
    rows={4}
    fullWidth
    placeholder="Enter remarks"
  />
);
  const handleSubmit = () => {
    console.log("Customer payload:", form);
    toast.success("Customer saved (dummy)");
    navigate("/customers");
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
      <div className="mt-4">
        {activeTab === "other" && <OtherDetailsTab />}
        {activeTab === "address" && <AddressTab />}
        {activeTab === "contact" && <ContactPersonsTab />}

        {activeTab === "custom" && <CustomFieldsTab />}
        {activeTab === "reporting" && <ReportingTagsTab />}
        {activeTab === "remarks" && <RemarksTab />}

      </div>
    </div>

        {/* BUTTONS */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            Save
          </Button>

          <Button variant="outline" onClick={() => navigate("/customers")}>
            Cancel
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};


export default CustomersAdd;
