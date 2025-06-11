import React, { useState } from 'react';
import { Upload, FileText, FileSpreadsheet, Music, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { FileAnalysisService } from '../services/fileAnalysisService';
import { FileAnalysis } from '../types';

interface FileUploadProps {
  onAnalysisComplete: (analysis: FileAnalysis) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete }) => {
  const [fileService] = useState(() => new FileAnalysisService());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')) {
      return <Music className="w-8 h-8 text-purple-600" />;
    } else if (['xlsx', 'xls', 'csv'].includes(extension || '')) {
      return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    } else {
      return <FileText className="w-8 h-8 text-blue-600" />;
    }
  };

  const getFileType = (fileName: string): 'audio' | 'excel' | 'document' => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')) {
      return 'audio';
    } else if (['xlsx', 'xls', 'csv'].includes(extension || '')) {
      return 'excel';
    } else {
      return 'document';
    }
  };

  const handleFile = async (file: File) => {
    setIsAnalyzing(true);
    setUploadStatus('idle');

    try {
      const analysis = await fileService.analyzeFile(file);
      
      const fileAnalysis: FileAnalysis = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType: getFileType(file.name),
        uploadDate: new Date(),
        summary: analysis.summary,
        insights: analysis.insights,
        transcription: analysis.transcription,
        dataPoints: analysis.dataPoints
      };

      onAnalysisComplete(fileAnalysis);
      setUploadStatus('success');
    } catch (error) {
      console.error('File analysis failed:', error);
      setUploadStatus('error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">File Analysis</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
      >
        {isAnalyzing ? (
          <div className="space-y-4">
            <Loader className="w-12 h-12 mx-auto text-blue-600 animate-spin" />
            <div>
              <p className="text-lg font-medium text-gray-900">Analyzing File...</p>
              <p className="text-sm text-gray-600">This may take a few moments</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900">Upload File for Analysis</p>
              <p className="text-sm text-gray-600">
                Drag and drop or click to select
              </p>
            </div>
            
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Music className="w-4 h-4" />
                <span>Audio (MP3, WAV)</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel (XLSX, CSV)</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Documents (TXT, PDF)</span>
              </div>
            </div>
            
            <input
              type="file"
              onChange={handleFileInput}
              accept=".mp3,.wav,.ogg,.m4a,.xlsx,.xls,.csv,.txt,.doc,.docx,.pdf"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Choose File
            </label>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {uploadStatus === 'success' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-800">File analyzed successfully!</span>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-800">Failed to analyze file. Please try again.</span>
        </div>
      )}
    </div>
  );
};