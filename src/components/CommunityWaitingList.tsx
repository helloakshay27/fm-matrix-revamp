import { Eye, File, Loader2 } from "lucide-react"
import { EnhancedTable } from "./enhanced-table/EnhancedTable"
import { useEffect, useState } from "react"
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const CommunityWaitingList = ({ communityId }: { communityId: string }) => {
    const navigate = useNavigate()
    const baseUrl = localStorage.getItem("baseUrl")
    const token = localStorage.getItem("token")

    const [loading, setLoading] = useState(false)
    const [waitingListMembers, setWaitingListMembers] = useState([])

    const getWaitingListUsers = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`https://${baseUrl}/community_members/waiting_list.json?community_id=${communityId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setWaitingListMembers(response.data.community_members)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getWaitingListUsers()
    }, [])

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
            <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                    <File size={16} />
                </div>
                <span className="font-semibold text-lg text-gray-800">Requestor Details</span>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
                </div>
            ) : (
                <EnhancedTable
                    data={waitingListMembers}
                    columns={columns}
                    renderCell={renderCell}
                    hideColumnsButton={true}
                    hideTableSearch={true}
                    loading={loading}
                    pageSize={10}
                    pagination={true}
                />
            )}
        </div>
    )
}

export default CommunityWaitingList