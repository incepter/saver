import { useState } from 'react';
import { Folder } from '../types';
import FolderItem from './FolderItem';

interface FolderListProps {
  folders: Folder[];
  activeFolder: string | null;
  activeSection: string | null;
  onAddFolder: (name: string) => void;
  onAddSection: (folderId: string, name: string) => void;
  onAddSaveItem: (folderId: string, sectionId: string, name: string, value: string) => void;
  onUpdateSaveItem: (folderId: string, sectionId: string, itemId: string, name: string, value: string) => void;
  onDeleteSaveItem: (folderId: string, sectionId: string, itemId: string) => void;
  onDeleteSection: (folderId: string, sectionId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onSelectFolder: (folderId: string | null) => void;
  onSelectSection: (sectionId: string | null) => void;
}

const FolderList: React.FC<FolderListProps> = ({
  folders,
  activeFolder,
  activeSection,
  onAddFolder,
  onAddSection,
  onAddSaveItem,
  onUpdateSaveItem,
  onDeleteSaveItem,
  onDeleteSection,
  onDeleteFolder,
  onSelectFolder,
  onSelectSection
}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim());
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Folder sidebar */}
      <div className="w-full md:w-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 md:mb-0 md:mr-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Folders</h2>
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={() => setIsAddingFolder(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {isAddingFolder && (
          <form
            className="mb-4 flex"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddFolder();
            }}
          >
            <input
              type="text"
              className="flex-1 border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              autoFocus
            />
            <button
              type="submit"
              className="ml-2 bg-green-500 hover:bg-green-600 text-white px-2 rounded"
            >
              Add
            </button>
            <button
              type="button"
              className="ml-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-2 rounded"
              onClick={() => {
                setIsAddingFolder(false);
                setNewFolderName('');
              }}
            >
              Cancel
            </button>
          </form>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {folders.length === 0 ? (
            <p className="text-gray-500 text-sm">No folders yet. Create one to get started!</p>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                className={`p-2 rounded cursor-pointer group ${
                  activeFolder === folder.id
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => onSelectFolder(folder.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{folder.name}</span>
                  <button
                    className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete the folder "${folder.name}"?`)) {
                        onDeleteFolder(folder.id);
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        {activeFolder ? (
          <FolderItem
            folder={folders.find(f => f.id === activeFolder)!}
            activeSection={activeSection}
            onAddSection={onAddSection}
            onAddSaveItem={onAddSaveItem}
            onUpdateSaveItem={onUpdateSaveItem}
            onDeleteSaveItem={onDeleteSaveItem}
            onDeleteSection={onDeleteSection}
            onSelectSection={onSelectSection}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 mb-4">Select a folder or create a new one to get started</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setIsAddingFolder(true)}
            >
              Create Folder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderList;
