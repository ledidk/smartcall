import { CallMessage, SuggestedResponse, CallSummary, AgentMetrics } from '../types';

export const mockMessages: CallMessage[] = [
  {
    id: '1',
    speaker: 'customer',
    message: "Hi, I'm having trouble with my internet connection. It's been really slow for the past few days.",
    timestamp: new Date(Date.now() - 300000),
    confidence: 0.95
  },
  {
    id: '2',
    speaker: 'agent',
    message: "Hello! I'm sorry to hear about the internet issues. I'd be happy to help you resolve this. Can you tell me your account number?",
    timestamp: new Date(Date.now() - 280000),
    confidence: 0.98
  },
  {
    id: '3',
    speaker: 'customer',
    message: "Sure, it's AC12345678. The connection drops every few minutes and streaming is impossible.",
    timestamp: new Date(Date.now() - 240000),
    confidence: 0.92
  }
];

export const mockSuggestions: SuggestedResponse[] = [
  {
    id: '1',
    text: "I understand how frustrating intermittent connection issues can be. Let me run a quick diagnostic on your line to identify the problem.",
    confidence: 0.89,
    category: 'resolution'
  },
  {
    id: '2',
    text: "Thank you for providing your account number. I can see your service history here. Have you tried restarting your modem recently?",
    confidence: 0.85,
    category: 'question'
  },
  {
    id: '3',
    text: "I'll need to escalate this to our technical team for a more detailed analysis of your connection stability.",
    confidence: 0.72,
    category: 'escalation'
  }
];

export const mockSummary: CallSummary = {
  customerName: 'John Smith',
  issue: 'Internet connection dropping frequently, slow speeds affecting streaming',
  sentiment: 'neutral',
  tags: ['internet', 'connection', 'technical-support', 'streaming'],
  duration: '04:32',
  status: 'active'
};

export const mockMetrics: AgentMetrics = {
  callsToday: 23,
  avgCallTime: '6:45',
  resolutionRate: 87,
  customerSatisfaction: 4.2
};

export const customerMessages = [
  "Actually, I've tried restarting the modem multiple times. The issue persists.",
  "The speeds are supposed to be 100 Mbps but I'm getting around 15-20 Mbps consistently.",
  "This has been going on for about a week now. I work from home and really need reliable internet.",
  "Is this a known issue in my area? My neighbors seem to be having similar problems.",
  "I'm considering switching providers if this can't be resolved quickly."
];

export const suggestionResponses = [
  [
    {
      id: '4',
      text: "I appreciate your patience. Let me check for any service outages or maintenance in your area that might be affecting your connection.",
      confidence: 0.91,
      category: 'resolution' as const
    },
    {
      id: '5',
      text: "I understand the frustration with the slow speeds. Let me run a comprehensive line test to identify any signal issues.",
      confidence: 0.88,
      category: 'resolution' as const
    }
  ],
  [
    {
      id: '6',
      text: "Those speeds are definitely below what you're paying for. I can see some signal degradation on your line that we can address.",
      confidence: 0.93,
      category: 'resolution' as const
    },
    {
      id: '7',
      text: "I'll schedule a technician visit to check your equipment and line quality. This should resolve the speed issues.",
      confidence: 0.86,
      category: 'resolution' as const
    }
  ],
  [
    {
      id: '8',
      text: "I completely understand - reliable internet is essential for remote work. Let me prioritize your case and provide a solution today.",
      confidence: 0.94,
      category: 'resolution' as const
    },
    {
      id: '9',
      text: "Given your work requirements, I can offer our business-grade service at no extra cost while we resolve this issue.",
      confidence: 0.82,
      category: 'resolution' as const
    }
  ]
];