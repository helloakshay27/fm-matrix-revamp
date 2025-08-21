import React, { useState, useEffect } from 'react';
import { useLayout } from '../contexts/LayoutContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Edit2 } from 'lucide-react';

export const CrmCustomersPage = () => {
  const { setCurrentSection } = useLayout();

  useEffect(() => {
    setCurrentSection('CRM');
  }, [setCurrentSection]);

  // Sample customer data
  const customerData = {
    customerName: 'HSBC',
    customerEmail: 'hsbc@gmail.com',
    companyCode: '',
    colorCode: '#FFD700',
    mobileNumber: '1234561231',
    organizationCode: '',
    customerCode: ''
  };

  // Sample lease data
  const leaseData = {
    leaseId: '85',
    leaseStartDate: '2024-07-01',
    leaseEndDate: '2024-09-29',
    freeParking: '10',
    paidParking: '20'
  };

  // Sample wallet transactions
  const walletTransactions = [
    {
      transactionId: '1220',
      bookingId: '',
      facilityName: '',
      personName: '',
      transactionDate: 'June 30, 2025',
      transactionTime: '23:50:23',
      amount: '100.0',
      transactionType: 'Debit',
      ccAvenueId: ''
    },
    {
      transactionId: '1212',
      bookingId: '',
      facilityName: '',
      personName: 'Vinayak Mane',
      transactionDate: 'June 04, 2025',
      transactionTime: '11:43:53',
      amount: '100.0',
      transactionType: 'Credit',
      ccAvenueId: ''
    },
    {
      transactionId: '1203',
      bookingId: '',
      facilityName: '',
      personName: '',
      transactionDate: 'June 03, 2025',
      transactionTime: '23:50:22',
      amount: '101.02',
      transactionType: 'Debit',
      ccAvenueId: ''
    },
    {
      transactionId: '1201',
      bookingId: '',
      facilityName: '',
      personName: 'Vinayak Mane',
      transactionDate: 'June 03, 2025',
      transactionTime: '17:35:31',
      amount: '100.0',
      transactionType: 'Credit',
      ccAvenueId: ''
    },
    {
      transactionId: '1199',
      bookingId: '',
      facilityName: '',
      personName: 'Vinayak testwallet guest',
      transactionDate: 'June 03, 2025',
      transactionTime: '14:54:09',
      amount: '1.02',
      transactionType: 'Credit',
      ccAvenueId: '11379116850'
    }
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-800 mb-1">Customer</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Customer</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Wallet Balance: 0 Points</span>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm">
            Top-Up Wallet
          </Button>
        </div>
      </div>

      {/* Edit Button */}
      <div className="mb-6">
        <Button variant="outline" size="sm" className="p-2">
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">Customer Name</label>
              <span className="text-sm">:</span>
              <span className="text-sm text-gray-900">{customerData.customerName}</span>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">Customer Email</label>
              <span className="text-sm">:</span>
              <span className="text-sm text-gray-900">{customerData.customerEmail}</span>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">Company Code</label>
              <span className="text-sm">:</span>
              <span className="text-sm text-gray-900">{customerData.companyCode}</span>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">Color Code</label>
              <span className="text-sm">:</span>
              <div 
                className="w-6 h-6 rounded border border-gray-300" 
                style={{ backgroundColor: customerData.colorCode }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">Mobile Number</label>
              <span className="text-sm">:</span>
              <span className="text-sm text-gray-900">{customerData.mobileNumber}</span>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">Organization Code</label>
              <span className="text-sm">:</span>
              <span className="text-sm text-gray-900">{customerData.organizationCode}</span>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">Customer Code</label>
              <span className="text-sm">:</span>
              <span className="text-sm text-gray-900">{customerData.customerCode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lease Information Table */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-100">
              <TableHead className="font-medium text-gray-700">Lease Id</TableHead>
              <TableHead className="font-medium text-gray-700">Lease Start Date</TableHead>
              <TableHead className="font-medium text-gray-700">Lease End Date</TableHead>
              <TableHead className="font-medium text-gray-700">Free Parking</TableHead>
              <TableHead className="font-medium text-gray-700">Paid Parking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-sm">{leaseData.leaseId}</TableCell>
              <TableCell className="text-sm">{leaseData.leaseStartDate}</TableCell>
              <TableCell className="text-sm">{leaseData.leaseEndDate}</TableCell>
              <TableCell className="text-sm">{leaseData.freeParking}</TableCell>
              <TableCell className="text-sm">{leaseData.paidParking}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Wallet Transactions */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Transactions</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-medium text-gray-700 text-sm">Transaction ID</TableHead>
                <TableHead className="font-medium text-gray-700 text-sm">Booking Id</TableHead>
                <TableHead className="font-medium text-gray-700 text-sm">Facility Name</TableHead>
                <TableHead className="font-medium text-gray-700 text-sm">Person Name</TableHead>
                <TableHead className="font-medium text-gray-700 text-sm">Transaction Date</TableHead>
                <TableHead className="font-medium text-gray-700 text-sm">Transaction Time</TableHead>
                <TableHead className="font-medium text-gray-700 text-sm">Amount</TableHead>
                <TableHead className="font-medium text-gray-700 text-sm">Transaction Type</TableHead>
                <TableHead className="font-medium text-gray-700 text-sm">Transaction ID (CC Avenue ID)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walletTransactions.map((transaction, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="text-sm">{transaction.transactionId}</TableCell>
                  <TableCell className="text-sm">{transaction.bookingId}</TableCell>
                  <TableCell className="text-sm">{transaction.facilityName}</TableCell>
                  <TableCell className="text-sm">{transaction.personName}</TableCell>
                  <TableCell className="text-sm">{transaction.transactionDate}</TableCell>
                  <TableCell className="text-sm">{transaction.transactionTime}</TableCell>
                  <TableCell className="text-sm">{transaction.amount}</TableCell>
                  <TableCell className="text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.transactionType === 'Credit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.transactionType}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{transaction.ccAvenueId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};