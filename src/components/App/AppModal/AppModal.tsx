import React, { useEffect, useState } from 'react';
import './style.scss';
import { Spinner, Button, Modal } from 'react-bootstrap';
import Conditional from '@/components/App/Conditional';
import { useTranslation } from 'react-i18next';

type Props = {
  children: React.ReactNode;
  title: string;
  className?: string;
  close: () => void;
  confirm?: () => void;
  open?: boolean;
  disableConfirm?: boolean;
  hideFooter?: boolean;
};

function AppModal({
  title,
  children,
  open,
  className,
  close,
  confirm,
  disableConfirm,
  hideFooter,
}: Props) {
  const { t } = useTranslation('audio');
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (!loading) {
      setLoading(true);
      confirm && confirm();
    }
  };

  const handleClose = () => {
    setLoading(false);
    close && close();
  };

  const attachCloseToEscape = () => {
    const closeOnEscape = (e: any) => {
      if (e.keyCode === 27) handleClose();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  };

  useEffect(() => {
    setLoading(false);
    attachCloseToEscape();
  }, []);

  return (
    <Conditional if={open}>
      <Modal show centered dialogClassName={className}>
        <Modal.Header>
          <Modal.Title className="text-center">{title}</Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={handleClose}
          />
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        {!hideFooter ? (
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              {t('message:modal.button.cancel')}
            </Button>
            <Button
              variant="success"
              onClick={handleConfirm}
              disabled={disableConfirm}
            >
              {t('message:modal.button.confirm')}
              {loading && <Spinner animation="border" size="sm" />}
            </Button>
          </Modal.Footer>
        ) : null}
      </Modal>
    </Conditional>
  );
}

export default AppModal;
