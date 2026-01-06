import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Popover } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './style.scss';

const languages = [
  { value: 'en', label: 'English', iso2: 'us' },
  { value: 'pt-BR', label: 'Português (Brasil)', iso2: 'br' },
];

function HeaderLanguages() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [language, setLanguage] = useState<any>();

  const changeLanguageHandler = (lang: any) => {
    setLanguage(lang);
    setOpen(false);
    i18n.changeLanguage(lang.value);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (
      i18n.language &&
      languages.filter((t) => t.value === i18n.language).length > 0
    ) {
      setLanguage(languages.filter((t) => t.value === i18n.language)[0]);
    } else {
      setLanguage(languages[0]);
    }
  }, []);

  return (
    <div className="language-container">
      <span
        className="language-selected"
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick(e as any);
          }
        }}
        role="button"
        tabIndex={0}
      >
        {language && (
          <>
            <ReactCountryFlag
              className="flag"
              countryCode={language.iso2}
              svg
            />
            <span className="name">{language.value.toUpperCase()}</span>
          </>
        )}
      </span>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        className="popover-language"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="list-languages">
          <ul>
            {languages.map((lang: any, idx: number) => (
              <li key={idx.valueOf()}>
                <span
                  onClick={() => changeLanguageHandler(lang)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      changeLanguageHandler(lang);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="d-flex align-items-center"
                >
                  <ReactCountryFlag
                    className="flag"
                    countryCode={lang.iso2}
                    svg
                  />
                  <span className="name">{lang.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Popover>
    </div>
  );
}

export default HeaderLanguages;
