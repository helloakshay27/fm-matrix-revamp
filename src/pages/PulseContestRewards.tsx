import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Eye, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface UserContestReward {
    id: number
    reward_type: string
    status: string
    points_value: number | null
    coupon_code: string
    granted_at: string
    contest: {
        id: number
        name: string
        description: string
        status: string
    }
    prize: {
        id: number
        title: string
        reward_type: string
        product?: {
            name: string
            base_price: string
        }
    }
    user: {
        id: number
        email: string
        firstname: string
        lastname: string
        mobile: string
        full_name: string
    }
}

const columns: ColumnConfig[] = [
    {
        key: "id",
        label: "Claim ID",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "user_name",
        label: "User Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "user_mobile",
        label: "Mobile",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "contest_name",
        label: "Contest",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "prize_title",
        label: "Prize",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "product_name",
        label: "Product",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "status",
        label: "Status",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "coupon_code",
        label: "Coupon Code",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "granted_at",
        label: "Granted At",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const PulseContestRewards = () => {
    const navigate = useNavigate();

    const [claims, setClaims] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchClaims = async () => {
        setLoading(true)
        try {
            const baseUrl = localStorage.getItem("baseUrl")
            const token = localStorage.getItem("token")

            const response = await axios.get(
                `https://${baseUrl}/user_contest_rewards.json`,
                {
                    params: {
                        token: token,
                        reward_type: "merchandise",
                        access: "admin",
                    },
                }
            )

            // Transform the data to match table structure
            const transformedData = response.data.map((claim: UserContestReward) => ({
                id: claim.id,
                user_name: claim.user.full_name,
                user_mobile: claim.user.mobile,
                user_email: claim.user.email,
                contest_name: claim.contest.name,
                prize_title: claim.prize.title,
                product_name: claim.prize.product?.name || "-",
                status: claim.status.charAt(0).toUpperCase() + claim.status.slice(1),
                coupon_code: claim.coupon_code,
                granted_at: claim.granted_at
                    ? new Date(claim.granted_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : "-",
                reward_type: claim.reward_type,
            }))

            setClaims(transformedData)
        } catch (error) {
            console.error("Error fetching claims:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClaims()
    }, [])

    const renderCell = (row: any, columnKey: string) => {
        switch (columnKey) {
            default:
                return row[columnKey]
        }
    }

    const renderActions = (row: any) => {
        return (
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost" size="sm"
                    onClick={() => navigate(`/pulse/rewards/${row.id}`)}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Manage user contest reward.
                </p>
            </div>
            <EnhancedTable
                data={claims}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                loading={loading}
                leftActions={
                    <Button
                        onClick={() => navigate("/pulse/rewards/create")}
                        className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Reward
                    </Button>
                }
            />
        </div>
    )
}

export default PulseContestRewards