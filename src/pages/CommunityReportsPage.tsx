import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommunityReportsTab from "@/components/community/CommunityReportsTab";

const CommunityReportsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="p-0 hover:bg-transparent"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </div>
            </div>

            <CommunityReportsTab communityId={id} />
        </div>
    );
};

export default CommunityReportsPage;
