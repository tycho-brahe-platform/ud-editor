import Chunk from './Chunk';
import Token from './Token';

export type Struct = {
  uid: string;
  tokens: Token[];
  chunks: Chunk[];
};

export const EMPTY_STRUCT = {
  uid: '',
  tokens: [],
  chunks: [],
};
