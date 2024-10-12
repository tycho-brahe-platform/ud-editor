const attachCloseToEscape = (handleClose: () => void) => {
  const closeOnEscape = (e: any) => {
    if (e.keyCode === 27) handleClose();
  };

  window.addEventListener('keydown', closeOnEscape);
  return () => window.removeEventListener('keydown', closeOnEscape);
};

const isMobile = (width: number, height: number) =>
  width <= 800 && height <= 600;

const UsabilityUtils = {
  attachCloseToEscape,
  isMobile,
};

export default UsabilityUtils;
