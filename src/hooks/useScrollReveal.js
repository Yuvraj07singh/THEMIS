import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Custom hook that applies scroll-triggered reveal animations
 * to all elements with the .reveal, .reveal-left, or .reveal-right class
 * within a given container ref.
 *
 * Animations fire once and do not replay on scroll-up.
 */
export function useScrollReveal(containerRef) {
  useEffect(() => {
    if (!containerRef?.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      /* If user prefers reduced motion, make everything visible immediately */
      const elements = containerRef.current.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right'
      );
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const ctx = gsap.context(() => {
      const reveals = containerRef.current.querySelectorAll('.reveal');
      reveals.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
            delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
          }
        );
      });

      const revealsLeft = containerRef.current.querySelectorAll('.reveal-left');
      revealsLeft.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
            delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
          }
        );
      });

      const revealsRight = containerRef.current.querySelectorAll('.reveal-right');
      revealsRight.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
            delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}
