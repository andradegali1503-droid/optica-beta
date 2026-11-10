"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface NumberTickerProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function NumberTicker({
  value,
  duration = 1.2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: NumberTickerProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!spanRef.current) return;

    const target = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(target, {
        val: value,
        duration: duration,
        ease: "power2.out",
        onUpdate: () => {
          if (spanRef.current) {
            spanRef.current.innerText = `${prefix}${target.val.toFixed(decimals)}${suffix}`;
          }
        },
      });
    }, spanRef);

    return () => ctx.revert();
  }, [value, duration, prefix, suffix, decimals]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
