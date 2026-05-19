import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Award, Package, Calendar, Tag, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import axios from 'axios'
import { toast } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ClaimDetail {
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
        content_type: string
        active: boolean
        start_at: string
        end_at: string
        status: string
        user_attempt_count: number
        terms_and_conditions: string | null
    }
    prize: {
        id: number
        title: string
        display_name: string | null
        reward_type: string
        coupon_code: string
        partner_name: string | null
        points_value: number | null
        probability_value: number
        total_quantity: number
        claimed_quantity: number
        per_user_limit: number | null
        active: boolean
        product?: {
            id: number
            sku: string
            name: string
            description: string
            brand: string
            base_price: string
            sale_price: string
            final_price: string
            stock_quantity: number
            status: string
            published: boolean
            images: any[]
        }
    }
    user: {
        id: number
        email: string
        firstname: string
        lastname: string
        mobile: string
        country_code: string
        full_name: string
        user_type: string
        active: boolean
        gender: string
        birth_date: string
        department?: {
            id: number
            department_name: string
        }
    }
}

const PulseContestRewardsDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [claim, setClaim] = useState<ClaimDetail | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) {
            fetchClaimDetails()
        }
    }, [id])

    const fetchClaimDetails = async () => {
        setLoading(true)
        try {
            const baseUrl = localStorage.getItem("baseUrl")
            const token = localStorage.getItem("token")

            const response = await axios.get(
                `https://${baseUrl}/user_contest_rewards/${id}.json`,
                {
                    params: {
                        token: token,
                        access: "admin",
                    },
                }
            )

            setClaim(response.data)
        } catch (error) {
            console.error("Error fetching claim details:", error)
            toast.error("Failed to fetch claim details")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        try {
            const baseUrl = localStorage.getItem("baseUrl")
            const token = localStorage.getItem("token")

            await axios.put(
                `https://${baseUrl}/user_contest_rewards/${id}.json?token=${token}&reward_type=marchandise`,
                {
                    user_contest_reward: {
                        status: newStatus
                    }
                }
            )

            toast.success("Status updated successfully")
            fetchClaimDetails() // Refresh data
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Failed to update status")
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatDateOnly = (dateString: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            granted: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            claimed: "bg-blue-100 text-blue-800",
            expired: "bg-red-100 text-red-800",
        }
        return (
            <Badge className={`${statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800"} capitalize`}>
                {status}
            </Badge>
        )
    }

    if (loading) {
        return (
            <div className="p-4 sm:p-6 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
                    <p className="text-gray-600">Loading claim details...</p>
                </div>
            </div>
        )
    }

    if (!claim) {
        return (
            <div className="p-4 sm:p-6 min-h-screen">
                <div className="text-center py-12">
                    <p className="text-gray-600">Reward not found</p>
                    <Button onClick={() => navigate(-1)} className="mt-4">
                        Back to List
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 hover:text-gray-800 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                                Claim #{claim.id}
                            </h1>
                            {getStatusBadge(claim.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                            Granted on {formatDate(claim.granted_at)}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">Update Status:</span>
                        <Select
                            value={claim.status.toLowerCase()}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="claimed">Claimed</SelectItem>
                                <SelectItem value="granted">Granted</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                {/* User Information */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                        <User className="w-5 h-5 text-[#C72030]" />
                        User Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Full Name</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{claim?.user?.full_name}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Email</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{claim.user.email}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Mobile</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">
                                +{claim.user.country_code} {claim.user.mobile}
                            </span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">User Type</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium capitalize">
                                {claim.user.user_type.replace(/_/g, ' ')}
                            </span>
                        </div>
                        {claim.user.gender && (
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Gender</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium capitalize">{claim.user.gender}</span>
                            </div>
                        )}
                        {claim.user.birth_date && (
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Birth Date</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{formatDateOnly(claim.user.birth_date)}</span>
                            </div>
                        )}
                        {claim.user.department && (
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Department</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{claim.user.department.department_name}</span>
                            </div>
                        )}
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Status</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <Badge variant={claim.user.active ? "default" : "secondary"}>
                                {claim.user.active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Contest Information */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                        <Award className="w-5 h-5 text-[#C72030]" />
                        Contest Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Contest Name</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{claim.contest.name}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Content Type</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium capitalize">{claim.contest.content_type}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Start Date</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{formatDate(claim.contest.start_at)}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">End Date</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{formatDate(claim.contest.end_at)}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Contest Status</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <Badge className="capitalize">{claim.contest.status}</Badge>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">User Attempts</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{claim.contest.user_attempt_count}</span>
                        </div>
                        {claim.contest.description && (
                            <div className="flex items-start md:col-span-2">
                                <span className="text-gray-500 min-w-[140px]">Description</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{claim.contest.description}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Prize Information */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                        <Tag className="w-5 h-5 text-[#C72030]" />
                        Prize Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Prize Title</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{claim.prize.title}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Reward Type</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium capitalize">{claim.prize.reward_type}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Coupon Code</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{claim.prize.coupon_code}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Probability</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{claim.prize.probability_value}%</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Total Quantity</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{claim.prize.total_quantity}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Claimed Quantity</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{claim.prize.claimed_quantity}</span>
                        </div>
                        {claim.prize.partner_name && (
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Partner Name</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{claim.prize.partner_name}</span>
                            </div>
                        )}
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Prize Status</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <Badge variant={claim.prize.active ? "default" : "secondary"}>
                                {claim.prize.active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Product Information */}
                {claim.prize.product && (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                            <Package className="w-5 h-5 text-[#C72030]" />
                            Product Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Product Name</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{claim.prize.product.name}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">SKU</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{claim.prize.product.sku}</span>
                            </div>
                            {claim.prize.product.brand && (
                                <div className="flex items-start">
                                    <span className="text-gray-500 min-w-[140px]">Brand</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">{claim.prize.product.brand}</span>
                                </div>
                            )}
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Base Price</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">₹{claim.prize.product.base_price}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Sale Price</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">₹{claim.prize.product.sale_price}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Final Price</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">₹{claim.prize.product.final_price}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Stock Quantity</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{claim.prize.product.stock_quantity}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Product Status</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <Badge className="capitalize">{claim.prize.product.status}</Badge>
                            </div>
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Published</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <Badge variant={claim.prize.product.published ? "default" : "secondary"}>
                                    {claim.prize.product.published ? 'Yes' : 'No'}
                                </Badge>
                            </div>
                            {claim.prize.product.description && (
                                <div className="flex items-start md:col-span-2">
                                    <span className="text-gray-500 min-w-[140px]">Description</span>
                                    <span className="text-gray-500 mx-2">:</span>
                                    <span className="text-gray-900 font-medium">{claim.prize.product.description}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Claim Details */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#C72030]" />
                        Claim Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Claim ID</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{claim.id}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Reward Type</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium capitalize">{claim.reward_type}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Status</span>
                            <span className="text-gray-500 mx-2">:</span>
                            {getStatusBadge(claim.status)}
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Coupon Code</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{claim.coupon_code}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Granted At</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">{formatDate(claim.granted_at)}</span>
                        </div>
                        {claim.points_value && (
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Points Value</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{claim.points_value}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PulseContestRewardsDetails