import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, X, Edit2, Bell, Calendar, BarChart3, MessageSquare } from "lucide-react";
import { toast } from "sonner";

// Define Communication sub-tab types
type CommunicationSubTab = "notice" | "events" | "polls" | "notifications";

// Sample data for Notice
const noticeSampleData = [
  { id: "1", sNo: 1, title: "Maintenance Schedule", description: "Building maintenance on Sunday", date: "2025-10-15", status: "Active" },
  { id: "2", sNo: 2, title: "Water Supply", description: "Water supply interruption notice", date: "2025-10-12", status: "Active" },
];

// Sample data for Events
const eventsSampleData = [
  { id: "1", sNo: 1, eventName: "Diwali Celebration", eventDate: "2025-10-25", location: "Community Hall", participants: 150 },
  { id: "2", sNo: 2, eventName: "Annual Meeting", eventDate: "2025-11-05", location: "Conference Room", participants: 50 },
];

// Sample data for Polls
const pollsSampleData = [
  { id: "1", sNo: 1, question: "Preferred time for yoga classes?", options: "Morning, Evening", status: "Active", votes: 45 },
  { id: "2", sNo: 2, question: "New amenity preference?", options: "Gym, Pool, Library", status: "Closed", votes: 120 },
];

// Sample data for Notifications
const notificationsSampleData = [
  { id: "1", sNo: 1, title: "Payment Reminder", message: "Monthly maintenance due", type: "Alert", sentDate: "2025-10-08" },
  { id: "2", sNo: 2, title: "Event Registration", message: "Register for Diwali celebration", type: "Info", sentDate: "2025-10-07" },
];

export const CommunicationSetupDashboard = () => {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<CommunicationSubTab>("notice");
  const [searchTerm, setSearchTerm] = useState("");

  // Notice states
  const [noticeData, setNoticeData] = useState(noticeSampleData);
  const [showNoticeDialog, setShowNoticeDialog] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDescription, setNoticeDescription] = useState("");
  const [noticeDate, setNoticeDate] = useState("");
  const [noticeStatus, setNoticeStatus] = useState("Active");

  // Events states
  const [eventsData, setEventsData] = useState(eventsSampleData);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventParticipants, setEventParticipants] = useState("");

  // Polls states
  const [pollsData, setPollsData] = useState(pollsSampleData);
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [editingPollId, setEditingPollId] = useState<string | null>(null);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState("");
  const [pollStatus, setPollStatus] = useState("Active");

  // Notifications states
  const [notificationsData, setNotificationsData] = useState(notificationsSampleData);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("Info");

  const getSubTabLabel = (tab: CommunicationSubTab): string => {
    const labels: Record<CommunicationSubTab, string> = {
      "notice": "Notice",
      "events": "Events",
      "polls": "Polls",
      "notifications": "Notifications",
    };
    return labels[tab];
  };

  // Notice handlers
  const handleAddNotice = () => {
    setEditingNoticeId(null);
    setNoticeTitle("");
    setNoticeDescription("");
    setNoticeDate("");
    setNoticeStatus("Active");
    setShowNoticeDialog(true);
  };

  const handleEditNotice = (id: string) => {
    const notice = noticeData.find((n) => n.id === id);
    if (notice) {
      setEditingNoticeId(id);
      setNoticeTitle(notice.title);
      setNoticeDescription(notice.description);
      setNoticeDate(notice.date);
      setNoticeStatus(notice.status);
      setShowNoticeDialog(true);
    }
  };

  const handleDeleteNotice = (id: string) => {
    setNoticeData(noticeData.filter((n) => n.id !== id));
    toast.success("Notice deleted successfully!");
  };

  const handleSaveNotice = () => {
    if (!noticeTitle.trim() || !noticeDescription.trim() || !noticeDate) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingNoticeId) {
      setNoticeData(
        noticeData.map((n) =>
          n.id === editingNoticeId
            ? { ...n, title: noticeTitle, description: noticeDescription, date: noticeDate, status: noticeStatus }
            : n
        )
      );
      toast.success("Notice updated successfully!");
    } else {
      const newNotice = {
        id: `notice-${Date.now()}`,
        sNo: noticeData.length + 1,
        title: noticeTitle,
        description: noticeDescription,
        date: noticeDate,
        status: noticeStatus,
      };
      setNoticeData([...noticeData, newNotice]);
      toast.success("Notice added successfully!");
    }

    setNoticeTitle("");
    setNoticeDescription("");
    setNoticeDate("");
    setNoticeStatus("Active");
    setEditingNoticeId(null);
    setShowNoticeDialog(false);
  };

  // Events handlers
  const handleAddEvent = () => {
    setEditingEventId(null);
    setEventName("");
    setEventDate("");
    setEventLocation("");
    setEventParticipants("");
    setShowEventDialog(true);
  };

  const handleEditEvent = (id: string) => {
    const event = eventsData.find((e) => e.id === id);
    if (event) {
      setEditingEventId(id);
      setEventName(event.eventName);
      setEventDate(event.eventDate);
      setEventLocation(event.location);
      setEventParticipants(event.participants.toString());
      setShowEventDialog(true);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEventsData(eventsData.filter((e) => e.id !== id));
    toast.success("Event deleted successfully!");
  };

  const handleSaveEvent = () => {
    if (!eventName.trim() || !eventDate || !eventLocation.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingEventId) {
      setEventsData(
        eventsData.map((e) =>
          e.id === editingEventId
            ? { ...e, eventName, eventDate, location: eventLocation, participants: parseInt(eventParticipants) || 0 }
            : e
        )
      );
      toast.success("Event updated successfully!");
    } else {
      const newEvent = {
        id: `event-${Date.now()}`,
        sNo: eventsData.length + 1,
        eventName,
        eventDate,
        location: eventLocation,
        participants: parseInt(eventParticipants) || 0,
      };
      setEventsData([...eventsData, newEvent]);
      toast.success("Event added successfully!");
    }

    setEventName("");
    setEventDate("");
    setEventLocation("");
    setEventParticipants("");
    setEditingEventId(null);
    setShowEventDialog(false);
  };

  // Polls handlers
  const handleAddPoll = () => {
    setEditingPollId(null);
    setPollQuestion("");
    setPollOptions("");
    setPollStatus("Active");
    setShowPollDialog(true);
  };

  const handleEditPoll = (id: string) => {
    const poll = pollsData.find((p) => p.id === id);
    if (poll) {
      setEditingPollId(id);
      setPollQuestion(poll.question);
      setPollOptions(poll.options);
      setPollStatus(poll.status);
      setShowPollDialog(true);
    }
  };

  const handleDeletePoll = (id: string) => {
    setPollsData(pollsData.filter((p) => p.id !== id));
    toast.success("Poll deleted successfully!");
  };

  const handleSavePoll = () => {
    if (!pollQuestion.trim() || !pollOptions.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingPollId) {
      setPollsData(
        pollsData.map((p) =>
          p.id === editingPollId
            ? { ...p, question: pollQuestion, options: pollOptions, status: pollStatus }
            : p
        )
      );
      toast.success("Poll updated successfully!");
    } else {
      const newPoll = {
        id: `poll-${Date.now()}`,
        sNo: pollsData.length + 1,
        question: pollQuestion,
        options: pollOptions,
        status: pollStatus,
        votes: 0,
      };
      setPollsData([...pollsData, newPoll]);
      toast.success("Poll added successfully!");
    }

    setPollQuestion("");
    setPollOptions("");
    setPollStatus("Active");
    setEditingPollId(null);
    setShowPollDialog(false);
  };

  // Notifications handlers
  const handleAddNotification = () => {
    setEditingNotificationId(null);
    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationType("Info");
    setShowNotificationDialog(true);
  };

  const handleEditNotification = (id: string) => {
    const notification = notificationsData.find((n) => n.id === id);
    if (notification) {
      setEditingNotificationId(id);
      setNotificationTitle(notification.title);
      setNotificationMessage(notification.message);
      setNotificationType(notification.type);
      setShowNotificationDialog(true);
    }
  };

  const handleDeleteNotification = (id: string) => {
    setNotificationsData(notificationsData.filter((n) => n.id !== id));
    toast.success("Notification deleted successfully!");
  };

  const handleSaveNotification = () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingNotificationId) {
      setNotificationsData(
        notificationsData.map((n) =>
          n.id === editingNotificationId
            ? { ...n, title: notificationTitle, message: notificationMessage, type: notificationType }
            : n
        )
      );
      toast.success("Notification updated successfully!");
    } else {
      const newNotification = {
        id: `notif-${Date.now()}`,
        sNo: notificationsData.length + 1,
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType,
        sentDate: new Date().toISOString().split('T')[0],
      };
      setNotificationsData([...notificationsData, newNotification]);
      toast.success("Notification added successfully!");
    }

    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationType("Info");
    setEditingNotificationId(null);
    setShowNotificationDialog(false);
  };

  const getCurrentData = () => {
    switch (activeSubTab) {
      case "notice":
        return noticeData;
      case "events":
        return eventsData;
      case "polls":
        return pollsData;
      case "notifications":
        return notificationsData;
      default:
        return [];
    }
  };

  const filteredData = getCurrentData().filter((item: any) => {
    const searchLower = searchTerm.toLowerCase();
    if (activeSubTab === "notice") {
      return item.title?.toLowerCase().includes(searchLower) || item.description?.toLowerCase().includes(searchLower);
    } else if (activeSubTab === "events") {
      return item.eventName?.toLowerCase().includes(searchLower) || item.location?.toLowerCase().includes(searchLower);
    } else if (activeSubTab === "polls") {
      return item.question?.toLowerCase().includes(searchLower);
    } else if (activeSubTab === "notifications") {
      return item.title?.toLowerCase().includes(searchLower) || item.message?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">Communication Setup</h1>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Sub-tabs Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveSubTab("notice")}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeSubTab === "notice"
                    ? "border-[#C72030] text-[#C72030] font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                Notice
              </button>

              <button
                onClick={() => setActiveSubTab("events")}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeSubTab === "events"
                    ? "border-[#C72030] text-[#C72030] font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Calendar className="w-5 h-5" />
                Events
              </button>

              <button
                onClick={() => setActiveSubTab("polls")}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeSubTab === "polls"
                    ? "border-[#C72030] text-[#C72030] font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Polls
              </button>

              <button
                onClick={() => setActiveSubTab("notifications")}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeSubTab === "notifications"
                    ? "border-[#C72030] text-[#C72030] font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Bell className="w-5 h-5" />
                Notifications
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <Button
                size="sm"
                onClick={() => {
                  if (activeSubTab === "notice") handleAddNotice();
                  else if (activeSubTab === "events") handleAddEvent();
                  else if (activeSubTab === "polls") handleAddPoll();
                  else if (activeSubTab === "notifications") handleAddNotification();
                }}
                className="bg-[#C72030] hover:bg-[#A61B28] text-white font-medium shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>

              <div className="relative">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
              {activeSubTab === "notice" && (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">S.No.</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No notices available
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item: any, index: number) => (
                        <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.sNo}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              item.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleEditNotice(item.id)}
                                className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteNotice(item.id)}
                                className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeSubTab === "events" && (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">S.No.</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Event Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Event Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Participants</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No events available
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item: any, index: number) => (
                        <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.sNo}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.eventName}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.eventDate}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.location}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.participants}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleEditEvent(item.id)}
                                className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(item.id)}
                                className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeSubTab === "polls" && (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">S.No.</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Question</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Options</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Votes</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No polls available
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item: any, index: number) => (
                        <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.sNo}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.question}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.options}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              item.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.votes}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleEditPoll(item.id)}
                                className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDeletePoll(item.id)}
                                className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeSubTab === "notifications" && (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">S.No.</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Message</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sent Date</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No notifications available
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item: any, index: number) => (
                        <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.sNo}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.message}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              item.type === "Alert" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.sentDate}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleEditNotification(item.id)}
                                className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteNotification(item.id)}
                                className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Notice Dialog */}
        <Dialog open={showNoticeDialog} onOpenChange={setShowNoticeDialog}>
          <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {editingNoticeId ? "Edit Notice" : "Add Notice"}
                </DialogTitle>
                <button
                  onClick={() => setShowNoticeDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="noticeTitle" className="text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="noticeTitle"
                    placeholder="Enter notice title"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="noticeDescription" className="text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="noticeDescription"
                    placeholder="Enter notice description"
                    value={noticeDescription}
                    onChange={(e) => setNoticeDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noticeDate" className="text-sm font-medium text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="noticeDate"
                    type="date"
                    value={noticeDate}
                    onChange={(e) => setNoticeDate(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noticeStatus" className="text-sm font-medium text-gray-700">
                    Status
                  </Label>
                  <select
                    id="noticeStatus"
                    value={noticeStatus}
                    onChange={(e) => setNoticeStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => setShowNoticeDialog(false)}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveNotice}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  {editingNoticeId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Event Dialog */}
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {editingEventId ? "Edit Event" : "Add Event"}
                </DialogTitle>
                <button
                  onClick={() => setShowEventDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName" className="text-sm font-medium text-gray-700">
                    Event Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="eventName"
                    placeholder="Enter event name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-sm font-medium text-gray-700">
                    Event Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventLocation" className="text-sm font-medium text-gray-700">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="eventLocation"
                    placeholder="Enter location"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventParticipants" className="text-sm font-medium text-gray-700">
                    Participants
                  </Label>
                  <Input
                    id="eventParticipants"
                    type="number"
                    placeholder="Enter number of participants"
                    value={eventParticipants}
                    onChange={(e) => setEventParticipants(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => setShowEventDialog(false)}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEvent}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  {editingEventId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Poll Dialog */}
        <Dialog open={showPollDialog} onOpenChange={setShowPollDialog}>
          <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {editingPollId ? "Edit Poll" : "Add Poll"}
                </DialogTitle>
                <button
                  onClick={() => setShowPollDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pollQuestion" className="text-sm font-medium text-gray-700">
                    Question <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pollQuestion"
                    placeholder="Enter poll question"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pollOptions" className="text-sm font-medium text-gray-700">
                    Options <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pollOptions"
                    placeholder="Enter options (comma separated)"
                    value={pollOptions}
                    onChange={(e) => setPollOptions(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pollStatus" className="text-sm font-medium text-gray-700">
                    Status
                  </Label>
                  <select
                    id="pollStatus"
                    value={pollStatus}
                    onChange={(e) => setPollStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => setShowPollDialog(false)}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePoll}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  {editingPollId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notification Dialog */}
        <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
          <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {editingNotificationId ? "Edit Notification" : "Add Notification"}
                </DialogTitle>
                <button
                  onClick={() => setShowNotificationDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationTitle" className="text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="notificationTitle"
                    placeholder="Enter notification title"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notificationMessage" className="text-sm font-medium text-gray-700">
                    Message <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="notificationMessage"
                    placeholder="Enter notification message"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notificationType" className="text-sm font-medium text-gray-700">
                    Type
                  </Label>
                  <select
                    id="notificationType"
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  >
                    <option value="Info">Info</option>
                    <option value="Alert">Alert</option>
                    <option value="Warning">Warning</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => setShowNotificationDialog(false)}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveNotification}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  {editingNotificationId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CommunicationSetupDashboard;
