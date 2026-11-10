---
name: gsap-animation-expert
description: >-
  Advanced animation workflows with GreenSock GSAP. High-performance DOM timelines,
  SVG optical lens refractions, numeric diopter tickers, and complex entrance orchestrations.
---

# GSAP Animation Expert Guidelines

## Key Strengths of GSAP in Optical SaaS
1. **High-Precision Timelines:**
   - Sequential staggered reveal of multi-metric clinical dashboard cards.
   - SVG visual simulations of eye lens focus (focal point adjustment animation).
2. **Numeric Counters (Tickers):**
   - Smooth counting up of revenue, inventory count, and completed clinical appointments.
3. **Clean Cleanup in React:**
   - Always use `gsap.context()` inside `useLayoutEffect` or `useEffect` to avoid memory leaks and ghost animations during Next.js client-side navigations.

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function NumberCounter({ value }: { value: number }) {
  const elRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          if (elRef.current) elRef.current.innerText = obj.val.toFixed(0);
        }
      });
    }, elRef);
    return () => ctx.revert();
  }, [value]);

  return <span ref={elRef}>0</span>;
}
```
