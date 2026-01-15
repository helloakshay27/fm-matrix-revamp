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
  UtensilsCrossed,
  ListTodo,
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
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";

// Available widgets configuration
const availableWidgets = [
  { id: "tickets", name: "My Tickets", icon: Ticket, color: "blue" },
  { id: "tasks", name: "My Tasks", icon: CheckSquare, color: "purple" },
  { id: "todos", name: "My To-Do", icon: ListTodo, color: "cyan" },
  { id: "bookings", name: "My Bookings", icon: Calendar, color: "green" },
  {
    id: "fnb",
    name: "Recent F&B Orders",
    icon: UtensilsCrossed,
    color: "amber",
  },
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
  const [isLoading, setIsLoading] = useState(false);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [recentFnBOrders, setRecentFnBOrders] = useState<any[]>([]);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [recentTodos, setRecentTodos] = useState<any[]>([]);
  const [recentSeatBookings, setRecentSeatBookings] = useState<any[]>([]);

  // Get user data from localStorage
  const userId = localStorage.getItem("userId") || "87989";
  const token = API_CONFIG.TOKEN;
  const baseUrl = API_CONFIG.BASE_URL;

  // Get user data from the stored user object (saved during sign-in)
  const getUserData = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return {
          firstName: user.firstname || "User",
          lastName: user.lastname || "",
          userId: user.id?.toString() || userId,
        };
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    return {
      firstName: "User",
      lastName: "",
      userId: userId,
    };
  };

  const userData = getUserData();
  const fullName =
    `${userData.firstName} ${userData.lastName}`.trim() || "User";

  // Load visible widgets from localStorage
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem("employeeDashboardWidgets");
    return saved ? JSON.parse(saved) : ["tickets", "tasks", "fnb", "todos"];
  });

  // Fetch recent tickets from API
  useEffect(() => {
    const fetchRecentTickets = async () => {
      if (!visibleWidgets.includes("tickets")) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}/pms/admin/complaints/recent_tickets.json?q[assigned_to_or_complaint_users_user_id_eq]=${userData.userId}&access_token=${token}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();

        // Map API data to our ticket format
        const mappedTickets = (data.complaints || [])
          .slice(0, 3)
          .map((complaint: any) => ({
            id: complaint.id,
            title: complaint.heading,
            status: complaint.issue_status,
            priority: complaint.priority,
            date: formatDate(complaint.created_at),
            ticket_number: complaint.ticket_number,
            color_code: complaint.color_code,
          }));

        setRecentTickets(mappedTickets);
      } catch (error) {
        console.error("Error fetching recent tickets:", error);
        toast.error("Failed to load recent tickets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTickets();
  }, [userData.userId, token, visibleWidgets]);

  // Fetch recent F&B orders from API
  useEffect(() => {
    const fetchRecentFnBOrders = async () => {
      if (!visibleWidgets.includes("fnb")) return;

      setIsLoading(true);
      try {
        // Use restaurant ID 123 as shown in the example URL
        const restaurantId = "123";
        const response = await fetch(
          `${baseUrl}${API_CONFIG.ENDPOINTS.FOOD_ORDERS}/${restaurantId}/food_orders.json?q[user_id_eq]=${userData.userId}&page=1&per_page=10&all=true&access_token=${token}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch F&B orders");
        }

        const data = await response.json();

        // Map API data to our F&B order format
        const mappedOrders = (data.food_orders || [])
          .slice(0, 3)
          .map((order: any) => ({
            id: order.id,
            restaurant_name: order.restaurant_name,
            status: order.status_name,
            total_amount: order.total_amount,
            item_count: order.item_count,
            date: order.created_at,
            items: order.items,
            color_code: order.statuses?.[0]?.color_code,
          }));

        setRecentFnBOrders(mappedOrders);
      } catch (error) {
        console.error("Error fetching F&B orders:", error);
        toast.error("Failed to load F&B orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentFnBOrders();
  }, [userData.userId, token, baseUrl, visibleWidgets]);

  // Fetch recent tasks from API
  useEffect(() => {
    const fetchRecentTasks = async () => {
      if (!visibleWidgets.includes("tasks")) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}${API_CONFIG.ENDPOINTS.MY_TASKS}?limit=3&access_token=${token}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();

        // Map API data to our task format
        const mappedTasks = (data.task_managements || []).map((task: any) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          dueDate: task.target_date,
          priority: task.priority,
          project: task.project_management?.name,
        }));

        setRecentTasks(mappedTasks);
      } catch (error) {
        console.error("Error fetching recent tasks:", error);
        toast.error("Failed to load recent tasks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTasks();
  }, [userData.userId, token, baseUrl, visibleWidgets]);

  // Fetch recent to-dos from API
  useEffect(() => {
    const fetchRecentTodos = async () => {
      if (!visibleWidgets.includes("todos")) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}${API_CONFIG.ENDPOINTS.MY_TODOS}?limit=3&access_token=${token}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch to-dos");
        }

        const data = await response.json();

        // Map API data to our to-do format
        const mappedTodos = (data || []).map((todo: any) => ({
          id: todo.id,
          title: todo.title,
          status: todo.status,
          dueDate: todo.target_date,
          task_management_id: todo.task_management_id,
        }));

        setRecentTodos(mappedTodos);
      } catch (error) {
        console.error("Error fetching recent to-dos:", error);
        toast.error("Failed to load to-dos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTodos();
  }, [userData.userId, token, baseUrl, visibleWidgets]);

  // Fetch recent seat bookings from API
  useEffect(() => {
    const fetchRecentSeatBookings = async () => {
      if (!visibleWidgets.includes("seats")) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}${API_CONFIG.ENDPOINTS.SEAT_BOOKINGS}?q[user_id_eq]=${userData.userId}&page=1&per_page=3&access_token=${token}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch seat bookings");
        }

        const data = await response.json();

        // Map API data to our seat booking format
        const mappedBookings = (data.seat_bookings || []).map(
          (booking: any) => ({
            id: booking.id,
            seat: booking.category,
            floor: `${booking.building}, ${booking.floor}`,
            date: booking.booking_date,
            status: booking.status,
            slots: booking.slots,
            booking_day: booking.booking_day,
          })
        );

        setRecentSeatBookings(mappedBookings);
      } catch (error) {
        console.error("Error fetching seat bookings:", error);
        toast.error("Failed to load seat bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentSeatBookings();
  }, [userData.userId, token, baseUrl, visibleWidgets]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else if (diffInDays === 1) {
      return "1 day ago";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

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

  // Data for widgets
  const mockData = {
    tickets: recentTickets,
    fnb: recentFnBOrders,
    tasks: recentTasks,
    todos: recentTodos,
    bookings: [],
    documents: [],
    visitors: [],
    seats: recentSeatBookings,
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
      case "pending":
        return "text-orange-600 bg-orange-50";
      case "in progress":
      case "active":
      case "checked in":
      case "wip":
      case "in_progress":
        return "text-blue-600 bg-blue-50";
      case "resolved":
      case "completed":
      case "confirmed":
      case "accepted":
      case "closed":
        return "text-green-600 bg-green-50";
      case "approved":
        return "text-green-600 bg-green-50";
      case "cancelled":
      case "canceled":
        return "text-red-600 bg-red-50";
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
            {widgetId === "tickets" && isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
                <p className="text-gray-500 text-sm">Loading tickets...</p>
              </div>
            )}
            {widgetId === "tickets" &&
              !isLoading &&
              mockData.tickets.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No tickets found
                </div>
              )}
            {widgetId === "tickets" &&
              !isLoading &&
              mockData.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer border border-gray-100"
                  onClick={() =>
                    navigate(`maintenance/ticket/employee/details/${ticket.id}`)
                  }
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900 text-sm flex-1">
                      {ticket.title}
                    </p>
                    {ticket.ticket_number && (
                      <span className="text-xs text-gray-500 ml-2 font-mono">
                        #{ticket.ticket_number}
                      </span>
                    )}
                  </div>
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

            {widgetId === "tasks" && isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
                <p className="text-gray-500 text-sm">Loading tasks...</p>
              </div>
            )}
            {widgetId === "tasks" &&
              !isLoading &&
              mockData.tasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No tasks found
                </div>
              )}
            {widgetId === "tasks" &&
              !isLoading &&
              mockData.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer border border-gray-100"
                  onClick={() => navigate(`/vas/tasks/${task.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900 text-sm flex-1">
                      {task.title}
                    </p>
                    {task.priority && (
                      <span
                        className={`text-xs ml-2 px-2 py-1 rounded ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    )}
                  </div>
                  {task.project && (
                    <p className="text-xs text-gray-500 mb-2">{task.project}</p>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-1 rounded ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                    <span className="text-gray-600">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "No due date"}
                    </span>
                  </div>
                </div>
              ))}

            {widgetId === "todos" && isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
                <p className="text-gray-500 text-sm">Loading to-dos...</p>
              </div>
            )}
            {widgetId === "todos" &&
              !isLoading &&
              mockData.todos.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No to-dos found
                </div>
              )}
            {widgetId === "todos" &&
              !isLoading &&
              mockData.todos.map((todo) => (
                <div
                  key={todo.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer border border-gray-100"
                  onClick={() => navigate("/vas/todo")}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900 text-sm flex-1">
                      {todo.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-1 rounded ${getStatusColor(
                        todo.status
                      )}`}
                    >
                      {todo.status}
                    </span>
                    <span className="text-gray-600">
                      {todo.dueDate
                        ? new Date(todo.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "No due date"}
                    </span>
                  </div>
                </div>
              ))}

            {widgetId === "bookings" && mockData.bookings.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No bookings found
              </div>
            )}
            {widgetId === "bookings" &&
              mockData.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer border border-gray-100"
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

            {widgetId === "documents" && mockData.documents.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No documents found
              </div>
            )}
            {widgetId === "documents" &&
              mockData.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-md hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer border border-gray-100"
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

            {widgetId === "visitors" && mockData.visitors.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No visitors found
              </div>
            )}
            {widgetId === "visitors" &&
              mockData.visitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer border border-gray-100"
                  onClick={() =>
                    navigate(`/security/visitor/employee/details/${visitor.id}`)
                  }
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

            {widgetId === "seats" && isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
                <p className="text-gray-500 text-sm">
                  Loading seat bookings...
                </p>
              </div>
            )}
            {widgetId === "seats" &&
              !isLoading &&
              mockData.seats.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No seat bookings found
                </div>
              )}
            {widgetId === "seats" &&
              !isLoading &&
              mockData.seats.map((seat) => (
                <div
                  key={seat.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer border border-gray-100"
                  onClick={() => navigate("/vas/space-management/bookings")}
                >
                  <p className="font-medium text-gray-900 text-sm mb-1">
                    {seat.seat}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">{seat.floor}</p>
                  {seat.slots && (
                    <p className="text-xs text-gray-500 mb-2">{seat.slots}</p>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {seat.booking_day
                        ? `${seat.booking_day}, ${seat.date}`
                        : seat.date}
                    </span>
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

            {widgetId === "fnb" && isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
                <p className="text-gray-500 text-sm">Loading F&B orders...</p>
              </div>
            )}
            {widgetId === "fnb" && !isLoading && mockData.fnb.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No recent F&B orders
              </div>
            )}
            {widgetId === "fnb" &&
              !isLoading &&
              mockData.fnb.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer border border-gray-100"
                  onClick={() =>
                    navigate(
                      `/vas/fnb/details/123/restaurant-order/${order.id}`
                    )
                  }
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {order.restaurant_name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {order.item_count} item
                        {order.item_count !== 1 ? "s" : ""} • ₹
                        {order.total_amount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-1 rounded ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-gray-500">{order.date}</span>
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
      <main className="pt-12 pb-8 px-6 w-full mx-auto">
        {/* Welcome Section with Edit Button */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Good afternoon, {fullName}
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
