import { Conllu } from '@/types/Conllu';
import { StoreAction, types } from './types';

export const conllu = (data: Conllu): StoreAction => {
  return {
    type: types.CONLLU,
    payload: data,
  };
};
