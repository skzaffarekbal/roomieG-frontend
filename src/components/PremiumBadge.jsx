import { getSubscriptionInfo } from '../utils/profileHelpers';

/**
 * PremiumBadge Component
 * Renders verified Gold / Silver member badges based on user's subscription plan.
 */
function PremiumBadge({
  subscription,
  plan: explicitPlan,
  size = 'sm',
  showDays = false,
  className = '',
}) {
  const info = getSubscriptionInfo(subscription);
  const isPremium = explicitPlan ? explicitPlan !== 'free' : info.isPremium;
  const plan = explicitPlan || info.plan;
  const { daysLeft, isExpiringSoon } = info;

  if (!isPremium || plan === 'free') {
    return null;
  }

  const isGold = plan === 'gold';

  // Size styling map
  const sizeClasses = {
    xs: 'text-[10px] py-0.5 px-2 gap-1',
    sm: 'text-xs py-1 px-2.5 gap-1.5',
    md: 'text-sm py-1.5 px-3 gap-1.5',
    lg: 'text-base py-2 px-4 gap-2',
  };

  const badgeSize = sizeClasses[size] || sizeClasses.sm;

  if (isGold) {
    return (
      <span
        className={`inline-flex items-center font-extrabold tracking-wide rounded-full shadow-sm bg-linear-to-r from-amber-400 via-yellow-500 to-amber-600 text-white shadow-amber-500/25 ${badgeSize} ${className}`}
        title={`VIP Gold Member${showDays && daysLeft ? ` • ${daysLeft} days left` : ''}`}
      >
        <span className='leading-none'>👑</span>
        <span>VIP Gold</span>
        {showDays && (
          <span className='text-[10px] font-semibold opacity-90 border-l border-white/30 pl-1 ml-0.5'>
            {isExpiringSoon ? 'Expiring Soon' : `${daysLeft}d`}
          </span>
        )}
      </span>
    );
  }

  // Silver Plan
  return (
    <span
      className={`inline-flex items-center font-bold tracking-wide rounded-full shadow-sm bg-linear-to-r from-slate-400 via-slate-500 to-zinc-600 text-white shadow-slate-500/25 ${badgeSize} ${className}`}
      title={`Silver Member${showDays && daysLeft ? ` • ${daysLeft} days left` : ''}`}
    >
      <span className='leading-none'>🪙</span>
      <span>Silver</span>
      {showDays && (
        <span className='text-[10px] font-semibold opacity-90 border-l border-white/30 pl-1 ml-0.5'>
          {isExpiringSoon ? 'Expiring Soon' : `${daysLeft}d`}
        </span>
      )}
    </span>
  );
}

export default PremiumBadge;
