"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme-provider";

type PriceChartProps = {
  priceHistory: { timestamp: number; price: number }[];
};

export default function PriceChart({ priceHistory }: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const { theme } = useTheme()
  const theme = "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set styles based on theme
    const gridColor =
      theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
    const textColor =
      theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)";
    const lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    lineGradient.addColorStop(0, "#8b5cf6");
    lineGradient.addColorStop(1, "#06b6d4");

    // Find min and max for scaling
    const prices = priceHistory.map((point) => point.price);
    const minPrice = Math.min(...prices) * 0.95;
    const maxPrice = Math.max(...prices) * 1.05;
    const priceRange = maxPrice - minPrice;

    // Draw grid
    const gridSpacing = canvas.height / 5;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = i * gridSpacing;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw price labels
    ctx.fillStyle = textColor;
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    for (let i = 0; i < 6; i++) {
      const y = canvas.height - i * gridSpacing;
      const price = minPrice + (i / 5) * priceRange;
      ctx.fillText(`$${price.toFixed(2)}`, 10, y - 5);
    }

    // Draw date labels
    const dateSpacing = canvas.width / 4;
    const dateStep = Math.floor(priceHistory.length / 4);
    for (let i = 0; i < 4; i++) {
      const x = i * dateSpacing;
      const index = i * dateStep;
      if (index < priceHistory.length) {
        const date = new Date(priceHistory[index].timestamp);
        const dateStr = date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        ctx.fillText(dateStr, x + 30, canvas.height - 10);
      }
    }

    // Draw price line
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    priceHistory.forEach((point, i) => {
      const x = (i / (priceHistory.length - 1)) * canvas.width;
      const y =
        canvas.height - ((point.price - minPrice) / priceRange) * canvas.height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Add gradient fill
    const fillGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    fillGradient.addColorStop(0, "rgba(139, 92, 246, 0.3)");
    fillGradient.addColorStop(1, "rgba(6, 182, 212, 0.05)");

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fillStyle = fillGradient;
    ctx.fill();
  }, [priceHistory, theme]);

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-full"
      />
    </div>
  );
}
