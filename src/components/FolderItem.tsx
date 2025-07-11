import {useState, useRef, useEffect} from 'react';
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
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdown when clicking outside
      if (openDropdownId !== null) {
        const dropdownElement = document.querySelector(`[data-dropdown-id="${openDropdownId}"]`);
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenDropdownId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      onAddSection(folder.id, newSectionName.trim());
      setNewSectionName('');
      setIsAddingSection(false);
    }
  };

  const toggleDropdown = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();

    // If we're opening the dropdown, calculate its position
    if (openDropdownId !== sectionId) {
      const button = e.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;

      // Calculate left position, ensuring the dropdown doesn't go off-screen
      let leftPos = rect.left + window.scrollX;

      // If dropdown would go off the right edge, align it to the right of the button instead
      if (leftPos + 192 > viewportWidth) { // 192px = 48rem (w-48)
        leftPos = rect.right + window.scrollX - 192;
      }

      // Position the dropdown below the button with a small offset
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 5, // 5px offset
        left: leftPos
      });
    }

    setOpenDropdownId(openDropdownId === sectionId ? null : sectionId);
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
                  <div className="flex items-center">
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
                    <div className="static">
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1 ml-1"
                        onClick={(e) => toggleDropdown(e, section.id)}
                        title="Section options"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {openDropdownId === section.id && (
                        <div
                          data-dropdown-id={section.id}
                          className="fixed w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl z-[9999] border border-gray-200 dark:border-gray-700"
                          style={{
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                            opacity: 1,
                            transition: 'opacity 150ms ease-in-out'
                          }}
                        >
                          <div className="py-1">
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(null);
                                const newName = prompt("Rename section:", section.name);
                                if (newName && newName.trim()) {
                                  onUpdateSection(folder.id, section.id, newName.trim());
                                }
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              Rename section
                            </button>
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(null);
                                if (window.confirm(`Are you sure you want to delete the section "${section.name}"?`)) {
                                  onDeleteSection(folder.id, section.id);
                                }
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete section
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
