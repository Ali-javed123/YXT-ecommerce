
"use client"
import * as React from "react"

import { TrendingUp } from "lucide-react"
import { Label,Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A donut chart"

const chartData = [
  { status: "pending", count: 275, fill: "var(--color-pending)" },
  { status: "processing", count: 200, fill: "var(--color-processing)" },
  { status: "shipped", count: 187, fill: "var(--color-shipped)" },
  { status: "delivered", count: 173, fill: "var(--color-delivered)" },
  { status: "cancelled", count: 90, fill: "var(--color-cancelled)" },
  { status: "unverified", count: 71, fill: "var(--color-unverified)" },
]

const chartConfig = {
  pending: {
    label: "pending",
    color: "var(--chart-6)",

  },
  processing: {
    label: "Processing",
    color: "var(--chart-4)",
  },
  shipped: {
    label: "shipped",
    color: "var(--chart-1)",
  },
  delivered: {
    label: "Delivered",
    color: "var(--chart-2)",
  },
  cancelled: {
    label: "cancelled",
    color: "var(--chart-5)",
  },
  unverified: {
    label: "unverified",
    color: "var(--chart-3)",
  },
 
} satisfies ChartConfig

export function OrderStatus() {
      const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  return (
 <>
  <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
            >

                              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Counts
                        </tspan>
                      </text>
                    )
                  }
                }}
              />

            </Pie>
          </PieChart>
        </ChartContainer>
        <ul className="flex flex-col gap-3 w-full px-4">
  <li className="flex items-center justify-between w-full text-sm">
    <span className="font-bold">Pending</span>
    <span className="px-2 py-1 text-white text-sm bg-chart-5 rounded-full">
      10
    </span>
  </li>

  <li className="flex items-center justify-between w-full text-sm">
    <span className="font-bold">Processing</span>
    <span className="px-2 py-1 text-white text-sm bg-chart-1 rounded-full">
      10
    </span>
  </li>

  <li className="flex items-center justify-between w-full text-sm">
    <span className="font-bold">Shipped</span>
    <span className="px-2 py-1 text-white text-sm bg-chart-2 rounded-full">
      10
    </span>
  </li>

  <li className="flex items-center justify-between w-full text-sm">
    <span className="font-bold">Delivered</span>
    <span className="px-2 py-1 text-white text-sm bg-chart-3 rounded-full">
      10
    </span>
  </li>

  <li className="flex items-center justify-between w-full text-sm">
    <span className="font-bold">Cancelled</span>
    <span className="px-2 py-1 text-white text-sm bg-red-700 rounded-full">
      10
    </span>
  </li>
  <li className="flex items-center justify-between w-full text-sm">
    <span className="font-bold">Unverified</span>
    <span className="px-2 py-1 text-white text-sm bg-red-700 rounded-full">
      10
    </span>
  </li>
</ul>
 </>
  )
}
