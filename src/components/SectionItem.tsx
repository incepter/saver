import { useState } from 'react';
import { Section } from '../types';
import SaveItemComponent from './SaveItemComponent';

interface SectionItemProps {
  section: Section;
  folderId: string;
  onAddSaveItem: (folderId: string, sectionId: string, name: string, value: string) => void;
  onUpdateSaveItem: (folderId: string, sectionId: string, itemId: string, name: string, value: string) => void;
  onDeleteSaveItem: (folderId: string, sectionId: string, itemId: string) => void;
  onDeleteSection: (folderId: string, sectionId: string) => void;
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  folderId,
  onAddSaveItem,
  onUpdateSaveItem,
  onDeleteSaveItem,
  onDeleteSection
}) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemValue, setNewItemValue] = useState('');

  const handleAddItem = () => {
    if (newItemName.trim() && newItemValue.trim()) {
      onAddSaveItem(folderId, section.id, newItemName.trim(), newItemValue.trim());
      setNewItemName('');
      setNewItemValue('');
      setIsAddingItem(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{section.name}</h3>
        <div className="flex space-x-2">
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={() => setIsAddingItem(true)}
            title="Add new item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            className="text-red-500 hover:text-red-600"
            onClick={() => {
              if (confirm(`Are you sure you want to delete the section "${section.name}"?`)) {
                onDeleteSection(folderId, section.id);
              }
            }}
            title="Delete section"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
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
            <div className="flex justify-end space-x-2">
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
