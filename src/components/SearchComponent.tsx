import { useState, FormEvent } from 'react';
import { Folder, Section, SaveItem } from '../types';
import SaveItemComponent from './SaveItemComponent';

interface SearchComponentProps {
  folders: Folder[];
  onUpdateSaveItem: (
    folderId: string, sectionId: string, itemId: string, name: string,
    value: string, sensitive?: boolean
  ) => void;
  onDeleteSaveItem: (
    folderId: string, sectionId: string, itemId: string
  ) => void;
}

interface SearchResult {
  folder: Folder;
  section: Section;
  item: SaveItem;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  folders,
  onUpdateSaveItem,
  onDeleteSaveItem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const term = searchTerm.trim().toLowerCase();
    const results: SearchResult[] = [];

    // Search in folders, sections, and items
    folders.forEach(folder => {
      // Check if folder name matches
      const folderMatches = folder.name.toLowerCase().includes(term);

      folder.sections.forEach(section => {
        // Check if section name matches
        const sectionMatches = section.name.toLowerCase().includes(term);

        section.items.forEach(item => {
          // Check if item name or value matches
          const itemNameMatches = item.name.toLowerCase().includes(term);
          const itemValueMatches = item.value.toLowerCase().includes(term);

          // If any of the conditions match, add to results
          if (folderMatches || sectionMatches || itemNameMatches || itemValueMatches) {
            results.push({
              folder,
              section,
              item
            });
          }
        });
      });
    });

    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          className="flex-1 border rounded-l p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search folders, sections, and items..."
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Search
        </button>
      </form>

      {hasSearched && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Search Results {searchResults.length > 0 ? `(${searchResults.length})` : ''}
          </h3>

          {searchResults.length === 0 ? (
            <p className="text-gray-500">No results found for "{searchTerm}"</p>
          ) : (
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
                  <div className="text-sm text-gray-500 mb-2">
                    {result.folder.name} &gt; {result.section.name}
                  </div>
                  <SaveItemComponent
                    item={result.item}
                    folderId={result.folder.id}
                    sectionId={result.section.id}
                    onUpdateSaveItem={onUpdateSaveItem}
                    onDeleteSaveItem={onDeleteSaveItem}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
