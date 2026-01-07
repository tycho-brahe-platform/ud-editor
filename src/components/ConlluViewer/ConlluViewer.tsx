import AuthContext from '@/configs/AuthContext';
import { ConlluToken, conlluAttributes } from '@/types/Conllu';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TokenDetails from '../TokenDetails';
import './style.scss';

export default function ConlluViewer() {
  const { t } = useTranslation('app');
  const { state } = useContext(AuthContext);

  const [token, setToken] = useState<ConlluToken | null>(null);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(-1);
  const [openEdit, setOpenEdit] = useState(false);

  const getTokenValue = (token: ConlluToken, key: string) => {
    const value = token[key.toLowerCase() as keyof ConlluToken];
    return value !== '_' ? value : undefined;
  };

  const handleRowClick = (token: ConlluToken, index: number) => {
    setToken(token);
    setSelectedTokenIndex(index);
    setOpenEdit(true);
  };

  const handleCloseTokenModal = () => {
    setOpenEdit(false);
    setToken(null);
    setSelectedTokenIndex(-1);
  };

  return (
    <>
      <table className="table-conllu-viewer">
        <thead>
          <tr>
            {conlluAttributes.map((key, idx) => (
              <th key={idx.valueOf()}>{key.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.conllu.tokens.map((token, idx) => (
            <tr
              key={idx.valueOf()}
              onClick={() => handleRowClick(token, idx)}
              className="table-row"
            >
              {conlluAttributes.map((key, idy) => (
                <td key={`${idx.valueOf()}_${idy.valueOf()}`}>
                  <span>
                    {getTokenValue(token, key)
                      ? getTokenValue(token, key)
                      : t('label.empty')}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {openEdit && token && (
        <TokenDetails
          token={token}
          tokenIndex={selectedTokenIndex}
          onClose={handleCloseTokenModal}
        />
      )}
    </>
  );
}
