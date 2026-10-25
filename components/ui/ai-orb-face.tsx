"use client";

import { cn } from "@/lib/utils";
import Orb from "@/components/ui/orb";
import {
  type MotionValue,
  motion,
  useAnimationControls,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type AIAmplitude,
  type AIState,
  getAIStateMotion,
  useAmplitudeValue,
} from "@/components/ui/ai-core";

const VIEWBOX = 100;
const CENTER = VIEWBOX / 2;
const EYE_OFFSET = 16;
const EYE_Y = 44;
const EYE_WIDTH = 11;
const EYE_HEIGHT = 26;
const EYE_RADIUS = 5.5;
const GAZE_RANGE = 5.5;
const GAZE_FALLOFF = 220;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;
const SPIRAL = "M0 0C-0.6 -4 5 -5 6 -0.6C7 4.5 1 8 -4 6C-9 4.5 -9.5 -2 -6 -6";
const BLINK_MIN_MS = 3200;
const BLINK_EXTRA_MS = 2600;
const DOUBLE_BLINK_CHANCE = 0.25;
const SACCADE_MIN_MS = 700;
const SACCADE_EXTRA_MS = 700;
const SACCADE_TARGETS = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -0.6, y: -0.4 },
  { x: 0.8, y: -0.9 },
] as const;

const ORB_SPHERE_FRACTION = 0.86;
const ENERGY_STEPS = 4;

const useEnergyBucket = (value: MotionValue<number>) => {
  const [bucket, setBucket] = useState(0);
  useEffect(() => {
    const read = (level: number) =>
      setBucket(Math.round(level * ENERGY_STEPS) / ENERGY_STEPS);
    read(value.get());
    return value.on("change", read);
  }, [value]);
  return bucket;
};

export interface EyeShape {
  dy?: number;
  h: number;
  rotate?: number;
  w: number;
}

export interface Expression {
  left: EyeShape;
  right: EyeShape;
}

const EYE = (h: number, w = 1, rotate = 0, dy = 0): EyeShape => ({
  dy,
  h,
  rotate,
  w,
});

const symmetric = (h: number, w = 1, rotate = 0, dy = 0): Expression => ({
  left: EYE(h, w, rotate, dy),
  right: EYE(h, w, -rotate, dy),
});

export const EXPRESSIONS = {
  alert: symmetric(1.2, 1.05, 0, -1),
  content: symmetric(0.16, 1.25, 0, 2),
  cross: symmetric(0.85, 1, 18),
  deadpan: symmetric(0.14, 1.35),
  doubtful: { left: EYE(1, 1), right: EYE(0.45, 1.1, -14) },
  focused: symmetric(0.55, 1.05),
  neutral: symmetric(1),
  surprised: symmetric(0.5, 0.55, 0, -3),
  wink: { left: EYE(1, 1), right: EYE(0.12, 1.2, 0, 2) },
} satisfies Record<string, Expression>;

export type ExpressionName = keyof typeof EXPRESSIONS;

const STATE_EXPRESSION: Record<string, ExpressionName> = {
  done: "content",
  error: "cross",
  idle: "neutral",
  listening: "alert",
  streaming: "focused",
  thinking: "doubtful",
};

export type AIOrbFaceProps = {
  "aria-label"?: string;
  amplitude?: AIAmplitude;
  className?: string;
  colors?: { body?: string; bodyEdge?: string; feature?: string };
  gaze?: boolean;
  size?: number | string;
  state?: AIState;
  expression?: ExpressionName | Expression;
};

const DEFAULT_COLORS = {
  body: "oklch(72% 0.21 322)",
  bodyEdge: "oklch(97% 0.02 322)",
  feature: "oklch(24% 0.03 280)",
};

const AIOrbFace = ({
  "aria-label": ariaLabel,
  amplitude,
  className,
  colors,
  gaze = true,
  expression,
  size = 128,
  state = "idle",
}: AIOrbFaceProps) => {
  const shouldReduceMotion = useReducedMotion();
  const amplitudeValue = useAmplitudeValue(amplitude);
  const stateMotion = getAIStateMotion(state);
  const finalColors = { ...DEFAULT_COLORS, ...colors };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const energy = useEnergyBucket(amplitudeValue);
  const leftLid = useAnimationControls();
  const rightLid = useAnimationControls();
  const bodyControls = useAnimationControls();

  const gazeX = useSpring(0, { damping: 26, stiffness: 220 });
  const gazeY = useSpring(0, { damping: 26, stiffness: 220 });

  const resolvedSize = typeof size === "number" ? `${size}px` : size;

  const isHappy = state === "done";
  const isThinking = state === "thinking";
  const isListening = state === "listening";
  const isBroken = state === "error";
  const eyesOpen = !isBroken;

  const active: Expression = (() => {
    if (typeof expression === "object") {
      return expression;
    }
    if (expression) {
      return EXPRESSIONS[expression];
    }
    return EXPRESSIONS[STATE_EXPRESSION[state] ?? "neutral"];
  })();

  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const blink = useCallback(
    async (double = false) => {
      const closeT = { duration: 0.07, ease: EASE_IN };
      const openT = { duration: 0.16, ease: EASE_OUT };
      if (!mountedRef.current) {
        return;
      }
      await Promise.all([
        leftLid.start({ scaleY: 0.08 }, closeT),
        rightLid.start({ scaleY: 0.08 }, closeT),
      ]);
      if (!mountedRef.current) {
        return;
      }
      await Promise.all([
        leftLid.start({ scaleY: 1 }, double ? closeT : openT),
        rightLid.start({ scaleY: 1 }, double ? closeT : openT),
      ]);
      if (double) {
        await blink(false);
      }
    },
    [leftLid, rightLid]
  );

  useEffect(() => {
    if (shouldReduceMotion || !eyesOpen) {
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    let mounted = true;
    const schedule = () => {
      timeout = setTimeout(
        () => {
          if (mounted) {
            blink(Math.random() < DOUBLE_BLINK_CHANCE);
          }
          schedule();
        },
        BLINK_MIN_MS + Math.random() * BLINK_EXTRA_MS
      );
    };
    schedule();
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [blink, eyesOpen, shouldReduceMotion]);

  useEffect(() => {
    if (!gaze || shouldReduceMotion || isThinking || !eyesOpen) {
      return;
    }
    const handle = (event: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) {
        return;
      }
      const rect = svg.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const reach = Math.min(1, distance / GAZE_FALLOFF) * GAZE_RANGE;
      const angle = Math.atan2(dy, dx);
      gazeX.set(Math.cos(angle) * reach);
      gazeY.set(Math.sin(angle) * reach);
    };
    window.addEventListener("pointermove", handle);
    return () => window.removeEventListener("pointermove", handle);
  }, [gaze, gazeX, gazeY, isThinking, eyesOpen, shouldReduceMotion]);

  useEffect(() => {
    if (!isThinking || shouldReduceMotion) {
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    let mounted = true;
    let index = 0;
    const schedule = () => {
      timeout = setTimeout(
        () => {
          if (!mounted) {
            return;
          }
          const target = SACCADE_TARGETS[index % SACCADE_TARGETS.length];
          index += 1;
          gazeX.set(target.x * GAZE_RANGE);
          gazeY.set(target.y * GAZE_RANGE);
          schedule();
        },
        SACCADE_MIN_MS + Math.random() * SACCADE_EXTRA_MS
      );
    };
    schedule();
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [gazeX, gazeY, isThinking, shouldReduceMotion]);

  useEffect(() => {
    if (!isBroken) {
      return;
    }
    gazeX.set(0);
    gazeY.set(0);
    if (shouldReduceMotion) {
      return;
    }
    bodyControls.start(
      { rotate: [0, -11, 9, -7, 5, -3, 0], x: [0, -5, 4, -3, 2, -1, 0] },
      { duration: 1.05, ease: [0.45, 0, 0.55, 1] }
    );
  }, [bodyControls, gazeX, gazeY, isBroken, shouldReduceMotion]);

  useEffect(() => {
    if (!isHappy || shouldReduceMotion) {
      return;
    }
    bodyControls.start(
      {
        scaleX: [1, 1.08, 0.94, 1.04, 0.99, 1],
        scaleY: [1, 0.9, 1.08, 0.95, 1.02, 1],
        y: [0, 3, -9, 0, -3, 0],
      },
      { duration: 0.85, ease: EASE_OUT, times: [0, 0.12, 0.4, 0.62, 0.82, 1] }
    );
  }, [bodyControls, isHappy, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || !isListening) {
      return;
    }
    const unsubscribe = amplitudeValue.on("change", (level) => {
      bodyControls.set({ scale: 1 + level * 0.07, y: -level * 2 });
    });
    return unsubscribe;
  }, [amplitudeValue, bodyControls, isListening, shouldReduceMotion]);

  useEffect(() => {
    if (!(isListening || !mountedRef.current)) {
      bodyControls.set({ scale: 1, y: 0 });
    }
  }, [bodyControls, isListening]);

  const renderEye = (side: -1 | 1) => {
    const shape = side === -1 ? active.left : active.right;
    const controls = side === -1 ? leftLid : rightLid;

    const width = EYE_WIDTH * shape.w;
    const height = EYE_HEIGHT * shape.h;
    const x = CENTER + side * EYE_OFFSET - width / 2;
    const y = EYE_Y + (EYE_HEIGHT - height) / 2 + (shape.dy ?? 0);
    const cx = x + width / 2;
    const cy = y + height / 2;

    return (
      <motion.rect
        animate={controls}
        fill={finalColors.feature}
        height={Math.max(height, 0.5)}
        initial={{ scaleY: 1 }}
        rx={Math.min(EYE_RADIUS * shape.w, Math.max(height, 0.5) / 2)}
        style={{
          rotate: shape.rotate ?? 0,
          transformOrigin: `${cx}px ${cy}px`,
          x: gazeX,
          y: gazeY,
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { bounce: 0.1, duration: 0.25, type: "spring" }
        }
        width={width}
        x={x}
        y={y}
      />
    );
  };

  const renderDizzyEye = (side: -1 | 1) => (
    <motion.path
      animate={shouldReduceMotion ? undefined : { rotate: 360 * side }}
      d={SPIRAL}
      fill="none"
      stroke={finalColors.feature}
      strokeLinecap="round"
      strokeWidth={3}
      style={{
        scale: 1.5,
        x: CENTER + side * EYE_OFFSET,
        y: EYE_Y + EYE_HEIGHT / 2,
      }}
      transition={{
        duration: 2.4,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      }}
    />
  );

  const bodySpan = (96 / VIEWBOX / ORB_SPHERE_FRACTION) * 100;
  const bodyInset = (100 - bodySpan) / 2;

  return (
    <div
      className={cn("relative block", className)}
      style={{
        filter: `saturate(${stateMotion.saturation})`,
        height: resolvedSize,
        width: resolvedSize,
      }}
    >
      <motion.div
        animate={bodyControls}
        className="absolute"
        style={{
          height: `${bodySpan}%`,
          left: `${bodyInset}%`,
          top: `${bodyInset}%`,
          width: `${bodySpan}%`,
        }}
      >
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle at 34% 30%, ${finalColors.bodyEdge}, ${finalColors.body} 72%)`,
            inset: `${(1 - ORB_SPHERE_FRACTION) * 50}%`,
          }}
        />
        <Orb
          className="size-full"
          colors={[finalColors.body, finalColors.bodyEdge]}
          flow={0.6 + energy * 0.36}
          glow={0}
          size="100%"
          turbulence={0.4 + energy * 0.32}
        />
      </motion.div>
      <motion.svg
        animate={bodyControls}
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
        className="absolute inset-0 block size-full overflow-visible"
        ref={svgRef}
        role={ariaLabel ? "img" : undefined}
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      >
        <title>{ariaLabel ?? "AI assistant character"}</title>

        {isBroken ? null : renderEye(-1)}
        {isBroken ? null : renderEye(1)}
        {isBroken && renderDizzyEye(-1)}
        {isBroken && renderDizzyEye(1)}
      </motion.svg>
    </div>
  );
};

export default AIOrbFace;