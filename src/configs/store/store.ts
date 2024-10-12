import { EMPTY_TOAST } from '@/components/App/AppToast/ToastMessage';
import { UserStore } from './types';

const store: UserStore = {
  toastLoading: false,
  message: EMPTY_TOAST,
};

export default store;
