import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../redux/feedSlice';
import { sendRequestApi } from '../api/requestApi';
import { calculateAge, formatLifestyleValue } from '../utils/profileHelpers';
import PremiumBadge from './PremiumBadge';

const UserCard = ({ user, isPreview = false }) => {
  const dispatch = useDispatch();
  const [isActing, setIsActing] = useState(false);

  if (!user) return null;

  const {
    _id,
    firstName,
    lastName,
    photo,
    age,
    dateOfBirth,
    gender,
    bio,
    occupation,
    location,
    lifestyle,
    housing,
    subscription,
  } = user;

  const computedAge =
    calculateAge(dateOfBirth) ?? (typeof age === 'number' || typeof age === 'string' ? age : null);
  const displayPhoto =
    photo?.exactPhoto ||
    photo?.blurPhoto ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
  const displayBio = bio || 'Looking for friendly, neat flatmates to share an apartment with.';

  const displayOccupation =
    typeof occupation === 'object' && occupation !== null
      ? [occupation.title, occupation.organization].filter(Boolean).join(' @ ') ||
        (occupation.type === 'employed'
          ? 'Employed'
          : occupation.type === 'student'
            ? 'Student'
            : occupation.type === 'self_employed'
              ? 'Self-Employed'
              : '')
      : '';

  const displayLocation =
    typeof location === 'object' && location !== null
      ? [location.area, location.city].filter(Boolean).join(', ') || location.city || ''
      : typeof location === 'string'
        ? location
        : '';

  const handleSendRequest = async (status, userId) => {
    if (isPreview) return;
    try {
      setIsActing(true);
      await sendRequestApi(status, userId);
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    } finally {
      setIsActing(false);
    }
  };

  // Safe formatted lifestyle chips
  const sleepStr = lifestyle ? formatLifestyleValue(lifestyle.sleepSchedule) : '';
  const foodStr = lifestyle ? formatLifestyleValue(lifestyle.foodPreference) : '';
  const workStr = lifestyle ? formatLifestyleValue(lifestyle.workMode, 'workMode') : '';
  const cleanStr = lifestyle ? formatLifestyleValue(lifestyle.cleanliness) : '';
  const petsStr = lifestyle ? formatLifestyleValue(lifestyle.pets) : '';
  const smokeStr = lifestyle ? formatLifestyleValue(lifestyle.smoking, 'smoking') : '';
  const drinkStr = lifestyle ? formatLifestyleValue(lifestyle.drinking, 'drinking') : '';
  const musicStr = lifestyle ? formatLifestyleValue(lifestyle.music, 'music') : '';
  const guestsStr = lifestyle ? formatLifestyleValue(lifestyle.guests, 'guests') : '';

  const hasAnyLifestyle = Boolean(
    sleepStr ||
    foodStr ||
    workStr ||
    cleanStr ||
    petsStr ||
    smokeStr ||
    drinkStr ||
    musicStr ||
    guestsStr,
  );

  return (
    <div className='card bg-base-100 border border-base-300 shadow-2xl rounded-3xl w-full max-w-sm overflow-hidden hover:shadow-primary/10 transition-all duration-300'>
      {/* Photo with Overlay */}
      <figure className='relative h-80 w-full bg-base-300 overflow-hidden'>
        <img
          className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
          src={displayPhoto}
          alt={`${firstName || 'User'} ${lastName || ''}`}
        />
        {/* Floating Premium Badge on top right */}
        {subscription && (
          <div className='absolute top-3 right-3 z-10'>
            <PremiumBadge subscription={subscription} size='xs' />
          </div>
        )}
        <div className='absolute bottom-0 inset-x-0 bg-linear-to-t from-black/85 via-black/40 to-transparent p-5 text-white'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5 flex-wrap min-w-0'>
              <h2 className='text-2xl font-black tracking-tight'>
                {firstName || 'First'} {lastName || 'Last'}{' '}
                {computedAge ? (
                  <span className='font-normal text-lg opacity-90'>• {computedAge}</span>
                ) : (
                  ''
                )}
              </h2>
            </div>
            {gender && (
              <span className='badge badge-sm badge-neutral capitalize font-semibold bg-white/20 text-white border-0'>
                {typeof gender === 'string' ? gender : ''}
              </span>
            )}
          </div>
          {displayOccupation && (
            <p className='text-xs opacity-90 font-medium mt-0.5'>
              {occupation.type === 'student' ? '🎓' : '💼'} {displayOccupation}
            </p>
          )}
          {displayLocation && <p className='text-[11px] opacity-80 mt-0.5'>📍 {displayLocation}</p>}
        </div>
      </figure>

      {/* Card Details */}
      <div className='card-body p-5 space-y-3.5 bg-base-100 text-base-content'>
        {/* Bio */}
        <div>
          <div className='text-[11px] font-bold uppercase tracking-wider opacity-60 mb-1'>Bio</div>
          <p className='text-xs sm:text-sm opacity-80 leading-relaxed line-clamp-3'>
            "{displayBio}"
          </p>
        </div>

        {/* Lifestyle Chips Preview if present */}
        {hasAnyLifestyle && (
          <div className='space-y-1.5 pt-1'>
            <div className='text-[10px] font-bold uppercase tracking-wider opacity-60'>
              Lifestyle & Habits
            </div>
            <div className='flex flex-wrap gap-1 text-[11px]'>
              {sleepStr && (
                <span className='badge badge-xs badge-soft badge-primary text-base-content'>
                  {sleepStr}
                </span>
              )}
              {foodStr && (
                <span className='badge badge-xs badge-soft badge-primary text-base-content'>
                  {foodStr}
                </span>
              )}
              {workStr && (
                <span className='badge badge-xs badge-soft badge-primary text-base-content'>
                  {workStr}
                </span>
              )}
              {cleanStr && (
                <span className='badge badge-xs badge-soft badge-primary text-base-content'>
                  Clean: {cleanStr}
                </span>
              )}
              {petsStr && (
                <span className='badge badge-xs badge-soft badge-primary text-base-content'>
                  {petsStr}
                </span>
              )}
              {smokeStr && (
                <span className='badge badge-xs badge-soft badge-primary text-base-content'>
                  {smokeStr}
                </span>
              )}
              {drinkStr && (
                <span className='badge badge-xs badge-soft badge-primary text-base-content'>
                  {drinkStr}
                </span>
              )}
              {musicStr && (
                <span className='badge badge-xs badge-soft badge-primary text-base-content'>
                  {musicStr}
                </span>
              )}
              {guestsStr && (
                <span className='badge badge-xs badge-soft badge-primary text-base-content'>
                  {guestsStr}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Housing details preview if present */}
        {housing && typeof housing === 'object' && (
          <div className='pt-1 flex items-center justify-between text-xs bg-base-200/70 p-2.5 rounded-xl'>
            <span className='opacity-70 capitalize'>
              {housing.roomType
                ? `${housing.roomType} room`
                : housing.status
                  ? housing.status.replace(/_/g, ' ')
                  : 'Room'}
            </span>
            <span className='font-bold text-primary'>
              {housing.budget?.max
                ? `₹${Number(housing.budget.min || 0).toLocaleString()} - ₹${Number(housing.budget.max).toLocaleString()}/mo`
                : housing.room?.rent
                  ? `₹${Number(housing.room.rent).toLocaleString()}/mo`
                  : typeof housing.budget === 'number'
                    ? `₹${Number(housing.budget).toLocaleString()}/mo`
                    : ''}
            </span>
          </div>
        )}

        {/* Action Buttons or Preview Indicator */}
        {isPreview ? (
          <div className='pt-2 border-t border-base-200 text-center'>
            <span className='badge badge-primary badge-outline text-xs font-semibold py-2 px-4'>
              Live Card Preview
            </span>
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-3 pt-2 border-t border-base-200'>
            <button
              className='btn btn-outline btn-error rounded-2xl font-bold flex items-center justify-center gap-1.5'
              disabled={isActing}
              onClick={() => handleSendRequest('ignored', _id)}
            >
              <span>✕</span> Pass
            </button>
            <button
              className='btn btn-primary rounded-2xl font-bold shadow-lg shadow-primary/25 flex items-center justify-center gap-1.5'
              disabled={isActing}
              onClick={() => handleSendRequest('interested', _id)}
            >
              <span>❤️</span> Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
