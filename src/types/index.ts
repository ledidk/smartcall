export interface CallMessage {
  id: string;
  speaker: 'customer' | 'agent';
  message: string;
  timestamp: Date;
  confidence?: number;
  audioLevel?: number;
}

export interface SuggestedResponse {
  id: string;
  text: string;
  confidence: number;
  category: 'greeting' | 'question' | 'resolution' | 'closing' | 'escalation';
  isEdited?: boolean;
  originalText?: string;
}

export interface CallSummary {
  customerName: string;
  issue: string;
  resolution?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];
  duration: string;
  status: 'active' | 'resolved' | 'escalated';
}

export interface AgentMetrics {
  callsToday: number;
  avgCallTime: string;
  resolutionRate: number;
  customerSatisfaction: number;
}

export interface AudioDevice {
  id: string;
  name: string;
  type: 'bluetooth' | 'usb' | 'built-in';
  connected: boolean;
}

export interface FileAnalysis {
  id: string;
  fileName: string;
  fileType: 'audio' | 'excel' | 'document';
  uploadDate: Date;
  summary: string;
  insights: string[];
  transcription?: string;
  dataPoints?: any[];
}

export interface BluetoothConnection {
  device: BluetoothDevice | null;
  connected: boolean;
  audioStream: MediaStream | null;
}