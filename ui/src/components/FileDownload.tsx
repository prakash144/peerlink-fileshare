'use client';

import { useState, useCallback } from 'react';
import { FiDownload } from 'react-icons/fi';

interface FileDownloadProps {
  onDownload: (port: number) => Promise<void>;
  isDownloading: boolean;
}

const isValidPort = (port: number) => port > 0 && port <= 65535;

export default function FileDownload({ onDownload, isDownloading }: FileDownloadProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const port = parseInt(inviteCode.trim(), 10);
    if (isNaN(port) || !isValidPort(port)) {
      setError('Please enter a valid port number (1-65535)');
      return;
    }

    try {
      await onDownload(port);
    } catch {
      setError('Failed to download the file. Please check the invite code and try again.');
    }
  }, [inviteCode, onDownload]);

  return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Receive a File</h3>
          <p className="text-sm text-blue-600">Enter the invite code shared with you to download the file.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
              Invite Code
            </label>
            <input
                type="text"
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter the invite code (port number)"
                className="input-field"
                disabled={isDownloading}
                required
                autoFocus
            />
            {error && (
                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="assertive">
                  {error}
                </p>
            )}
          </div>

          <button
              type="submit"
              className="btn-primary flex items-center justify-center w-full"
              disabled={isDownloading}
          >
            {isDownloading ? (
                <span className="flex items-center">
              <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
              >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Downloading...
            </span>
            ) : (
                <>
                  <FiDownload className="mr-2" />
                  <span>Download File</span>
                </>
            )}
          </button>
        </form>
      </div>
  );
}
