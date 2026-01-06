import { Box, Button, Fade, Modal } from '@mui/material';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import Icon from '../Icon';
import './style.scss';

type Props = {
  children: React.ReactNode;
  title: string;
  close: () => void;
  confirm?: () => void;
  cancel?: () => void;
  subtitle?: string;
  className?: string;
  onEntered?: () => void;
};

export default function AppModal({
  children,
  title,
  subtitle,
  className,
  close,
  confirm,
  onEntered,
}: Props) {
  const { t } = useTranslation('app');

  const getClassNames = cx('modal-container', className);

  return (
    <Modal open disableEnforceFocus disableAutoFocus disableRestoreFocus>
      <Fade in onEntered={() => onEntered && onEntered()}>
        <Box className={getClassNames} sx={style}>
          <div className="header">
            <span className="title">{title}</span>
            <Icon name="close" onClick={close} className="pointer" />
          </div>
          <div className="body">{children}</div>
          <div className="footer">
            <Button variant="contained" color="primary" onClick={confirm}>
              {t('button.confirm')}
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxWidth: '1080px',
  borderRadius: '2px',
  boxShadow: 24,
  bgcolor: 'var(--color-background)',
};
