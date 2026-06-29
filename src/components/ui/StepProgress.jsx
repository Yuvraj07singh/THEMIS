import './StepProgress.css';

/**
 * Horizontal step progress indicator.
 * Used in the Co-Founder Wizard and multi-step forms.
 *
 * @param {number} currentStep - 0-indexed current step
 * @param {string[]} steps - Array of step labels
 */
export default function StepProgress({ currentStep = 0, steps = [] }) {
  return (
    <div className="step-progress" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={steps.length}>
      {steps.map((label, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div
            key={index}
            className={`step-progress__item ${
              isComplete ? 'step-progress__item--complete' : ''
            } ${isCurrent ? 'step-progress__item--current' : ''}`}
          >
            <div className="step-progress__indicator">
              {isComplete ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 7L5.5 10L11.5 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className="step-progress__label">{label}</span>
            {index < steps.length - 1 && (
              <div
                className={`step-progress__connector ${
                  isComplete ? 'step-progress__connector--filled' : ''
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
