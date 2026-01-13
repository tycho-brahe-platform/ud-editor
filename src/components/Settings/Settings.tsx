import AppModal from '@/components/AppModal';
import Storage from '@/configs/LocalStorage';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './style.scss';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
];

type Props = {
  onClose: () => void;
};

export default function Settings({ onClose }: Props) {
  const { t, i18n } = useTranslation('app');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [extendedUdTags, setExtendedUdTags] = useState<string>('');

  useEffect(() => {
    // Initialize language from localStorage or i18n
    const savedLanguage = Storage.getSelectedLanguage();
    const currentLang =
      savedLanguage ||
      languages.find((lang) => lang.value === i18n.language)?.value ||
      languages[0].value;
    setSelectedLanguage(currentLang);

    // If saved language differs from i18n, update i18n
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }

    // Load extended UD tags from localStorage
    const savedTags = Storage.getExtendedUdTags();
    if (savedTags) {
      setExtendedUdTags(savedTags);
    }
  }, [i18n]);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    Storage.setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleExtendedUdTagsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setExtendedUdTags(value);
    Storage.setExtendedUdTags(value);
  };

  return (
    <AppModal
      title={t('settings.title')}
      close={onClose}
      confirm={onClose}
      className="settings-modal"
    >
      <div className="settings-content">
        <FormControl fullWidth className="settings-field">
          <InputLabel id="language-select-label">
            {t('settings.language.label')}
          </InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={selectedLanguage}
            label={t('settings.language.label')}
            onChange={handleLanguageChange}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          className="settings-field"
          id="extended-ud-tags"
          label={t('settings.extendedUdTags.label')}
          placeholder={t('settings.extendedUdTags.placeholder')}
          multiline
          rows={6}
          value={extendedUdTags}
          onChange={handleExtendedUdTagsChange}
          helperText={t('settings.extendedUdTags.helperText')}
          sx={{
            '& .MuiInputBase-input': {
              padding: 0,
            },
          }}
        />
      </div>
    </AppModal>
  );
}
