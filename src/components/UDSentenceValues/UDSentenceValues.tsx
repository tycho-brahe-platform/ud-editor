import AppModal from '@/components/App/AppModal';
import { Conllu } from '@/types/model/Conllu';
import Parameter from '@/types/model/Parameter';
import { useRef, useState } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

type Props = {
  conllu: Conllu | undefined;
  setConllu: (s: Conllu) => void;
};

export default function UDSentenceValues({ conllu, setConllu }: Props) {
  const { t } = useTranslation(['ud', 'header']);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const targets = useRef<Record<string, HTMLElement | null>>({});

  const [openChangeText, setOpenChangeText] = useState(false);
  const [attribute, setAttribute] = useState('');
  const [value, setValue] = useState('');
  const input = useRef<HTMLInputElement | null>(null);

  const handleClick = (attr: string) => {
    if (!conllu) return;

    document.body.click();
    setValue(conllu.attributes[attr]);
    setAttribute(attr);
    setTarget(targets.current[attr]);
  };

  const handleClose = () => {
    setValue('');
    setAttribute('');
    setTarget(null);
  };

  const handleConfirm = () => {
    if (!conllu) return;

    const attrs = conllu.attributes;
    attrs[attribute] = value;
    setConllu({ ...conllu, attributes: attrs });

    if (openChangeText) {
      setOpenChangeText(false);
      window.location.reload();
    }

    setTarget(null);
  };

  return (
    <table className="table table-striped table-sentence">
      <tbody>
        {udTiers &&
          udTiers.map((tier, idx) => (
            <tr className="attr" key={idx.valueOf()}>
              <td width="15%" title={tier.name}>
                {tier.symbol}
              </td>
              <td>
                <span
                  className="edit-value"
                  onClick={() => handleClick(tier.symbol)}
                  ref={(ref) => {
                    targets.current[tier.symbol] = ref;
                  }}
                >
                  {conllu && conllu.attributes && conllu.attributes[tier.symbol]
                    ? conllu.attributes[tier.symbol]
                    : t('header:label.empty')}
                </span>
              </td>
            </tr>
          ))}
      </tbody>

      {target !== null && (
        <Overlay
          target={target}
          show
          placement="bottom"
          onEntered={() => input.current?.focus()}
          rootClose
        >
          <Popover className="popover-value popover-sentence-value">
            <Popover.Body>
              <input
                type="text"
                className="input-value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                ref={input}
              />
              <div className="buttons">
                <Button variant="danger" onClick={handleClose}>
                  {t('header:popover.button.close')}
                </Button>
                <Button
                  variant="success"
                  onClick={() =>
                    attribute == 'text'
                      ? setOpenChangeText(true)
                      : handleConfirm()
                  }
                >
                  {t('header:popover.button.confirm')}
                </Button>
              </div>
            </Popover.Body>
          </Popover>
        </Overlay>
      )}

      <AppModal
        title={t('modal.change.text.title')}
        className="modal-input"
        open={openChangeText}
        close={() => setOpenChangeText(false)}
        confirm={handleConfirm}
      >
        <div className="alert alert-danger m-b-0">
          <p>
            <b>{t('modal.change.text.confirmation')}</b>
            <span className="ms-2">{t('modal.change.text.message')}</span>
          </p>
        </div>
      </AppModal>
    </table>
  );
}

const udTiers: Parameter[] = [
  {
    name: 'ID',
    symbol: 'sent_id',
    order: 1,
  },
  {
    name: 'Text',
    symbol: 'text',
    order: 2,
  },
  {
    name: 'Portuguese',
    symbol: 'text_por',
    order: 3,
  },
  {
    name: 'English',
    symbol: 'text_eng',
    order: 4,
  },
  {
    name: 'Source',
    symbol: 'text_source',
    order: 5,
  },
  {
    name: 'Annotator',
    symbol: 'text_annotator',
    order: 6,
  },
];
