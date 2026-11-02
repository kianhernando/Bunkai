export type Word = {
  text: string;
  reading: string;
  pos: string;
  base: string;
};

export type DictionaryRow = {
  id: number;
  entry_id: number;
  written: string;
  reading: string;
  common: number;
  pos: string;
  glosses: string;
};