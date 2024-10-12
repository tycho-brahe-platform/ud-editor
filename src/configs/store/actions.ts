import ToastMessage from '@/components/App/AppToast/ToastMessage';
import { StoreAction, types } from './types';

export const message = (data: ToastMessage): StoreAction => ({
  type: types.MESSAGE,
  payload: data,
});

export const toastLoading = (data: boolean): StoreAction => ({
  type: types.TOAST_LOADING,
  payload: data,
});
