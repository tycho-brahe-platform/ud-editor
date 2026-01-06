import { Conllu, CONLLU_ATTRS, ConlluToken } from '@/types/model/Conllu';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './style.scss';

type Props = {
  conllu: Conllu;
  setConllu: (s: Conllu) => void;
};

export default function ConlluViewer({ conllu, setConllu }: Props) {
  const { t } = useTranslation(['ud', 'header']);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const targets = useRef<Record<string, HTMLElement | null>>({});
  const [attribute, setAttribute] = useState('');
  const [token, setToken] = useState<ConlluToken>();
  const [value, setValue] = useState<string>();

  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const handleClick = (token: ConlluToken, attr: string, idx: string) => {
    if (attr === 'id') return;
    document.body.click();
    setTarget(targets.current[idx]);
    setToken(token);
    setValue(getTokenValue(token, attr));
    setAttribute(attr);
  };

  const getTokenValue = (token: ConlluToken, key: string) => {
    const value = token[key.toLowerCase() as keyof ConlluToken];
    return value !== '_' ? value : undefined;
  };

  const handleRowClick = (token: ConlluToken) => {
    setToken(token);
    setOpenEdit(true);
  };

  return (
    <table className="table-conllu-viewer">
      <thead>
        <tr>
          {CONLLU_ATTRS.map((key, idx) => (
            <th key={idx.valueOf()}>{key.toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {conllu &&
          conllu.tokens &&
          conllu.tokens.map((token, idx) => (
            <tr
              key={idx.valueOf()}
              onClick={() => handleRowClick(token)}
              className="table-row"
            >
              {CONLLU_ATTRS.map((key, idy) => (
                <td key={`${idx.valueOf()}_${idy.valueOf()}`}>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(
                        token,
                        key,
                        `${idx.valueOf()}_${idy.valueOf()}`
                      );
                    }}
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
            </tr>
          ))}
      </tbody>
    </table>
  );
}
