import { Conllu, ConlluToken } from '@/types/model/Conllu';
import cytoscape from 'cytoscape';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import nodeHtmlLabel from 'cytoscape-node-html-label';
import './style.scss';
import udstylesheet from './UDCytoscapeStylesheet';
import SyntreesCytoscape from './SyntreesCytoscape';
import html2canvas from 'html2canvas';
import ConlluUtils from '@/converter/ConlluUtils';
import Icon from '../App/Icon';

nodeHtmlLabel(cytoscape);

type Props = {
  conllu: Conllu;
  resetTree: boolean;
  setResetTree: (b: boolean) => void;
};

const selector = 'canvas-tree';

export default function TreeView({ conllu, resetTree, setResetTree }: Props) {
  const { t } = useTranslation('ud');
  const [cy, setCy] = useState<any>();

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
    const tree = ConlluUtils.convertToCytoscape(conllu);
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
  }, [conllu]);

  useEffect(() => {
    reset();
  }, [resetTree]);

  return (
    <div className="ud-tree-container">
      <button
        className="floating-button"
        type="button"
        title={t('button.recenter.tree')}
        onClick={() => setResetTree(true)}
        style={{ right: '12px' }}
      >
        <Icon name="expand" size="small" />
      </button>
      <button
        className="floating-button"
        type="button"
        title={t('button.download.tree')}
        onClick={handleGenerateImage}
        style={{ right: '56px' }}
      >
        <Icon name="download" size="small" />
      </button>

      <div id={selector} />
    </div>
  );
}
