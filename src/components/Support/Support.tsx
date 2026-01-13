import AppModal from '@/components/AppModal';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './style.scss';

type Props = {
  onClose: () => void;
};

export default function Support({ onClose }: Props) {
  const { t } = useTranslation('support');

  const handleBuyMeACoffee = () => {
    window.open(
      'https://buymeacoffee.com/tychoplatform',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handlePayPal = () => {
    window.open(
      'https://www.paypal.com/donate',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <AppModal
      title={t('modal.title')}
      close={onClose}
      className="support-modal"
    >
      <div className="support-content">
        <div className="support-description">
          <p>{t('description.intro')}</p>
          <p>{t('description.project')}</p>
          <p>{t('description.why')}</p>
          <p className="support-thanks">{t('description.thanks')}</p>
        </div>

        <div className="support-buttons">
          <Button
            variant="contained"
            className="support-button buymeacoffee"
            onClick={handleBuyMeACoffee}
          >
            <img src="/buymeacoffee.png" alt="Buy Me a Coffee" />
          </Button>

          <Button
            variant="contained"
            className="support-button paypal"
            onClick={handlePayPal}
            sx={{ display: 'none' }}
          >
            <img src="/paypal.png" alt="PayPal" />
          </Button>
        </div>
      </div>
    </AppModal>
  );
}
