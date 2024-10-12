import { EdgeDefinition } from 'cytoscape';
import NodeBounds from './NodeBounds';
import NodeCalculation, { CytoscapeTreeCalculation } from './NodeCalculation';
import TreeLayout from './TreeLayout';

class CytoscapePositionCalculator {
  calculatePositions(
    cytoscape: CytoscapeTreeCalculation
  ): Map<string, NodeBounds> {
    this.convert(cytoscape);
    const layout = new TreeLayout(cytoscape.root);
    return layout.getNodeBounds();
  }

  private convert(cytoscape: CytoscapeTreeCalculation): void {
    this.order(cytoscape);

    const root = cytoscape.root;
    const mapNodes: Map<string, NodeCalculation> = new Map();

    for (const node of cytoscape.nodes) {
      mapNodes.set(node.id, node);
    }

    const rootKey = root.id;
    if (rootKey)
      for (const childKey of this.getChildren(cytoscape, rootKey)) {
        this.addNode(cytoscape, mapNodes, childKey, root);
      }
  }

  private getChildren(
    cytoscape: CytoscapeTreeCalculation,
    key: string
  ): string[] {
    // Gets all connected children IDs from the edges
    const list: string[] = cytoscape.edges
      .filter((e: EdgeDefinition) => e.data.source === key)
      .map((e: EdgeDefinition) => e.data.target);

    // Creates a new list to add the IDs in the order of the nodes
    const children: string[] = [];
    for (const node of cytoscape.nodes) {
      if (!list.includes(node.id)) continue;
      children.push(node.id);
    }
    return children;
  }

  private addNode(
    cytoscape: CytoscapeTreeCalculation,
    mapNodes: Map<string, NodeCalculation>,
    key: string,
    fatherNode: NodeCalculation
  ): void {
    const node = mapNodes.get(key);
    if (!node) return;

    if (!fatherNode.children) fatherNode.children = [];
    fatherNode.children.push(node);
    node.parent = fatherNode;

    const children = this.getChildren(cytoscape, key);
    if (children.length === 1 && children.includes(key)) return;
    for (const child of children) {
      this.addNode(cytoscape, mapNodes, child, node);
    }
  }

  private order(cytoscape: CytoscapeTreeCalculation): void {
    cytoscape.nodes.sort((nodeA, nodeB) => {
      const valueA = nodeA.data.chunk ? nodeA.data.chunk.i : nodeA.data.token.p;
      const valueB = nodeB.data.chunk ? nodeB.data.chunk.i : nodeB.data.token.p;
      return valueA - valueB;
    });

    cytoscape.edges.sort((edge1: EdgeDefinition, edge2: EdgeDefinition) => {
      const index1 = cytoscape.nodes.findIndex(
        (node: NodeCalculation) => node.id === edge1.data.target
      );
      const index2 = cytoscape.nodes.findIndex(
        (node: NodeCalculation) => node.id === edge2.data.target
      );
      return index1 - index2;
    });
  }
}

export default CytoscapePositionCalculator;
