import { Conllu, ConlluToken } from '@/types/Conllu';
import {
  ConlluViewerAnchor,
  ConlluViewerDependency,
  ConlluViewerGraph,
  ConlluViewerItem,
  ConlluViewerMulti,
} from './ConlluViewerGraph';
import {
  fontBaseSize,
  fontBoldAscent,
  fontBoldDescent,
  fontBoldSizes,
  fontRegularAscent,
  fontRegularDescent,
  fontRegularSizes,
} from './ConlluFontsizes';

export const calculateTextWidth = (
  text: string,
  fontSize: number,
  bold: boolean
) => {
  const { sizes, asc, desc } = bold
    ? { sizes: fontBoldSizes, asc: fontBoldAscent, desc: fontBoldDescent }
    : {
        sizes: fontRegularSizes,
        asc: fontRegularAscent,
        desc: fontRegularDescent,
      };

  let w = 0;
  for (const c of text) {
    const i = c.charCodeAt(0);
    let w1;
    if (i >= sizes.length) {
      w1 = fontBaseSize;
    } else {
      w1 = sizes[i];
    }
    w += w1;
  }

  return {
    w: Math.round((fontSize * w) / fontBaseSize),
    h: Math.round((fontSize * (asc + desc)) / fontBaseSize),
    l: Math.round((fontSize * asc) / fontBaseSize),
  };
};

export const throwError = (err: Error, idx: number) => {
  console.error({ err, idx });
  throw err;
};

class ConlluViewerConverter {
  private MIN_NODE_WIDTH = 80;
  private NODE_SPACING = 8;
  private MARGIN = 4;
  private NODE_FONT_SIZE = 16;
  private EDGE_FONT_SIZE = 16;
  private EDGE_FONT_OFFSET = 8;
  private LVL_HEIGHT = 40;
  private NODE_HEIGHT = 48;
  private MULTI_SKIP = 4;
  private MULTI_HEIGHT = 28;

  execute = (conllu: Conllu): ConlluViewerGraph => {
    const graph = this.load(conllu);
    this.loadDependencies(graph);
    this.relateDependencies(graph);

    graph.items.sort((a, b) => a.end - b.end);

    this.calculateWidth(graph);

    graph.dependencies.sort(
      (a: ConlluViewerDependency, b: ConlluViewerDependency) => a.dist - b.dist
    );

    this.calculateDependenciesLevel(graph);
    this.calculateMaxLevel(graph);
    this.setDependenciesMaxLevel(graph);
    this.calculateAnchors(graph);
    this.calculateHeight(graph);
    this.calculateOffset(graph);
    this.calculateLower(graph);

    return graph;
  };

  private calculateLower = (graph: ConlluViewerGraph) => {
    const { w, h, l: y } = calculateTextWidth('Xg', this.NODE_FONT_SIZE, false);
    graph.lower = y / 2;
  };

  private calculateOffset = (graph: ConlluViewerGraph) => {
    graph.offset =
      this.MARGIN +
      this.EDGE_FONT_SIZE +
      this.EDGE_FONT_OFFSET +
      this.LVL_HEIGHT * (graph.maxlvl + 1);
  };

  private calculateHeight = (graph: ConlluViewerGraph) => {
    let height =
      this.MARGIN +
      this.EDGE_FONT_SIZE +
      this.EDGE_FONT_OFFSET +
      this.LVL_HEIGHT * (graph.maxlvl + 1) +
      this.NODE_HEIGHT +
      this.MARGIN;

    if (graph.multis.length > 0) {
      height += this.MULTI_HEIGHT + this.MULTI_SKIP;
    }

    graph.height = height;
  };

  private calculateWidth = (graph: ConlluViewerGraph) => {
    let width = this.MARGIN;
    graph.items.forEach((item, i) => {
      if (item.end !== i + 1) {
        throwError(
          new Error(`Wrong index: ${item.end} != ${i + 1}`),
          item.lineno
        );
      }

      item.x1 = width;
      const { w: w1 } = calculateTextWidth(
        item.postag + ' i',
        this.NODE_FONT_SIZE,
        false
      );

      const { w: w2 } = calculateTextWidth(
        item.word + ' i',
        this.NODE_FONT_SIZE,
        false
      );

      item.x2 = width + 24 + Math.max(this.MIN_NODE_WIDTH, w1, w2);
      width = item.x2 + this.NODE_SPACING;
    });
    width -= this.NODE_SPACING;
    width += this.MARGIN;

    graph.width = width;
  };

  private calculateAnchors = (graph: ConlluViewerGraph) => {
    graph.anchors.forEach((anchor, key) => {
      anchor.forEach((a, i) => {
        if (a.dist === 0) {
          graph.anchors[key][i].level = graph.maxlvl;
        }
      });
    });

    graph.anchors.forEach((anchor) => {
      anchor.sort((a1, a2) => {
        if (a1.dist === 0) return a2.dist > 0 ? -1 : 1;
        if (a2.dist === 0) return a1.dist < 0 ? -1 : 1;

        if (a1.dist === a2.dist) {
          if (a1.dist < 0) return a1.level - a2.level;
          return a2.level - a1.level;
        }

        if (a1.dist < 0) {
          if (a2.dist > 0) {
            return -1;
          }
          return a1.dist < a2.dist ? 1 : -1;
        }

        if (a2.dist < 0) {
          return 1;
        }

        return a1.dist < a2.dist ? 1 : -1;
      });
    });
  };

  private setDependenciesMaxLevel = (graph: ConlluViewerGraph) => {
    graph.dependencies.forEach((dep, i) => {
      if (dep.headpos === 0) {
        graph.dependencies[i].lvl = graph.maxlvl;
      }
    });
  };

  private calculateMaxLevel = (graph: ConlluViewerGraph) => {
    const maxlvl = graph.dependencies.reduce(
      (max, dep) => Math.max(max, dep.lvl || 0),
      0
    );

    graph.maxlvl = graph.hasEnhanced ? maxlvl + 1 : maxlvl;
  };

  private calculateDependenciesLevel = (graph: ConlluViewerGraph) => {
    const anchors: ConlluViewerAnchor[][] = Array.from(
      { length: graph.items.length },
      () => []
    );

    const grid: boolean[][] = Array.from({ length: graph.items.length }, () =>
      Array(2 * graph.items.length).fill(false)
    );

    graph.dependencies.forEach((dep, i) => {
      if (dep.headpos === 0) {
        anchors[dep.end - 1].push({ dist: 0, level: 0 });
        return;
      }

      let i1 = dep.end - 1;
      let i2 = dep.headpos - 1;
      if (i1 > i2) {
        [i1, i2] = [i2, i1];
      }
      let lvl = 0;
      while (true) {
        let ok = true;
        for (let j = i1; j < i2; j++) {
          if (grid[j][lvl]) {
            ok = false;
            break;
          }
        }
        if (ok) {
          for (let j = i1; j < i2; j++) {
            grid[j][lvl] = true;
          }
          break;
        }
        lvl++;
      }

      graph.dependencies[i].lvl = lvl;
      anchors[dep.end - 1].push({ dist: dep.headpos - dep.end, level: lvl });
      anchors[dep.headpos - 1].push({
        dist: dep.end - dep.headpos,
        level: lvl,
      });
    });

    graph.anchors = anchors;
    graph.grid = grid;
  };

  private relateDependencies = (graph: ConlluViewerGraph) => {
    for (let i = 0; i < graph.dependencies.length; i++) {
      let d1 = graph.dependencies[i];
      if (d1.rel[0] !== '') {
        for (let j = 0; j < graph.dependencies.length; j++) {
          if (i === j) continue;
          let d2 = graph.dependencies[j];

          if (
            d2.rel[1] !== '' &&
            d1.end === d2.end &&
            d1.headpos === d2.headpos &&
            d1.dist === d2.dist
          ) {
            d1.rel[1] = d2.rel[1];
            graph.dependencies.splice(j, 1);
            if (j < i) i--;
            break;
          }
        }
      }
    }
  };

  private loadDependencies = (graph: ConlluViewerGraph) => {
    const dependencies: ConlluViewerDependency[] = [];

    for (let i = 0; i < graph.items.length; i++) {
      let item = graph.items[i];
      let end = graph.positions[item.here];
      item.end = end;

      if (!item.enhanced) {
        let headpos = graph.positions[item.there];
        if (headpos === undefined) {
          throwError(
            new Error(`Unknown head position ${item.there}`),
            item.lineno
          );
        }

        dependencies.push({
          end,
          headpos,
          rel: [item.rel, ''],
          dist: Math.abs(end - headpos),
          lvl: 0,
        });
      }

      if (item.deps !== '_') {
        const parts = item.deps.split('|');
        parts.forEach((part) => {
          const partsSplits = part.split(':', 2);
          if (partsSplits.length !== 2) {
            throwError(new Error(`Invalid dependency: ${part}`), item.lineno);
          }

          const headpos = graph.positions[partsSplits[0]];
          if (!headpos) {
            throwError(
              new Error(`Unknown head position ${partsSplits[0]}`),
              item.lineno
            );
          }

          dependencies.push({
            end: end,
            headpos: headpos,
            rel: ['', partsSplits[1]],
            dist: Math.abs(end - headpos),
            lvl: 0,
          });

          graph.hasEnhanced = true;
        });
      }
    }

    graph.dependencies = dependencies;
  };

  private load = (conllu: Conllu) => {
    const items: ConlluViewerItem[] = [];
    const multis: ConlluViewerMulti[] = [];
    const positions: Record<string, number> = {
      '0': 0,
    };

    let n = 0;
    conllu.tokens.forEach((token: ConlluToken, idx: number) => {
      // TODO: how to calculate nColumns????
      // if (token.id.includes('.') && token.deps === nColumns) {
      if (token.id.includes('.')) {
        return;
      }

      if (token.id.includes('-')) {
        multis.push({
          id: token.id,
          word: token.form,
          lineno: idx,
        });
        return;
      }

      const item = {
        lineno: idx,
        here: token.id,
        word: token.form,
        lemma: token.lemma,
        postag: token.upos,
        xpostag: token.xpos,
        attribs:
          token.feats !== '_'
            ? token.feats.replace(/\|/g, ', ').replace(/=/g, ': ')
            : '',
        there: token.head,
        rel: token.deprel,
        deps: token.deps,
        enhanced: token.id.includes('.'),
        end: 0,
        x1: 0,
        x2: 0,
      };

      items.push(item);
      n++;
      positions[token.id] = n;
    });

    return {
      multis,
      items,
      positions,
      hasEnhanced: false,
      dependencies: [],
      anchors: [[]],
      grid: [[]],
      width: 0,
      height: 0,
      maxlvl: 0,
      offset: 0,
      lower: 0,
    };
  };
}

export default ConlluViewerConverter;
