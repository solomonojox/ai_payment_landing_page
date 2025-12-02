import React, { useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PDFViewerProps {
  fileUrl: string;
  onClose?: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, onClose }) => {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => defaultTabs,
  });

  const workerUrl = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      {/* Modal card */}
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="text-lg font-semibold">PDF Viewer</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-2xl font-bold hover:text-gray-600"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>

        {/* Viewer body – NOTE the changes */}
        <div className="relative flex-1">
          {/* Scrollable wrapper */}
          <div className="h-full overflow-auto">
            <Worker workerUrl={workerUrl}>
              <Viewer
                fileUrl={fileUrl}
                plugins={[defaultLayoutPluginInstance]}
                onDocumentLoad={() => {
                  setIsLoading(false);
                  setLoadError(null);
                }}
              />
            </Worker>
          </div>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="rounded bg-white p-4 shadow">
                <p className="animate-pulse text-gray-700">Loading PDF…</p>
              </div>
            </div>
          )}
        </div>

        {/* Error UI */}
        {loadError && (
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="text-center">
              <p className="text-lg font-medium text-red-600">Failed to load PDF</p>
              <p className="mt-2 text-sm text-gray-600">{loadError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Footer hint */}
        <div className="border-t p-3 text-center text-xs text-gray-500">
          Use the toolbar (top-left) for zoom, search, download, etc.
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;