import { useState, useRef } from 'react';
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
  onReorderFolders?: (folders: Folder[]) => void;
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
  onSelectSection,
  onReorderFolders
}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [draggedFolder, setDraggedFolder] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const dragCounter = useRef<number>(0);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim());
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, folderId: string) => {
    setDraggedFolder(folderId);
    e.dataTransfer.effectAllowed = 'move';
    // Add some transparency to the dragged element
    if (e.currentTarget) {
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.style.opacity = '0.4';
        }
      }, 0);
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedFolder(null);
    setDragOverFolder(null);
    // Reset opacity
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, folderId: string) => {
    e.preventDefault();
    if (draggedFolder === folderId) return;
    setDragOverFolder(folderId);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current++;
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverFolder(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetFolderId: string) => {
    e.preventDefault();
    dragCounter.current = 0;

    if (!draggedFolder || draggedFolder === targetFolderId) {
      setDraggedFolder(null);
      setDragOverFolder(null);
      return;
    }

    // Find the indices of the dragged and target folders
    const draggedIndex = folders.findIndex(f => f.id === draggedFolder);
    const targetIndex = folders.findIndex(f => f.id === targetFolderId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create a new array with the reordered folders
    const newFolders = [...folders];
    const [draggedFolderItem] = newFolders.splice(draggedIndex, 1);
    newFolders.splice(targetIndex, 0, draggedFolderItem);

    // Update the index property of each folder
    const updatedFolders = newFolders.map((folder, index) => ({
      ...folder,
      index
    }));

    // Update the folders state
    if (onReorderFolders) {
      // Ensure the updated folders are persisted
      onReorderFolders(updatedFolders);
    }

    setDraggedFolder(null);
    setDragOverFolder(null);
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
            [...folders].sort((a, b) => ((a.index !== undefined ? a.index : 0) - (b.index !== undefined ? b.index : 0))).map((folder) => (
              <div
                key={folder.id}
                className={`p-2 rounded cursor-pointer group ${
                  activeFolder === folder.id
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${dragOverFolder === folder.id ? 'border-2 border-blue-500' : ''}`}
                onClick={() => {
                  onSelectFolder(folder.id);
                  // Auto-select the first section if available
                  const selectedFolder = folders.find(f => f.id === folder.id);
                  if (selectedFolder && selectedFolder.sections.length > 0) {
                    onSelectSection(selectedFolder.sections[0].id);
                  }
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, folder.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, folder.id)}
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
