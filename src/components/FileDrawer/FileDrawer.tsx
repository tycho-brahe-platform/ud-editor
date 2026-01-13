import AuthContext from '@/configs/AuthContext';
import {
  setFilename,
  setSelectedIndex,
  setSentences,
} from '@/configs/store/actions';
import ConlluUtils from '@/converter/ConlluUtils';
import { Box, Button, Drawer, IconButton, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
import AppModal from '../AppModal';
import FileDrawerSentences from './FileDrawerSentences';
import FileDrawerUpload from './FileDrawerUpload';
import './style.scss';

type FileDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSentenceSelect?: () => void;
};

export default function FileDrawer({
  open,
  onClose,
  onSentenceSelect,
}: FileDrawerProps) {
  const { t } = useTranslation(['app', 'file']);
  const { state, dispatch } = useContext(AuthContext);
  const { sentences, filename } = state;
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);

  const handleDownload = () => {
    if (sentences.length === 0) return;

    // Convert all sentences to conllu format and join with double newlines
    const conlluContent = sentences
      .map((sentence) => ConlluUtils.convertToConllu(sentence.conllu))
      .filter((content) => content.trim() !== '')
      .join('\n\n');

    if (!conlluContent) return;

    // Create a blob and download
    const blob = new Blob([conlluContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Use filename with "_rev" suffix if available, otherwise default name
    let downloadFilename = 'conllu_file_rev.conllu';
    if (filename) {
      const lastDotIndex = filename.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        const nameWithoutExt = filename.substring(0, lastDotIndex);
        const ext = filename.substring(lastDotIndex);
        downloadFilename = `${nameWithoutExt}_rev${ext}`;
      } else {
        downloadFilename = `${filename}_rev.conllu`;
      }
    }

    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleNewUploadClick = () => {
    setShowUploadConfirm(true);
  };

  const handleConfirmNewUpload = () => {
    setShowUploadConfirm(false);
    dispatch(setSentences([]));
    dispatch(setSelectedIndex(-1));
    dispatch(setFilename(null));
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose} className="file-drawer">
      <Box className="file-drawer-content">
        <div className="file-drawer-header">
          <Typography variant="h6" component="div">
            {t('file:drawer.title')}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Icon name="close" />
          </IconButton>
        </div>

        {sentences.length > 0 && (
          <>
            <div className="file-drawer-actions">
              <Button
                variant="contained"
                color="primary"
                startIcon={<Icon name="download" />}
                onClick={handleDownload}
              >
                {t('file:drawer.download')}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Icon name="upload_file" />}
                onClick={handleNewUploadClick}
              >
                {t('file:drawer.upload.new')}
              </Button>
            </div>
            <FileDrawerSentences
              onSentenceSelect={onSentenceSelect}
              onClose={onClose}
            />
          </>
        )}

        {sentences.length === 0 && (
          <>
            <FileDrawerUpload />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('file:drawer.empty')}
              </Typography>
            </Box>
          </>
        )}
      </Box>
      {showUploadConfirm && (
        <AppModal
          title={t('file:drawer.upload.confirm.title')}
          close={() => setShowUploadConfirm(false)}
          confirm={handleConfirmNewUpload}
        >
          <Typography variant="body1">
            {t('file:drawer.upload.confirm.message')}
          </Typography>
        </AppModal>
      )}
    </Drawer>
  );
}
