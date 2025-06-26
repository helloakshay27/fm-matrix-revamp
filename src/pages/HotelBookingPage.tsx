
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Calendar } from 'lucide-react';

export const HotelBookingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    month: '',
    year: '',
    securityCode: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = () => {
    console.log('Booking confirmed:', formData);
    // Add booking confirmation logic here
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/vas/hotels/details')}
        className="mb-4 p-0 hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Hotel Details
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content - Booking Form */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Secure Booking</h1>

          {/* Refund Policy */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900">Fully refundable before Sat, 7 Jun, 18:00 (property local time)</div>
                  <div className="text-sm text-blue-700">You can change or cancel this stay for a full refund if plans change. Because flexibility matters.</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guest Information */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Who's checking in?</h2>
              <div className="text-sm text-gray-600 mb-4">Room 1: 2 Adults 2 Double Beds Non-smoking</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium mb-1 block">First name*</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium mb-1 block">Last name*</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="email" className="text-sm font-medium mb-1 block">Email address*</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country" className="text-sm font-medium mb-1 block">Country/Region*</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium mb-1 block">Phone number*</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Payment method</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName" className="text-sm font-medium mb-1 block">Name on Card*</Label>
                  <Input
                    id="cardName"
                    placeholder="Name on Card*"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber" className="text-sm font-medium mb-1 block">Debit/Credit card number*</Label>
                  <Input
                    id="cardNumber"
                    placeholder="Debit/Credit card number*"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-1 block">Month</Label>
                    <Select value={formData.month} onValueChange={(value) => handleInputChange('month', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1 block">Year</Label>
                    <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={2024 + i} value={String(2024 + i)}>
                            {2024 + i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="securityCode" className="text-sm font-medium mb-1 block">Security code*</Label>
                    <Input
                      id="securityCode"
                      placeholder="Security code*"
                      value={formData.securityCode}
                      onChange={(e) => handleInputChange('securityCode', e.target.value)}
                      className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-0">
              {/* Hotel Image */}
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Coastal Gateway Resort"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">Outpost</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-semibold rounded">3.8</span>
                  <span className="text-sm text-gray-600">Excellent (10 reviews)</span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div>1 Room: Deluxe Quadruple Room</div>
                  <div>Check-in: Sat, 14 Jun</div>
                  <div>Check-out: Sun, 15 Jun</div>
                  <div>1-night stay</div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Price Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>1 room x 1 night</span>
                      <span>₹10,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span>₹810.00</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>₹10,810.00</span>
                    </div>
                  </div>

                  <Button variant="link" className="text-orange-500 p-0 h-auto mt-2 text-sm">
                    Use a coupon credit or promotion code
                  </Button>

                  <Button 
                    onClick={handleConfirmBooking}
                    className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white py-3"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
