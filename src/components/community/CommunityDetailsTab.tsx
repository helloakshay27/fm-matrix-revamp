import { useState, useEffect } from "react";
import { FileText, Eye, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface CommunityDetailsTabProps {
    communityId?: string;
    setCommunityName?: (name: string) => void;
}

const memberColumns: ColumnConfig[] = [
    {
        key: 'checkbox',
        label: '',
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
        key: 'name',
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
    const [communityData, setCommunityData] = useState({
        icon: "",
        name: "",
        description: "",
        all_members: [],
        status: "",
        created_at: "",
        created_by: ""
    });
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/communities/${communityId}.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
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

    const handleMemberSelection = (memberId: number, isSelected: boolean) => {
        setSelectedMembers(prev => {
            if (isSelected) {
                return [...prev, memberId];
            } else {
                return prev.filter(id => id !== memberId);
            }
        });
    };

    const handleClearSelection = () => {
        setSelectedMembers([]);
    };

    const handleDeleteMembers = async () => {
        if (selectedMembers.length === 0) {
            toast.error("Please select members to delete");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedMembers.length} member(s)? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await Promise.all(
                selectedMembers.map(memberId =>
                    axios.delete(
                        `https://${baseUrl}/community_members/${memberId}.json`,
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        }
                    )
                )
            );

            await fetchData();
            setSelectedMembers([]);
            toast.success(`${selectedMembers.length} member(s) deleted successfully`);
        } catch (error) {
            console.error('Error deleting members:', error);
            toast.error("Failed to delete member(s). Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const renderMemberCell = (member: any, columnKey: string) => {
        if (columnKey === 'checkbox') {
            return (
                <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={(e) => handleMemberSelection(member.id, e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                />
            );
        }
        return member[columnKey] || "-";
    };

    return (
        <div className="space-y-6">
            {/* Member Selection Panel */}
            {selectedMembers.length > 0 && (
                <div className="fixed bottom-6 left-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">
                                {selectedMembers.length} member(s) selected
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearSelection}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteMembers}
                                disabled={isDeleting}
                                className="flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete ({selectedMembers.length})
                            </Button>
                        </div>
                    </div>
                </div>
            )}
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
                />
            </div>
        </div>
    );
};

export default CommunityDetailsTab;
