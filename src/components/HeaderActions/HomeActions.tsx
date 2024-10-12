import AuthContext from '@/configs/AuthContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './style.scss';

type HeaderActionsProps = {
  showHeader: boolean;
  type: string;
};

export default function HomeActions({ showHeader, type }: HeaderActionsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation('home');
  const { state, dispatch } = useContext(AuthContext);

  return (
    <div
      className="actions-container fixed-top"
      style={{ marginTop: showHeader ? 'var(--spacing-xxlarge)' : '0px' }}
    >
      <div className="actions">
        <button
          type="button"
          className={`app-button ${type === 'tycho' ? 'selected' : ''}`}
          onClick={() => navigate('/', { replace: true })}
        >
          {t('button.label.tycho')}
        </button>
        <button
          type="button"
          className={`app-button ${type === 'ud' ? 'selected' : ''}`}
          onClick={() => navigate('/ud', { replace: true })}
        >
          {t('button.label.ud')}
        </button>
      </div>
    </div>
  );
}
