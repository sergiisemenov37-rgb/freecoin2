import { useEffect } from 'react';
import { audioManager, SoundType } from '../lib/audio';

export function useSound() {
  const play = (sound: SoundType) => {
    audioManager.play(sound);
  };

  const setEnabled = (enabled: boolean) => {
    audioManager.setEnabled(enabled);
  };

  const setVolume = (volume: number) => {
    audioManager.setVolume(volume);
  };

  const isEnabled = () => {
    return audioManager.isEnabled();
  };

  const getVolume = () => {
    return audioManager.getVolume();
  };

  return { play, setEnabled, setVolume, isEnabled, getVolume };
}

export function useSoundEffect(sound: SoundType, trigger: boolean) {
  useEffect(() => {
    if (trigger) {
      audioManager.play(sound);
    }
  }, [trigger, sound]);
}
