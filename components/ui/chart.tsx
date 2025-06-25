"use client"

import * as React from "react"
import { ResponsiveContainer } from "recharts"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: Record<string, any>
  }
>(({ className, config, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("rounded-lg border bg-background p-2 shadow-md", className)} {...props} />
})
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  }
>(({ className, hideLabel, hideIndicator, indicator = "dot", nameKey, labelKey, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
      {...props}
    />
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }
