import { useEffect } from 'react';
import { Box, Button, Fade, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
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
  onDelete?: () => void;
  deleteLabel?: string;
};

const attachCloseToEscape = (handleClose: () => void) => {
  const closeOnEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
  };

  window.addEventListener('keydown', closeOnEscape);
  return () => window.removeEventListener('keydown', closeOnEscape);
};

export default function AppModal({
  children,
  title,
  className,
  close,
  confirm,
  onEntered,
  onDelete,
  deleteLabel,
}: Props) {
  const { t } = useTranslation('app');

  useEffect(() => {
    return attachCloseToEscape(close);
  }, [close]);

  const getClassNames = className
    ? `modal-container ${className}`
    : 'modal-container';

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
            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                onClick={onDelete}
                sx={{ marginRight: 'auto' }}
              >
                {deleteLabel || t('button.delete')}
              </Button>
            )}
            {confirm && (
              <Button variant="contained" color="primary" onClick={confirm}>
                {t('button.confirm')}
              </Button>
            )}
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
