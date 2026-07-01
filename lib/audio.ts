export type SoundType = 
  | 'click' 
  | 'success' 
  | 'error' 
  | 'reward' 
  | 'achievement' 
  | 'notification'
  | 'game_win'
  | 'game_lose'
  | 'coin'
  | 'level_up';

class AudioManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('soundEnabled') !== 'false';
      this.volume = parseFloat(localStorage.getItem('soundVolume') || '0.5');
    }
  }

  private initContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled) return;

    try {
      const context = this.initContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(this.volume, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  play(sound: SoundType) {
    if (!this.enabled) return;

    switch (sound) {
      case 'click':
        this.playTone(800, 0.1, 'sine');
        break;
      case 'success':
        this.playTone(600, 0.1, 'sine');
        setTimeout(() => this.playTone(800, 0.1, 'sine'), 100);
        break;
      case 'error':
        this.playTone(300, 0.2, 'sawtooth');
        break;
      case 'reward':
        this.playTone(523, 0.1, 'sine');
        setTimeout(() => this.playTone(659, 0.1, 'sine'), 100);
        setTimeout(() => this.playTone(784, 0.15, 'sine'), 200);
        break;
      case 'achievement':
        this.playTone(523, 0.15, 'sine');
        setTimeout(() => this.playTone(659, 0.15, 'sine'), 150);
        setTimeout(() => this.playTone(784, 0.15, 'sine'), 300);
        setTimeout(() => this.playTone(1047, 0.3, 'sine'), 450);
        break;
      case 'notification':
        this.playTone(440, 0.1, 'sine');
        setTimeout(() => this.playTone(880, 0.1, 'sine'), 100);
        break;
      case 'game_win':
        this.playTone(523, 0.1, 'square');
        setTimeout(() => this.playTone(659, 0.1, 'square'), 100);
        setTimeout(() => this.playTone(784, 0.1, 'square'), 200);
        setTimeout(() => this.playTone(1047, 0.2, 'square'), 300);
        break;
      case 'game_lose':
        this.playTone(400, 0.2, 'sawtooth');
        setTimeout(() => this.playTone(300, 0.3, 'sawtooth'), 200);
        break;
      case 'coin':
        this.playTone(988, 0.05, 'sine');
        setTimeout(() => this.playTone(1319, 0.08, 'sine'), 50);
        break;
      case 'level_up':
        this.playTone(523, 0.1, 'sine');
        setTimeout(() => this.playTone(659, 0.1, 'sine'), 100);
        setTimeout(() => this.playTone(784, 0.1, 'sine'), 200);
        setTimeout(() => this.playTone(1047, 0.1, 'sine'), 300);
        setTimeout(() => this.playTone(1319, 0.2, 'sine'), 400);
        break;
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundEnabled', enabled.toString());
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundVolume', this.volume.toString());
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }
}

export const audioManager = new AudioManager();
