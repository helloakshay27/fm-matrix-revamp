import EventApprovedList from './EventApprovedList';
import EventPendingList from './EventPendingList';
import EventRejectedList from './EventRejectedList';
import EventWaitingList from './EventWaitingList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useState } from 'react'

const EventParticipantsTab = () => {
    const [activeTab, setActiveTab] = useState("waitingList");

    return (
        <div className=" bg-white min-h-screen">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full mb-6 bg-white border border-gray-200">
                    <TabsTrigger value="waitingList" className="group w-full flex items-center gap-2 data-[state=active]:bg-[#f5f4f0] data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Waiting List</TabsTrigger>
                    <TabsTrigger value="approved" className="group w-full flex items-center gap-2 data-[state=active]:bg-[#f5f4f0] data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Approved</TabsTrigger>
                    <TabsTrigger value="pending" className="group w-full flex items-center gap-2 data-[state=active]:bg-[#f5f4f0] data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Pending</TabsTrigger>
                    <TabsTrigger value="rejected" className="group w-full flex items-center gap-2 data-[state=active]:bg-[#f5f4f0] data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value="waitingList">
                    <EventWaitingList />
                </TabsContent>

                <TabsContent value="approved">
                    <EventApprovedList />
                </TabsContent>

                <TabsContent value="pending">
                    <EventPendingList />
                </TabsContent>

                <TabsContent value="rejected">
                    <EventRejectedList />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EventParticipantsTab