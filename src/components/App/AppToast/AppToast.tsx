import { useContext, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EMPTY_TOAST } from './ToastMessage';
import AuthContext from '@/configs/AuthContext';
import { message } from '@/configs/store/actions';
import UsabilityUtils from '@/functions/UsabilityUtils';

function AppToast() {
  const { dispatch, state } = useContext(AuthContext);

  const handleClose = () => {
    toast.dismiss();
    dispatch(message(EMPTY_TOAST));
  };

  const handleClipboard = () => {
    navigator.clipboard.writeText(state.message.value);
  };

  const getLoading = () => (
    <div className="d-flex">
      <ReactLoading
        type="spinningBubbles"
        color="blue"
        height={24}
        width={24}
      />
      <span className="ms-3">Loading...</span>
    </div>
  );

  useEffect(() => {
    UsabilityUtils.attachCloseToEscape(handleClose);
  }, []);

  useEffect(() => {
    if (state.toastLoading) {
      toast(getLoading(), {
        position: 'top-right',
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'light',
      });
    } else {
      toast.dismiss();
    }
  }, [state.toastLoading]);

  useEffect(() => {
    if (state.message && state.message.value !== '') {
      switch (state.message.type) {
        case 'error':
          toast.error(state.message.value, {
            onClose: () => handleClose(),
            onClick: () => handleClipboard(),
          });
          break;
        case 'warning':
          toast.warning(state.message.value, {
            onClose: () => handleClose(),
          });
          break;
        case 'success':
          toast.success(state.message.value, {
            onClose: () => handleClose(),
          });
          break;
        default:
          toast(state.message.value, {
            onClose: () => handleClose(),
          });
          break;
      }
    } else {
      dispatch(message(EMPTY_TOAST));
    }
  }, [state.message]);

  return <ToastContainer closeOnClick />;
}

export default AppToast;
