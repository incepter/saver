import { useState, useEffect } from 'react'
import FolderList from './components/FolderList'
import ExportImport from './components/ExportImport'
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
      sections: []
    }
    setFolders([...folders, newFolder])
    setActiveFolder(newFolder.id)
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
    const newItem: SaveItem = {
      id: crypto.randomUUID(),
      name,
      value,
      sensitive
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
          <FolderList
            folders={folders}
            activeFolder={activeFolder}
            activeSection={activeSection}
            onAddFolder={handleAddFolder}
            onAddSection={handleAddSection}
            onAddSaveItem={handleAddSaveItem}
            onUpdateSaveItem={handleUpdateSaveItem}
            onDeleteSaveItem={handleDeleteSaveItem}
            onDeleteSection={handleDeleteSection}
            onDeleteFolder={handleDeleteFolder}
            onSelectFolder={setActiveFolder}
            onSelectSection={setActiveSection}
            onReorderFolders={setFolders}
          />
        </div>
      </main>
    </div>
  )
}

export default App
