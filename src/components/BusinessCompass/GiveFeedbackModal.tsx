import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, X } from "lucide-react";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-y-auto overflow-x-hidden rounded-[18px] bg-white p-4 shadow-xl sm:max-h-[calc(100dvh-3rem)]">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-[17px] font-bold text-[#111827]">
            Feedback for {receiver?.name}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="w-full rounded-[16px] bg-[#f5f2eb] px-5 py-5">
          <div className="space-y-4">
            {[
              {
                title: "Situation",
                value: positiveOpening,
                onChange: setPositiveOpening,
                placeholder: "When and where did this happen?",
              },
              {
                title: "Behavior",
                value: constructiveFeedback,
                onChange: setConstructiveFeedback,
                placeholder: "What specifically did they do or say?",
              },
              {
                title: "Impact",
                value: positiveClosing,
                onChange: setPositiveClosing,
                placeholder: "What was the result or effect?",
              },
            ].map(({ title, value, onChange, placeholder }) => (
              <div key={title} className="space-y-2">
                <Label className="text-[12px] font-bold text-[#111827]">
                  {title}
                </Label>
                <Textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="min-h-[58px] resize-none rounded-[12px] border-0 bg-white px-4 py-3 text-[12px] text-[#111827] shadow-none outline-none placeholder:text-[#9ca3af] focus:ring-1 focus:ring-[#DA7756]/20"
                />
              </div>
            ))}

            <div className="space-y-2">
              <Label className="text-[12px] font-bold text-[#111827]">
                Rating
              </Label>
              <div className="flex gap-0.5" role="group" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={score === n}
                    aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    onClick={() => setScore(n)}
                    className="rounded-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#DA7756]/30"
                  >
                    <Star
                      className={cn(
                        "h-5 w-5",
                        n <= score
                          ? "fill-[#ffb000] text-[#ffb000]"
                          : "fill-[#e8edf5] text-[#e8edf5]"
                      )}
                      strokeWidth={n <= score ? 0 : 1.5}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || score === 0}
              className="inline-flex h-[34px] w-full items-center justify-center gap-2 rounded-[7px] bg-[#e77252] px-8 text-[12px] font-bold text-white shadow-sm transition-all hover:bg-[#d96648] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
