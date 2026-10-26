"use client";

import * as React from "react";
import { motion, useSpring } from "motion/react";
import { useMouse } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CursorTrailProps {
  color?: string;
  count?: number;
  size?: number;
  className?: string;
}

function TrailDot({
  mouse,
  index,
  total,
  color,
  size,
}: {
  mouse: { x: number | null; y: number | null };
  index: number;
  total: number;
  color: string;
  size: number;
}) {
  const springOptions = {
    stiffness: 400 - index * 30,
    damping: 28 + index * 3,
    mass: 0.2 + index * 0.1,
  };

  const springX = useSpring(0, springOptions);
  const springY = useSpring(0, springOptions);

  React.useEffect(() => {
    if (mouse.x !== null && mouse.y !== null) {
      springX.set(mouse.x);
      springY.set(mouse.y);
    }
  }, [mouse.x, mouse.y, springX, springY]);

  const scale = 1 - (index / total) * 0.6;
  const opacity = 1 - (index / total) * 0.75;
  const dotSize = size * scale;

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        width: dotSize,
        height: dotSize,
      }}
      className={cn(
        "pointer-events-none fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full",
        color,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 0.15 }}
    />
  );
}

export function CursorTrail({
  color = "bg-[#e1b382]",
  count = 6,
  size = 8,
  className,
}: CursorTrailProps) {
  const [mouse, containerRef] = useMouse();

  if (mouse.x === null || mouse.y === null) return null;

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none fixed inset-0 z-50 overflow-hidden", className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <TrailDot
          key={i}
          mouse={mouse}
          index={i}
          total={count}
          color={color}
          size={size}
        />
      ))}
    </div>
  );
}

export default CursorTrail;