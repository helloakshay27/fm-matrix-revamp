import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/** Shared tab bar matching the Maintenance Asset list/details screens. */
export const AssetTabsList = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) => (
  <TabsList
    className={cn(
      "w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch border border-gray-200",
      className
    )}
    {...props}
  />
);

export const AssetTabsTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsTrigger>) => (
  <TabsTrigger
    className={cn(
      "flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] data-[state=inactive]:text-black border-r border-gray-200 last:border-r-0 font-semibold",
      className
    )}
    {...props}
  />
);
