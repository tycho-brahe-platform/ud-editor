import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

const languages = [
  { value: 'en', label: 'English', iso2: 'us' },
  { value: 'pt-BR', label: 'Português (Brasil)', iso2: 'br' },
];

function HeaderLanguages() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<any>();

  const changeLanguageHandler = (lang: any) => {
    setLanguage(lang);
    setOpen(false);
    i18n.changeLanguage(lang.value);
    document.body.click();
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

  const popover = (
    <Popover className="popover-language">
      <Popover.Body className="list-languages">
        <ul>
          {languages.map((lang: any, idx: number) => (
            <li key={idx.valueOf()}>
              <span
                onClick={() => changeLanguageHandler(lang)}
                onKeyDown={() => changeLanguageHandler(lang)}
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
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="language-container">
      <OverlayTrigger
        placement="bottom"
        trigger="click"
        overlay={popover}
        rootClose
      >
        <span
          className="language-selected"
          onClick={() => setOpen(!open)}
          onKeyDown={() => setOpen(!open)}
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
      </OverlayTrigger>
    </div>
  );
}

export default HeaderLanguages;
