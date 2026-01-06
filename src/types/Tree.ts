import { EdgeDefinition, NodeDefinition, Position } from 'cytoscape';

export type CytoscapeTree = {
  nodes: NodeDefinition[];
  edges: EdgeDefinition[];
  pan?: Position;
};

type Tree = {
  uid?: string;
  sentence: string;
  expression?: string;
  cytoscape: any;
};

export default Tree;
