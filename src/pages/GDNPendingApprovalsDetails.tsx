import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
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
  rejection_reason?: string | null;
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

const toTitleCase = (value?: string | null) => {
  if (!value) return "-";

  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const GDNPendingApprovalsDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const levelId = searchParams.get("level_id");
  const userId =
    searchParams.get("user_id") ||
    localStorage.getItem("user_id") ||
    localStorage.getItem("userId") ||
    "";

  const [gdnDetails, setGdnDetails] = useState<GDNDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  const displayValue = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return "-";
    return value;
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

  const fetchGdnDetails = useCallback(async () => {
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
      console.error("Error fetching GDN pending approval details:", error);
      toast.error("Failed to load GDN details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGdnDetails();
  }, [fetchGdnDetails]);

  const updateApproval = async (approve: boolean, rejectionReason = "") => {
    if (!id || !levelId || !userId) {
      toast.error("Missing approval details.");
      return;
    }

    setSubmitting(true);

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      if (!baseUrl) {
        throw new Error("Base URL is not configured.");
      }

      const url = new URL(`/pms/srns/${id}/status_confirmation`, baseUrl);
      url.searchParams.set("approve", approve ? "true" : "false");
      url.searchParams.set("user_id", userId);
      url.searchParams.set("level_id", levelId);

      if (!approve) {
        url.searchParams.set("rejection_reason", rejectionReason);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.message ||
            errorData?.error ||
            `Failed to update GDN approval (${response.status})`
        );
      }

      toast.success(
        approve ? "GDN approved successfully" : "GDN rejected successfully"
      );
      navigate("/finance/gdn/pending-approvals");
    } catch (error) {
      console.error("Error updating GDN approval:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update GDN approval."
      );
    } finally {
      setSubmitting(false);
      setOpenRejectDialog(false);
      setRejectComment("");
    }
  };

  const handleRejectConfirm = () => {
    if (!rejectComment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    updateApproval(false, rejectComment.trim());
  };

  const shouldShowButtons = Boolean(levelId && userId);

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

      <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-2">
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

      {shouldShowButtons && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            className="bg-green-600 text-white py-2 px-4 rounded-md"
            disabled={submitting}
            onClick={() => updateApproval(true)}
          >
            Approve
          </Button>
          <Button
            className="bg-[#C72030] text-white py-2 px-4 rounded-md"
            disabled={submitting}
            onClick={() => setOpenRejectDialog(true)}
          >
            Reject
          </Button>
        </div>
      )}

      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject GDN</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Rejection"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={rejectComment}
            onChange={(event) => setRejectComment(event.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenRejectDialog(false)}
            variant="outline"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectConfirm}
            className="bg-[#C72030] text-white hover:bg-[#a61b27]"
            disabled={submitting}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
