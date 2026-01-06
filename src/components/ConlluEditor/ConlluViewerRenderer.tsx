import { Conllu } from '@/types/Conllu';
import { ReactElement } from 'react';
import { Tooltip } from '@mui/material';
import { viewerConfigurations } from './ConlluViewerConstants';
import { calculateTextWidth, throwError } from './ConlluViewerConverter';
import { ConlluViewerGraph, ConlluViewerItem } from './ConlluViewerGraph';
import {
  calculateAnchor,
  escapeHTML,
  isActiveDependency,
  isActiveItem,
} from './ConlluViewerUtils';

type RendererProps = {
  graph: ConlluViewerGraph;
  activeItem: ConlluViewerItem | undefined;
  setActiveItem: (item: ConlluViewerItem | undefined) => void;
  onDependencyChange?: (updatedConllu: Conllu) => void;
  conllu: Conllu;
  draggedDep?: { depIndex: number; variant: number } | null;
  setDraggedDep?: (dep: { depIndex: number; variant: number } | null) => void;
  dragOverItem?: number | null;
  setDragOverItem?: (itemIndex: number | null) => void;
  onTokenClick?: (item: ConlluViewerItem) => void;
};

// Helper function to update dependency in Conllu structure
const updateDependencyInConllu = (
  conllu: Conllu,
  graph: ConlluViewerGraph,
  depIndex: number,
  newHeadpos: number,
  variant: number
): Conllu => {
  const dep = graph.dependencies[depIndex];
  if (!dep) return conllu;

  // Find the token that corresponds to dep.end
  const endItem = graph.items.find((item) => item.end === dep.end);
  if (!endItem) return conllu;

  const tokenIndex = endItem.lineno;
  const token = conllu.tokens[tokenIndex];
  if (!token) return conllu;

  const updatedConllu = {
    ...conllu,
    tokens: [...conllu.tokens],
  };

  if (variant === 0) {
    // Normal dependency - update head and deprel
    const newHeadItem = graph.items.find((item) => item.end === newHeadpos);
    if (newHeadItem) {
      updatedConllu.tokens[tokenIndex] = {
        ...token,
        head: newHeadItem.here,
        deprel: dep.rel[0],
      };
    }
  } else {
    // Enhanced dependency - update deps field
    const newHeadItem = graph.items.find((item) => item.end === newHeadpos);
    if (newHeadItem) {
      // Get all enhanced dependencies for this token
      const enhancedDeps = graph.dependencies
        .map((d, idx) => ({ dep: d, index: idx }))
        .filter(({ dep }) => {
          // Check if this dependency belongs to the same token
          const depEndItem = graph.items.find((item) => item.end === dep.end);
          return (
            depEndItem && depEndItem.lineno === tokenIndex && dep.rel[1] !== ''
          );
        });

      // Update the specific dependency by index
      const updatedDeps = enhancedDeps
        .map(({ dep, index }) => {
          if (index === depIndex) {
            return `${newHeadItem.here}:${dep.rel[1]}`;
          }
          const headItem = graph.items.find((item) => item.end === dep.headpos);
          return headItem ? `${headItem.here}:${dep.rel[1]}` : '';
        })
        .filter(Boolean);

      updatedConllu.tokens[tokenIndex] = {
        ...token,
        deps: updatedDeps.length > 0 ? updatedDeps.join('|') : '_',
      };
    }
  }

  return updatedConllu;
};

export const drawDependencies = ({
  graph,
  activeItem,
  draggedDep,
  setDraggedDep,
}: RendererProps): ReactElement | null => {
  const results: ReactElement[] = [];

  for (let variant = 0; variant < 2; variant++) {
    let e = 'n';
    if (variant === 1) {
      if (!graph.hasEnhanced) {
        continue;
      }
      e = 'e';
    }

    const lines: ReactElement[] = [];
    const arrows: ReactElement[] = [];
    const whites: ReactElement[] = [];
    const texts: ReactElement[] = [];

    graph.dependencies.forEach((dep, i) => {
      if (dep.rel[variant] === '') {
        return;
      }

      let i1 = dep.end - 1;
      let i2 = dep.headpos - 1;
      if (dep.headpos === 0) {
        i2 = i1;
      }

      let d1 = graph.items[i1].x2 - graph.items[i1].x1 - 20;
      let x1 =
        graph.items[i1].x1 +
        10 +
        Math.floor(d1 * calculateAnchor(graph, i1, i2, dep.lvl));

      let d2 = graph.items[i2].x2 - graph.items[i2].x1 - 20;
      let x2 =
        graph.items[i2].x1 +
        10 +
        Math.floor(d2 * calculateAnchor(graph, i2, i1, dep.lvl));

      let y1 =
        viewerConfigurations.margin +
        viewerConfigurations.edgeFontSize +
        viewerConfigurations.edgeFontOffset +
        viewerConfigurations.lvlHeight * (graph.maxlvl + 1);

      let y2 =
        viewerConfigurations.margin +
        viewerConfigurations.edgeFontSize +
        viewerConfigurations.edgeFontOffset +
        viewerConfigurations.lvlHeight * (graph.maxlvl - dep.lvl);

      if (dep.headpos === 0) {
        y2 =
          viewerConfigurations.margin +
          viewerConfigurations.edgeFontSize +
          viewerConfigurations.edgeFontOffset;
        lines.push(
          <path
            className={`e${e}${dep.end} q${dep.end}q${dep.headpos}`}
            d={`M${x1} ${y1} L${x1} ${y2}`}
            key={`deps_${i}`}
          />
        );
      } else {
        lines.push(
          <path
            key={`deps_${i}`}
            className={`e${e}${dep.end} e${e}${dep.headpos} q${dep.end}q${
              dep.headpos
            } ${isActiveDependency(dep, activeItem) ? 'active-line' : ''}`}
            d={`M${x1} ${y1} L${x1} ${
              y2 + viewerConfigurations.edgeDrop
            } C${x1} ${y2} ${x1} ${y2} ${
              (x1 + x2) / 2
            } ${y2} C${x2} ${y2} ${x2} ${y2} ${x2} ${
              y2 + viewerConfigurations.edgeDrop
            } L${x2} ${y1}`}
          />
        );
      }

      const isDragging =
        draggedDep?.depIndex === i && draggedDep?.variant === variant;

      // Calculate diamond size
      const diamondSize = 6;
      // Vertical offset to move diamond up from the border
      const diamondOffset = 8;

      // Calculate angle for diamond orientation (pointing downward along the arrow path)
      // The arrow starts at x2, y1 and goes down to y2 + edgeDrop
      let angle = 90; // Default: point downward
      if (dep.headpos !== 0) {
        // The line goes from x2, y1 downward, so angle is 90 degrees (pointing down)
        angle = 90;
      }

      // Calculate diamond center position (moved up from y1)
      const diamondY = y1 - diamondOffset;

      arrows.push(
        <g key={`arrow-group-${i}_${variant}`}>
          {/* Diamond at the head (beginning of arrow) - at the border of the element */}
          {dep.headpos !== 0 && (
            <polygon
              className={`e${e}${dep.end} e${e}${dep.headpos} q${dep.end}q${
                dep.headpos
              } ${isActiveDependency(dep, activeItem) ? 'active-arrow' : ''} ${
                isDragging ? 'dragging' : ''
              }`}
              points={`${x2},${diamondY - diamondSize} ${
                x2 + diamondSize
              },${diamondY} ${x2},${diamondY + diamondSize} ${
                x2 - diamondSize
              },${diamondY}`}
              transform={`rotate(${angle} ${x2} ${diamondY})`}
              style={{ cursor: 'grab' }}
              onMouseDown={(e) => {
                if (setDraggedDep && e.button === 0) {
                  // Left mouse button
                  const dragData = JSON.stringify({
                    depIndex: i,
                    variant,
                    end: dep.end,
                  });

                  // Create a temporary drag element
                  const dragElement = document.createElement('div');
                  dragElement.style.position = 'absolute';
                  dragElement.style.left = '-9999px';
                  dragElement.setAttribute('data-dependency', dragData);
                  document.body.appendChild(dragElement);

                  // Start drag
                  setDraggedDep({ depIndex: i, variant });

                  // Clean up on mouse up
                  const handleMouseUp = () => {
                    document.body.removeChild(dragElement);
                    if (setDraggedDep) {
                      setDraggedDep(null);
                    }
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  document.addEventListener('mouseup', handleMouseUp);

                  e.preventDefault();
                }
              }}
            />
          )}
          {/* Arrow at the dependency (end of arrow) */}
          <path
            className={`e${e}${dep.end} e${e}${dep.headpos} q${dep.end}q${
              dep.headpos
            } ${isActiveDependency(dep, activeItem) ? 'active-arrow' : ''} ${
              isDragging ? 'dragging' : ''
            }`}
            d={`M${x1} ${y1} l3 -14 l-6 0 Z`}
          />
        </g>
      );

      const { w, h, l } = calculateTextWidth(
        dep.rel[variant] + 'i',
        viewerConfigurations.edgeFontSize,
        true
      );

      whites.push(
        <rect
          x={`${(x1 + x2 - w) / 2 - viewerConfigurations.edgeFontWhiteMargin}`}
          y={`${
            y2 -
            l -
            viewerConfigurations.edgeFontOffset -
            viewerConfigurations.edgeFontWhiteMargin
          }`}
          width={`${w + 2 * viewerConfigurations.edgeFontWhiteMargin}`}
          height={`${h + 2 * viewerConfigurations.edgeFontWhiteMargin}`}
          key={`whites_${i}`}
        />
      );

      texts.push(
        <text
          className={`l${e}${dep.end} l${e}${dep.headpos} p${dep.end}p${dep.headpos}`}
          x={(x1 + x2) / 2}
          y={y2 - viewerConfigurations.edgeFontOffset}
          key={`texts_${i}`}
        >
          {escapeHTML(dep.rel[variant])}
        </text>
      );
    });

    results.push(
      <g
        key={variant}
        className={variant === 0 ? 'normal' : 'enhnaced'}
        style={
          variant === 0 && graph.hasEnhanced
            ? { visibility: 'hidden' }
            : undefined
        }
      >
        <g fill="none" stroke="black" strokeWidth="1">
          {lines}
        </g>
        <g fill="black" stroke="black" strokeWidth="1">
          {arrows}
        </g>
        <g
          fill={viewerConfigurations.edgeLblBackground}
          stroke={viewerConfigurations.edgeLblBackground}
          strokeWidth="1"
          opacity={viewerConfigurations.edgeLblOpacity}
        >
          {whites}
        </g>
        <g
          fontFamily={viewerConfigurations.font}
          fontSize={viewerConfigurations.edgeFontSize}
          textAnchor="middle"
        >
          {texts}
        </g>
      </g>
    );
  }

  return results.length > 0 ? <>{results}</> : null;
};

export const drawItems = ({
  graph,
  activeItem,
  setActiveItem,
  onDependencyChange,
  conllu,
  dragOverItem,
  setDragOverItem,
  draggedDep,
  setDraggedDep,
  onTokenClick,
}: RendererProps & {
  setActiveItem: (item: ConlluViewerItem | undefined) => void;
}): ReactElement | null => {
  const items = graph.items.map((item, i) => {
    let color = item.enhanced ? '#ffe0e0' : '';
    const isTooltipOpen = activeItem && activeItem.lineno === item.lineno;
    return (
      <Tooltip
        placement="bottom"
        open={!!isTooltipOpen}
        title={popoverItem(item)}
        key={`items_${i}`}
        arrow
      >
        <g
          className="pointer"
          onClick={(e) => {
            // Only trigger token click if not dragging a dependency
            if (draggedDep === null || draggedDep === undefined) {
              if (onTokenClick) {
                onTokenClick(item);
              }
            }
          }}
          onMouseEnter={(e) => {
            setActiveItem(item);
            // Check if we're dragging a dependency
            if (draggedDep !== null && draggedDep !== undefined) {
              if (setDragOverItem) {
                setDragOverItem(i);
              }
            }
          }}
          onMouseLeave={() => {
            setActiveItem(undefined);
            if (setDragOverItem) {
              setDragOverItem(null);
            }
          }}
          onMouseUp={(e) => {
            // Handle drop when mouse is released over an item
            if (draggedDep !== null && draggedDep !== undefined) {
              e.preventDefault();
              e.stopPropagation(); // Prevent onClick from firing after drag
              if (setDragOverItem) {
                setDragOverItem(null);
              }

              const depIndex = draggedDep.depIndex;
              const variant = draggedDep.variant;
              const newHeadpos = item.end;

              if (onDependencyChange) {
                const updatedConllu = updateDependencyInConllu(
                  conllu,
                  graph,
                  depIndex,
                  newHeadpos,
                  variant
                );
                onDependencyChange(updatedConllu);
              }

              if (setDraggedDep) {
                setDraggedDep(null);
              }
            }
          }}
        >
          <rect
            className={`${
              isActiveItem(item, activeItem) ? 'active-item' : ''
            } ${dragOverItem === i ? 'drag-over' : ''}`}
            x={item.x1}
            y={graph.offset}
            width={item.x2 - item.x1}
            height={viewerConfigurations.nodeHeight}
            rx="5"
            ry="5"
            fill={color}
          />
          <text
            className={`item-postag ${item.enhanced ? 'enhanced' : ''}`}
            x={(item.x1 + item.x2) / 2}
            y={
              graph.offset +
              viewerConfigurations.nodeTweek +
              viewerConfigurations.nodeHeight / 4 +
              graph.lower
            }
            key={`texts_2_${i}`}
            textAnchor="middle"
          >
            {escapeHTML(item.postag)}
          </text>
          <text
            className={`item-text ${item.enhanced ? 'enhanced' : ''}`}
            x={(item.x1 + item.x2) / 2}
            y={
              graph.offset -
              viewerConfigurations.nodeTweek +
              (viewerConfigurations.nodeHeight * 3) / 4 +
              graph.lower
            }
            key={`texts_3_${i}`}
            textAnchor="middle"
          >
            {escapeHTML(item.word)}
          </text>
        </g>
      </Tooltip>
    );
  });

  return (
    <g fill="#D0E0FF" stroke="black" strokeWidth="1">
      {items}
    </g>
  );
};

export const drawMultis = ({ graph }: RendererProps): ReactElement | null => {
  const boxes: ReactElement[] = [];
  const labels: ReactElement[] = [];

  graph.multis.forEach((multi, i) => {
    let aa = multi.id.split('-');
    if (aa.length !== 2) {
      throwError(new Error(`Invalid range ${multi.id}`), multi.lineno);
    }

    let x1 = 0;
    let x2 = 0;
    let found1 = false;
    let found2 = false;

    graph.items.forEach((item) => {
      if (aa[0] === item.here) {
        x1 = item.x1;
        found1 = true;
      }
      if (aa[1] === item.here) {
        x2 = item.x2;
        found2 = true;
        return;
      }
    });

    if (!(found1 && found2)) {
      throwError(new Error(`Invalid range ${multi.id}`), multi.lineno);
    }

    boxes.push(
      <rect
        x={x1}
        y={
          graph.offset +
          viewerConfigurations.nodeHeight +
          viewerConfigurations.multiSkip
        }
        width={x2 - x1}
        height={viewerConfigurations.multiHeight}
        rx="5"
        ry="5"
        key={`boxes_${i}`}
      />
    );

    labels.push(
      <text
        x={(x1 + x2) / 2}
        y={
          graph.offset +
          viewerConfigurations.nodeHeight +
          viewerConfigurations.multiSkip +
          viewerConfigurations.multiHeight / 2 +
          graph.lower
        }
        key={`labels_${i}`}
      >
        {escapeHTML(multi.word)}
      </text>
    );
  });

  return (
    <>
      <g fill="#D0E0FF" stroke="black" strokeWidth="1">
        {boxes}
      </g>
      <g
        fontFamily={viewerConfigurations.font}
        fontSize={viewerConfigurations.nodeFontSize}
        fontStyle="italic"
        textAnchor="middle"
      >
        {labels}
      </g>
    </>
  );
};

export const popoverItem = (item: ConlluViewerItem) => (
  <table>
    <tbody>
      <tr>
        <td>ID</td>
        <td>{item.lineno + 1}</td>
      </tr>
      <tr>
        <td>Form</td>
        <td>{item.word}</td>
      </tr>
      <tr>
        <td>POS tag</td>
        <td>{item.postag}</td>
      </tr>
      <tr>
        <td>XPOS tag</td>
        <td>{item.xpostag}</td>
      </tr>
      <tr>
        <td>Lemma</td>
        <td>{item.lemma}</td>
      </tr>
      <tr>
        <td colSpan={2}>{item.attribs}</td>
      </tr>
    </tbody>
  </table>
);
