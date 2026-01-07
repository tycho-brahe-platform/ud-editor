import { Conllu, ConlluToken } from '@/types/Conllu';
import { CytoscapeTree } from '@/types/Tree';
import { EdgeDefinition, NodeDefinition } from 'cytoscape';

const isNotEmptyConllu = (conllu: Conllu): boolean => {
  return conllu && conllu.tokens.length > 0;
};

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
  if (!isNotEmptyConllu(conllu)) return '';

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

/**
 * Deletes a token from the Conllu structure and updates all related references.
 * - Updates token IDs to maintain sequential order (1, 2, 3, ...)
 * - Updates HEAD references: if HEAD points to deleted token, points to previous token (or first if deleted was first)
 * - Decrements HEAD references that point to tokens after the deleted one
 */
const deleteToken = (conllu: Conllu, tokenIndex: number): Conllu => {
  if (tokenIndex < 0 || tokenIndex >= conllu.tokens.length) {
    return conllu;
  }

  // Get the ID of the token being deleted (as number for comparison)
  const deletedToken = conllu.tokens[tokenIndex];
  const deletedTokenId = deletedToken.id;
  const deletedTokenIdNum = Number(deletedTokenId);

  // Calculate the new ID of the token before the deleted one
  // After deletion and renumbering, if we delete at index i:
  // - Token at index i-1 will have new ID = i (which is String(i))
  // - If deleting first token (index 0), the new first token will have ID "1"
  const previousTokenNewId =
    tokenIndex > 0 ? String(tokenIndex) : conllu.tokens.length > 1 ? '1' : '0';

  // Remove the token at the specified index
  const updatedTokens = conllu.tokens.filter(
    (_, index) => index !== tokenIndex
  );

  // Update IDs to be sequential (1, 2, 3, ...)
  const tokensWithUpdatedIds = updatedTokens.map((token, index) => ({
    ...token,
    id: String(index + 1),
  }));

  // Update HEAD references based on the old IDs before deletion
  const tokensWithUpdatedHeads = tokensWithUpdatedIds.map((token, newIndex) => {
    // Get the original token (before ID update) to check its original HEAD
    const originalToken = updatedTokens[newIndex];

    // Skip if HEAD is empty, null, or '_'
    if (
      !originalToken.head ||
      originalToken.head === '_' ||
      originalToken.head === ''
    ) {
      return token;
    }

    const headIdNum = Number(originalToken.head);

    // If HEAD points to the deleted token, point to the previous token (or first if deleted was first)
    if (originalToken.head === deletedTokenId) {
      return {
        ...token,
        head: previousTokenNewId,
      };
    }

    // If HEAD points to a token after the deleted one, decrement it by 1
    if (headIdNum > deletedTokenIdNum) {
      return {
        ...token,
        head: String(headIdNum - 1),
      };
    }

    // If HEAD points to a token before the deleted one, no change needed
    // But we need to ensure the HEAD value is still valid after renumbering
    // Since tokens before the deleted one keep their relative positions, their IDs don't change
    // So we can keep the original HEAD value
    return token;
  });

  return {
    ...conllu,
    tokens: tokensWithUpdatedHeads,
  };
};

const ConlluUtils = {
  convertToSentence,
  convertToCytoscape,
  convertToConllu,
  isNotEmptyConllu,
  deleteToken,
};

export default ConlluUtils;
