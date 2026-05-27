import React, { useState, useEffect } from 'react'
import { Calendar, Plus, X, Loader2, Clock, MoreVertical, Edit2, Trash2, Search } from 'lucide-react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

const THEME_COLOR = '#DA7756'
const THEME_COLOR_DARK = '#c9673f'
const BACKGROUND_COLOR = '#fffaf8'

interface MeetingMember {
    id: string
    name: string
    email: string
    selected: boolean
}

interface DailyMeetingConfig {
    id: number
    name: string
    [key: string]: any
}

interface User {
    id: number
    email: string
    name: string
    [key: string]: any
}

interface Department {
    id: number
    name: string
    department_name?: string
    [key: string]: any
}

interface WeeklyMeeting {
    id: number
    name: string
    day_of_week: number
    meeting_time: string
    duration_minutes: number
    meeting_head?: { id: number; name: string; email: string }
    meeting_heads?: Array<{ id: number; name: string; email: string }>
    meeting_head_ids?: number[]
    department?: { id: number; name: string }
    departments?: Array<{ id: number; name?: string; department_name?: string }>
    department_ids?: number[]
    members?: Array<{ id: number; name: string; email: string }>
    is_default?: boolean
    [key: string]: any
}

const getDepartmentLabel = (dept: Department | { name?: string; department_name?: string }) =>
    dept.department_name || dept.name || 'Unnamed department'

const getMeetingDepartmentIds = (meeting: WeeklyMeeting | DailyMeetingConfig): string[] => {
    const ids =
        Array.isArray(meeting.department_ids)
            ? meeting.department_ids
            : Array.isArray(meeting.departments)
                ? meeting.departments.map((dept: any) => dept?.id)
                : meeting.department?.id
                    ? [meeting.department.id]
                    : []

    return ids.filter(Boolean).map((id: number | string) => String(id))
}

const getMeetingDepartmentLabels = (meeting: WeeklyMeeting): string[] => {
    const departmentList = Array.isArray(meeting.departments)
        ? meeting.departments
        : meeting.department
            ? [meeting.department]
            : []

    return departmentList.map((dept) => getDepartmentLabel(dept)).filter(Boolean)
}

const getUserLabel = (user: User) => {
    const fullName = [user.firstname, user.lastname].filter(Boolean).join(' ').trim()
    return fullName || user.name || user.email || 'Unnamed user'
}

const getMeetingHeadIds = (meeting: WeeklyMeeting | DailyMeetingConfig): string[] => {
    const ids =
        Array.isArray(meeting.meeting_head_ids)
            ? meeting.meeting_head_ids
            : Array.isArray(meeting.meeting_heads)
                ? meeting.meeting_heads.map((head: any) => head?.id)
                : meeting.meeting_head?.id
                    ? [meeting.meeting_head.id]
                    : []

    return ids.filter(Boolean).map((id: number | string) => String(id))
}

const getMeetingHeadLabels = (meeting: WeeklyMeeting): string[] => {
    const heads = Array.isArray(meeting.meeting_heads)
        ? meeting.meeting_heads
        : meeting.meeting_head
            ? [meeting.meeting_head]
            : []

    return heads.map((head) => head.name || head.email).filter(Boolean)
}

const SAMPLE_MEMBERS: MeetingMember[] = [
    { id: '1', name: 'Adhip Shetty', email: 'adhip.shetty@lockated.com', selected: false },
    { id: '2', name: 'Akshay Shinde', email: 'akshay.shinde@lockated.com', selected: false },
    { id: '3', name: 'Akshit Baid', email: 'akshit.baid@lockated.com', selected: false },
    { id: '4', name: 'Arun Mohan', email: 'arun.mohan@lockated.com', selected: false },
]

const WeeklyMeetingSettings = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [meetingName, setMeetingName] = useState('')
    const [selectedMeetingHeadIds, setSelectedMeetingHeadIds] = useState<string[]>([])
    const [meetingHeadSearch, setMeetingHeadSearch] = useState('')
    const [dayOfWeek, setDayOfWeek] = useState('Monday')
    const [time, setTime] = useState('00:00')
    const [duration, setDuration] = useState('60')
    const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([])
    const [members, setMembers] = useState<MeetingMember[]>([])
    const [setAsDefault, setSetAsDefault] = useState(false)
    const [dailyMeetings, setDailyMeetings] = useState<DailyMeetingConfig[]>([])
    const [loadingMeetings, setLoadingMeetings] = useState(false)
    const [selectedDailyMeeting, setSelectedDailyMeeting] = useState('')
    const [users, setUsers] = useState<User[]>([])
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [departments, setDepartments] = useState<Department[]>([])
    const [loadingDepartments, setLoadingDepartments] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [weeklyMeetings, setWeeklyMeetings] = useState<WeeklyMeeting[]>([])
    const [loadingWeeklyMeetings, setLoadingWeeklyMeetings] = useState(false)
    const [editingMeetingId, setEditingMeetingId] = useState<number | null>(null)
    const [editingMeeting, setEditingMeeting] = useState<WeeklyMeeting | null>(null)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [meetingToDelete, setMeetingToDelete] = useState<WeeklyMeeting | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [memberSearch, setMemberSearch] = useState('')
    const isMeetingFormLoading = isModalOpen && (loadingUsers || loadingDepartments)

    // Fetch daily meeting configs on component mount
    useEffect(() => {
        const fetchDailyMeetings = async () => {
            try {
                setLoadingMeetings(true)
                const baseUrl = localStorage.getItem('baseUrl')
                const token = localStorage.getItem('token')

                if (!baseUrl || !token) {
                    console.warn('Missing baseUrl or token in localStorage')
                    return
                }

                const response = await axios.get(
                    `https://${baseUrl}/daily_meeting_configs`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                const data = response.data
                setDailyMeetings(Array.isArray(data) ? data : data.data || [])
            } catch (error) {
                console.error('Error fetching daily meetings:', error)
                toast.error('Failed to load daily meetings')
            } finally {
                setLoadingMeetings(false)
            }
        }

        if (isModalOpen) {
            fetchDailyMeetings()
        }
    }, [isModalOpen])

    // Fetch users for meeting head dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true)
                const baseUrl = localStorage.getItem('baseUrl')
                const token = localStorage.getItem('token')
                const organizationId = localStorage.getItem('org_id')

                if (!baseUrl || !token) {
                    console.warn('Missing baseUrl or token in localStorage')
                    return
                }

                const response = await axios.get(
                    `https://${baseUrl}/api/users.json?organization_id=${organizationId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                const data = response.data
                const usersList = Array.isArray(data) ? data : data.data || []
                setUsers(usersList)

                // Transform users to meeting members format
                const membersList: MeetingMember[] = usersList.map((user: User) => {
                    // Check if this user should be selected (for edit mode)
                    let isSelected = false
                    if (editingMeeting?.members && Array.isArray(editingMeeting.members)) {
                        isSelected = editingMeeting.members.some(m => m.id === user.id)
                    }

                    return {
                        id: String(user.id),
                        name: user.name || user.email,
                        email: user.email,
                        selected: isSelected
                    }
                })
                setMembers(membersList)
            } catch (error) {
                console.error('Error fetching users:', error)
                toast.error('Failed to load users')
            } finally {
                setLoadingUsers(false)
            }
        }

        if (isModalOpen) {
            fetchUsers()
        }
    }, [isModalOpen, editingMeeting])

    // Fetch departments for department dropdown
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setLoadingDepartments(true)
                const baseUrl = localStorage.getItem('baseUrl')
                const token = localStorage.getItem('token')

                if (!baseUrl || !token) {
                    console.warn('Missing baseUrl or token in localStorage')
                    return
                }

                const response = await axios.get(
                    `https://${baseUrl}/pms/departments.json`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                const data = response.data.departments
                setDepartments(Array.isArray(data) ? data : data.data || [])
            } catch (error) {
                console.error('Error fetching departments:', error)
                toast.error('Failed to load departments')
            } finally {
                setLoadingDepartments(false)
            }
        }

        if (isModalOpen) {
            fetchDepartments()
        }
    }, [isModalOpen])

    // Fetch weekly meetings on component mount
    useEffect(() => {
        const fetchWeeklyMeetings = async () => {
            try {
                setLoadingWeeklyMeetings(true)
                const baseUrl = localStorage.getItem('baseUrl')
                const token = localStorage.getItem('token')

                if (!baseUrl || !token) {
                    console.warn('Missing baseUrl or token in localStorage')
                    return
                }

                const response = await axios.get(
                    `https://${baseUrl}/weekly_meeting_configs`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                const data = response.data
                setWeeklyMeetings(Array.isArray(data) ? data : data.data || [])
            } catch (error) {
                console.error('Error fetching weekly meetings:', error)
                // Don't show error toast on initial load
            } finally {
                setLoadingWeeklyMeetings(false)
            }
        }

        fetchWeeklyMeetings()
    }, [])

    const handleMemberToggle = (memberId: string) => {
        setMembers(members.map(m =>
            m.id === memberId ? { ...m, selected: !m.selected } : m
        ))
    }

    const handleDepartmentToggle = (departmentId: string) => {
        setSelectedDepartmentIds((prev) =>
            prev.includes(departmentId)
                ? prev.filter((id) => id !== departmentId)
                : [...prev, departmentId]
        )
    }

    const handleMeetingHeadToggle = (userId: string) => {
        setSelectedMeetingHeadIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        )
    }

    const resetMeetingForm = () => {
        setMeetingName('')
        setSelectedMeetingHeadIds([])
        setMeetingHeadSearch('')
        setDayOfWeek('Monday')
        setTime('00:00')
        setDuration('60')
        setSelectedDepartmentIds([])
        setMembers((prev) => prev.map(m => ({ ...m, selected: false })))
        setSetAsDefault(false)
        setSelectedDailyMeeting('')
        setEditingMeeting(null)
        setEditingMeetingId(null)
        setMemberSearch('')
    }

    const handleOpenCreateMeeting = () => {
        resetMeetingForm()
        setIsModalOpen(true)
    }

    const handleEditMeeting = (meeting: WeeklyMeeting) => {
        setEditingMeeting(meeting)
        setMeetingName(meeting.name)
        setSelectedMeetingHeadIds(getMeetingHeadIds(meeting))

        // Convert day_of_week number back to string
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        setDayOfWeek(dayNames[meeting.day_of_week] || 'Monday')

        setTime(meeting.meeting_time)
        setDuration(String(meeting.duration_minutes))
        setSelectedDepartmentIds(getMeetingDepartmentIds(meeting))
        setSetAsDefault(meeting.is_default || false)

        // Don't need to manually set members here - it will be set when users are fetched
        // with editingMeeting in context for proper selection

        setSelectedDailyMeeting('')
        setIsModalOpen(true) // This triggers useEffect to fetch users with correct selection
    }

    const handleCopyDailyMeetingSettings = (meetingId: string) => {
        const meeting = dailyMeetings.find(m => String(m.id) === meetingId)
        if (meeting) {
            // Map daily meeting data to weekly form
            if (meeting.name) setMeetingName(`${meeting.name}`)
            setSelectedMeetingHeadIds(getMeetingHeadIds(meeting))
            if (meeting.time) setTime(meeting.time)
            if (meeting.duration) setDuration(String(meeting.duration))
            setSelectedDepartmentIds(getMeetingDepartmentIds(meeting))

            // Handle members from daily meeting
            if (meeting.members && Array.isArray(meeting.members)) {
                const dailyMeetingMemberIds = meeting.members.map(m => String(m.id))
                setMembers(members.map(m => ({
                    ...m,
                    selected: dailyMeetingMemberIds.includes(m.id)
                })))
            }
        }
    }

    const handleCreateMeeting = async () => {
        try {
            // Validation
            if (!meetingName || selectedMeetingHeadIds.length === 0 || !dayOfWeek || !time || !duration) {
                toast.error('Please fill in all required fields')
                return
            }

            setIsSubmitting(true)

            const baseUrl = localStorage.getItem('baseUrl')
            const token = localStorage.getItem('token')

            if (!baseUrl || !token) {
                toast.error('Missing authentication credentials')
                return
            }

            // Map day of week to number (Monday=1, Tuesday=2, etc.)
            const dayMapping: { [key: string]: number } = {
                'Monday': 1,
                'Tuesday': 2,
                'Wednesday': 3,
                'Thursday': 4,
                'Friday': 5,
                'Saturday': 6,
                'Sunday': 0
            }

            // Get selected member IDs
            const selectedMemberIds = members
                .filter(m => m.selected)
                .map(m => parseInt(m.id))
            const selectedMeetingHeadIdNumbers = selectedMeetingHeadIds.map(id => parseInt(id))
            const selectedDepartmentIdNumbers = selectedDepartmentIds.map(id => parseInt(id))

            // Prepare API payload
            const payload = {
                name: meetingName,
                meeting_head_ids: selectedMeetingHeadIdNumbers,
                day_of_week: dayMapping[dayOfWeek],
                meeting_time: time,
                duration_minutes: parseInt(duration),
                department_ids: selectedDepartmentIdNumbers,
                is_default: setAsDefault,
                member_ids: selectedMemberIds
            }

            // Submit to API - Create or Update
            if (editingMeeting) {
                // Update existing meeting
                await axios.put(
                    `https://${baseUrl}/weekly_meeting_configs/${editingMeeting.id}`,
                    payload,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )
                toast.success('Weekly meeting updated successfully')
            } else {
                // Create new meeting
                await axios.post(
                    `https://${baseUrl}/weekly_meeting_configs`,
                    payload,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )
                toast.success('Weekly meeting created successfully')
            }

            // Refresh weekly meetings list
            const listResponse = await axios.get(
                `https://${baseUrl}/weekly_meeting_configs`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            setWeeklyMeetings(Array.isArray(listResponse.data) ? listResponse.data : listResponse.data.data || [])

            // Reset form
            resetMeetingForm()
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error creating meeting:', error)
            toast.error('Failed to create weekly meeting')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteMeeting = async () => {
        if (!meetingToDelete) return

        try {
            setIsDeleting(true)
            const baseUrl = localStorage.getItem('baseUrl')
            const token = localStorage.getItem('token')

            if (!baseUrl || !token) {
                toast.error('Missing authentication')
                return
            }

            await axios.delete(
                `https://${baseUrl}/weekly_meeting_configs/${meetingToDelete.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )

            toast.success('Weekly meeting deleted successfully')

            // Refresh weekly meetings list
            const response = await axios.get(
                `https://${baseUrl}/weekly_meeting_configs`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            setWeeklyMeetings(Array.isArray(response.data) ? response.data : response.data.data || [])
            setIsDeleteConfirmOpen(false)
            setMeetingToDelete(null)
        } catch (error) {
            console.error('Error deleting meeting:', error)
            toast.error('Failed to delete weekly meeting')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="mt-6 space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] p-6 shadow-sm">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">Weekly Meeting Configurations</h2>
                        <p className="text-neutral-500 text-sm mt-1">Configure recurring weekly meetings and their participants</p>
                    </div>
                    <Button
                        onClick={handleOpenCreateMeeting}
                        className="h-10 gap-2 rounded-xl bg-[#DA7756] px-4 font-bold text-white hover:bg-[#c9673f]"
                    >
                        <Plus className="w-4 h-4" />
                        New Meeting
                    </Button>
                </div>

                {/* Meetings List or Empty State */}
                {loadingWeeklyMeetings ? (
                    // Loading State
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white animate-pulse">
                                <Skeleton className="h-5 w-32 mb-3" />
                                <Skeleton className="h-4 w-40 mb-2" />
                                <Skeleton className="h-4 w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : weeklyMeetings.length > 0 ? (
                    // Meetings List - Grid Layout
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {weeklyMeetings.map((meeting) => {
                            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                            const dayName = dayNames[meeting.day_of_week] || 'Unknown'
                            const meetingDepartmentLabels = getMeetingDepartmentLabels(meeting)
                            const meetingHeadLabels = getMeetingHeadLabels(meeting)

                            return (
                                <div key={meeting.id} className="border-l-4 border-l-[#5B7DFF] bg-white rounded-[10px] p-5 shadow-md transition-shadow">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-bold text-[#1a1a1a]">{meeting.name}</h3>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem
                                                    onClick={() => handleEditMeeting(meeting)}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setMeetingToDelete(meeting)
                                                        setIsDeleteConfirmOpen(true)
                                                    }}
                                                    className="flex items-center gap-2 cursor-pointer text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Time Badge */}
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-100 text-[#5B7DFF] rounded-full text-xs font-semibold mb-4">
                                        <Clock className="w-3.5 h-3.5" />
                                        {dayName} · {meeting.meeting_time} ({meeting.duration_minutes}m)
                                    </div>

                                    {meetingDepartmentLabels.length > 0 && (
                                        <div className="mb-3 flex flex-wrap gap-1.5">
                                            {meetingDepartmentLabels.slice(0, 3).map((departmentName) => (
                                                <span
                                                    key={departmentName}
                                                    className="rounded-full bg-[#fef6f4] px-2.5 py-1 text-xs font-semibold text-[#DA7756]"
                                                >
                                                    {departmentName}
                                                </span>
                                            ))}
                                            {meetingDepartmentLabels.length > 3 && (
                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                                    +{meetingDepartmentLabels.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Attendance */}
                                    {meeting.members && (
                                        <div className="mb-3 pt-3">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ATTENDANCE APR</p>
                                                <span className="text-xs font-bold text-red-500">0%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                                            </div>
                                            <div className="flex gap-3 mt-2">
                                                <span className="flex items-center gap-1 text-xs text-gray-600">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>Done
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-gray-600">
                                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>Missed
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-gray-600">
                                                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>Holiday
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-gray-600">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>Upcoming
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Meeting Head */}
                                    {meetingHeadLabels.length > 0 && (
                                        <div className="mb-3 pt-3">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">MEETING HEADS</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {meetingHeadLabels.slice(0, 3).map((headName) => (
                                                        <div
                                                            key={headName}
                                                            className="w-9 h-9 rounded-full bg-[#5B7DFF] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 border-2 border-white"
                                                            title={headName}
                                                        >
                                                            {headName?.charAt(0).toUpperCase()}
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
                                                    {meetingHeadLabels.slice(0, 2).join(', ')}
                                                    {meetingHeadLabels.length > 2 ? ` +${meetingHeadLabels.length - 2}` : ''}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Members */}
                                    {meeting.members && meeting.members.length > 0 && (
                                        <div className="pt-3">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">MEMBERS {meeting.members.length}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {meeting.members.slice(0, 3).map((member, index) => (
                                                        <div
                                                            key={member.id}
                                                            className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 border-2 border-white"
                                                            title={member.name}
                                                        >
                                                            {member.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-600 font-medium">
                                                    {meeting.members.slice(0, 2).map(m => m.name?.split(' ')[0]).join(', ')}
                                                    {meeting.members.length > 2 ? '...' : ''}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center space-y-6 rounded-2xl border border-[#DA7756]/15 bg-[#fef6f4] py-20 text-center">
                        <div className="rounded-2xl border border-[#DA7756]/15 bg-white p-4">
                            <Calendar className="w-12 h-12 text-[#DA7756]" strokeWidth={1.5} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[#1a1a1a] font-bold text-lg">No weekly meetings configured</h3>
                            <p className="text-neutral-500 text-sm">Create your first weekly meeting configuration to get started</p>
                        </div>
                        <Button
                            onClick={handleOpenCreateMeeting}
                            className="h-11 gap-2 rounded-xl bg-[#DA7756] px-6 font-bold text-white hover:bg-[#c9673f]"
                        >
                            <Plus className="w-5 h-5" />
                            Create Meeting
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Weekly Meeting Modal */}
            <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open)
                if (!open) {
                    // Reset form when closing
                    resetMeetingForm()
                }
            }}>
                <DialogContent className="flex h-[88vh] max-h-[88vh] max-w-4xl flex-col gap-0 overflow-hidden rounded-2xl border-gray-200 bg-[#fffaf8] p-0 shadow-2xl">
                    {/* Header with Theme Color */}
                    <DialogHeader className="border-b border-[#DA7756]/15 bg-white px-6 py-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fef6f4] text-[#DA7756]">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <DialogTitle className="text-xl font-bold leading-6 text-[#1a1a1a]">
                                        {editingMeeting ? 'Edit Weekly Meeting' : 'Create Weekly Meeting'}
                                    </DialogTitle>
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Configure schedule, departments, meeting head, and participants.
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsModalOpen(false)}
                                className="h-9 w-9 shrink-0 rounded-full text-neutral-500 hover:bg-[#fef6f4] hover:text-[#DA7756]"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6">
                        {isMeetingFormLoading ? (
                            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#DA7756]/15 bg-white text-center shadow-sm">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fef6f4] text-[#DA7756]">
                                    <Loader2 className="h-7 w-7 animate-spin" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-[#1a1a1a]">
                                    Loading meeting setup
                                </h3>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Fetching meeting heads, departments, and members...
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Copy Settings Section - Only show in create mode */}
                                {!editingMeeting && (
                            <div className="rounded-xl border border-[#DA7756]/15 bg-white p-4 shadow-sm">
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Copy settings from daily meeting:
                                </Label>
                                <Select
                                    value={selectedDailyMeeting}
                                    onValueChange={(value) => {
                                        setSelectedDailyMeeting(value)
                                        if (value) {
                                            handleCopyDailyMeetingSettings(value)
                                        }
                                    }}
                                    disabled={loadingMeetings}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={loadingMeetings ? "Loading meetings..." : "Select meeting"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dailyMeetings.length > 0 ? (
                                            dailyMeetings.map((meeting) => (
                                                <SelectItem
                                                    key={meeting.id}
                                                    value={String(meeting.id)}
                                                >
                                                    {meeting.name}
                                                </SelectItem>
                                            ))
                                        ) : null}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Meeting Name */}
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="mb-4">
                                <h3 className="text-sm font-bold text-[#1a1a1a]">Meeting Details</h3>
                                <p className="mt-0.5 text-xs text-neutral-500">Name the meeting and choose who owns it.</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="meetingName" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Meeting Name *
                                    </Label>
                                    <Input
                                        id="meetingName"
                                        placeholder="e.g., Sales Team Weekly Review"
                                        value={meetingName}
                                        onChange={(e) => setMeetingName(e.target.value)}
                                        className="w-full rounded-lg"
                                    />
                                </div>

                                {/* Meeting Head */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Meeting Heads *
                                    </Label>
                                    <div className="rounded-lg border border-gray-200 bg-white">
                                        <div className="flex min-h-11 flex-wrap items-center gap-2 border-b border-gray-100 px-3 py-2">
                                            {selectedMeetingHeadIds.length > 0 ? (
                                                selectedMeetingHeadIds.map((userId) => {
                                                    const user = users.find((item) => String(item.id) === userId)
                                                    return (
                                                        <span
                                                            key={userId}
                                                            className="inline-flex items-center gap-1 rounded-full bg-[#fef6f4] px-2.5 py-1 text-xs font-semibold text-[#DA7756]"
                                                        >
                                                            {user ? getUserLabel(user) : `User ${userId}`}
                                                            <button
                                                                type="button"
                                                                className="rounded-full text-[#DA7756]/70 hover:text-[#c9673f]"
                                                                onClick={() => handleMeetingHeadToggle(userId)}
                                                                aria-label="Remove meeting head"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </span>
                                                    )
                                                })
                                            ) : (
                                                <span className="text-sm text-gray-400">
                                                    Select meeting heads
                                                </span>
                                            )}
                                        </div>
                                        <div className="border-b border-gray-100 p-3">
                                            <div className="relative">
                                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    placeholder="Search meeting heads by name or email..."
                                                    value={meetingHeadSearch}
                                                    onChange={(e) => setMeetingHeadSearch(e.target.value)}
                                                    className="w-full rounded-lg pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-44 overflow-y-auto">
                                            {users
                                                .filter((user) => {
                                                    const query = meetingHeadSearch.trim().toLowerCase()
                                                    if (!query) return true
                                                    return (
                                                        getUserLabel(user).toLowerCase().includes(query) ||
                                                        String(user.email || '').toLowerCase().includes(query)
                                                    )
                                                })
                                                .map((user) => {
                                                    const userId = String(user.id)
                                                    return (
                                                        <label
                                                            key={user.id}
                                                            className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50"
                                                        >
                                                            <Checkbox
                                                                checked={selectedMeetingHeadIds.includes(userId)}
                                                                onCheckedChange={() => handleMeetingHeadToggle(userId)}
                                                                className="data-[state=checked]:bg-[#DA7756] data-[state=checked]:border-[#DA7756]"
                                                            />
                                                            <span className="min-w-0">
                                                                <span className="block truncate text-sm font-semibold text-gray-900">
                                                                    {getUserLabel(user)}
                                                                </span>
                                                                <span className="block truncate text-xs text-gray-500">
                                                                    {user.email}
                                                                </span>
                                                            </span>
                                                        </label>
                                                    )
                                                })}
                                            {users.filter((user) => {
                                                const query = meetingHeadSearch.trim().toLowerCase()
                                                if (!query) return true
                                                return (
                                                    getUserLabel(user).toLowerCase().includes(query) ||
                                                    String(user.email || '').toLowerCase().includes(query)
                                                )
                                            }).length === 0 && (
                                                    <p className="px-4 py-3 text-sm text-gray-500">No meeting heads found</p>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Day of Week, Time, Duration */}
                        <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-3">
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Day of Week *
                                </Label>
                                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Monday">Monday</SelectItem>
                                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                                        <SelectItem value="Thursday">Thursday</SelectItem>
                                        <SelectItem value="Friday">Friday</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="time" className="text-sm font-medium text-gray-700 mb-2 block">
                                    Time *
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-2 block">
                                    Duration (min) *
                                </Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Department */}
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                Departments (Optional)
                            </Label>
                            <p className="mb-3 text-xs text-neutral-500">
                                Choose one or more departments for this weekly meeting.
                            </p>
                            <div className="rounded-lg border border-gray-200 bg-white">
                                <div className="flex min-h-11 flex-wrap items-center gap-2 border-b border-gray-100 px-3 py-2">
                                    {selectedDepartmentIds.length > 0 ? (
                                        selectedDepartmentIds.map((deptId) => {
                                            const dept = departments.find((item) => String(item.id) === deptId)
                                            return (
                                                <span
                                                    key={deptId}
                                                    className="inline-flex items-center gap-1 rounded-full bg-[#fef6f4] px-2.5 py-1 text-xs font-semibold text-[#DA7756]"
                                                >
                                                    {dept ? getDepartmentLabel(dept) : `Department ${deptId}`}
                                                    <button
                                                        type="button"
                                                        className="rounded-full text-[#DA7756]/70 hover:text-[#c9673f]"
                                                        onClick={() => handleDepartmentToggle(deptId)}
                                                        aria-label="Remove department"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            )
                                        })
                                    ) : (
                                        <span className="text-sm text-gray-400">
                                            {loadingDepartments ? "Loading departments..." : "Select departments"}
                                        </span>
                                    )}
                                </div>
                                <div className="max-h-44 overflow-y-auto">
                                    {loadingDepartments ? (
                                        <div className="space-y-2 p-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <Skeleton className="h-4 w-4 rounded" />
                                                    <Skeleton className="h-4 w-36 rounded" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : departments.length > 0 ? (
                                        departments.map((dept) => {
                                            const deptId = String(dept.id)
                                            return (
                                                <label
                                                    key={dept.id}
                                                    className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50"
                                                >
                                                    <Checkbox
                                                        checked={selectedDepartmentIds.includes(deptId)}
                                                        onCheckedChange={() => handleDepartmentToggle(deptId)}
                                                        className="data-[state=checked]:bg-[#DA7756] data-[state=checked]:border-[#DA7756]"
                                                    />
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {getDepartmentLabel(dept)}
                                                    </span>
                                                </label>
                                            )
                                        })
                                    ) : (
                                        <p className="px-4 py-3 text-sm text-gray-500">No departments available</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Meeting Members */}
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 block">
                                        Meeting Members
                                    </Label>
                                    <p className="mt-1 text-xs text-neutral-500">
                                        Select participants for this meeting.
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-[#DA7756]">
                                    {members.filter(member => member.selected).length} selected
                                </span>
                            </div>
                            <div className="relative mb-3">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Search members by name or email..."
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    className="w-full rounded-lg pl-9"
                                />
                            </div>
                            <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                                {loadingUsers ? (
                                    // Skeleton Loading State
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                                                <Skeleton className="h-4 w-4 rounded" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-4 w-32 rounded" />
                                                    <Skeleton className="h-3 w-40 rounded" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    // Actual Members List - Filtered
                                    (() => {
                                        const filteredMembers = members.filter(member =>
                                            member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                                            member.email.toLowerCase().includes(memberSearch.toLowerCase())
                                        )
                                        return filteredMembers.length > 0 ? (
                                            filteredMembers.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                                                >
                                                    <Checkbox
                                                        checked={member.selected}
                                                        onCheckedChange={() => handleMemberToggle(member.id)}
                                                        id={`member-${member.id}`}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <label
                                                            htmlFor={`member-${member.id}`}
                                                            className="text-sm font-medium text-gray-900 cursor-pointer"
                                                        >
                                                            {member.name}
                                                        </label>
                                                        <p className="text-xs text-gray-500">{member.email}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex items-center justify-center py-6 text-gray-500">
                                                <p className="text-sm">No members found</p>
                                            </div>
                                        )
                                    })()
                                )}
                            </div>
                        </div>

                        {/* Set as Default */}
                        <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
                            <Checkbox
                                checked={setAsDefault}
                                onCheckedChange={(checked) => setSetAsDefault(checked as boolean)}
                                id="setAsDefault"
                            />
                            <label
                                htmlFor="setAsDefault"
                                className="text-sm font-medium text-gray-900 cursor-pointer flex-1"
                            >
                                Set as default meeting
                            </label>
                        </div>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="shrink-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            className="h-10 rounded-lg px-6"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateMeeting}
                            className="h-10 px-6 text-white flex items-center gap-2 rounded-lg shadow-sm"
                            style={{ backgroundColor: THEME_COLOR }}
                            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = THEME_COLOR_DARK)}
                            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = THEME_COLOR)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {editingMeeting ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                editingMeeting ? 'Update Meeting' : 'Create Meeting'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-[420px] bg-white rounded-2xl border border-red-100 p-0 overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="px-6 pt-6 text-lg font-bold text-[#1a1a1a]">Delete Meeting?</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 px-6 pb-6">
                        <p className="text-gray-600">
                            Are you sure you want to delete <span className="font-semibold">{meetingToDelete?.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                disabled={isDeleting}
                                className="h-10 rounded-[8px] border-red-200 px-5 font-semibold text-[#DA7756] hover:bg-red-50 hover:text-[#c9673f]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteMeeting}
                                className="h-10 min-w-[104px] rounded-[8px] bg-[#DA7756] px-5 font-semibold text-white shadow-sm hover:bg-[#c9673f]"
                                style={{ backgroundColor: '#DA7756', color: '#ffffff' }}
                                onMouseEnter={(e) => {
                                    if (!isDeleting) e.currentTarget.style.backgroundColor = '#c9673f';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isDeleting) e.currentTarget.style.backgroundColor = '#DA7756';
                                }}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <span className="inline-flex items-center">
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Deleting...
                                    </span>
                                ) : (
                                    'Delete'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default WeeklyMeetingSettings
