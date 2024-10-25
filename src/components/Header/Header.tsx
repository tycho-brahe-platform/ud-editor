import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import HeaderLanguages from './HeaderLanguages';
import './style.scss';
import { Nav } from 'react-bootstrap';

type Props = {
  activeTab: string;
  setActiveTab: (s: string) => void;
};

export default function Header({ activeTab, setActiveTab }: Props) {
  const { t } = useTranslation('header');

  return (
    <div className="fixed-top header-container">
      <div className="menu">
        <FontAwesomeIcon icon={faBars} />
        <span className="title">
          {t('label.platform')}: {t('label.tool')}
        </span>
      </div>

      <Nav>
        <Nav.Item onClick={() => setActiveTab('conllu-viewer')}>
          <Nav.Link eventKey="conllu-viewer">
            {t('conllu.viewer.title')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item
          onClick={() => {
            setActiveTab('ud-tree');
            // setResetTree(true);
          }}
        >
          <Nav.Link eventKey="ud-tree">{t('ud.tree.title')}</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="d-flex ms-auto">
        <HeaderLanguages />
      </div>
    </div>
  );
}
