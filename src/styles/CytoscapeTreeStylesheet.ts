const stylesheet = [
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
      content: 'data(label)',
      'background-color': '#FFF',
      width: '50px',
      height: '40px',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': 18,
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
      opacity: 0.9,
      'overlay-padding': '3px',
      'overlay-opacity': 0,
      width: 1,
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

export default stylesheet;
