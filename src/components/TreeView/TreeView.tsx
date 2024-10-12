import {
  faDownload,
  faUpRightAndDownLeftFromCenter,
} from '@fortawesome/free-solid-svg-icons';
import useWindowDimensions from '@/functions/UseWindowDimensions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Core } from 'cytoscape';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';
import './style.scss';
import { useEffect } from 'react';
import UsabilityUtils from '@/functions/UsabilityUtils';

type Props = {
  cy: Core | undefined;
  expand: boolean;
  setExpand: (b: boolean) => void;
  setShowHeader: (b: boolean) => void;
};

export default function TreeView({
  cy,
  expand,
  setExpand,
  setShowHeader,
}: Props) {
  const { t } = useTranslation('home');
  const windowDimensions = useWindowDimensions();

  const generateImage = () => {
    if (cy) {
      saveAs(cy.jpg({ full: true }), 'tree.jpg');
    }
  };

  const handleExpandTree = () => {
    expand &&
      setShowHeader(
        !UsabilityUtils.isMobile(
          windowDimensions.width,
          windowDimensions.height
        )
      );

    if (cy) {
      setTimeout(() => {
        cy.fit();
        cy.center();
      }, 200);
    }
  };

  useEffect(() => {
    handleExpandTree();
  }, [expand]);

  return (
    <div className="tree-container">
      <button
        className="floating-button"
        type="button"
        title={t('button.download.tree')}
        onClick={generateImage}
        style={{ right: '24px' }}
      >
        <FontAwesomeIcon icon={faDownload} />
      </button>
      <button
        className="floating-button"
        type="button"
        title={t('button.expand.tree')}
        onClick={() => setExpand(!expand)}
        style={{ right: '80px' }}
      >
        <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
      </button>
      <div
        id="canvas"
        className={`${expand ? 'expanded' : ''}`}
        style={{ width: '100%', height: '88vh' }}
      />
    </div>
  );
}
