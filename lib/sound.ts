// Sound effects manager
class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    this.loadSounds();
  }

  private loadSounds(): void {
    const soundMap = {
      click: '/sounds/click.mp3',
      success: '/sounds/success.mp3',
      error: '/sounds/error.mp3',
      notification: '/sounds/notification.mp3',
      mining: '/sounds/mining.mp3',
      levelup: '/sounds/levelup.mp3',
      coin_collect: '/sounds/coin_collect.mp3',
      achievement_unlock: '/sounds/achievement_unlock.mp3',
      casino_win: '/sounds/casino_win.mp3',
      casino_lose: '/sounds/casino_lose.mp3',
      card_flip: '/sounds/card_flip.mp3',
      guild_joined: '/sounds/guild_joined.mp3',
    };

    Object.entries(soundMap).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.volume = this.volume;
      this.sounds.set(key, audio);
    });
  }

  play(soundKey: string): void {
    if (!this.enabled) return;

    const sound = this.sounds.get(soundKey);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.error('Sound play error:', err));
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => (sound.volume = this.volume));
  }

  toggle(): void {
    this.enabled = !this.enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }
}

export const soundManager = new SoundManager();
