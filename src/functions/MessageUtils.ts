import ToastMessage from '@/components/App/AppToast/ToastMessage';

const getError = (err: any, t: any): ToastMessage => {
  if (!err.response) return { value: err, type: 'error' };
  if (err.response.status && err.response.status === 500) {
    return {
      value: t('error.access.authorization'),
      type: 'error',
    };
  }

  let errorKey = 'message:error.generic';
  if (err.response.data && err.response.data.description)
    errorKey = err.response.data.description;

  if (err.response.data.errors && err.response.data.errors.length > 0)
    errorKey = err.response.data.errors[0].description;

  return { value: t(`message:${errorKey}`), type: 'error' };
};

const getErrorMessage = (err: string, t: any): ToastMessage => {
  return { value: t(err), type: 'error' };
};

const getSuccessMessage = (msg: string, t: any): ToastMessage => {
  return { value: t(msg), type: 'success' };
};

const MessageUtils = {
  getError,
  getErrorMessage,
  getSuccessMessage,
};

export default MessageUtils;
