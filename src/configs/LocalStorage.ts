const SELECTED_LANGUAGE = '@Tycho:selectedLanguage';
const EXTENDED_UD_TAGS = '@Tycho:extendedUdTags';

function getSelectedLanguage() {
  return localStorage.getItem(SELECTED_LANGUAGE);
}

function setSelectedLanguage(language: string) {
  localStorage.setItem(SELECTED_LANGUAGE, language);
}

function getExtendedUdTags() {
  return localStorage.getItem(EXTENDED_UD_TAGS) || '';
}

function setExtendedUdTags(tags: string) {
  localStorage.setItem(EXTENDED_UD_TAGS, tags);
}

const Storage = {
  getSelectedLanguage,
  setSelectedLanguage,
  getExtendedUdTags,
  setExtendedUdTags,
};

export default Storage;
