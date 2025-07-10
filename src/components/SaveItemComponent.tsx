import { useState, useRef } from 'react';
import { SaveItem } from '../types';

interface SaveItemComponentProps {
  item: SaveItem;
  folderId: string;
  sectionId: string;
  onUpdateSaveItem: (folderId: string, sectionId: string, itemId: string, name: string, value: string) => void;
  onDeleteSaveItem: (folderId: string, sectionId: string, itemId: string) => void;
}

const SaveItemComponent: React.FC<SaveItemComponentProps> = ({
  item,
  folderId,
  sectionId,
  onUpdateSaveItem,
  onDeleteSaveItem
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editValue, setEditValue] = useState(item.value);
  const [copySuccess, setCopySuccess] = useState(false);
  const valueRef = useRef<HTMLDivElement>(null);

  const handleEdit = () => {
    if (editName.trim() && editValue.trim()) {
      onUpdateSaveItem(folderId, sectionId, item.id, editName.trim(), editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(item.value)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        // Fallback method
        const textArea = document.createElement('textarea');
        textArea.value = item.value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
  };

  return (
    <div className="border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            className="w-full border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Item name"
            autoFocus
          />
          <textarea
            className="w-full border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Item value"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
              onClick={handleEdit}
            >
              Save
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-1 rounded text-sm"
              onClick={() => {
                setIsEditing(false);
                setEditName(item.name);
                setEditValue(item.value);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <div className="mt-1 relative">
                {isVisible ? (
                  <div
                    ref={valueRef}
                    className="text-sm break-all bg-gray-50 dark:bg-gray-700 p-2 rounded"
                  >
                    {item.value}
                  </div>
                ) : (
                  <div className="text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    ••••••••••••••••
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-1">
              <button
                className={`p-1 rounded ${isVisible ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                onClick={() => setIsVisible(!isVisible)}
                title={isVisible ? "Hide value" : "Show value"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded"
                onClick={() => setIsEditing(true)}
                title="Edit item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                className={`p-1 rounded ${copySuccess ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {copySuccess ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                )}
              </button>
              <button
                className="p-1 text-red-500 hover:text-red-600 rounded"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                    onDeleteSaveItem(folderId, sectionId, item.id);
                  }
                }}
                title="Delete item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SaveItemComponent;
