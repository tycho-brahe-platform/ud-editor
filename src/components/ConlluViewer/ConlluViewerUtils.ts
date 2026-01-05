import {
  ConlluViewerGraph,
  ConlluViewerDependency,
  ConlluViewerItem,
} from './ConlluViewerGraph';

export const escapeHTML = (str: string): string => {
  return str.replace(/[&<>"'`]/g, (match) => {
    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#96;',
    };
    return escapeMap[match];
  });
};

export const calculateAnchor = (
  graph: ConlluViewerGraph,
  i1: number,
  i2: number,
  lvl: number
): number => {
  const a = graph.anchors[i1];
  if (a.length === 1) {
    if (i1 < i2) {
      return 0.75;
    }
    return 0.25;
  }

  let n = 0;
  for (let i = 0; i < a.length; i++) {
    const v = a[i];
    if (v.dist === i2 - i1 && v.level === lvl) {
      n = i;
      break;
    }
  }

  return (n + 0.5) / a.length;
};

export const isActiveDependency = (
  dep: ConlluViewerDependency,
  activeItem: ConlluViewerItem | undefined
): boolean => {
  if (!activeItem) return false;
  return (
    dep.headpos === Number(activeItem.here) ||
    dep.end === Number(activeItem.here)
  );
};

export const isActiveItem = (
  item: ConlluViewerItem,
  activeItem: ConlluViewerItem | undefined
): boolean => {
  if (!activeItem) return false;
  return (
    activeItem.here === item.there ||
    activeItem.there === item.here ||
    activeItem.lineno === item.lineno
  );
};
