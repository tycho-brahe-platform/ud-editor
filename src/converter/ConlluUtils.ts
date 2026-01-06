import { Conllu, ConlluToken } from '@/types/model/Conllu';
import { CytoscapeTree } from '@/types/model/Tree';
import { EdgeDefinition, NodeDefinition } from 'cytoscape';

const convertToCytoscape = (sentence: Conllu): CytoscapeTree => {
  const nodes: NodeDefinition[] = [];
  const edges: EdgeDefinition[] = [];
  const uids: string[] = [uuid()];

  nodes.push({
    data: {
      id: uids[0],
      label: 'root',
      root: true,
      token: {
        id: 0,
        form: 'root',
      },
    },
  });

  for (const token of sentence.tokens) {
    const thisUid = uuid();
    uids.push(thisUid);

    nodes.push({
      data: {
        id: thisUid,
        label: token.form,
        token,
      },
    });
  }

  for (const token of sentence.tokens) {
    if (token.head !== null && token.deprel) {
      edges.push({
        data: {
          id: uuid(),
          label: token.deprel,
          target: uids[Number(token.id)],
          source: uids[Number(token.head)],
        },
      });
    }
  }

  return { nodes, edges };
};

const convertToSentence = (conllText: string): Conllu => {
  const lines = conllText.trim().split('\n');
  const headerInfo: Record<string, string> = {};
  const tokens: ConlluToken[] = [];

  for (const line of lines) {
    if (line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (value) headerInfo[key.slice(2).trim()] = value.trim();
      else headerInfo[key.slice(2).trim()] = '';
    } else {
      const fields = line.split('\t');

      // check if id has '-', if positive this is a splitter
      if (fields[0].indexOf('-') != -1) continue;

      const token: ConlluToken = {
        id: fields[0],
        form: fields[1],
        lemma: fields[2],
        upos: fields[3],
        xpos: fields[4],
        feats: fields[5],
        head: fields[6],
        deprel: fields[7],
        deps: fields[8],
        misc: fields[9],
      };
      tokens.push(token);
    }
  }

  const conllu: Conllu = {
    attributes: headerInfo || {},
    tokens: tokens,
  };

  return conllu;
};

const convertToConllu = (conllu: Conllu): string => {
  const attributesLines = Object.entries(conllu.attributes)
    .map(([key, value]) => `# ${key} = ${value}`)
    .join('\n');

  const tokenLines = conllu.tokens
    .map((token) =>
      [
        token.id,
        token.form,
        token.lemma,
        token.upos,
        token.xpos,
        token.feats,
        token.head,
        token.deprel,
        token.deps === '' ? '_' : token.deps,
        token.misc,
      ].join('\t')
    )
    .join('\n');

  return [attributesLines, tokenLines].join('\n');
};

const uuid = () =>
  'xxxxxxxx'.replace(/[xy]/g, (c) => {
    /* eslint-disable */
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    /* eslint-enable */
    return v.toString(16);
  });

const ConlluUtils = {
  convertToSentence,
  convertToCytoscape,
  convertToConllu,
};

export default ConlluUtils;
