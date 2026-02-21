import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, TextField, InputAdornment } from '@mui/material';
import { Eye, Pencil, Trash2, Search, Grid3x3 } from 'lucide-react';

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

const RecurringExpensesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<RecurringExpense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'Recurring Expenses';
    const stored = JSON.parse(localStorage.getItem('recurringExpenses') || '[]');
    if (stored && Array.isArray(stored) && stored.length > 0) {
      setItems(stored);
    } else {
      setItems([
        {
          id: 1,
          profile_name: 'Facility Cleaning Contract',
          date: '08/02/2026',
          expense_account: 'Building Maintenance - Janitorial Services',
          vendor_name: 'CleanPro Solutions',
          frequency: 'Bi-weekly',
          last_expense_date: '08/02/2026',
          next_expense_date: '22/02/2026',
          status: 'ACTIVE',
          amount: '₹12000.00',
          reference_number: 'CLEAN-2026-0234',
          paid_through: 'Cheque - Finance Account',
          voucher_number: 'VCH-CLEAN-234',
          transaction_type: 'EXPENSE',
          description: 'Bi-weekly facility and office cleaning',
        },
        {
          id: 2,
          profile_name: 'Office Stationery Supplies',
          date: '12/02/2026',
          expense_account: 'Administrative Supplies - Office Materials',
          vendor_name: 'PaperWorks India Pvt Ltd',
          frequency: 'Monthly',
          last_expense_date: '12/02/2026',
          next_expense_date: '12/03/2026',
          status: 'ACTIVE',
          amount: '₹6500.00',
          reference_number: 'STAT-2026-0567',
          paid_through: 'Credit Card - Corporate',
          voucher_number: 'VCH-STAT-567',
          transaction_type: 'EXPENSE',
          description: 'Monthly office stationery procurement',
        },
        {
          id: 3,
          profile_name: 'Security Guard Services',
          date: '01/02/2026',
          expense_account: 'Security & Safety - Personnel Costs',
          vendor_name: 'SecureGuard Enterprises',
          frequency: 'Monthly',
          last_expense_date: '01/02/2026',
          next_expense_date: '01/03/2026',
          status: 'ACTIVE',
          amount: '₹35000.00',
          reference_number: 'SEC-2026-0891',
          paid_through: 'Bank Transfer - Payroll Account',
          voucher_number: 'VCH-SEC-891',
          transaction_type: 'EXPENSE',
          description: 'Monthly security personnel salaries',
        },
        {
          id: 4,
          profile_name: 'Vehicle Maintenance & Fuel',
          date: '14/02/2026',
          expense_account: 'Transportation - Vehicle Operations',
          vendor_name: 'AutoCare Services Ltd',
          frequency: 'Monthly',
          last_expense_date: '14/02/2026',
          next_expense_date: '14/03/2026',
          status: 'ACTIVE',
          amount: '₹18500.00',
          reference_number: 'VEHM-2026-0445',
          paid_through: 'Fuel Card + Service Cheque',
          voucher_number: 'VCH-VEHM-445',
          transaction_type: 'EXPENSE',
          description: 'Vehicle fuel, maintenance and repairs',
        },
        {
          id: 5,
          profile_name: 'Professional Training Programs',
          date: '03/02/2026',
          expense_account: 'Human Resources - Employee Development',
          vendor_name: 'SkillBuild Academy',
          frequency: 'Quarterly',
          last_expense_date: '03/02/2026',
          next_expense_date: '03/05/2026',
          status: 'ACTIVE',
          amount: '₹45000.00',
          reference_number: 'TRAIN-2026-0723',
          paid_through: 'Bank Transfer - Training Fund',
          voucher_number: 'VCH-TRAIN-723',
          transaction_type: 'EXPENSE',
          description: 'Quarterly employee skill development program',
        },
        {
          id: 6,
          profile_name: 'Pest Control & Hygiene',
          date: '16/02/2026',
          expense_account: 'Building Maintenance - Health & Hygiene',
          vendor_name: 'BioSafe Pest Management',
          frequency: 'Monthly',
          last_expense_date: '16/02/2026',
          next_expense_date: '16/03/2026',
          status: 'ACTIVE',
          amount: '₹4200.00',
          reference_number: 'PEST-2026-0156',
          paid_through: 'Cash Payment - Admin Reserve',
          voucher_number: 'VCH-PEST-156',
          transaction_type: 'EXPENSE',
          description: 'Monthly pest control and hygiene services',
        },
      ]);
    }
  }, []);

  const handleNew = () => navigate('/accounting/recurring-expenses/create');
  const handleView = (id: string | number) => navigate(`/accounting/recurring-expenses/${id}`);
  const handleEdit = (id: string | number) => navigate(`/accounting/recurring-expenses/${id}/edit`);
  const handleDelete = (id: string | number) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      const updated = items.filter((it) => it.id !== id);
      setItems(updated);
      localStorage.setItem('recurringExpenses', JSON.stringify(updated));
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.profile_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.expense_account?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return { backgroundColor: '#dcfce7', color: '#16a34a' };
      case 'INACTIVE':
        return { backgroundColor: '#fee2e2', color: '#dc2626' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Recurring Expenses</h1>
        <div className="flex items-center gap-4">
          <TextField
            placeholder="Search..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-4 h-4 text-gray-400" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: '250px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                backgroundColor: '#f9fafb',
                '& fieldset': { borderColor: '#e5e7eb' },
                '&:hover fieldset': { borderColor: '#d1d5db' },
              },
            }}
          />
          <IconButton
            onClick={() => {}}
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              color: '#dc2626',
              '&:hover': { backgroundColor: '#fee2e2' },
            }}
          >
            <Grid3x3 className="w-5 h-5" />
          </IconButton>
        </div>
      </div>

      {/* New Expense Button */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          onClick={handleNew}
          sx={{
            color: '#dc2626',
            backgroundColor: '#f5f3f0',
            textTransform: 'none',
            fontSize: '15px',
            fontWeight: '500',
            padding: '12px 24px',
            borderRadius: '4px',
            '&:hover': { backgroundColor: '#ede9e4' },
          }}
        >
          + New Expense
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#e8e6e1' }}>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 min-w-[120px]">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 min-w-[200px]">
                  Profile Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 min-w-[280px]">
                  Expense Account
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 min-w-[110px]">
                  Frequency
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 min-w-[140px]">
                  Last Expense Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 min-w-[140px]">
                  Next Expense Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 min-w-[90px]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 min-w-[110px]">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 min-w-[170px]">
                  Reference#
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 min-w-[160px]">
                  Vendor Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 min-w-[190px]">
                  Paid Through
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((it) => (
                <tr
                  key={it.id}
                  className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                >
                  {/* Action */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <IconButton
                        size="small"
                        onClick={() => handleView(it.id)}
                        title="View"
                        sx={{ color: '#6b7280', '&:hover': { color: '#111827' } }}
                      >
                        <Eye className="w-4 h-4" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(it.id)}
                        title="Edit"
                        sx={{ color: '#6b7280', '&:hover': { color: '#111827' } }}
                      >
                        <Pencil className="w-4 h-4" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(it.id)}
                        title="Delete"
                        sx={{ color: '#6b7280', '&:hover': { color: '#dc2626' } }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </td>

                  {/* Profile Name — clickable blue link */}
                  <td
                    className="px-4 py-4 text-sm text-blue-600 underline cursor-pointer hover:text-blue-800 font-medium"
                    onClick={() => handleView(it.id)}
                  >
                    {it.profile_name}
                  </td>

                  {/* Expense Account */}
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {it.expense_account || '-'}
                  </td>

                  {/* Frequency */}
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {it.frequency || '-'}
                  </td>

                  {/* Last Expense Date */}
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {it.last_expense_date || '-'}
                  </td>

                  {/* Next Expense Date */}
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {it.next_expense_date || '-'}
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-4">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                      style={statusColors(it.status)}
                    >
                      {it.status || '-'}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                    {it.amount || '-'}
                  </td>

                  {/* Reference# — bold primary + smaller voucher below */}
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div className="font-bold">{it.reference_number}</div>
                    {it.voucher_number && (
                      <div className="text-xs text-gray-500 mt-0.5">{it.voucher_number}</div>
                    )}
                  </td>

                  {/* Vendor Name */}
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {it.vendor_name || '-'}
                  </td>

                  {/* Paid Through */}
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {it.paid_through || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">No recurring expenses found. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecurringExpensesListPage;