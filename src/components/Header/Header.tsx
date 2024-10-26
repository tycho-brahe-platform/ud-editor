import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import HeaderLanguages from './HeaderLanguages';
import './style.scss';

export default function Header() {
  const { t } = useTranslation('header');

  return (
    <div className="fixed-top header-container">
      <div className="menu">
        <FontAwesomeIcon icon={faBars} />
        <span className="title">
          {t('label.platform')}: {t('label.tool')}
        </span>
      </div>

      <div className="d-flex ms-auto">
        <HeaderLanguages />
      </div>
    </div>
  );
}
