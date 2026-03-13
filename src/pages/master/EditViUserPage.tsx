import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchViUserDetail, updateViUser, clearSelectedUser, fetchViRoles } from "@/store/slices/viUsersSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, User, Shield, Lock } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

export const EditViUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const { selectedUser, detailLoading, loading: updateLoading, error, viRoles, rolesLoading } = useAppSelector(
        (state) => state.viUsers
    );

    const [formData, setFormData] = useState({
        roleId: "",
        password: "",
        confirmPassword: "",
        webEnabled: false,
    });

    const [formErrors, setFormErrors] = useState({
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (id) {
            dispatch(fetchViUserDetail(Number(id)));
        }
        dispatch(fetchViRoles());

        return () => {
            dispatch(clearSelectedUser());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                roleId: selectedUser.role_id?.toString() || "",
                password: "",
                confirmPassword: "",
                webEnabled: selectedUser.lock_user_permission?.web_enabled || false,
            });
        }
    }, [selectedUser]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const validateForm = () => {
        const errors = {
            password: "",
            confirmPassword: "",
        };
        let isValid = true;

        if (formData.password) {
            if (formData.password.length < 6) {
                errors.password = "Password must be at least 6 characters";
                isValid = false;
            }
            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!id || !selectedUser) {
            toast.error("User information not found");
            return;
        }

        try {
            await dispatch(
                updateViUser({
                    userId: Number(id),
                    roleId: formData.roleId || undefined,
                    lockUserPermissionId: selectedUser.lock_user_permission?.id || undefined,
                    password: formData.password || undefined,
                    webEnabled: formData.webEnabled,
                })
            ).unwrap();

            toast.success("User updated successfully!");
            navigate(`/master/user/vi-users/view/${id}`);
        } catch (err) {
            console.error("Update failed:", err);
            toast.error("Failed to update user");
        }
    };

    const handleCancel = () => {
        navigate(`/master/user/vi-users/view/${id}`);
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
                <h1 className="text-xl font-semibold text-gray-800">Edit Vi User</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* User Info Section (Read-only) */}
                    <div className="lg:col-span-4">
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-6 space-y-6">
                                {/* Profile Picture */}
                                <div className="text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 relative">
                                        {user.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt={user.fullname}
                                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#C72030] to-[#a01828] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                                <span className="text-2xl font-bold text-white">
                                                    {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-800">{user.fullname}</h2>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    {user.mobile && (
                                        <p className="text-sm text-gray-500">+{user.country_code} {user.mobile}</p>
                                    )}
                                </div>

                                {/* Quick Info */}
                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Department:</span>
                                        <span className="font-medium">{permission?.department_name || "-"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Current Role:</span>
                                        <span className="font-medium">{permission?.role_name || user.lock_role?.name || "-"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Circle:</span>
                                        <span className="font-medium">{permission?.circle_name || "-"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Site:</span>
                                        <span className="font-medium">{user.site_name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Employee Type:</span>
                                        <span className="font-medium capitalize">{user.employee_type}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Editable Section */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Role Settings */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-gray-50">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-[#C72030]" />
                                    Role Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="roleId" className="text-sm font-medium text-gray-700">
                                            Role
                                        </Label>
                                        <Select
                                            value={formData.roleId}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({ ...prev, roleId: value }))
                                            }
                                        >
                                            <SelectTrigger className="w-full mt-1">
                                                <SelectValue placeholder="Select Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rolesLoading ? (
                                                    <div className="px-2 py-1 text-sm text-gray-500">Loading roles...</div>
                                                ) : Array.isArray(viRoles) && viRoles.length > 0 ? (
                                                    viRoles.map((role) => (
                                                        <SelectItem key={role.id} value={role.id.toString()}>
                                                            {role.title || role.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="px-2 py-1 text-sm text-gray-500">No roles available</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Access Settings */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-gray-50">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-[#C72030]" />
                                    Access Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Web Access Enabled
                                            </Label>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Allow this user to access the web portal
                                            </p>
                                        </div>
                                        <Switch
                                            checked={formData.webEnabled}
                                            onCheckedChange={(checked) =>
                                                setFormData((prev) => ({ ...prev, webEnabled: checked }))
                                            }
                                            className="data-[state=checked]:bg-[#C72030]"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Password Settings */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-gray-50">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-[#C72030]" />
                                    Password Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                            New Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, password: e.target.value }))
                                            }
                                            placeholder="Leave blank to keep current password"
                                            className="mt-1"
                                        />
                                        {formErrors.password && (
                                            <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                            Confirm Password
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                                            }
                                            placeholder="Confirm new password"
                                            className="mt-1"
                                        />
                                        {formErrors.confirmPassword && (
                                            <p className="text-xs text-red-500 mt-1">{formErrors.confirmPassword}</p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    Leave password fields blank if you don't want to change the password.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={updateLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#C72030] hover:bg-[#a01828] text-white"
                                disabled={updateLoading}
                            >
                                {updateLoading ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
