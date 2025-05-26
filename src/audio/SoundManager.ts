export default class SoundManager {
	private sounds: {[key: string]: AudioBuffer} = {};
	private audioContext : AudioContext;
	private filter : BiquadFilterNode;
	private isMuffled : boolean = false;

	constructor() {
		// Init Sounds
		this.audioContext = new AudioContext();
		this.filter = this.audioContext.createBiquadFilter();
		this.filter.type = "lowpass";
		this.filter.frequency.value = 2000; // Set the cutoff frequency
		this.filter.connect(this.audioContext.destination);
	}


	async loadSounds()
	{
		const soundsFiles : {[key: string]: string} = {
			"background" : "/sounds/background.wav",
		}

		for (const sound in soundsFiles) {
			const rep = await fetch(soundsFiles[sound]);
			const arrBuffer = await rep.arrayBuffer();
			const audBuffer = await this.audioContext.decodeAudioData(arrBuffer);
			this.sounds[sound] = audBuffer;
			console.log(`Loaded sound: ${sound}`);
		}
	}
	play(sound : string)
	{
		const buff = this.sounds[sound];
		if (!buff) 
		{
			console.warn(`Sound "${sound}" not found.`);
			return;
		}
		const source = this.audioContext.createBufferSource();
		source.buffer = buff;
		source.connect(this.filter);
		source.start(0);
	}
	toggleMuffle()
	{
		this.isMuffled = !this.isMuffled;

		const TargFreq = this.isMuffled ? 200 : 2000; // Muffled frequency vs normal frequency

		this.filter.frequency.setTargetAtTime(
			TargFreq,
			this.audioContext.currentTime,
			0.5
		)
	}
}