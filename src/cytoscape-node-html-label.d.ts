import * as cytoscape from 'cytoscape';

declare module 'cytoscape' {
  interface Core {
    nodeHtmlLabel: (
      labels: Array<{
        query: string;
        halign?: 'left' | 'center' | 'right';
        valign?: 'top' | 'center' | 'bottom';
        halignBox?: 'left' | 'center' | 'right';
        valignBox?: 'top' | 'center' | 'bottom';
        cssClass?: string;
        tpl?: (data: any) => string;
      }>
    ) => void;
  }
}
