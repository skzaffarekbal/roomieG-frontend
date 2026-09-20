/**
 * EmailVerificationBadge Component
 * Renders verified / unverified status badge with an interactive tooltip.
 */
function EmailVerificationBadge({
  isVerified = false,
  email = '',
  size = 'sm',
  showIconOnly = false,
  className = '',
  showTooltip = true,
}) {
  const verified = Boolean(isVerified);

  const tooltipText = verified
    ? `Email is verified`
    : size === 'xs'
      ? 'Email not verified'
      : `Please check your registered email (${email || 'inbox'}) to verify your account`;

  // Size styling map
  const sizeClasses = {
    xs: 'badge-xs text-[10px] py-0.5 px-2 gap-1',
    sm: 'badge-sm text-xs py-1 px-2.5 gap-1.5',
    md: 'badge-md text-sm py-1.5 px-3.5 gap-2',
  };

  const badgeSize = sizeClasses[size] || sizeClasses.sm;

  if (verified) {
    return (
      <div
        className={`tooltip tooltip-bottom sm:tooltip-top inline-flex items-center`}
        data-tip={showTooltip ? tooltipText : ''}
      >
        <span
          className={`badge badge-success text-white font-bold border-0 shadow-xs inline-flex items-center select-none cursor-default transition-transform duration-200 hover:scale-105 ${badgeSize} ${className}`}
          aria-label='Email Verified'
        >
          {/* Verified Shield / Checkmark SVG */}
          <svg
            className={`${size === 'xs' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} shrink-0 fill-current`}
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
          {!showIconOnly && <span>Verified</span>}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`tooltip tooltip-bottom sm:tooltip-top tooltip-warning inline-flex items-center`}
      data-tip={showTooltip ? tooltipText : ''}
    >
      <span
        className={`badge badge-warning text-warning-content font-bold border-0 shadow-xs inline-flex items-center select-none cursor-help transition-transform duration-200 hover:scale-105 ${badgeSize} ${className}`}
        aria-label='Email Not Verified'
      >
        {/* Warning / Mail Alert SVG */}
        <svg
          className={`${size === 'xs' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} shrink-0 fill-current animate-pulse`}
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
          <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
        </svg>
        {!showIconOnly && <span>Not Verified</span>}
      </span>
    </div>
  );
}

export default EmailVerificationBadge;
