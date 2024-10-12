export type ConlluViewerGraph = {
  hasEnhanced: boolean;
  items: ConlluViewerItem[];
  multis: ConlluViewerMulti[];
  dependencies: ConlluViewerDependency[];
  positions: Record<string, number>;
  anchors: ConlluViewerAnchor[][];
  grid: boolean[][];
  width: number;
  height: number;
  maxlvl: number;
  offset: number;
  lower: number;
};

export type ConlluViewerItem = {
  lineno: number;
  here: string;
  there: string;
  enhanced: boolean;
  word: string;
  lemma: string;
  postag: string;
  xpostag: string;
  attribs: string;
  rel: string;
  deps: string;
  end: number;
  x1: number;
  x2: number;
};

export type ConlluViewerMulti = {
  id: string;
  word: string;
  lineno: number;
};

export type ConlluViewerDependency = {
  end: number;
  headpos: number;
  rel: string[];
  dist: number;
  lvl: number;
};

export type ConlluViewerAnchor = {
  dist: number;
  level: number;
};
