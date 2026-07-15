import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  FileText,
  Receipt,
  Clock,
  Calendar,
  User,
  CreditCard,
  AlertCircle,
  Edit,
  MoreVertical,
} from "lucide-react";
import {
  Menu,
  MenuItem,
} from "@mui/material";
import { toast } from "sonner";

// ─── API Config ────────────────────────────────────────────────────────────────
// The component automatically fetches baseUrl and token from localStorage
// If you need to override them, pass as props:
// Example: <RecurringExpenseDetailPage baseUrl="https://api.example.com" token="your_token" />
// Otherwise, ensure localStorage has 'baseUrl' and 'token' set
interface ApiConfig {
  baseUrl?: string; // e.g. "https://api.yourapp.com" (optional, defaults to localStorage)
  token?: string;   // e.g. "your_jwt_token" (optional, defaults to localStorage)
}

// ─── API Response Shape ────────────────────────────────────────────────────────
interface RecurringExpenseAPI {
  id: number;
  profile_name: string;
  repeat_every: string;           // "day" | "week" | "month" | "year"
  interval: number;
  start_date: string;             // "YYYY-MM-DD"
  end_date: string | null;        // "YYYY-MM-DD" or null
  account_id: number;
  paid_through_account_id: number;
  vendor_id: number;
  amount: number;
  description: string;
  organization_id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  never_expires: boolean;
  expense_type: string;           // "goods" | "services"
  hsn_code: string;
  currency: string;               // "INR" | "USD" etc.
  gst_treatment: string;
  vendor_gstin: string;
  source_of_supply: string;
  destination_of_supply: string;
  reverse_charge: boolean;
  tax_id: number;
  tax_amount_type: string;        // "tax_exclusive" | "tax_inclusive"
  notes: string;
  lock_account_customer_id: number;
  reporting_tags: string;
  vendor_name: string | null;
}

// ─── Props ─────────────────────────────────────────────────────────────────────
interface Props extends ApiConfig { }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStatusColor = (active?: boolean) => {
  if (active === true) return "bg-green-100 text-green-800 border-green-200";
  if (active === false) return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
};

const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount?: number, currency = "INR"): string => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatFrequency = (repeatEvery: string, interval: number): string => {
  const unit =
    interval === 1
      ? repeatEvery
      : `${interval} ${repeatEvery}s`;
  return `Every ${unit}`;
};

const resolveApiConfig = (propBaseUrl?: string, propToken?: string) => {
  const baseUrl = propBaseUrl || localStorage.getItem('baseUrl');
  const token = propToken || localStorage.getItem('token');

  if (!baseUrl || !token) {
    throw new Error("Missing API configuration. Please ensure baseUrl and token are provided.");
  }

  const apiUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
  return { apiUrl, token };
};

// ─── Component ────────────────────────────────────────────────────────────────
const RecurringExpenseDetailPage: React.FC<Props> = ({ baseUrl: propBaseUrl, token: propToken }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<RecurringExpenseAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("expense-details");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // ── Fetch from API ──────────────────────────────────────────────────────────
  useEffect(() => {
    document.title = "Recurring Expense Details";

    if (!id) {
      setError("No expense ID provided.");
      setLoading(false);
      return;
    }

    const fetchExpense = async () => {
      setLoading(true);
      setError(null);
      try {
        const { apiUrl, token } = resolveApiConfig(propBaseUrl, propToken);

        const response = await fetch(
          `${apiUrl}/recurring_expenses/${id}.json`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(
            `HTTP ${response.status}: ${errBody || response.statusText}`
          );
        }

        const data: RecurringExpenseAPI = await response.json();
        setItem(data);
      } catch (err: any) {
        console.error("Failed to fetch recurring expense:", err);
        setError(err.message || "Failed to load recurring expense.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id, propBaseUrl, propToken]);

  // ── Menu handlers ───────────────────────────────────────────────────────────
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const updateRecurringExpenseStatus = async (active: boolean) => {
    if (!id) return;
    setIsUpdating(true);
    try {
      const { apiUrl, token } = resolveApiConfig(propBaseUrl, propToken);

      // Determine the endpoint based on the action
      const endpoint = active
        ? `${apiUrl}/recurring_expenses/${id}/resume.json`
        : `${apiUrl}/recurring_expenses/${id}/toggle_active.json`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errBody || response.statusText}`
        );
      }

      const updatedData: RecurringExpenseAPI = await response.json();
      setItem(updatedData);
      handleMenuClose();
      const statusMsg = active ? "Recurring expense resumed" : "Recurring expense stopped";
      toast.success(statusMsg);
    } catch (err: any) {
      console.error("Failed to update recurring expense:", err);
      toast.error(err.message || "Failed to update recurring expense status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStop = () => {
    updateRecurringExpenseStatus(false);
  };

  const handleResume = () => {
    updateRecurringExpenseStatus(true);
  };

  const handleCreateExpense = () => {
    handleMenuClose();
    navigate(`/accounting/expense/create`);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this recurring expense?")) {
      return;
    }

    handleMenuClose();
    setIsUpdating(true);
    try {
      const { apiUrl, token } = resolveApiConfig(propBaseUrl, propToken);

      const response = await fetch(
        `${apiUrl}/recurring_expenses/${id}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errBody || response.statusText}`
        );
      }

      toast.success("Recurring expense deleted successfully");
      navigate("/accounting/recurring-expenses");
    } catch (err: any) {
      console.error("Failed to delete recurring expense:", err);
      toast.error(err.message || "Failed to delete recurring expense");
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">
            Loading recurring expense...
          </p>
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/accounting/recurring-expenses")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── No Data ─────────────────────────────────────────────────────────────────
  if (!item) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/accounting/recurring-expenses")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No recurring expense data available.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Derived Values ──────────────────────────────────────────────────────────
  const statusLabel = item.active ? "ACTIVE" : "INACTIVE";
  const frequency = formatFrequency(item.repeat_every, item.interval);
  const formattedAmt = formatCurrency(item.amount, item.currency);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/accounting/recurring-expenses")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Receipt className="h-6 w-6 text-primary" />
                {item.profile_name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Created on {formatDate(item.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate(`/accounting/expense/edit/${id}`)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleMenuOpen}
              disabled={isUpdating}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
            >
              {item?.active ? (
                <>
                  <MenuItem onClick={handleStop} disabled={isUpdating}>
                    Stop
                  </MenuItem>
                  <MenuItem onClick={handleCreateExpense}>
                    Create Expense
                  </MenuItem>
                  <MenuItem onClick={handleDelete} disabled={isUpdating}>
                    Delete
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleResume} disabled={isUpdating}>
                    Resume
                  </MenuItem>
                  <MenuItem onClick={handleDelete} disabled={isUpdating}>
                    Delete
                  </MenuItem>
                </>
              )}
            </Menu>
            <Badge className={`${getStatusColor(item?.active)} border`}>
              {statusLabel}
            </Badge>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div
          className="rounded-lg border-r border-b border-gray-200 shadow-sm"
          style={{
            borderTop: "none",
            borderLeft: "none",
            backgroundColor: "rgba(250, 250, 250, 1)",
          }}
        >
          <style>{`
            .recurring-expense-tabs button[data-state="active"] {
              background-color: rgba(237, 234, 227, 1) !important;
              color: rgba(199, 32, 48, 1) !important;
            }
          `}</style>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList
              className="recurring-expense-tabs w-full flex flex-nowrap rounded-t-lg p-0 overflow-x-auto mb-4"
              style={{
                gap: "0",
                padding: "0",
                backgroundColor: "rgba(246, 247, 247, 1)",
                height: "50px",
                marginBottom: "16px",
                justifyContent: "flex-start",
              }}
            >
              {[
                { label: "Expense Details", value: "expense-details" },
                { label: "Vendor & GST Info", value: "vendor-info" },
                { label: "Schedule & History", value: "history" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030]"
                  style={{
                    width: "230px",
                    height: "36px",
                    padding: "10px 20px",
                    borderRadius: "0",
                    border: "none",
                    margin: "0",
                    fontFamily: "Work Sans",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "rgba(26, 26, 26, 1)",
                    backgroundColor: "rgba(246, 247, 247, 1)",
                  }}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ════════════════════════════════════════════════════════
                Tab 1 – Expense Details
            ════════════════════════════════════════════════════════ */}
            <TabsContent
              value="expense-details"
              className="p-3 sm:p-6 space-y-6"
              style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
            >
              {/* Core Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-primary" />
                    Expense Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Profile Name</p>
                      <p className="text-base font-semibold mt-1">{item.profile_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Amount</p>
                      <p className="text-base font-semibold mt-1">{formattedAmt}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Currency</p>
                      <p className="text-base font-semibold mt-1">{item.currency || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Expense Type</p>
                      <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200 border capitalize">
                        {item.expense_type || "-"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">HSN / SAC Code</p>
                      <p className="text-base font-semibold mt-1">{item.hsn_code || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tax Amount Type</p>
                      <p className="text-base font-semibold mt-1 capitalize">
                        {item.tax_amount_type?.replace(/_/g, " ") || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account ID</p>
                      <p className="text-base font-semibold mt-1">{item.account_id ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Paid Through Account ID</p>
                      <p className="text-base font-semibold mt-1">{item.paid_through_account_id ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Reverse Charge</p>
                      <p className="text-base font-semibold mt-1">
                        {item.reverse_charge ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Reporting Tags</p>
                      <p className="text-base font-semibold mt-1">{item.reporting_tags || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge className={`mt-1 ${getStatusColor(item.active)} border`}>
                        {statusLabel}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Organization ID</p>
                      <p className="text-base font-semibold mt-1">{item.organization_id ?? "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description / Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Description &amp; Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {item.description || "No description provided."}
                    </p>
                  </div>
                  {item.notes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {item.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ════════════════════════════════════════════════════════
                Tab 2 – Vendor & GST Info
            ════════════════════════════════════════════════════════ */}
            <TabsContent
              value="vendor-info"
              className="p-3 sm:p-6 space-y-6"
              style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Vendor Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vendor Name</p>
                      <p className="text-base font-semibold mt-1">{item.vendor_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vendor ID</p>
                      <p className="text-base font-semibold mt-1">{item.vendor_id ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vendor GSTIN</p>
                      <p className="text-base font-semibold mt-1 font-mono tracking-wide">
                        {item.vendor_gstin || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">GST Treatment</p>
                      <p className="text-base font-semibold mt-1 capitalize">
                        {item.gst_treatment?.replace(/_/g, " ") || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Source of Supply</p>
                      <p className="text-base font-semibold mt-1">{item.source_of_supply || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Destination of Supply</p>
                      <p className="text-base font-semibold mt-1">{item.destination_of_supply || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Reverse Charge</p>
                      <p className="text-base font-semibold mt-1">
                        {item.reverse_charge ? "Applicable" : "Not Applicable"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tax ID</p>
                      <p className="text-base font-semibold mt-1">{item.tax_id ?? "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Amount</p>
                      <p className="text-base font-semibold mt-1">{formattedAmt}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Currency</p>
                      <p className="text-base font-semibold mt-1">{item.currency || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tax Amount Type</p>
                      <p className="text-base font-semibold mt-1 capitalize">
                        {item.tax_amount_type?.replace(/_/g, " ") || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Paid Through Account ID</p>
                      <p className="text-base font-semibold mt-1">{item.paid_through_account_id ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Lock Account Customer ID</p>
                      <p className="text-base font-semibold mt-1">{item.lock_account_customer_id ?? "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ════════════════════════════════════════════════════════
                Tab 3 – Schedule & History
            ════════════════════════════════════════════════════════ */}
            <TabsContent
              value="history"
              className="p-3 sm:p-6 space-y-6"
              style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Recurrence Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                      <p className="text-base font-semibold mt-1">{frequency}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Repeat Every</p>
                      <p className="text-base font-semibold mt-1 capitalize">
                        {item.interval} {item.repeat_every}
                        {item.interval > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                      <p className="text-base font-semibold mt-1">{formatDate(item.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">End Date</p>
                      <p className="text-base font-semibold mt-1">
                        {item.never_expires ? "Never Expires" : formatDate(item.end_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Never Expires</p>
                      <p className="text-base font-semibold mt-1">
                        {item.never_expires ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge className={`mt-1 ${getStatusColor(item.active)} border`}>
                        {statusLabel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Audit Trail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 pb-4 border-b items-center justify-between">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        </div>
                        <div>
                          <p className="font-medium">Created</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(item.created_at)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">
                        CREATED
                      </Badge>
                    </div>

                    <div className="flex gap-4 pb-4 border-b items-center justify-between">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                        </div>
                        <div>
                          <p className="font-medium">Last Updated</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(item.updated_at)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 border">
                        UPDATED
                      </Badge>
                    </div>

                    <div className="flex gap-4 pb-4 border-b items-center justify-between">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        </div>
                        <div>
                          <p className="font-medium">Start Date</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(item.start_date)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200 border">
                        START
                      </Badge>
                    </div>

                    {!item.never_expires && item.end_date && (
                      <div className="flex gap-4 items-center justify-between">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                          </div>
                          <div>
                            <p className="font-medium">End Date</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(item.end_date)}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200 border">
                          END
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RecurringExpenseDetailPage;