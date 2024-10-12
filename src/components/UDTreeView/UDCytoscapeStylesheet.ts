import cytoscape from 'cytoscape';

const udstylesheet = [
  {
    selector: 'core',
    style: {
      'selection-box-color': '#ddd',
      'selection-box-opacity': 0.65,
      'selection-box-border-color': '#aaa',
      'selection-box-border-width': 1,
      'active-bg-color': 'black',
      'active-bg-opacity': 0.15,
    },
  },
  {
    selector: 'node',
    style: {
      'background-color': '#FFF',
      height: '60px',
      width: '60px',
      shape: 'rectangle',
      cursor: 'pointer',
    },
  },
  {
    selector: 'node.highlight',
    style: {
      width: '100px',
      'background-color': 'yellow',
    },
  },
  {
    selector: 'edge',
    style: {
      'control-point-distance': 30,
      'control-point-weight': 0.5,
      width: 1,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      label: 'data(label)',
      'font-size': 10,
    },
  },
  {
    selector: ':selected',
    style: {
      'background-color': '#FFF',
      'line-color': 'red',
      'source-arrow-color': 'red',
      'target-arrow-color': 'red',
    },
  },
] as Array<cytoscape.Stylesheet>;

export default udstylesheet;
