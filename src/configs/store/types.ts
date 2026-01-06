import { Conllu } from '@/types/Conllu';

export type UserStore = {
  conllu: Conllu;
};

export type StoreAction = {
  type: string;
  payload?: Conllu;
};

export const types = {
  CONLLU: 'CONLLU',
};
