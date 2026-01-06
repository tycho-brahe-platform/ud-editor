import cx from 'classnames';
import './styles.scss';

export const IconWeights = ['regular', 'heavy'] as const;
type IconWeights = (typeof IconWeights)[number];

export const IconSizes = [
  'x-large',
  'large',
  'medium',
  'small',
  'x-small',
] as const;
type IconSizes = (typeof IconSizes)[number];

export type Props = JSX.IntrinsicElements['span'] & {
  name: string;
  className?: string;
  size?: IconSizes;
  weight?: IconWeights;
  filled?: boolean;
  disabled?: boolean;
};

export default function Icon({
  name,
  className = '',
  size,
  weight = 'regular',
  filled = false,
  disabled = false,
  title,
  onClick,
  onMouseDown,
  onMouseUp,
}: Props) {
  const getClassNames = cx(
    'ds-icon material-symbols-outlined',
    className,
    size,
    weight,
    {
      disabled: disabled,
    }
  );

  const style = {
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
  };

  return (
    <span
      className={getClassNames}
      style={style}
      onClick={(e) => onClick && onClick(e)}
      onMouseDown={(e) => onMouseDown && onMouseDown(e)}
      onMouseUp={(e) => onMouseUp && onMouseUp(e)}
      title={title}
      translate="no"
    >
      {name}
    </span>
  );
}
