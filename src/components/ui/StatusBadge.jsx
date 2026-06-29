import './StatusBadge.css';

/**
 * Status indicator badge.
 * Variants: safe, warn, danger, info
 */
export default function StatusBadge({ status = 'info', children }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" />
      {children}
    </span>
  );
}
