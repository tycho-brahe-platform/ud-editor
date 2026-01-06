import { Conllu, ConlluToken } from '@/types/model/Conllu';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../App/Icon';
import TokenDetails from '../TokenDetails';
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

export default function ConlluEditor({ conllu, onDependencyChange }: Props) {
  const { t } = useTranslation('ud');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [graph, setGraph] = useState<ConlluViewerGraph>();
  const [activeItem, setActiveItem] = useState<ConlluViewerItem>();
  const [draggedDep, setDraggedDep] = useState<{
    depIndex: number;
    variant: number;
  } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState<ConlluToken | null>(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const handleTokenClick = (item: ConlluViewerItem) => {
    const token = conllu.tokens[item.lineno];
    if (token) {
      setSelectedToken(token);
      setIsTokenModalOpen(true);
    }
  };

  const handleCloseTokenModal = () => {
    setIsTokenModalOpen(false);
    setSelectedToken(null);
  };

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
    onTokenClick: handleTokenClick,
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
          <Icon name="download" />
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

      <TokenDetails
        token={selectedToken}
        open={isTokenModalOpen}
        onClose={handleCloseTokenModal}
      />
    </div>
  );
}
