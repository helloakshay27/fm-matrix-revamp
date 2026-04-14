import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, UserPlus, Mail, User, Trash2, Link2, Copy } from "lucide-react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from "@mui/material";
import { toast } from "sonner";
import axios from "axios";

interface InternalUser {
  id: number;
  employee_type: string;
  full_name: string;
  is_category: boolean;
  user_type: string;
}

interface ShareItem {
  id: string;
  user_type: "internal" | "external";
  user_id: number | null;
  email: string | null;
  full_name?: string;
  access_level: "viewer" | "editor";
}

interface DocumentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shares: ShareItem[]) => void;
  initialShares?: ShareItem[];
  documentId?: number;
  publicUuid?: string | null;
}

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  backgroundColor: "white",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: { xs: 36, sm: 40, md: 45 },
    backgroundColor: "white",
    "& fieldset": {
      borderColor: "#ddd",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
    color: "#1a1a1a",
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    "&.Mui-focused": {
      color: "#C72030",
    },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const DocumentShareModal: React.FC<DocumentShareModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialShares = [],
  documentId,
  publicUuid,
}) => {
  const [shares, setShares] = useState<ShareItem[]>(initialShares);
  const [shareType, setShareType] = useState<"internal" | "external">(
    "internal"
  );
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [externalEmail, setExternalEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<"viewer" | "editor">("viewer");
  const [internalUsers, setInternalUsers] = useState<InternalUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Get organization ID from localStorage
  const getOrgId = () => {
    return localStorage.getItem("org_id") || sessionStorage.getItem("org_id") ;
  };

  const handleCopyShareLink = () => {
    if (!publicUuid) {
      toast.error("Public share link not available for this document");
      return;
    }

    const orgId = getOrgId();
    const shareLink = `${window.location.origin}/document/share/${publicUuid}?org_id=${orgId}`;

    navigator.clipboard.writeText(shareLink).then(
      () => {
        toast.success("Share link copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy link");
      }
    );
  };

  // Fetch internal users
  useEffect(() => {
    const fetchInternalUsers = async () => {
      setLoading(true);
      try {
        const baseUrl = localStorage.getItem("baseUrl") || "";
        const token = localStorage.getItem("token") || "";

        const response = await axios.get(
          `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setInternalUsers(response.data.users || []);
      } catch (error) {
        console.error("Error fetching internal users:", error);
        toast.error("Failed to load internal users");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchInternalUsers();
    }
  }, [isOpen]);

  const handleAddShare = () => {
    if (shareType === "internal") {
      if (!selectedUserId) {
        toast.error("Please select a user");
        return;
      }

      // Check if user already added
      const existingShare = shares.find(
        (s) => s.user_type === "internal" && s.user_id === selectedUserId
      );
      if (existingShare) {
        toast.error("This user is already added");
        return;
      }

      const selectedUser = internalUsers.find((u) => u.id === selectedUserId);
      if (!selectedUser) return;

      const newShare: ShareItem = {
        id: `internal-${selectedUserId}-${Date.now()}`,
        user_type: "internal",
        user_id: selectedUserId as number,
        email: null,
        full_name: selectedUser.full_name,
        access_level: accessLevel,
      };

      setShares([...shares, newShare]);
      setSelectedUserId("");
      toast.success(`Added ${selectedUser.full_name} as ${accessLevel}`);
    } else {
      if (!externalEmail) {
        toast.error("Please enter an email address");
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(externalEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Check if email already added
      const existingShare = shares.find(
        (s) => s.user_type === "external" && s.email === externalEmail
      );
      if (existingShare) {
        toast.error("This email is already added");
        return;
      }

      const newShare: ShareItem = {
        id: `external-${externalEmail}-${Date.now()}`,
        user_type: "external",
        user_id: null,
        email: externalEmail,
        access_level: accessLevel,
      };

      setShares([...shares, newShare]);
      setExternalEmail("");
      toast.success(`Added ${externalEmail} as ${accessLevel}`);
    }
  };

  const handleRemoveShare = (id: string) => {
    setShares(shares.filter((s) => s.id !== id));
    toast.success("Removed share access");
  };

  const handleUpdateAccessLevel = (
    id: string,
    newAccessLevel: "viewer" | "editor"
  ) => {
    setShares(
      shares.map((s) =>
        s.id === id ? { ...s, access_level: newAccessLevel } : s
      )
    );
  };

  const handleSave = () => {
    onSave(shares);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      modal={false}
    >
      <DialogContent
        className="max-w-3xl max-h-[82vh] overflow-y-auto bg-white z-[1001] border-none shadow-2xl p-0"
        aria-describedby="document-share-dialog-description"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#C72030]" />
            SHARE DOCUMENT
          </DialogTitle>
          <div className="flex items-center gap-2">
            {publicUuid && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyShareLink}
                className="h-8 gap-2 border-[#C72030] text-[#C72030] hover:bg-red-50"
              >
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Copy Link</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          <div id="document-share-dialog-description" className="sr-only">
            Share document with internal users and external emails with
            different access levels
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {/* Add Share Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Add People
            </h3>

            {/* Share Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => setShareType("internal")}
                className={`p-3 rounded-lg border-2 transition-all ${shareType === "internal"
                    ? "border-[#C72030] bg-red-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Internal User</span>
                </div>
              </button>
              <button
                onClick={() => setShareType("external")}
                className={`p-3 rounded-lg border-2 transition-all ${shareType === "external"
                    ? "border-[#C72030] bg-red-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">External Email</span>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Internal User / External Email Input */}
              {shareType === "internal" ? (
                <TextField
                  select
                  fullWidth
                  label="Select User"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value as number)}
                  variant="outlined"
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: selectMenuProps,
                  }}
                >
                  <MenuItem value="">
                    <em>Select a user</em>
                  </MenuItem>
                  {loading ? (
                    <MenuItem disabled>
                      <em>Loading users...</em>
                    </MenuItem>
                  ) : internalUsers.length === 0 ? (
                    <MenuItem disabled>
                      <em>No users found</em>
                    </MenuItem>
                  ) : (
                    internalUsers.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        <div className="flex flex-col w-full">
                          <span className="font-medium text-gray-900">
                            {user.full_name}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5">
                            {user.user_type}
                          </span>
                        </div>
                      </MenuItem>
                    ))
                  )}
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={externalEmail}
                  onChange={(e) => setExternalEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              )}

              {/* Access Level Selection */}
              <TextField
                select
                fullWidth
                label="Access Level"
                value={accessLevel}
                onChange={(e) =>
                  setAccessLevel(e.target.value as "viewer" | "editor")
                }
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                SelectProps={{
                  displayEmpty: true,
                  MenuProps: selectMenuProps,
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select access level</em>
                </MenuItem>
                <MenuItem value="viewer">
                  <div className="flex flex-col w-full">
                    <span className="font-medium text-gray-900">Viewer</span>
                    <span className="text-xs text-gray-500 mt-0.5">
                      Can view and download
                    </span>
                  </div>
                </MenuItem>
                <MenuItem value="editor">
                  <div className="flex flex-col w-full">
                    <span className="font-medium text-gray-900">Editor</span>
                    <span className="text-xs text-gray-500 mt-0.5">
                      Can view, download, and edit
                    </span>
                  </div>
                </MenuItem>
              </TextField>
            </div>

            {/* Add Button */}
            <Button
              onClick={handleAddShare}
              className="w-full mt-4 bg-[#C72030] hover:bg-[#A01828] text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Shared With List */}
          {shares.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">
                People with Access ({shares.length})
              </h3>
              <div className="space-y-2">
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${share.user_type === "internal"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                          }`}
                      >
                        {share.user_type === "internal" ? (
                          <User className="w-5 h-5" />
                        ) : (
                          <Mail className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-[#1a1a1a]">
                          {share.user_type === "internal"
                            ? share.full_name
                            : share.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {share.user_type === "internal"
                            ? "Internal User"
                            : "External Email"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FormControl sx={{ minWidth: 120 }} size="small">
                        <MuiSelect
                          value={share.access_level}
                          onChange={(e) =>
                            handleUpdateAccessLevel(
                              share.id,
                              e.target.value as "viewer" | "editor"
                            )
                          }
                          sx={{ height: "36px" }}
                        >
                          <MenuItem value="viewer">Viewer</MenuItem>
                          <MenuItem value="editor">Editor</MenuItem>
                        </MuiSelect>
                      </FormControl>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveShare(share.id)}
                        className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> People with access will be able to{" "}
              {shares.some((s) => s.access_level === "editor")
                ? "view, download, and edit"
                : "view and download"}{" "}
              this document based on their access level.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-2 bg-[#C72030] hover:bg-[#A01828] text-white shadow-lg"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
