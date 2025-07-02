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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
  <div className="bg-[#F2F0EB] text-[#D92818] rounded-lg p-6 shadow-[0px_2px_18px_rgba(45,45,45,0.1)]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-80">Total Bills</p>
        <p className="text-3xl font-bold">0</p>
      </div>
      <Settings className="w-8 h-8 opacity-60" />
    </div>
  </div>

  <div className="bg-[#F2F0EB] text-[#D92818] rounded-lg p-6 shadow-[0px_2px_18px_rgba(45,45,45,0.1)]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-lg font-semibold">Total Amount</p>
        <p className="text-3xl font-bold">0</p>
      </div>
      <Banknote className="w-8 h-8 opacity-60" />
    </div>
  </div>

  <div className="bg-[#F2F0EB] text-[#D92818] rounded-lg p-6 shadow-[0px_2px_18px_rgba(45,45,45,0.1)]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-lg font-semibold">Total Paid Amount</p>
        <p className="text-3xl font-bold">0</p>
      </div>
      <CreditCard className="w-8 h-8 opacity-60" />
    </div>
  </div>

  <div className="bg-[#F2F0EB] text-[#D92818] rounded-lg p-6 shadow-[0px_2px_18px_rgba(45,45,45,0.1)]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-lg font-semibold">Total Pending Amount</p>
        <p className="text-3xl font-bold">0</p>
      </div>
      <Clock className="w-8 h-8 opacity-60" />
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
