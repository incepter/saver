import {useState} from 'react';
import {Folder} from '../types';
import SectionItem from './SectionItem';

interface FolderItemProps {
  folder: Folder;
  activeSection: string | null;
  onAddSection: (folderId: string, name: string) => void;
  onAddSaveItem: (
    folderId: string, sectionId: string, name: string, value: string,
    sensitive?: boolean
  ) => void;
  onUpdateSection: (folderId: string, sectionId: string, name: string) => void;
  onUpdateSaveItem: (
    folderId: string, sectionId: string, itemId: string, name: string,
    value: string, sensitive?: boolean
  ) => void;
  onDeleteSaveItem: (
    folderId: string, sectionId: string, itemId: string) => void;
  onDeleteSection: (folderId: string, sectionId: string) => void;
  onSelectSection: (sectionId: string | null) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  activeSection,
  onAddSection,
  onAddSaveItem,
  onUpdateSection,
  onUpdateSaveItem,
  onDeleteSaveItem,
  onDeleteSection,
  onSelectSection
}) => {
  const [newSectionName, setNewSectionName] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      onAddSection(folder.id, newSectionName.trim());
      setNewSectionName('');
      setIsAddingSection(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{folder.name}</h2>
        <button
          className="flex items-center text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 px-2 py-1 rounded"
          onClick={() => setIsAddingSection(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1"
               viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd"
                  d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                  clipRule="evenodd"/>
          </svg>
          Add Section
        </button>
      </div>

      {isAddingSection && (
        <form
          className="mb-4 flex"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSection();
          }}
        >
          <input
            type="text"
            className="flex-1 border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Section name"
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
              setIsAddingSection(false);
              setNewSectionName('');
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {folder.sections.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No sections in this folder yet</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setIsAddingSection(true)}
          >
            Create Section
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tabs for sections */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-2 overflow-x-auto">
              {folder.sections.map((section) => (
                <div
                  key={section.id}
                  className="relative group"
                >
                  <button
                    className={`py-2 px-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeSection === section.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => onSelectSection(section.id)}
                  >
                    {section.name}
                  </button>
                </div>
              ))}
            </nav>
          </div>

          {/* Active section content */}
          {activeSection && folder.sections.find(s => s.id === activeSection) && (
            <SectionItem
              section={folder.sections.find(s => s.id === activeSection)!}
              folderId={folder.id}
              onAddSaveItem={onAddSaveItem}
              onUpdateSection={onUpdateSection}
              onUpdateSaveItem={onUpdateSaveItem}
              onDeleteSaveItem={onDeleteSaveItem}
              onDeleteSection={onDeleteSection}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
