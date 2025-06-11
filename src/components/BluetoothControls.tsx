import React, { useState, useEffect } from 'react';
import { Bluetooth, BluetoothConnected, Mic, MicOff, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { BluetoothService } from '../services/bluetoothService';
import { SpeechRecognitionService } from '../services/speechRecognitionService';

interface BluetoothControlsProps {
  onTranscription: (text: string, speaker: 'agent' | 'customer', confidence: number) => void;
}

export const BluetoothControls: React.FC<BluetoothControlsProps> = ({ onTranscription }) => {
  const [bluetoothService] = useState(() => new BluetoothService());
  const [speechService] = useState(() => new SpeechRecognitionService());
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<'agent' | 'customer'>('customer');
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      bluetoothService.disconnect();
      speechService.stopListening();
    };
  }, [bluetoothService, speechService]);

  const handleBluetoothConnect = async () => {
    try {
      const device = await bluetoothService.requestBluetoothDevice();
      if (device) {
        const connected = await bluetoothService.connectToDevice();
        setIsBluetoothConnected(connected);
        
        if (connected) {
          await bluetoothService.initializeAudioProcessing();
        }
      }
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
    }
  };

  const handleStartListening = async () => {
    if (!speechService.isSupported()) {
      setPermissionError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Clear any previous permission errors
    setPermissionError(null);

    const started = speechService.startListening(
      (transcript, confidence, isFinal) => {
        if (isFinal && transcript.trim()) {
          onTranscription(transcript, currentSpeaker, confidence);
        }
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
        
        // Handle specific error types
        switch (error) {
          case 'not-allowed':
            setPermissionError('Microphone access denied. Please allow microphone access in your browser settings and try again.');
            break;
          case 'no-speech':
            setPermissionError('No speech detected. Please speak clearly into your microphone.');
            break;
          case 'audio-capture':
            setPermissionError('No microphone found. Please check your microphone connection.');
            break;
          case 'network':
            setPermissionError('Network error occurred. Please check your internet connection.');
            break;
          default:
            setPermissionError(`Speech recognition error: ${error}. Please try again.`);
        }
      }
    );

    if (started) {
      setIsListening(true);
      
      // Start audio level monitoring
      bluetoothService.startListening((audioData) => {
        setAudioLevel(audioData.level);
        const speaker = bluetoothService.identifySpeaker(audioData);
        setCurrentSpeaker(speaker);
      });
    }
  };

  const handleStopListening = () => {
    speechService.stopListening();
    bluetoothService.stopListening();
    setIsListening(false);
    setAudioLevel(0);
    setPermissionError(null);
  };

  const handleDisconnect = () => {
    bluetoothService.disconnect();
    setIsBluetoothConnected(false);
    handleStopListening();
  };

  const handleDismissError = () => {
    setPermissionError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Controls</h3>
      
      {/* Permission Error Alert */}
      {permissionError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{permissionError}</p>
              <div className="mt-2 text-xs text-red-600">
                <p><strong>To fix this:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Click the microphone icon in your browser's address bar</li>
                  <li>Select "Allow" for microphone access</li>
                  <li>Refresh the page if needed</li>
                </ul>
              </div>
            </div>
            <button
              onClick={handleDismissError}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Bluetooth Connection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isBluetoothConnected ? (
              <BluetoothConnected className="w-5 h-5 text-blue-600" />
            ) : (
              <Bluetooth className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-sm font-medium">
              {isBluetoothConnected ? 'Bluetooth Connected' : 'Bluetooth Disconnected'}
            </span>
          </div>
          
          {isBluetoothConnected ? (
            <button
              onClick={handleDisconnect}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleBluetoothConnect}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Connect
            </button>
          )}
        </div>

        {/* Audio Listening Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isListening ? (
              <Mic className="w-5 h-5 text-green-600" />
            ) : (
              <MicOff className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-sm font-medium">
              {isListening ? 'Listening...' : 'Not Listening'}
            </span>
          </div>
          
          {isListening ? (
            <button
              onClick={handleStopListening}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={handleStartListening}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              disabled={!!permissionError}
            >
              Start Listening
            </button>
          )}
        </div>

        {/* Audio Level Indicator */}
        {isListening && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Audio Level</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-100"
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              Current Speaker: <span className="font-medium capitalize">{currentSpeaker}</span>
            </div>
          </div>
        )}

        {/* Browser Support Info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <p><strong>Requirements:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>HTTPS connection (localhost is secure)</li>
            <li>Microphone permission granted</li>
            <li>Chrome, Edge, or Safari browser recommended</li>
            <li>Bluetooth audio requires additional user permission</li>
          </ul>
        </div>
      </div>
    </div>
  );
};