import "./style.scss";

type PictureProps = {
  url: string;
  className?: string;
  confirm?: () => void;
};

function AppImage({ url, className, confirm }: PictureProps) {
  return (
    <figure className={className}>
      {url ? (
        <img src={url} className={className} referrerPolicy="no-referrer" />
      ) : (
        <form id="mydropzone" className="dropzone dz-clickable tgo-upload" />
      )}
    </figure>
  );
}

export default AppImage;
