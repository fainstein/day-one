"use client"

import type { Artist, CalculationResult } from "@/lib/lensfluence"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface VisualizationsProps {
  type: "bar" | "comparison"
  artists: Artist[]
  results: CalculationResult[]
}

export function Visualizations({ type, artists, results }: VisualizationsProps) {
  // Prepare data for charts
  const chartData = results.map((result, index) => ({
    name: artists[index].name,
    rawValue: result.rawValue,
    finalPrice: result.finalPrice,
  }))

  if (type === "bar") {
    return (
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#aaa" angle={-45} textAnchor="end" tick={{ dy: 10 }} height={60} />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#333",
                borderColor: "#555",
                color: "#fff",
              }}
            />
            <Legend />
            <Bar dataKey="finalPrice" name="Final Price (USDC)" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#aaa" angle={-45} textAnchor="end" tick={{ dy: 10 }} height={60} />
          <YAxis stroke="#aaa" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              borderColor: "#555",
              color: "#fff",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="rawValue" name="Raw Value" stroke="#6366f1" strokeWidth={2} dot={{ r: 5 }} />
          <Line
            type="monotone"
            dataKey="finalPrice"
            name="Final Price"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
