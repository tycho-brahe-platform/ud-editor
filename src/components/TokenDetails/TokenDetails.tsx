import AppModal from '@/components/AppModal';
import AuthContext from '@/configs/AuthContext';
import Storage from '@/configs/LocalStorage';
import { ConlluToken } from '@/types/Conllu';
import { UdTag, UdTagTypeNames } from '@/types/UdTags';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './style.scss';

type TokenDetailsProps = {
  token: ConlluToken | null;
  tokenIndex: number;
  onClose: () => void;
  onTokenChange?: (updatedToken: ConlluToken) => void;
};

export default function TokenDetails({
  token,
  tokenIndex,
  onClose,
  onTokenChange,
}: TokenDetailsProps) {
  const { t } = useTranslation('app');
  const { state } = useContext(AuthContext);
  const [formData, setFormData] = useState<ConlluToken | null>(token);

  // Get extended tags from LocalStorage
  const extendedTags = useMemo(() => {
    return Storage.getExtendedUdTags();
  }, []);

  // Calculate TokenRange based on current form and all tokens
  const calculateTokenRange = useMemo(() => {
    if (!formData) return '';
    let start = 0;
    for (let i = 0; i < tokenIndex; i++) {
      if (state.conllu.tokens[i]?.form) {
        start += state.conllu.tokens[i].form.length;
      }
    }
    const end = start + (formData.form?.length || 0);
    return `${start}-${end}`;
  }, [formData?.form, tokenIndex, state.conllu.tokens]);

  // Parse MISC field to extract TokenRange and other fields
  const parseMisc = (
    misc: string
  ): { tokenRange: string; otherFields: string } => {
    if (!misc || misc === '_') return { tokenRange: '', otherFields: '' };

    const parts = misc.split('|');
    const tokenRangePart = parts.find((p) => p.startsWith('TokenRange='));
    const otherParts = parts.filter((p) => !p.startsWith('TokenRange='));

    return {
      tokenRange: tokenRangePart
        ? tokenRangePart.replace('TokenRange=', '')
        : '',
      otherFields: otherParts.join('|'),
    };
  };

  // Format MISC field from TokenRange and other fields
  const formatMisc = (tokenRange: string, otherFields: string): string => {
    const parts: string[] = [];
    if (tokenRange) {
      parts.push(`TokenRange=${tokenRange}`);
    }
    if (otherFields) {
      parts.push(otherFields);
    }
    return parts.length > 0 ? parts.join('|') : '_';
  };

  // Initialize form data when token changes
  useEffect(() => {
    if (token) {
      setFormData(token);
    }
  }, [token]);

  // Update MISC field with calculated TokenRange
  useEffect(() => {
    if (formData && calculateTokenRange) {
      setFormData((prev) => {
        if (!prev) return prev;
        const { otherFields } = parseMisc(prev.misc || '_');
        const updatedMisc = formatMisc(calculateTokenRange, otherFields);

        if (prev.misc !== updatedMisc) {
          return { ...prev, misc: updatedMisc };
        }
        return prev;
      });
    }
  }, [calculateTokenRange]);

  const handleFieldChange = (field: keyof ConlluToken, value: string) => {
    if (!formData) return;

    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // If MISC field changed manually, preserve it but recalculate TokenRange
    if (field === 'misc') {
      const { otherFields } = parseMisc(value);
      const updatedMisc = formatMisc(calculateTokenRange, otherFields);
      updated.misc = updatedMisc;
      setFormData(updated);
    }

    // Don't call onTokenChange here - only on confirm
  };

  const handleUPOSChange = (event: SelectChangeEvent<string>) => {
    handleFieldChange('upos', event.target.value);
  };

  const handleXPOSChange = (event: SelectChangeEvent<string>) => {
    handleFieldChange('xpos', event.target.value);
  };

  const handleMiscTokenRangeChange = (value: string) => {
    if (!formData) return;
    const { otherFields } = parseMisc(formData.misc || '_');
    const updatedMisc = formatMisc(value, otherFields);
    const updated = { ...formData, misc: updatedMisc };
    setFormData(updated);
    // Don't call onTokenChange here - only on confirm
  };

  const handleConfirm = () => {
    if (onTokenChange && formData) {
      onTokenChange(formData);
    }
    onClose();
  };

  if (!formData) {
    return null;
  }

  const { tokenRange } = parseMisc(formData.misc || '_');
  const udTags = Object.keys(UdTagTypeNames) as UdTag[];

  // Ensure current UPOS value is in the options
  const uposOptions = useMemo(() => {
    const options: string[] = [...udTags];
    const currentUpos = formData.upos;
    if (
      currentUpos &&
      currentUpos !== '' &&
      !udTags.includes(currentUpos as UdTag)
    ) {
      options.push(currentUpos);
    }
    return options;
  }, [formData.upos, udTags]);

  // Ensure current XPOS value is in the options
  const xposOptions = useMemo(() => {
    const tagList = extendedTags.split(',').filter((tag) => tag.trim() !== '');
    const currentXpos = formData.xpos;
    if (currentXpos && currentXpos !== '' && !tagList.includes(currentXpos)) {
      tagList.push(currentXpos);
    }
    return tagList;
  }, [formData.xpos, extendedTags]);

  return (
    <AppModal
      title={t('token.details.title')}
      close={onClose}
      confirm={handleConfirm}
    >
      <div className="token-details-modal">
        <form>
          <Box className="token-details-row">
            <TextField
              fullWidth
              className="token-details-field"
              label="ID"
              value={formData.id || ''}
              onChange={(e) => handleFieldChange('id', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              className="token-details-field"
              label="FORM"
              value={formData.form || ''}
              onChange={(e) => handleFieldChange('form', e.target.value)}
              margin="normal"
            />
          </Box>

          <Box className="token-details-row">
            <TextField
              fullWidth
              className="token-details-field"
              label="LEMMA"
              value={formData.lemma || ''}
              onChange={(e) => handleFieldChange('lemma', e.target.value)}
              margin="normal"
            />
            <FormControl
              fullWidth
              className="token-details-field"
              margin="normal"
            >
              <InputLabel id="upos-select-label">UPOS</InputLabel>
              <Select
                labelId="upos-select-label"
                id="upos-select"
                value={formData.upos || ''}
                label="UPOS"
                onChange={handleUPOSChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {uposOptions.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag} - {UdTagTypeNames[tag as UdTag] || tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box className="token-details-row">
            <FormControl
              fullWidth
              className="token-details-field"
              margin="normal"
            >
              <InputLabel id="xpos-select-label">XPOS</InputLabel>
              <Select
                labelId="xpos-select-label"
                id="xpos-select"
                value={formData.xpos || ''}
                label="XPOS"
                onChange={handleXPOSChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {xposOptions.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              className="token-details-field"
              label="FEATS"
              value={formData.feats || ''}
              onChange={(e) => handleFieldChange('feats', e.target.value)}
              margin="normal"
            />
          </Box>

          <Box className="token-details-row">
            <TextField
              fullWidth
              className="token-details-field"
              label="HEAD"
              value={formData.head || ''}
              onChange={(e) => handleFieldChange('head', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              className="token-details-field"
              label="DEPREL"
              value={formData.deprel || ''}
              onChange={(e) => handleFieldChange('deprel', e.target.value)}
              margin="normal"
            />
          </Box>

          <Box className="token-details-row">
            <TextField
              fullWidth
              className="token-details-field"
              label="DEPS"
              value={formData.deps || ''}
              onChange={(e) => handleFieldChange('deps', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              className="token-details-field"
              label={t('token.details.tokenRange.label')}
              value={tokenRange}
              onChange={(e) => handleMiscTokenRangeChange(e.target.value)}
              margin="normal"
              helperText={t('token.details.tokenRange.helperText')}
            />
          </Box>

          <TextField
            fullWidth
            className="token-details-field"
            label={t('token.details.misc.label')}
            value={formData.misc || ''}
            onChange={(e) => handleFieldChange('misc', e.target.value)}
            margin="normal"
          />
        </form>
      </div>
    </AppModal>
  );
}
