import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  X,
  Loader2,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const THEME_COLOR = "#DA7756";
const THEME_COLOR_DARK = "#c9673f";
const BACKGROUND_COLOR = "#fffaf8";

interface MeetingMember {
  id: string;
  name: string;
  email: string;
  selected: boolean;
}

interface DailyMeetingConfig {
  id: number;
  name: string;
  [key: string]: any;
}

interface User {
  id: number;
  email: string;
  name: string;
  [key: string]: any;
}

interface Department {
  id: number;
  name: string;
  [key: string]: any;
}

interface WeeklyMeeting {
  id: number;
  name: string;
  day_of_week: number;
  meeting_time: string;
  duration_minutes: number;
  meeting_head?: { id: number; name: string; email: string };
  department?: { id: number; name: string };
  members?: Array<{ id: number; name: string; email: string }>;
  is_default?: boolean;
  [key: string]: any;
}

const SAMPLE_MEMBERS: MeetingMember[] = [
  {
    id: "1",
    name: "Adhip Shetty",
    email: "adhip.shetty@lockated.com",
    selected: false,
  },
  {
    id: "2",
    name: "Akshay Shinde",
    email: "akshay.shinde@lockated.com",
    selected: false,
  },
  {
    id: "3",
    name: "Akshit Baid",
    email: "akshit.baid@lockated.com",
    selected: false,
  },
  {
    id: "4",
    name: "Arun Mohan",
    email: "arun.mohan@lockated.com",
    selected: false,
  },
];

const WeeklyMeetingSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetingName, setMeetingName] = useState("");
  const [meetingHead, setMeetingHead] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [time, setTime] = useState("10:00 AM");
  const [duration, setDuration] = useState("60");
  const [department, setDepartment] = useState("");
  const [members, setMembers] = useState<MeetingMember[]>([]);
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [dailyMeetings, setDailyMeetings] = useState<DailyMeetingConfig[]>([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);
  const [selectedDailyMeeting, setSelectedDailyMeeting] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weeklyMeetings, setWeeklyMeetings] = useState<WeeklyMeeting[]>([]);
  const [loadingWeeklyMeetings, setLoadingWeeklyMeetings] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<number | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<WeeklyMeeting | null>(
    null
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<WeeklyMeeting | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch daily meeting configs on component mount
  useEffect(() => {
    const fetchDailyMeetings = async () => {
      try {
        setLoadingMeetings(true);
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");

        if (!baseUrl || !token) {
          console.warn("Missing baseUrl or token in localStorage");
          return;
        }

        const response = await axios.get(
          `https://${baseUrl}/daily_meeting_configs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        setDailyMeetings(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error fetching daily meetings:", error);
        toast.error("Failed to load daily meetings");
      } finally {
        setLoadingMeetings(false);
      }
    };

    if (isModalOpen) {
      fetchDailyMeetings();
    }
  }, [isModalOpen]);

  // Fetch users for meeting head dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const organizationId = localStorage.getItem("org_id");

        if (!baseUrl || !token) {
          console.warn("Missing baseUrl or token in localStorage");
          return;
        }

        const response = await axios.get(
          `https://${baseUrl}/api/users.json?organization_id=${organizationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        const usersList = Array.isArray(data) ? data : data.data || [];
        setUsers(usersList);

        // Transform users to meeting members format
        const membersList: MeetingMember[] = usersList.map((user: User) => {
          // Check if this user should be selected (for edit mode)
          let isSelected = false;
          if (
            editingMeeting?.members &&
            Array.isArray(editingMeeting.members)
          ) {
            isSelected = editingMeeting.members.some((m) => m.id === user.id);
          }

          return {
            id: String(user.id),
            name: user.name || user.email,
            email: user.email,
            selected: isSelected,
          };
        });
        setMembers(membersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    if (isModalOpen) {
      fetchUsers();
    }
  }, [isModalOpen, editingMeeting]);

  // Fetch departments for department dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");

        if (!baseUrl || !token) {
          console.warn("Missing baseUrl or token in localStorage");
          return;
        }

        const response = await axios.get(
          `https://${baseUrl}/pms/departments.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data.departments;
        setDepartments(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Failed to load departments");
      } finally {
        setLoadingDepartments(false);
      }
    };

    if (isModalOpen) {
      fetchDepartments();
    }
  }, [isModalOpen]);

  // Fetch weekly meetings on component mount
  useEffect(() => {
    const fetchWeeklyMeetings = async () => {
      try {
        setLoadingWeeklyMeetings(true);
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");

        if (!baseUrl || !token) {
          console.warn("Missing baseUrl or token in localStorage");
          return;
        }

        const response = await axios.get(
          `https://${baseUrl}/weekly_meeting_configs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        setWeeklyMeetings(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error fetching weekly meetings:", error);
        // Don't show error toast on initial load
      } finally {
        setLoadingWeeklyMeetings(false);
      }
    };

    fetchWeeklyMeetings();
  }, []);

  const handleMemberToggle = (memberId: string) => {
    setMembers(
      members.map((m) =>
        m.id === memberId ? { ...m, selected: !m.selected } : m
      )
    );
  };

  const handleEditMeeting = (meeting: WeeklyMeeting) => {
    setEditingMeeting(meeting);
    setMeetingName(meeting.name);
    setMeetingHead(String(meeting.meeting_head?.id || ""));

    // Convert day_of_week number back to string
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    setDayOfWeek(dayNames[meeting.day_of_week] || "Monday");

    setTime(meeting.meeting_time);
    setDuration(String(meeting.duration_minutes));
    setDepartment(String(meeting.department?.id || ""));
    setSetAsDefault(meeting.is_default || false);

    // Don't need to manually set members here - it will be set when users are fetched
    // with editingMeeting in context for proper selection

    setSelectedDailyMeeting("");
    setIsModalOpen(true); // This triggers useEffect to fetch users with correct selection
  };

  const handleCopyDailyMeetingSettings = (meetingId: string) => {
    const meeting = dailyMeetings.find((m) => String(m.id) === meetingId);
    if (meeting) {
      // Map daily meeting data to weekly form
      if (meeting.name) setMeetingName(`${meeting.name}`);
      if (meeting.meeting_head)
        setMeetingHead(String(meeting.meeting_head?.id || ""));
      if (meeting.time) setTime(meeting.time);
      if (meeting.duration) setDuration(String(meeting.duration));
      if (meeting.department)
        setDepartment(String(meeting.department?.id || ""));

      // Handle members from daily meeting
      if (meeting.members && Array.isArray(meeting.members)) {
        const dailyMeetingMemberIds = meeting.members.map((m) => String(m.id));
        setMembers(
          members.map((m) => ({
            ...m,
            selected: dailyMeetingMemberIds.includes(m.id),
          }))
        );
      }
    }
  };

  const handleCreateMeeting = async () => {
    try {
      // Validation
      if (!meetingName || !meetingHead || !dayOfWeek || !time || !duration) {
        toast.error("Please fill in all required fields");
        return;
      }

      setIsSubmitting(true);

      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");

      if (!baseUrl || !token) {
        toast.error("Missing authentication credentials");
        return;
      }

      // Map day of week to number (Monday=1, Tuesday=2, etc.)
      const dayMapping: { [key: string]: number } = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 0,
      };

      // Get selected member IDs
      const selectedMemberIds = members
        .filter((m) => m.selected)
        .map((m) => parseInt(m.id));

      // Prepare API payload
      const payload = {
        name: meetingName,
        meeting_head_id: parseInt(meetingHead),
        day_of_week: dayMapping[dayOfWeek],
        meeting_time: time,
        duration_minutes: parseInt(duration),
        department_id: department ? parseInt(department) : null,
        is_default: setAsDefault,
        member_ids: selectedMemberIds,
      };

      // Submit to API - Create or Update
      if (editingMeeting) {
        // Update existing meeting
        await axios.put(
          `https://${baseUrl}/weekly_meeting_configs/${editingMeeting.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Weekly meeting updated successfully");
      } else {
        // Create new meeting
        await axios.post(`https://${baseUrl}/weekly_meeting_configs`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Weekly meeting created successfully");
      }

      // Refresh weekly meetings list
      const listResponse = await axios.get(
        `https://${baseUrl}/weekly_meeting_configs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setWeeklyMeetings(
        Array.isArray(listResponse.data)
          ? listResponse.data
          : listResponse.data.data || []
      );

      // Reset form
      setMeetingName("");
      setMeetingHead("");
      setDayOfWeek("Monday");
      setTime("10:00 AM");
      setDuration("60");
      setDepartment("");
      setMembers(members.map((m) => ({ ...m, selected: false })));
      setSetAsDefault(false);
      setSelectedDailyMeeting("");
      setEditingMeeting(null);
      setEditingMeetingId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create weekly meeting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMeeting = async () => {
    if (!meetingToDelete) return;

    try {
      setIsDeleting(true);
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");

      if (!baseUrl || !token) {
        toast.error("Missing authentication");
        return;
      }

      await axios.delete(
        `https://${baseUrl}/weekly_meeting_configs/${meetingToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Weekly meeting deleted successfully");

      // Refresh weekly meetings list
      const response = await axios.get(
        `https://${baseUrl}/weekly_meeting_configs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWeeklyMeetings(
        Array.isArray(response.data) ? response.data : response.data.data || []
      );
      setIsDeleteConfirmOpen(false);
      setMeetingToDelete(null);
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast.error("Failed to delete weekly meeting");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="mt-6 space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] p-6 shadow-sm">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1a1a1a]">
              Weekly Meeting Configurations
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Configure recurring weekly meetings and their participants
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
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
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 bg-white animate-pulse"
              >
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
              const dayNames = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];
              const dayName = dayNames[meeting.day_of_week] || "Unknown";

              return (
                <div
                  key={meeting.id}
                  className="border-l-4 border-l-[#5B7DFF] bg-white rounded-[10px] p-5 shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-[#1a1a1a]">
                      {meeting.name}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 -mr-2"
                        >
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
                            setMeetingToDelete(meeting);
                            setIsDeleteConfirmOpen(true);
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
                    {dayName} · {meeting.meeting_time} (
                    {meeting.duration_minutes}m)
                  </div>

                  {/* Attendance */}
                  {meeting.members && (
                    <div className="mb-3 pt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          ATTENDANCE APR
                        </p>
                        <span className="text-xs font-bold text-red-500">
                          0%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-red-500 h-1.5 rounded-full"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Done
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Missed
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          Holiday
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Upcoming
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Meeting Head */}
                  {meeting.meeting_head && (
                    <div className="mb-3 pt-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        MEETING HEAD
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#5B7DFF] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {meeting.meeting_head.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {meeting.meeting_head.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {meeting.meeting_head.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Members */}
                  {meeting.members && meeting.members.length > 0 && (
                    <div className="pt-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        MEMBERS {meeting.members.length}
                      </p>
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
                          {meeting.members
                            .slice(0, 2)
                            .map((m) => m.name?.split(" ")[0])
                            .join(", ")}
                          {meeting.members.length > 2 ? "..." : ""}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center space-y-6 rounded-2xl border border-[#DA7756]/15 bg-[#fef6f4] py-20 text-center">
            <div className="rounded-2xl border border-[#DA7756]/15 bg-white p-4">
              <Calendar
                className="w-12 h-12 text-[#DA7756]"
                strokeWidth={1.5}
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-[#1a1a1a] font-bold text-lg">
                No weekly meetings configured
              </h3>
              <p className="text-neutral-500 text-sm">
                Create your first weekly meeting configuration to get started
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-11 gap-2 rounded-xl bg-[#DA7756] px-6 font-bold text-white hover:bg-[#c9673f]"
            >
              <Plus className="w-5 h-5" />
              Create Meeting
            </Button>
          </div>
        )}
      </div>

      {/* Create Weekly Meeting Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            // Reset form when closing
            setMeetingName("");
            setMeetingHead("");
            setDayOfWeek("Monday");
            setTime("10:00 AM");
            setDuration("60");
            setDepartment("");
            setMembers(members.map((m) => ({ ...m, selected: false })));
            setSetAsDefault(false);
            setSelectedDailyMeeting("");
            setEditingMeeting(null);
            setEditingMeetingId(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-0">
          {/* Header with Theme Color */}
          <DialogHeader className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <DialogTitle
                className="text-xl font-bold"
                style={{ color: THEME_COLOR }}
              >
                {editingMeeting
                  ? "Edit Weekly Meeting"
                  : "Create Weekly Meeting"}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 px-6 py-6">
            {/* Copy Settings Section - Only show in create mode */}
            {!editingMeeting && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Copy settings from daily meeting:
                </Label>
                <Select
                  value={selectedDailyMeeting}
                  onValueChange={(value) => {
                    setSelectedDailyMeeting(value);
                    if (value) {
                      handleCopyDailyMeetingSettings(value);
                    }
                  }}
                  disabled={loadingMeetings}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingMeetings
                          ? "Loading meetings..."
                          : "Select meeting"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {dailyMeetings.length > 0
                      ? dailyMeetings.map((meeting) => (
                          <SelectItem
                            key={meeting.id}
                            value={String(meeting.id)}
                          >
                            {meeting.name}
                          </SelectItem>
                        ))
                      : null}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Meeting Name */}
            <div>
              <Label
                htmlFor="meetingName"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Meeting Name *
              </Label>
              <Input
                id="meetingName"
                placeholder="e.g., Sales Team Weekly Review"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Meeting Head */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Meeting Head *
              </Label>
              <Select
                value={meetingHead}
                onValueChange={setMeetingHead}
                disabled={loadingUsers}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loadingUsers ? "Loading users..." : "Select meeting head"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {users.length > 0
                    ? users.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.firstname + " " + user.lastname || user.email}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
            </div>

            {/* Day of Week, Time, Duration */}
            <div className="grid grid-cols-3 gap-4">
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
                <Label
                  htmlFor="time"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
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
                <Label
                  htmlFor="duration"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
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
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Department (Optional)
              </Label>
              <Select
                value={department}
                onValueChange={setDepartment}
                disabled={loadingDepartments}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loadingDepartments
                        ? "Loading departments..."
                        : "Select department"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {departments.length > 0
                    ? departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.department_name}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
            </div>

            {/* Meeting Members */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Meeting Members
              </Label>
              <div className="border border-gray-200 rounded-lg bg-white max-h-48 overflow-y-auto">
                {loadingUsers ? (
                  // Skeleton Loading State
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
                      >
                        <Skeleton className="h-4 w-4 rounded" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32 rounded" />
                          <Skeleton className="h-3 w-40 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Actual Members List
                  members.map((member) => (
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
                )}
              </div>
            </div>

            {/* Set as Default */}
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Checkbox
                checked={setAsDefault}
                onCheckedChange={(checked) =>
                  setSetAsDefault(checked as boolean)
                }
                id="setAsDefault"
              />
              <label
                htmlFor="setAsDefault"
                className="text-sm font-medium text-gray-900 cursor-pointer flex-1"
              >
                Set as default meeting
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end border-t border-gray-200 pt-6">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="px-6"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateMeeting}
                className="px-6 text-white flex items-center gap-2"
                style={{ backgroundColor: THEME_COLOR }}
                onMouseEnter={(e) =>
                  !isSubmitting &&
                  (e.currentTarget.style.backgroundColor = THEME_COLOR_DARK)
                }
                onMouseLeave={(e) =>
                  !isSubmitting &&
                  (e.currentTarget.style.backgroundColor = THEME_COLOR)
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingMeeting ? "Updating..." : "Creating..."}
                  </>
                ) : editingMeeting ? (
                  "Update Meeting"
                ) : (
                  "Create Meeting"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#1a1a1a]">
              Delete Meeting?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{meetingToDelete?.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteMeeting}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WeeklyMeetingSettings;
