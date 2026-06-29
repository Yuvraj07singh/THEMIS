import './Button.css';

/**
 * Button component
 * Variants: primary (gold fill), secondary (gold outline), ghost (text only)
 * Sizes: sm, md, lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Component = 'button',
  className = '',
  ...props
}) {
  return (
    <Component
      className={`btn btn--${variant} btn--${size} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
