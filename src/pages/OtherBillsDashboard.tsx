
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

export const OtherBillsDashboard = () => {
  const navigate = useNavigate();

  // Sample data - empty as shown in the image
  const billsData: any[] = [];

  const statsCards = [
    { label: "Total Bills", value: "0", color: "bg-purple-500", icon: "💰" },
    { label: "Total Amount", value: "₹ 0", color: "bg-orange-400", icon: "💼" },
    { label: "Total Paid Amount", value: "₹ 0", color: "bg-orange-500", icon: "⚙️" },
    { label: "Total Pending Amount", value: "₹ 0", color: "bg-red-500", icon: "📊" }
  ];

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">BILL LIST</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card, index) => (
          <div key={index} className={`${card.color} text-white p-4 rounded-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{card.value}</p>
                <p className="text-sm opacity-90">{card.label}</p>
              </div>
              <div className="text-2xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => navigate('/finance/other-bills/add')}
        >
          + Add
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Deduction</TableHead>
              <TableHead className="font-semibold">TDS(%)</TableHead>
              <TableHead className="font-semibold">TDS Amount</TableHead>
              <TableHead className="font-semibold">Retention(%)</TableHead>
              <TableHead className="font-semibold">Retention Amount</TableHead>
              <TableHead className="font-semibold">Payable Amount</TableHead>
              <TableHead className="font-semibold">Bill Date</TableHead>
              <TableHead className="font-semibold">Invoice Number</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billsData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} className="text-center py-8 text-gray-500">
                  No bills found
                </TableCell>
              </TableRow>
            ) : (
              billsData.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell>{item.action}</TableCell>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.deduction}</TableCell>
                  <TableCell>{item.tdsPercent}</TableCell>
                  <TableCell>{item.tdsAmount}</TableCell>
                  <TableCell>{item.retentionPercent}</TableCell>
                  <TableCell>{item.retentionAmount}</TableCell>
                  <TableCell>{item.payableAmount}</TableCell>
                  <TableCell>{item.billDate}</TableCell>
                  <TableCell>{item.invoiceNumber}</TableCell>
                  <TableCell>{item.payment}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
