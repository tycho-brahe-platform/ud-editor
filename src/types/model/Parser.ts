export const STANFORD_MODELS: Parser[] = [
  { name: 'Arabic', type: 'stanford', id: 'arabicFactored' },
  { name: 'Chinese (Factored)', type: 'stanford', id: 'chineseFactored' },
  { name: 'Chinese (PCFG)', type: 'stanford', id: 'chinesePCFG' },
  {
    name: 'English',
    type: 'stanford',
    id: 'englishPCFG.caseless',
  },
  { name: 'German', type: 'stanford', id: 'germanPCFG' },
  { name: 'Spanish', type: 'stanford', id: 'spanishPCFG' },
  { name: 'Xinhua (Factored)', type: 'stanford', id: 'xinhuaFactored' },
  {
    name: 'Xinhua (Factored Segmenting)',
    type: 'stanford',
    id: 'xinhuaFactoredSegmenting',
  },
  { name: 'Xinhua (PCFG)', type: 'stanford', id: 'xinhuaPCFG' },
];

type Parser = {
  id: string;
  name: string;
  type: 'stanford' | 'tycho';
};

export default Parser;
