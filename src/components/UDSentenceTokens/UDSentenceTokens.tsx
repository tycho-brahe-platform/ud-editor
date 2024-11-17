import { Conllu, CONLLU_ATTRS, ConlluToken } from '@/types/model/Conllu';
import { UdTagTypeNames } from '@/types/model/UdTags';
import {
  faCopy,
  faEdit,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';
import UDSentenceTokenOperations from './UDSentenceTokenOperations';

type Props = {
  conllu: Conllu | undefined;
  setConllu: (s: Conllu) => void;
};

export default function UDSentenceTokens({ conllu, setConllu }: Props) {
  const { t } = useTranslation(['ud', 'header']);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const targets = useRef<Record<string, HTMLElement | null>>({});
  const [attribute, setAttribute] = useState('');
  const [token, setToken] = useState<ConlluToken>();
  const [value, setValue] = useState<string>();
  const input = useRef<HTMLInputElement | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const handleClick = (token: ConlluToken, attr: string, idx: string) => {
    if (attr === 'id') return;
    document.body.click();
    setTarget(targets.current[idx]);
    setToken(token);
    setValue(getTokenValue(token, attr));
    setAttribute(attr);
  };

  const handleConfirm = () => {
    if (!conllu || !token) return;

    const thisToken = { ...token, [attribute]: value };
    const tokens = conllu.tokens;
    const idx = tokens.findIndex((obj) => obj.id === thisToken.id);
    tokens[idx] = thisToken;
    setConllu({ ...conllu, tokens });

    setTarget(null);
    setValue(undefined);
    setToken(undefined);
  };

  const getTokenValue = (token: ConlluToken, key: string) => {
    const value = token[key.toLowerCase() as keyof ConlluToken];
    return value !== '_' ? value : undefined;
  };

  return (
    <div className="tokens-container">
      <table className="table table-striped table-ud-tokens">
        <thead>
          <tr>
            {CONLLU_ATTRS.map((key, idx) => (
              <td key={idx.valueOf()}>{key.toUpperCase()}</td>
            ))}
            <td width="8%">&nbsp;</td>
          </tr>
        </thead>
        <tbody>
          {conllu &&
            conllu.tokens &&
            conllu.tokens.map((token, idx) => (
              <tr key={idx.valueOf()}>
                {CONLLU_ATTRS.map((key, idy) => (
                  <td key={`${idx.valueOf()}_${idy.valueOf()}`}>
                    <span
                      className={`${
                        key !== 'id' && key !== 'form' ? 'edit-value' : ''
                      }`}
                      onClick={() =>
                        handleClick(
                          token,
                          key,
                          `${idx.valueOf()}_${idy.valueOf()}`
                        )
                      }
                      ref={(ref) => {
                        targets.current[`${idx.valueOf()}_${idy.valueOf()}`] =
                          ref;
                      }}
                    >
                      {getTokenValue(token, key)
                        ? getTokenValue(token, key)
                        : 'empty'}
                    </span>
                  </td>
                ))}
                <td className="buttons">
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={() => {
                      setToken(token);
                      setOpenEdit(true);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faPlus}
                    onClick={() => {
                      setToken(token);
                      setOpenAdd(true);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => {
                      setToken(token);
                      setOpenRemove(true);
                    }}
                  />
                </td>
              </tr>
            ))}
        </tbody>

        {target !== null && token && (
          <Overlay
            target={target}
            show
            placement="bottom"
            onEntered={() => input.current?.focus()}
            rootClose
          >
            <Popover className="popover-token">
              <Popover.Body>
                {attribute !== 'upos' ? (
                  <input
                    type="text"
                    className="input-value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    ref={input}
                  />
                ) : (
                  <select
                    className="input-value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  >
                    <option></option>
                    {Object.keys(UdTagTypeNames).map((tag, idx) => (
                      <option value={tag}>{tag}</option>
                    ))}
                  </select>
                )}
                <div className="buttons">
                  <Button variant="danger" onClick={() => setTarget(null)}>
                    {t('header:popover.button.close')}
                  </Button>
                  <Button variant="success" onClick={handleConfirm}>
                    {t('header:popover.button.confirm')}
                  </Button>
                </div>
              </Popover.Body>
            </Popover>
          </Overlay>
        )}
        {conllu && token && (
          <UDSentenceTokenOperations
            conllu={conllu}
            setConllu={setConllu}
            token={token}
            openEdit={openEdit}
            openRemove={openRemove}
            openAdd={openAdd}
            onClose={() => {
              setToken(undefined);
              setOpenEdit(false);
              setOpenRemove(false);
              setOpenAdd(false);
            }}
          />
        )}
      </table>
    </div>
  );
}
