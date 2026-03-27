import React from "react";
import { Eye, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminViewEmulationBanner() {
  return (
    <div className="rounded-2xl border border-[#E9D7FE] bg-[#F9F5FF] p-5 shadow-sm sm:p-6">
      <div className="flex gap-3">
        <Eye
          className="mt-0.5 h-5 w-5 shrink-0 text-[#7F56D9] sm:h-[22px] sm:w-[22px]"
          strokeWidth={2}
          aria-hidden
        />
        <div className="min-w-0">
          <h2 className="text-base font-bold text-[#532197] sm:text-lg">
            Admin View Emulation
          </h2>
          <p className="mt-1 text-sm leading-snug text-[#7F56D9]">
            Experience the app as different user types
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select defaultValue="default-role">
          <SelectTrigger className="flex h-11 w-full items-center gap-2 rounded-lg border-neutral-200 bg-white px-3 shadow-sm [&>span]:min-w-0 [&>span]:flex-1 [&>span]:text-left">
            <Shield
              className="h-4 w-4 shrink-0 text-neutral-500"
              strokeWidth={2}
              aria-hidden
            />
            <SelectValue placeholder="Default (Your Role)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default-role">Default (Your Role)</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="no-user">
          <SelectTrigger className="h-11 w-full rounded-lg border-neutral-200 bg-white px-3 shadow-sm [&>span]:min-w-0 [&>span]:flex-1 [&>span]:text-left">
            <SelectValue placeholder="No specific user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-user">No specific user</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
