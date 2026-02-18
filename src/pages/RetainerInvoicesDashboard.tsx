import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    const statusColors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-yellow-100 text-yellow-800",
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
          className="rounded border-gray-300"
        />
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ),
    date: <span className="text-sm text-gray-600">{item.date}</span>,
    retainer_invoice_number: (
      <span className="font-medium text-blue-600 cursor-pointer hover:underline">
        {item.retainer_invoice_number}
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
    status: getStatusBadge(item.status),
    amount: (
      <span className="text-sm font-medium text-gray-900">
        ₹
        {item.amount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
    balance: (
      <span className="text-sm font-medium text-gray-700">
        ₹
        {item.balance.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  });

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-80px)] flex flex-col overflow-y-auto bg-white">
      {/* Header Section */}
      <header className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">
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
              className="bg-red-600 text-white hover:bg-red-700 shadow-sm"
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
              className="border-gray-300 hover:bg-gray-100"
              title="Import"
            >
              <ArrowDown className="w-4 h-4 text-gray-600" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-red-500 hover:bg-red-50"
              title="Export"
            >
              <Download className="w-4 h-4 text-red-500" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 hover:bg-gray-100"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="focus:bg-red-50 focus:text-red-600 data-[state=open]:bg-red-50 data-[state=open]:text-red-600 flex items-center gap-2 py-2 mb-1 cursor-pointer">
                    <ArrowDownUp className="w-4 h-4" /> <span>Sort by</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent
                    className="w-56"
                    sideOffset={8}
                    alignOffset={-4}
                  >
                    <DropdownMenuItem className="focus:bg-red-50 focus:text-red-600 justify-between mb-1 cursor-pointer">
                      <span>Created Time</span>
                      <ArrowUp className="w-4 h-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-red-50 focus:text-red-600 cursor-pointer">
                      Last Modified Time
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-red-50 focus:text-red-600 cursor-pointer">
                      Date
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-red-50 focus:text-red-600 cursor-pointer">
                      Retainer Invoice Number
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-red-50 focus:text-red-600 cursor-pointer">
                      Customer Name
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-red-50 focus:text-red-600 cursor-pointer">
                      Amount
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-red-50 focus:text-red-600 cursor-pointer">
                      Balance
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-red-50 focus:text-red-600 cursor-pointer">
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
                  className="focus:bg-red-50 focus:text-red-600 cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" /> Preferences
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setIsPreferencesOpen(true);
                    setActivePreferenceTab("field_customization");
                  }}
                  className="focus:bg-red-50 focus:text-red-600 cursor-pointer"
                >
                  <Columns className="w-4 h-4 mr-2" /> Manage Custom Fields
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:bg-red-50 focus:text-red-600 cursor-pointer">
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh List
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-red-50 focus:text-red-600 cursor-pointer">
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
        <SheetContent className="w-[800px] sm:w-[800px] sm:max-w-[800px] p-0 flex flex-col">
          <Tabs
            value={activePreferenceTab}
            onValueChange={setActivePreferenceTab}
            className="w-full h-full flex flex-col"
          >
            <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between relative shrink-0">
              <div className="flex items-center gap-4">
                <TabsList className="bg-transparent p-0 h-auto gap-6">
                  <TabsTrigger
                    value="preferences"
                    className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-800 rounded-none px-0 py-2 text-base font-medium text-gray-500 data-[state=active]:text-gray-900"
                  >
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger
                    value="field_customization"
                    className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-800 rounded-none px-0 py-2 text-base font-medium text-gray-500 data-[state=active]:text-gray-900"
                  >
                    Field Customization
                  </TabsTrigger>
                </TabsList>
              </div>
              {/* All Preferences Link */}
              <div className="absolute right-12 top-6 text-sm text-red-700 hover:text-red-800 cursor-pointer font-medium">
                All Preferences
              </div>
            </SheetHeader>

            <TabsContent
              value="preferences"
              className="flex-1 flex flex-col h-full overflow-hidden data-[state=inactive]:hidden"
            >
              <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-base font-medium text-gray-800">
                      Terms & Conditions
                    </label>
                    <Textarea
                      className="min-h-[150px] resize-none border-gray-300 hover:border-red-700 focus:border-red-700 focus:ring-red-700"
                      placeholder=""
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-base font-medium text-gray-800">
                      Customer Notes
                    </label>
                    <Textarea
                      className="min-h-[150px] resize-none border-gray-300 hover:border-red-700 focus:border-red-700 focus:ring-red-700"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 border-t bg-white shrink-0 mt-auto">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8">
                  Save
                </Button>
              </div>
            </TabsContent>

            <TabsContent
              value="field_customization"
              className="flex-1 overflow-y-auto flex flex-col pt-4 px-6 data-[state=inactive]:hidden"
            >
              <div className="flex justify-end mb-4 shrink-0">
                <Button className="bg-red-600 hover:bg-red-700 text-white shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> New
                </Button>
              </div>

              <div className="bg-white">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 bg-gray-50/50 p-4 border-y border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <div className="col-span-4 pl-2">Field Name</div>
                  <div className="col-span-3">Data Type</div>
                  <div className="col-span-2 text-center">Mandatory</div>
                  <div className="col-span-2">Show in all PDFs</div>
                  <div className="col-span-1">Status</div>
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center text-sm text-gray-700 hover:bg-gray-50 transition-colors group">
                  <div className="col-span-4 flex items-center gap-3 pl-2">
                    <Lock className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    <span className="font-medium">Terms & Conditions</span>
                  </div>
                  <div className="col-span-3 text-gray-600">
                    Text Box (Multi-line)
                  </div>
                  <div className="col-span-2 text-center text-gray-600">No</div>
                  <div className="col-span-2 text-center pl-4 text-gray-600">
                    Yes
                  </div>
                  <div className="col-span-1 text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full w-fit text-xs">
                    Active
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
