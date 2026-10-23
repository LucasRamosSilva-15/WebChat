import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollDirection({
  threshold = 12,
  initialVisible = true,
  topOffset = 24,
  enabled = true
} = {}) {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [scrollDirection, setScrollDirection] = useState('none');
  const [isAtTop, setIsAtTop] = useState(true);
  const location = useLocation();

  const prevScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScroll = useCallback(() => {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );

    const diff = currentScrollY - prevScrollY.current;

    setIsAtTop(currentScrollY <= topOffset);

    if (currentScrollY <= topOffset) {
      setIsVisible(true);
      setScrollDirection('up');
      prevScrollY.current = Math.max(0, currentScrollY);
      ticking.current = false;
      return;
    }

    if (windowHeight + currentScrollY >= documentHeight - 40) {
      setIsVisible(true);
      setScrollDirection('up');
      prevScrollY.current = currentScrollY;
      ticking.current = false;
      return;
    }

    if (Math.abs(diff) >= threshold) {
      if (diff > 0 && currentScrollY > topOffset) {
        setIsVisible(false);
        setScrollDirection('down');
      } else if (diff < 0) {
        setIsVisible(true);
        setScrollDirection('up');
      }
      prevScrollY.current = currentScrollY;
    }

    ticking.current = false;
  }, [threshold, topOffset]);

  const onScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(updateScroll);
      ticking.current = true;
    }
  }, [updateScroll]);

  useEffect(() => {
    setIsVisible(true);
    setScrollDirection('none');
    setIsAtTop(true);
    prevScrollY.current = window.pageYOffset || document.documentElement.scrollTop || 0;
  }, [location.pathname]);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true);
      return undefined;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });

    let touchStartY = 0;

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

      if (scrollY <= topOffset) {
        setIsVisible(true);
        return;
      }

      if (diff < -35) {
        setIsVisible(false);
        setScrollDirection('down');
      } else if (diff > 35) {
        setIsVisible(true);
        setScrollDirection('up');
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [enabled, onScroll, topOffset]);

  return {
    isVisible,
    scrollDirection,
    isAtTop,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false)
  };
}
