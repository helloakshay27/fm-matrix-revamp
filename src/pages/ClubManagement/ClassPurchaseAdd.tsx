import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  createClassPurchase,
  fetchClubClasses,
  fetchGuestUsers,
  fetchOccupantUsers,
  fetchPackagesForClass,
  fetchStaffUsers,
  type ClubClassOption,
  type PackageOption,
  type UserOption,
} from "./classPurchaseApi";
import { ClassFormSection, RequiredLabel, classFieldStyles } from "./ClassFormSection";


const today = () => new Date().toISOString().slice(0, 10);
const addDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const ClassPurchaseAdd = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [classOptions, setClassOptions] = useState<ClubClassOption[]>([]);
  const [packageOptions, setPackageOptions] = useState<PackageOption[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Matches AmenityBookingAdd's "occupant" (Members) / "guest" / "fm" (Staff) buyer-type
  // selector. Member and Staff buy at the package's member price; Guest pays non-member.
  const [userType, setUserType] = useState<"occupant" | "guest" | "fm">("occupant");
  const [userId, setUserId] = useState("");
  const [classId, setClassId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState("");
  const [discount, setDiscount] = useState("0");

  useEffect(() => {
    fetchClubClasses()
      .then(setClassOptions)
      .catch((error) => {
        console.error("Failed to load classes", error);
        toast.error("Failed to load classes");
      });
  }, []);

  // The user list depends on which buyer type is selected - same three endpoints
  // AmenityBookingAdd uses for its Members/Guest/Staff radio group.
  useEffect(() => {
    setUserId("");
    setLoadingUsers(true);
    const fetcher = userType === "guest" ? fetchGuestUsers : userType === "fm" ? fetchStaffUsers : fetchOccupantUsers;
    fetcher()
      .then(setUsers)
      .catch((error) => {
        console.error("Failed to load users", error);
        toast.error(`Failed to load ${userType === "guest" ? "guest" : userType === "fm" ? "staff" : "member"} users`);
        setUsers([]);
      })
      .finally(() => setLoadingUsers(false));
  }, [userType]);

  useEffect(() => {
    if (!classId) {
      setPackageOptions([]);
      return;
    }
    setLoadingPackages(true);
    fetchPackagesForClass(classId)
      .then(setPackageOptions)
      .catch((error) => {
        console.error("Failed to load packages", error);
        toast.error("Failed to load packages for this class");
      })
      .finally(() => setLoadingPackages(false));
  }, [classId]);

  const selectedPackage = packageOptions.find((p) => p.id === packageId);

  useEffect(() => {
    if (selectedPackage) {
      setEndDate(addDays(startDate || today(), selectedPackage.validityDays));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPackage, startDate]);

  const { subtotal, cgstAmount, sgstAmount, total } = useMemo(() => {
    const base = userType === "guest" ? selectedPackage?.priceNonMember ?? 0 : selectedPackage?.priceMember ?? 0;
    const disc = Number(discount) || 0;
    const taxable = Math.max(0, base - disc);
    const cgst = (taxable * (selectedPackage?.cgstRate ?? 0)) / 100;
    const sgst = (taxable * (selectedPackage?.sgstRate ?? 0)) / 100;
    return { subtotal: base, cgstAmount: cgst, sgstAmount: sgst, total: taxable + cgst + sgst };
  }, [selectedPackage, discount, userType]);

  const validate = () => {
    const errors: string[] = [];
    if (!userId) errors.push("Member is required");
    if (!classId) errors.push("Class is required");
    if (!packageId) errors.push("Package is required");
    if (!startDate) errors.push("Start date is required");
    if (!endDate) errors.push("End date is required");
    if (errors.length > 0) {
      errors.forEach((message) => toast.error(message));
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await createClassPurchase({
        userId,
        clubClassId: classId,
        packageId,
        discount: Number(discount) || 0,
        validityStartDate: startDate,
        validityEndDate: endDate,
        members: [{ userId, relationshipToBuyer: "self" }],
      });
      toast.success("Class purchase created successfully!");
      navigate("/club-management/class-purchase");
    } catch (error: any) {
      console.error("Failed to create class purchase", error);
      const message = error?.response?.data?.errors?.join(", ") || "Failed to create class purchase";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      <header className="mb-4">
        <button
          type="button"
          onClick={() => navigate("/club-management/class-purchase")}
          className="flex items-center gap-2 text-black font-medium mb-2"
        >
          <ArrowLeft className="h-4 w-4 text-black" />
          Back to Class Purchases
        </button>
        <h1 className="text-2xl font-bold text-black">New Class Purchase</h1>
      </header>

      <ClassFormSection title="Purchase Details" icon={<ShoppingCart />}>
        <div className="mb-6">
          <RadioGroup value={userType} onValueChange={(val) => setUserType(val as typeof userType)} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="occupant" id="purchase-occupant" />
              <Label htmlFor="purchase-occupant">Members</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="guest" id="purchase-guest" />
              <Label htmlFor="purchase-guest">Guest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fm" id="purchase-fm" />
              <Label htmlFor="purchase-fm">Staff</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormControl
            fullWidth
            variant="outlined"
            disabled={loadingUsers}
            sx={{ "& .MuiInputBase-root": classFieldStyles }}
          >
            <InputLabel shrink>
              <RequiredLabel>
                {userType === "guest" ? "Guest (buyer)" : userType === "fm" ? "Staff (buyer)" : "Member (buyer)"}
              </RequiredLabel>
            </InputLabel>
            <MuiSelect
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              label={userType === "guest" ? "Guest (buyer)" : userType === "fm" ? "Staff (buyer)" : "Member (buyer)"}
              notched
              displayEmpty
              renderValue={(selected) => (selected ? users.find((u) => u.id === selected)?.name ?? String(selected) : "Search user")}
            >
              <MenuItem value="" disabled>
                {loadingUsers ? "Loading..." : "Search user"}
              </MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name} {u.email ? `(${u.email})` : ""}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ "& .MuiInputBase-root": classFieldStyles }}>
            <InputLabel shrink>
              <RequiredLabel>Class</RequiredLabel>
            </InputLabel>
            <MuiSelect
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setPackageId("");
              }}
              label="Class"
              notched
              displayEmpty
              renderValue={(selected) => (selected ? classOptions.find((c) => c.id === selected)?.name ?? String(selected) : "Select class")}
            >
              <MenuItem value="" disabled>
                Select class
              </MenuItem>
              {classOptions.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl
            fullWidth
            variant="outlined"
            disabled={!classId || loadingPackages}
            sx={{ "& .MuiInputBase-root": classFieldStyles }}
          >
            <InputLabel shrink>
              <RequiredLabel>Package</RequiredLabel>
            </InputLabel>
            <MuiSelect
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              label="Package"
              notched
              displayEmpty
              renderValue={(selected) => (selected ? packageOptions.find((p) => p.id === selected)?.name ?? String(selected) : "Select package")}
            >
              <MenuItem value="" disabled>
                {classId ? "Select package" : "Select a class first"}
              </MenuItem>
              {packageOptions.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} &middot; {p.credits} sessions
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <TextField
            label="Sessions"
            value={selectedPackage?.credits ?? ""}
            fullWidth
            variant="outlined"
            disabled
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: classFieldStyles }}
          />

          <TextField
            label={<RequiredLabel>Start date</RequiredLabel>}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: classFieldStyles }}
          />

          <TextField
            label={<RequiredLabel>End date</RequiredLabel>}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: classFieldStyles }}
          />

          <TextField
            label="Discount (₹)"
            type="number"
            value={discount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d*\.?\d*$/.test(value)) setDiscount(value);
            }}
            onKeyDown={(e) => {
              if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault();
            }}
            fullWidth
            variant="outlined"
            inputProps={{ min: 0 }}
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: classFieldStyles }}
          />
        </div>

        {selectedPackage && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="w-full max-w-xs ml-auto space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-gray-900">- ₹{(Number(discount) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CGST ({selectedPackage.cgstRate}%)</span>
                <span className="text-gray-900">₹{cgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SGST ({selectedPackage.sgstRate}%)</span>
                <span className="text-gray-900">₹{sgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-gray-300 pt-1 mt-1">
                <span>Total</span>
                <span className="text-[#C72030]">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </ClassFormSection>

      <div className="fm-action-bar pt-4 sm:pt-6">
        <button
          type="button"
          onClick={() => navigate("/club-management/class-purchase")}
          disabled={isSubmitting}
          className="fm-action-secondary"
        >
          Cancel
        </button>
        <button type="button" onClick={() => submit()} disabled={isSubmitting} className="fm-action-primary">
          {isSubmitting ? "Saving..." : "Create Purchase"}
        </button>
      </div>
    </div>
  );
};

export default ClassPurchaseAdd;
