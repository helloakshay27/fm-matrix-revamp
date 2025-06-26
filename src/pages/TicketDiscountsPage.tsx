
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Search } from 'lucide-react';

export const TicketDiscountsPage = () => {
  const events = [
    {
      id: 1,
      name: "Concert at Madison Square",
      discount: "30% OFF",
      date: "Dec 15, 2024",
      venue: "Madison Square Garden",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 2,
      name: "Broadway Musical Show",
      discount: "25% OFF",
      date: "Dec 20, 2024",
      venue: "Broadway Theater",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 3,
      name: "Comedy Night Show",
      discount: "40% OFF",
      date: "Dec 25, 2024",
      venue: "Comedy Club Downtown",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  const weekendEvents = [
    {
      id: 4,
      name: "Jazz Festival",
      discount: "35% OFF",
      date: "Dec 28, 2024",
      venue: "Central Park",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 5,
      name: "Sports Event",
      discount: "20% OFF",
      date: "Dec 30, 2024",
      venue: "Sports Arena",
      image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 6,
      name: "Art Exhibition",
      discount: "45% OFF",
      date: "Jan 2, 2025",
      venue: "Modern Art Museum",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
              <Input 
                placeholder="Search events" 
                className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <Input 
                  placeholder="mm/dd/yyyy" 
                  className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030] pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <Input 
                  placeholder="Select location" 
                  className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030] pr-10"
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Event category" 
                  className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
                />
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

      {/* Popular Events Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-[#C72030] text-white px-3 py-1 text-sm font-bold transform rotate-12">
                  {event.discount}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                <p className="text-gray-600 text-sm mb-1">{event.date}</p>
                <p className="text-gray-600 text-sm mb-3">{event.venue}</p>
                <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white w-full">
                  Buy Tickets
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekend Events Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Weekend Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weekendEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-[#C72030] text-white px-3 py-1 text-sm font-bold transform rotate-12">
                  {event.discount}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                <p className="text-gray-600 text-sm mb-1">{event.date}</p>
                <p className="text-gray-600 text-sm mb-3">{event.venue}</p>
                <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white w-full">
                  Buy Tickets
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom URL indicator */}
      <div className="mt-8 text-xs text-gray-500 text-center">
        https://keeclub.lockated.com/dashboard/ticket-deals
      </div>
    </div>
  );
};
