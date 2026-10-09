import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "@/styles/accounting.css";
import {
  Plus,
  MoreHorizontal,
  ArrowDownUp,
  ArrowUp,
  Settings,
  Columns,
  RefreshCw,
  RefreshCcw,
  Download,
  ArrowDown,
  Lock,
  Eye,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";

interface RetainerInvoice {
  id: number;
  retainer_invoice_number: string;
  customer_name: string;
  date: string;
  project_name: string;
  amount: number;
  balance: number;
  status: string;
  reference_number: string;
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
    key: "retainer_invoice_number",
    label: "Retainer Invoice #",
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
    key: "status",
    label: "Status",
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
    key: "balance",
    label: "Balance",
    sortable: true,
    hideable: true,
    draggable: true,
  },
];

const mockData: RetainerInvoice[] = [
  {
    id: 1,
    date: "2024-02-18",
    retainer_invoice_number: "RI-00001",
    reference_number: "REF-001",
    customer_name: "Acme Corp",
    project_name: "Website Redesign",
    amount: 5000,
    balance: 2500,
    status: "sent",
  },
  {
    id: 2,
    date: "2024-02-17",
    retainer_invoice_number: "RI-00002",
    reference_number: "REF-002",
    customer_name: "Global Tech",
    project_name: "Mobile App",
    amount: 10000,
    balance: 0,
    status: "paid",
  },
  {
    id: 3,
    date: "2024-02-15",
    retainer_invoice_number: "RI-00003",
    reference_number: "REF-003",
    customer_name: "Local Business",
    project_name: "Consulting",
    amount: 2000,
    balance: 2000,
    status: "draft",
  },
];

export const RetainerInvoicesDashboard = () => {
  const navigate = useNavigate();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [activePreferenceTab, setActivePreferenceTab] = useState("preferences");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
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

  const renderRow = (item: RetainerInvoice) => ({
    actions: (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedRows.includes(item.id)}
          onChange={(e) => {
            setSelectedRows((prev) =>
              e.target.checked
                ? [...prev, item.id]
                : prev.filter((id) => id !== item.id)
            );
          }}
          className="acc-checkbox"
        />
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ),
    date: <span className="acc-amount-plain">{item.date}</span>,
    retainer_invoice_number: (
      <span className="acc-row-name cursor-pointer hover:underline">
        {item.retainer_invoice_number}
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
    status: getStatusBadge(item.status),
    amount: (
      <span className="acc-amount">
        ₹
        {item.amount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
    balance: (
      <span className="acc-amount-plain">
        ₹
        {item.balance.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  });

  return (
    <div className="accounting-ui p-6 space-y-6 h-[calc(100vh-80px)] flex flex-col overflow-y-auto bg-white">
      {/* Header Section */}
      <header className="flex items-center justify-between shrink-0">
        <h1 className="acc-title">
          All Retainer Invoices
        </h1>
      </header>

      <EnhancedTaskTable
        data={mockData}
        columns={columns}
        renderRow={renderRow}
        storageKey="retainer-invoices-dashboard-v1"
        hideTableExport={true}
        hideTableSearch={false}
        enableSearch={true}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        leftActions={
          <div className="flex items-center gap-2">
            <Button
              className="acc-btn acc-btn-sm fm-button-fix fm-button-brand"
              onClick={() => navigate("/accounting/retainer-invoices/new")}
            >
              <Plus className="w-4 h-4 mr-2" /> New
            </Button>
          </div>
        }
        rightActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/accounting/retainer-invoices/import")}
              className="acc-tool-btn"
              title="Import"
              aria-label="Import"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="acc-tool-btn"
              title="Export"
              aria-label="Export"
            >
              <Download className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="acc-tool-btn"
                  aria-label="More actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="acc-menu w-56">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="acc-menu-item flex items-center gap-2 py-2 mb-1 cursor-pointer">
                    <ArrowDownUp className="w-4 h-4" /> <span>Sort by</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent
                    className="acc-menu w-56"
                    sideOffset={8}
                    alignOffset={-4}
                  >
                    <DropdownMenuItem className="acc-menu-item justify-between mb-1 cursor-pointer">
                      <span>Created Time</span>
                      <ArrowUp className="w-4 h-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="acc-menu-item cursor-pointer">
                      Last Modified Time
                    </DropdownMenuItem>
                    <DropdownMenuItem className="acc-menu-item cursor-pointer">
                      Date
                    </DropdownMenuItem>
                    <DropdownMenuItem className="acc-menu-item cursor-pointer">
                      Retainer Invoice Number
                    </DropdownMenuItem>
                    <DropdownMenuItem className="acc-menu-item cursor-pointer">
                      Customer Name
                    </DropdownMenuItem>
                    <DropdownMenuItem className="acc-menu-item cursor-pointer">
                      Amount
                    </DropdownMenuItem>
                    <DropdownMenuItem className="acc-menu-item cursor-pointer">
                      Balance
                    </DropdownMenuItem>
                    <DropdownMenuItem className="acc-menu-item cursor-pointer">
                      Issued Date
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />

                {/* Preferences Button */}
                <DropdownMenuItem
                  onSelect={() => {
                    setIsPreferencesOpen(true);
                    setActivePreferenceTab("preferences");
                  }}
                  className="acc-menu-item cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" /> Preferences
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setIsPreferencesOpen(true);
                    setActivePreferenceTab("field_customization");
                  }}
                  className="acc-menu-item cursor-pointer"
                >
                  <Columns className="w-4 h-4 mr-2" /> Manage Custom Fields
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="acc-menu-item cursor-pointer">
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh List
                </DropdownMenuItem>
                <DropdownMenuItem className="acc-menu-item cursor-pointer">
                  <RefreshCcw className="w-4 h-4 mr-2" /> Reset Column Width
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      {/* Preferences Sheet */}
      <Sheet open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <SheetContent className="accounting-ui w-[800px] sm:w-[800px] sm:max-w-[800px] p-0 flex flex-col">
          <Tabs
            value={activePreferenceTab}
            onValueChange={setActivePreferenceTab}
            className="w-full h-full flex flex-col"
          >
            <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between relative shrink-0">
              <div className="flex items-center gap-4">
                <TabsList className="acc-tabs h-auto">
                  <TabsTrigger
                    value="preferences"
                    className="acc-tab"
                  >
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger
                    value="field_customization"
                    className="acc-tab"
                  >
                    Field Customization
                  </TabsTrigger>
                </TabsList>
              </div>
              {/* All Preferences Link */}
              <div className="acc-link absolute right-12 top-6 text-sm cursor-pointer">
                All Preferences
              </div>
            </SheetHeader>

            <TabsContent
              value="preferences"
              className="flex-1 flex flex-col h-full overflow-hidden data-[state=inactive]:hidden"
            >
              <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
                <div className="acc-form space-y-5">
                  <div className="acc-field">
                    <label className="acc-label">
                      Terms & Conditions
                    </label>
                    <Textarea
                      className="min-h-[150px] resize-none"
                      placeholder=""
                    />
                  </div>

                  <div className="acc-field">
                    <label className="acc-label">
                      Customer Notes
                    </label>
                    <Textarea
                      className="min-h-[150px] resize-none"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
              <div className="acc-footer acc-actions p-4 shrink-0 mt-auto">
                <Button className="acc-btn acc-btn-primary">
                  Save
                </Button>
              </div>
            </TabsContent>

            <TabsContent
              value="field_customization"
              className="flex-1 overflow-y-auto flex flex-col pt-4 px-6 data-[state=inactive]:hidden"
            >
              <div className="flex justify-end mb-4 shrink-0">
                <Button className="acc-btn acc-btn-sm acc-btn-primary">
                  <Plus className="w-4 h-4 mr-2" /> New
                </Button>
              </div>

              <div className="bg-white">
                {/* Header */}
                <div className="acc-grid-head grid grid-cols-12 gap-4 px-4 py-[11px]">
                  <div className="col-span-4 pl-2">Field Name</div>
                  <div className="col-span-3">Data Type</div>
                  <div className="col-span-2 text-center">Mandatory</div>
                  <div className="col-span-2">Show in all PDFs</div>
                  <div className="col-span-1">Status</div>
                </div>

                {/* Row 1 */}
                <div className="acc-grid-row grid grid-cols-12 gap-4 px-4 py-[13px] items-center group">
                  <div className="col-span-4 flex items-center gap-3 pl-2">
                    <Lock className="acc-row-icon w-4 h-4" />
                    <span className="acc-row-name">Terms & Conditions</span>
                  </div>
                  <div className="col-span-3">
                    Text Box (Multi-line)
                  </div>
                  <div className="col-span-2 text-center">No</div>
                  <div className="col-span-2 text-center pl-4">
                    Yes
                  </div>
                  <div className="col-span-1">
                    <span className="acc-pill acc-pill--success">Active</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
};
