
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Star } from 'lucide-react';

export const HotelBookingPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    securityCode: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = () => {
    console.log('Booking confirmed:', formData);
    // Handle booking confirmation
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Secure Booking</h1>

        {/* Refund Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <div className="font-medium">Fully refundable before Sat, 7 Jun, 18:00 (property local time)</div>
                <div className="text-sm text-gray-600">You can change or cancel this stay for a full refund if plans change. Because flexibility matters.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Who's checking in?</h2>
                <p className="text-gray-600 mb-6">Room 1: 2 Adults 2 Double Beds Non-smoking</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

                <div className="mb-4">
                  <Label htmlFor="email">Email address*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <h2 className="text-xl font-semibold mb-4">Payment method</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Name on Card*</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
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
                      <Label>Month</Label>
                      <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange('expiryMonth', value)}>
                        <SelectTrigger className="mt-1">
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
                      <Label>Year</Label>
                      <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange('expiryYear', value)}>
                        <SelectTrigger className="mt-1">
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
                      <Label htmlFor="securityCode">Security code*</Label>
                      <Input
                        id="securityCode"
                        value={formData.securityCode}
                        onChange={(e) => handleInputChange('securityCode', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Summary Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Hotel Summary */}
              <Card>
                <CardContent className="p-0">
                  <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    alt="Hotel"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Outpost</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm">3.8</span>
                      <span className="text-sm text-gray-600">Excellent (10 reviews)</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>1 Room: Deluxe Quadruple Room</p>
                      <p>Check-in: Sat, 14 Jun</p>
                      <p>Check-out: Sun, 15 Jun</p>
                      <p>1-night stay</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Details */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Price Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>1 room x 1 night</span>
                      <span>{localStorage.getItem('currency')}10,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span>{localStorage.getItem('currency')}810.00</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{localStorage.getItem('currency')}10810.00</span>
                    </div>
                  </div>
                  <Button variant="link" className="text-orange-500 p-0 mt-2">
                    Use a coupon credit or promotion code
                  </Button>
                  <Button
                    onClick={handleConfirmBooking}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white mt-4 py-3"
                  >
                    Confirm Booking
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
