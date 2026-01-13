import AuthContext from '@/configs/AuthContext';
import {
  conllu,
  setSelectedIndex,
  updateSentenceStatus,
} from '@/configs/store/actions';
import SentenceItem, { getStatusColor } from '@/types/SentenceItem';
import { Button, IconButton } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
import './style.scss';

type Props = {
  onSentenceSelect?: () => void;
};

export default function SentenceNavigation({ onSentenceSelect }: Props) {
  const { t } = useTranslation('file');
  const { state, dispatch } = useContext(AuthContext);
  const { sentences, selectedIndex } = state;

  if (
    sentences.length === 0 ||
    selectedIndex < 0 ||
    selectedIndex >= sentences.length
  ) {
    return null;
  }

  const currentSentence = sentences[selectedIndex];

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const prevSentence = sentences[selectedIndex - 1];
      dispatch(setSelectedIndex(selectedIndex - 1));
      dispatch(conllu(prevSentence.conllu));
      if (onSentenceSelect) {
        onSentenceSelect();
      }
    }
  };

  const handleNext = () => {
    if (selectedIndex < sentences.length - 1) {
      const nextSentence = sentences[selectedIndex + 1];
      dispatch(setSelectedIndex(selectedIndex + 1));
      dispatch(conllu(nextSentence.conllu));
      if (onSentenceSelect) {
        onSentenceSelect();
      }
    }
  };

  const handleStatusToggle = () => {
    const newStatus =
      currentSentence.textStatus.toLowerCase() === 'done' ? 'review' : 'done';
    dispatch(updateSentenceStatus(selectedIndex, newStatus));
  };

  const statusColor = getStatusColor(currentSentence.textStatus);

  return (
    <div className="sentence-navigation">
      <Button
        variant="contained"
        onClick={handleStatusToggle}
        className="status-button"
        style={{
          backgroundColor: statusColor,
          color: '#ffffff',
        }}
        sx={{
          '&:hover': {
            backgroundColor: statusColor,
            opacity: 0.9,
          },
        }}
      >
        {t(`sentence.status.${currentSentence.textStatus}`)}
      </Button>
      <IconButton
        onClick={handlePrevious}
        disabled={selectedIndex === 0}
        size="small"
        title={t('sentence.navigation.previous')}
      >
        <Icon name="chevron_left" />
      </IconButton>
      <span className="sentence-counter">
        {selectedIndex + 1} / {sentences.length}
      </span>
      <IconButton
        onClick={handleNext}
        disabled={selectedIndex === sentences.length - 1}
        size="small"
        title={t('sentence.navigation.next')}
      >
        <Icon name="chevron_right" />
      </IconButton>
    </div>
  );
}
