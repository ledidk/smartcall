import { useState, useEffect, useCallback } from 'react';
import { CallMessage, SuggestedResponse, FileAnalysis } from '../types';
import { mockMessages, customerMessages, suggestionResponses } from '../utils/mockData';

export const useCallSimulation = () => {
  const [messages, setMessages] = useState<CallMessage[]>(mockMessages);
  const [currentSuggestions, setCurrentSuggestions] = useState<SuggestedResponse[]>([]);
  const [isCallActive, setIsCallActive] = useState(true);
  const [customerMessageIndex, setCustomerMessageIndex] = useState(0);
  const [fileAnalyses, setFileAnalyses] = useState<FileAnalysis[]>([]);

  const addCustomerMessage = useCallback(() => {
    if (customerMessageIndex < customerMessages.length) {
      const newMessage: CallMessage = {
        id: Date.now().toString(),
        speaker: 'customer',
        message: customerMessages[customerMessageIndex],
        timestamp: new Date(),
        confidence: Math.random() * 0.1 + 0.9 // 0.9 to 1.0
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Set suggestions for this customer message
      if (suggestionResponses[customerMessageIndex]) {
        setCurrentSuggestions(suggestionResponses[customerMessageIndex]);
      }
      
      setCustomerMessageIndex(prev => prev + 1);
    }
  }, [customerMessageIndex]);

  const addAgentResponse = useCallback((responseText: string, isEdited = false) => {
    const newMessage: CallMessage = {
      id: Date.now().toString(),
      speaker: 'agent',
      message: responseText,
      timestamp: new Date(),
      confidence: 0.98
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentSuggestions([]);

    // Simulate customer response after agent speaks
    setTimeout(() => {
      if (isCallActive && customerMessageIndex < customerMessages.length) {
        addCustomerMessage();
      }
    }, 3000 + Math.random() * 2000); // 3-5 seconds delay
  }, [addCustomerMessage, isCallActive, customerMessageIndex]);

  const addTranscription = useCallback((text: string, speaker: 'agent' | 'customer', confidence: number) => {
    const newMessage: CallMessage = {
      id: Date.now().toString(),
      speaker,
      message: text,
      timestamp: new Date(),
      confidence
    };

    setMessages(prev => [...prev, newMessage]);

    // Generate suggestions for customer messages
    if (speaker === 'customer') {
      // Simulate AI generating suggestions based on customer input
      setTimeout(() => {
        const suggestions: SuggestedResponse[] = [
          {
            id: Date.now().toString(),
            text: `Thank you for that information. Let me help you with that right away.`,
            confidence: 0.92,
            category: 'resolution'
          },
          {
            id: (Date.now() + 1).toString(),
            text: `I understand your concern. Can you provide me with more details about this issue?`,
            confidence: 0.88,
            category: 'question'
          }
        ];
        setCurrentSuggestions(suggestions);
      }, 1000);
    }
  }, []);

  const editSuggestion = useCallback((id: string, newText: string) => {
    setCurrentSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === id 
          ? { ...suggestion, text: newText, isEdited: true, originalText: suggestion.text }
          : suggestion
      )
    );
  }, []);

  const toggleCall = useCallback(() => {
    setIsCallActive(prev => !prev);
  }, []);

  const addFileAnalysis = useCallback((analysis: FileAnalysis) => {
    setFileAnalyses(prev => [analysis, ...prev]);
  }, []);

  // Start the simulation with periodic customer messages
  useEffect(() => {
    if (!isCallActive) return;

    const interval = setInterval(() => {
      if (currentSuggestions.length === 0 && Math.random() > 0.7) {
        addCustomerMessage();
      }
    }, 8000 + Math.random() * 7000); // 8-15 seconds

    return () => clearInterval(interval);
  }, [addCustomerMessage, currentSuggestions.length, isCallActive]);

  return {
    messages,
    currentSuggestions,
    isCallActive,
    fileAnalyses,
    addAgentResponse,
    addTranscription,
    editSuggestion,
    toggleCall,
    addFileAnalysis
  };
};