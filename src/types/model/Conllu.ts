export type ConlluToken = {
  id: string;
  form: string;
  lemma: string;
  upos: string;
  xpos: string;
  feats: string;
  head: string;
  deprel: string;
  deps: string;
  misc: string;
};

export type Conllu = {
  tokens: ConlluToken[];
  attributes: Record<string, string>;
};

export const CONLLU_ATTRS: (keyof ConlluToken)[] = [
  'id',
  'form',
  'lemma',
  'upos',
  'xpos',
  'feats',
  'head',
  'deprel',
  'deps',
  'misc',
];
