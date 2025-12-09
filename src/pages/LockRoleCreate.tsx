import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const LockRoleCreate = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [lockFunctions, setLockFunctions] = useState([]);
  const [permissionsHash, setPermissionsHash] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    active: 1,
    role_for: "pms",
  });

  const standardActions = ["all", "create", "show", "update", "destroy"];
  const actionLabels = {
    all: "All",
    create: "Add",
    show: "View", 
    update: "Edit",
    destroy: "Disable"
  };

  useEffect(() => {
    const fetchLockFunctions = async () => {
      try {
        const response = await axios.get(`${baseURL}/lock_functions.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        const functionsData = Array.isArray(response.data) ? response.data : [];
        setLockFunctions(functionsData);

        const initialPermissions = {};
        functionsData.forEach(func => {
          initialPermissions[func.action_name] = {};
          standardActions.forEach(action => {
            initialPermissions[func.action_name][action] = "false";
          });
        });
        
        setPermissionsHash(initialPermissions);
      } catch (error) {
        console.error("Error fetching lock functions:", error);
        toast.error("Failed to fetch lock functions");
        setLockFunctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLockFunctions();
  }, [baseURL]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handlePermissionChange = (actionName, action, checked) => {
    setPermissionsHash(prevPermissions => {
      const updatedPermissions = { ...prevPermissions };
      
      if (!updatedPermissions[actionName]) {
        updatedPermissions[actionName] = {};
      }
      
      updatedPermissions[actionName][action] = checked ? "true" : "false";
      
      if (action === "all" && checked) {
        standardActions.forEach(act => {
          updatedPermissions[actionName][act] = "true";
        });
      }
      
      if (action === "all" && !checked) {
        standardActions.forEach(act => {
          updatedPermissions[actionName][act] = "false";
        });
      }
      
      if (action !== "all" && !checked) {
        updatedPermissions[actionName]["all"] = "false";
      }
      
      if (action !== "all" && checked) {
        const allOtherActionsChecked = standardActions
          .filter(act => act !== "all")
          .every(act => updatedPermissions[actionName][act] === "true");
          
        if (allOtherActionsChecked) {
          updatedPermissions[actionName]["all"] = "true";
        }
      }
      
      return updatedPermissions;
    });
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Role title is required";
      toast.error("Role title is required");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        lock_role: {
          name: formData.name,
          display_name: formData.name,
          access_level: null,
          access_to: null,
          active: formData.active,
          role_for: formData.role_for,
        },
        permissions_hash: permissionsHash,
        lock_modules: null
      };

      await axios.post(`${baseURL}/lock_roles.json`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Lock role created successfully");
      navigate("/setup-member/lock-role-list");
    } catch (error) {
      console.error("Error creating lock role:", error);
      toast.error(`Error creating lock role: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6 max-w-full h-[calc(100vh-50px)] overflow-y-auto">
        {/* Header with Back Button and Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-[#C72030] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Setup Member</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">User Module</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Create Role</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CREATE LOCK ROLE</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Role Details</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Role Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Role Title
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all`}
                    placeholder="Enter role title"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Active Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center pt-2">
                    <input
                      type="checkbox"
                      name="active"
                      id="isActive"
                      checked={formData.active === 1}
                      onChange={handleChange}
                      disabled={submitting}
                      className="w-4 h-4 text-[#8B0203] bg-gray-100 border-gray-300 rounded focus:ring-[#8B0203] focus:ring-2"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 cursor-pointer">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Permissions Table */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Role Permissions</h4>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#8B0203] rounded-full animate-spin" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table className="border-separate">
                      <TableHeader>
                        <TableRow className="hover:bg-gray-50" style={{ backgroundColor: "#e6e2d8" }}>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "250px" }}>
                            Functions
                          </TableHead>
                          {standardActions.map(action => (
                            <TableHead key={action} className="font-semibold text-gray-900 py-3 px-4 border-r text-center" style={{ borderColor: "#fff", width: "100px" }}>
                              {actionLabels[action]}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lockFunctions.length > 0 ? (
                          lockFunctions.map((func) => (
                            <TableRow key={func.id} className="hover:bg-gray-50 transition-colors">
                              <TableCell className="py-3 px-4 font-medium">{func.name}</TableCell>
                              {standardActions.map(action => (
                                <TableCell key={`${func.action_name}-${action}`} className="py-3 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-[#C72030] cursor-pointer"
                                    checked={permissionsHash[func.action_name]?.[action] === "true"}
                                    onChange={(e) => handlePermissionChange(func.action_name, action, e.target.checked)}
                                    disabled={submitting}
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={standardActions.length + 1} className="text-center py-12 text-gray-500">
                              No functions available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className={`px-8 py-2.5 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors font-medium ${
                    (submitting || loading) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                  className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockRoleCreate;