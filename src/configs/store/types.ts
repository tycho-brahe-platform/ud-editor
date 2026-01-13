import { Conllu } from '@/types/Conllu';
import SentenceItem from '@/types/SentenceItem';

export type UserStore = {
  conllu: Conllu;
  sentences: SentenceItem[];
  selectedIndex: number;
  filename: string | null;
};

export type StoreAction = {
  type: string;
  payload?:
    | Conllu
    | SentenceItem[]
    | number
    | string
    | null
    | { index: number; status: string };
};

export const types = {
  CONLLU: 'CONLLU',
  SET_SENTENCES: 'SET_SENTENCES',
  SET_SELECTED_INDEX: 'SET_SELECTED_INDEX',
  UPDATE_SENTENCE_STATUS: 'UPDATE_SENTENCE_STATUS',
  SET_FILENAME: 'SET_FILENAME',
};
