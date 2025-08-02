'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import FileDownload from '@/components/FileDownload';
import InviteCode from '@/components/InviteCode';
import axios from 'axios';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [port, setPort] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPort(response.data.port);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (port: number) => {
    setIsDownloading(true);

    try {
      // Request download from Java backend
      const response = await axios.get(`/api/download/${port}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Try to get filename from response headers
      // Axios normalizes headers to lowercase, but we need to handle different cases
      const headers = response.headers;
      let contentDisposition = '';

      // Look for content-disposition header regardless of case
      for (const key in headers) {
        if (key.toLowerCase() === 'content-disposition') {
          contentDisposition = headers[key];
          break;
        }
      }

      let filename = 'downloaded-file';

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please check the invite code and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8 transition-all duration-300">

          <header className="text-center mb-10">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow">
              FileShare
            </h1>
            <p className="text-lg text-gray-600 mt-2">Secure P2P File Sharing</p>
          </header>

          <div className="bg-white/50 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex border-b border-gray-300 mb-6 justify-center gap-4">
              <button
                  className={`px-4 py-2 font-semibold rounded-t-lg transition-colors duration-200 ${
                      activeTab === 'upload'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-blue-500'
                  }`}
                  onClick={() => setActiveTab('upload')}
              >
                Share a File
              </button>
              <button
                  className={`px-4 py-2 font-semibold rounded-t-lg transition-colors duration-200 ${
                      activeTab === 'download'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-blue-500'
                  }`}
                  onClick={() => setActiveTab('download')}
              >
                Receive a File
              </button>
            </div>

            {activeTab === 'upload' ? (
                <div>
                  <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />

                  {uploadedFile && !isUploading && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm text-gray-700">
                        Selected file:{' '}
                        <span className="font-semibold">{uploadedFile.name}</span> (
                        {Math.round(uploadedFile.size / 1024)} KB)
                      </div>
                  )}

                  {isUploading && (
                      <div className="mt-6 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="mt-2 text-gray-600">Uploading file...</p>
                      </div>
                  )}

                  <InviteCode port={port} />
                </div>
            ) : (
                <div>
                  <FileDownload onDownload={handleDownload} isDownloading={isDownloading} />

                  {isDownloading && (
                      <div className="mt-6 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="mt-2 text-gray-600">Downloading file...</p>
                      </div>
                  )}
                </div>
            )}
          </div>

          <footer className="mt-10 text-center text-gray-500 text-sm">
            <p>
              FileShare &copy; {new Date().getFullYear()} – Secure P2P File Sharing by{' '}
              <a
                  href="https://www.prakashrabidas.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
              >
                Prakash
              </a>
            </p>
          </footer>
        </div>
      </div>
  );
}
