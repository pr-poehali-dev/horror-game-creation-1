class AudioSystem {
  private backgroundMusic: HTMLAudioElement | null = null;
  private soundEffects: { [key: string]: HTMLAudioElement } = {};
  private musicVolume = 0.3;
  private sfxVolume = 0.6;

  playBackgroundMusic(track: 'menu' | 'exploration' | 'battle') {
    this.stopBackgroundMusic();
    
    try {
      this.backgroundMusic = new Audio();
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.musicVolume;
      
      switch(track) {
        case 'menu':
          this.playMenuMusic();
          break;
        case 'exploration':
          this.playExplorationMusic();
          break;
        case 'battle':
          this.playBattleMusic();
          break;
      }
      
      this.backgroundMusic.play().catch(() => {});
    } catch (e) {
      console.log('Background music failed to load');
    }
  }

  private playMenuMusic() {
    if (!this.backgroundMusic) return;
    
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 110;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;
  }

  private playExplorationMusic() {
    if (!this.backgroundMusic) return;
    
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 65.41;
    oscillator.type = 'sawtooth';
    gainNode.gain.value = 0.08;
  }

  private playBattleMusic() {
    if (!this.backgroundMusic) return;
    
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 130.81;
    oscillator.type = 'square';
    gainNode.gain.value = 0.12;
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    }
  }

  playSoundEffect(effect: 'button' | 'attack' | 'damage' | 'heal' | 'dialog') {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch(effect) {
        case 'button':
          oscillator.frequency.value = 440;
          oscillator.type = 'square';
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
          
        case 'attack':
          oscillator.frequency.value = 220;
          oscillator.type = 'sawtooth';
          gainNode.gain.value = 0.2;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.15);
          break;
          
        case 'damage':
          oscillator.frequency.value = 110;
          oscillator.type = 'square';
          gainNode.gain.value = 0.3;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
          
        case 'heal':
          oscillator.frequency.value = 880;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.15;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
          
        case 'dialog':
          oscillator.frequency.value = 330;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.05;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.05);
          break;
      }
    } catch (e) {
      console.log('Sound effect failed');
    }
  }

  playScreamerSound(enemyName: string) {
    try {
      const audioContext = new AudioContext();
      const duration = 2.5;
      
      if (enemyName === 'Призрак алтаря') {
        this.playGhostScream(audioContext, duration);
      } else if (enemyName === 'Восставший мертвец') {
        this.playZombieScream(audioContext, duration);
      } else {
        this.playGhostScream(audioContext, duration);
      }
    } catch (e) {
      console.log('Screamer sound failed');
    }
  }

  private playGhostScream(audioContext: AudioContext, duration: number) {
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const oscillator3 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    oscillator3.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(audioContext.destination);
    
    oscillator1.type = 'sawtooth';
    oscillator2.type = 'square';
    oscillator3.type = 'sine';
    
    oscillator1.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + duration);
    
    oscillator2.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(450, audioContext.currentTime + duration);
    
    oscillator3.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator3.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + duration);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + duration - 0.5);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    
    oscillator1.start();
    oscillator2.start();
    oscillator3.start();
    oscillator1.stop(audioContext.currentTime + duration);
    oscillator2.stop(audioContext.currentTime + duration);
    oscillator3.stop(audioContext.currentTime + duration);
  }

  private playZombieScream(audioContext: AudioContext, duration: number) {
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    
    const noiseGain = audioContext.createGain();
    const oscGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    noise.connect(noiseGain);
    oscillator1.connect(oscGain);
    oscillator2.connect(oscGain);
    
    noiseGain.connect(filter);
    oscGain.connect(filter);
    filter.connect(audioContext.destination);
    
    oscillator1.type = 'sawtooth';
    oscillator2.type = 'square';
    
    oscillator1.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + duration);
    
    oscillator2.frequency.setValueAtTime(60, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + duration);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, audioContext.currentTime);
    filter.Q.value = 5;
    
    noiseGain.gain.setValueAtTime(0, audioContext.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.1);
    noiseGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + duration - 0.5);
    noiseGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    
    oscGain.gain.setValueAtTime(0, audioContext.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
    oscGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + duration - 0.5);
    oscGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    
    noise.start();
    oscillator1.start();
    oscillator2.start();
    noise.stop(audioContext.currentTime + duration);
    oscillator1.stop(audioContext.currentTime + duration);
    oscillator2.stop(audioContext.currentTime + duration);
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume;
    }
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}

export const audioSystem = new AudioSystem();
