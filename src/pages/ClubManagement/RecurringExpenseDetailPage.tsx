import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';

const RecurringExpenseDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    document.title = 'Recurring Expense Details';
    const stored = JSON.parse(localStorage.getItem('recurringExpenses') || '[]');
    const found = stored.find((s: any) => String(s.id) === String(id));
    if (found) setItem(found);
    else {
      // fallback sample
      setItem({
        id,
        profile_name: 'test',
        expense_account: 'Goods cost',
        vendor_name: 'Lockated',
        frequency: 'Weekly',
        last_expense_date: '17/02/2026',
        next_expense_date: '24/02/2026',
        status: 'ACTIVE',
        amount: '₹100.00',
      });
    }
  }, [id]);

  if (!item) return null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{item.profile_name}</h1>
        <div className="flex gap-2">
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <div>
          <strong>Expense Account: </strong> {item.expense_account}
        </div>
        <div>
          <strong>Vendor: </strong> {item.vendor_name}
        </div>
        <div>
          <strong>Frequency: </strong> {item.frequency}
        </div>
        <div>
          <strong>Last Expense Date: </strong> {item.last_expense_date}
        </div>
        <div>
          <strong>Next Expense Date: </strong> {item.next_expense_date}
        </div>
        <div>
          <strong>Status: </strong> {item.status}
        </div>
        <div>
          <strong>Amount: </strong> {item.amount}
        </div>
      </div>
    </div>
  );
};

export default RecurringExpenseDetailPage;
