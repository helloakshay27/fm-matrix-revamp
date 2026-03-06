import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { Close, Search, Delete, Add, ImageOutlined } from "@mui/icons-material";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Section component - matching BillCreatePage style
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-lg border border-border shadow-sm">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-muted/20">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

interface Vendor {
  id: string;
  name: string;
  email: string;
}

export const RecurringBillCreatePage: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [repeatEvery, setRepeatEvery] = useState("Week");
  const [startOn, setStartOn] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endsOn, setEndsOn] = useState("");
  const [neverExpires, setNeverExpires] = useState(true);
  const [paymentTerms, setPaymentTerms] = useState("Due on Receipt");
  const [discountType, setDiscountType] = useState("At Transaction Level");

  // Item table state
  const [items, setItems] = useState([
    {
      id: 1,
      itemDetails: "",
      account: "",
      quantity: 1.0,
      rate: 0.0,
      customerDetails: "",
      amount: 0.0,
    },
  ]);
  const [discount, setDiscount] = useState(0);
  const [selectedTax, setSelectedTax] = useState("");
  const [adjustment, setAdjustment] = useState(0);
  const [notes, setNotes] = useState("");

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
      padding: { xs: "8px", sm: "10px", md: "12px" },
    },
  };

  // Fetch vendors on mount
  useEffect(() => {
    const fetchVendors = async () => {
      setLoadingVendors(true);
      try {
        // Mock data - replace with actual API call
        const mockVendors: Vendor[] = [
          { id: "1", name: "Lockated", email: "contact@lockated.com" },
          { id: "2", name: "Gurughar", email: "info@gurughar.com" },
        ];
        setVendors(mockVendors);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchVendors();
  }, []);

  const handleSubmit = () => {
    // Validate required fields
    if (!selectedVendor) {
      toast.error("Please select a vendor");
      return;
    }
    if (!profileName.trim()) {
      toast.error("Please enter a profile name");
      return;
    }

    // Create new recurring bill object
    const newRecurringBill = {
      id: Date.now(),
      bill_number: `RB-${Date.now().toString().slice(-6)}`,
      vendor_name: selectedVendor.name,
      profile_name: profileName,
      repeat_every: repeatEvery,
      start_on: startOn,
      ends_on: neverExpires ? null : endsOn,
      never_expires: neverExpires,
      payment_terms: paymentTerms,
      discount_type: discountType,
      items: items,
      discount: discount,
      selected_tax: selectedTax,
      adjustment: adjustment,
      notes: notes,
      date: startOn,
      due_date: startOn,
      amount:
        items.reduce((sum, item) => sum + item.amount, 0) -
        (items.reduce((sum, item) => sum + item.amount, 0) * discount) / 100 +
        adjustment,
      balance_due:
        items.reduce((sum, item) => sum + item.amount, 0) -
        (items.reduce((sum, item) => sum + item.amount, 0) * discount) / 100 +
        adjustment,
      status: "open" as const,
      reference_number: profileName,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Get existing recurring bills from localStorage
    const existingBills = JSON.parse(
      localStorage.getItem("recurringBills") || "[]"
    );

    // Add new bill to the array
    const updatedBills = [newRecurringBill, ...existingBills];

    // Save to localStorage
    localStorage.setItem("recurringBills", JSON.stringify(updatedBills));

    // Show success message
    toast.success("Recurring bill created successfully!");

    // Navigate back to dashboard
    navigate("/accounting/recurring-bills");
  };

  const handleCancel = () => {
    navigate("/accounting/recurring-bills");
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Recurring Bill</h1>
        <IconButton onClick={handleCancel}>
          <Close />
        </IconButton>
      </header>

      <div className="space-y-6">
        <Section
          title="Recurring Bill Information"
          icon={<Package className="w-5 h-5 text-red-500" />}
        >
          <div className="space-y-6 max-w-3xl">
            {/* Vendor Name and Profile Name - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Vendor Name<span className="text-red-500">*</span>
                </label>
                <FormControl fullWidth>
                  <Select
                    value={selectedVendor?.id || ""}
                    onChange={(e) => {
                      const vendor = vendors.find(
                        (v) => v.id === e.target.value
                      );
                      setSelectedVendor(vendor || null);
                    }}
                    displayEmpty
                    sx={fieldStyles}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <Search className="w-4 h-4" />
                        </IconButton>
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="" disabled>
                      Select a Vendor
                    </MenuItem>
                    {vendors.map((vendor) => (
                      <MenuItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Profile Name<span className="text-red-500">*</span>
                </label>
                <TextField
                  fullWidth
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter profile name"
                  sx={fieldStyles}
                />
              </div>
            </div>

            {/* Repeat Every */}
            <div className="max-w-xs">
              <label className="block text-sm font-medium mb-2">
                Repeat Every<span className="text-red-500">*</span>
              </label>
              <FormControl fullWidth>
                <Select
                  value={repeatEvery}
                  onChange={(e) => setRepeatEvery(e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value="Day">Day</MenuItem>
                  <MenuItem value="Week">Week</MenuItem>
                  <MenuItem value="Month">Month</MenuItem>
                  <MenuItem value="Year">Year</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Start On and Ends On */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start On
                </label>
                <TextField
                  fullWidth
                  type="date"
                  value={startOn}
                  onChange={(e) => setStartOn(e.target.value)}
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ends On
                </label>
                <TextField
                  fullWidth
                  type="date"
                  value={endsOn}
                  onChange={(e) => setEndsOn(e.target.value)}
                  placeholder="dd/MM/yyyy"
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                  disabled={neverExpires}
                />
              </div>
            </div>

            {/* Never Expires Checkbox */}
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={neverExpires}
                    onChange={(e) => {
                      setNeverExpires(e.target.checked);
                      if (e.target.checked) {
                        setEndsOn("");
                      }
                    }}
                  />
                }
                label="Never Expires"
              />
            </div>

            {/* Payment Terms */}
            <div className="max-w-md">
              <label className="block text-sm font-medium mb-2">
                Payment Terms
              </label>
              <FormControl fullWidth>
                <Select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value="Due on Receipt">Due on Receipt</MenuItem>
                  <MenuItem value="Net 15">Net 15</MenuItem>
                  <MenuItem value="Net 30">Net 30</MenuItem>
                  <MenuItem value="Net 45">Net 45</MenuItem>
                  <MenuItem value="Net 60">Net 60</MenuItem>
                </Select>
              </FormControl>
            </div>

            <Divider />

            {/* Discount Type Dropdown */}
            <div className="max-w-md">
              <label className="block text-sm font-medium mb-2">
                Discount Type
              </label>
              <FormControl fullWidth>
                <Select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  sx={fieldStyles}
                  startAdornment={
                    <InputAdornment position="start">
                      <Search className="w-4 h-4 text-gray-400" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="At Transaction Level">
                    At Transaction Level
                  </MenuItem>
                  <MenuItem value="At Line Item Level">
                    At Line Item Level
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </Section>

        {/* Item Table Section */}
        <Section
          title="Item Table"
          icon={<Package className="w-5 h-5 text-red-500" />}
        >
          <div className="space-y-4">
            {/* Bulk Actions Link */}
            <div className="flex justify-end mb-2">
              <Button
                sx={{
                  textTransform: "none",
                  color: "primary.main",
                  fontSize: "0.875rem",
                }}
              >
                Bulk Actions
              </Button>
            </div>

            {/* Table */}
            <div className="border border-border rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Item Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Account
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                      Customer Details
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <IconButton size="small" sx={{ color: "gray" }}>
                            <ImageOutlined fontSize="small" />
                          </IconButton>
                          <TextField
                            size="small"
                            placeholder="Type or click to select an item."
                            value={item.itemDetails}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].itemDetails = e.target.value;
                              setItems(newItems);
                            }}
                            sx={{ minWidth: 200 }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <Select
                            value={item.account}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].account = e.target.value;
                              setItems(newItems);
                            }}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              Select an account
                            </MenuItem>
                            <MenuItem value="Account 1">Account 1</MenuItem>
                            <MenuItem value="Account 2">Account 2</MenuItem>
                          </Select>
                        </FormControl>
                      </td>
                      <td className="px-4 py-3">
                        <TextField
                          type="number"
                          size="small"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].quantity =
                              parseFloat(e.target.value) || 0;
                            newItems[index].amount =
                              newItems[index].quantity * newItems[index].rate;
                            setItems(newItems);
                          }}
                          inputProps={{ min: 0, step: 0.01 }}
                          sx={{ width: 80 }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <TextField
                          type="number"
                          size="small"
                          value={item.rate}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].rate =
                              parseFloat(e.target.value) || 0;
                            newItems[index].amount =
                              newItems[index].quantity * newItems[index].rate;
                            setItems(newItems);
                          }}
                          inputProps={{ min: 0, step: 0.01 }}
                          sx={{ width: 100 }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <Select
                            value={item.customerDetails}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].customerDetails = e.target.value;
                              setItems(newItems);
                            }}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              Select Customer
                            </MenuItem>
                            <MenuItem value="Customer 1">Customer 1</MenuItem>
                            <MenuItem value="Customer 2">Customer 2</MenuItem>
                          </Select>
                        </FormControl>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {item.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (items.length > 1) {
                              setItems(items.filter((_, i) => i !== index));
                            }
                          }}
                          sx={{ color: "error.main" }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Row Button */}
            <Button
              startIcon={<Add />}
              onClick={() => {
                setItems([
                  ...items,
                  {
                    id: items.length + 1,
                    itemDetails: "",
                    account: "",
                    quantity: 1.0,
                    rate: 0.0,
                    customerDetails: "",
                    amount: 0.0,
                  },
                ]);
              }}
              sx={{ textTransform: "none" }}
            >
              Add New Row
            </Button>

            {/* Summary Section */}
            <div className="flex justify-end mt-6">
              <div className="w-full md:w-1/3 space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">Sub Total</span>
                  <span className="font-semibold">
                    {items
                      .reduce((sum, item) => sum + item.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">Discount</span>
                  <div className="flex items-center gap-2">
                    <TextField
                      type="number"
                      size="small"
                      value={discount}
                      onChange={(e) =>
                        setDiscount(parseFloat(e.target.value) || 0)
                      }
                      inputProps={{ min: 0, step: 0.01 }}
                      sx={{ width: 80 }}
                    />
                    <span className="text-sm w-6">%</span>
                    <span className="font-semibold w-20 text-right">
                      {(
                        (items.reduce((sum, item) => sum + item.amount, 0) *
                          discount) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">TDS</span>
                  <div className="flex items-center gap-2">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={selectedTax}
                        onChange={(e) => setSelectedTax(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Select a Tax
                        </MenuItem>
                        <MenuItem value="TDS 1%">TDS 1%</MenuItem>
                        <MenuItem value="TDS 2%">TDS 2%</MenuItem>
                        <MenuItem value="TDS 5%">TDS 5%</MenuItem>
                      </Select>
                    </FormControl>
                    <span className="font-semibold text-blue-600 w-20 text-right">
                      -0.00
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">Adjustment</span>
                  <div className="flex items-center gap-2">
                    <TextField
                      type="number"
                      size="small"
                      value={adjustment}
                      onChange={(e) =>
                        setAdjustment(parseFloat(e.target.value) || 0)
                      }
                      inputProps={{ step: 0.01 }}
                      sx={{ width: 120 }}
                    />
                    <span className="font-semibold w-20 text-right">
                      {adjustment.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Divider />

                <div className="flex justify-between items-center py-2">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-base font-bold">
                    {(
                      items.reduce((sum, item) => sum + item.amount, 0) -
                      (items.reduce((sum, item) => sum + item.amount, 0) *
                        discount) /
                        100 +
                      adjustment
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="It will not be shown in PDF"
                helperText="It will not be shown in PDF"
              />
            </div>
          </div>
        </Section>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-10 mb-5 justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            Save
          </Button>

          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecurringBillCreatePage;
