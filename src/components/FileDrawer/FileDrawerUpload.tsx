import AuthContext from '@/configs/AuthContext';
import {
  setSentences,
  setSelectedIndex,
  setFilename,
} from '@/configs/store/actions';
import ConlluUtils from '@/converter/ConlluUtils';
import SentenceItem from '@/types/SentenceItem';
import { Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
import './style.scss';

export default function FileDrawerUpload() {
  const { t } = useTranslation(['app', 'file']);
  const { dispatch } = useContext(AuthContext);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const parsedSentences = ConlluUtils.parseMultipleSentences(content);
        const sentenceItems: SentenceItem[] = parsedSentences.map(
          (sentence, index) => ({
            conllu: sentence,
            text: ConlluUtils.getSentenceText(sentence),
            textStatus: sentence.attributes.text_status || 'review',
            index,
          })
        );
        dispatch(setSentences(sentenceItems));
        dispatch(setSelectedIndex(-1));
        dispatch(setFilename(file.name));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="file-upload-container">
      <input
        accept=".conllu,.txt"
        style={{ display: 'none' }}
        id="file-upload-input"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="file-upload-input">
        <div className="upload-button">
          <Icon name="upload_file" />
          <Typography variant="body1" sx={{ mt: 1 }}>
            {t('file:drawer.upload.label')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('file:drawer.upload.hint')}
          </Typography>
        </div>
      </label>
    </div>
  );
}
