import { useEffect, useRef, useState } from "react";

/**
 * Parses a stat string like "$50M+", "400+", "5+" into parts.
 */
function parseValue(value: string) {
  const match = value.match(/^([^0-9]*)(\d+)(.*)$/);
  if (!match) return { prefix: "", num: 0, suffix: value };
  return { prefix: match[1], num: parseInt(match[2], 10), suffix: match[3] };
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export function CountUp({
  value,
  duration = 2000,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const { prefix, num, suffix } = parseValue(value);
          if (num === 0) {
            setDisplay(value);
            return;
          }

          let start: number | null = null;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(easeOutQuart(progress) * num);
            setDisplay(`${prefix}${current}${suffix}`);
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          setDisplay(`${prefix}0${suffix}`);
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
