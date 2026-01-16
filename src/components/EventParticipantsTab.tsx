import EventApprovedList from './EventApprovedList';
import EventPendingList from './EventPendingList';
import EventWaitingList from './EventWaitingList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useState } from 'react'

const EventParticipantsTab = () => {
    const [activeTab, setActiveTab] = useState("waitingList");



    return (
        <div className=" bg-white min-h-screen">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-white border">
                    <TabsTrigger value="waitingList" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Waiting List</TabsTrigger>
                    <TabsTrigger value="approved" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Approved</TabsTrigger>
                    <TabsTrigger value="pending" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Pending</TabsTrigger>
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
            </Tabs>
        </div>
    )
}

export default EventParticipantsTab