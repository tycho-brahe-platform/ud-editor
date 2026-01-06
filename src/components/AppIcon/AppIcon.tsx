export type Props = JSX.IntrinsicElements['span'] & {
  name: string;
  className?: string;
};

export default function Icon({
  name,
  className = '',
  title,
  onClick,
  ...rest
}: Props) {
  const getClassNames = `ds-icon material-symbols-outlined${
    className ? ` ${className}` : ''
  }`;

  const style = {
    fontVariationSettings: `'FILL 0 wght' 400, 'GRAD' 0, 'opsz' 24`,
  };

  return (
    <span
      className={getClassNames}
      style={style}
      title={title}
      translate="no"
      onClick={onClick}
      {...rest}
    >
      {name}
    </span>
  );
}
