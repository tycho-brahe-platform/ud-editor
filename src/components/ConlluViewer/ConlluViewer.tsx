import { Conllu } from '@/types/model/Conllu';
import { saveAs } from 'file-saver';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ConlluViewerConverter, {
  calculateTextWidth,
  throwError,
} from './ConlluViewerConverter';
import {
  ConlluViewerDependency,
  ConlluViewerGraph,
  ConlluViewerItem,
} from './ConlluViewerGraph';
import './style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

type Props = {
  conllu: Conllu;
};

const svgID = 'canvas';
const FONT = 'FreeSans, Arial, Helvetica, sans-serif';
const MARGIN = 4;
const NODE_FONT_SIZE = 16;
const EDGE_FONT_SIZE = 16;
const EDGE_FONT_OFFSET = 8;
const LVL_HEIGHT = 40;
const NODE_HEIGHT = 48;
const MULTI_SKIP = 4;
const MULTI_HEIGHT = 28;
const EDGE_FONT_WHITE_MARGIN = 2;
const EDGE_DROP = 80;
const EDGE_LBL_BACKGROUND = 'white';
const EDGE_LBL_OPACITY = 0.9;
const NODE_TWEEK = 2;

export default function ConlluViewer({ conllu }: Props) {
  const { t } = useTranslation('ud');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [graph, setGraph] = useState<ConlluViewerGraph>();
  const [activeItem, setActiveItem] = useState<ConlluViewerItem>();

  const handleGenerateImage = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context || !svgRef.current) {
      throw new Error('Unable to get canvas context');
    }

    const { width, height } = svgRef.current.getBBox();
    canvas.width = width;
    canvas.height = height;

    // Convert SVG element to data URL
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'anonymous'; // handle cross-origin issues

    img.onload = async () => {
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);
      context.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      // Convert canvas to JPEG blob
      canvas.toBlob(
        (blob) => {
          if (blob === null) return;
          saveAs(blob, 'conllu.jpg');
        },
        'image/jpeg',
        1.0
      );
    };

    img.src = url;
  };

  const calculateAnchor = (i1: number, i2: number, lvl: number) => {
    if (!graph) return 0;

    const a = graph.anchors[i1];
    if (a.length === 1) {
      if (i1 < i2) {
        return 0.75;
      }
      return 0.25;
    }

    let n = 0;
    for (let i = 0; i < a.length; i++) {
      const v = a[i];
      if (v.dist === i2 - i1 && v.level === lvl) {
        n = i;
        break;
      }
    }

    return (n + 0.5) / a.length;
  };

  const escapeHTML = (str: string) => {
    return str.replace(/[&<>"'`]/g, (match) => {
      const escapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#96;',
      };
      return escapeMap[match];
    });
  };

  const isActive = (dep: ConlluViewerDependency) => {
    if (!activeItem) return false;
    return (
      dep.headpos === Number(activeItem.here) ||
      dep.end === Number(activeItem.here)
    );
  };

  const isActiveItem = (item: ConlluViewerItem) => {
    if (!activeItem) return false;
    return (
      activeItem.here === item.there ||
      activeItem.there === item.here ||
      activeItem.lineno === item.lineno
    );
  };

  const drawDependencies = () => {
    if (!graph) return null;

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
          Math.floor(d1 * calculateAnchor(i1, i2, dep.lvl));

        let d2 = graph.items[i2].x2 - graph.items[i2].x1 - 20;
        let x2 =
          graph.items[i2].x1 +
          10 +
          Math.floor(d2 * calculateAnchor(i2, i1, dep.lvl));

        let y1 =
          MARGIN +
          EDGE_FONT_SIZE +
          EDGE_FONT_OFFSET +
          LVL_HEIGHT * (graph.maxlvl + 1);

        let y2 =
          MARGIN +
          EDGE_FONT_SIZE +
          EDGE_FONT_OFFSET +
          LVL_HEIGHT * (graph.maxlvl - dep.lvl);

        if (dep.headpos === 0) {
          y2 = MARGIN + EDGE_FONT_SIZE + EDGE_FONT_OFFSET;
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
              } ${isActive(dep) ? 'active-line' : ''}`}
              d={`M${x1} ${y1} L${x1} ${
                y2 + EDGE_DROP
              } C${x1} ${y2} ${x1} ${y2} ${
                (x1 + x2) / 2
              } ${y2} C${x2} ${y2} ${x2} ${y2} ${x2} ${
                y2 + EDGE_DROP
              } L${x2} ${y1}`}
            />
          );
        }

        arrows.push(
          <path
            className={`e${e}${dep.end} e${e}${dep.headpos} q${dep.end}q${
              dep.headpos
            } ${isActive(dep) ? 'active-arrow' : ''}`}
            d={`M${x1} ${y1} l3 -14 l-6 0 Z`}
            key={`arrows_${i}`}
          />
        );

        const { w, h, l } = calculateTextWidth(
          dep.rel[variant] + 'i',
          EDGE_FONT_SIZE,
          true
        );

        whites.push(
          <rect
            x={`${(x1 + x2 - w) / 2 - EDGE_FONT_WHITE_MARGIN}`}
            y={`${y2 - l - EDGE_FONT_OFFSET - EDGE_FONT_WHITE_MARGIN}`}
            width={`${w + 2 * EDGE_FONT_WHITE_MARGIN}`}
            height={`${h + 2 * EDGE_FONT_WHITE_MARGIN}`}
            key={`whites_${i}`}
          />
        );

        texts.push(
          <text
            className={`l${e}${dep.end} l${e}${dep.headpos} p${dep.end}p${dep.headpos}`}
            x={(x1 + x2) / 2}
            y={y2 - EDGE_FONT_OFFSET}
            key={`texts_${i}`}
          >
            {escapeHTML(dep.rel[variant])}
          </text>
        );
      });

      return (
        <g
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
            fill={EDGE_LBL_BACKGROUND}
            stroke={EDGE_LBL_BACKGROUND}
            strokeWidth="1"
            opacity={EDGE_LBL_OPACITY}
          >
            {whites}
          </g>
          <g fontFamily={FONT} fontSize={EDGE_FONT_SIZE} textAnchor="middle">
            {texts}
          </g>
        </g>
      );
    }
  };

  const drawItems = () => {
    if (!graph) return null;

    const items = graph.items.map((item, i) => {
      let enh = item.enhanced ? 'enhanced' : '';
      let color = item.enhanced ? '#ffe0e0' : '';
      return (
        <OverlayTrigger
          placement="bottom"
          show={activeItem && activeItem.lineno === item.lineno}
          overlay={popoverItem(item)}
          rootClose
          key={`items_${i}`}
        >
          <g
            onMouseEnter={() => setActiveItem(item)}
            onMouseLeave={() => setActiveItem(undefined)}
            className="pointer"
          >
            <rect
              className={`${isActiveItem(item) ? 'active-item' : ''}`}
              x={item.x1}
              y={graph.offset}
              width={item.x2 - item.x1}
              height={NODE_HEIGHT}
              rx="5"
              ry="5"
              fill={color}
            />
            <text
              className={`item-postag ${item.enhanced ? 'enhanced' : ''}`}
              x={(item.x1 + item.x2) / 2}
              y={graph.offset + NODE_TWEEK + NODE_HEIGHT / 4 + graph.lower}
              key={`texts_2_${i}`}
              textAnchor="middle"
            >
              {escapeHTML(item.postag)}
            </text>
            <text
              className={`item-text ${item.enhanced ? 'enhanced' : ''}`}
              x={(item.x1 + item.x2) / 2}
              y={
                graph.offset - NODE_TWEEK + (NODE_HEIGHT * 3) / 4 + graph.lower
              }
              key={`texts_3_${i}`}
              textAnchor="middle"
            >
              {escapeHTML(item.word)}
            </text>
          </g>
        </OverlayTrigger>
      );
    });

    return (
      <g fill="#D0E0FF" stroke="black" strokeWidth="1">
        {items}
      </g>
    );
  };

  const drawMultis = () => {
    if (!graph) return null;

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
          y={graph.offset + NODE_HEIGHT + MULTI_SKIP}
          width={x2 - x1}
          height={MULTI_HEIGHT}
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
            NODE_HEIGHT +
            MULTI_SKIP +
            MULTI_HEIGHT / 2 +
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
          fontFamily={FONT}
          fontSize={NODE_FONT_SIZE}
          fontStyle="italic"
          textAnchor="middle"
        >
          {labels}
        </g>
      </>
    );
  };

  const popoverItem = (item: ConlluViewerItem) => (
    <Tooltip className="popover-options popover-edition-levels">
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
    </Tooltip>
  );

  useEffect(() => {
    setGraph(new ConlluViewerConverter().execute(conllu));
  }, [conllu]);

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

      {graph && (
        <svg ref={svgRef} id={svgID} width={graph.width} height={graph.height}>
          {drawDependencies()}
          {drawItems()}
          {drawMultis()}
        </svg>
      )}
    </div>
  );
}
