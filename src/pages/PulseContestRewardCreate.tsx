import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Gift, Trophy, Tag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    TextField,
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
} from "@mui/material"

interface Contest {
    id: number
    name: string
    prizes: Prize[]
}

interface Prize {
    id: number
    title: string
    reward_type: string
    coupon_code?: string
}

interface User {
    id: number
    full_name: string
}

const REWARD_TYPES = ["coupon", "points", "none"]

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "white",
        "& fieldset": { borderColor: "#e5e7eb" },
        "&:hover fieldset": { borderColor: "#C72030" },
        "&.Mui-focused fieldset": { borderColor: "#C72030" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#C72030" },
}

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-3 mb-6 bg-[#F6F4EE] p-4 rounded-lg">
        <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded">
            <Icon className="w-5 h-5 text-[#C72030]" />
        </div>
        <h2 className="text-base font-semibold text-[#1A1A1A]">{title}</h2>
    </div>
)

const PulseContestRewardCreate = () => {
    const navigate = useNavigate()

    const [submitting, setSubmitting] = useState(false)
    const [contests, setContests] = useState<Contest[]>([])
    const [contestsLoading, setContestsLoading] = useState(false)
    const [prizes, setPrizes] = useState<Prize[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [usersLoading, setUsersLoading] = useState(false)

    const [form, setForm] = useState({
        contest_id: "",
        prize_id: "",
        reward_type: "coupon",
        points_value: "",
        coupon_code: "",
        user_id: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const baseUrl = localStorage.getItem("baseUrl")
    const token = localStorage.getItem("token")

    useEffect(() => {
        fetchContests()
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setUsersLoading(true)
        try {
            const response = await axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Asset`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setUsers(response.data.users || [])
        } catch {
            toast.error("Failed to load users")
        } finally {
            setUsersLoading(false)
        }
    }

    const fetchContests = async () => {
        setContestsLoading(true)
        try {
            const response = await axios.get(`https://${baseUrl}/contests.json?content_type_eq=Special%20Discount`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = response.data
            const arr = Array.isArray(data) ? data : Array.isArray(data.contests) ? data.contests : []
            setContests(arr.map((c: any) => ({
                id: c.id,
                name: c.name,
                prizes: (c.prizes || []).map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    reward_type: p.reward_type,
                    coupon_code: p.coupon_code || "",
                })),
            })))
        } catch {
            toast.error("Failed to load contests")
        } finally {
            setContestsLoading(false)
        }
    }

    const handleContestChange = (contestId: string) => {
        setForm(prev => ({ ...prev, contest_id: contestId, prize_id: "", coupon_code: "" }))
        setErrors(prev => ({ ...prev, contest_id: "", prize_id: "" }))
        const selected = contests.find(c => String(c.id) === contestId)
        setPrizes(selected?.prizes || [])
    }

    const handlePrizeChange = (prizeId: string) => {
        const selectedPrize = prizes.find(p => String(p.id) === prizeId)
        setForm(prev => ({
            ...prev,
            prize_id: prizeId,
            coupon_code: selectedPrize?.coupon_code || prev.coupon_code,
        }))
        setErrors(prev => ({ ...prev, prize_id: "" }))
    }

    const handleChange = (field: string, value: string) => {
        if (field === "reward_type") {
            setForm(prev => ({ ...prev, reward_type: value, coupon_code: "", points_value: "" }))
            setErrors(prev => ({ ...prev, reward_type: "", coupon_code: "", points_value: "" }))
            return
        }
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!form.user_id) newErrors.user_id = "User is required"
        if (!form.contest_id) newErrors.contest_id = "Contest is required"
        if (!form.prize_id) newErrors.prize_id = "Prize is required"
        if (!form.reward_type) newErrors.reward_type = "Reward type is required"
        if (form.points_value && isNaN(Number(form.points_value)))
            newErrors.points_value = "Must be a valid number"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setSubmitting(true)
        try {
            await axios.post(
                `https://${baseUrl}/user_contest_rewards.json`,
                {
                    user_contest_reward: {
                        user_id: Number(form.user_id),
                        contest_id: Number(form.contest_id),
                        prize_id: Number(form.prize_id),
                        reward_type: form.reward_type,
                        status: "granted",
                        points_value: form.points_value ? Number(form.points_value) : null,
                        coupon_code: form.coupon_code || null,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            toast.success("Reward created successfully")
            navigate("/pulse/rewards")
        } catch (error: any) {
            const msg =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Failed to create reward"
            toast.error(msg)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="p-4 sm:p-6">
            {/* Page Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 mb-4 text-sm transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#C72030]/10 flex items-center justify-center">
                            <Gift className="w-6 h-6 text-[#C72030]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1a1a1a]">Create Reward</h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Assign a contest reward manually
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left column — main form (2/3 width) */}
                <div className="xl:col-span-2 space-y-6">

                    {/* User Section */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <SectionHeader icon={Trophy} title="User" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <FormControl fullWidth size="small" error={!!errors.user_id} sx={fieldSx}>
                                    <InputLabel>User *</InputLabel>
                                    <MuiSelect
                                        value={form.user_id}
                                        label="User *"
                                        onChange={(e) => handleChange("user_id", e.target.value as string)}
                                        disabled={usersLoading}
                                        endAdornment={
                                            usersLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin mr-3 text-gray-400" />
                                            ) : undefined
                                        }
                                    >
                                        {usersLoading ? (
                                            <MenuItem disabled>Loading users...</MenuItem>
                                        ) : users.length === 0 ? (
                                            <MenuItem disabled>No users available</MenuItem>
                                        ) : (
                                            users.map((u) => (
                                                <MenuItem key={u.id} value={String(u.id)}>
                                                    {u.full_name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </MuiSelect>
                                </FormControl>
                                {errors.user_id && (
                                    <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contest & Prize Section */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <SectionHeader icon={Trophy} title="Contest & Prize" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Contest */}
                            <div>
                                <FormControl fullWidth size="small" error={!!errors.contest_id} sx={fieldSx}>
                                    <InputLabel>Contest *</InputLabel>
                                    <MuiSelect
                                        value={form.contest_id}
                                        label="Contest *"
                                        onChange={(e) => handleContestChange(e.target.value as string)}
                                        disabled={contestsLoading}
                                        endAdornment={
                                            contestsLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin mr-3 text-gray-400" />
                                            ) : undefined
                                        }
                                    >
                                        {contestsLoading ? (
                                            <MenuItem disabled>Loading contests...</MenuItem>
                                        ) : contests.length === 0 ? (
                                            <MenuItem disabled>No contests available</MenuItem>
                                        ) : (
                                            contests.map((c) => (
                                                <MenuItem key={c.id} value={String(c.id)}>
                                                    {c.name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </MuiSelect>
                                </FormControl>
                                {errors.contest_id && (
                                    <p className="text-red-500 text-xs mt-1">{errors.contest_id}</p>
                                )}
                            </div>

                            {/* Prize */}
                            <div>
                                <FormControl fullWidth size="small" error={!!errors.prize_id} sx={fieldSx}>
                                    <InputLabel>Prize *</InputLabel>
                                    <MuiSelect
                                        value={form.prize_id}
                                        label="Prize *"
                                        onChange={(e) => handlePrizeChange(e.target.value as string)}
                                        disabled={!form.contest_id}
                                    >
                                        {!form.contest_id ? (
                                            <MenuItem disabled>Select a contest first</MenuItem>
                                        ) : prizes.length === 0 ? (
                                            <MenuItem disabled>No prizes available</MenuItem>
                                        ) : (
                                            prizes.map((p) => (
                                                <MenuItem key={p.id} value={String(p.id)}>
                                                    {p.title}
                                                </MenuItem>
                                            ))
                                        )}
                                    </MuiSelect>
                                </FormControl>
                                {errors.prize_id && (
                                    <p className="text-red-500 text-xs mt-1">{errors.prize_id}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Reward Details Section */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <SectionHeader icon={Tag} title="Reward Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Reward Type */}
                            <div>
                                <FormControl fullWidth size="small" error={!!errors.reward_type} sx={fieldSx}>
                                    <InputLabel>Reward Type *</InputLabel>
                                    <MuiSelect
                                        value={form.reward_type}
                                        label="Reward Type *"
                                        onChange={(e) => handleChange("reward_type", e.target.value as string)}
                                    >
                                        {REWARD_TYPES.map((t) => (
                                            <MenuItem key={t} value={t}>
                                                {t.charAt(0).toUpperCase() + t.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </MuiSelect>
                                </FormControl>
                                {errors.reward_type && (
                                    <p className="text-red-500 text-xs mt-1">{errors.reward_type}</p>
                                )}
                            </div>

                            {/* Coupon Code — only for coupon reward type */}
                            {form.reward_type === "coupon" && (
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Coupon Code"
                                    value={form.coupon_code}
                                    onChange={(e) => handleChange("coupon_code", e.target.value)}
                                    placeholder="e.g. WIN2024"
                                    error={!!errors.coupon_code}
                                    helperText={errors.coupon_code}
                                    sx={fieldSx}
                                />
                            )}

                            {/* Points Value — only for points reward type */}
                            {form.reward_type === "points" && (
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Points Value"
                                    type="number"
                                    value={form.points_value}
                                    onChange={(e) => handleChange("points_value", e.target.value)}
                                    placeholder="e.g. 100"
                                    inputProps={{ min: 0 }}
                                    error={!!errors.points_value}
                                    helperText={errors.points_value}
                                    sx={fieldSx}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right column — summary card (1/3 width) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6">
                        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4 uppercase tracking-wide">
                            Summary
                        </h3>

                        <div className="space-y-3 text-sm">
                            <SummaryRow
                                label="User"
                                value={users.find(u => String(u.id) === form.user_id)?.full_name || "—"}
                            />
                            <SummaryRow
                                label="Contest"
                                value={
                                    contests.find(c => String(c.id) === form.contest_id)?.name || "—"
                                }
                            />
                            <SummaryRow
                                label="Prize"
                                value={prizes.find(p => String(p.id) === form.prize_id)?.title || "—"}
                            />
                            <SummaryRow
                                label="Reward Type"
                                value={
                                    form.reward_type
                                        ? form.reward_type.charAt(0).toUpperCase() + form.reward_type.slice(1)
                                        : "—"
                                }
                            />
                            <SummaryRow
                                label="Status"
                                value={
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        Granted
                                    </span>
                                }
                            />
                            {form.coupon_code && (
                                <SummaryRow label="Coupon Code" value={form.coupon_code} />
                            )}
                            {form.points_value && (
                                <SummaryRow label="Points Value" value={form.points_value} />
                            )}
                        </div>

                        <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full bg-[#C72030] hover:bg-[#B01D2A] text-white flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Reward"
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                                disabled={submitting}
                                className="w-full border-gray-300 text-gray-600"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SummaryRow = ({
    label,
    value,
}: {
    label: string
    value: React.ReactNode
}) => (
    <div className="flex items-start justify-between gap-2">
        <span className="text-gray-500 shrink-0">{label}</span>
        <span className="text-[#1A1A1A] font-medium text-right">{value}</span>
    </div>
)

export default PulseContestRewardCreate
