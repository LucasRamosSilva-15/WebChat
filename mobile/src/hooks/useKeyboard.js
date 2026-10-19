import { useState, useEffect } from 'react';

export const useKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleViewportChange = () => {
      const windowHeight = window.innerHeight;
      const viewportHeight = window.visualViewport.height;
      const diff = windowHeight - viewportHeight;

      if (diff > 150) {
        setIsKeyboardVisible(true);
        setKeyboardHeight(diff);
      } else {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportChange);
    window.visualViewport.addEventListener('scroll', handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, []);

  return { isKeyboardVisible, keyboardHeight };
};
