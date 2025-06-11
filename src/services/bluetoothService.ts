export class BluetoothService {
  private device: BluetoothDevice | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private isListening = false;

  async requestBluetoothDevice(): Promise<BluetoothDevice | null> {
    try {
      // Request Bluetooth device - use acceptAllDevices to allow user to select any available device
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information']
      });

      this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
      return this.device;
    } catch (error) {
      console.error('Bluetooth request failed:', error);
      return null;
    }
  }

  async connectToDevice(): Promise<boolean> {
    if (!this.device) return false;

    try {
      const server = await this.device.gatt?.connect();
      console.log('Connected to Bluetooth device:', this.device.name);
      return true;
    } catch (error) {
      console.error('Failed to connect to Bluetooth device:', error);
      return false;
    }
  }

  async initializeAudioProcessing(): Promise<boolean> {
    try {
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Get user media (microphone access)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Create audio source and analyser
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;

      this.microphone.connect(this.analyser);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize audio processing:', error);
      return false;
    }
  }

  startListening(onAudioData: (data: { level: number; frequency: number }) => void): void {
    if (!this.analyser || this.isListening) return;

    this.isListening = true;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const processAudio = () => {
      if (!this.isListening) return;

      this.analyser!.getByteFrequencyData(dataArray);
      
      // Calculate audio level
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / bufferLength;
      const level = average / 255;

      // Find dominant frequency
      const maxIndex = dataArray.indexOf(Math.max(...dataArray));
      const frequency = (maxIndex * this.audioContext!.sampleRate) / (2 * bufferLength);

      onAudioData({ level, frequency });
      requestAnimationFrame(processAudio);
    };

    processAudio();
  }

  stopListening(): void {
    this.isListening = false;
  }

  // Speaker separation logic based on audio characteristics
  identifySpeaker(audioData: { level: number; frequency: number }): 'agent' | 'customer' {
    // Simple heuristic: lower frequencies typically indicate agent (closer to mic)
    // Higher frequencies or lower levels might indicate customer (through phone/bluetooth)
    
    if (audioData.frequency < 300 && audioData.level > 0.3) {
      return 'agent';
    } else {
      return 'customer';
    }
  }

  private onDisconnected = () => {
    console.log('Bluetooth device disconnected');
    this.device = null;
  };

  disconnect(): void {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.stopListening();
  }

  getConnectionStatus(): boolean {
    return this.device?.gatt?.connected || false;
  }
}