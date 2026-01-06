import AuthContext from '@/configs/AuthContext';
import { conllu } from '@/configs/store/actions';
import { Conllu, ConlluToken } from '@/types/Conllu';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
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

export default function ConlluEditor() {
  const { t } = useTranslation('app');
  const { state, dispatch } = useContext(AuthContext);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [graph, setGraph] = useState<ConlluViewerGraph>();
  const [activeItem, setActiveItem] = useState<ConlluViewerItem>();
  const [draggedDep, setDraggedDep] = useState<{
    depIndex: number;
    variant: number;
  } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState<ConlluToken | null>(null);
  const [openToken, setOpenToken] = useState(false);

  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(-1);

  const handleTokenClick = (item: ConlluViewerItem) => {
    const token = state.conllu.tokens[item.lineno];
    if (token) {
      setSelectedToken(token);
      setSelectedTokenIndex(item.lineno);
      setOpenToken(true);
    }
  };

  const handleCloseTokenModal = () => {
    setOpenToken(false);
    setSelectedToken(null);
    setSelectedTokenIndex(-1);
  };

  const handleTokenChange = (updatedToken: ConlluToken) => {
    if (
      selectedTokenIndex >= 0 &&
      selectedTokenIndex < state.conllu.tokens.length
    ) {
      const updatedTokens = [...state.conllu.tokens];
      updatedTokens[selectedTokenIndex] = updatedToken;
      const updatedConllu = { ...state.conllu, tokens: updatedTokens };
      dispatch(conllu(updatedConllu));
      setSelectedToken(updatedToken);
    }
  };

  const handleGenerateImage = () => {
    if (!svgRef.current) {
      throw new Error('SVG element not found');
    }
    generateImageFromSVG(svgRef.current);
  };

  useEffect(() => {
    setGraph(new ConlluViewerConverter().execute(state.conllu));
  }, [state.conllu]);

  if (!graph) {
    return null;
  }

  const rendererProps = {
    graph,
    activeItem,
    setActiveItem,
    onDependencyChange: (updatedConllu: Conllu) => {
      dispatch(conllu(updatedConllu));
    },
    conllu: state.conllu,
    draggedDep,
    setDraggedDep,
    dragOverItem,
    setDragOverItem,
    onTokenClick: handleTokenClick,
  };

  return (
    <div className="conllu-editor-container">
      <div className="floating-buttons">
        <button
          type="button"
          title={t('button.tooltip.download')}
          onClick={handleGenerateImage}
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
      {openToken && selectedToken && (
        <TokenDetails
          token={selectedToken}
          tokenIndex={selectedTokenIndex}
          onClose={handleCloseTokenModal}
          onTokenChange={handleTokenChange}
        />
      )}
    </div>
  );
}
