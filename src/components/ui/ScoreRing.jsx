import { useEffect, useRef, useState } from 'react';
import './ScoreRing.css';

/**
 * Animated SVG score ring.
 * Displays a circular progress indicator with a counting score number.
 *
 * @param {number} score - 0 to 100
 * @param {number} size - Diameter in px (default 200)
 * @param {number} strokeWidth - Ring thickness in px (default 10)
 * @param {boolean} animate - Whether to animate on mount (default true)
 */
export default function ScoreRing({
  score = 0,
  size = 200,
  strokeWidth = 10,
  animate = true,
}) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [hasAnimated, setHasAnimated] = useState(!animate);
  const ringRef = useRef(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  /* Determine color based on score thresholds */
  const getColor = (s) => {
    if (s < 40) return 'var(--status-danger)';
    if (s < 70) return 'var(--status-warn)';
    return 'var(--status-safe)';
  };

  /* Intersection Observer to trigger animation when visible */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setDisplayScore(score);
      setHasAnimated(true);
      return;
    }

    if (!animate || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();

          /* Animate the count-up */
          let start = 0;
          const duration = 1200;
          const startTime = performance.now();

          const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            /* Ease-out cubic */
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * score);
            setDisplayScore(current);
            if (progress < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (ringRef.current) observer.observe(ringRef.current);
    return () => observer.disconnect();
  }, [animate, hasAnimated, score]);

  return (
    <div className="score-ring" ref={ringRef} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="score-ring__svg"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
        />
        {/* Animated fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={hasAnimated ? offset : circumference}
          className="score-ring__progress"
          style={{
            transition: hasAnimated && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? `stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)`
              : 'none',
          }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="score-ring__label">
        <span
          className="score-ring__number"
          style={{ color: getColor(score) }}
        >
          {displayScore}
        </span>
        <span className="score-ring__unit">/100</span>
      </div>
    </div>
  );
}
