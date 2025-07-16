import { useState, useEffect } from 'react'
import FolderList from './components/FolderList'
import ExportImport from './components/ExportImport'
import SearchComponent from './components/SearchComponent'
import { Folder, Section, SaveItem } from './types'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const [folders, setFolders] = useLocalStorage<Folder[]>('saver-folders', [])
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Set first folder as active if there is one and none is selected
  useEffect(() => {
    if (folders.length > 0 && !activeFolder) {
      setActiveFolder(folders[0].id)

      if (folders[0].sections.length > 0) {
        setActiveSection(folders[0].sections[0].id)
      }
    }
  }, [folders, activeFolder])

  const handleAddFolder = (name: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      sections: [],
      index: folders.length // Set the index to place the new folder at the end
    }
    const existingFolder = folders.find((folder) => folder.name === name);
    if (!existingFolder) {
      setFolders([...folders, newFolder]);
    }
    setActiveFolder(existingFolder ? existingFolder.id : newFolder.id);
  }

  const handleAddSection = (folderId: string, name: string) => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      name,
      items: []
    }

    setFolders(folders.map(folder =>
      folder.id === folderId
        ? { ...folder, sections: [...folder.sections, newSection] }
        : folder
    ))
    setActiveSection(newSection.id)
  }

  const handleAddSaveItem = (folderId: string, sectionId: string, name: string, value: string, sensitive: boolean = true) => {
    const folder = folders.find(f => f.id === folderId);
    const section = folder?.sections.find(s => s.id === sectionId);
    const itemCount = section?.items.length || 0;

    const newItem: SaveItem = {
      id: crypto.randomUUID(),
      name,
      value,
      sensitive,
      index: itemCount // Set the index to place the new item at the end
    }

    setFolders(folders.map(folder =>
      folder.id === folderId
        ? {
            ...folder,
            sections: folder.sections.map(section =>
              section.id === sectionId
                ? { ...section, items: [...section.items, newItem] }
                : section
            )
          }
        : folder
    ))
  }

  const handleUpdateFolder = (folderId: string, name: string) => {
    setFolders(folders.map(folder =>
      folder.id === folderId
        ? { ...folder, name }
        : folder
    ))
  }

  const handleUpdateSection = (folderId: string, sectionId: string, name: string) => {
    setFolders(folders.map(folder =>
      folder.id === folderId
        ? {
            ...folder,
            sections: folder.sections.map(section =>
              section.id === sectionId
                ? { ...section, name }
                : section
            )
          }
        : folder
    ))
  }

  const handleUpdateSaveItem = (
    folderId: string,
    sectionId: string,
    itemId: string,
    name: string,
    value: string,
    sensitive?: boolean
  ) => {
    setFolders(folders.map(folder =>
      folder.id === folderId
        ? {
            ...folder,
            sections: folder.sections.map(section =>
              section.id === sectionId
                ? {
                    ...section,
                    items: section.items.map(item =>
                      item.id === itemId
                        ? {
                            ...item,
                            name,
                            value,
                            sensitive: sensitive !== undefined ? sensitive : item.sensitive
                          }
                        : item
                    )
                  }
                : section
            )
          }
        : folder
    ))
  }

  const handleDeleteSaveItem = (folderId: string, sectionId: string, itemId: string) => {
    setFolders(folders.map(folder =>
      folder.id === folderId
        ? {
            ...folder,
            sections: folder.sections.map(section =>
              section.id === sectionId
                ? {
                    ...section,
                    items: section.items.filter(item => item.id !== itemId)
                  }
                : section
            )
          }
        : folder
    ))
  }

  const handleDeleteSection = (folderId: string, sectionId: string) => {
    setFolders(folders.map(folder =>
      folder.id === folderId
        ? {
            ...folder,
            sections: folder.sections.filter(section => section.id !== sectionId)
          }
        : folder
    ))

    if (activeSection === sectionId) {
      const folder = folders.find(f => f.id === folderId)
      if (folder && folder.sections.length > 1) {
        const index = folder.sections.findIndex(s => s.id === sectionId)
        const newIndex = index === 0 ? 1 : index - 1
        setActiveSection(folder.sections[newIndex].id)
      } else {
        setActiveSection(null)
      }
    }
  }

  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter(folder => folder.id !== folderId))

    if (activeFolder === folderId) {
      if (folders.length > 1) {
        const index = folders.findIndex(f => f.id === folderId)
        const newIndex = index === 0 ? 1 : index - 1
        setActiveFolder(folders[newIndex].id)

        if (folders[newIndex].sections.length > 0) {
          setActiveSection(folders[newIndex].sections[0].id)
        } else {
          setActiveSection(null)
        }
      } else {
        setActiveFolder(null)
        setActiveSection(null)
      }
    }
  }

  const handleReorderItems = (folderId: string, sectionId: string, reorderedItems: SaveItem[]) => {
    // Update the index property of each item based on its new position
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      index
    }));

    // Update the folders state with the reordered items
    setFolders(folders.map(folder =>
      folder.id === folderId
        ? {
            ...folder,
            sections: folder.sections.map(section =>
              section.id === sectionId
                ? { ...section, items: updatedItems }
                : section
            )
          }
        : folder
    ));
  }

  const handleMoveItemToSection = (
    sourceFolderId: string,
    sourceSectionId: string,
    itemId: string,
    targetFolderId: string,
    targetSectionId: string
  ) => {
    // Find the item to move
    const sourceFolder = folders.find(f => f.id === sourceFolderId);
    const sourceSection = sourceFolder?.sections.find(s => s.id === sourceSectionId);
    const itemToMove = sourceSection?.items.find(i => i.id === itemId);

    if (!itemToMove) return;

    // Find the target section to determine the new index
    const targetFolder = folders.find(f => f.id === targetFolderId);
    const targetSection = targetFolder?.sections.find(s => s.id === targetSectionId);
    const targetItemCount = targetSection?.items.length || 0;

    // Create a copy of the item with the new index (at the end of the target section)
    const movedItem = {
      ...itemToMove,
      index: targetItemCount
    };

    // Update the folders state: remove from source section and add to target section
    setFolders(folders.map(folder => {
      // Handle source folder
      if (folder.id === sourceFolderId) {
        return {
          ...folder,
          sections: folder.sections.map(section => {
            // Remove from source section
            if (section.id === sourceSectionId) {
              return {
                ...section,
                items: section.items.filter(item => item.id !== itemId)
              };
            }
            // If this is also the target section in the same folder, add the item
            if (sourceFolderId === targetFolderId && section.id === targetSectionId) {
              return {
                ...section,
                items: [...section.items, movedItem]
              };
            }
            return section;
          })
        };
      }
      // Handle target folder (if different from source)
      if (folder.id === targetFolderId && sourceFolderId !== targetFolderId) {
        return {
          ...folder,
          sections: folder.sections.map(section => {
            // Add to target section
            if (section.id === targetSectionId) {
              return {
                ...section,
                items: [...section.items, movedItem]
              };
            }
            return section;
          })
        };
      }
      return folder;
    }));
  }

  const handleImport = (data: Folder[]) => {
    setFolders(data)
    if (data.length > 0) {
      setActiveFolder(data[0].id)
      if (data[0].sections.length > 0) {
        setActiveSection(data[0].sections[0].id)
      } else {
        setActiveSection(null)
      }
    } else {
      setActiveFolder(null)
      setActiveSection(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Saver App</h1>
          <ExportImport data={folders} onImport={handleImport} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <SearchComponent
            folders={folders}
            onUpdateSaveItem={handleUpdateSaveItem}
            onDeleteSaveItem={handleDeleteSaveItem}
          />
          <FolderList
            folders={folders}
            activeFolder={activeFolder}
            activeSection={activeSection}
            onAddFolder={handleAddFolder}
            onAddSection={handleAddSection}
            onAddSaveItem={handleAddSaveItem}
            onUpdateFolder={handleUpdateFolder}
            onUpdateSection={handleUpdateSection}
            onUpdateSaveItem={handleUpdateSaveItem}
            onDeleteSaveItem={handleDeleteSaveItem}
            onDeleteSection={handleDeleteSection}
            onDeleteFolder={handleDeleteFolder}
            onSelectFolder={setActiveFolder}
            onSelectSection={setActiveSection}
            onReorderFolders={setFolders}
            onReorderItems={handleReorderItems}
            onMoveItemToSection={handleMoveItemToSection}
          />
        </div>
      </main>
    </div>
  )
}

export default App
