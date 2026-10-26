"use client";

// 3D Button from Evil Buttons by radiumcoders
import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type ThreeDButtonProps = HTMLMotionProps<"button"> & {
  children?: React.ReactNode;
};

const pressTransition = {
  type: "spring",
  stiffness: 620,
  damping: 32,
  mass: 0.5,
} as const;

export function ThreeDButton({
  className,
  children = "Continue",
  ...props
}: ThreeDButtonProps) {
  return (
    <motion.button
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        "group relative isolate inline-flex cursor-pointer rounded-xl pb-1.5 outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#e1b382] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2226]",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
      {...props}
    >
      {/* Deck (bottom layer / shadow block) */}
      <motion.span
        aria-hidden
        variants={{
          rest: { y: 0 },
          hover: { y: 1 },
          tap: { y: -1 },
        }}
        transition={pressTransition}
        className="absolute inset-x-0 bottom-0 top-1.5 -z-10 rounded-xl bg-[#081a1d] shadow-[0_8px_16px_rgba(3,18,21,0.38)]"
      />
      {/* Face (top layer / button surface) */}
      <motion.span
        variants={{
          rest: { y: 0 },
          hover: { y: -2 },
          tap: { y: 6 },
        }}
        transition={pressTransition}
        className={cn(
          "relative z-10 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#f3dec2]/35 bg-[#e1b382] px-5 py-2.5 text-sm font-semibold text-[#12343b] shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_6px_16px_rgba(3,18,21,0.18)] transition-[background,box-shadow] hover:bg-[#edc79d] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.48),0_8px_20px_rgba(3,18,21,0.24)]",
          "backface-hidden will-change-transform",
          className,
        )}
      >
        {/* Press spot */}
        <motion.span
          aria-hidden
          variants={{
            rest: { opacity: 0, scaleX: 0.25 },
            hover: { opacity: 0.3, scaleX: 0.45 },
            tap: { opacity: 1, scaleX: 1 },
          }}
          transition={pressTransition}
          className="pointer-events-none absolute inset-y-1 left-1/2 w-10 -translate-x-1/2 rounded-full bg-zinc-950/10 dark:bg-white/20 blur-sm"
        />
        {/* Sheen / gloss stripe */}
        <motion.span
          aria-hidden
          variants={{
            rest: { opacity: 0, x: "-100%" },
            hover: { opacity: 0.75, x: "-35%" },
            tap: { opacity: 0.9, x: "82%" },
          }}
          transition={pressTransition}
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-transparent via-white to-transparent dark:via-white/20"
        />
        {/* Label */}
        <motion.span
          variants={{
            rest: { y: 0 },
            hover: { y: -1 },
            tap: { y: 1 },
          }}
          transition={pressTransition}
          className="relative z-10"
        >
          {children}
        </motion.span>
      </motion.span>
    </motion.button>
  );
}
