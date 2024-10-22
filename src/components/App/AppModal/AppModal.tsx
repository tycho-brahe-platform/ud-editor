import Conditional from '@/components/App/Conditional';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

type ContainerProps = {
  children: React.ReactNode;
  title: string;
  className?: string;
  close: () => void;
  confirm?: () => void;
  open?: boolean;
  disableConfirm?: boolean;
  hideFooter?: boolean;
  disableCancel?: boolean;
  disableClose?: boolean;
  confirmLabel?: string;
  onShow?: () => void;
  closeLabel?: string;
  onEntered?: () => void;
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
  disableClose,
  disableCancel,
  confirmLabel,
  closeLabel,
  onShow,
  onEntered,
}: ContainerProps) {
  const { t } = useTranslation('header');
  return (
    <Conditional if={open}>
      <Modal
        show
        centered
        dialogClassName={className}
        onShow={() => onShow && onShow()}
        onEntered={() => onEntered && onEntered()}
      >
        <Modal.Header>
          <Modal.Title className="text-center">{title}</Modal.Title>
          {!disableClose && (
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={close}
            />
          )}
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        {!hideFooter ? (
          <Modal.Footer>
            {!disableCancel && (
              <Button variant="danger" onClick={close}>
                {closeLabel || t('message:modal.button.cancel')}
              </Button>
            )}
            {confirm && (
              <Button
                variant="success"
                onClick={confirm}
                disabled={disableConfirm}
              >
                {confirmLabel || t('message:modal.button.confirm')}
              </Button>
            )}
          </Modal.Footer>
        ) : null}
      </Modal>
    </Conditional>
  );
}

export default AppModal;
