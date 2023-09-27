import { useEffect, useRef } from 'react';

type SwipeCallback = () => void;

export const handleTouchStart = (event: TouchEvent) => {
  // Just capturing the touch start
};

export const handleTouchMove = (event: TouchEvent) => {
  if (event.changedTouches && event.changedTouches.length) {
    const touch = event.changedTouches[0];
    const moveX = touch.clientX;
    const moveY = touch.clientY;

    // Check for a horizontal swipe
    if (Math.abs(moveX) > Math.abs(moveY)) {
      event.preventDefault(); // Prevent only horizontal swipe
    }
  }
};

const useSwipe = (onSwipeLeft?: SwipeCallback, onSwipeRight?: SwipeCallback) => {
  const xDown = useRef<number | null>(null);

  const handleTouchStartLocal = (event: TouchEvent) => {
    const firstTouch = event.touches[0];
    xDown.current = firstTouch.clientX;
  };

  const handleTouchMoveLocal = (event: TouchEvent) => {
    if (xDown.current === null) {
      return;
    }

    const xUp = event.touches[0].clientX;
    const xDiff = xDown.current - xUp;

    if (Math.abs(xDiff) > 0) {
      if (xDiff > 0) {
        onSwipeLeft && onSwipeLeft();
      } else {
        onSwipeRight && onSwipeRight();
      }
    }

    xDown.current = null;
  };

  useEffect(() => {
    // Remove the global swipe prevention
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);

    // Add local swipe detection
    document.addEventListener('touchstart', handleTouchStartLocal, { passive: false });
    document.addEventListener('touchmove', handleTouchMoveLocal, { passive: false });

    return () => {
      // Remove local swipe detection
      document.removeEventListener('touchstart', handleTouchStartLocal);
      document.removeEventListener('touchmove', handleTouchMoveLocal);

      // Restore the global swipe prevention
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    };
  }, [onSwipeLeft, onSwipeRight]);
};

export default useSwipe;
