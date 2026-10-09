import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Settings,
  Plus,
  MoreVertical,
  MinusCircle,
  Search,
  ChevronDown,
  Pencil,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/styles/accounting.css";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface InvoiceItem {
  id: number;
  description: string;
  amount: number;
}

const customers = [
  {
    value: "customer1",
    label: "Lockated",
    email: "ajaypihulkar@gmail.com",
    company: "Lockated",
    initial: "L",
    currency: "INR",
    billingAddress: [
      "Karve nagar",
      "Pune",
      "Maharashtra 411052",
      "India",
      "Phone: +91-9090876567",
    ],
  },
  {
    value: "customer2",
    label: "Mr. Ajay P",
    email: "ajay.pihulkar@lockated.com",
    company: "Gophygital",
    initial: "M",
    currency: "USD",
    billingAddress: [
      "123 Tech Park",
      "Mumbai",
      "Maharashtra 400001",
      "India",
      "Phone: +91-9876543210",
    ],
  },
];

export const CreateRetainerInvoicePage = () => {
  const navigate = useNavigate();

  // Form State
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [retainerNumber, setRetainerNumber] = useState("RET-00001");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    format(new Date(), "dd/MM/yyyy")
  ); // Default to today
  const [projectName, setProjectName] = useState("");

  // Items State
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: "", amount: 0 },
  ]);

  // Bottom Section State
  const [customerNotes, setCustomerNotes] = useState("");
  const [termsConditions, setTermsConditions] = useState("");

  // Handlers
  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), description: "", amount: 0 }]);
  };

  const handleDeleteItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateTotal = () => {
    return items
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
      .toFixed(2);
  };

  return (
    <div className="accounting-ui flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="acc-page-head max-w-5xl mx-auto w-full px-8 pt-6 pb-[22px]">
        <button type="button" onClick={() => navigate(-1)} className="acc-back-link">
          <ArrowLeft className="w-[18px] h-[18px]" />
          Back to Retainer Invoices
        </button>
        <h1 className="acc-title mt-3.5">New Retainer Invoice</h1>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 max-w-5xl mx-auto w-full">
        {/* Top Form Fields */}
        <div className="acc-form grid grid-cols-12 gap-x-8 mb-8">
          {/* Customer Name */}
          <div className="col-span-12 mb-1.5">
            <label className="acc-label">
              Customer Name <span className="">*</span>
            </label>
          </div>
          <div className="mb-6 col-span-5 relative flex flex-col gap-4">
            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between font-normal shadow-none h-11"
                    >
                      {customerName
                        ? customers.find((c) => c.value === customerName)?.label
                        : "Select or add a customer"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="acc-menu w-[500px] p-0"
                    align="start"
                  >
                    <Command className="rounded-lg border shadow-none">
                      <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <CommandInput
                          placeholder="Search"
                          className="border-none focus:ring-0 shadow-none h-11"
                        />
                      </div>
                      <CommandList className="max-h-[300px] overflow-y-auto p-1">
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup>
                          {customers.map((customer) => (
                            <CommandItem
                              key={customer.value}
                              value={customer.value}
                              onSelect={(currentValue) => {
                                setCustomerName(
                                  currentValue === customerName
                                    ? ""
                                    : currentValue
                                );
                                setOpen(false);
                              }}
                              className="acc-menu-item flex items-center gap-3 p-3 group cursor-pointer mb-1"
                            >
                              <div
                                className="acc-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                              >
                                {customer.initial}
                              </div>
                              <div className="flex flex-col">
                                <span className="acc-menu-name">
                                  {customer.label}
                                </span>
                                <span className="acc-menu-meta flex items-center gap-1">
                                  <span className="truncate max-w-[150px]">
                                    {customer.email}
                                  </span>
                                  <span className="acc-menu-sep">|</span>
                                  <span>{customer.company}</span>
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        <CommandSeparator className="my-1" />
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {}}
                            className="acc-menu-item acc-menu-add flex items-center gap-2 p-3 cursor-pointer"
                          >
                            <div className="acc-menu-add-icon flex h-5 w-5 items-center justify-center rounded-full">
                              <Plus className="h-3 w-3" />
                            </div>
                            <span className="font-medium">New Customer</span>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                size="icon"
                variant="outline"
                className="acc-icon-btn shrink-0"
                aria-label="Search customers"
              >
                <Search className="h-5 w-5" />
              </Button>
              {customerName && (
                <div className="acc-prefix-chip flex items-center justify-center px-3.5 h-11 shrink-0">
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">₹</span>
                    {customers.find((c) => c.value === customerName)
                      ?.currency || "INR"}
                  </span>
                </div>
              )}
            </div>

            {/* Billing Address Section */}
            {customerName && (
              <div className="ml-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="acc-secthead">
                    Billing Address
                  </span>
                  <button className="acc-ghost-icon" aria-label="Edit billing address">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="acc-body-text">
                  {customers
                    .find((c) => c.value === customerName)
                    ?.billingAddress?.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="mb-6 col-span-4 flex justify-end items-start pt-1">
            {customerName && (
              <Button
                variant="default"
                className="acc-btn acc-btn-sm acc-btn-secondary"
              >
                {customers.find((c) => c.value === customerName)?.label}'s
                Details
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Retainer Invoice Number */}
          <div className="col-span-12 mb-1.5">
            <label className="acc-label">
              Retainer Invoice Number <span className="fm-required-mark">*</span>
            </label>
          </div>
          <div className="mb-6 col-span-5 relative">
            <Input
              value={retainerNumber}
              onChange={(e) => setRetainerNumber(e.target.value)}
              className="w-full pr-10"
            />
            <button className="acc-ghost-icon absolute right-3 top-1/2 -translate-y-1/2" aria-label="Invoice number settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <div className="mb-6 col-span-4"></div>

          {/* Reference# */}
          <div className="col-span-12 mb-1.5">
            <label className="acc-label">
              Reference#
            </label>
          </div>
          <div className="mb-6 col-span-5">
            <Input
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-6 col-span-4"></div>

          {/* Retainer Invoice Date */}
          <div className="col-span-12 mb-1.5">
            <label className="acc-label">
              Retainer Invoice Date <span className="fm-required-mark">*</span>
            </label>
          </div>
          <div className="mb-6 col-span-5">
            <Input
              type="text"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-6 col-span-4"></div>

          {/* Project Name */}
          <div className="col-span-12 mb-1.5">
            <label className="acc-label">
              Project Name
            </label>
          </div>
          <div className="mb-6 col-span-5">
            <Select value={projectName} onValueChange={setProjectName}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project1">Project 1</SelectItem>
                <SelectItem value="project2">Project 2</SelectItem>
              </SelectContent>
            </Select>
            <p className="acc-hint mt-1.5">
              Select a customer to associate a project.
            </p>
          </div>
          <div className="mb-6 col-span-4"></div>
        </div>

        {/* Items Table */}
        <div className="acc-table-wrap acc-line-items mb-8">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[65%]">
                  Description
                </TableHead>
                <TableHead className="acc-num w-[30%] text-right">
                  Amount
                </TableHead>
                <TableHead className="w-[5%] h-9"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-transparent group"
                >
                  <TableCell className="p-0 align-top">
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, "description", e.target.value)
                      }
                      placeholder="Description"
                      className="acc-cell-input min-h-[60px] w-full border-0 rounded-none resize-none focus-visible:ring-0 px-3 py-2 shadow-none"
                    />
                  </TableCell>
                  <TableCell className="acc-num p-0 align-top">
                    <Input
                      type="number"
                      value={item.amount === 0 ? "0.00" : item.amount}
                      onChange={(e) =>
                        handleItemChange(item.id, "amount", e.target.value)
                      }
                      className="acc-cell-input w-full border-0 rounded-none focus-visible:ring-0 text-right h-[60px] px-4 shadow-none"
                      style={{ backgroundColor: "transparent" }}
                      min="0"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell className="p-0 align-middle text-center">
                    <div className="hidden group-hover:flex items-center justify-center gap-1">
                      <button className="acc-ghost-icon cursor-move" aria-label="Reorder row">
                        <MoreVertical size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="acc-ghost-icon"
                        aria-label="Remove row"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add Row & Total */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="acc-btn acc-btn-secondary acc-btn-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add New Row
            </Button>
          </div>

          <div className="acc-total flex gap-12 pr-8">
            <span>Total</span>
            <span>{calculateTotal()}</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="acc-form grid grid-cols-2 gap-12 mb-12">
          <div className="space-y-2">
            <label className="acc-label block">
              Customer Notes
            </label>
            <Textarea
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Enter any notes to be displayed in your transaction"
              className="resize-y"
            />
          </div>
          <div className="space-y-2">
            <label className="acc-label block">
              Terms & Conditions
            </label>
            <Textarea
              value={termsConditions}
              onChange={(e) => setTermsConditions(e.target.value)}
              placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
              className="resize-y"
            />
          </div>
        </div>

        {/* Payment Gateway Promo */}
        <div className="mb-8">
          <div className="acc-body-text flex items-center gap-2 mb-2">
            Want to get paid faster?
            <div className="flex gap-1">
              <div className="acc-card-logo h-4 w-6"></div>{" "}
              {/* Mastercard placeholder */}
              <div className="acc-card-logo h-4 w-6"></div>{" "}
              {/* Visa placeholder */}
            </div>
          </div>
          <a
            href="#"
            className="acc-link text-xs mb-4 block"
          >
            Configure payment gateways and receive payments online. Set up
            Payment Gateway
          </a>

          <div className="acc-notice-info p-4 flex items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="acc-notice-icon p-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm">
                  Introducing{" "}
                  <span className="font-semibold">Zoho Payments</span>, our
                  unified payment solution designed to work seamlessly with your
                  business apps. Set up now and manage payments, refunds, and
                  disputes effortlessly.{" "}
                  <a href="#" className="acc-notice-link hover:underline">
                    View Platform Fee Details
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Button className="acc-btn acc-btn-primary acc-btn-xs">
                Set Up Now
              </Button>
              <button className="acc-ghost-icon" aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Fields Info */}
        <div className="acc-divider mb-20 pt-4">
          <p className="acc-hint">
            <span className="font-semibold">
              Additional Fields:
            </span>{" "}
            Start adding custom fields for your retainer invoices by going to{" "}
            <span className="italic">Settings ➔ Sales ➔ Retainer Invoices</span>
            .
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="acc-footer px-8 py-4 flex justify-between items-center shrink-0">
        <div className="acc-hint">
          PDF Template: <span className="font-medium">'Standard Template'</span>{" "}
          <a href="#" className="acc-link ml-1">
            Change
          </a>
        </div>
        <div className="acc-actions">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="acc-btn acc-btn-secondary"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="acc-btn acc-btn-secondary"
          >
            Save as Draft
          </Button>
          <Button className="acc-btn fm-button-fix fm-button-brand text-white">
            Save and Send
          </Button>
        </div>
      </div>
    </div>
  );
};
