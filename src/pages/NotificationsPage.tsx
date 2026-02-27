import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = localStorage.getItem("baseUrl") || "";
    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        fetchAllNotifications();
    }, []);

    const fetchAllNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://${baseUrl}/user_notifications.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNotifications(response.data.unread_notifications || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification: any) => {
        try {
            // Mark as read via API
            await axios.get(
                `https://${baseUrl}/user_notifications/${notification.id}/mark_as_read.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update local state
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === notification.id ? { ...notif, read: true } : notif
                )
            );

            // Navigate based on notification type
            if (notification.ntype === "conversation") {
                navigate(
                    `/vas/channels/messages/${notification.payload.conversation_id}`
                );
            } else if (notification.ntype === "projectspace") {
                navigate(
                    `/vas/channels/groups/${notification.payload.project_space_id}`
                );
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
            // Still navigate even if API call fails
            if (notification.ntype === "conversation") {
                navigate(
                    `/vas/channels/messages/${notification.payload.conversation_id}`
                );
            } else if (notification.ntype === "projectspace") {
                navigate(
                    `/vas/channels/groups/${notification.payload.project_space_id}`
                );
            }
        }
    };

    const markAllAsRead = async () => {
        try {
            // Mark all as read in UI first
            setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));

            // Then call API for each notification (or batch if API supports it)
            const markAsReadPromises = notifications
                .filter((n) => !n.read)
                .map((notif) =>
                    axios.get(
                        `https://${baseUrl}/user_notifications/${notif.id}/mark_as_read.json`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                );

            await Promise.all(markAsReadPromises);
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Go back"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Notifications
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {unreadCount === 0
                                    ? "All caught up!"
                                    : `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <Button
                            onClick={markAllAsRead}
                            variant="outline"
                            className="gap-2 text-[#C72030] border-[#C72030] hover:bg-red-50"
                        >
                            <Check className="w-4 h-4" />
                            Mark all as read
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3 animate-pulse" />
                            <p className="text-gray-500">Loading notifications...</p>
                        </div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm font-medium text-gray-500">
                                No notifications
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                You're all caught up!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${!notification.read
                                        ? "border-l-[#C72030] bg-blue-50/30"
                                        : "border-l-transparent"
                                    }`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Status Indicator */}
                                    <div
                                        className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${!notification.read ? "bg-[#C72030]" : "bg-gray-300"
                                            }`}
                                    />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p
                                                    className={`text-base ${!notification.read
                                                            ? "font-bold text-gray-900"
                                                            : "font-medium text-gray-700"
                                                        }`}
                                                >
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-2 mb-3">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                                                {notification.time}
                                            </span>
                                        </div>

                                        {/* Badge */}
                                        <div className="flex gap-2">
                                            {notification.ntype === "conversation" && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                                >
                                                    Conversation
                                                </Badge>
                                            )}
                                            {notification.ntype === "projectspace" && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                                                >
                                                    Project Space
                                                </Badge>
                                            )}
                                            {!notification.read && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs bg-red-50 text-red-700 border-red-200"
                                                >
                                                    Unread
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
