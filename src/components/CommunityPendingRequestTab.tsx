import { useState } from "react";
import { Tabs, TabsContent } from './ui/tabs'
import { AssetTabsList, AssetTabsTrigger } from './common/AssetTabBar'
import CommunityWaitingList from "./CommunityWaitingList";
import CommunityApprovedList from "./CommunityApprovedList";
import CommunityPendingList from "./CommunityPendingList";

const CommunityPendingRequestTab = ({ communityId }: { communityId: string }) => {
    const [activeTab, setActiveTab] = useState("waitingList");

    return (
        <div className=" bg-white min-h-screen">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <AssetTabsList className="grid grid-cols-3 mb-6">
                    <AssetTabsTrigger value="waitingList">Waiting List</AssetTabsTrigger>
                    <AssetTabsTrigger value="approved">Approved</AssetTabsTrigger>
                    <AssetTabsTrigger value="pending">Pending</AssetTabsTrigger>
                </AssetTabsList>

                <TabsContent value="waitingList">
                    <CommunityWaitingList communityId={communityId} />
                </TabsContent>

                <TabsContent value="approved">
                    <CommunityApprovedList communityId={communityId} />
                </TabsContent>

                <TabsContent value="pending">
                    <CommunityPendingList communityId={communityId} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default CommunityPendingRequestTab