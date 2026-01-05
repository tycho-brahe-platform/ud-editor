import { Conllu } from '@/types/model/Conllu';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { viewerConfigurations } from './ConlluViewerConstants';
import ConlluViewerConverter from './ConlluViewerConverter';
import { ConlluViewerGraph, ConlluViewerItem } from './ConlluViewerGraph';
import { generateImageFromSVG } from './ConlluViewerImageUtils';
import {
  drawDependencies,
  drawItems,
  drawMultis,
} from './ConlluViewerRenderer';
import './style.scss';

type Props = {
  conllu: Conllu;
  onDependencyChange?: (updatedConllu: Conllu) => void;
};

export default function ConlluViewer({ conllu, onDependencyChange }: Props) {
  const { t } = useTranslation('ud');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [graph, setGraph] = useState<ConlluViewerGraph>();
  const [activeItem, setActiveItem] = useState<ConlluViewerItem>();
  const [draggedDep, setDraggedDep] = useState<{
    depIndex: number;
    variant: number;
  } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);

  const handleGenerateImage = () => {
    if (!svgRef.current) {
      throw new Error('SVG element not found');
    }
    generateImageFromSVG(svgRef.current);
  };

  useEffect(() => {
    setGraph(new ConlluViewerConverter().execute(conllu));
  }, [conllu]);

  if (!graph) {
    return null;
  }

  const rendererProps = {
    graph,
    activeItem,
    setActiveItem,
    onDependencyChange,
    conllu,
    draggedDep,
    setDraggedDep,
    dragOverItem,
    setDragOverItem,
  };

  return (
    <div className="conllu-viewer-container">
      <div className="buttons">
        <button
          className="floating-button"
          type="button"
          title={t('button.download.tree')}
          onClick={handleGenerateImage}
          style={{ left: '12px' }}
        >
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>

      <svg
        ref={svgRef}
        id={viewerConfigurations.svgID}
        width={graph.width}
        height={graph.height}
        viewBox={`0 0 ${graph.width} ${graph.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {drawDependencies(rendererProps)}
        {drawItems(rendererProps)}
        {drawMultis(rendererProps)}
      </svg>
    </div>
  );
}
