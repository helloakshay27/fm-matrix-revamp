import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommunityDetailsTab from "@/components/community/CommunityDetailsTab";
import CommunityFeedTab from "@/components/community/CommunityFeedTab";
import CommunityReportsTab from "@/components/community/CommunityReportsTab";
import CommunityEventsTab from "@/components/community/CommunityEventsTab";
import CommunityPendingRequestTab from "@/components/CommunityPendingRequestTab";

const CommunityDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("details");
    const [communityName, setCommunityName] = useState("");
    const [communityImg, setCommunityImg] = useState("")

    console.log(communityImg)

    return (
        <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
            <h1 className="font-medium text-[15px] text-[rgba(26,26,26,0.5)] mb-4">
                <Link to={"/pulse/community"}>Community</Link>{" "}
                <span className="font-normal">{">"}</span> Community Details
            </h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6 bg-white border">
                    <TabsTrigger
                        value="details"
                        className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
                    >
                        Community Details
                    </TabsTrigger>
                    <TabsTrigger
                        value="feed"
                        className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
                    >
                        Community Feed
                    </TabsTrigger>
                    <TabsTrigger
                        value="reports"
                        className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
                    >
                        Reports
                    </TabsTrigger>
                    <TabsTrigger
                        value="events"
                        className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
                    >
                        Shared
                    </TabsTrigger>
                    <TabsTrigger
                        value="pending_requests"
                        className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
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
                    <CommunityFeedTab communityId={id} communityName={communityName} communityImg={communityImg} />
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
