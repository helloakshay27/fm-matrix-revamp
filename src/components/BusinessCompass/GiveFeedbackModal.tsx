import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import apiClient from "@/utils/apiClient";
import { getUser } from "@/utils/auth";
import { toast } from "@/components/ui/sonner";

const RATINGS_COLLECTION_ENDPOINTS = ["/ratings.json", "/ratings"];

const getResponseStatus = (error: unknown) =>
  error && typeof error === "object" && "response" in error
    ? (error.response as { status?: number })?.status
    : undefined;

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === "object" && "response" in error) {
    const data = (error.response as { data?: { message?: string; error?: string } })
      ?.data;
    return data?.message || data?.error || "Failed to submit feedback";
  }

  return "An unexpected error occurred";
};

interface GiveFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiver: {
    user_id: number;
    name: string;
  } | null;
  onSuccess?: () => void;
}

export function GiveFeedbackModal({
  isOpen,
  onClose,
  receiver,
  onSuccess,
}: GiveFeedbackModalProps) {
  const [score, setScore] = useState(0);
  const [positiveOpening, setPositiveOpening] = useState("");
  const [constructiveFeedback, setConstructiveFeedback] = useState("");
  const [positiveClosing, setPositiveClosing] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentUserId = () => {
    const currentUser = getUser();
    const authUserId = Number(currentUser?.id ?? 0);
    if (authUserId) return authUserId;

    for (const key of ["user_id", "userId", "id"]) {
      const value = Number(
        localStorage.getItem(key) || sessionStorage.getItem(key) || "0"
      );
      if (value) return value;
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!receiver) return;

    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      toast.error("You must be logged in to give feedback.");
      return;
    }
    if (score === 0) {
      toast.error("Please select a rating.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      resource_type: "User",
      resource_id: receiver.user_id,
      score,
      rating_from_type: "User",
      rating_from_id: currentUserId,
      created_at: new Date().toISOString(),
      positive_opening: positiveOpening,
      constructive_feedback: constructiveFeedback,
      positive_closing: positiveClosing,
      reviews: "",
    };

    try {
      let submitted = false;
      let lastError: unknown = null;

      for (const endpoint of RATINGS_COLLECTION_ENDPOINTS) {
        try {
          const response = await apiClient.post(endpoint, payload, {
            headers: { "Content-Type": "application/json" },
          });

          if (response.status === 201 || response.status === 200) {
            submitted = true;
            break;
          }
        } catch (error) {
          lastError = error;
          const status = getResponseStatus(error);
          if (status === 401 || status === 403 || status === 429) {
            throw error;
          }
        }
      }

      if (submitted) {
        toast.success(`Feedback submitted for ${receiver.name}`);
        onSuccess?.();
        handleClose();
      } else {
        throw lastError || new Error("Failed to submit feedback");
      }
    } catch (err: unknown) {
      console.error("Feedback submission error:", err);
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setScore(0);
    setPositiveOpening("");
    setConstructiveFeedback("");
    setPositiveClosing("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border-[#DA7756]/20 bg-white p-0 shadow-xl focus:outline-none sm:max-w-[500px]">
        <DialogHeader className="shrink-0 p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-neutral-900">
            <Star className="h-5 w-5 fill-[#DA7756] text-[#DA7756]" />
            Feedback for {receiver?.name}
          </DialogTitle>
          <DialogDescription className="text-neutral-500">
            Share your appreciation and constructive thoughts.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
          <div className="grid gap-6">
          {/* Rating Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-neutral-700">Rating Score</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScore(s)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
                    score >= s
                      ? "bg-[#DA7756] text-white shadow-md scale-110"
                      : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
                  )}
                >
                  <Star
                    className={cn("h-5 w-5", score >= s ? "fill-current" : "")}
                    strokeWidth={score >= s ? 2.5 : 2}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-[#DA7756]">
                {score === 0 ? "Select rating" : score === 5 ? "Excellent" : score === 4 ? "Great" : score === 3 ? "Good" : score === 2 ? "Needs Improvement" : "Poor"}
              </span>
            </div>
          </div>

          {/* Feedback Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="positive_opening" className="text-sm font-semibold text-neutral-700">
                Positive Opening
              </Label>
              <Textarea
                id="positive_opening"
                placeholder="Start with something they did well..."
                value={positiveOpening}
                onChange={(e) => setPositiveOpening(e.target.value)}
                className="min-h-[80px] resize-none border-neutral-200 focus:border-[#DA7756] focus:ring-[#DA7756]/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="constructive_feedback" className="text-sm font-semibold text-neutral-700">
                Constructive Feedback
              </Label>
              <Textarea
                id="constructive_feedback"
                placeholder="What could be improved?"
                value={constructiveFeedback}
                onChange={(e) => setConstructiveFeedback(e.target.value)}
                className="min-h-[80px] resize-none border-neutral-200 focus:border-[#DA7756] focus:ring-[#DA7756]/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="positive_closing" className="text-sm font-semibold text-neutral-700">
                Positive Closing
              </Label>
              <Textarea
                id="positive_closing"
                placeholder="End on a supportive note..."
                value={positiveClosing}
                onChange={(e) => setPositiveClosing(e.target.value)}
                className="min-h-[80px] resize-none border-neutral-200 focus:border-[#DA7756] focus:ring-[#DA7756]/10"
              />
            </div>
          </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 gap-3 border-t border-neutral-100 bg-neutral-50/50 p-4 sm:gap-0 sm:p-6 sm:pt-4">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || score === 0}
            className="bg-[#DA7756] hover:bg-[#DA7756]/90 text-white shadow-lg shadow-[#DA7756]/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
