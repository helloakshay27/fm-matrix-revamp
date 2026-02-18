import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    X,
    ChevronDown,
    Check,
    Calendar as CalendarIcon,
    Upload,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const RecordPaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const [customerOpen, setCustomerOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
    const [date, setDate] = useState<Date | null>(new Date());

    const [amountReceived, setAmountReceived] = useState("");
    const [bankCharges, setBankCharges] = useState("");
    const [paymentNumber, setPaymentNumber] = useState("7");
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [depositTo, setDepositTo] = useState("Petty Cash");
    const [reference, setReference] = useState("");
    const [taxDeducted, setTaxDeducted] = useState(false);
    const [tdsAccount, setTdsAccount] = useState("Advance Tax");
    const [notes, setNotes] = useState("");

    const customers = [
        { id: "1", name: "Mr. Ajay P", email: "ajay.pihulkar@lockated.com" },
        { id: "2", name: "mm mm", email: "mm@gmail.com" },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="w-full">
                {/* Header - customer select on light gray */}
                <div className="bg-[#f9f9fa] border-b border-gray-200 px-6 pb-6 pt-6 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-6 top-6 z-10 hover:bg-gray-200 rounded-full h-8 w-8 text-gray-500"
                        onClick={() => navigate(-1)}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    <div className="flex justify-start items-end border-b border-gray-200 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 px-0 py-2">Record Payment</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-12 gap-8 items-center">
                            <Label className="col-span-2 text-red-500 font-medium text-sm">Customer Name*</Label>
                            <div className="col-span-8 relative flex items-center gap-4">
                                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={customerOpen}
                                            className={cn(
                                                "w-full justify-between text-left font-normal border-gray-300 text-gray-700 h-9 bg-white hover:bg-white focus:ring-0 focus:border-blue-500 rounded-[4px]",
                                                !selectedCustomer && "border-red-300 text-gray-400"
                                            )}
                                        >
                                            {selectedCustomer
                                                ? customers.find((c) => c.id === selectedCustomer)?.name
                                                : "Select Customer"}
                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[420px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search" />
                                            <CommandList>
                                                <CommandEmpty>No customer found.</CommandEmpty>
                                                <CommandGroup>
                                                    {customers.map((c) => (
                                                        <CommandItem
                                                            key={c.id}
                                                            value={c.name}
                                                            onSelect={() => setSelectedCustomer(c.id)}
                                                            className="flex items-center gap-3 p-2 cursor-pointer aria-selected:bg-blue-50"
                                                        >
                                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                                                                {c.name.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-blue-600 text-sm">{c.name}</span>
                                                                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                                    <span>{c.email}</span>
                                                                </div>
                                                            </div>
                                                            {selectedCustomer === c.id && (
                                                                <Check className="ml-auto h-4 w-4 text-blue-600" />
                                                            )}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                {selectedCustomer && (
                                    <Button className="bg-[#404b69] hover:bg-[#353f5a] text-white text-xs h-9 px-4 flex items-center gap-2 rounded-md shrink-0">
                                        <span>{customers.find((c) => c.id === selectedCustomer)?.name}'s Details</span>
                                        <ChevronRight className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>

                            <div className="col-span-2 text-sm text-gray-500">PAN: <span className="text-blue-500 cursor-pointer">Add PAN</span></div>
                        </div>
                    </div>
                </div>

                {/* Main white content area */}
                <div className="px-6 py-6 bg-white">
                    <div className={cn("space-y-6 transition-all duration-300", !selectedCustomer && "opacity-50 blur-[2px] pointer-events-none select-none grayscale-[0.3]")}>
                        {/* Amount Received */}
                        <div className="grid grid-cols-12 gap-8 items-center">
                            <Label className="col-span-2 text-red-500 font-medium text-sm">Amount Received*</Label>
                            <div className="col-span-5 flex items-center gap-0">
                                <div className="px-3 border border-r-0 rounded-l-md h-9 flex items-center justify-center bg-[#f9f9fa] text-gray-500 text-sm border-gray-200 min-w-[50px]">INR</div>
                                <Input value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)} className="flex-1 border-gray-200 bg-white rounded-l-none h-9 text-sm focus:border-blue-400" />
                            </div>

                            <div className="col-span-2 text-sm text-gray-500">Bank Charges (if any)</div>
                            <div className="col-span-3">
                                <Input value={bankCharges} onChange={(e) => setBankCharges(e.target.value)} className="h-9 text-sm" />
                            </div>
                        </div>

                        {/* Payment Date & Payment # */}
                        <div className="grid grid-cols-12 gap-8 items-center">
                            <Label className="col-span-2 text-red-500 font-medium text-sm">Payment Date*</Label>
                            <div className="col-span-5">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal border-gray-200 bg-white h-9 text-sm", !date && "text-muted-foreground")}>
                                            {date ? format(date, "dd/MM/yyyy") : "dd/MM/yyyy"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <Label className="col-span-2 text-red-500 font-medium text-sm">Payment #*</Label>
                            <div className="col-span-3">
                                <Input value={paymentNumber} onChange={(e) => setPaymentNumber(e.target.value)} className="h-9 text-sm pr-8" />
                            </div>
                        </div>

                        {/* Payment Mode & Deposit To & Reference */}
                        <div className="grid grid-cols-12 gap-8 items-center">
                            <Label className="col-span-2 text-gray-700 font-medium text-sm">Payment Mode</Label>
                            <div className="col-span-3">
                                <Select>
                                    <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm"><SelectValue>{paymentMode}</SelectValue></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                        <SelectItem value="Card">Card</SelectItem>
                                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Label className="col-span-2 text-red-500 font-medium text-sm">Deposit To*</Label>
                            <div className="col-span-3">
                                <Select>
                                    <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm"><SelectValue>{depositTo}</SelectValue></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Petty Cash">Petty Cash</SelectItem>
                                        <SelectItem value="Bank Account">Bank Account</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Label className="col-span-2 text-gray-700 font-medium text-sm">Reference#</Label>
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <Input value={reference} onChange={(e) => setReference(e.target.value)} className="h-9 text-sm" />
                            </div>
                        </div>

                        {/* Tax Deducted? */}
                        <div className="grid grid-cols-12 gap-8 items-center">
                            <Label className="col-span-2 text-gray-700 font-medium text-sm">Tax deducted?</Label>
                            <div className="col-span-10 flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="radio" name="tax" checked={!taxDeducted} onChange={() => setTaxDeducted(false)} />
                                    <span className="ml-1">No Tax deducted</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="radio" name="tax" checked={taxDeducted} onChange={() => setTaxDeducted(true)} />
                                    <span className="ml-1">Yes, TDS (Income Tax)</span>
                                </label>
                            </div>
                        </div>

                        {/* TDS Tax Account (conditional) */}
                        {taxDeducted && (
                            <div className="grid grid-cols-12 gap-8 items-center">
                                <Label className="col-span-2 text-red-500 font-medium text-sm">TDS Tax Account*</Label>
                                <div className="col-span-5 relative">
                                    <Select>
                                        <SelectTrigger className="border-gray-200 bg-white text-gray-700 h-9 text-sm"><SelectValue>{tdsAccount}</SelectValue></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Advance Tax">Advance Tax</SelectItem>
                                            <SelectItem value="Employee Advance">Employee Advance</SelectItem>
                                            <SelectItem value="Prepaid Expenses">Prepaid Expenses</SelectItem>
                                            <SelectItem value="TDS Receivable">TDS Receivable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* Unpaid Invoices placeholder */}
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-medium text-gray-700">Unpaid Invoices</h4>
                                <div className="text-sm text-blue-500 cursor-pointer">Clear Applied Amount</div>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-sm p-6 text-center text-gray-500">There are no unpaid invoices associated with this customer.</div>
                        </div>

                        {/* Bottom area with notes, attachments, summary and actions */}
                        <div className="grid grid-cols-12 gap-6 items-start">
                            <div className="col-span-12 lg:col-span-8">
                                <div className="mb-4">
                                    <Label className="text-sm font-medium">Notes (Internal use. Not visible to customer)</Label>
                                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 h-24" />
                                </div>

                                <div className="mb-4">
                                    <Label className="text-sm font-medium">Attachments</Label>
                                    <div className="mt-2 flex items-center gap-3">
                                        <Button variant="outline" className="h-9 flex items-center gap-2"><Upload className="h-4 w-4" /> Upload File</Button>
                                        <div className="text-sm text-gray-500">You can upload a maximum of 5 files, 5MB each</div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="flex items-center gap-3">
                                        <input type="checkbox" defaultChecked />
                                        <span className="text-sm">Send a \"Thank you\" note for this payment</span>
                                    </label>

                                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm flex items-center gap-2">
                                            <input type="checkbox" defaultChecked />
                                            <span>Ajay P &lt;ajay.pihulkar@lockated.com&gt;</span>
                                        </div>
                                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm flex items-center gap-2">
                                            <input type="checkbox" />
                                            <span>mm mm &lt;mm@gmail.com&gt;</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="outline" className="px-4">Save as Draft</Button>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4">Save as Paid</Button>
                                    <Button variant="ghost" className="px-4" onClick={() => navigate(-1)}>Cancel</Button>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-4">
                                <div className="bg-[#fafafa] border border-gray-100 rounded-md p-6">
                                    <div className="text-sm text-gray-600 mb-3">Total</div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm text-gray-600">Amount Received :</div>
                                        <div className="text-sm font-medium">0.00</div>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm text-gray-600">Amount used for Payments :</div>
                                        <div className="text-sm font-medium">0.00</div>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm text-gray-600">Amount Refunded :</div>
                                        <div className="text-sm font-medium">0.00</div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 border-t pt-3">
                                        <div className="text-sm text-red-500">Amount in Excess:</div>
                                        <div className="text-sm font-medium">₹ 0.00</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordPaymentPage;
