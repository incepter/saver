import {useRef, useState} from 'react';
import {SaveItem, Section} from '../types';
import SaveItemComponent from './SaveItemComponent';

interface SectionItemProps {
  section: Section;
  folderId: string;
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
  onReorderItems?: (
    folderId: string, sectionId: string, items: SaveItem[]) => void;
  onMoveItemToSection?: (
    sourceFolderId: string, sourceSectionId: string, itemId: string,
    targetFolderId: string, targetSectionId: string
  ) => void;
  allSections?: Section[];
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  folderId,
  onAddSaveItem,
  onUpdateSaveItem,
  onDeleteSaveItem,
  onReorderItems,
  onMoveItemToSection,
}) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemValue, setNewItemValue] = useState('');
  const [newItemSensitive, setNewItemSensitive] = useState(true); // Default to sensitive

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const dragCounter = useRef<number>(0);

  const handleAddItem = () => {
    if (newItemName.trim() && newItemValue.trim()) {
      onAddSaveItem(folderId, section.id, newItemName.trim(), newItemValue.trim(), newItemSensitive);
      setNewItemName('');
      setNewItemValue('');
      setNewItemSensitive(true); // Reset to default
      setIsAddingItem(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    // Set the data being dragged - this is essential for the drag operation to work
    e.dataTransfer.setData('text/plain', itemId);

    // Dispatch a custom event to notify parent components about the dragged item
    const customEvent = new CustomEvent('item-drag-start', {
      bubbles: true,
      detail: {itemId}
    });
    document.dispatchEvent(customEvent);

    // Add some transparency to the dragged element
    if (e.currentTarget) {
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.style.opacity = '0.4';
          e.currentTarget.classList.add('grabbing');
        }
      }, 0);
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedItem(null);
    setDragOverItem(null);
    // Reset opacity and remove grabbing class
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.classList.remove('grabbing');
    }
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Set the drop effect to move
    e.dataTransfer.dropEffect = 'move';
    if (draggedItem === itemId) return;
    setDragOverItem(itemId);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverItem(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>, targetItemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;

    // Get the dragged item ID from dataTransfer
    const droppedItemId = e.dataTransfer.getData('text/plain');

    if (!droppedItemId || droppedItemId === targetItemId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Find the indices of the dragged and target items
    const draggedIndex = section.items.findIndex(item => item.id === droppedItemId);
    const targetIndex = section.items.findIndex(item => item.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create a new array with the reordered items
    const newItems = [...section.items];
    const [draggedItemObj] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItemObj);

    // Call the handler to update the items
    if (onReorderItems) {
      onReorderItems(folderId, section.id, newItems);
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div id={`section-${section.id}`} data-section-id={section.id}>
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 px-2 py-1 rounded"
          onClick={() => setIsAddingItem(true)}
          title="Add new item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1"
               viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd"
                  d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                  clipRule="evenodd"/>
          </svg>
          Add Item
        </button>
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
              <label htmlFor="new-item-sensitive" className="text-sm">Sensitive
                (hide by default)</label>
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
          {/* Sort items by index before rendering */}
          {[...section.items]
            .sort((
              a,
              b
            ) => ((a.index !== undefined ? a.index : 0) - (b.index !== undefined ? b.index : 0)))
            .map((item) => (
              <div
                key={item.id}
                className={`${dragOverItem === item.id ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border border-transparent'} ${draggedItem === item.id ? 'cursor-grabbing opacity-50' : 'cursor-grab'} hover:border-gray-300 dark:hover:border-gray-700 rounded-lg transition-all duration-200`}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragEnter={handleDragEnter}
                onDragLeave={(e) => handleDragLeave(e)}
                onDrop={(e) => handleDrop(e, item.id)}
              >
                <SaveItemComponent
                  key={item.id}
                  item={item}
                  folderId={folderId}
                  sectionId={section.id}
                  onUpdateSaveItem={onUpdateSaveItem}
                  onDeleteSaveItem={onDeleteSaveItem}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SectionItem;
