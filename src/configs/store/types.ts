import { Conllu } from '@/types/Conllu';
import SentenceItem from '@/types/SentenceItem';

export type UserStore = {
  conllu: Conllu;
  sentences: SentenceItem[];
  selectedIndex: number;
};

export type StoreAction = {
  type: string;
  payload?:
    | Conllu
    | SentenceItem[]
    | number
    | { index: number; status: string };
};

export const types = {
  CONLLU: 'CONLLU',
  SET_SENTENCES: 'SET_SENTENCES',
  SET_SELECTED_INDEX: 'SET_SELECTED_INDEX',
  UPDATE_SENTENCE_STATUS: 'UPDATE_SENTENCE_STATUS',
};
