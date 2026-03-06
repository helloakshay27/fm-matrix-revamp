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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-[#f6f4ee]">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-gray-500">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            New Retainer Invoice
          </span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
        {/* Top Form Fields */}
        <div className="grid grid-cols-12 gap-y-6 gap-x-8 mb-8">
          {/* Customer Name */}
          <div className="col-span-3">
            <label className="text-sm font-medium text-red-700">
              Customer Name*
            </label>
          </div>
          <div className="col-span-5 relative flex flex-col gap-4">
            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-white border-gray-300 text-gray-500 hover:bg-white hover:text-gray-700 font-normal shadow-none h-11"
                    >
                      {customerName
                        ? customers.find((c) => c.value === customerName)?.label
                        : "Select or add a customer"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[500px] p-0 shadow-lg border-gray-200"
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
                              className="flex items-center gap-3 p-3 data-[selected=true]:bg-[#f6f4ee] group cursor-pointer rounded-md mb-1"
                            >
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600`}
                              >
                                {customer.initial}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm text-gray-900">
                                  {customer.label}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <span className="truncate max-w-[150px]">
                                    {customer.email}
                                  </span>
                                  <span className="text-gray-300">|</span>
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
                            className="flex items-center gap-2 p-3 text-red-700 cursor-pointer hover:bg-red-50 rounded-md"
                          >
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-700 text-white">
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
                className="bg-blue-500 hover:bg-blue-600 rounded-md shrink-0 w-11 h-11"
              >
                <Search className="h-5 w-5 text-white" />
              </Button>
              {customerName && (
                <div className="flex items-center justify-center px-3 border border-gray-200 rounded-md bg-white h-11 shrink-0">
                  <span className="text-green-600 flex items-center gap-1 font-medium text-sm">
                    <div className="w-3 h-3 rounded-full border border-green-600 flex items-center justify-center text-[8px]">
                      ₹
                    </div>
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
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Billing Address
                  </span>
                  <button className="text-gray-400 hover:text-blue-500 transition-colors">
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-sm text-gray-800 leading-relaxed font-normal">
                  {customers
                    .find((c) => c.value === customerName)
                    ?.billingAddress?.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="col-span-4 flex justify-end items-start pt-1">
            {customerName && (
              <Button
                variant="default"
                className="bg-[#3e445b] hover:bg-[#2d3243] text-white h-10 px-4 text-sm font-medium flex items-center gap-2 rounded-md"
              >
                {customers.find((c) => c.value === customerName)?.label}'s
                Details
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Retainer Invoice Number */}
          <div className="col-span-3">
            <label className="text-sm font-medium text-red-700">
              Retainer Invoice Number*
            </label>
          </div>
          <div className="col-span-5 relative">
            <Input
              value={retainerNumber}
              onChange={(e) => setRetainerNumber(e.target.value)}
              className="w-full border-gray-300 pr-10"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <div className="col-span-4"></div>

          {/* Reference# */}
          <div className="col-span-3">
            <label className="text-sm font-medium text-gray-700">
              Reference#
            </label>
          </div>
          <div className="col-span-5">
            <Input
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full border-gray-300"
            />
          </div>
          <div className="col-span-4"></div>

          {/* Retainer Invoice Date */}
          <div className="col-span-3">
            <label className="text-sm font-medium text-red-700">
              Retainer Invoice Date*
            </label>
          </div>
          <div className="col-span-5">
            <Input
              type="text"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full border-gray-300"
            />
          </div>
          <div className="col-span-4"></div>

          {/* Project Name */}
          <div className="col-span-3">
            <label className="text-sm font-medium text-gray-700">
              Project Name
            </label>
          </div>
          <div className="col-span-5">
            <Select value={projectName} onValueChange={setProjectName}>
              <SelectTrigger className="w-full bg-white border-gray-300 text-gray-400">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project1">Project 1</SelectItem>
                <SelectItem value="project2">Project 2</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1 pl-1">
              Select a customer to associate a project.
            </p>
          </div>
          <div className="col-span-4"></div>
        </div>

        {/* Items Table */}
        <div className="mb-8 border border-gray-200 rounded-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-b-gray-200 hover:bg-gray-50">
                <TableHead className="w-[65%] font-semibold text-gray-600 h-9 pl-4">
                  Description
                </TableHead>
                <TableHead className="w-[30%] text-right font-semibold text-gray-600 h-9 pr-4">
                  Amount
                </TableHead>
                <TableHead className="w-[5%] h-9"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="border-b-gray-200 hover:bg-transparent group"
                >
                  <TableCell className="p-0 border-r border-gray-200 align-top">
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, "description", e.target.value)
                      }
                      placeholder="Description"
                      className="min-h-[60px] w-full border-0 rounded-none resize-none focus-visible:ring-0 px-3 py-2 shadow-none"
                    />
                  </TableCell>
                  <TableCell className="p-0 align-top border-r border-gray-200">
                    <Input
                      type="number"
                      value={item.amount === 0 ? "0.00" : item.amount}
                      onChange={(e) =>
                        handleItemChange(item.id, "amount", e.target.value)
                      }
                      className="w-full border-0 rounded-none focus-visible:ring-0 text-right h-[60px] px-4 shadow-none"
                      style={{ backgroundColor: "transparent" }}
                      min="0"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell className="p-0 align-middle text-center">
                    <div className="hidden group-hover:flex items-center justify-center gap-1">
                      <button className="text-gray-400 hover:text-gray-600 cursor-move">
                        <MoreVertical size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-700 hover:text-red-700"
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
              className="text-blue-600 border-none bg-blue-50/50 hover:bg-blue-100 hover:text-blue-700 h-8 px-3 text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add New Row
            </Button>
          </div>

          <div className="flex gap-12 text-sm font-semibold text-gray-800 pr-8">
            <span>Total</span>
            <span>{calculateTotal()}</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Customer Notes
            </label>
            <Textarea
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Enter any notes to be displayed in your transaction"
              className="bg-white border-gray-300 min-h-[80px] text-sm resize-y"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Terms & Conditions
            </label>
            <Textarea
              value={termsConditions}
              onChange={(e) => setTermsConditions(e.target.value)}
              placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
              className="bg-white border-gray-300 min-h-[80px] text-sm resize-y"
            />
          </div>
        </div>

        {/* Payment Gateway Promo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            Want to get paid faster?
            <div className="flex gap-1">
              <div className="h-4 w-6 bg-red-700 rounded-sm"></div>{" "}
              {/* Mastercard placeholder */}
              <div className="h-4 w-6 bg-blue-600 rounded-sm"></div>{" "}
              {/* Visa placeholder */}
            </div>
          </div>
          <a
            href="#"
            className="text-xs text-blue-500 hover:underline mb-4 block"
          >
            Configure payment gateways and receive payments online. Set up
            Payment Gateway
          </a>

          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-md border border-blue-100 shadow-sm">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-800">
                  Introducing{" "}
                  <span className="font-semibold">Zoho Payments</span>, our
                  unified payment solution designed to work seamlessly with your
                  business apps. Set up now and manage payments, refunds, and
                  disputes effortlessly.{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    View Platform Fee Details
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 h-8">
                Set Up Now
              </Button>
              <button className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Fields Info */}
        <div className="mb-20 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-600">
              Additional Fields:
            </span>{" "}
            Start adding custom fields for your retainer invoices by going to{" "}
            <span className="italic">Settings ➔ Sales ➔ Retainer Invoices</span>
            .
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-8 py-4 bg-white flex justify-between items-center shrink-0">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Save as Draft
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Save and Send
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-gray-300"
          >
            Cancel
          </Button>
        </div>
        <div className="text-xs text-gray-600">
          PDF Template: <span className="font-medium">'Standard Template'</span>{" "}
          <a href="#" className="text-blue-500 hover:underline ml-1">
            Change
          </a>
        </div>
      </div>
    </div>
  );
};
