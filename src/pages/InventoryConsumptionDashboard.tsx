import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Eye, X, ChevronDown, ChevronUp } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

import { RootState, AppDispatch } from '@/store/store';
import { fetchInventoryConsumptionHistory } from '@/store/slices/inventoryConsumptionSlice';



const InventoryConsumptionDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { inventories, loading, error } = useSelector((state: RootState) => state.inventoryConsumption);

  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [monthData, setMonthData] = useState<Record<string, { loading: boolean; inventories: any[]; total_cost: number | null }>>({});
  // New state for monthly costs from API
  const [monthlyCosts, setMonthlyCosts] = useState<Record<string, number>>({});

  // Fetch monthly costs on mount
  useEffect(() => {
    const fetchMonthlyCosts = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        const year = new Date().getFullYear();
        const url = `https://${baseUrl}/pms/inventories/consumption_cost_by_month.json?year=${year}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'];
        const abbrevToFull: Record<string, string> = {
          Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
          Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December'
        };
        const costs: Record<string, number> = {};
        const list = response.data?.monthly_costs || response.data || [];
        if (Array.isArray(list)) {
          list.forEach((item: any) => {
            let fullName = '';
            if (typeof item.month === 'number') {
              fullName = fullMonths[item.month - 1];
            } else if (typeof item.month === 'string') {
              const key = item.month.slice(0, 3); // ensure first 3 letters
              fullName = abbrevToFull[key] || item.month;
            }
            if (fullName) costs[fullName] = item.total_cost ?? 0;
          });
        }
        setMonthlyCosts(costs);
      } catch (err) {
        console.error('Error fetching monthly costs:', err);
      }
    };
    fetchMonthlyCosts();
  }, []);

  useEffect(() => {
    dispatch(fetchInventoryConsumptionHistory());
  }, [dispatch]);

  // Scroll to current month on page load
  useEffect(() => {
    const currentMonth = getCurrentMonth();
    const timer = setTimeout(() => {
      const currentMonthElement = document.getElementById(`month-${currentMonth}`);
      if (currentMonthElement) {
        currentMonthElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, []);

  // Helper function to add ordinal suffix to numbers
  const getOrdinalSuffix = (num: number) => {
    if (num <= 0) return '0';
    const remainder = num % 100;
    if (remainder >= 11 && remainder <= 13) {
      return `${num}th`;
    }
    switch (num % 10) {
      case 1: return `${num}st`;
      case 2: return `${num}nd`;
      case 3: return `${num}rd`;
      default: return `${num}th`;
    }
  };

  // Get dynamic date range based on current date
  const getCurrentDateRange = (monthName: string) => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentDay = now.getDate();
    const currentYear = now.getFullYear();

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const monthIndex = months.indexOf(monthName);

    // If it's the current month, show 1st to current day
    if (monthIndex === currentMonth) {
      return `1st to ${getOrdinalSuffix(currentDay)}`;
    }

    // If it's a past month in the current year, show full month
    if (monthIndex < currentMonth) {
      const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
      return `1st to ${getOrdinalSuffix(daysInMonth)}`;
    }

    // If it's a future month, show as not yet reached
    return '1st to 0';
  };

  // Check if a month is disabled (future months)
  const isMonthDisabled = (monthName: string) => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = months.indexOf(monthName);
    return monthIndex > currentMonth;
  };

  // Monthly consumption data with dynamic date ranges (reverse order: December to January)
  const allMonths = [
    'December', 'November', 'October', 'September', 'August', 'July',
    'June', 'May', 'April', 'March', 'February', 'January'
  ];
  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 0 = January, 11 = December
  // Only show months up to and including the current month
  const monthlyData = allMonths
    .slice(12 - (currentMonthIndex + 1))
    .map(month => ({ month, dateRange: getCurrentDateRange(month) }));

  // Helper to get start and end date for a month in YYYY-MM-DD (always use current year)
  const getMonthDateRange = (month: string) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date(); // Current date: 2025-08-13 03:59 PM IST
    const currentYear = now.getFullYear(); // Should be 2025
    const monthIndex = months.indexOf(month);

    // Validate inputs
    if (monthIndex === -1) {
      console.error(`Invalid month: ${month}`);
      return { start: '', end: '' };
    }

    // Calculate start and end dates
    const start = new Date(currentYear, monthIndex, 1, 5, 30, 0); // 1st of month
    let end;
    const nowDay = now.getDate();
    const nowMonth = now.getMonth();
    if (monthIndex === nowMonth) {
      // Current month: end date is today
      end = new Date(currentYear, monthIndex, nowDay, 5, 30, 0);
    } else {
      // Past month: end date is last day of month
      end = new Date(currentYear, monthIndex, new Date(currentYear, monthIndex + 1, 0).getDate(), 5, 30, 0);
    }
    const format = (d: Date) => d.toISOString().slice(0, 10);
    const startDate = format(start);
    const endDate = format(end);
    return { start: startDate, end: endDate };
  };

  // Define table columns for expanded view (API response)
  const expandedColumns: ColumnConfig[] = [
    { key: 'action', label: 'Action', sortable: false, draggable: false },
    { key: 'name', label: 'Name', sortable: true, draggable: false },
    { key: 'quantity', label: 'Content Quantity', sortable: true, draggable: false },
    { key: 'consumption', label: 'Consumed', sortable: true, draggable: false, defaultVisible: true },
    { key: 'total_cost', label: 'Amount', sortable: true, draggable: false },
  ];

  // Render cell content for expanded table
  const renderExpandedCell = (item: any, columnKey: string) => {
    const value = item[columnKey];
    if (columnKey === 'action') {
      return (
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100" onClick={() => handleViewItem(item)} title="View Details">
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      );
    }
    if (columnKey === 'cost') {
      return <span className="font-semibold text-green-600">{value !== null ? `₹${value}` : '-'}</span>;
    }
    if (columnKey === 'name') {
      return <span className="font-medium text-gray-900">{value}</span>;
    }
    if (columnKey === 'criticality') {
      return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{value}</span>;
    }
    return <span className="text-gray-700">{value !== null && value !== undefined ? value : '-'}</span>;
  };

  // Toggle month expansion and fetch data if needed
  const toggleMonth = async (month: string) => {
    if (isMonthDisabled(month)) return;
    if (expandedMonth === month) {
      setExpandedMonth(null);
      return;
    }
    setExpandedMonth(month);
    // If already loaded, don't fetch again
    if (monthData[month] && monthData[month].inventories) return;
    // Fetch data for this month
    setMonthData((prev) => ({ ...prev, [month]: { loading: true, inventories: [], total_cost: null } }));
    try {
      const { start, end } = getMonthDateRange(month);
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      const url = `https://${baseUrl}/pms/inventories/inventory_consumption_history.json?q[created_at_gteq]=${start}&q[created_at_lteq]=${end}`;
      console.log(`API Request URL: ${url}`); // Log the exact URL
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`API Response for ${month}:`, response.data); // Log the response data
      setMonthData((prev) => ({
        ...prev,
        [month]: {
          loading: false,
          inventories: response.data.inventories || [],
          total_cost: response.data.total_cost || null,
        },
      }));
    } catch (error) {
      console.error(`Error fetching data for ${month}:`, error);
      setMonthData((prev) => ({ ...prev, [month]: { loading: false, inventories: [], total_cost: null } }));
    }
  };

  // Get current month
  const getCurrentMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    return months[now.getMonth()];
  };

  const currentMonth = getCurrentMonth();

  // Navigate to view page
  // Pass id, start_date, end_date to the view page
  const handleViewItem = (item: any) => {
    // Find the expanded month and its date range
    const monthObj = monthlyData.find(m => m.month === expandedMonth);
    let start = '', end = '';
    if (monthObj) {
      const { start: s, end: e } = getMonthDateRange(monthObj.month);
      start = s;
      end = e;
    }
    // Use the correct API path for the detail page navigation
    // Only one '?' in the URL, use '&' for additional params
    navigate(`/maintenance/inventory-consumption/view/${item.id}?start_date=${start}&end_date=${end}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* <h1 className="text-2xl font-bold text-gray-900">Consumption List</h1> */}
      </div>

      {/* Monthly Consumption Boxes */}
      <div className="space-y-4">
        {monthlyData.map((m) => (
          <div
            key={m.month}
            id={`month-${m.month}`}
            className={`border rounded-lg bg-white shadow-sm ${m.month === currentMonth
              ? 'border-[#C72030] border-2 shadow-md'
              : 'border-gray-200'
              }`}
          >
            {/* Month Header Box */}
            <div
              className={`flex items-center justify-between p-6 transition-colors ${isMonthDisabled(m.month)
                ? 'opacity-50 cursor-not-allowed bg-gray-100'
                : 'cursor-pointer hover:bg-gray-50'
                }`}
              onClick={() => toggleMonth(m.month)}
              title={isMonthDisabled(m.month) ? 'Data not available for future months' : ''}
            >
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{m.month}</h2>
                  <p className="text-sm text-gray-600">{m.dateRange}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-red-600">
                  {`${localStorage.getItem('currency')}${monthlyCosts[m.month] ?? 0}`}
                </span>
                {expandedMonth === m.month ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Expanded Table */}
            {expandedMonth === m.month && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-4">
                  {monthData[m.month]?.loading ? (
                    <div className="flex justify-center items-center h-24 text-gray-500">Loading...</div>
                  ) : (
                    <EnhancedTable
                      data={monthData[m.month]?.inventories || []}
                      columns={expandedColumns}
                      renderCell={renderExpandedCell}
                      storageKey={`consumption-table-${m.month}`}
                      emptyMessage="No consumption data available"
                      enableExport={false}
                      hideTableExport={true}
                      hideTableSearch={true}
                      hideColumnsButton={true}
                      loading={false}
                      pagination={false}
                      selectable={false}
                      getItemId={(item) => item.id}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryConsumptionDashboard;