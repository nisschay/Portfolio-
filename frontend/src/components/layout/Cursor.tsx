'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { lerp } from '@/lib/utils';

/**
 * Custom Cursor Component
 * Features a dot that follows immediately and a ring with smooth lag effect
 */
export function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  // Animation loop for smooth ring following
  const animate = useCallback(() => {
    // Lerp ring position towards mouse position
    ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.15);
    ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.15);

    if (ringRef.current) {
      ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Check for touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Update dot position immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }

      if (!isVisible) {
        setIsVisible(true);
        // Initialize ring position to mouse position
        ringPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Handle hover states
    const handleElementMouseEnter = () => setIsHovering(true);
    const handleElementMouseLeave = () => setIsHovering(false);

    // Add listeners for interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleElementMouseEnter);
      el.addEventListener('mouseleave', handleElementMouseLeave);
    });

    // Global listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);

      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleElementMouseEnter);
        el.removeEventListener('mouseleave', handleElementMouseLeave);
      });

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate, isVisible]);

  // Re-attach hover listeners when DOM changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
      );

      elements.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {/* Cursor Dot */}
      <div
        ref={dotRef}
        className={`
          cursor fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999]
          mix-blend-difference bg-base
          transition-transform duration-150 ease-out-quart
          ${isVisible ? 'opacity-100' : 'opacity-0'}
          ${isHovering ? 'scale-150' : 'scale-100'}
        `}
        style={{ willChange: 'transform' }}
      />
      
      {/* Cursor Ring */}
      <div
        ref={ringRef}
        className={`
          cursor fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999]
          border border-base mix-blend-difference
          transition-[width,height,opacity] duration-300 ease-out-expo
          ${isVisible ? 'opacity-50' : 'opacity-0'}
          ${isHovering ? 'w-14 h-14 opacity-80' : ''}
        `}
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
