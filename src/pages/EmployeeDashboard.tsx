import React, { useState, useEffect } from "react";
import { EmployeeHeader } from "@/components/EmployeeHeader";
import {
  Ticket,
  Users,
  Calendar,
  Package,
  FileText,
  Settings,
  CheckSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Available widgets configuration
const availableWidgets = [
  { id: "tickets", name: "My Tickets", icon: Ticket, color: "blue" },
  { id: "tasks", name: "My Tasks", icon: CheckSquare, color: "purple" },
  { id: "bookings", name: "My Bookings", icon: Calendar, color: "green" },
  {
    id: "documents",
    name: "Recent Documents",
    icon: FileText,
    color: "orange",
  },
  { id: "visitors", name: "Recent Visitors", icon: Users, color: "pink" },
  { id: "seats", name: "Recent Seat Bookings", icon: Package, color: "indigo" },
];

export const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Load visible widgets from localStorage
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem("employeeDashboardWidgets");
    return saved
      ? JSON.parse(saved)
      : ["tickets", "tasks", "bookings", "documents"];
  });

  // Save to localStorage when widgets change
  useEffect(() => {
    localStorage.setItem(
      "employeeDashboardWidgets",
      JSON.stringify(visibleWidgets)
    );
  }, [visibleWidgets]);

  const toggleWidget = (widgetId: string) => {
    setVisibleWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  // Mock data - replace with actual API calls
  const mockData = {
    tickets: [
      {
        id: 1,
        title: "AC not working in Meeting Room 2",
        status: "In Progress",
        priority: "High",
        date: "2 hours ago",
      },
      {
        id: 2,
        title: "Printer issue in Floor 3",
        status: "Open",
        priority: "Medium",
        date: "5 hours ago",
      },
      {
        id: 3,
        title: "Water cooler maintenance",
        status: "Resolved",
        priority: "Low",
        date: "1 day ago",
      },
    ],
    tasks: [
      {
        id: 1,
        title: "Complete project proposal",
        status: "In Progress",
        dueDate: "Today, 5:00 PM",
      },
      {
        id: 2,
        title: "Review design mockups",
        status: "Pending",
        dueDate: "Tomorrow",
      },
      {
        id: 3,
        title: "Team meeting preparation",
        status: "Completed",
        dueDate: "Yesterday",
      },
    ],
    bookings: [
      {
        id: 1,
        title: "Conference Room A",
        date: "Today, 2:00 PM - 3:00 PM",
        status: "Confirmed",
      },
      {
        id: 2,
        title: "Desk A-23",
        date: "Tomorrow, 9:00 AM",
        status: "Confirmed",
      },
      {
        id: 3,
        title: "Parking Slot B-12",
        date: "Today, 8:00 AM - 6:00 PM",
        status: "Active",
      },
    ],
    documents: [
      {
        id: 1,
        name: "Policy_Document.pdf",
        size: "2.4 MB",
        date: "2 days ago",
      },
      {
        id: 2,
        name: "Meeting_Notes.docx",
        size: "156 KB",
        date: "3 days ago",
      },
      {
        id: 3,
        name: "Guidelines.pdf",
        size: "1.8 MB",
        date: "1 week ago",
      },
    ],
    visitors: [
      {
        id: 1,
        name: "John Doe",
        purpose: "Business Meeting",
        status: "Approved",
        date: "4 hours ago",
      },
      {
        id: 2,
        name: "Jane Smith",
        purpose: "Interview",
        status: "Checked In",
        date: "1 day ago",
      },
      {
        id: 3,
        name: "Mike Johnson",
        purpose: "Delivery",
        status: "Completed",
        date: "2 days ago",
      },
    ],
    seats: [
      {
        id: 1,
        seat: "Desk A-23",
        floor: "Floor 3, Wing A",
        date: "Tomorrow, 9:00 AM",
        status: "Confirmed",
      },
      {
        id: 2,
        seat: "Desk B-15",
        floor: "Floor 2, Wing B",
        date: "Today, 2:00 PM",
        status: "Checked In",
      },
      {
        id: 3,
        seat: "Hot Desk - 5",
        floor: "Floor 1, Co-working",
        date: "Yesterday",
        status: "Completed",
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
      case "pending":
        return "text-orange-600 bg-orange-50";
      case "in progress":
      case "active":
      case "checked in":
        return "text-blue-600 bg-blue-50";
      case "resolved":
      case "completed":
      case "confirmed":
        return "text-green-600 bg-green-50";
      case "approved":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const renderWidget = (widgetId: string) => {
    const widget = availableWidgets.find((w) => w.id === widgetId);
    if (!widget) return null;

    const Icon = widget.icon;

    return (
      <div
        key={widgetId}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <span
              className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: "#E5E0D3" }}
            >
              <Icon size={16} color="#C72030" />
            </span>
            {widget.name}
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {widgetId === "tickets" && mockData.tickets.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No tickets found
              </div>
            )}
            {widgetId === "tickets" &&
              mockData.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                  onClick={() => navigate(`/tickets/details/${ticket.id}`)}
                >
                  <p className="font-medium text-gray-900 text-sm mb-2">
                    {ticket.title}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span
                      className={`px-2 py-1 rounded ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                    <span>{ticket.date}</span>
                  </div>
                </div>
              ))}

            {widgetId === "tasks" &&
              mockData.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                >
                  <p className="font-medium text-gray-900 text-sm mb-2">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-1 rounded ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                    <span className="text-gray-600">{task.dueDate}</span>
                  </div>
                </div>
              ))}

            {widgetId === "bookings" &&
              mockData.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                >
                  <p className="font-medium text-gray-900 text-sm mb-2">
                    {booking.title}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{booking.date}</span>
                    <span
                      className={`px-2 py-1 rounded ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}

            {widgetId === "documents" &&
              mockData.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                  onClick={() => navigate("/vas/documents")}
                >
                  <FileText className="w-8 h-8 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                </div>
              ))}

            {widgetId === "visitors" &&
              mockData.visitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                  onClick={() => navigate("/security/visitor/employee")}
                >
                  <p className="font-medium text-gray-900 text-sm mb-1">
                    {visitor.name}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    {visitor.purpose}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-1 rounded ${getStatusColor(
                        visitor.status
                      )}`}
                    >
                      {visitor.status}
                    </span>
                    <span className="text-gray-500">{visitor.date}</span>
                  </div>
                </div>
              ))}

            {widgetId === "seats" &&
              mockData.seats.map((seat) => (
                <div
                  key={seat.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                  onClick={() => navigate("/vas/space-management/bookings")}
                >
                  <p className="font-medium text-gray-900 text-sm mb-1">
                    {seat.seat}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">{seat.floor}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{seat.date}</span>
                    <span
                      className={`px-2 py-1 rounded ${getStatusColor(
                        seat.status
                      )}`}
                    >
                      {seat.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeHeader />

      <main className="pt-20 pb-8 px-6 max-w-[1400px] mx-auto">
        {/* Welcome Section with Edit Button */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Good afternoon,{" "}
              {localStorage.getItem("firstName") || "Akshay Shinde"}
            </h1>
          </div>

          {/* Customise Button */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                <Settings className="w-4 h-4" />
                Customise
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Edit widgets
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                {availableWidgets.map((widget) => {
                  const Icon = widget.icon;
                  const isSelected = visibleWidgets.includes(widget.id);
                  return (
                    <button
                      key={widget.id}
                      onClick={() => toggleWidget(widget.id)}
                      className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-[#C72030] bg-red-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Icon
                          className={`w-6 h-6 ${
                            isSelected ? "text-[#C72030]" : "text-gray-400"
                          }`}
                        />
                        <Checkbox
                          checked={isSelected}
                          className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                        />
                      </div>
                      <p
                        className={`font-medium text-sm ${
                          isSelected ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {widget.name}
                      </p>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-end pt-4 border-t gap-3">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-6 py-2 bg-[#C72030] text-white rounded-md hover:bg-[#a01828] transition-colors text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Widgets Grid */}
        {visibleWidgets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleWidgets.map((widgetId) => renderWidget(widgetId))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No widgets selected
            </h3>
            <p className="text-gray-600 mb-6">
              Click "Customise" to add widgets to your dashboard
            </p>
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-6 py-3 bg-[#C72030] text-white rounded-md hover:bg-[#a01828] transition-colors font-medium"
            >
              Add Widgets
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
