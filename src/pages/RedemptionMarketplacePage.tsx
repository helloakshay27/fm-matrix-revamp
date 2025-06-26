import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReferSomeoneDialog } from '@/components/ReferSomeoneDialog';

export const RedemptionMarketplacePage = () => {
  const [isReferDialogOpen, setIsReferDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('redemptions');
  const navigate = useNavigate();

  const loyaltyPoints = 99500;
  const earnedPoints = 99500;
  const redeemedPoints = 0;
  const progressPercentage = (loyaltyPoints / 100000) * 100;

  const handleViewReward = (service: string) => {
    if (service === 'hotels') {
      navigate('/vas/hotels');
    }
  };

  const handleViewDiscount = (service: string) => {
    // All discount buttons redirect to hotels page
    navigate('/vas/hotels');
  };

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

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-white rounded-full p-1 shadow-sm">
          <Button 
            onClick={() => setActiveTab('redemptions')}
            className={`rounded-full px-8 py-2 ${
              activeTab === 'redemptions' 
                ? 'bg-[#C72030] hover:bg-[#C72030]/90 text-white' 
                : 'bg-transparent text-gray-600 hover:text-gray-800 hover:bg-transparent'
            }`}
          >
            My Redemptions
          </Button>
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
      {activeTab === 'redemptions' && (
        /* Service Cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hotels Card */}
          <Card className="relative overflow-hidden h-64">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')`
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
              <div>
                <h3 className="text-xl font-bold mb-2">Hotels</h3>
                <p className="text-sm opacity-90">Exclusive deals unlocked</p>
              </div>
              <div className="flex justify-between items-end">
                <Button 
                  onClick={() => handleViewReward('hotels')}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  View Reward
                </Button>
                <div className="bg-orange-500 text-white px-3 py-1 text-xs font-bold transform rotate-12">
                  SAVE 50%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* F & B Card */}
          <Card className="relative overflow-hidden h-64">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1481&q=80')`
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
              <div>
                <h3 className="text-xl font-bold mb-2">F & B</h3>
                <p className="text-sm opacity-90">Special discounts available</p>
              </div>
              <Button 
                onClick={() => handleViewDiscount('fnb')}
                className="bg-orange-500 hover:bg-orange-600 text-white self-start"
              >
                View Discount
              </Button>
            </CardContent>
          </Card>

          {/* Tickets Card */}
          <Card className="relative overflow-hidden h-64">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80')`
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
              <div>
                <h3 className="text-xl font-bold mb-2">Tickets</h3>
                <p className="text-sm opacity-90">Journey for Less</p>
              </div>
              <Button 
                onClick={() => handleViewDiscount('tickets')}
                className="bg-orange-500 hover:bg-orange-600 text-white self-start"
              >
                View Discount
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

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
