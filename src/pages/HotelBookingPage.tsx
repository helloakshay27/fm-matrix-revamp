
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

export const HotelBookingPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phone: '',
    nameOnCard: '',
    cardNumber: '',
    month: '',
    year: '',
    securityCode: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmBooking = () => {
    console.log('Booking confirmed:', formData);
    // Handle booking confirmation
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Secure Booking</h1>
        
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="col-span-2 space-y-6">
            {/* Refund Policy */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Calendar className="h-6 w-6 text-[#C72030] mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Fully refundable before Sat, 7 Jun, 18:00 (property local time)</h3>
                    <p className="text-gray-600 text-sm">You can change or cancel this stay for a full refund if plans change. Because flexibility matters.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Who's checking in?</h3>
                <p className="text-gray-600 mb-6">Room 1: 2 Adults 2 Double Beds Non-smoking</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name*</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name*</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="email">Email address*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="country">Country/Region*</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone number*</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment method</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nameOnCard">Name on Card*</Label>
                    <Input
                      id="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Debit/Credit card number*</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="month">Month</Label>
                      <select
                        id="month"
                        value={formData.month}
                        onChange={(e) => handleInputChange('month', e.target.value)}
                        className="w-full mt-1 h-10 px-3 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <select
                        id="year"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className="w-full mt-1 h-10 px-3 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={2024 + i} value={2024 + i}>
                            {2024 + i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="securityCode">Security code*</Label>
                      <Input
                        id="securityCode"
                        value={formData.securityCode}
                        onChange={(e) => handleInputChange('securityCode', e.target.value)}
                        className="mt-1"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                {/* Hotel Image */}
                <div className="mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    alt="Hotel"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Hotel Info */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Outpost</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-orange-100 text-orange-800">3.8</Badge>
                    <span className="text-sm text-gray-600">Excellent (10 reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">1 Room: Deluxe Quadruple Room</p>
                  <p className="text-sm text-gray-600">Check-in: Sat, 14 Jun</p>
                  <p className="text-sm text-gray-600">Check-out: Sun, 15 Jun</p>
                  <p className="text-sm text-gray-600">1-night stay</p>
                </div>

                {/* Price Details */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Price Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>1 room x 1 night</span>
                      <span>₹10,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span>₹810.00</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹10810.00</span>
                    </div>
                  </div>
                  
                  <Button variant="link" className="text-[#C72030] p-0 mt-2">
                    Use a coupon credit or promotion code
                  </Button>
                  
                  <Button 
                    onClick={handleConfirmBooking}
                    className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
