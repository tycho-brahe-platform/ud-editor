import { CytoscapeTree } from '@/types/model/Tree';
import cytoscape, { Core, Stylesheet } from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

const init = (
  selector: string,
  tree: CytoscapeTree,
  stylesheet: Stylesheet[] | undefined,
  dagre?: boolean,
  onReady?: (cy: Core) => void
): Core => {
  destroy(selector);

  const cy = cytoscape({
    container: document.getElementById(selector),
    layout: { name: 'preset' },
    elements: { nodes: tree.nodes || [], edges: tree.edges || [] },
    style: stylesheet,
    zoom: 2,
    pan: tree.pan || { x: 100, y: 100 },
    minZoom: 1e-50,
    maxZoom: 1e50,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: true,
    selectionType: 'single',
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: false,
    autoungrabify: false,
    autounselectify: false,
    headless: false,
    styleEnabled: true,
    hideEdgesOnViewport: false,
    hideLabelsOnViewport: false,
    textureOnViewport: false,
    motionBlur: false,
    motionBlurOpacity: 0.2,
    wheelSensitivity: 0.3,
    pixelRatio: 1,
  });

  cy.ready(() => {
    cy.fit();
    cy.center();
    dagre && cy.layout({ name: 'dagre' }).run();
    onReady && onReady(cy);
  });

  return cy;
};

const destroy = (selector: string) => {
  const el = document.getElementById(selector);
  if (el) el.innerHTML = '';
};

const SyntreesCytoscape = {
  init,
};

export default SyntreesCytoscape;
