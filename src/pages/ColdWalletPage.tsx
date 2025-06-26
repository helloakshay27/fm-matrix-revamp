
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReferSomeoneDialog } from '@/components/ReferSomeoneDialog';

export const ColdWalletPage = () => {
  const [isReferDialogOpen, setIsReferDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');

  const loyaltyPoints = 99500;
  const earnedPoints = 99500;
  const redeemedPoints = 0;
  const progressPercentage = (loyaltyPoints / 100000) * 100;

  // Sample transaction data
  const transactions = [
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 500 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 5000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 7000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 10000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 10000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 5000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 1000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 5000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 1000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 3000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 10000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 5000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 7000 },
    { date: '6/24/2025', type: 'Credit', name: 'points credit', points: 10000 },
    { date: '6/25/2025', type: 'Credit', name: 'points credit', points: 10000 },
  ];

  // Sample referral data
  const referrals = [
    { date: '6/25/2025', name: 'Vinayak', status: 'Open', phone: '8983837389' },
    { date: '6/24/2025', name: 'Vinayak', status: 'cold', phone: '9999999999' },
    { date: '6/24/2025', name: 'Vinayak', status: 'cold', phone: '9999999999' },
    { date: '6/24/2025', name: 'Vinayak', status: 'cold', phone: '9999999999' },
    { date: '6/24/2025', name: 'Test', status: 'Open', phone: '8762345678' },
    { date: '6/24/2025', name: 'mahi', status: 'Warm', phone: '9898989558' },
    { date: '6/24/2025', name: 'Dinesh T', status: 'Open', phone: '2827628289' },
    { date: '6/24/2025', name: 'Vinayak Test Refer', status: 'Open', phone: '9283729829' },
    { date: '6/24/2025', name: 'Vinayak T', status: 'Open', phone: '8664435789' },
    { date: '6/24/2025', name: 'Vinayak', status: 'Open', phone: '8712345678' },
    { date: '6/19/2025', name: 'Tester 1', status: 'Open', phone: '9282828282' },
    { date: '6/19/2025', name: 'mahi', status: 'Warm', phone: '9898989558' },
    { date: '6/19/2025', name: 'Tester 1', status: 'Open', phone: '9876534567' },
  ];

  const renderTransactionsTable = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-pink-100">
            <TableHead className="font-semibold text-gray-700">DATE</TableHead>
            <TableHead className="font-semibold text-gray-700">TRANSACTION TYPE</TableHead>
            <TableHead className="font-semibold text-gray-700">TRANSACTION NAME</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">EARNED POINTS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium">{transaction.date}</TableCell>
              <TableCell className="text-blue-600">{transaction.type}</TableCell>
              <TableCell className="text-blue-600">{transaction.name}</TableCell>
              <TableCell className="text-right font-medium">{transaction.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderReferralsTable = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-pink-100">
            <TableHead className="font-semibold text-gray-700">DATE</TableHead>
            <TableHead className="font-semibold text-gray-700">NAME REFERRED</TableHead>
            <TableHead className="font-semibold text-gray-700">STATUS</TableHead>
            <TableHead className="font-semibold text-gray-700">PHONE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium">{referral.date}</TableCell>
              <TableCell>{referral.name}</TableCell>
              <TableCell>
                <span className={`text-sm ${
                  referral.status === 'Open' ? 'text-blue-600' : 
                  referral.status === 'Warm' ? 'text-orange-600' : 
                  'text-gray-600'
                }`}>
                  {referral.status}
                </span>
              </TableCell>
              <TableCell>{referral.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-gray-600">You are on the </span>
          <span className="text-orange-500 font-semibold">Silver</span>
          <span className="text-gray-600"> Tier!</span>
        </div>
        <Button 
          onClick={() => setIsReferDialogOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-6 py-2"
        >
          REFER & EARN
        </Button>
      </div>

      {/* Progress Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              YOU NEED <span className="font-bold">100000</span> POINTS TO UPGRADE ON NEXT TIER!
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{loyaltyPoints.toLocaleString()}</span>
              <span className="text-gray-500">/ 100000</span>
              <Button 
                variant="outline" 
                className="bg-gray-800 text-white hover:bg-gray-700 border-gray-800"
              >
                VIEW TIER BENEFITS
              </Button>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Bronze</span>
              <span className="text-orange-500 font-medium">Silver</span>
              <span>Gold</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-orange-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">♦</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">Loyalty Points</p>
            <p className="text-2xl font-bold">{loyaltyPoints.toLocaleString()} Points</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">♦</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">Earned Points</p>
            <p className="text-2xl font-bold">{earnedPoints.toLocaleString()} Points</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">♦</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">Redeemed Points</p>
            <p className="text-2xl font-bold">{redeemedPoints} Points</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs - Only My Transactions and My Referrals */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-white rounded-full p-1 shadow-sm">
          <Button 
            onClick={() => setActiveTab('transactions')}
            className={`rounded-full px-8 py-2 ${
              activeTab === 'transactions' 
                ? 'bg-[#C72030] hover:bg-[#C72030]/90 text-white' 
                : 'bg-transparent text-gray-600 hover:text-gray-800 hover:bg-transparent'
            }`}
          >
            My Transactions
          </Button>
          <Button 
            onClick={() => setActiveTab('referrals')}
            className={`rounded-full px-8 py-2 ${
              activeTab === 'referrals' 
                ? 'bg-[#C72030] hover:bg-[#C72030]/90 text-white' 
                : 'bg-transparent text-gray-600 hover:text-gray-800 hover:bg-transparent'
            }`}
          >
            My Referrals
          </Button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'transactions' && renderTransactionsTable()}
      {activeTab === 'referrals' && renderReferralsTable()}

      {/* Refer Someone Dialog */}
      <ReferSomeoneDialog
        open={isReferDialogOpen}
        onOpenChange={setIsReferDialogOpen}
      />
    </div>
  );
};
