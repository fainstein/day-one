"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";

type MetricCardProps = {
  name: string;
  value: number;
  history: number[];
  unit?: string;
  icon?: string;
};

export default function MetricCard({
  name,
  value,
  history,
  unit,
  icon = "activity",
}: MetricCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Format large numbers
  const formatValue = (val: number) => {
    if (unit) return (val / 1000000).toFixed(1) + unit;
    if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
    if (val >= 1000) return (val / 1000).toFixed(1) + "K";
    return val.toString();
  };

  // Calculate percentage change
  const percentChange = ((value - history[0]) / history[0]) * 100;

  // Draw mini chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set line style
    ctx.strokeStyle = percentChange >= 0 ? "#4ade80" : "#f87171";
    ctx.lineWidth = 2;

    // Find min and max for scaling
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;

    // Draw line
    ctx.beginPath();
    history.forEach((val, i) => {
      const x = (i / (history.length - 1)) * canvas.width;
      const y = canvas.height - ((val - min) / range) * canvas.height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  }, [history, percentChange]);

  // Dynamically get the icon component
  const IconComponent =
    (Icons as any)[icon.charAt(0).toUpperCase() + icon.slice(1)] ||
    Icons.Activity;

  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center space-x-2">
        <IconComponent className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <CardTitle className="text-base font-medium">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold font-mono">{value}</p>
          </div>
          <div className="h-16 w-24">
            <canvas
              ref={canvasRef}
              width={96}
              height={64}
              className="w-full h-full"
            ></canvas>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
