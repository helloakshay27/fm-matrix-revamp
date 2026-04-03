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
  const [score, setScore] = useState(5);
  const [positiveOpening, setPositiveOpening] = useState("");
  const [constructiveFeedback, setConstructiveFeedback] = useState("");
  const [positiveClosing, setPositiveClosing] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!receiver) return;

    const currentUser = getUser();
    if (!currentUser) {
      toast.error("You must be logged in to give feedback.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      id: receiver.user_id,
      score: score,
      reviewer: `${currentUser.firstname} ${currentUser.lastname}`.trim(),
      rating_from_id: currentUser.id,
      rating_from_type: "User",
      created_at: new Date().toISOString(),
      fields: {
        positive_opening: positiveOpening,
        constructive_feedback: constructiveFeedback,
        positive_closing: positiveClosing,
      },
    };

    try {
      const response = await apiClient.post("/ratings", payload);

      if (response.status === 201 || response.status === 200) {
        toast.success(`Feedback submitted for ${receiver.name}`);
        onSuccess?.();
        handleClose();
      }
    } catch (err: unknown) {
      console.error("Feedback submission error:", err);
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err.response as any)?.data?.message || "Failed to submit feedback"
          : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setScore(5);
    setPositiveOpening("");
    setConstructiveFeedback("");
    setPositiveClosing("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border-[#DA7756]/20 bg-white shadow-xl rounded-2xl overflow-hidden focus:outline-none">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-neutral-900">
            <Star className="h-5 w-5 fill-[#DA7756] text-[#DA7756]" />
            Feedback for {receiver?.name}
          </DialogTitle>
          <DialogDescription className="text-neutral-500">
            Share your appreciation and constructive thoughts.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 p-6">
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
                {score === 5 ? "Excellent" : score === 4 ? "Great" : score === 3 ? "Good" : score === 2 ? "Needs Improvement" : "Poor"}
              </span>
            </div>
          </div>

          {/* Feedback Fields */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
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

        <DialogFooter className="bg-neutral-50/50 p-6 pt-4 gap-3 sm:gap-0">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !positiveOpening || !constructiveFeedback || !positiveClosing}
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
