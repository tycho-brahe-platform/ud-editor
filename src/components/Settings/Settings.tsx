import AppModal from '@/components/App/AppModal';
import { useTranslation } from 'react-i18next';
import './style.scss';

type Props = {
  onClose: () => void;
};

export default function Settings({ onClose }: Props) {
  const { t } = useTranslation('app');

  return (
    <AppModal title={t('settings.title')} close={onClose} confirm={onClose}>
      <div className="settings-content">
        <p>{t('settings.placeholder')}</p>
      </div>
    </AppModal>
  );
}
