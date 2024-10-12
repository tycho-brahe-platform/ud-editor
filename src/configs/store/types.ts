import ToastMessage from '@/components/App/AppToast/ToastMessage';

export type UserStore = {
  toastLoading: boolean;
  message: ToastMessage;
};

export type StoreAction = {
  type: string;
  payload?: boolean | ToastMessage;
};

export const types = {
  MESSAGE: 'MESSAGE',
  TOAST_LOADING: 'TOAST_LOADING',
};
