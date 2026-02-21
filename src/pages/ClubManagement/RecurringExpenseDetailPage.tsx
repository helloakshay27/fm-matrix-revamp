import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import { ArrowLeft, FileText, FileDown, Receipt, Clock } from 'lucide-react';

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

const Field: React.FC<{ label: string; value?: string | number | React.ReactNode }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <div className="text-base font-semibold text-gray-900">{value || '-'}</div>
  </div>
);

const getStatusStyle = (status?: string): React.CSSProperties => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
    case 'INACTIVE':
      return { backgroundColor: '#fee2e2', color: '#dc2626' };
    default:
      return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
  }
};

const RecurringExpenseDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<RecurringExpense | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'vendor' | 'history'>('details');

  useEffect(() => {
    document.title = 'Recurring Expense Details';
    const stored = JSON.parse(localStorage.getItem('recurringExpenses') || '[]');
    const found = stored.find((s: any) => String(s.id) === String(id));
    if (found) {
      setItem(found);
    } else {
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
        voucher_number: '',
        transaction_type: 'EXPENSE',
        description: 'Regular office supplies purchase',
      });
    }
  }, [id]);

  if (!item) return null;

  const tabs = [
    { key: 'details' as const, label: 'Expense Details' },
    { key: 'vendor'  as const, label: 'Vendor Info' },
    { key: 'history' as const, label: 'History' },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <IconButton
            onClick={() => navigate('/accounting/recurring-expenses')}
            size="small"
            sx={{ color: '#374151', '&:hover': { backgroundColor: '#f3f4f6' } }}
          >
            <ArrowLeft className="w-5 h-5" />
          </IconButton>

          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded flex items-center justify-center"
              style={{ backgroundColor: '#fee2e2' }}
            >
              <Receipt className="w-5 h-5" style={{ color: '#dc2626' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Expense #{item.voucher_number || item.reference_number}
              </h1>
              <p className="text-sm text-gray-500">Created on {item.date}</p>
            </div>
          </div>
        </div>

        {/* Action buttons + status badge */}
        <div className="flex items-center gap-3 mt-1">
          <Button
            variant="outlined"
            startIcon={<FileText className="w-4 h-4" />}
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              borderColor: '#e5e7eb',
              color: '#374151',
              '&:hover': { borderColor: '#d1d5db', backgroundColor: '#f9fafb' },
            }}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDown className="w-4 h-4" />}
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              borderColor: '#e5e7eb',
              color: '#374151',
              '&:hover': { borderColor: '#d1d5db', backgroundColor: '#f9fafb' },
            }}
          >
            Export
          </Button>
          <span
            className="text-xs font-bold px-4 py-1.5 rounded-full border"
            style={getStatusStyle(item.status)}
          >
            {item.transaction_type || 'EXPENSE'}
          </span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        className="inline-flex items-center gap-1 p-1 rounded-lg mb-6"
        style={{ backgroundColor: '#f0f2f5' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-5 py-2 text-sm font-medium rounded-md transition-all duration-150"
            style={
              activeTab === tab.key
                ? {
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    fontWeight: 700,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
                  }
                : {
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════ EXPENSE DETAILS TAB ══════════ */}
      {activeTab === 'details' && (
        <div className="space-y-4">

          {/* Expense Information */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Receipt className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Expense Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-x-16 gap-y-6">
              <Field label="Date"             value={item.date} />
              <Field label="Expense Account"  value={item.expense_account} />

              <Field label="Reference Number" value={item.reference_number} />
              <Field label="Amount"           value={item.amount} />

              <Field label="Paid Through"     value={item.paid_through} />
              <Field label="Vendor"           value={item.vendor_name} />

              <Field label="Voucher Number"   value={item.voucher_number} />
              <div>
                <p className="text-sm text-gray-500 mb-1">Transaction Type</p>
                <span
                  className="text-xs font-bold px-3 py-1 rounded"
                  style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
                >
                  {item.transaction_type || 'EXPENSE'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Description</h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              {item.description || 'No description provided.'}
            </p>
          </div>
        </div>
      )}

      {/* ══════════ VENDOR INFO TAB ══════════ */}
      {activeTab === 'vendor' && (
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Receipt className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Vendor Information</h2>
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-6">
            <Field label="Vendor Name"      value={item.vendor_name} />
            <Field label="Expense Account"  value={item.expense_account} />
            <Field label="Paid Through"     value={item.paid_through} />
            <Field label="Reference Number" value={item.reference_number} />
            <Field label="Voucher Number"   value={item.voucher_number} />
            <div>
              <p className="text-sm text-gray-500 mb-1">Transaction Type</p>
              <span
                className="text-xs font-bold px-3 py-1 rounded"
                style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
              >
                {item.transaction_type || 'EXPENSE'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ HISTORY TAB ══════════ */}
      {activeTab === 'history' && (
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Schedule History</h2>
          </div>

          <div>
            {[
              {
                label: 'Last Expense Date',
                date: item.last_expense_date,
                badge: 'COMPLETED',
                badgeStyle: { backgroundColor: '#dcfce7', color: '#16a34a' },
              },
              {
                label: 'Next Expense Date',
                date: item.next_expense_date,
                badge: 'UPCOMING',
                badgeStyle: { backgroundColor: '#fef9c3', color: '#a16207' },
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm text-gray-500">{row.label}</p>
                  <p className="text-base font-semibold text-gray-900 mt-0.5">{row.date || '-'}</p>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={row.badgeStyle}
                >
                  {row.badge}
                </span>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-x-16 gap-y-6 pt-6">
              <Field label="Frequency"    value={item.frequency} />
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={getStatusStyle(item.status)}
                >
                  {item.status || '-'}
                </span>
              </div>
              <Field label="Profile Name" value={item.profile_name} />
              <Field label="Amount"       value={item.amount} />
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Action Buttons ── */}
      <div className="flex items-center gap-3 mt-6">
        <Button
          variant="contained"
          onClick={() => navigate(`/accounting/recurring-expenses/${id}/edit`)}
          sx={{
            textTransform: 'none',
            backgroundColor: '#dc2626',
            '&:hover': { backgroundColor: '#b91c1c' },
          }}
        >
          Edit Expense
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/accounting/recurring-expenses')}
          sx={{
            textTransform: 'none',
            borderColor: '#e5e7eb',
            color: '#374151',
            '&:hover': { borderColor: '#d1d5db', backgroundColor: '#f9fafb' },
          }}
        >
          Back to List
        </Button>
      </div>
    </div>
  );
};

export default RecurringExpenseDetailPage;