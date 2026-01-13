import { Conllu } from '@/types/Conllu';
import SentenceItem from '@/types/SentenceItem';
import { StoreAction, types } from './types';

export const conllu = (data: Conllu): StoreAction => {
  return {
    type: types.CONLLU,
    payload: data,
  };
};

export const setSentences = (sentences: SentenceItem[]): StoreAction => {
  return {
    type: types.SET_SENTENCES,
    payload: sentences,
  };
};

export const setSelectedIndex = (index: number): StoreAction => {
  return {
    type: types.SET_SELECTED_INDEX,
    payload: index,
  };
};

export const updateSentenceStatus = (
  index: number,
  status: string
): StoreAction => {
  return {
    type: types.UPDATE_SENTENCE_STATUS,
    payload: { index, status },
  };
};
