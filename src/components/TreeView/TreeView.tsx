import { Conllu, ConlluToken } from '@/types/Conllu';
import cytoscape from 'cytoscape';
import { saveAs } from 'file-saver';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import nodeHtmlLabel from 'cytoscape-node-html-label';
import './style.scss';
import udstylesheet from './UDCytoscapeStylesheet';
import SyntreesCytoscape from './SyntreesCytoscape';
import html2canvas from 'html2canvas';
import ConlluUtils from '@/converter/ConlluUtils';
import Icon from '../AppIcon';
import AuthContext from '@/configs/AuthContext';

nodeHtmlLabel(cytoscape);

type Props = {
  resetTree: boolean;
  setResetTree: (b: boolean) => void;
};

const selector = 'canvas-tree';

export default function TreeView({ resetTree, setResetTree }: Props) {
  const { t } = useTranslation('app');
  const [cy, setCy] = useState<any>();
  const { state } = useContext(AuthContext);

  const handleGenerateImage = () => {
    if (!cy) return;

    const cyContainer = cy.container();
    html2canvas(cyContainer, {
      backgroundColor: 'white',
    }).then((canvas) => {
      canvas.toBlob(
        (blob) => {
          if (blob === null) return;
          saveAs(blob, 'ud.jpg');
        },
        'image/jpeg',
        1.0
      );
    });
  };

  const buildTemplateToken = (token: ConlluToken) => {
    return token.form === 'root'
      ? `
    <div class="ud-token-container">
    <span class="form">${token.form}</span>
    </div>
    `
      : `
    <div class="ud-token-container">
    <span class="form">${token.form}</span>
    <span>${token.lemma}</span>
    <span>${token.id}</span>
    <span class="pos">${token.upos}</span>
    <span class="pos">${token.xpos}</span>
    </div>
    `;
  };

  const reset = () => {
    if (cy && resetTree) {
      setTimeout(() => {
        cy.fit();
        cy.center();
      }, 200);
      setResetTree(false);
    }
  };

  const render = () => {
    const tree = ConlluUtils.convertToCytoscape(state.conllu);
    if (!tree) {
      const el = document.getElementById(selector);
      if (el) el.innerHTML = '<label>sentence not parsed</label>';
      return;
    }

    SyntreesCytoscape.init(selector, tree, udstylesheet, true, (thisCy) => {
      thisCy.nodeHtmlLabel([
        {
          query: 'node',
          halign: 'center',
          valign: 'center',
          halignBox: 'center',
          valignBox: 'center',
          tpl: (data: any) => {
            return buildTemplateToken(data.token);
          },
        },
      ]);
      setCy(thisCy);
    });
  };

  useEffect(() => {
    render();
  }, [state.conllu]);

  useEffect(() => {
    reset();
  }, [resetTree]);

  return (
    <div className="tree-container">
      <div className="floating-buttons">
        <button
          type="button"
          title={t('button.tooltip.recenter')}
          onClick={() => setResetTree(true)}
        >
          <Icon name="center_focus_weak" />
        </button>
        <button
          type="button"
          title={t('button.tooltip.download')}
          onClick={handleGenerateImage}
        >
          <Icon name="download" />
        </button>
      </div>

      <div id={selector} />
    </div>
  );
}
