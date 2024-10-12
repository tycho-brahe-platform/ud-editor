import placeholder from '@/assets/img/placeholder-image.png';

const display = (url: string) => {
  if (url && url !== '') return url;
  return placeholder;
};

const getPlaceHolder = () => placeholder;

const ImageUtils = {
  display,
  getPlaceHolder,
};

export default ImageUtils;
