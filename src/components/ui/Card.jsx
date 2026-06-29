import { useRef } from 'react';
import './Card.css';

/**
 * Card component
 * Variants: default, glass, interactive
 */
export default function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      ref={cardRef}
      className={`card card--${variant} ${className}`} 
      onMouseMove={handleMouseMove}
      {...props}
    >
      {children}
    </div>
  );
}
