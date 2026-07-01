import { useCallback } from 'react';
import { soundManager } from '../sound';

export function useSound() {
  const play = useCallback((soundKey: string) => {
    soundManager.play(soundKey);
  }, []);

  const setVolume = useCallback((volume: number) => {
    soundManager.setVolume(volume);
  }, []);

  const toggle = useCallback(() => {
    soundManager.toggle();
  }, []);

  return {
    play,
    setVolume,
    toggle,
    isEnabled: soundManager.isEnabled(),
    volume: soundManager.getVolume()
  };
}
