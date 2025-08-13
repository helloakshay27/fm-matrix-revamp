import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Eye, X, ChevronDown, ChevronUp } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

import { RootState, AppDispatch } from '@/store/store';
import { fetchInventoryConsumptionHistory } from '@/store/slices/inventoryConsumptionSlice';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const InventoryConsumptionDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { inventories, loading, error } = useSelector((state: RootState) => state.inventoryConsumption);

  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

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

  // Monthly consumption data with dynamic date ranges
  const monthlyData = [
    { month: 'January', dateRange: getCurrentDateRange('January'), amount: '₹24,000', details: generateMonthlyDetails('January') },
    { month: 'February', dateRange: getCurrentDateRange('February'), amount: '₹25,000', details: generateMonthlyDetails('February') },
    { month: 'March', dateRange: getCurrentDateRange('March'), amount: '₹26,000', details: generateMonthlyDetails('March') },
    { month: 'April', dateRange: getCurrentDateRange('April'), amount: '₹15,000', details: generateMonthlyDetails('April') },
    { month: 'May', dateRange: getCurrentDateRange('May'), amount: '₹22,000', details: generateMonthlyDetails('May') },
    { month: 'June', dateRange: getCurrentDateRange('June'), amount: '₹28,000', details: generateMonthlyDetails('June') },
    { month: 'July', dateRange: getCurrentDateRange('July'), amount: '₹30,000', details: generateMonthlyDetails('July') },
    { month: 'August', dateRange: getCurrentDateRange('August'), amount: '₹27,000', details: generateMonthlyDetails('August') },
    { month: 'September', dateRange: getCurrentDateRange('September'), amount: '₹23,000', details: generateMonthlyDetails('September') },
    { month: 'October', dateRange: getCurrentDateRange('October'), amount: '₹29,000', details: generateMonthlyDetails('October') },
    { month: 'November', dateRange: getCurrentDateRange('November'), amount: '₹25,500', details: generateMonthlyDetails('November') },
    { month: 'December', dateRange: getCurrentDateRange('December'), amount: '₹31,000', details: generateMonthlyDetails('December') }
  ];

  // Generate sample details for each month
  function generateMonthlyDetails(month: string) {
    return [
      { id: `${month}-1`, action: 'Consume', name: 'Tissue', contentStock: '84', consumed: '100', amount: '₹2,800' },
      { id: `${month}-2`, action: 'Consume', name: 'Hand Sanitizer', contentStock: '50', consumed: '25', amount: '₹1,250' },
      { id: `${month}-3`, action: 'Consume', name: 'Cleaning Spray', contentStock: '75', consumed: '40', amount: '₹1,600' },
      { id: `${month}-4`, action: 'Consume', name: 'Paper Towels', contentStock: '120', consumed: '80', amount: '₹2,400' },
      { id: `${month}-5`, action: 'Consume', name: 'Disinfectant', contentStock: '60', consumed: '35', amount: '₹1,750' }
    ];
  }

  // Define table columns for expanded view
  const expandedColumns: ColumnConfig[] = [
    { key: 'action', label: 'Action', sortable: false, draggable: false },
    { key: 'name', label: 'Name', sortable: true, draggable: false },
    { key: 'contentStock', label: 'Content Stock', sortable: true, draggable: false },
    { key: 'consumed', label: 'Consumed', sortable: true, draggable: false },
    { key: 'amount', label: 'Amount', sortable: true, draggable: false }
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
    if (columnKey === 'name') {
      return <span className="font-medium text-gray-900">{value}</span>;
    }
    if (columnKey === 'amount') {
      return <span className="font-semibold text-green-600">{value}</span>;
    }
    return <span className="text-gray-700">{value}</span>;
  };

  // Toggle month expansion
  const toggleMonth = (month: string) => {
    // Don't allow expansion of disabled months
    if (isMonthDisabled(month)) return;
    setExpandedMonth(expandedMonth === month ? null : month);
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
  const handleViewItem = (item: any) => {
    navigate(`/maintenance/inventory-consumption/view/${item.id}`);
  };


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Consumption LIST</h1>
      </div>

      {/* Monthly Consumption Boxes */}
      <div className="space-y-4">
        {monthlyData.map((monthData) => (
          <div
            key={monthData.month}
            id={`month-${monthData.month}`}
            className={`border rounded-lg bg-white shadow-sm ${monthData.month === currentMonth
                ? 'border-[#C72030] border-2 shadow-md'
                : 'border-gray-200'
              }`}
          >
            {/* Month Header Box */}
            <div
              className={`flex items-center justify-between p-6 transition-colors ${isMonthDisabled(monthData.month)
                  ? 'opacity-50 cursor-not-allowed bg-gray-100'
                  : 'cursor-pointer hover:bg-gray-50'
                }`}
              onClick={() => toggleMonth(monthData.month)}
              title={isMonthDisabled(monthData.month) ? 'Data not available for future months' : ''}
            >
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{monthData.month}</h2>
                  <p className="text-sm text-gray-600">{monthData.dateRange}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-red-600">{monthData.amount}</span>
                {expandedMonth === monthData.month ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Expanded Table */}
            {expandedMonth === monthData.month && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-4">
                  <EnhancedTable
                    data={monthData.details}
                    columns={expandedColumns}
                    renderCell={renderExpandedCell}
                    storageKey={`consumption-table-${monthData.month}`}
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