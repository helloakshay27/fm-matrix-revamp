/**
 * Casino-style spinning sound generator using Web Audio API
 */
class SpinSound {
    private audioContext: AudioContext | null = null;
    private oscillator: OscillatorNode | null = null;
    private gainNode: GainNode | null = null;
    private isPlaying: boolean = false;

    constructor() {
        // Initialize AudioContext on first user interaction
        if (typeof window !== "undefined") {
            const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (AudioContextClass) {
                this.audioContext = new AudioContextClass();
            }
        }
    }

    /**
     * Play casino spinning sound
     * Creates a descending tone that mimics a spinning wheel slowing down
     */
    play() {
        if (!this.audioContext || this.isPlaying) return;

        this.isPlaying = true;
        const currentTime = this.audioContext.currentTime;

        // Create oscillator for the spinning sound
        this.oscillator = this.audioContext.createOscillator();
        this.gainNode = this.audioContext.createGain();

        // Connect nodes
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        // Set initial frequency (higher pitch)
        this.oscillator.frequency.setValueAtTime(800, currentTime);

        // Gradually decrease frequency to simulate slowing down
        this.oscillator.frequency.exponentialRampToValueAtTime(
            200,
            currentTime + 4
        );

        // Set volume envelope
        this.gainNode.gain.setValueAtTime(0, currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.1);
        this.gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 3.5);
        this.gainNode.gain.linearRampToValueAtTime(0, currentTime + 4);

        // Set waveform type
        this.oscillator.type = "triangle";

        // Start and stop
        this.oscillator.start(currentTime);
        this.oscillator.stop(currentTime + 4);

        // Clean up when done
        this.oscillator.onended = () => {
            this.isPlaying = false;
            this.oscillator?.disconnect();
            this.gainNode?.disconnect();
        };

        // Add clicking sounds during spin
        this.addClickingSounds(currentTime);
    }

    /**
     * Add clicking sounds to simulate wheel ticks
     */
    private addClickingSounds(startTime: number) {
        if (!this.audioContext) return;

        // Number of clicks decreases as wheel slows down
        const clickTimes = [
            0, 0.08, 0.16, 0.25, 0.35, 0.46, 0.58, 0.72, 0.87, 1.04, 1.23, 1.44,
            1.67, 1.92, 2.19, 2.48, 2.79, 3.12, 3.47, 3.84,
        ];

        clickTimes.forEach((clickTime) => {
            const oscillator = this.audioContext!.createOscillator();
            const clickGain = this.audioContext!.createGain();

            oscillator.connect(clickGain);
            clickGain.connect(this.audioContext!.destination);

            // Sharp, short click sound
            oscillator.frequency.setValueAtTime(1000, startTime + clickTime);
            oscillator.type = "square";

            clickGain.gain.setValueAtTime(0.1, startTime + clickTime);
            clickGain.gain.exponentialRampToValueAtTime(
                0.01,
                startTime + clickTime + 0.05
            );

            oscillator.start(startTime + clickTime);
            oscillator.stop(startTime + clickTime + 0.05);
        });
    }

    /**
     * Play win celebration sound
     */
    playWinSound() {
        if (!this.audioContext) return;

        const currentTime = this.audioContext.currentTime;

        // Create ascending notes for celebration
        const notes = [523.25, 659.25, 783.99]; // C, E, G (major chord)

        notes.forEach((frequency, index) => {
            const oscillator = this.audioContext!.createOscillator();
            const gainNode = this.audioContext!.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext!.destination);

            oscillator.frequency.setValueAtTime(
                frequency,
                currentTime + index * 0.15
            );
            oscillator.type = "sine";

            gainNode.gain.setValueAtTime(0, currentTime + index * 0.15);
            gainNode.gain.linearRampToValueAtTime(
                0.3,
                currentTime + index * 0.15 + 0.05
            );
            gainNode.gain.linearRampToValueAtTime(
                0,
                currentTime + index * 0.15 + 0.5
            );

            oscillator.start(currentTime + index * 0.15);
            oscillator.stop(currentTime + index * 0.15 + 0.5);
        });
    }

    /**
     * Stop any playing sounds
     */
    stop() {
        if (this.oscillator) {
            try {
                this.oscillator.stop();
            } catch (e) {
                // Already stopped
            }
        }
        this.isPlaying = false;
    }
}

export const spinSound = new SpinSound();
export default spinSound;
