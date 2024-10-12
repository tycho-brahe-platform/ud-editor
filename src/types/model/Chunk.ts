export const EMPTY_CATEGORIES = [
  '*',
  '0',
  '*arb*',
  '*exp*',
  '*ICH*',
  '*pro*',
  '*PRO*',
  '*T*',
];

type Chunk = {
  i: number;
  f: number;
  l: number;
  t: string;
  coidx: number[];
};

export default Chunk;
