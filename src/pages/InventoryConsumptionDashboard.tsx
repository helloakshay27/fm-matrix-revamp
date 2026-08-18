import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Eye, X, ChevronDown, ChevronUp, RefreshCw, Download } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import bio from '@/assets/bio.png';

import { RootState, AppDispatch } from '@/store/store';
import { fetchInventoryConsumptionHistory } from '@/store/slices/inventoryConsumptionSlice';
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";



const InventoryConsumptionDashboard = () => {
  const navigate = useNavigate();
    const { shouldShow } = useDynamicPermissions();

  const dispatch = useDispatch<AppDispatch>();

  const { inventories, loading, error } = useSelector((state: RootState) => state.inventoryConsumption);

  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<Record<string, { loading: boolean; inventories: any[]; total_cost: number | null }>>({});
  // New state for monthly costs from API
  const [monthlyCosts, setMonthlyCosts] = useState<Record<string, number>>({});

  // Categories shown under each month come entirely from that month's
  // inventory_consumption_history_by_category.json response — no fixed
  // master list. A month whose response hasn't landed yet just has no entry.
  const [monthCategories, setMonthCategories] = useState<Record<string, { name: string; value: string; icon: string }[]>>({});
  const [monthCategoriesLoading, setMonthCategoriesLoading] = useState<Record<string, boolean>>({});

  // Best-effort icon by keyword — the API only returns category names, no icons.
  const getCategoryIcon = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('housekeeping') || n.includes('cleaning')) return '🧹';
    if (n.includes('pantry') || n.includes('kitchen') || n.includes('condiment')) return '☕';
    if (n.includes('tea') || n.includes('coffee') || n.includes('beverage') || n.includes('dairy')) return '🥤';
    if (n.includes('stationery') || n.includes('stationary') || n.includes('office')) return '📎';
    if (n.includes('technical') || n.includes('electrical') || n.includes('lighting')) return '⚙️';
    if (n.includes('plumbing') || n.includes('hardware')) return '🔧';
    if (n.includes('hygiene') || n.includes('personal care')) return '🧼';
    if (n.includes('fruit') || n.includes('vegetable')) return '🥦';
    if (n.includes('snack') || n.includes('food')) return '🍪';
    if (n.includes('recreation')) return '🎯';
    if (n.includes('disposable') || n.includes('crockery')) return '🍽️';
    return '📦';
  };

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

  // Fetch monthly costs on mount
  useEffect(() => {
    fetchMonthlyCosts();
  }, []);

  const getCurrencySymbol = () => {
    const currency = localStorage.getItem('currency');
    if (currency === 'INR') return '₹';
    return currency || '₹';
  };

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
    { key: 'action', label: 'Action', sortable: false, draggable: false, defaultVisible: true },
    { key: 'category', label: 'Category', sortable: true, draggable: false, defaultVisible: true },
    { key: 'name', label: 'Item Name', sortable: true, draggable: false, defaultVisible: true },
    { key: 'unit', label: 'Unit', sortable: true, draggable: false, defaultVisible: true },
    { key: 'quantity', label: 'Available Stock', sortable: true, draggable: false, defaultVisible: true },
    { key: 'consumption', label: 'Consumed Quantity', sortable: true, draggable: false, defaultVisible: true },
    { key: 'cost', label: 'Unit Cost (₹)', sortable: true, draggable: false, defaultVisible: true },
    { key: 'total_cost', label: 'Consumption Cost Total (₹)', sortable: true, draggable: false, defaultVisible: true },
  ];

  // Render cell content for expanded table
  const renderExpandedCell = (item: any, columnKey: string) => {
    const value = item[columnKey];
    if (columnKey === 'action') {
      return (
        <div className="flex gap-2 justify-center items-center">
          {shouldShow("Inventory Consumption","show")&& (
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100" onClick={() => handleViewItem(item)} title="View Details">
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>)}
          {item.green_product && (
            <img
              src={bio}
              alt="Eco-friendly"
              className="w-4 h-4"
              style={{
                filter: "invert(46%) sepia(66%) saturate(319%) hue-rotate(67deg) brightness(95%) contrast(85%)",
              }}
              title="Eco-friendly Product"
            />
          )}
        </div>
      );
    }
    if (columnKey === 'cost') {
      // "Unit Cost" — by_category consumption records give this directly as
      // `unit_cost` (confirmed: unit_cost * difference === cost, the
      // transaction total used below for "Consumption Cost Total").
      const costValue = item.unit_cost !== undefined && item.unit_cost !== null
        ? item.unit_cost
        : item.cost !== undefined && item.cost !== null
          ? item.cost
          : item.price !== undefined && item.price !== null
            ? item.price
            : null;

      if (costValue === null || costValue === undefined) {
        console.warn('Cost value missing for item:', item); // Debug logging
      }

      return <span className="font-semibold text-green-600">{costValue !== null && costValue !== undefined ? `${getCurrencySymbol()}${formatNumber(costValue)}` : '-'}</span>;
    }
    if (columnKey === 'name') {
      // by_category consumption records use `inventory_name`, not `name`.
      const nameValue = value ?? item.inventory_name;
      return <span className="font-medium text-gray-900">{nameValue ?? '-'}</span>;
    }
    if (columnKey === 'quantity' || columnKey === 'consumption') {
      // by_category consumption records track stock via `closing` (post-transaction
      // balance, used as "Available Stock") and `difference` (amount consumed in
      // this transaction, used as "Consumed Quantity") instead of quantity/consumption.
      const fallback = columnKey === 'quantity' ? item.closing : item.difference;
      const cellValue = value ?? fallback;
      return <span className="text-gray-700">{cellValue !== null && cellValue !== undefined ? formatNumber(cellValue) : '-'}</span>;
    }
    if (columnKey === 'category') {
      return <span className="text-gray-700">{value !== null && value !== undefined ? value : '-'}</span>;
    }
    if (columnKey === 'total_cost') {
      // by_category consumption records carry the transaction's total cost in `cost`.
      const totalCostValue = value ?? item.cost ?? null;
      return <span className="font-semibold text-red-600">{totalCostValue !== null && totalCostValue !== undefined ? `${getCurrencySymbol()}${formatNumber(totalCostValue)}` : '-'}</span>;
    }
    if (columnKey === 'criticality') {
      return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{value}</span>;
    }
    return <span className="text-gray-700">{value !== null && value !== undefined ? value : '-'}</span>;
  };

  // Format numbers in Indian grouping (1,000 -> 1,000 ; 100000 -> 1,00,000)
  const formatNumber = (n: any) => {
    if (n === null || n === undefined || n === '') return '-';
    const num = Number(String(n).replace(/[^0-9.-]/g, ''));
    if (Number.isNaN(num)) return String(n);
    try {
      return new Intl.NumberFormat('en-IN').format(num);
    } catch {
      return num.toLocaleString();
    }
  };

  // Toggle month expansion
  const toggleMonth = (month: string) => {
    if (isMonthDisabled(month)) return;
    if (expandedMonth === month) {
      setExpandedMonth(null);
      setExpandedCategory(null);
      return;
    }
    setExpandedMonth(month);
    setExpandedCategory(null);

    // One request returns every category's consumption for this month at
    // once, instead of firing a separate request per category.
    fetchMonthCategoryData(month);
  };

  // Fetches all categories' consumption data for a month in a single call.
  // Confirmed real shape: { total_cost, categories: [{ category, total_quantity,
  // total_cost, consumptions: [...] }] } — a few other plausible shapes are
  // still handled defensively in case this varies by environment/version.
  const fetchMonthCategoryData = async (month: string, isRefresh = false) => {
    setMonthCategoriesLoading((prev) => ({ ...prev, [month]: true }));

    try {
      const { start, end } = getMonthDateRange(month);
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      const url = `https://${baseUrl}/pms/inventories/inventory_consumption_history_by_category.json?q[created_at_gteq]=${start}&q[created_at_lteq]=${end}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;

      const grouped: Record<string, { items: any[]; totalCost: number | null }> = {};
      const addItem = (categoryName: unknown, item: any) => {
        if (typeof categoryName !== 'string' || !categoryName) return;
        if (!grouped[categoryName]) grouped[categoryName] = { items: [], totalCost: null };
        grouped[categoryName].items.push(item);
      };

      if (Array.isArray(data?.categories)) {
        data.categories.forEach((group: any) => {
          const categoryName = group.category || group.category_name || group.name;
          const items = group.consumptions || group.inventories || group.items || [];
          if (typeof categoryName === 'string' && categoryName) {
            grouped[categoryName] = {
              items: Array.isArray(items) ? items : [],
              totalCost: typeof group.total_cost === 'number' ? group.total_cost : null,
            };
          }
        });
      } else if (Array.isArray(data?.inventories)) {
        data.inventories.forEach((item: any) => addItem(item.category, item));
      } else if (Array.isArray(data)) {
        data.forEach((item: any) => addItem(item.category, item));
      } else if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) grouped[key] = { items: value, totalCost: null };
        });
      }

      // The categories shown for this month are exactly the ones the API
      // actually returned data for — nothing added from a fixed master list.
      const monthCats = Object.keys(grouped)
        .filter((name) => name.trim() !== '')
        .sort((a, b) => a.localeCompare(b))
        .map((name) => ({ name, value: name, icon: getCategoryIcon(name) }));
      setMonthCategories((prev) => ({ ...prev, [month]: monthCats }));

      setCategoryData((prev) => {
        const next = { ...prev };
        monthCats.forEach((cat) => {
          const key = `${month}-${cat.value}`;
          const group = grouped[cat.value] || { items: [], totalCost: null };
          // Items here are wastage/consumption entries with their own `cost`
          // field (not `total_cost`) — prefer the API's own group-level
          // total_cost when present, falling back to summing item costs.
          const totalCost =
            group.totalCost ??
            group.items.reduce((sum: number, item: any) => sum + (item.total_cost ?? item.cost ?? 0), 0);
          next[key] = { loading: false, inventories: group.items, total_cost: totalCost };
        });
        return next;
      });
    } catch (error) {
      console.error(`❌ Error fetching category-wise consumption data for ${month}:`, error);
      setMonthCategories((prev) => ({ ...prev, [month]: prev[month] || [] }));
    } finally {
      setMonthCategoriesLoading((prev) => ({ ...prev, [month]: false }));
    }
  };

  const fetchCategoryData = async (month: string, categoryValue: string, isRefresh = false) => {
    const key = `${month}-${categoryValue}`;
    if (!isRefresh && categoryData[key] && categoryData[key].inventories && categoryData[key].inventories.length > 0) {
      return;
    }
    
    setCategoryData((prev) => ({ ...prev, [key]: { loading: true, inventories: prev[key]?.inventories || [], total_cost: prev[key]?.total_cost ?? null } }));
    try {
      const { start, end } = getMonthDateRange(month);
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      const url = `https://${baseUrl}/pms/inventories/inventory_consumption_history.json?q[created_at_gteq]=${start}&q[created_at_lteq]=${end}&s[category_eq]=${categoryValue}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedInventories = response.data.inventories || [];
      const computedTotalCost = fetchedInventories.reduce((sum: number, item: any) => sum + (item.total_cost || 0), 0);

      setCategoryData((prev) => ({
        ...prev,
        [key]: {
          loading: false,
          inventories: fetchedInventories,
          total_cost: computedTotalCost,
        },
      }));
      
      try {
        const firstItem = response.data.inventories && response.data.inventories.length > 0 ? response.data.inventories[0] : null;
        if (firstItem && ('cost' in firstItem)) {
          const storageKeyName = `consumption-table-${key}`;
          localStorage.removeItem(`${storageKeyName}-columns`);
          localStorage.removeItem(`${storageKeyName}-column-order`);
        }
      } catch (err) {
        console.warn('Failed to reset column visibility for category after fetch:', err);
      }
    } catch (error) {
      console.error(`❌ Error fetching data for ${key}:`, error);
      setCategoryData((prev) => ({ ...prev, [key]: { loading: false, inventories: [], total_cost: 0 } }));
    }
  };

  // Toggle category expansion and fetch data if needed
  const toggleCategory = async (month: string, categoryValue: string) => {
    if (expandedCategory === categoryValue) {
      setExpandedCategory(null);
      return;
    }
    setExpandedCategory(categoryValue);
    
    const key = `${month}-${categoryValue}`;
    // Fetch if not already loaded (though it should be loading in background now)
    if (!categoryData[key] || categoryData[key].total_cost === null) {
      fetchCategoryData(month, categoryValue);
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

  // Function to force refresh data for a category
  const refreshCategoryData = async (month: string, categoryValue: string) => {
    fetchCategoryData(month, categoryValue, true);
  };

  const refreshMonthData = (month: string) => {
    fetchMonthCategoryData(month, true);
    fetchMonthlyCosts();
  };

  const downloadMonthData = (month: string) => {
    const allItems: any[] = [];
    (monthCategories[month] || []).forEach(cat => {
      const key = `${month}-${cat.value}`;
      const data = categoryData[key];
      if (data && data.inventories) {
        const itemsWithCategory = data.inventories.map((item: any) => ({
          ...item,
          category: item.category || cat.name
        }));
        allItems.push(...itemsWithCategory);
      }
    });

    if (allItems.length === 0) {
      alert("No data available to download. Please wait for data to load or expand the month to load data.");
      return;
    }

    const headers = ['Category', 'Item Name', 'Unit', 'Available Stock', 'Consumed Quantity', 'Unit Cost', 'Consumption Cost Total'];
    const csvRows = [headers.join(',')];

    allItems.forEach(item => {
      const costValue = item.cost !== undefined && item.cost !== null
        ? item.cost
        : item.unit_cost !== undefined && item.unit_cost !== null
          ? item.unit_cost
          : item.price !== undefined && item.price !== null
            ? item.price
            : 0;

      const row = [
        `"${item.category || ''}"`,
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${item.unit || ''}"`,
        item.quantity || 0,
        item.consumption || 0,
        costValue || 0,
        item.total_cost || 0
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Consumption_Data_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Navigate to view page
  // The :id route param is used directly as `resource_id` by the view page
  // (InventoryConsumptionViewPage -> fetchInventoryConsumptionDetails), so it
  // must be the inventory's resource_id, not the consumption transaction's
  // own `id` (e.g. resource_id: 96197 vs the consumption record's id: 162878).
  const handleViewItem = (item: any) => {
    // Find the expanded month and its date range
    const monthObj = monthlyData.find(m => m.month === expandedMonth);
    let start = '', end = '';
    if (monthObj) {
      const { start: s, end: e } = getMonthDateRange(monthObj.month);
      start = s;
      end = e;
    }
    const resourceId = item.resource_id ?? item.id;
    // Use the correct API path for the detail page navigation
    // Only one '?' in the URL, use '&' for additional params
    navigate(`/maintenance/inventory-consumption/view/${resourceId}?start_date=${start}&end_date=${end}`);
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
                  {`${getCurrencySymbol()}${formatNumber(monthlyCosts[m.month] ?? 0)}`}
                </span>
                {expandedMonth === m.month && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadMonthData(m.month);
                      }}
                      title="Download month data"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        refreshMonthData(m.month);
                      }}
                      title="Refresh data"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-600" />
                    </Button>
                  </>
                )}
                {expandedMonth === m.month ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Expanded Month - Show Categories (from that month's API response only) */}
            {expandedMonth === m.month && (
              <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
                {monthCategoriesLoading[m.month] && (monthCategories[m.month]?.length ?? 0) === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Loading categories...</p>
                ) : (monthCategories[m.month]?.length ?? 0) === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No category data for this month.</p>
                ) : null}
                {(monthCategories[m.month] || []).map((cat) => {
                  const catKey = `${m.month}-${cat.value}`;
                  const isCatExpanded = expandedCategory === cat.value;
                  const data = categoryData[catKey];
                  
                  return (
                    <div 
                      key={cat.value}
                      id={`category-${m.month}-${cat.value}`}
                      className="border rounded-lg bg-white shadow-sm overflow-hidden"
                    >
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleCategory(m.month, cat.value)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                            {cat.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{cat.name}</h3>
                            <p className="text-xs text-gray-500">
                              {data && !data.loading && data.inventories 
                                ? `${data.inventories.length} items` 
                                : 'Loading items...'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-red-600">
                            {data && !data.loading && data.total_cost !== null 
                              ? `${getCurrencySymbol()}${formatNumber(data.total_cost)}` 
                              : `${getCurrencySymbol()}0`}
                          </span>
                          
                          {isCatExpanded && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                refreshCategoryData(m.month, cat.value);
                              }}
                              title="Refresh data"
                            >
                              <RefreshCw className="w-4 h-4 text-gray-600" />
                            </Button>
                          )}
                          {isCatExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {/* Expanded Category Table */}
                      {isCatExpanded && (
                        <div className="border-t border-gray-100 p-4">
                          {data?.loading ? (
                            <div className="flex justify-center items-center h-24 text-gray-500">Loading...</div>
                          ) : (
                            <EnhancedTable
                              data={data?.inventories || []}
                              columns={expandedColumns}
                              renderCell={renderExpandedCell}
                              storageKey={`consumption-table-${catKey}`}
                              emptyMessage="No consumption data available"
                              enableExport={true}
                              hideTableExport={false}
                              hideTableSearch={false}
                              hideColumnsButton={false}
                              loading={false}
                              pagination={true}
                              selectable={false}
                              getItemId={(item) => item.id}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryConsumptionDashboard;