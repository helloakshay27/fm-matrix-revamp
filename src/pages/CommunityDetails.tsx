import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommunityDetailsTab from "@/components/community/CommunityDetailsTab";
import CommunityFeedTab from "@/components/community/CommunityFeedTab";
import CommunityReportsTab from "@/components/community/CommunityReportsTab";
import CommunityEventsTab from "@/components/community/CommunityEventsTab";
import CommunityPendingRequestTab from "@/components/CommunityPendingRequestTab";
import { useClubManagementEvents } from "@/components/PostHogClubManagementEvents";
import { isCMContextActive } from "@/utils/posthogHelpers";

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
    const { detailViewed } = useClubManagementEvents();
    const viewedRef = useRef(false);

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

    useEffect(() => {
        if (isCMContextActive() && id && !viewedRef.current) {
            viewedRef.current = true;
            detailViewed("Community", id, "community_details");
        }
    }, [id, detailViewed]);

    return (
        <div className="p-6 mx-auto bg-white min-h-screen">
            <p className="text-sm text-gray-500 mb-1">
                <Link to="/pulse/community" className="hover:text-brand transition-colors">Community</Link>
                <span className="mx-1.5">/</span>
                <span className="text-gray-700">Community Details</span>
            </p>
            <h1 className="text-2xl font-semibold mb-4">Community Details</h1>

            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-5 mb-6 bg-white border border-gray-200 rounded-xl">
                    <TabsTrigger
                        value="details"
                        className="data-[state=active]:bg-brand-light data-[state=active]:text-brand"
                    >
                        Community Details
                    </TabsTrigger>

                    <TabsTrigger
                        value="feed"
                        className="data-[state=active]:bg-brand-light data-[state=active]:text-brand"
                    >
                        Community Feed
                    </TabsTrigger>

                    <TabsTrigger
                        value="reports"
                        className="data-[state=active]:bg-brand-light data-[state=active]:text-brand"
                    >
                        Reports
                    </TabsTrigger>

                    <TabsTrigger
                        value="events"
                        className="data-[state=active]:bg-brand-light data-[state=active]:text-brand"
                    >
                        Shared
                    </TabsTrigger>

                    <TabsTrigger
                        value="pending_requests"
                        className="data-[state=active]:bg-brand-light data-[state=active]:text-brand"
                    >
                        Pending Request
                    </TabsTrigger>
                </TabsList>

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