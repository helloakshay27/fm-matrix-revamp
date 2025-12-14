import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import axios from 'axios';

interface PaymentPlanSchedule {
  month_number: number;
  percentage: string;
}

interface PaymentPlan {
  id?: number;
  name: string;
  frequency: string;
  duration_in_months: number;
  payment_plan_schedules: PaymentPlanSchedule[];
}

export const PaymentPlanSetup = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://${baseUrl}/payment_plans.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error fetching payment plans:', error);
      toast.error('Failed to fetch payment plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (planId: number) => {
    if (!window.confirm('Are you sure you want to delete this payment plan?')) {
      return;
    }

    try {
      await axios.delete(
        `https://${baseUrl}/payment_plans/${planId}.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Payment plan deleted successfully');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting payment plan:', error);
      toast.error('Failed to delete payment plan');
    }
  };

  const columns = [
    { key: 'actions', label: 'Actions', sortable: false },
    { key: 'name', label: 'Plan Name', sortable: true },
    { key: 'frequency', label: 'Frequency', sortable: true },
    // { key: 'duration_in_months', label: 'Duration (Months)', sortable: true },
    { key: 'schedules_count', label: 'Payment Schedules', sortable: true },
  ];

  const renderCell = (item: PaymentPlan, columnKey: string) => {
    if (columnKey === 'actions') {
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate(`/settings/payment-plan/details/${item.id}`)}
            title="View Details"
            className="p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {/* <Button
            variant="ghost"
            onClick={() => navigate(`/settings/payment-plan/edit/${item.id}`)}
            title="Edit"
            className="p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleDelete(item.id!)}
            title="Delete"
            className="p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button> */}
        </div>
      );
    }

    if (columnKey === 'frequency') {
      return (
        <span className="capitalize">
          {item.frequency}
        </span>
      );
    }

    if (columnKey === 'schedules_count') {
      return item.payment_plan_schedules?.length || 0;
    }

    return item[columnKey] || '-';
  };

  const renderCustomActions = () => (
    <div className="flex gap-3">
      <Button
        className="bg-[#C72030] hover:bg-[#A01020] text-white"
        onClick={() => navigate('/settings/payment-plan/add')}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      <div className="overflow-x-auto animate-fade-in">
        <EnhancedTable
          data={plans || []}
          columns={columns}
          renderCell={renderCell}
          selectable={false}
          pagination={false}
          enableExport={false}
          storageKey="payment-plan-setup-table"
          leftActions={renderCustomActions()}
          searchPlaceholder="Search Payment Plans"
          hideTableExport={true}
          hideColumnsButton={false}
          loading={loading}
          loadingMessage="Loading payment plans..."
        />
      </div>
    </div>
  );
};

export default PaymentPlanSetup;
