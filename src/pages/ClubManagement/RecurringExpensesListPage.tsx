import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import { Eye, Pencil } from 'lucide-react';

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

const formatDate = (d?: string) => (d ? d : '');

const RecurringExpensesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<RecurringExpense[]>([]);

  useEffect(() => {
    document.title = 'Recurring Expenses';
    const stored = JSON.parse(localStorage.getItem('recurringExpenses') || '[]');
    if (stored && Array.isArray(stored) && stored.length > 0) {
      setItems(stored);
    } else {
      // fallback sample
      const today = new Date();
      const next = new Date(today);
      next.setDate(today.getDate() + 7);
      setItems([
        {
          id: 1,
          profile_name: 'Office Supplies',
          date: '20/02/2026',
          expense_account: 'Office & Administration',
          vendor_name: 'ABC Suppliers',
          frequency: 'Weekly',
          last_expense_date: formatDate(today.toLocaleDateString('en-GB')),
          next_expense_date: formatDate(next.toLocaleDateString('en-GB')),
          status: 'ACTIVE',
          amount: '₹222.00',
          reference_number: '123444',
          paid_through: 'Cash Account',
          voucher_number: 'EXP-1866A91C',
          transaction_type: 'EXPENSE',
          description: 'Regular office supplies purchase',
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">All Profiles</h1>
        <div className="flex items-center gap-2">
          <Button variant="contained" color="primary" onClick={handleNew}>
            + New
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left bg-muted/50">
              <th className="px-4 py-3 text-xs font-medium text-gray-600">ACTIONS</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">DATE</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">EXPENSE ACCOUNT</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">FREQUENCY</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">STATUS</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">AMOUNT</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">VOUCHER NUMBER</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">VENDOR NAME</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-600">PAID THROUGH</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-muted/10 border-b border-border/30">
                <td className="px-4 py-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <IconButton size="small" onClick={() => handleView(it.id)} title="View">
                      <Eye className="w-4 h-4" />
                    </IconButton>
                   
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{it.date || it.last_expense_date}</td>
                <td
                  className="px-4 py-4 text-sm text-primary underline cursor-pointer"
                  onClick={() => handleView(it.id)}
                >
                  {it.expense_account}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{it.frequency || '-'}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{it.status || '-'}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{it.amount || '-'}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{it.voucher_number || '-'}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{it.vendor_name}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{it.paid_through || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecurringExpensesListPage;
