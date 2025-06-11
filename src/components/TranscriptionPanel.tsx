import React from 'react';
import { Mic, Volume2, Clock } from 'lucide-react';
import { CallMessage } from '../types';

interface TranscriptionPanelProps {
  messages: CallMessage[];
  isCallActive: boolean;
}

export const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  messages,
  isCallActive
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isCallActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <h2 className="text-lg font-semibold text-gray-900">Live Transcription</h2>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Real-time</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.speaker === 'agent' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.speaker === 'customer'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {message.speaker === 'customer' ? (
                  <Volume2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <Mic className="w-4 h-4 text-gray-600" />
                )}
                <span className="text-xs font-medium capitalize">
                  {message.speaker}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{message.message}</p>
              {message.confidence && (
                <div className="mt-2 flex items-center space-x-1">
                  <div className="text-xs text-gray-500">Confidence:</div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    message.confidence > 0.9 ? 'bg-green-100 text-green-800' : 
                    message.confidence > 0.8 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {Math.round(message.confidence * 100)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isCallActive && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">Call ended. Transcription paused.</p>
        </div>
      )}
    </div>
  );
};