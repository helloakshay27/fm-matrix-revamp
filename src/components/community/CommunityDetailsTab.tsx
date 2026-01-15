import { useState, useEffect } from "react";
import { FileText, Eye, Pencil } from "lucide-react";
import { Switch } from "@mui/material";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { MemberSelectionPanel } from "./MemberSelectionPanel";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

interface CommunityDetailsTabProps {
    communityId?: string;
    setCommunityName?: (name: string) => void;
}

const memberColumns: ColumnConfig[] = [
    {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        draggable: false
    },
    {
        key: 'access_card_number',
        label: 'Access card Number',
        sortable: true,
        draggable: true
    },
    {
        key: 'user',
        label: 'Name',
        sortable: true,
        draggable: true
    },
    {
        key: 'mobile',
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

const CommunityDetailsTab = ({ communityId, setCommunityName }: CommunityDetailsTabProps) => {
    const { id } = useParams();
    const baseUrl = localStorage.getItem("baseUrl")
    const token = localStorage.getItem("token")
    const navigate = useNavigate();

    const [isActive, setIsActive] = useState(true);
    const [selectedMembers, setSelectedMembers] = useState<Array<{ id: string; name: string }>>([])
    const [isToggling, setIsToggling] = useState<number | null>(null)
    const [communityData, setCommunityData] = useState({
        icon: "",
        name: "",
        description: "",
        all_members: [],
        status: "",
        created_at: "",
        created_by: ""
    });

    const [members, setMembers] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/communities/${communityId}.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            setIsActive(response.data.active)
            setCommunityData(response.data)
            setCommunityName(response.data.name)
            setMembers(response.data.all_members || [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [communityId])

    const renderMemberActions = (member: any) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/pulse/community/${communityId}/user/${member.id}`)}>
            <Eye className="w-4 h-4" />
        </Button>
    );

    const renderMemberCell = (member: any, columnKey: string) => {
        if (columnKey === 'actions') {
            return renderMemberActions(member);
        }
        return member[columnKey] || "-";
    };

    const handleDeleteMembers = async () => {
        const memberIds = selectedMembers.map((member) => member.id).join(",");
        try {
            // Delete each selected member
            await axios.get(`https://${baseUrl}/community_members/removed.json?member_ids=[${memberIds}]`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            // Refresh the data after deletion
            await fetchData();

            toast.success("Members deleted successfully!");
        } catch (error) {
            console.error("Error deleting members:", error);
            toast.error("Failed to delete members. Please try again.");
            throw error;
        }
    };

    const handleClearSelection = () => {
        setSelectedMembers([]);
    };

    const handleStatusChange = async (id: number, currentActive: boolean) => {
        const newActive = !currentActive;
        setIsToggling(id);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('community[active]', newActive ? 'true' : 'false');

            await axios.put(
                `https://${baseUrl}/communities/${id}.json`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            setIsActive(newActive);
            toast.success(`Community ${newActive ? 'activated' : 'deactivated'} successfully`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update community status");
        } finally {
            setIsToggling(null);
        }
    };

    // Get selected member IDs for easy access
    const selectedMemberIds = selectedMembers.map((member) => member.id);

    return (
        <div className="space-y-6">
            {/* Community Details Section */}
            <div className="flex items-center justify-end">
                <Button
                    variant="outline"
                    onClick={() => navigate(`/pulse/community/edit/${id}`)}
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
                            onChange={() => handleStatusChange(Number(id), isActive)}
                            disabled={isToggling === Number(id)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#C72030',
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#C72030',
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Community Image */}
                        <div>
                            <img
                                src={communityData.icon}
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
                                <p className="text-sm font-semibold text-gray-900">{communityData?.all_members?.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Created On</p>
                                <p className="text-sm font-semibold text-gray-900">{new Date(communityData.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Created By</p>
                                <p className="text-sm font-semibold text-gray-900">{communityData.created_by}</p>
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
                    renderCell={renderMemberCell}
                    hideColumnsButton={true}
                    hideTableSearch={true}
                    selectable={true}
                    enableSelection={true}
                    onSelectItem={(itemId: string, checked: boolean) => {
                        if (checked) {
                            const member = members.find((m) => String(m.id) === itemId);
                            if (member && !selectedMemberIds.includes(itemId)) {
                                setSelectedMembers([...selectedMembers, { id: itemId, name: member.user || "-" }]);
                            }
                        } else {
                            setSelectedMembers(selectedMembers.filter((member) => member.id !== itemId));
                        }
                    }}
                    onSelectAll={(isSelectAll: boolean) => {
                        if (isSelectAll) {
                            setSelectedMembers(members.map((member: any) => ({
                                id: String(member.id),
                                name: member.user || "-"
                            })));
                        } else {
                            setSelectedMembers([]);
                        }
                    }}
                    selectedItems={selectedMemberIds}
                    getItemId={(item: any) => String(item.id)}
                />
            </div>

            {/* Member Selection Panel */}
            {selectedMembers.length > 0 && (
                <MemberSelectionPanel
                    selectedCount={selectedMembers.length}
                    selectedMembers={selectedMembers}
                    selectedMemberIds={selectedMemberIds}
                    onDeleteMembers={handleDeleteMembers}
                    onClearSelection={handleClearSelection}
                />
            )}
        </div>
    );
};

export default CommunityDetailsTab;
