import React, { useState, useEffect } from "react";
import { ClipboardList, CheckCircle, XCircle, FileText, IndianRupee, Clock } from "lucide-react";
import { toast } from "sonner";
import { StatsCard } from "@/components/StatsCard";

export const VendorDashboard = () => {
  const [stats, setStats] = useState({
    // tickets: {
    //   totalRaised: 0,
    //   open: 0,
    //   closed: 0,
    // },

     permits: {
        total: 0,
        approved: 0,
        rejected: 0
    },
    bills: {
      totalBills: 0,
      totalAmount: 0,
      pendingAmount: 0,
      paidAmount: 0,
    }
  });

  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");
    if (!token || !baseUrl) return;

    setLoading(true);
    try {
      const response = await fetch(`https://${baseUrl}/cs_home.json`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const data = await response.json();

      setStats({
        permits: {
          total: data.total_permits ?? data.permits?.total ?? 0,
          approved: data.approved_permits ?? data.permits?.approved ?? 0,
          rejected: data.rejected_permits ?? data.permits?.rejected ?? 0
        },
        bills: {
          totalBills: data.total_bills ?? data.bills?.total ?? 0,
          totalAmount: data.total_amount ?? data.bills?.total_amount ?? 0,
          pendingAmount: data.pending_amount ?? data.bills?.pending_amount ?? 0,
          paidAmount: data.paid_amount ?? data.bills?.paid_amount ?? 0,
        },
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {loading && (
        <p className="text-sm text-gray-400 animate-pulse">Loading dashboard data...</p>
      )}
      {/* Permits Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Permit</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          <StatsCard
            title="Total Permits"
            value={stats.permits.total}
            icon={<ClipboardList className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
          <StatsCard
            title="Approved Permits"
            value={stats.permits.approved}
            icon={<CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
          <StatsCard
            title="Rejected Permits"
            value={stats.permits.rejected}
            icon={<XCircle className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
        </div>
      </section>

      {/* Bills Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Bills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <StatsCard
            title="Total Bills"
            value={stats.bills.totalBills}
            icon={<FileText className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
          <StatsCard
            title="Total Amount"
            value={`₹ ${Number(stats.bills.totalAmount).toLocaleString()}`}
            icon={<IndianRupee className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
          <StatsCard
            title="Pending Amount"
            value={`₹ ${Number(stats.bills.pendingAmount).toLocaleString()}`}
            icon={<Clock className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
          <StatsCard
            title="Paid Amount"
            value={`₹ ${Number(stats.bills.paidAmount).toLocaleString()}`}
            icon={<CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
        </div>
      </section>
    </div>
  );
};
