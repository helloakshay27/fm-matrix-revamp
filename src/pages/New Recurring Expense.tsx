import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { Package } from "lucide-react";

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
const customerOptions = ["Select a customer", "Customer A", "Customer B", "Customer C"];

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

const NewRecurringExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState("");
  const [repeatEvery, setRepeatEvery] = useState("Week");
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().split("T")[0]
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

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 42 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
      padding: { xs: "8px", sm: "10px", md: "12px" },
    },
  } as const;

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md border border-red-500 text-red-500 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-semibold">New Recurring Expense</h1>
          </div>
          <IconButton onClick={handleCancel} size="small">
            <Close />
          </IconButton>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-red-500">
                Profile Name*
              </label>
              <TextField
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                fullWidth
                placeholder=""
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="border-t border-border pt-6" />

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
                  placeholder=""
                  InputProps={{
                    startAdornment: <InputAdornment position="start"></InputAdornment>,
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Vendor</label>
              <FormControl fullWidth>
                <Select
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton size="small">
                        <Search fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  }
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton size="small">
                        <Search fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  }
                >
                  {customerOptions.map((option, index) => (
                    <MenuItem key={option} value={index === 0 ? "" : option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

          <div className="flex gap-4 pt-6">
            <Button
              variant="contained"
              onClick={() => {}}
              sx={{
                textTransform: "none",
                backgroundColor: "#f8e9e9",
                color: "#c62828",
                borderRadius: "6px",
                boxShadow: "none",
                padding: "6px 22px",
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
                padding: "6px 22px",
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
    </div>
  );
};

export default NewRecurringExpensePage;
