import React from 'react';
import { FileText, TrendingUp, BarChart3, Clock, FileSpreadsheet, Music } from 'lucide-react';
import { FileAnalysis } from '../types';

interface FileAnalysisResultsProps {
  analyses: FileAnalysis[];
}

export const FileAnalysisResults: React.FC<FileAnalysisResultsProps> = ({ analyses }) => {
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'audio':
        return <Music className="w-5 h-5 text-purple-600" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (analyses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
        <div className="text-center text-gray-500 py-8">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No files analyzed yet</p>
          <p className="text-xs mt-1">Upload files to see analysis results</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
        <span className="ml-auto text-sm text-gray-500">{analyses.length} files</span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              {getFileIcon(analysis.fileType)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {analysis.fileName}
                  </h4>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(analysis.uploadDate)}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-3">
                  <h5 className="text-xs font-medium text-gray-700 mb-1">Summary</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>

                {/* Insights */}
                <div className="mb-3">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Key Insights</h5>
                  <div className="space-y-1">
                    {analysis.insights.map((insight, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <TrendingUp className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transcription for audio files */}
                {analysis.transcription && (
                  <div className="mb-3">
                    <h5 className="text-xs font-medium text-gray-700 mb-1">Transcription</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 max-h-24 overflow-y-auto">
                      {analysis.transcription}
                    </div>
                  </div>
                )}

                {/* Data points for Excel files */}
                {analysis.dataPoints && analysis.dataPoints.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-1">Data Preview</h5>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(analysis.dataPoints[0] || {}).slice(0, 4).map((key) => (
                          <div key={key} className="text-gray-600">
                            <span className="font-medium">{key}:</span> {analysis.dataPoints![0][key]}
                          </div>
                        ))}
                      </div>
                      {analysis.dataPoints.length > 1 && (
                        <p className="text-gray-500 mt-1">
                          +{analysis.dataPoints.length - 1} more records
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};