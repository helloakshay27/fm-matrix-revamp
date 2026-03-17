import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchViUserDetail, clearSelectedUser } from "@/store/slices/viUsersSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, User, Mail, Phone, Building, MapPin, Calendar, Shield, Briefcase } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import moment from "moment";

export const ViewViUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const { selectedUser, detailLoading, error } = useAppSelector(
        (state) => state.viUsers
    );

    useEffect(() => {
        if (id) {
            dispatch(fetchViUserDetail(Number(id)));
        }

        return () => {
            dispatch(clearSelectedUser());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const getStatusBadge = (status: string | null | undefined) => {
        if (status === "approved" || status === "active") {
            return <Badge className="bg-green-600 text-white">Approved</Badge>;
        } else if (status === "pending") {
            return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
        } else if (status === "rejected") {
            return <Badge className="bg-red-500 text-white">Rejected</Badge>;
        }
        return <Badge className="bg-gray-500 text-white">{status || "Unknown"}</Badge>;
    };

    if (detailLoading) {
        return (
            <div className="w-full p-6 space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading user details...</div>
                </div>
            </div>
        );
    }

    if (!selectedUser) {
        return (
            <div className="w-full p-6 space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-500">User not found</div>
                </div>
            </div>
        );
    }

    const user = selectedUser;
    const permission = user.lock_user_permission;

    return (
        <div className="w-full p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-gray-300"
                    onClick={() => navigate(`/master/user/vi-users/edit/${id}`)}
                >
                    <Edit2 className="w-4 h-4" />
                    Edit
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Profile Section */}
                <div className="lg:col-span-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 space-y-6">
                            {/* Profile Picture */}
                            <div className="text-center">
                                <div className="w-32 h-32 mx-auto mb-4 relative">
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.fullname}
                                            className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#C72030] to-[#a01828] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                            <span className="text-4xl font-bold text-white">
                                                {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">{user.fullname}</h2>
                                <p className="text-sm text-gray-500">{permission?.designation || "No designation"}</p>
                                <div className="mt-2 flex justify-center gap-2">
                                    {getStatusBadge(permission?.status)}
                                    <Badge variant={user.active ? "default" : "secondary"}>
                                        {user.active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{user.email}</span>
                                </div>
                                {user.mobile && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">+{user.country_code} {user.mobile}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{user.work_location || "-"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Building className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{user.site_name}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Personal Information */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-[#C72030]" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">First Name</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{user.firstname || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Last Name</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{user.lastname || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Gender</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{user.gender || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Employee ID</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{user.org_user_id || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Employee Type</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1 capitalize">{user.employee_type || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">User Type</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{user.user_type || "-"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Work Information */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#C72030]" />
                                Work Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Department</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{permission?.department_name || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Role</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{permission?.role_name || user.lock_role?.name || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Designation</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{permission?.designation || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Circle</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{permission?.circle_name || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Cluster</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{user.cluster_name || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Site</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{user.site_name || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Work Location</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{user.work_location || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Work Type</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{permission?.work_type || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Joining Date</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">
                                        {permission?.joining_date ? moment(permission.joining_date).format("DD/MM/YYYY") : "-"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Access & Permissions */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[#C72030]" />
                                Access & Permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Access Level</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{permission?.access_level || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Web Enabled</label>
                                    <p className="mt-1">
                                        <Badge variant={permission?.web_enabled ? "default" : "secondary"}>
                                            {permission?.web_enabled ? "Yes" : "No"}
                                        </Badge>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Registration Source</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{permission?.registration_source || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Status</label>
                                    <p className="mt-1">{getStatusBadge(permission?.status)}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Daily PMS Report</label>
                                    <p className="mt-1">
                                        <Badge variant={permission?.daily_pms_report ? "default" : "secondary"}>
                                            {permission?.daily_pms_report ? "Enabled" : "Disabled"}
                                        </Badge>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">SAP Entity Name</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{permission?.sap_entity_name || "-"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Report To Information */}
                    {user.report_to?.id && (
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-gray-50">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-[#C72030]" />
                                    Reports To
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wide">Name</label>
                                        <p className="text-sm font-medium text-gray-800 mt-1">{user.report_to.name || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                                        <p className="text-sm font-medium text-gray-800 mt-1">{user.report_to.email || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wide">Mobile</label>
                                        <p className="text-sm font-medium text-gray-800 mt-1">{user.report_to.mobile || "-"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Timestamps */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#C72030]" />
                                Timestamps
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Created At</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">
                                        {user.created_at ? moment(user.created_at).format("DD/MM/YYYY HH:mm") : "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Updated At</label>
                                    <p className="text-sm font-medium text-gray-800 mt-1">
                                        {user.updated_at ? moment(user.updated_at).format("DD/MM/YYYY HH:mm") : "-"}
                                    </p>
                                </div>
                                {user.created_by?.name && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wide">Created By</label>
                                        <p className="text-sm font-medium text-gray-800 mt-1">{user.created_by.name}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
