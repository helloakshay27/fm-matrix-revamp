import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[5px] bg-gray-400", className)}
      {...props}
    />
  )
}

export { Skeleton }
