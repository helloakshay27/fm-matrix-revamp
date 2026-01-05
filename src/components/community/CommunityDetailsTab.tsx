import { useState, useEffect } from "react";
import { FileText, Eye, Pencil } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface CommunityDetailsTabProps {
    communityId?: string;
}

const CommunityDetailsTab = ({ communityId }: CommunityDetailsTabProps) => {
    const [isActive, setIsActive] = useState(true);
    const [communityData, setCommunityData] = useState({
        name: "Monday Haters",
        description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=60",
        createdOn: "13 October 2025",
        members: 234,
        createdBy: "Hamza"
    });

    const [members, setMembers] = useState([
        {
            id: 1,
            accessCardNumber: "54647",
            name: "Hamza",
            mobileNumber: "+91 1234567890",
            email: "hamza.quas@lockated.com",
            gender: "Male",
            organisation: "Lockated"
        },
        {
            id: 2,
            accessCardNumber: "54647",
            name: "Shahab",
            mobileNumber: "+91 1234567890",
            email: "hamza.quas@lockated.com",
            gender: "Male",
            organisation: "Lockated"
        },
        {
            id: 3,
            accessCardNumber: "54647",
            name: "Yukta",
            mobileNumber: "+91 1234567890",
            email: "hamza.quas@lockated.com",
            gender: "Female",
            organisation: "Lockated"
        }
    ]);

    const memberColumns: ColumnConfig[] = [
        {
            key: 'accessCardNumber',
            label: 'Access card Number',
            sortable: true,
            draggable: true
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            draggable: true
        },
        {
            key: 'mobileNumber',
            label: 'Mobile Number',
            sortable: true,
            draggable: true
        },
        {
            key: 'email',
            label: 'Email Address',
            sortable: true,
            draggable: true
        },
        {
            key: 'gender',
            label: 'Gender',
            sortable: true,
            draggable: true
        },
        {
            key: 'organisation',
            label: 'Organisation',
            sortable: true,
            draggable: true
        }
    ];

    const renderMemberActions = (member: any) => (
        <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
        </Button>
    );

    const renderMemberCell = (member: any, columnKey: string) => {
        return member[columnKey] || "-";
    };

    return (
        <div className="space-y-6">
            {/* Community Details Section */}
            <div className="flex items-center justify-end">
                <Button
                    variant="outline"
                // onClick={() => navigate(`/pulse/community/${id}/edit`)}
                >
                    <Pencil className="w-4 h-4" />
                </Button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#F6F4EE] p-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                            <FileText size={16} />
                        </div>
                        <span className="font-semibold text-lg text-gray-800">Community Details</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm font-medium text-gray-700">{isActive ? 'Active' : 'Inactive'}</span>
                        <Switch
                            checked={isActive}
                            onCheckedChange={setIsActive}
                            className="data-[state=checked]:bg-green-500"
                        />
                    </div>
                </div>

                <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Community Image */}
                        <div>
                            <img
                                src={communityData.image}
                                alt={communityData.name}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {communityData.description}
                            </p>
                        </div>
                    </div>

                    {/* Community Info Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Community Name</p>
                                <p className="text-sm font-semibold text-gray-900">{communityData.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Members</p>
                                <p className="text-sm font-semibold text-gray-900">{communityData.members}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Created On</p>
                                <p className="text-sm font-semibold text-gray-900">{communityData.createdOn}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Created By</p>
                                <p className="text-sm font-semibold text-gray-900">{communityData.createdBy}</p>
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>

            {/* Community Member Details Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                        <FileText size={16} />
                    </div>
                    <span className="font-semibold text-lg text-gray-800">Community Member Details</span>
                </div>

                <EnhancedTable
                    data={members}
                    columns={memberColumns}
                    renderActions={renderMemberActions}
                    renderCell={renderMemberCell}
                    hideColumnsButton={true}
                    hideTableSearch={true}
                />
            </div>
        </div>
    );
};

export default CommunityDetailsTab;
