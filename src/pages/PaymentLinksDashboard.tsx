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
import { toast } from "sonner"; // Assuming sonner is used as in SalesOrderListPage

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
    const statusColors: Record<string, string> = {
      draft: "bg-yellow-100 text-yellow-800",
      sent: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.toUpperCase()}
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
            className="h-8 w-8 text-gray-500 hover:text-blue-600"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ),
    date: <span className="text-sm text-gray-600">{item.date}</span>,
    payment_link_number: (
      <span className="font-medium text-blue-600 cursor-pointer hover:underline">
        {item.payment_link_number}
      </span>
    ),
    reference_number: (
      <span className="text-sm text-gray-900">{item.reference_number}</span>
    ),
    customer_name: (
      <span className="text-sm text-gray-900">{item.customer_name}</span>
    ),
    project_name: (
      <span className="text-sm text-gray-600">{item.project_name}</span>
    ),
    amount: (
      <span className="text-sm font-medium text-gray-900">
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
    <div className="p-6 space-y-6 h-[calc(100vh-80px)] flex flex-col overflow-y-auto bg-white">
      <header className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">All Payment Links</h1>
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
              className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
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
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-normal text-gray-800">
              New Payment Link
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-red-500 font-normal">Customer Name*</Label>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-full text-gray-500 border-gray-300 focus:ring-blue-500">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer1">Customer 1</SelectItem>
                    <SelectItem value="customer2">Customer 2</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="icon"
                  className="bg-blue-500 hover:bg-blue-600 text-white shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-red-500 font-normal">
                Payment Amount*
              </Label>
              <Input className="border-gray-300 focus:ring-blue-500" />
            </div>

            <div className="space-y-2">
              <Label className="text-red-500 font-normal">
                Link Expiration Date*
              </Label>
              <div className="relative">
                <Input
                  className="border-gray-300 focus:ring-blue-500 pr-10"
                  defaultValue="04/03/2026"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-red-500 font-normal">Description*</Label>
              <Textarea
                placeholder="Tell your customer why you're collecting this payment..."
                className="min-h-[100px] resize-none border-gray-300 focus:ring-blue-500"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50 sm:justify-start gap-2">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Generate Link
            </Button>
            <Button
              variant="outline"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Save and Share
            </Button>
            <Button
              variant="outline"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsNewLinkOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
