import React from 'react';
import { Headphones, Brain, Users } from 'lucide-react';
import { TranscriptionPanel } from './TranscriptionPanel';
import { ResponseSuggestions } from './ResponseSuggestions';
import { CallSummary } from './CallSummary';
import { AgentControls } from './AgentControls';
import { BluetoothControls } from './BluetoothControls';
import { FileUpload } from './FileUpload';
import { FileAnalysisResults } from './FileAnalysisResults';
import { useCallSimulation } from '../hooks/useCallSimulation';
import { mockSummary, mockMetrics } from '../utils/mockData';

export const Dashboard: React.FC = () => {
  const {
    messages,
    currentSuggestions,
    isCallActive,
    fileAnalyses,
    addAgentResponse,
    addTranscription,
    editSuggestion,
    toggleCall,
    addFileAnalysis
  } = useCallSimulation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SmartCall AI</h1>
                <p className="text-sm text-gray-600">Real-time Call Center Assistant with Bluetooth & File Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Agent: Sarah Johnson</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Headphones className="w-4 h-4" />
                <span>Queue: 3 waiting</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Transcription */}
          <div className="xl:col-span-1">
            <div className="space-y-6">
              <TranscriptionPanel 
                messages={messages} 
                isCallActive={isCallActive}
              />
              <BluetoothControls onTranscription={addTranscription} />
            </div>
          </div>

          {/* Middle Column - AI Suggestions */}
          <div className="xl:col-span-1">
            <ResponseSuggestions
              suggestions={currentSuggestions}
              onSendResponse={addAgentResponse}
              onEditSuggestion={editSuggestion}
            />
          </div>

          {/* Right Column - Summary & Controls */}
          <div className="xl:col-span-1 space-y-6">
            <div className="h-96">
              <CallSummary summary={mockSummary} />
            </div>
            <AgentControls
              isCallActive={isCallActive}
              onToggleCall={toggleCall}
              metrics={mockMetrics}
            />
          </div>

          {/* Far Right Column - File Analysis */}
          <div className="xl:col-span-1 space-y-6">
            <FileUpload onAnalysisComplete={addFileAnalysis} />
            <FileAnalysisResults analyses={fileAnalyses} />
          </div>
        </div>
      </main>
    </div>
  );
};