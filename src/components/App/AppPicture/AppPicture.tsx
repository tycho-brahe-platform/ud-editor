import ImageUtils from "@/functions/ImageUtils";
import { useTranslation } from "react-i18next";
import "./style.scss";

type PictureProps = {
  src: string;
  className?: string;
  onClick?: () => void;
};

function AppPicture({ src, className, onClick }: PictureProps) {
  const { t } = useTranslation("header");
  return (
    <div className="app-picture-container">
      <img
        className={`${className} ${src ? "" : "picture-placeholder"}`}
        src={ImageUtils.display(src)}
        onClick={onClick}
        role="presentation"
        onError={({ currentTarget }) => {
          /* eslint-disable no-param-reassign */
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = ImageUtils.getPlaceHolder();
          /* eslint-enable no-param-reassign */
          console.log(src);
        }}
      />
      {!src && (
        <span className="placeholder-message">
          {t("picture.placeholder.message")}
        </span>
      )}
    </div>
  );
}

export default AppPicture;
