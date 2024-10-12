import Split from './Split';

export const INFLECTIONS = ['1S', '2S', '3S', '1P', '2P', '3P'];
export const EXTENSIONS = ['LFD', 'PRG', 'PRN', 'RSP', 'SPR', 'SPE'];

type Token = {
  p: number;
  l: number;
  v: string;
  t: string;
  ec?: boolean;
  h?: boolean;
  bid?: string;
  mid?: string;
  cid?: string;
  eid?: string;
  split?: Split;
  splits: Token[];
  coidx?: number[];
  idx?: number;
  attributes?: Record<string, string>;
  tags?: string[];
};

export default Token;
