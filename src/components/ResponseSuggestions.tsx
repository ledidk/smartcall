import React, { useState } from 'react';
import { Send, Edit3, Brain, TrendingUp } from 'lucide-react';
import { SuggestedResponse } from '../types';

interface ResponseSuggestionsProps {
  suggestions: SuggestedResponse[];
  onSendResponse: (text: string, isEdited: boolean) => void;
  onEditSuggestion: (id: string, newText: string) => void;
}

export const ResponseSuggestions: React.FC<ResponseSuggestionsProps> = ({
  suggestions,
  onSendResponse,
  onEditSuggestion
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (suggestion: SuggestedResponse) => {
    setEditingId(suggestion.id);
    setEditText(suggestion.text);
  };

  const handleSaveEdit = (id: string) => {
    onEditSuggestion(id, editText);
    setEditingId(null);
    setEditText('');
  };

  const handleSend = (suggestion: SuggestedResponse) => {
    onSendResponse(suggestion.text, suggestion.isEdited || false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      greeting: 'bg-blue-100 text-blue-800',
      question: 'bg-purple-100 text-purple-800',
      resolution: 'bg-green-100 text-green-800',
      escalation: 'bg-red-100 text-red-800',
      closing: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">AI Suggestions</h2>
        <div className="ml-auto flex items-center space-x-1 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Smart Responses</span>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Listening for customer input...</p>
            <p className="text-xs mt-1">AI suggestions will appear here</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(suggestion.category)}`}>
                    {suggestion.category}
                  </span>
                  <span className={`text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </span>
                </div>
                {suggestion.isEdited && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Edited
                  </span>
                )}
              </div>

              {editingId === suggestion.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveEdit(suggestion.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-800 mb-3 leading-relaxed">
                    {suggestion.text}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSend(suggestion)}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex-1 justify-center"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Response</span>
                    </button>
                    <button
                      onClick={() => handleEdit(suggestion)}
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};