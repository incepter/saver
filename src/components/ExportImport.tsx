import { useState } from 'react';
import { Folder } from '../types';

interface ExportImportProps {
  data: Folder[];
  onImport: (data: Folder[]) => void;
}

const ExportImport: React.FC<ExportImportProps> = ({ data, onImport }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importValue, setImportValue] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    const jsonData = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonData)
      .then(() => {
        alert('Data exported to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy data to clipboard', err);
        // Fallback method
        const textArea = document.createElement('textarea');
        textArea.value = jsonData;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Data exported to clipboard!');
      });
  };

  const handleImport = () => {
    try {
      const parsedData = JSON.parse(importValue);

      // Validate the data structure
      if (!Array.isArray(parsedData)) {
        throw new Error('Imported data must be an array');
      }

      // Check if the data has the correct structure
      parsedData.forEach((folder, i) => {
        if (!folder.id || !folder.name || !Array.isArray(folder.sections)) {
          throw new Error(`Folder at index ${i} has invalid structure`);
        }

        folder.sections.forEach((section, j) => {
          if (!section.id || !section.name || !Array.isArray(section.items)) {
            throw new Error(`Section at index ${j} in folder "${folder.name}" has invalid structure`);
          }

          section.items.forEach((item, k) => {
            if (!item.id || !item.name || typeof item.value !== 'string') {
              throw new Error(`Item at index ${k} in section "${section.name}" has invalid structure`);
            }
          });
        });
      });

      onImport(parsedData);
      setIsImporting(false);
      setImportValue('');
      setImportError(null);
      alert('Data imported successfully!');
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Invalid JSON data');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isImporting ? (
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <textarea
              className="border rounded p-2 text-sm w-64 h-32 dark:bg-gray-700 dark:border-gray-600"
              value={importValue}
              onChange={(e) => setImportValue(e.target.value)}
              placeholder="Paste JSON data here..."
            />
            <div className="flex flex-col space-y-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                onClick={handleImport}
              >
                Import
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-1 rounded text-sm"
                onClick={() => {
                  setIsImporting(false);
                  setImportValue('');
                  setImportError(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          {importError && (
            <div className="text-red-500 text-sm">{importError}</div>
          )}
        </div>
      ) : (
        <>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            onClick={handleExport}
          >
            Export
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => setIsImporting(true)}
          >
            Import
          </button>
        </>
      )}
    </div>
  );
};

export default ExportImport;
