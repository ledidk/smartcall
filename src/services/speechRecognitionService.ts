export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  constructor() {
    // Initialize Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 3;
  }

  startListening(
    onResult: (transcript: string, confidence: number, isFinal: boolean) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.recognition || this.isListening) return false;

    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 0.5; // Fallback confidence
        const isFinal = result.isFinal;

        onResult(transcript, confidence, isFinal);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      if (onError) {
        // Pass the specific error type to the error handler
        onError(event.error);
      }
    };

    this.recognition.onend = () => {
      // Only restart if we're still supposed to be listening
      // and it wasn't stopped due to an error
      if (this.isListening) {
        try {
          this.recognition?.start();
        } catch (error) {
          console.error('Failed to restart speech recognition:', error);
          this.isListening = false;
        }
      }
    };

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      if (onError) {
        onError('Failed to start speech recognition. Please check your microphone permissions.');
      }
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  getStatus(): boolean {
    return this.isListening;
  }
}