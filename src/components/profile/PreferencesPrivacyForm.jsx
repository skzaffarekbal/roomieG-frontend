import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import { updatePreferencesApi, updatePrivacyApi } from '../../api/profileApi';

function PreferencesPrivacyForm({ user }) {
  const dispatch = useDispatch();

  const prefObj = typeof user?.preferences === 'object' && user?.preferences !== null ? user.preferences : {};
  const privObj = typeof user?.privacy === 'object' && user?.privacy !== null ? user.privacy : {};

  const [notifications, setNotifications] = useState(
    prefObj.notifications !== undefined ? Boolean(prefObj.notifications) : true,
  );
  const [showLocation, setShowLocation] = useState(
    typeof privObj.showLocation === 'string' ? privObj.showLocation : 'city_only',
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      setSaving(true);

      const [prefRes, privRes] = await Promise.all([
        updatePreferencesApi({ notifications: Boolean(notifications) }),
        updatePrivacyApi({ showLocation }),
      ]);

      if (privRes?.data || prefRes?.data) {
        dispatch(addUser(privRes?.data || prefRes?.data));
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          'Failed to save preferences & privacy',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className='space-y-5 text-base-content'>
      <div className='flex items-center justify-between border-b border-base-300 pb-2'>
        <div>
          <h3 className='font-bold text-lg'>Preferences & Privacy</h3>
          <p className='text-xs opacity-70'>Control your notifications and visibility settings.</p>
        </div>
        {success && (
          <span className='badge badge-success text-white badge-sm font-semibold animate-pulse'>
            Saved ✓
          </span>
        )}
      </div>

      <div className='space-y-5 bg-base-200/50 p-4 rounded-2xl border border-base-300'>
        {/* Notifications Toggle */}
        <div className='flex items-center justify-between gap-4'>
          <div>
            <div className='font-semibold text-sm'>Push & Sound Notifications</div>
            <div className='text-xs opacity-70'>
              Receive instant alerts on new match requests and chat messages.
            </div>
          </div>
          <input
            type='checkbox'
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className='toggle toggle-primary'
          />
        </div>

        <div className='divider my-1'></div>

        {/* Location Privacy Selection */}
        <div className='space-y-3'>
          <div>
            <div className='font-semibold text-sm'>Location Visibility</div>
            <div className='text-xs opacity-70'>
              Choose what location details are visible to other users on your profile & feed card.
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            {/* City Only */}
            <label
              className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                showLocation === 'city_only'
                  ? 'border-primary bg-primary/10 ring-1 ring-primary'
                  : 'border-base-300 bg-base-100 hover:border-base-content/20'
              }`}
            >
              <div className='flex items-center justify-between'>
                <span className='font-bold text-xs'>City Only 🏙️</span>
                <input
                  type='radio'
                  name='showLocation'
                  value='city_only'
                  checked={showLocation === 'city_only'}
                  onChange={(e) => setShowLocation(e.target.value)}
                  className='radio radio-primary radio-xs'
                />
              </div>
              <span className='text-[10px] opacity-70 mt-1.5 leading-relaxed'>
                Shows only your city (e.g. Bengaluru). Recommended.
              </span>
            </label>

            {/* Area & City */}
            <label
              className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                showLocation === 'area'
                  ? 'border-primary bg-primary/10 ring-1 ring-primary'
                  : 'border-base-300 bg-base-100 hover:border-base-content/20'
              }`}
            >
              <div className='flex items-center justify-between'>
                <span className='font-bold text-xs'>Area & City 📍</span>
                <input
                  type='radio'
                  name='showLocation'
                  value='area'
                  checked={showLocation === 'area'}
                  onChange={(e) => setShowLocation(e.target.value)}
                  className='radio radio-primary radio-xs'
                />
              </div>
              <span className='text-[10px] opacity-70 mt-1.5 leading-relaxed'>
                Shows area and city (e.g. Koramangala, Bengaluru).
              </span>
            </label>

            {/* Hidden */}
            <label
              className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                showLocation === 'hidden'
                  ? 'border-primary bg-primary/10 ring-1 ring-primary'
                  : 'border-base-300 bg-base-100 hover:border-base-content/20'
              }`}
            >
              <div className='flex items-center justify-between'>
                <span className='font-bold text-xs'>Hidden 🔒</span>
                <input
                  type='radio'
                  name='showLocation'
                  value='hidden'
                  checked={showLocation === 'hidden'}
                  onChange={(e) => setShowLocation(e.target.value)}
                  className='radio radio-primary radio-xs'
                />
              </div>
              <span className='text-[10px] opacity-70 mt-1.5 leading-relaxed'>
                Hides your location from public feed and discovery.
              </span>
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className='alert alert-error text-white text-xs rounded-xl p-2.5 shadow-xs'>
          <span>{error}</span>
        </div>
      )}

      <div className='pt-2 flex justify-end'>
        <button
          type='submit'
          disabled={saving}
          className='btn btn-primary btn-sm rounded-xl font-bold px-6 shadow-md shadow-primary/20'
        >
          {saving ? (
            <span className='loading loading-spinner loading-xs'></span>
          ) : (
            'Save Preferences'
          )}
        </button>
      </div>
    </form>
  );
}

export default PreferencesPrivacyForm;
