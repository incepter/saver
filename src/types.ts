export interface SaveItem {
  id: string;
  name: string;
  value: string;
}

export interface Section {
  id: string;
  name: string;
  items: SaveItem[];
}

export interface Folder {
  id: string;
  name: string;
  sections: Section[];
}
