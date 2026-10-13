import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Link as LinkIcon,
  Send,
  Copy,
  X,
} from "lucide-react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { accountingToast as toast } from "@/lib/accountingToast";
import "@/styles/accounting.css";

interface PaymentLink {
  id: number;
  payment_link_number: string;
  customer_name: string;
  date: string;
  amount: number;
  status: string;
  reference_number: string;
  description: string;
  project_name: string;
}

const columns: ColumnConfig[] = [
  {
    key: "actions",
    label: "Action",
    sortable: false,
    hideable: false,
    draggable: false,
  },
  {
    key: "date",
    label: "Date",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "payment_link_number",
    label: "Payment Link #",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "reference_number",
    label: "Reference#",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "customer_name",
    label: "Customer Name",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "project_name",
    label: "Project Name",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    hideable: true,
    draggable: true,
  },
];

const mockData: PaymentLink[] = [
  {
    id: 1,
    date: "2024-02-18",
    payment_link_number: "PL-00001",
    reference_number: "REF-001",
    customer_name: "Acme Corp",
    project_name: "Website Redesign",
    amount: 5000,
    status: "sent",
    description: "Initial deposit",
  },
  {
    id: 2,
    date: "2024-02-17",
    payment_link_number: "PL-00002",
    reference_number: "REF-002",
    customer_name: "Global Tech",
    project_name: "Mobile App",
    amount: 12500,
    status: "paid",
    description: "Milestone 1",
  },
  {
    id: 3,
    date: "2024-02-15",
    payment_link_number: "PL-00003",
    reference_number: "REF-003",
    customer_name: "Local Business",
    project_name: "Consulting",
    amount: 2000,
    status: "overdue",
    description: "Consultation fee",
  },
];

export const PaymentLinksDashboard = () => {
  const navigate = useNavigate();
  const [isNewLinkOpen, setIsNewLinkOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusTones: Record<string, string> = {
      draft: "neutral",
      sent: "info",
      paid: "success",
      overdue: "danger",
      cancelled: "neutral",
    };
    const key = status.toLowerCase();

    return (
      <span className={`acc-pill acc-pill--${statusTones[key] || "neutral"}`}>
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </span>
    );
  };

  const renderRow = (item: PaymentLink) => ({
    actions: (
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ),
    date: <span className="acc-amount-plain">{item.date}</span>,
    payment_link_number: (
      <span className="acc-row-name cursor-pointer hover:underline">
        {item.payment_link_number}
      </span>
    ),
    reference_number: (
      <span>{item.reference_number}</span>
    ),
    customer_name: (
      <span>{item.customer_name}</span>
    ),
    project_name: (
      <span>{item.project_name}</span>
    ),
    amount: (
      <span className="acc-amount">
        ₹
        {item.amount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
    status: getStatusBadge(item.status),
  });

  return (
    <div className="accounting-ui p-6 space-y-6 h-[calc(100vh-80px)] flex flex-col overflow-y-auto bg-white">
      <header className="flex items-center justify-between shrink-0">
        <h1 className="acc-title">All Payment Links</h1>
      </header>

      <EnhancedTaskTable
        data={mockData}
        columns={columns}
        renderRow={renderRow}
        storageKey="payment-links-dashboard-v1"
        hideTableExport={true}
        hideTableSearch={false}
        enableSearch={true}
        isLoading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        leftActions={
          <div className="flex items-center gap-2">
            <Button
              className="fm-button-fix fm-button-brand px-4 py-2P"
              onClick={() => setIsNewLinkOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> New
            </Button>
          </div>
        }
      />

      <div className="mt-auto">
        <TicketPagination
          currentPage={currentPage}
          totalPages={1}
          totalRecords={mockData.length}
          perPage={perPage}
          isLoading={loading}
          onPageChange={setCurrentPage}
          onPerPageChange={setPerPage}
        />
      </div>

      {/* Create Payment Link Modal */}
      <Dialog open={isNewLinkOpen} onOpenChange={setIsNewLinkOpen}>
        <DialogContent className="accounting-ui acc-dialog sm:max-w-[580px]">
          <DialogHeader className="acc-dialog-head flex flex-row items-center justify-between">
            <DialogTitle className="acc-dialog-title">
              New Payment Link
            </DialogTitle>
            <button
              type="button"
              className="acc-dialog-close"
              aria-label="Close"
              onClick={() => setIsNewLinkOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>

          <div className="acc-form acc-dialog-body">
            <div className="acc-field">
              <Label className="acc-label">
                Customer Name <span className="">*</span>
              </Label>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer1">Customer 1</SelectItem>
                    <SelectItem value="customer2">Customer 2</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="icon"
                  className="acc-icon-btn shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="acc-field">
              <Label className="acc-label">
                Payment Amount <span className="">*</span>
              </Label>
              <Input />
            </div>

            <div className="acc-field">
              <Label className="acc-label">
                Link Expiration Date <span className="">*</span>
              </Label>
              <div className="relative">
                <Input
                  className="pr-10"
                  defaultValue="04/03/2026"
                />
              </div>
            </div>

            <div className="acc-field">
              <Label className="acc-label">
                Description <span className="">*</span>
              </Label>
              <Textarea
                placeholder="Tell your customer why you're collecting this payment..."
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>

          <DialogFooter className="acc-dialog-foot acc-actions">
            <Button
              variant="outline"
              className="acc-btn acc-btn-sm acc-btn-secondary"
              onClick={() => setIsNewLinkOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="outline"
              className="acc-btn acc-btn-sm acc-btn-secondary"
            >
              Save and Share
            </Button>

            <Button className="acc-btn acc-btn-sm fm-button-fix fm-button-brand" onClick={() => toast.success("Payment link generated successfully!")}>
              Generate Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
