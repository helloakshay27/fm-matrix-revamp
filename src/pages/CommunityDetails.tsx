import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AssetTabsList, AssetTabsTrigger } from "@/components/common/AssetTabBar";
import CommunityDetailsTab from "@/components/community/CommunityDetailsTab";
import CommunityFeedTab from "@/components/community/CommunityFeedTab";
import CommunityReportsTab from "@/components/community/CommunityReportsTab";
import CommunityEventsTab from "@/components/community/CommunityEventsTab";
import CommunityPendingRequestTab from "@/components/CommunityPendingRequestTab";

const ALLOWED_TABS = [
    "details",
    "feed",
    "reports",
    "events",
    "pending_requests",
];

const CommunityDetails = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // 🔑 Read tab from URL (fallback to "details")
    const tabFromUrl = searchParams.get("tab");
    const activeTab = ALLOWED_TABS.includes(tabFromUrl || "")
        ? tabFromUrl!
        : "details";

    // 🔁 Update URL when tab changes
    const handleTabChange = (tab: string) => {
        setSearchParams({ tab });
    };

    const [communityName, setCommunityName] = useState("");
    const [communityImg, setCommunityImg] = useState("");

    return (
        <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
            <h1 className="font-medium text-[15px] text-[rgba(26,26,26,0.5)] mb-4">
                <Link to="/pulse/community">Community</Link>{" "}
                <span className="font-normal">{">"}</span> Community Details
            </h1>

            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <AssetTabsList className="grid grid-cols-5 mb-6">
                    <AssetTabsTrigger
                        value="details"
                    >
                        Community Details
                    </AssetTabsTrigger>

                    <AssetTabsTrigger
                        value="feed"
                    >
                        Community Feed
                    </AssetTabsTrigger>

                    <AssetTabsTrigger
                        value="reports"
                    >
                        Reports
                    </AssetTabsTrigger>

                    <AssetTabsTrigger
                        value="events"
                    >
                        Shared
                    </AssetTabsTrigger>

                    <AssetTabsTrigger
                        value="pending_requests"
                    >
                        Pending Request
                    </AssetTabsTrigger>
                </AssetTabsList>

                <TabsContent value="details">
                    <CommunityDetailsTab
                        communityId={id}
                        setCommunityName={setCommunityName}
                        setCommunityImg={setCommunityImg}
                    />
                </TabsContent>

                <TabsContent value="feed">
                    <CommunityFeedTab
                        communityId={id}
                        communityName={communityName}
                        communityImg={communityImg}
                    />
                </TabsContent>

                <TabsContent value="reports">
                    <CommunityReportsTab communityId={id} />
                </TabsContent>

                <TabsContent value="events">
                    <CommunityEventsTab communityId={id} />
                </TabsContent>

                <TabsContent value="pending_requests">
                    <CommunityPendingRequestTab communityId={id} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CommunityDetails;