import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Settings, Banknote, CreditCard, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BillBookingDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddClick = () => {
    navigate('/finance/bill-booking/add');
  };

  // Sample data - empty for now as shown in reference
  const billsData: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">BILL LIST</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1 */}
          <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 md:h-[132px]">
            <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#D92818]" />
            </div>
            <div>
              <p className="text-[#D92818] font-bold text-lg">0</p>
              <p className="text-sm text-gray-500">Total Bills</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 md:h-[132px]">
            <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center">
              <Banknote className="w-5 h-5 text-[#D92818]" />
            </div>
            <div>
              <p className="text-[#D92818] font-bold text-lg">{localStorage.getItem('currency')} 0</p>
              <p className="text-sm text-gray-500">Total Amount</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 md:h-[132px]">
            <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#D92818]" />
            </div>
            <div>
              <p className="text-[#D92818] font-bold text-lg">{localStorage.getItem('currency')} 0</p>
              <p className="text-sm text-gray-500">Total Paid Amount</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 md:h-[132px]">
            <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#D92818]" />
            </div>
            <div>
              <p className="text-[#D92818] font-bold text-lg">{localStorage.getItem('currency')} 0</p>
              <p className="text-sm text-gray-500">Total Pending Amount</p>
            </div>
          </div>
        </div>


        {/* Add Button */}
        <div className="mb-6">
          <Button
            onClick={handleAddClick}
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Action</TableHead>
                <TableHead className="font-semibold text-gray-900">ID</TableHead>
                <TableHead className="font-semibold text-gray-900">Description</TableHead>
                <TableHead className="font-semibold text-gray-900">Supplier</TableHead>
                <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                <TableHead className="font-semibold text-gray-900">Deduction</TableHead>
                <TableHead className="font-semibold text-gray-900">TDS(%)</TableHead>
                <TableHead className="font-semibold text-gray-900">TDS Amount</TableHead>
                <TableHead className="font-semibold text-gray-900">Retention(%)</TableHead>
                <TableHead className="font-semibold text-gray-900">Retention Amount</TableHead>
                <TableHead className="font-semibold text-gray-900">Payable Amount</TableHead>
                <TableHead className="font-semibold text-gray-900">Bill Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Invoice Number</TableHead>
                <TableHead className="font-semibold text-gray-900">Payment Tenure In Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billsData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="text-center py-8 text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                billsData.map((bill, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>{/* Action buttons */}</TableCell>
                    <TableCell>{bill.id}</TableCell>
                    <TableCell>{bill.description}</TableCell>
                    <TableCell>{bill.supplier}</TableCell>
                    <TableCell>{bill.amount}</TableCell>
                    <TableCell>{bill.deduction}</TableCell>
                    <TableCell>{bill.tdsPercentage}</TableCell>
                    <TableCell>{bill.tdsAmount}</TableCell>
                    <TableCell>{bill.retentionPercentage}</TableCell>
                    <TableCell>{bill.retentionAmount}</TableCell>
                    <TableCell>{bill.payableAmount}</TableCell>
                    <TableCell>{bill.billDate}</TableCell>
                    <TableCell>{bill.invoiceNumber}</TableCell>
                    <TableCell>{bill.paymentTenure}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
