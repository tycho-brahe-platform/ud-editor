import logo from '@/assets/img/logo.png';
import { useState } from 'react';
import { useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './style.scss';

export default function NotFound() {
  const { t } = useTranslation('login');
  const error = useRouteError();
  const [show, setShow] = useState(false);

  const handleRedirect = () => {
    window.location.href = '/catalog';
  };

  return (
    <div className="box-container">
      <div className="box">
        <img src={logo} />
        <h1 className="title">{t('notfound.label.disclaimer')}</h1>
        <div
          className="disclaimer"
          onClick={handleRedirect}
          role="presentation"
        >
          {t('notfound.label.redirect')}
        </div>
        <div
          className="error-details"
          onClick={() => setShow((prevState) => !prevState)}
          role="presentation"
        >
          click here for error details
        </div>
      </div>
      {show && (
        <pre className="error-stack">{JSON.stringify(error, null, 2)}</pre>
      )}
    </div>
  );
}
