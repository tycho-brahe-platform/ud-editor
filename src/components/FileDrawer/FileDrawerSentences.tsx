import AuthContext from '@/configs/AuthContext';
import { conllu, setSelectedIndex } from '@/configs/store/actions';
import SentenceItem, { getStatusColor } from '@/types/SentenceItem';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './style.scss';

type Props = {
  onSentenceSelect?: () => void;
  onClose: () => void;
};

export default function FileDrawerSentences({
  onSentenceSelect,
  onClose,
}: Props) {
  const { t } = useTranslation('file');
  const { state, dispatch } = useContext(AuthContext);
  const { sentences, selectedIndex } = state;

  const handleSentenceClick = (sentenceItem: SentenceItem) => {
    dispatch(setSelectedIndex(sentenceItem.index));
    dispatch(conllu(sentenceItem.conllu));
    if (onSentenceSelect) {
      onSentenceSelect();
    }
    onClose();
  };

  return (
    <div className="file-sentences-container">
      <div className="sentence-title">
        {t('drawer.sentences.title', { count: sentences.length })}
      </div>
      <div className="sentence-list">
        {sentences.map((sentenceItem) => (
          <div
            key={sentenceItem.index}
            className={`sentence-item ${
              selectedIndex === sentenceItem.index ? 'selected' : ''
            }`}
            onClick={() => handleSentenceClick(sentenceItem)}
          >
            <div className="sentence-content">
              <div className="sentence-text">{sentenceItem.text}</div>
              <div className="sentence-status">
                <span
                  className="status-dot"
                  style={{
                    backgroundColor: getStatusColor(sentenceItem.textStatus),
                  }}
                />
                <span className="status-text">
                  {t(`sentence.status.${sentenceItem.textStatus}`)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
