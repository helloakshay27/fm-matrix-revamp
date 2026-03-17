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
} from "lucide-react";

interface RecurringExpense {
  id: string | number;
  profile_name: string;
  expense_account?: string;
  vendor_name?: string;
  frequency?: string;
  last_expense_date?: string;
  next_expense_date?: string;
  status?: string;
  amount?: string | number;
  reference_number?: string;
  paid_through?: string;
  voucher_number?: string;
  transaction_type?: string;
  description?: string;
  date?: string;
}

const getStatusColor = (status?: string) => {
  const s = status?.toUpperCase() || "";
  if (s === "ACTIVE") return "bg-green-100 text-green-800 border-green-200";
  if (s === "INACTIVE") return "bg-red-100 text-red-800 border-red-200";
  if (s === "EXPIRED") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
};

const RecurringExpenseDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<RecurringExpense | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("expense-details");

  useEffect(() => {
    document.title = "Recurring Expense Details";
    setLoading(true);
    const stored = JSON.parse(
      localStorage.getItem("recurringExpenses") || "[]"
    );
    const found = stored.find((s: any) => String(s.id) === String(id));
    if (found) {
      setItem(found);
    } else {
      setItem({
        id: id || "0",
        profile_name: "Office Supplies",
        date: "20/02/2026",
        expense_account: "Office & Administration",
        vendor_name: "ABC Suppliers",
        frequency: "Weekly",
        last_expense_date: "17/02/2026",
        next_expense_date: "24/02/2026",
        status: "ACTIVE",
        amount: "₹222.00",
        reference_number: "123444",
        paid_through: "Cash Account",
        voucher_number: "",
        transaction_type: "EXPENSE",
        description: "Regular office supplies purchase",
      });
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading recurring expense...
          </p>
        </div>
      </div>
    );
  }

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

  const expenseNumber =
    item.voucher_number || item.reference_number || String(item.id);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
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
                Expense #{expenseNumber}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Created on {item.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(item.status)} border`}>
              {item.status?.toUpperCase() || "EXPENSE"}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
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
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
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
                { label: "Vendor Info", value: "vendor-info" },
                { label: "History", value: "history" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030]"
                  style={{
                    width: "230px",
                    height: "36px",
                    paddingTop: "10px",
                    paddingRight: "20px",
                    paddingBottom: "10px",
                    paddingLeft: "20px",
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

            {/* Expense Details Tab */}
            <TabsContent
              value="expense-details"
              className="p-3 sm:p-6 space-y-6"
              style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
            >
              {/* Expense Information */}
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
                      <p className="text-sm font-medium text-muted-foreground">
                        Date
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.date || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Expense Account
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.expense_account || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Reference Number
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.reference_number || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Amount
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.amount || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Paid Through
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.paid_through || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Vendor
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.vendor_name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Voucher Number
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.voucher_number || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Transaction Type
                      </p>
                      <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200 border">
                        {item.transaction_type || "EXPENSE"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Frequency
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.frequency || "-"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {item.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vendor Info Tab */}
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
                      <p className="text-sm font-medium text-muted-foreground">
                        Vendor Name
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.vendor_name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Expense Account
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.expense_account || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Paid Through
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.paid_through || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Reference Number
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.reference_number || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Voucher Number
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.voucher_number || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Transaction Type
                      </p>
                      <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200 border">
                        {item.transaction_type || "EXPENSE"}
                      </Badge>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Amount
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.amount || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Paid Through
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.paid_through || "-"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent
              value="history"
              className="p-3 sm:p-6 space-y-6"
              style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Schedule History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 pb-4 border-b items-center justify-between">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">Last Expense Date</p>
                          <p className="text-sm text-muted-foreground">
                            {item.last_expense_date || "-"}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200 border">
                        COMPLETED
                      </Badge>
                    </div>
                    <div className="flex gap-4 pb-4 border-b items-center justify-between">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">Next Expense Date</p>
                          <p className="text-sm text-muted-foreground">
                            {item.next_expense_date || "-"}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border">
                        UPCOMING
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <p className="text-sm font-medium text-muted-foreground">
                        Frequency
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.frequency || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <Badge
                        className={`mt-1 ${getStatusColor(item.status)} border`}
                      >
                        {item.status || "-"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Profile Name
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.profile_name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Amount
                      </p>
                      <p className="text-base font-semibold mt-1">
                        {item.amount || "-"}
                      </p>
                    </div>
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
