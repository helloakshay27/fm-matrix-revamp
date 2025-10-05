import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TaskSubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails?: () => void;
  stats?: {
    questionsAttended: number;
    negativeFeedback: number;
    ticketsRaised: number;
  };
}

export const TaskSubmissionSuccessModal: React.FC<
  TaskSubmissionSuccessModalProps
> = ({
  isOpen,
  onClose,
  onViewDetails,
  stats = {
    questionsAttended: 10,
    negativeFeedback: 2,
    ticketsRaised: 2,
  },
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-2 px-4 bg-white rounded-lg shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center px-10 py-6">
          {/* Success Icon - Custom SVG badge similar to the image */}
          <div className="w-36 h-36 mx-auto mb-8">
            <svg
              className="w-36 h-36"
              width="236"
              height="235"
              viewBox="0 0 236 235"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M89.9073 14.3061C87.0539 16.7378 85.6272 17.9538 84.1033 18.975C80.6104 21.3162 76.6876 22.941 72.5623 23.7554C70.7626 24.1108 68.894 24.2599 65.1568 24.5581C55.7668 25.3075 51.0717 25.6821 47.1548 27.0657C38.095 30.2657 30.9688 37.3919 27.7688 46.4516C26.3852 50.3686 26.0106 55.0637 25.2612 64.4536C24.963 68.1909 24.814 70.0595 24.4586 71.8592C23.6441 75.9845 22.0193 79.9073 19.6782 83.4002C18.6569 84.924 17.441 86.3507 15.0092 89.2042C8.89936 96.374 5.84432 99.9583 4.05299 103.707C-0.0905799 112.376 -0.0905799 122.453 4.05299 131.123C5.84444 134.871 8.89936 138.455 15.0092 145.625C17.4406 148.478 18.6569 149.905 19.6782 151.429C22.0193 154.922 23.6441 158.844 24.4586 162.97C24.814 164.77 24.963 166.639 25.2612 170.375C26.0106 179.766 26.3852 184.461 27.7688 188.378C30.9688 197.438 38.095 204.564 47.1548 207.764C51.0717 209.147 55.7668 209.522 65.1568 210.271C68.894 210.569 70.7626 210.719 72.5623 211.074C76.6876 211.888 80.6104 213.514 84.1033 215.855C85.6272 216.875 87.0538 218.092 89.9073 220.523C97.0771 226.633 100.661 229.688 104.41 231.48C113.079 235.623 123.156 235.623 131.826 231.48C135.574 229.688 139.158 226.633 146.328 220.523C149.181 218.092 150.609 216.875 152.132 215.855C155.625 213.514 159.548 211.888 163.673 211.074C165.473 210.719 167.342 210.569 171.079 210.271C180.469 209.522 185.164 209.147 189.081 207.764C198.141 204.564 205.267 197.438 208.467 188.378C209.85 184.461 210.225 179.766 210.975 170.375C211.272 166.639 211.422 164.77 211.777 162.97C212.592 158.844 214.217 154.922 216.558 151.429C217.578 149.905 218.795 148.478 221.226 145.625C227.337 138.455 230.391 134.871 232.183 131.123C236.326 122.453 236.326 112.376 232.183 103.707C230.391 99.9583 227.337 96.374 221.226 89.2042C218.795 86.3507 217.578 84.924 216.558 83.4002C214.217 79.9073 212.592 75.9845 211.777 71.8592C211.422 70.0595 211.272 68.1909 210.975 64.4536C210.225 55.0637 209.85 50.3686 208.467 46.4516C205.267 37.3919 198.141 30.2657 189.081 27.0657C185.164 25.6821 180.469 25.3075 171.079 24.5581C167.342 24.2599 165.473 24.1108 163.673 23.7554C159.548 22.941 155.625 21.3162 152.132 18.975C150.609 17.9538 149.181 16.7379 146.328 14.3061C139.158 8.19623 135.574 5.14131 131.826 3.34986C123.156 -0.793705 113.079 -0.793705 104.41 3.34986C100.661 5.1412 97.0771 8.19623 89.9073 14.3061ZM169.363 92.3765C173.087 88.6523 173.087 82.6144 169.363 78.8902C165.639 75.1661 159.6 75.1661 155.877 78.8902L99.0456 135.722L80.3585 117.035C76.6344 113.311 70.5964 113.311 66.8723 117.035C63.1482 120.759 63.1482 126.797 66.8723 130.522L92.3021 155.951C96.0261 159.675 102.064 159.675 105.789 155.951L169.363 92.3765Z"
                fill="#1FCFB3"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Checklist submitted!
          </h2>

          {/* Statistics */}
          <div className="space-y-4 mb-8 text-left max-w-sm mx-auto">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">
                No. of questions attended
              </span>
              <span className="text-gray-900 font-bold text-lg">
                {stats.questionsAttended}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">
                Negative feedback
              </span>
              <span className="text-gray-900 font-bold text-lg">
                {String(stats.negativeFeedback).padStart(2, "0")}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Ticket Raised</span>
              <span className="text-gray-900 font-bold text-lg">
                {String(stats.ticketsRaised).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={onViewDetails || onClose}
            className="bg-[#C72030] text-white hover:bg-[#B11E2A] px-8 py-3 rounded-md font-medium text-base transition-colors"
          >
            View details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
