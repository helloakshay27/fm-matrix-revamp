import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommunityDetailsTab from "@/components/community/CommunityDetailsTab";
import CommunityFeedTab from "@/components/community/CommunityFeedTab";
import CommunityReportsTab from "@/components/community/CommunityReportsTab";
import CommunityEventsTab from "@/components/community/CommunityEventsTab";

const CommunityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("details");
    const [communityName, setCommunityName] = useState("")

    return (
        <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
            {/* <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="p-0 hover:bg-transparent"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div> */}

            <h1 className="font-medium text-[15px] text-[rgba(26,26,26,0.5)] mb-4"><Link to={'/pulse/community'}>Community</Link> <span className="font-normal">{">"}</span> Community Details</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border">
                    <TabsTrigger value="details" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Community Details</TabsTrigger>
                    <TabsTrigger value="feed" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Community Feed</TabsTrigger>
                    <TabsTrigger value="reports" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Reports</TabsTrigger>
                    <TabsTrigger value="events" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Shared</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <CommunityDetailsTab communityId={id} setCommunityName={setCommunityName} />
                </TabsContent>

                <TabsContent value="feed">
                    <CommunityFeedTab communityId={id} communityName={communityName} />
                </TabsContent>

                <TabsContent value="reports">
                    <CommunityReportsTab communityId={id} />
                </TabsContent>

                <TabsContent value="events">
                    <CommunityEventsTab communityId={id} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CommunityDetails;