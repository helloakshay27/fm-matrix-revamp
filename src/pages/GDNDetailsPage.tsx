import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
} from "@mui/material";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GDNApprovalLevel {
  level_id: number;
  level_name: string;
  status: string;
  approved_by: string | null;
  approved_at: string | null;
}

interface GDNInventory {
  inventory_name: string;
  quantity: number;
  purpose: string;
  reason: string;
  handed_over_to: string | null;
}

interface GDNDetails {
  gdn_date: string;
  description: string;
  status: string;
  all_level_approved: boolean;
  rejection_reason: string | null;
  approval_levels: GDNApprovalLevel[];
  inventories: GDNInventory[];
  can_take_action: boolean;
}

interface DispatchUser {
  id: string;
  name: string;
}

const toTitleCase = (value?: string | null) => {
  if (!value) return "-";

  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getUserName = (user: any) => {
  const fullName = String(user?.full_name ?? user?.name ?? "").trim();
  if (fullName) return fullName;

  const firstName = String(user?.firstname ?? user?.first_name ?? "").trim();
  const lastName = String(user?.lastname ?? user?.last_name ?? "").trim();
  const joinedName = `${firstName} ${lastName}`.trim();

  return joinedName || String(user?.email ?? user?.mobile ?? "User").trim();
};

const normalizeDispatchUsers = (items: any[]): DispatchUser[] =>
  items
    .map((user) => ({
      id: String(user?.id ?? user?.user_id ?? user?.value ?? ""),
      name: getUserName(user),
    }))
    .filter((user) => user.id && user.name);

const dispatchSelectSx = {
  "& .MuiInputLabel-root": {
    backgroundColor: "#fff",
    color: "#111827",
    fontSize: "14px",
    lineHeight: 1,
    px: "4px",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#111827",
  },
  "& .MuiOutlinedInput-root": {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "0px",
    minHeight: "54px",
    "& fieldset": {
      borderColor: "#d8d8d8",
    },
    "&:hover fieldset": {
      borderColor: "#c7c7c7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#d8d8d8",
      borderWidth: "1px",
    },
  },
  "& .MuiSelect-select": {
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    color: "#C72030",
    display: "flex",
    fontSize: "13px",
    height: "34px",
    lineHeight: "34px",
    margin: "10px 10px 8px",
    minHeight: "0 !important",
    padding: "0 32px 0 12px !important",
  },
  "& .MuiSelect-icon": {
    color: "#9ca3af",
    right: "14px",
  },
};

const dispatchMenuProps = {
  PaperProps: {
    sx: {
      mt: 0.5,
      maxHeight: 180,
      borderRadius: "0px",
      boxShadow: "0 8px 18px rgba(15, 23, 42, 0.16)",
      zIndex: 1600,
      "& .MuiMenuItem-root": {
        minHeight: 34,
        whiteSpace: "normal",
        wordBreak: "break-word",
        fontSize: "13px",
      },
    },
  },
  MenuListProps: {
    dense: true,
  },
};

export const GDNDetailsPage = () => {
  const { id } = useParams();
  const [gdnDetails, setGdnDetails] = useState<GDNDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [dispatchDialogOpen, setDispatchDialogOpen] = useState(false);
  const [handOverUsers, setHandOverUsers] = useState<DispatchUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedHandOverTo, setSelectedHandOverTo] = useState("");
  const [dispatchSubmitting, setDispatchSubmitting] = useState(false);

  const fetchGdnDetails = async () => {
    if (!id) return;

    setLoading(true);

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      if (!baseUrl) {
        throw new Error("Base URL is not configured.");
      }

      const url = new URL(`/pms/srns/${id}/srn_show.json`, baseUrl);
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch GDN details (${response.status})`);
      }

      const result = await response.json();
      setGdnDetails({
        gdn_date: result.gdn_date || "",
        description: result.description || "",
        status: result.status || "",
        all_level_approved: Boolean(result.all_level_approved),
        rejection_reason: result.rejection_reason || null,
        approval_levels: Array.isArray(result.approval_levels)
          ? result.approval_levels
          : [],
        inventories: Array.isArray(result.inventories)
          ? result.inventories
          : [],
        can_take_action: Boolean(result.can_take_action),
      });
    } catch (error) {
      console.error("Error fetching GDN details:", error);
      toast.error("Failed to load GDN details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGdnDetails();
  }, [id]);

  const fetchHandOverUsers = async () => {
    setUsersLoading(true);

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      if (!baseUrl) {
        throw new Error("Base URL is not configured.");
      }

      const url = new URL("/pms/users/get_escalate_to_users.json", baseUrl);
      url.searchParams.set("per_page", "1000");

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users (${response.status})`);
      }

      const result = await response.json();
      const source = Array.isArray(result.users)
        ? result.users
        : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.fm_users)
            ? result.fm_users
            : [];

      setHandOverUsers(normalizeDispatchUsers(source));
    } catch (error) {
      console.error("Error fetching hand over users:", error);
      toast.error("Failed to load hand over users. Please try again.");
      setHandOverUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (dispatchDialogOpen && handOverUsers.length === 0) {
      fetchHandOverUsers();
    }
  }, [dispatchDialogOpen]);

  const handleDispatchDialogChange = (open: boolean) => {
    setDispatchDialogOpen(open);

    if (!open) {
      setSelectedHandOverTo("");
    }
  };

  const handleDispatchSubmit = async () => {
    if (!id) {
      toast.error("GDN ID is missing.");
      return;
    }

    if (!selectedHandOverTo) {
      toast.error("Please select hand over to.");
      return;
    }

    setDispatchSubmitting(true);

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      if (!baseUrl) {
        throw new Error("Base URL is not configured.");
      }

      const url = new URL(`/pms/srns/${id}/dispatch_now.json`, baseUrl);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          hand_over_to: Number(selectedHandOverTo),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.message ||
            errorData?.error ||
            `Failed to dispatch GDN (${response.status})`
        );
      }

      toast.success("GDN dispatched successfully.");
      handleDispatchDialogChange(false);
      fetchGdnDetails();
    } catch (error) {
      console.error("Error dispatching GDN:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to dispatch GDN."
      );
    } finally {
      setDispatchSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-600 text-white";
      case "rejected":
        return "bg-[#C72030] text-white";
      case "pending":
        return "bg-[#ff9800] text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const displayValue = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return "-";
    return value;
  };

  const selectedHandOverUserName =
    handOverUsers.find((user) => user.id === selectedHandOverTo)?.name || "";

  if (loading && !gdnDetails) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#C72030]" />
      </div>
    );
  }

  return (
    <div className="p-3 bg-[#fafafa] min-h-screen">
      <div className="mb-3 text-sm">
        <span className="text-gray-600">GDN &gt; </span>
        <span className="font-medium text-black">GDN Request</span>
      </div>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {gdnDetails?.approval_levels?.map((level) => (
            <div key={level.level_id} className="flex items-center gap-1">
              <span className="font-semibold text-black">
                {toTitleCase(level.level_name)} Approval:
              </span>
              <span
                className={`px-2 py-1 rounded text-sm ${getStatusBadgeClass(
                  level.status
                )}`}
              >
                {displayValue(level.status)}
              </span>
            </div>
          ))}
        </div>

        <Button
          className="gap-2 bg-[#6B2C65] px-4 py-2 text-white hover:bg-[#5a2455]"
          disabled={loading || dispatchSubmitting || !id}
          onClick={() => setDispatchDialogOpen(true)}
        >
          <Send className="h-4 w-4" />
          Dispatch Now
        </Button>
      </div>

      <section className="bg-white border border-gray-200 rounded-md shadow-sm mb-4 p-3">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#F04B2F] text-white">
            <FileText className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-medium uppercase text-[#F04B2F]">
            GDN Details
          </h1>
        </div>

        <div className="bg-[#f3edf3] rounded-sm mx-3 mb-4 px-4 py-3">
          <div className="grid grid-cols-[130px_20px_1fr] gap-y-4 text-sm">
            <span className="text-gray-600">GDN Date</span>
            <span>:</span>
            <span className="text-black">
              {displayValue(gdnDetails?.gdn_date)}
            </span>

            <span className="text-gray-600">Description</span>
            <span>:</span>
            <span className="text-black">
              {displayValue(gdnDetails?.description)}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-4" />
      </section>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-x-auto">
        <Table className="min-w-[850px]">
          <TableHeader>
            <TableRow className="bg-[#f3edf3] hover:bg-[#f3edf3]">
              <TableHead className="text-center text-black font-bold">
                Inventory
              </TableHead>
              <TableHead className="text-center text-black font-bold">
                Quantity
              </TableHead>
              <TableHead className="text-center text-black font-bold">
                Purpose
              </TableHead>
              <TableHead className="text-center text-black font-bold">
                Reason
              </TableHead>
              <TableHead className="text-center text-black font-bold">
                Hand Over To
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gdnDetails?.inventories?.length ? (
              gdnDetails.inventories.map((inventory, index) => (
                <TableRow key={`${inventory.inventory_name}-${index}`}>
                  <TableCell className="text-center">
                    {displayValue(inventory.inventory_name)}
                  </TableCell>
                  <TableCell className="text-center">
                    {displayValue(inventory.quantity)}
                  </TableCell>
                  <TableCell className="text-center">
                    {displayValue(inventory.purpose)}
                  </TableCell>
                  <TableCell className="text-center">
                    {displayValue(inventory.reason)}
                  </TableCell>
                  <TableCell className="text-center">
                    {displayValue(inventory.handed_over_to)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-500"
                >
                  No inventory details found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={dispatchDialogOpen}
        onOpenChange={handleDispatchDialogChange}
      >
        <DialogContent className="top-1/2 max-w-[300px] gap-0 overflow-visible rounded-[4px] border-0 bg-white p-0 shadow-xl sm:max-w-[300px] sm:rounded-[4px]">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-200 px-4 py-4 text-left">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Dispatch Now
            </DialogTitle>
            <DialogClose asChild>
              <button
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center text-gray-500 hover:text-gray-800"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </DialogHeader>

          <div className="px-7 py-8">
            <FormControl
              fullWidth
              size="small"
              sx={dispatchSelectSx}
              variant="outlined"
            >
              <InputLabel id="dispatch-hand-over-to-label" shrink>
                Hand Over To <span style={{ color: "#C72030" }}>*</span>
              </InputLabel>
              <MuiSelect
                displayEmpty
                disabled={usersLoading || dispatchSubmitting}
                id="dispatch-hand-over-to"
                label="Hand Over To *"
                labelId="dispatch-hand-over-to-label"
                MenuProps={dispatchMenuProps}
                onChange={(event: SelectChangeEvent) =>
                  setSelectedHandOverTo(event.target.value)
                }
                renderValue={(selected) => {
                  if (usersLoading) return "Loading users...";
                  if (!selected) return "Select hand over to";
                  return selectedHandOverUserName || "Select hand over to";
                }}
                value={selectedHandOverTo}
              >
                {usersLoading ? (
                  <MenuItem value="" disabled>
                    Loading users...
                  </MenuItem>
                ) : handOverUsers.length ? (
                  handOverUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No users found
                  </MenuItem>
                )}
              </MuiSelect>
            </FormControl>
          </div>

          <DialogFooter className="border-t border-gray-200 px-5 py-4 sm:justify-end sm:space-x-0">
            <Button
              className="h-9 min-w-[94px] rounded-[4px] bg-[#6B2C65] px-6 text-sm text-white hover:bg-[#5a2455]"
              disabled={dispatchSubmitting || usersLoading}
              onClick={handleDispatchSubmit}
            >
              {dispatchSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
