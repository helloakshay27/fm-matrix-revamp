
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Users, Search } from 'lucide-react';

export const HotelRewardsPage = () => {
  const hotels = [
    {
      id: 1,
      name: "Hotel Royal",
      price: "₹10,000 for 4 nights",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      name: "Hotel Royal",
      price: "₹10,000 for 4 nights",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 3,
      name: "Hotel Royal",
      price: "₹10,000 for 4 nights",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  const weekendHotels = [
    {
      id: 4,
      name: "Hotel Royal",
      price: "₹10,000 for 4 nights",
      image: "https://images.unsplash.com/photo-1559599238-12b7b4b01c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 5,
      name: "Hotel Royal",
      price: "₹10,000 for 4 nights",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 6,
      name: "Hotel Royal",
      price: "₹10,000 for 4 nights",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Where</label>
              <Input 
                placeholder="Search destinations" 
                className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check in</label>
              <div className="relative">
                <Input 
                  placeholder="mm/dd/yyyy" 
                  className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030] pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check out</label>
              <div className="relative">
                <Input 
                  placeholder="mm/dd/yyyy" 
                  className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030] pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Who</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input 
                    placeholder="Add guests" 
                    className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030] pr-10"
                  />
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button 
                  size="icon"
                  className="bg-gray-800 hover:bg-gray-700 text-white rounded-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Hotels Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                <p className="text-[#C72030] font-medium">{hotel.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available this weekend Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Available this weekend</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weekendHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                <p className="text-[#C72030] font-medium">{hotel.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom URL indicator */}
      <div className="mt-8 text-xs text-gray-500 text-center">
        https://keeclub.lockated.com/dashboard/hotel-details
      </div>
    </div>
  );
};
