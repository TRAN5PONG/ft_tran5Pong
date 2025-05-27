export default class SoundManager {
	private soundUrl: string;
	private sound: AudioBuffer | null = null;
	private audioContext: AudioContext;
	private filter: BiquadFilterNode;
	private gainNode: GainNode;
	private isMuffled: boolean = false;
  
	constructor(soundUrl: string, audioContext: AudioContext) {
	  this.soundUrl = soundUrl;
	  this.audioContext = audioContext;
  
	  this.gainNode = this.audioContext.createGain();
	  this.filter = this.audioContext.createBiquadFilter();
	  this.filter.type = "lowpass";
	  this.filter.frequency.value = 2000;
  
	  // Connect nodes: Gain → Filter → Destination
	  this.gainNode.connect(this.filter);
	  this.filter.connect(this.audioContext.destination);
	}
  
	async loadSound() {
	  try {
		const rep = await fetch(this.soundUrl);
		const arrBuffer = await rep.arrayBuffer();
		const audBuffer = await this.audioContext.decodeAudioData(arrBuffer);
		this.sound = audBuffer;
	  } catch (err) {
		console.error(`Error loading sound from ${this.soundUrl}:`, err);
		this.sound = null;
	  }
	}
  
	play() {
	  if (!this.sound) {
		console.warn(`Sound not found.`);
		return;
	  }
	  const source = this.audioContext.createBufferSource();
	  source.buffer = this.sound;
  
	  // Connect the source to the gainNode
	  source.connect(this.gainNode);
	  source.start(0);
	}
  
	toggleMuffle() {
	  this.isMuffled = !this.isMuffled;
  
	  const TargFreq = this.isMuffled ? 200 : 2000;
  
	  this.filter.frequency.setTargetAtTime(
		TargFreq,
		this.audioContext.currentTime,
		0.5
	  );
	}
  
	setVolume(value: number) {
	  // value should be between 0.0 and 1.0
	  this.gainNode.gain.setValueAtTime(value, this.audioContext.currentTime);
	}
  }
  