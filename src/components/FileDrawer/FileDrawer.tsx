import AuthContext from '@/configs/AuthContext';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
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
  const { state } = useContext(AuthContext);
  const { sentences } = state;

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
          <FileDrawerSentences
            onSentenceSelect={onSentenceSelect}
            onClose={onClose}
          />
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
    </Drawer>
  );
}
