import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import { ArrowLeft, FileText, FileDown } from 'lucide-react';

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

const RecurringExpenseDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<RecurringExpense | null>(null);

  useEffect(() => {
    document.title = 'Recurring Expense Details';
    const stored = JSON.parse(localStorage.getItem('recurringExpenses') || '[]');
    const found = stored.find((s: any) => String(s.id) === String(id));
    if (found) setItem(found);
    else {
      // fallback sample
      setItem({
        id,
        profile_name: 'Office Supplies',
        date: '20/02/2026',
        expense_account: 'Office & Administration',
        vendor_name: 'ABC Suppliers',
        frequency: 'Weekly',
        last_expense_date: '17/02/2026',
        next_expense_date: '24/02/2026',
        status: 'ACTIVE',
        amount: '₹222.00',
        reference_number: '123444',
        paid_through: 'Cash Account',
        voucher_number: 'EXP-1866A91C',
        transaction_type: 'EXPENSE',
        description: 'Regular office supplies purchase',
      });
    }
  }, [id]);

  if (!item) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <IconButton onClick={() => navigate('/accounting/recurring-expenses')} size="small">
            <ArrowLeft className="w-5 h-5" />
          </IconButton>
          <h1 className="text-2xl font-semibold">Expense Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outlined" startIcon={<FileText />}>
            Print
          </Button>
          <Button variant="outlined" startIcon={<FileDown />}>
            Export
          </Button>
        </div>
      </div>

      {/* Expense Information Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Expense Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Date</label>
              <p className="text-base font-medium text-gray-900">{item.date || item.last_expense_date}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Reference Number</label>
              <p className="text-base font-medium text-gray-900">{item.reference_number}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Paid Through</label>
              <p className="text-base font-medium text-gray-900">{item.paid_through}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Voucher Number</label>
              <p className="text-base font-medium text-gray-900">{item.voucher_number}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Expense Account</label>
              <p className="text-base font-medium text-gray-900">{item.expense_account}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Amount</label>
              <p className="text-base font-medium text-gray-900">{item.amount}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Vendor</label>
              <p className="text-base font-medium text-gray-900">{item.vendor_name}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Transaction Type</label>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded">
                {item.transaction_type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Description</h2>
        </div>
        <p className="text-base text-gray-700">{item.description || 'No description provided'}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-6">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/accounting/recurring-expenses/${id}/edit`)}
        >
          Edit Expense
        </Button>
        <Button variant="outlined" onClick={() => navigate('/accounting/recurring-expenses')}>
          Back to List
        </Button>
      </div>
    </div>
  );
};

export default RecurringExpenseDetailPage;
