import AppModal from '@/components/App/AppModal';
import AuthContext from '@/configs/AuthContext';
import { toastLoading } from '@/configs/store/actions';
import { Conllu, ConlluToken } from '@/types/model/Conllu';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './style.scss';

type Props = {
  conllu: Conllu;
  setConllu: (c: Conllu) => void;
  token: ConlluToken;
  onClose: () => void;
  openEdit: boolean;
  openRemove: boolean;
  openAdd: boolean;
};

export default function UDSentenceTokenOperations({
  conllu,
  setConllu,
  token,
  onClose,
  openEdit,
  openRemove,
  openAdd,
}: Props) {
  const { t } = useTranslation('ud');
  const { dispatch, state } = useContext(AuthContext);

  const [value, setValue] = useState('');
  const [addValue, setAddValue] = useState('');
  const [addId, setAddId] = useState('');
  const [disabledId, setDisabledId] = useState(true);

  const input = useRef<HTMLInputElement | null>(null);
  const inputAdd = useRef<HTMLInputElement | null>(null);

  const handleConfirmForm = () => {
    if (!conllu || !token || state.toastLoading) return;
    dispatch(toastLoading(true));

    // const thisToken = { ...token, ['form']: value };
    // UDService.saveForm(conllu.uid, thisToken)
    //   .then((r) => {
    //   })
    //   .catch((err) => {
    //     dispatchError({ err, dispatch, t });
    //   })
    //   .finally(() => {
    //     dispatch(toastLoading(false));
    //   });
  };

  const handleAdd = () => {
    if (!conllu || !token || state.toastLoading) return;
    dispatch(toastLoading(true));

    const thisToken = {
      ...token,
      ['form']: addValue,
    };
    // UDService.addToken(conllu.uid, addId, thisToken)
    //   .then((r) => {
    //     setConllu(r.data);
    //     onClose();
    //   })
    //   .catch((err) => {
    //     dispatchError({ err, dispatch, t });
    //   })
    //   .finally(() => {
    //     dispatch(toastLoading(false));
    //   });
  };

  const handleRemove = () => {
    if (!conllu || !token || state.toastLoading) return;
    dispatch(toastLoading(true));

    // UDService.removeToken(conllu.uid, token.id)
    //   .then((r) => {
    //     setConllu(r.data);
    //     onClose();
    //   })
    //   .catch((err) => {
    //     dispatchError({ err, dispatch, t });
    //   })
    //   .finally(() => {
    //     dispatch(toastLoading(false));
    //   });
  };

  useEffect(() => {
    setValue(token.form);
  }, []);

  return (
    <>
      <AppModal
        title={t('modal.token.add.title')}
        className="modal-conllu-token"
        open={openAdd}
        close={onClose}
        confirm={handleAdd}
        onEntered={() => inputAdd.current?.focus()}
      >
        <div className="alert alert-success mb-0">
          <span>{t('modal.token.add.message')}</span>
          <div className="group">
            <input
              type="text"
              className="input input-name"
              value={addValue}
              onChange={(e) => setAddValue(e.target.value)}
              ref={inputAdd}
              placeholder={t('modal.token.placeholder.name')}
            />
            <div
              onClick={() => {
                console.log(disabledId);
                disabledId && setDisabledId(false);
              }}
              className="input-id"
            >
              <input
                type="text"
                className="input w-100"
                value={addId}
                onChange={(e) => setAddId(e.target.value)}
                disabled={disabledId}
                style={{
                  pointerEvents: disabledId ? 'none' : 'auto',
                }}
                placeholder={t('modal.token.placeholder.id')}
              />
            </div>
          </div>
        </div>
      </AppModal>
      <AppModal
        title={t('modal.token.edit.title')}
        className="modal-conllu-token"
        open={openEdit}
        close={onClose}
        confirm={handleConfirmForm}
        onEntered={() => input.current?.focus()}
      >
        <div className="alert alert-success mb-0">
          <span>{t('modal.token.edit.message')}</span>
          <div className="group">
            <input
              type="text"
              className="input input-name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              ref={input}
            />
          </div>
        </div>
      </AppModal>
      <AppModal
        title={t('modal.token.remove.title')}
        className="modal-conllu-token"
        open={openRemove}
        close={onClose}
        confirm={handleRemove}
      >
        <p className="alert alert-danger mb-0">
          <span>{t('modal.token.remove.message')}</span>
        </p>
      </AppModal>
    </>
  );
}
