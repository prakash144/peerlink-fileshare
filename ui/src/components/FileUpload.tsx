'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export default function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  return (
      <div className="relative w-full">
        {/* Animated silk effect */}
        <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden animate-backgroundWave bg-gradient-to-tr from-[#e0f7fa] via-[#fce4ec] to-[#e8f5e9] opacity-50 blur-3xl" />

        {/* Upload Box */}
        <div
            {...getRootProps()}
            className={`
          relative z-10 backdrop-blur-xl bg-white/30 border-2 border-dashed rounded-2xl 
          px-8 py-12 text-center cursor-pointer transition-all duration-300
          shadow-xl ring-1 ring-inset ring-white/10
          ${
                dragActive
                    ? 'border-blue-500 bg-white/40 scale-[1.02]'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-white/40'
            }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-white/30 rounded-full shadow-lg backdrop-blur-sm">
              <FiUpload className="w-7 h-7 text-blue-500" />
            </div>
            <p className="text-lg font-semibold text-gray-800">
              Drag & drop a file here, or click to select
            </p>
            <p className="text-sm text-gray-600">
              Share any file securely with your peers
            </p>
          </div>
        </div>
      </div>
  );
}