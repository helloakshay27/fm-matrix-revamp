import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { TextField, MenuItem } from '@mui/material';

interface PaymentSchedule {
  month_number: number;
  percentage: number;
}

const FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'Monthly', months: 1 },
  { value: 'quarterly', label: 'Quarterly', months: 3 },
  { value: 'half_yearly', label: 'Half Yearly', months: 6 },
  { value: 'yearly', label: 'Yearly', months: 12 },
];

export const AddPaymentPlan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [planName, setPlanName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [durationInMonths, setDurationInMonths] = useState(12);
  const [schedules, setSchedules] = useState<PaymentSchedule[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  // Fetch existing plan data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchPlanDetails();
    }
  }, [id, isEditMode]);

  const fetchPlanDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://${baseUrl}/payment_plans/${id}.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const plan = response.data.plans.find((p: any) => p.id === parseInt(id!));
      if (plan) {
        setPlanName(plan.name);
        setFrequency(plan.frequency);
        setDurationInMonths(plan.duration_in_months);
        setSchedules(
          plan.payment_plan_schedules.map((s: any) => ({
            month_number: s.month_number,
            percentage: parseFloat(s.percentage),
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching plan details:', error);
      toast.error('Failed to fetch plan details');
    } finally {
      setLoading(false);
    }
  };

  // Generate schedules based on frequency
  const handleFrequencyChange = (selectedFrequency: string) => {
    setFrequency(selectedFrequency);
    const frequencyOption = FREQUENCY_OPTIONS.find(
      (opt) => opt.value === selectedFrequency
    );

    if (frequencyOption) {
      const monthsCount = frequencyOption.months;
      const newSchedules: PaymentSchedule[] = [];

      // Generate schedules starting from month 1
      for (let i = 1; i <= monthsCount; i++) {
        newSchedules.push({
          month_number: i,
          percentage: 0,
        });
      }

      setSchedules(newSchedules);
    }
  };

  const handlePercentageChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updatedSchedules = [...schedules];
    updatedSchedules[index].percentage = numValue;
    setSchedules(updatedSchedules);
  };

  const calculateTotalPercentage = () => {
    return schedules.reduce((sum, schedule) => sum + schedule.percentage, 0);
  };

  const handleSubmit = async () => {
    // Validation
    if (!planName.trim()) {
      toast.error('Please enter a plan name');
      return;
    }

    if (!frequency) {
      toast.error('Please select a frequency');
      return;
    }

    const totalPercentage = calculateTotalPercentage();
    if (totalPercentage !== 100) {
      toast.error(`Total percentage must be 100%. Current total: ${totalPercentage}%`);
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(
      isEditMode ? 'Updating payment plan...' : 'Creating payment plan...'
    );

    try {
      const payload = {
        payment_plan: {
          name: planName,
          frequency: frequency,
          duration_in_months: durationInMonths,
          payment_plan_schedules_attributes: schedules.map((schedule) => ({
            month_number: schedule.month_number,
            percentage: schedule.percentage,
          })),
        },
      };

      if (isEditMode) {
        await axios.put(
          `https://${baseUrl}/payment_plans/${id}.json`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        toast.success('Payment plan updated successfully', { id: loadingToast });
      } else {
        await axios.post(
          `https://${baseUrl}/payment_plans.json`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        toast.success('Payment plan created successfully', { id: loadingToast });
      }

      navigate('/settings/payment-plan/setup');
    } catch (error) {
      console.error('Error saving payment plan:', error);
      toast.error('Failed to save payment plan', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const totalPercentage = calculateTotalPercentage();

  return (
    <div className="p-[30px] min-h-screen bg-transparent">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
        <button
          onClick={() => navigate('/settings/payment-plan/setup')}
          className="flex items-center gap-1 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-[24px] font-semibold text-[#1a1a1a]">
          {isEditMode ? 'Edit Payment Plan' : 'Add Payment Plan'}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
        {/* Plan Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              size="small"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Enter plan name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              select
              size="small"
              value={frequency}
              onChange={(e) => handleFrequencyChange(e.target.value)}
              disabled={loading}
            >
              {FREQUENCY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>

        {/* Duration */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Months) <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={durationInMonths}
              onChange={(e) => setDurationInMonths(parseInt(e.target.value) || 12)}
              disabled={loading}
            />
          </div>
        </div> */}

        {/* Payment Schedules Table */}
        {schedules.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Payment Schedule</h3>
              <div className="text-sm">
                Total:{' '}
                <span
                  className={`font-bold ${
                    totalPercentage === 100
                      ? 'text-green-600'
                      : totalPercentage > 100
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {totalPercentage.toFixed(2)}%
                </span>
                {totalPercentage !== 100 && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Must equal 100%)
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#E5E0D3]">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                      Month Number
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                      Percentage (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">
                        Month {schedule.month_number}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={schedule.percentage}
                          onChange={(e) => handlePercentageChange(index, e.target.value)}
                          inputProps={{ min: 0, max: 100, step: 0.01 }}
                          disabled={loading}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/settings/payment-plan/setup')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={handleSubmit}
            disabled={loading || totalPercentage !== 100}
          >
            {isEditMode ? 'Update Plan' : 'Create Plan'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentPlan;
