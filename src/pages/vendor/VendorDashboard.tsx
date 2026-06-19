import React, { useState, useEffect } from "react";
import { Ticket, FileText, IndianRupee, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const VendorDashboard = () => {
  const [stats, setStats] = useState({
    tickets: {
      totalRaised: 0,
      open: 0,
      closed: 0,
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
        tickets: {
          totalRaised: data.total_tickets ?? data.total_raised_tickets ?? data.tickets?.total ?? 0,
          open: data.open_tickets ?? data.tickets?.open ?? 0,
          closed: data.closed_tickets ?? data.tickets?.closed ?? 0,
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
      {/* Tickets Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,44,40,0.06)] flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0 border border-[rgba(199,32,48,0.2)]">
              <Ticket className="w-7 h-7 text-[#D92818]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#D92818] leading-none mb-1">{stats.tickets.totalRaised}</p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Raised Tickets</p>
            </div>
          </div>
          
          <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,44,40,0.06)] flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0 border border-[rgba(199,32,48,0.2)]">
              <Ticket className="w-7 h-7 text-[#D92818]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#D92818] leading-none mb-1">{stats.tickets.open}</p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Open Ticket</p>
            </div>
          </div>

          <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,44,40,0.06)] flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0 border border-[rgba(199,32,48,0.2)]">
              <Ticket className="w-7 h-7 text-[#D92818]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#D92818] leading-none mb-1">{stats.tickets.closed}</p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Closed Tickets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bills Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Bills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,44,40,0.06)] flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0 border border-[rgba(199,32,48,0.2)]">
              <FileText className="w-7 h-7 text-[#D92818]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#D92818] leading-none mb-1">{stats.bills.totalBills}</p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Bills</p>
            </div>
          </div>
          
          <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,44,40,0.06)] flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0 border border-[rgba(199,32,48,0.2)]">
              <IndianRupee className="w-7 h-7 text-[#D92818]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#D92818] leading-none mb-1">₹ {stats.bills.totalAmount}</p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Amount</p>
            </div>
          </div>

          <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,44,40,0.06)] flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0 border border-[rgba(199,32,48,0.2)]">
              <Clock className="w-7 h-7 text-[#D92818]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#D92818] leading-none mb-1">₹ {stats.bills.pendingAmount}</p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pending Amount</p>
            </div>
          </div>

          <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,44,40,0.06)] flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0 border border-[rgba(199,32,48,0.2)]">
              <CheckCircle className="w-7 h-7 text-[#D92818]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#D92818] leading-none mb-1">₹ {stats.bills.paidAmount}</p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Paid Amount</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
