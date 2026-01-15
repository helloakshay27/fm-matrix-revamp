import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventDetailsTab } from '@/components/EventDetailsTab';
import EventParticipantsTab from '@/components/EventParticipantsTab';


export const CRMEventDetailsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white border">
          <TabsTrigger value="details" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Event Details</TabsTrigger>
          <TabsTrigger value="feed" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Participants Details</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <EventDetailsTab />
        </TabsContent>

        <TabsContent value="feed">
          <EventParticipantsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}