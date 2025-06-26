
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Users, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const TicketDiscountsPage = () => {
  const navigate = useNavigate();
  const [eventDate, setEventDate] = useState<Date>();
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState('');

  const events = [
    {
      id: 1,
      name: "Concert at Marina Bay",
      discount: "25% off on all tickets",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      name: "Art Exhibition",
      discount: "Buy 2 Get 1 Free",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 3,
      name: "Theater Show",
      discount: "30% off weekend shows",
      image: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  const weekendEvents = [
    {
      id: 4,
      name: "Comedy Night",
      discount: "50% off group bookings",
      image: "https://images.unsplash.com/photo-1594736797933-d0b22d5e5c1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 5,
      name: "Sports Event",
      discount: "Early bird 40% off",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 6,
      name: "Music Festival",
      discount: "VIP upgrade free",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  const handleEventClick = (eventId: number) => {
    navigate('/vas/tickets/details');
  };

  const handleSearch = () => {
    console.log('Searching with:', { destination, eventDate, guests });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What</label>
              <Input 
                placeholder="Search events" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">When</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]",
                      !eventDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP") : <span>mm/dd/yyyy</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Where</label>
              <Input 
                placeholder="Enter location" 
                className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tickets</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input 
                    placeholder="Number of tickets" 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030] pr-10"
                  />
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button 
                  size="icon"
                  onClick={handleSearch}
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
            <Card 
              key={event.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                <p className="text-[#C72030] font-medium">{event.discount}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available this weekend Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Available this weekend</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weekendEvents.map((event) => (
            <Card 
              key={event.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                <p className="text-[#C72030] font-medium">{event.discount}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom URL indicator */}
      <div className="mt-8 text-xs text-gray-500 text-center">
        https://keeclub.lockated.com/dashboard/ticket-discounts
      </div>
    </div>
  );
};
