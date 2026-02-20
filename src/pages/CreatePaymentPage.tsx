import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast as sonnerToast } from "sonner";
import {
  X,
  Settings,
  Lightbulb,
  ChevronDown,
  Check,
  Search,
  Info,
  AlertTriangle,
  Upload,
  ChevronRight,
  ExternalLink,
  FileText,
  Mail,
  Gem,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

export const CreatePaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSheetTab, setActiveSheetTab] = useState("details");
  const [activeTab, setActiveTab] = useState("bill_payment");
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date("2026-02-12"));

  // Form State
  const [paymentNumber, setPaymentNumber] = useState("3");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paidThrough, setPaidThrough] = useState("Petty Cash");
  const [reference, setReference] = useState("");

  const handleSave = (status: "DRAFT" | "PAID") => {
    const newPayment = {
      id: Math.random().toString(36).substr(2, 9),
      payment_number: paymentNumber,
      vendor_name:
        vendors.find((v) => v.id === selectedVendor)?.name || "Unknown Vendor",
      date: date
        ? format(date, "dd/MM/yyyy")
        : format(new Date(), "dd/MM/yyyy"),
      mode: paymentMode,
      status: status,
      amount: parseFloat(amount) || 0,
      unused_amount: 0,
      bank_reference_number: reference,
      paid_through_account: paidThrough,
      currency_symbol: "₹",
    };

    const existingPayments = JSON.parse(
      localStorage.getItem("mock_payments") || "[]"
    );
    localStorage.setItem(
      "mock_payments",
      JSON.stringify([newPayment, ...existingPayments])
    );
    sonnerToast.success(`Payment saved as ${status}`);
    navigate(
      `/accounting/payments-made?paymentId=${newPayment.id}&view=detail`
    );
  };

  // ... (rest of existing state)

  // ... (rest of existing code)

  const vendors = [
    {
      id: "1",
      name: "Gophygital",
      email: "ajay.pihulkar@gophygital.com",
      company: "Gophygital",
      avatar: "G",
    },
    {
      id: "2",
      name: "Acme Corp",
      email: "contact@acme.com",
      company: "Acme Corp",
      avatar: "A",
    },
  ];

  const handleVendorSelect = (vendorId: string) => {
    setSelectedVendor(vendorId);
    setIsVendorOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Header Section (Gray Background) */}
          <div className="bg-[#f9f9fa] border-b border-gray-200 px-6 pb-6 pt-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-6 top-6 z-10 hover:bg-gray-200 rounded-full h-8 w-8 text-gray-500"
              onClick={() => navigate("/accounting/payments-made")}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Flex Container for Tabs */}
            <div className="flex justify-start items-end border-b border-gray-200 mb-6">
              <TabsList className="bg-transparent justify-start rounded-none h-auto p-0 gap-6">
                <TabsTrigger
                  value="bill_payment"
                  className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none font-medium text-gray-600 bg-transparent transition-none mb-[-1px]"
                >
                  Bill Payment
                </TabsTrigger>
                <TabsTrigger
                  value="vendor_advance"
                  className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none font-medium text-gray-600 bg-transparent transition-none mb-[-1px]"
                >
                  Vendor Advance
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Vendor Name Field - Always Active, on Gray Background */}
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-8 items-center">
                <Label className="col-span-2 text-red-500 font-medium text-sm">
                  Vendor Name*
                </Label>
                <div className="col-span-10 relative flex justify-between gap-4">
                  <div className="flex-1">
                    <Popover open={isVendorOpen} onOpenChange={setIsVendorOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isVendorOpen}
                          className={cn(
                            "w-full justify-between text-left font-normal border-gray-300 text-gray-700 h-9 bg-white hover:bg-white focus:ring-0 focus:border-blue-500 rounded-[4px]",
                            !selectedVendor && "border-red-300 text-gray-400"
                          )}
                        >
                          {selectedVendor
                            ? vendors.find((v) => v.id === selectedVendor)?.name
                            : "Select Vendor"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search" />
                          <CommandList>
                            <CommandEmpty>No vendor found.</CommandEmpty>
                            <CommandGroup>
                              {vendors.map((vendor) => (
                                <CommandItem
                                  key={vendor.id}
                                  value={vendor.name}
                                  onSelect={() => handleVendorSelect(vendor.id)}
                                  className="flex items-center gap-3 p-2 cursor-pointer aria-selected:bg-blue-50"
                                >
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                                    {vendor.avatar}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-blue-600 text-sm">
                                      {vendor.name}
                                    </span>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                      <span>{vendor.email}</span>
                                      <span className="border-l border-gray-300 pl-2">
                                        {vendor.company}
                                      </span>
                                    </div>
                                  </div>
                                  {selectedVendor === vendor.id && (
                                    <Check className="ml-auto h-4 w-4 text-blue-600" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Vendor Details Button */}
                  {selectedVendor && (
                    <Button
                      onClick={() => setIsDetailsOpen(true)}
                      className="bg-[#404b69] hover:bg-[#353f5a] text-white text-xs h-9 px-4 flex items-center gap-2 rounded-md shrink-0"
                    >
                      <span>
                        {vendors.find((v) => v.id === selectedVendor)?.name}'s
                        Details
                      </span>
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Blurred Content Section (White Background) */}
          <div className="px-6 py-6 bg-white">
            <div
              className={cn(
                "space-y-6 transition-all duration-300",
                !selectedVendor &&
                  "opacity-50 blur-[2px] pointer-events-none select-none grayscale-[0.3]"
              )}
            >
              {/* Payment # */}
              <div className="grid grid-cols-12 gap-8 items-center">
                <Label className="col-span-2 text-red-500 font-medium text-sm">
                  Payment #*
                </Label>
                <div className="col-span-5 relative">
                  <Input
                    value={paymentNumber}
                    onChange={(e) => setPaymentNumber(e.target.value)}
                    className="pr-8 border-gray-200 bg-white h-9 text-sm"
                  />
                  <Settings className="absolute right-2.5 top-2.5 h-4 w-4 text-blue-400 cursor-pointer opacity-70" />
                </div>
              </div>

              {/* Payment Made */}
              <div className="grid grid-cols-12 gap-8 items-center">
                <Label className="col-span-2 text-red-500 font-medium text-sm">
                  Payment Made*
                </Label>
                <div className="col-span-5 flex items-center gap-0">
                  <div className="px-3 border border-r-0 rounded-l-md h-9 flex items-center justify-center bg-[#f9f9fa] text-gray-500 text-sm border-gray-200 min-w-[50px]">
                    INR
                  </div>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 border-gray-200 bg-white rounded-l-none h-9 text-sm focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Banner */}
              <div className="grid grid-cols-12 gap-8 items-center">
                <div className="col-span-2"></div>
                <div className="col-span-8 bg-[#fdfaf2] border border-dashed border-[#f4e8c1] rounded-sm p-3 flex items-start gap-3 relative">
                  <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5 fill-yellow-500" />
                  <p className="text-[13px] text-gray-700 pr-6">
                    Initiate payments for your bills directly from Zoho Books by
                    integrating with one of our partner banks.{" "}
                    <span className="text-blue-500 cursor-pointer hover:underline">
                      Set Up Now
                    </span>
                  </p>
                  <button className="absolute right-2 top-2.5 text-red-400 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* TDS (Vendor Advance Only) */}
              {activeTab === "vendor_advance" && (
                <div className="grid grid-cols-12 gap-8 items-center">
                  <Label className="col-span-2 text-gray-700 font-medium text-sm">
                    TDS
                  </Label>
                  <div className="col-span-5">
                    <Select>
                      <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm">
                        <SelectValue placeholder="Select a Tax" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="commission_brokerage_2">
                          Commission or Brokerage [2%]
                        </SelectItem>
                        <SelectItem value="commission_brokerage_reduced_3_75">
                          Commission or Brokerage (Reduced) [3.75%]
                        </SelectItem>
                        <SelectItem value="dividend_10">
                          Dividend [10%]
                        </SelectItem>
                        <SelectItem value="dividend_reduced_7_5">
                          Dividend (Reduced) [7.5%]
                        </SelectItem>
                        <SelectItem value="other_interest_10">
                          Other Interest than securities [10%]
                        </SelectItem>
                        <SelectItem value="other_interest_reduced_7_5">
                          Other Interest than securities (Reduced) [7.5%]
                        </SelectItem>
                        <SelectItem value="contractors_others_2">
                          Payment of contractors for Others [2%]
                        </SelectItem>
                        <SelectItem value="contractors_others_reduced_1_5">
                          Payment of contractors for Others (Reduced) [1.5%]
                        </SelectItem>
                        <SelectItem value="contractors_huf_1">
                          Payment of contractors HUF/Indiv [1%]
                        </SelectItem>
                        <SelectItem value="contractors_huf_reduced_0_75">
                          Payment of contractors HUF/Indiv (Reduced) [0.75%]
                        </SelectItem>
                        <SelectItem value="professional_fees_10">
                          Professional Fees [10%]
                        </SelectItem>
                        <SelectItem value="professional_fees_reduced_7_5">
                          Professional Fees (Reduced) [7.5%]
                        </SelectItem>
                        <SelectItem value="rent_land_furniture_10">
                          Rent on land or furniture etc [10%]
                        </SelectItem>
                        <SelectItem value="rent_land_furniture_reduced_7_5">
                          Rent on land or furniture etc (Reduced) [7.5%]
                        </SelectItem>
                        <SelectItem value="tds_1">TDS [1%]</SelectItem>
                        <SelectItem value="technical_fees_2">
                          Technical Fees (2%) [2%]
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Payment Date */}
              <div className="grid grid-cols-12 gap-8 items-center">
                <Label className="col-span-2 text-red-500 font-medium text-sm">
                  Payment Date*
                </Label>
                <div className="col-span-5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal border-gray-200 bg-white h-9 text-sm",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "dd/MM/yyyy") : "dd/MM/yyyy"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Payment Mode */}
              <div className="grid grid-cols-12 gap-8 items-center">
                <Label className="col-span-2 text-gray-700 font-medium text-sm">
                  Payment Mode
                </Label>
                <div className="col-span-5">
                  <Select value={paymentMode} onValueChange={setPaymentMode}>
                    <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm">
                      <SelectValue placeholder="Choose payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="chq">Cheque</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Paid Through */}
              <div className="grid grid-cols-12 gap-8 items-center">
                <Label className="col-span-2 text-red-500 font-medium text-sm">
                  Paid Through*
                </Label>
                <div className="col-span-5">
                  <Select value={paidThrough} onValueChange={setPaidThrough}>
                    <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm">
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petty_cash">Petty Cash</SelectItem>
                      <SelectItem value="undeposited_funds">
                        Undeposited Funds
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Deposit To & Reference (Vendor Advance Only) */}
              {activeTab === "vendor_advance" && (
                <>
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <Label className="col-span-2 text-gray-700 font-medium text-sm">
                      Deposit To
                    </Label>
                    <div className="col-span-5">
                      <Select defaultValue="prepaid_expenses">
                        <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm">
                          <SelectValue placeholder="Select Account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prepaid_expenses">
                            Prepaid Expenses
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-8 items-center">
                    <Label className="col-span-2 text-gray-700 font-medium text-sm">
                      Reference#
                    </Label>
                    <div className="col-span-5">
                      <Input
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="border-gray-200 bg-white h-9 text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Divider - Shows in all, but logic separates tables */}
              {activeTab === "bill_payment" && (
                <div className="border-t border-gray-200 my-8"></div>
              )}

              {/* Section 2: Bills Table (Bill Payment Only) */}
              {activeTab === "bill_payment" && (
                <div className="mb-8 pl-4">
                  <div className="flex justify-end mb-2">
                    <button className="text-blue-500 text-xs hover:underline">
                      Clear Applied Amount
                    </button>
                  </div>

                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 border-b border-gray-200 pb-2 text-xs font-medium text-gray-500">
                    <div className="col-span-1">Date</div>
                    <div className="col-span-2">Bill#</div>
                    <div className="col-span-2">PO#</div>
                    <div className="col-span-2 text-right">Bill Amount</div>
                    <div className="col-span-2 text-right">Amount Due</div>
                    <div className="col-span-3 text-right flex items-center justify-end gap-1">
                      Payment Made on <Info className="h-3 w-3" />
                    </div>
                    <div className="hidden">Payment</div>
                  </div>

                  {/* Empty State */}
                  <div className="py-12 text-center text-gray-800 text-sm border-b border-gray-200">
                    There are no bills for this vendor.
                  </div>

                  {/* Total Row */}
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <div className="text-sm font-medium">Total :</div>
                    <div className="text-sm text-gray-700">0.00</div>
                  </div>
                </div>
              )}

              {/* Section 3: Summary Card (Bill Payment Only) */}
              {activeTab === "bill_payment" && (
                <div className="flex justify-end mb-8">
                  <div className="bg-[#fff8f0] rounded-lg p-6 w-[400px] space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-medium text-gray-800">
                        {parseFloat(amount)
                          ? parseFloat(amount).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Amount used for Payments:
                      </span>
                      <span className="text-gray-800">0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount Refunded:</span>
                      <span className="text-gray-800">0.00</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2">
                      <span className="text-gray-600 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-orange-400 fill-orange-400 text-white" />
                        Amount in Excess:
                      </span>
                      <span className="font-medium text-gray-800">
                        ₹{" "}
                        {parseFloat(amount)
                          ? parseFloat(amount).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Notes & Attachments (Both) */}
              <div className="grid grid-cols-12 gap-8 pt-4">
                <div className="col-span-7 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Notes (Internal use. Not visible to vendor)
                    </Label>
                    <Textarea className="min-h-24 w-full border-gray-300 bg-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">
                      Attachments
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100 gap-2 font-normal text-xs"
                      >
                        <Upload className="h-3 w-3" />
                        Upload File
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-gray-500 hover:bg-transparent cursor-pointer"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      You can upload a maximum of 5 files, 10MB each
                    </p>
                  </div>

                  <div className="pt-4">
                    <p className="text-xs text-gray-500">
                      Additional Fields: Start adding custom fields for your
                      payments made by going to{" "}
                      <span className="text-gray-700 text-xs italic">
                        Settings ➜ Purchases ➜ Payments Made.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Actions (Both) */}
              <div className="mt-12 flex items-center gap-2 border-t border-gray-200 pt-4 pb-4">
                <Button
                  variant="outline"
                  className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300 h-9 px-4 text-sm font-medium rounded-[4px]"
                  onClick={() => handleSave("DRAFT")}
                >
                  Save as Draft
                </Button>
                <Button
                  className="bg-[#2977ff] hover:bg-blue-600 text-white h-9 px-4 text-sm font-medium rounded-[4px]"
                  onClick={() => handleSave("PAID")}
                >
                  Save as Paid
                </Button>
                <Button
                  variant="outline"
                  className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300 h-9 px-4 text-sm font-medium rounded-[4px]"
                  onClick={() => navigate("/accounting/payments-made")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Tabs>

        {/* Vendor Details Sidebar / Sheet */}
        <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <SheetContent
            className="w-[450px] sm:w-[500px] sm:max-w-[500px] p-0"
            side="right"
          >
            {/* Custom Header */}
            <div className="p-6 border-b border-gray-200 relative">
              <SheetClose className="absolute right-4 top-4 rounded-sm hover:opacity-100 opacity-70">
                <X className="h-5 w-5 text-gray-400" />
                <span className="sr-only">Close</span>
              </SheetClose>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-xl font-medium">
                  {vendors.find((v) => v.id === selectedVendor)?.avatar || "G"}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs text-gray-500">Vendor</div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {vendors.find((v) => v.id === selectedVendor)?.name ||
                        "Gophygital"}
                    </h2>
                    <ExternalLink className="h-4 w-4 text-blue-500 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="h-[calc(100vh-100px)] overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Meta Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>
                      {vendors.find((v) => v.id === selectedVendor)?.name ||
                        "Gophygital"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-blue-500">
                      {vendors.find((v) => v.id === selectedVendor)?.email ||
                        "ajay.pihulkar@gophygital.work"}
                    </span>
                  </div>
                </div>

                {/* Tabs (Sheet) */}
                <div className="flex items-center gap-6 border-b border-gray-200 mt-6 px-4">
                  <div
                    onClick={() => setActiveSheetTab("details")}
                    className={cn(
                      "pb-2 text-sm font-medium cursor-pointer transition-colors",
                      activeSheetTab === "details"
                        ? "border-b-2 border-blue-600 text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Details
                  </div>
                  <div
                    onClick={() => setActiveSheetTab("activity_log")}
                    className={cn(
                      "pb-2 text-sm font-medium cursor-pointer transition-colors",
                      activeSheetTab === "activity_log"
                        ? "border-b-2 border-blue-600 text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Activity Log
                  </div>
                </div>

                {/* Details Tab Content */}
                {activeSheetTab === "details" && (
                  <div className="p-4 space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center gap-2 shadow-sm bg-white">
                        <AlertTriangle className="h-5 w-5 text-orange-400 fill-orange-400" />
                        <div className="text-xs text-gray-500 text-center">
                          Outstanding Payables
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          ₹0.00
                        </div>
                      </div>
                      <div className="border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center gap-2 shadow-sm bg-white">
                        <Gem className="h-5 w-5 text-green-500 fill-green-500" />
                        <div className="text-xs text-gray-500 text-center">
                          Unused Credits
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          ₹0.00
                        </div>
                      </div>
                    </div>

                    {/* Contact Details Card */}
                    <div className="border border-gray-200 rounded-lg mt-6 overflow-hidden">
                      <div className="bg-white p-4 border-b border-gray-100">
                        <h3 className="font-medium text-sm text-gray-900">
                          Contact Details
                        </h3>
                      </div>
                      <div className="p-4 space-y-4 bg-white">
                        <div className="grid grid-cols-2 text-sm">
                          <div className="text-gray-500">Currency</div>
                          <div className="text-gray-900 font-medium">INR</div>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                          <div className="text-gray-500">Payment Terms</div>
                          <div className="text-gray-900 font-medium">
                            Due on Receipt
                          </div>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                          <div className="text-gray-500">PAN</div>
                          <div className="text-gray-900 font-medium">
                            AFLPC8131J
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Persons Collapsible */}
                    <div className="border border-gray-200 rounded-lg mt-4 bg-white px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-900">
                        Contact Persons{" "}
                        <span className="bg-gray-400 text-white text-[10px] px-1.5 py-0.5 rounded ml-1">
                          1
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>

                    {/* Address Collapsible */}
                    <div className="border border-gray-200 rounded-lg mt-4 bg-white px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-900">
                        Address
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Activity Log Tab Content */}
                {activeSheetTab === "activity_log" && (
                  <div className="p-6 bg-gray-50/50 min-h-full">
                    <div className="relative space-y-8 pl-4">
                      {/* Vertical Line */}
                      <div className="absolute left-[27px] top-2 bottom-0 w-[2px] bg-gray-100 -z-10" />

                      {/* Item 1 */}
                      <div className="flex gap-4 items-start relative">
                        <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <FileText className="h-4 w-4 text-yellow-500 fill-yellow-100" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="text-xs">
                            <span className="font-semibold text-gray-900">
                              ajay.pihulkar
                            </span>{" "}
                            <span className="text-gray-500">
                              • 12/02/2026 12:47 AM
                            </span>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-800 shadow-sm">
                            Expense of amount ₹122.00 created
                          </div>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div className="flex gap-4 items-start relative">
                        <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <MessageSquare className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="text-xs">
                            <span className="font-semibold text-gray-900">
                              ajay.pihulkar
                            </span>{" "}
                            <span className="text-gray-500">
                              • 12/02/2026 12:06 AM
                            </span>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-800 shadow-sm">
                            Payment of amount ₹250.00 made and applied for 123
                          </div>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div className="flex gap-4 items-start relative">
                        <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <FileText className="h-4 w-4 text-yellow-500 fill-yellow-100" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="text-xs">
                            <span className="font-semibold text-gray-900">
                              ajay.pihulkar
                            </span>{" "}
                            <span className="text-gray-500">
                              • 12/02/2026 12:00 AM
                            </span>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-800 shadow-sm">
                            Purchase Order of amount ₹250.00 converted as bill
                            123
                          </div>
                        </div>
                      </div>

                      {/* Item 4 */}
                      <div className="flex gap-4 items-start relative">
                        <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <FileText className="h-4 w-4 text-yellow-500 fill-yellow-100" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="text-xs">
                            <span className="font-semibold text-gray-900">
                              ajay.pihulkar
                            </span>{" "}
                            <span className="text-gray-500">
                              • 11/02/2026 11:56 PM
                            </span>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-800 shadow-sm">
                            Purchase Order PO-00002 emailed
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
