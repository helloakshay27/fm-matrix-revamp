import { Eye, File, Loader2 } from "lucide-react"
import { EnhancedTable } from "./enhanced-table/EnhancedTable"
import { useEffect, useState } from "react"
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "./ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const columns: ColumnConfig[] = [
    {
        key: 'action',
        label: 'Action',
        sortable: false,
        draggable: false
    },
    {
        key: 'user_name',
        label: 'Requestor Name',
        sortable: true,
        draggable: true
    },
    {
        key: 'reason',
        label: 'Reason',
        sortable: true,
        draggable: true
    },
    {
        key: 'mobile',
        label: 'Requestor Number',
        sortable: true,
        draggable: true
    },
    {
        key: 'email',
        label: 'Requestor Mail',
        sortable: true,
        draggable: true
    },
    {
        key: 'organization',
        label: 'Organisation',
        sortable: true,
        draggable: true
    },
    {
        key: 'created_at',
        label: 'Request Date',
        sortable: true,
        draggable: true
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        draggable: true
    }
];

const CommunityPendingList = ({ communityId }: { communityId: string }) => {
    const baseUrl = localStorage.getItem("baseUrl")
    const tokne = localStorage.getItem("token")
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [pendingMembers, setPendingMembers] = useState([])
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);

    const getPendingUsers = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`https://${baseUrl}/community_members/pending.json?community_id=${communityId}`, {
                headers: {
                    Authorization: `Bearer ${tokne}`
                }
            })

            setPendingMembers(response.data.community_members)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getPendingUsers()
    }, [])

    const handleApprovedUsers = async () => {
        try {
            await axios.get(`https://${baseUrl}/community_members/approved.json?member_ids=[${selectedItems.map(Number).join(",")}]`, {
                headers: {
                    Authorization: `Bearer ${tokne}`
                }
            })

            toast.success("Users approved successfully")
            getPendingUsers()
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeniedUsers = async () => {
        try {
            await axios.get(`https://${baseUrl}/community_members/removed.json?member_ids=[${selectedItems.map(Number).join(",")}]`, {
                headers: {
                    Authorization: `Bearer ${tokne}`
                }
            })

            toast.success("Users denied successfully")
            getPendingUsers()
        } catch (error) {
            console.log(error)
        }
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(pendingMembers.map(item => String(item.id)));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (itemId: string, checked: boolean) => {
        if (checked) {
            setSelectedItems(prev => [...prev, itemId]);
        } else {
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        }
    };

    const renderCell = (item: any, columnKey: string) => {
        if (columnKey === 'action') {
            return (
                <Button variant="ghost" size="sm" onClick={() => navigate(`user/${item.id}`)}>
                    <Eye className="w-4 h-4" />
                </Button>
            );
        }
        if (columnKey === 'created_at' && item.created_at) {
            return new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(new Date(item.created_at));
        }
        if (columnKey === 'status') {
            return item.status.charAt(0).toUpperCase() + item.status.slice(1);
        }
        return item[columnKey] || "-";
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-[#F6F4EE] p-4 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                        <File size={16} />
                    </div>
                    <span className="font-semibold text-lg text-gray-800">Requestor Details</span>
                </div>
                {
                    [1, 1].length > 0 && (
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-8 h-10 disabled:opacity-50"
                                onClick={handleDeniedUsers}
                                disabled={selectedItems.length === 0 || isUpdating}
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Deny
                            </Button>
                            <Button
                                className="!bg-[#00A651] !hover:bg-[#008C44] !text-black px-8 h-10 disabled:opacity-50"
                                onClick={handleApprovedUsers}
                                disabled={selectedItems.length === 0 || isUpdating}
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Approve
                            </Button>
                        </div>
                    )
                }
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
                </div>
            ) : (
                <EnhancedTable
                    data={pendingMembers}
                    columns={columns}
                    renderCell={renderCell}
                    hideColumnsButton={true}
                    hideTableSearch={true}
                    selectable={true}
                    enableSelection={true}
                    selectedItems={selectedItems}
                    onSelectAll={handleSelectAll}
                    onSelectItem={handleSelectItem}
                    getItemId={(item: any) => String(item.id)}
                />
            )}
        </div>
    )
}

export default CommunityPendingList