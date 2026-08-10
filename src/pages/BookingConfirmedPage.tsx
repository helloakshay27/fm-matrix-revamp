import React from "react";
import { CheckCircle2 } from "lucide-react";

export const BookingConfirmedPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3 text-center max-w-sm">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <h1 className="text-xl font-semibold text-gray-900">You're booked!</h1>
        <p className="text-gray-500">
          The event has been added to your calendar, and the host has been invited.
          You can close this tab.
        </p>
      </div>
    </div>
  );
};
