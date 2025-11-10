import { useRef, useEffect } from 'react';

export const useAlertSound = () => {
  const audioRef = useRef(null);

  // Preload audio immediately
  useEffect(() => {
    audioRef.current = new Audio('/AlertSound.mp3');
    audioRef.current.volume = 0.8;
    audioRef.current.preload = 'auto';
    audioRef.current.load();
  }, []);

  const playAlert = () => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } catch (error) {
      console.error('Alert sound failed:', error);
    }
  };

  return { playAlert };
};