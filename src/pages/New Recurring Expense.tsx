import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
import { Receipt, Calendar, FileText, CreditCard } from "lucide-react";

const repeatOptions = ["Week", "Month", "Year"];
const expenseAccounts = [
  "Rent",
  "Utilities",
  "Office Supplies",
  "Maintenance",
  "Travel",
];
const paidThroughOptions = ["Cash", "Bank", "Petty Cash", "Card"];
const vendorOptions = ["Select a vendor", "Lockated", "Gurughar", "Acme Inc."];
const customerOptions = [
  "Select a customer",
  "Customer A",
  "Customer B",
  "Customer C",
];

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const addInterval = (date: Date, repeatEvery: string) => {
  const next = new Date(date);
  if (repeatEvery === "Month") {
    next.setMonth(next.getMonth() + 1);
  } else if (repeatEvery === "Year") {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    next.setDate(next.getDate() + 7);
  }
  return next;
};

// Section component - matching PurchaseOrderCreatePage pattern
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <section className="bg-card rounded-lg border border-border shadow-sm">
    <div className="px-6 py-4 border-b border-border flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </section>
);

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
} as const;

const NewRecurringExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState("");
  const [repeatEvery, setRepeatEvery] = useState("Week");
  const [startDate, setStartDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [endsOn, setEndsOn] = useState("");
  const [neverExpires, setNeverExpires] = useState(true);
  const [expenseAccount, setExpenseAccount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState("");
  const [paidThrough, setPaidThrough] = useState("");
  const [vendor, setVendor] = useState("");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");

  const nextOccurrence = useMemo(() => {
    if (!startDate) return "";
    const base = new Date(startDate);
    if (Number.isNaN(base.getTime())) return "";
    return formatDate(addInterval(base, repeatEvery));
  }, [startDate, repeatEvery]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = () => {
    // Save logic here
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Receipt className="h-6 w-6 text-primary" />
                New Recurring Expense
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new recurring expense profile
              </p>
            </div>
          </div>
        </div>

        {/* Profile & Schedule Section */}
        <Section
          title="Profile & Schedule"
          icon={<Calendar className="h-3.5 w-3.5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Profile Name*
              </label>
              <TextField
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                fullWidth
                placeholder="Enter profile name"
                sx={fieldStyles}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Repeat Every*
              </label>
              <FormControl fullWidth>
                <Select
                  value={repeatEvery}
                  onChange={(e) => setRepeatEvery(e.target.value)}
                  sx={fieldStyles}
                >
                  {repeatOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <TextField
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                sx={fieldStyles}
              />
              {nextOccurrence && (
                <p className="text-xs text-muted-foreground mt-2">
                  The recurring expense will be created on {nextOccurrence}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ends On</label>
              <TextField
                type="date"
                value={endsOn}
                onChange={(e) => setEndsOn(e.target.value)}
                fullWidth
                disabled={neverExpires}
                sx={fieldStyles}
              />
              <FormControlLabel
                className="mt-2"
                control={
                  <Checkbox
                    checked={neverExpires}
                    onChange={(e) => setNeverExpires(e.target.checked)}
                  />
                }
                label="Never Expires"
              />
            </div>
          </div>
        </Section>

        {/* Expense Account Section */}
        <Section
          title="Expense Account"
          icon={<FileText className="h-3.5 w-3.5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Expense Account*
              </label>
              <FormControl fullWidth>
                <Select
                  value={expenseAccount}
                  onChange={(e) => setExpenseAccount(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>
                    Select an account
                  </MenuItem>
                  {expenseAccounts.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </Section>

        {/* Payment Details Section */}
        <Section
          title="Payment Details"
          icon={<CreditCard className="h-3.5 w-3.5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Amount*
              </label>
              <div className="flex gap-2">
                <FormControl sx={{ minWidth: 90 }}>
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="INR">INR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  sx={fieldStyles}
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Paid Through*
              </label>
              <FormControl fullWidth>
                <Select
                  value={paidThrough}
                  onChange={(e) => setPaidThrough(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>
                    Select an account
                  </MenuItem>
                  {paidThroughOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </Section>

        {/* Vendor & Additional Details Section */}
        <Section
          title="Vendor & Additional Details"
          icon={<Receipt className="h-3.5 w-3.5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Vendor</label>
              <FormControl fullWidth>
                <Select
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  {vendorOptions.map((option, index) => (
                    <MenuItem key={option} value={index === 0 ? "" : option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Customer Name
              </label>
              <FormControl fullWidth>
                <Select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  {customerOptions.map((option, index) => (
                    <MenuItem key={option} value={index === 0 ? "" : option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <TextField
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                placeholder="Max. 500 characters"
                inputProps={{ maxLength: 500 }}
              />
            </div>

            <div className="flex items-center">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Reporting Tags
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Associate Tags
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2 pb-6">
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              textTransform: "none",
              backgroundColor: "#f8e9e9",
              color: "#c62828",
              borderRadius: "6px",
              boxShadow: "none",
              padding: "8px 24px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#f4dede",
                boxShadow: "none",
              },
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              textTransform: "none",
              color: "#c62828",
              borderColor: "#c62828",
              borderRadius: "6px",
              padding: "8px 24px",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#b71c1c",
                backgroundColor: "transparent",
              },
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewRecurringExpensePage;
