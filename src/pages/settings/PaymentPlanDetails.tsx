import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { toast } from 'sonner';
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

export const PaymentPlanDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [plan, setPlan] = useState<PaymentPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

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

      const foundPlan = response.data.plans.find(
        (p: any) => p.id === parseInt(id!)
      );

      if (foundPlan) {
        setPlan(foundPlan);
      } else {
        toast.error('Payment plan not found');
        navigate('/settings/payment-plan/setup');
      }
    } catch (error) {
      console.error('Error fetching plan details:', error);
      toast.error('Failed to fetch plan details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPlanDetails();
    }
  }, [id]);

  const calculateTotalPercentage = () => {
    if (!plan?.payment_plan_schedules) return 0;
    return plan.payment_plan_schedules.reduce(
      (sum, schedule) => sum + parseFloat(schedule.percentage),
      0
    );
  };

  if (loading) {
    return <div className="p-10 text-gray-600">Loading payment plan details...</div>;
  }

  if (!plan) {
    return <div className="p-10 text-gray-600">Payment plan not found</div>;
  }

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

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-semibold text-[#1a1a1a]">
          Payment Plan Details
        </h1>
        <Button
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
          onClick={() => navigate(`/settings/payment-plan/edit/${id}`)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Plan
        </Button>
      </div>

      {/* Plan Information */}
      <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            PLAN INFORMATION
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-3">
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Plan Name</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">{plan.name}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Frequency</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium capitalize">
                {plan.frequency}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Duration</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {plan.duration_in_months} Months
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
              PAYMENT SCHEDULE
            </h3>
          </div>
          <div className="text-sm">
            Total:{' '}
            <span
              className={`font-bold text-lg ${
                totalPercentage === 100 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {totalPercentage.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#E5E0D3]">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Sr No.
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                  Month Number
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {plan.payment_plan_schedules.map((schedule, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    Month {schedule.month_number}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                    {parseFloat(schedule.percentage).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold">
                <td
                  colSpan={2}
                  className="border border-gray-300 px-4 py-3 text-right"
                >
                  Total
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  <span
                    className={
                      totalPercentage === 100 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {totalPercentage.toFixed(2)}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlanDetails;
