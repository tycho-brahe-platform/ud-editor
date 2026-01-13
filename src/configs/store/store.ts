import { EMPTY_CONLLU } from '@/types/Conllu';
import { UserStore } from './types';

const store: UserStore = {
  conllu: EMPTY_CONLLU,
  sentences: [],
  selectedIndex: -1,
};

export default store;
