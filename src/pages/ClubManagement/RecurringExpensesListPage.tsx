import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

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
          profile_name: 'test',
          expense_account: 'Goods cost',
          vendor_name: 'Lockated',
          frequency: 'Weekly',
          last_expense_date: formatDate(today.toLocaleDateString('en-GB')),
          next_expense_date: formatDate(next.toLocaleDateString('en-GB')),
          status: 'ACTIVE',
          amount: '₹100.00',
        },
      ]);
    }
  }, []);

  const handleNew = () => navigate('/accounting/recurring-expenses/create');
  const handleRow = (id: string | number) => navigate(`/accounting/recurring-expenses/${id}`);

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
              <th className="px-4 py-3">PROFILE NAME</th>
              <th className="px-4 py-3">EXPENSE ACCOUNT</th>
              <th className="px-4 py-3">VENDOR NAME</th>
              <th className="px-4 py-3">FREQUENCY</th>
              <th className="px-4 py-3">LAST EXPENSE DATE</th>
              <th className="px-4 py-3">NEXT EXPENSE DATE</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-muted/10 cursor-pointer" onClick={() => handleRow(it.id)}>
                <td className="px-4 py-4 text-primary underline">{it.profile_name}</td>
                <td className="px-4 py-4">{it.expense_account}</td>
                <td className="px-4 py-4">{it.vendor_name}</td>
                <td className="px-4 py-4">{it.frequency}</td>
                <td className="px-4 py-4">{it.last_expense_date}</td>
                <td className="px-4 py-4">{it.next_expense_date}</td>
                <td className="px-4 py-4">{it.status}</td>
                <td className="px-4 py-4">{it.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecurringExpensesListPage;
