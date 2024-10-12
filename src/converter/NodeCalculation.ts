import { EdgeDefinition, NodeDataDefinition, Position } from 'cytoscape';

export type CytoscapeTreeCalculation = {
  nodes: NodeCalculation[];
  edges: EdgeDefinition[];
  root: NodeCalculation;
};

type NodeCalculation = {
  id: string;
  data: NodeDataDefinition;
  position?: Position;
  parent?: NodeCalculation;
  children?: NodeCalculation[];
};

export default NodeCalculation;
