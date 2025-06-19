import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

/**
 * Applies a standard page load animation (fade/slide in) to given elements.
 * Re-triggers on route change.
 *
 * @param {object} refs - Object containing refs: { containerRef, titleRef, contentRefs = [] }
 */
export function usePageAnimation({ containerRef, titleRef, contentRefs = [] }) {
  const location = useLocation();

  // Depend on pathname and the refs to ensure re-animation
  useEffect(() => { 
    // 1. Set initial state using autoAlpha (Handles opacity and visibility)
    const elementsToReset = [
      containerRef?.current,
      titleRef?.current,
      ...(Array.isArray(contentRefs) ? contentRefs.map(ref => ref?.current) : [contentRefs?.current])
    ].filter(Boolean);

    if (!elementsToReset.length) return; // Exit if no elements to animate

    gsap.set(elementsToReset, { autoAlpha: 0 }); // Use autoAlpha for visibility and opacity
    if (titleRef?.current) gsap.set(titleRef.current, { y: -20 });
    if (Array.isArray(contentRefs)) {
      const validContentNodes = contentRefs.map(ref => ref?.current).filter(Boolean);
      if (validContentNodes.length > 0) gsap.set(validContentNodes, { y: 20 });
    }

    // 2. Create animation timeline
    const tl = gsap.timeline({ delay: 0.1 });

    if (containerRef?.current) {
      tl.to(containerRef.current, { // Animate container using autoAlpha
        autoAlpha: 1,
        duration: 0.4,
        ease: 'power1.inOut',
      }, 0);
    }

    if (titleRef?.current) { // Ensure ref exists
      tl.to(titleRef.current, {
        autoAlpha: 1, // Use autoAlpha
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, containerRef?.current ? "-=0.2" : 0);
    }

    if (Array.isArray(contentRefs)) {
      const validContentNodes = contentRefs.map(ref => ref?.current).filter(Boolean);
      if (validContentNodes.length > 0) {
        tl.to(validContentNodes, {
          autoAlpha: 1, // Use autoAlpha
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.15,
        }, titleRef?.current ? "-=0.4" : (containerRef?.current ? "-=0.2" : 0) );
      }
    }

    return () => {
      tl.kill();
    };
  }, [location.pathname]); // Only depend on pathname change
}
