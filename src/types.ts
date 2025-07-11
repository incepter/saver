export interface SaveItem {
  id: string;
  name: string;
  value: string;
  sensitive?: boolean;
  index?: number;
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
  index?: number;
}
