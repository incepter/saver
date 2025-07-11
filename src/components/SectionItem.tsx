import {useState} from 'react';
import {Section} from '../types';
import SaveItemComponent from './SaveItemComponent';

interface SectionItemProps {
  section: Section;
  folderId: string;
  onAddSaveItem: (folderId: string, sectionId: string, name: string, value: string, sensitive?: boolean) => void;
  onUpdateSection: (folderId: string, sectionId: string, name: string) => void;
  onUpdateSaveItem: (folderId: string, sectionId: string, itemId: string, name: string, value: string, sensitive?: boolean) => void;
  onDeleteSaveItem: (folderId: string, sectionId: string, itemId: string) => void;
  onDeleteSection: (folderId: string, sectionId: string) => void;
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  folderId,
  onAddSaveItem,
  onUpdateSection,
  onUpdateSaveItem,
  onDeleteSaveItem,
}) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemValue, setNewItemValue] = useState('');
  const [newItemSensitive, setNewItemSensitive] = useState(true); // Default to sensitive
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [editSectionName, setEditSectionName] = useState(section.name);

  const handleAddItem = () => {
    if (newItemName.trim() && newItemValue.trim()) {
      onAddSaveItem(folderId, section.id, newItemName.trim(), newItemValue.trim(), newItemSensitive);
      setNewItemName('');
      setNewItemValue('');
      setNewItemSensitive(true); // Reset to default
      setIsAddingItem(false);
    }
  };

  const handleRenameSection = () => {
    if (editSectionName.trim()) {
      onUpdateSection(folderId, section.id, editSectionName.trim());
      setIsEditingSection(false);
    }
  };

  return (
    <div id={`section-${section.id}`}>
      <div className="flex justify-between items-center mb-4">
        {isEditingSection ? (
          <form
            className="flex flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              handleRenameSection();
            }}
          >
            <input
              type="text"
              className="flex-1 border rounded p-1 text-sm dark:bg-gray-700 dark:border-gray-600"
              value={editSectionName}
              onChange={(e) => setEditSectionName(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="ml-1 bg-green-500 hover:bg-green-600 text-white px-2 rounded text-sm"
            >
              Save
            </button>
            <button
              type="button"
              className="ml-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-2 rounded text-sm"
              onClick={() => {
                setIsEditingSection(false);
                setEditSectionName(section.name);
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            className="flex items-center text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 px-2 py-1 rounded"
            onClick={() => setIsAddingItem(true)}
            title="Add new item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Add Item
          </button>
        )}
      </div>

      {isAddingItem && (
        <div className="mb-4 p-4 border rounded dark:border-gray-700">
          <h4 className="text-sm font-medium mb-2">Add New Item</h4>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddItem();
            }}
          >
            <input
              type="text"
              className="w-full border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name"
              autoFocus
            />
            <textarea
              className="w-full border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
              placeholder="Item value"
              rows={3}
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="new-item-sensitive"
                checked={newItemSensitive}
                onChange={(e) => setNewItemSensitive(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="new-item-sensitive" className="text-sm">Sensitive (hide by default)</label>
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Add
              </button>
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-1 rounded text-sm"
                onClick={() => {
                  setIsAddingItem(false);
                  setNewItemName('');
                  setNewItemValue('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {section.items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No items in this section yet</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setIsAddingItem(true)}
          >
            Add Item
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {section.items.map((item) => (
            <SaveItemComponent
              key={item.id}
              item={item}
              folderId={folderId}
              sectionId={section.id}
              onUpdateSaveItem={onUpdateSaveItem}
              onDeleteSaveItem={onDeleteSaveItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionItem;
