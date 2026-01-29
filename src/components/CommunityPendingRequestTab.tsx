import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import CommunityWaitingList from "./CommunityWaitingList";
import CommunityApprovedList from "./CommunityApprovedList";
import CommunityPendingList from "./CommunityPendingList";

const CommunityPendingRequestTab = ({ communityId }: { communityId: string }) => {
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
                    <CommunityWaitingList />
                </TabsContent>

                <TabsContent value="approved">
                    <CommunityApprovedList />
                </TabsContent>

                <TabsContent value="pending">
                    <CommunityPendingList communityId={communityId} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default CommunityPendingRequestTab