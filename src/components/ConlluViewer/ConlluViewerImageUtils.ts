import { saveAs } from 'file-saver';

export const generateImageFromSVG = (svgElement: SVGSVGElement): void => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Unable to get canvas context');
  }

  const { width, height } = svgElement.getBBox();
  canvas.width = width;
  canvas.height = height;

  // Convert SVG element to data URL
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.crossOrigin = 'anonymous'; // handle cross-origin issues

  img.onload = async () => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);

    // Convert canvas to JPEG blob
    canvas.toBlob(
      (blob) => {
        if (blob === null) return;
        saveAs(blob, 'conllu.jpg');
      },
      'image/jpeg',
      1.0
    );
  };

  img.src = url;
};
