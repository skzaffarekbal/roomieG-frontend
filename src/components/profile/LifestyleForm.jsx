import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import { updateLifestyleApi } from '../../api/profileApi';

function LifestyleForm({ user, onUpdateLivePreview }) {
  const dispatch = useDispatch();

  const lifeObj =
    typeof user?.lifestyle === 'object' && user?.lifestyle !== null ? user.lifestyle : {};

  // Form states mapping directly to user model
  const [smoking, setSmoking] = useState(lifeObj.smoking || '');
  const [drinking, setDrinking] = useState(lifeObj.drinking || '');
  const [foodPreference, setFoodPreference] = useState(lifeObj.foodPreference || '');
  const [sleepSchedule, setSleepSchedule] = useState(lifeObj.sleepSchedule || '');
  const [cleanliness, setCleanliness] = useState(
    typeof lifeObj.cleanliness === 'number' ? lifeObj.cleanliness : '',
  );
  const [workMode, setWorkMode] = useState(lifeObj.workMode || '');
  const [guests, setGuests] = useState(lifeObj.guests || '');
  const [music, setMusic] = useState(lifeObj.music || '');
  const [cooking, setCooking] = useState(
    typeof lifeObj.cooking === 'boolean' ? lifeObj.cooking : false,
  );

  // Pets sub-document: { hasPets: Boolean, petFriendly: Boolean }
  const [hasPets, setHasPets] = useState(Boolean(lifeObj.pets?.hasPets));
  const [petFriendly, setPetFriendly] = useState(
    lifeObj.pets?.petFriendly !== undefined ? Boolean(lifeObj.pets?.petFriendly) : true,
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const triggerLivePreview = (overrides = {}) => {
    if (!onUpdateLivePreview) return;
    const currentLifestyle = {
      smoking,
      drinking,
      foodPreference,
      sleepSchedule,
      cleanliness: cleanliness !== '' ? Number(cleanliness) : undefined,
      workMode,
      guests,
      music,
      cooking,
      pets: {
        hasPets,
        petFriendly,
      },
      ...overrides,
    };
    onUpdateLivePreview({ lifestyle: currentLifestyle });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setSaving(true);
      const payload = {
        smoking: smoking || undefined,
        drinking: drinking || undefined,
        foodPreference: foodPreference || undefined,
        sleepSchedule: sleepSchedule || undefined,
        cleanliness: cleanliness !== '' ? Number(cleanliness) : undefined,
        workMode: workMode || undefined,
        guests: guests || undefined,
        music: music || undefined,
        cooking: Boolean(cooking),
        pets: {
          hasPets: Boolean(hasPets),
          petFriendly: Boolean(petFriendly),
        },
      };

      const res = await updateLifestyleApi(payload);
      if (res?.data) {
        dispatch(addUser(res.data));
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.response?.data?.message || 'Failed to save lifestyle',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className='space-y-5 text-base-content'>
      <div className='flex items-center justify-between border-b border-base-300 pb-2'>
        <div>
          <h3 className='font-bold text-lg'>Lifestyle & Living Habits</h3>
          <p className='text-xs opacity-70'>
            RoomieG matches roommates based on these daily living habits.
          </p>
        </div>
        {success && (
          <span className='badge badge-success text-white badge-sm font-semibold animate-pulse'>
            Saved ✓
          </span>
        )}
      </div>

      {/* Row 1: Routine & Food */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Sleep Schedule</label>
          <select
            value={sleepSchedule}
            onChange={(e) => {
              const val = e.target.value;
              setSleepSchedule(val);
              triggerLivePreview({ sleepSchedule: val });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value=''>Select Routine</option>
            <option value='early_bird'>Early Bird (10 PM - 5 AM) 🌅</option>
            <option value='normal'>Normal (12 AM - 7 AM) ⏰</option>
            <option value='night_owl'>Night Owl (2 AM - 10 AM) 🦉</option>
          </select>
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Food Preference</label>
          <select
            value={foodPreference}
            onChange={(e) => {
              const val = e.target.value;
              setFoodPreference(val);
              triggerLivePreview({ foodPreference: val });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value=''>Select Food Preference</option>
            <option value='vegetarian'>Vegetarian 🥗</option>
            <option value='non_vegetarian'>Non-Vegetarian 🍗</option>
            <option value='eggetarian'>Eggetarian 🍳</option>
            <option value='vegan'>Vegan 🌱</option>
            <option value='flexible'>Flexible / Any 🍲</option>
          </select>
        </div>
      </div>

      {/* Row 2: Cleanliness & Work Mode */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Cleanliness Standard (1 to 5)</label>
          <select
            value={cleanliness}
            onChange={(e) => {
              const val = e.target.value;
              setCleanliness(val);
              triggerLivePreview({ cleanliness: val !== '' ? Number(val) : undefined });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value=''>Select Standard</option>
            <option value='5'>5/5 - Spotless & Super Organized ✨</option>
            <option value='4'>4/5 - Clean & Tidy 🧹</option>
            <option value='3'>3/5 - Moderate / Average 🧽</option>
            <option value='2'>2/5 - Relaxed / Casual 🛋️</option>
            <option value='1'>1/5 - Low Maintenance 📦</option>
          </select>
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Work Mode</label>
          <select
            value={workMode}
            onChange={(e) => {
              const val = e.target.value;
              setWorkMode(val);
              triggerLivePreview({ workMode: val });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value=''>Select Work Mode</option>
            <option value='office'>Work From Office (WFO) 🏢</option>
            <option value='remote'>Work From Home (WFH) 💻</option>
            <option value='hybrid'>Hybrid 🔀</option>
            <option value='student'>Student 🎓</option>
          </select>
        </div>
      </div>

      {/* Row 3: Smoking, Drinking, Guests, Music */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Smoking</label>
          <select
            value={smoking}
            onChange={(e) => {
              const val = e.target.value;
              setSmoking(val);
              triggerLivePreview({ smoking: val });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value=''>Select</option>
            <option value='never'>Never 🚭</option>
            <option value='occasionally'>Occasionally 🚬</option>
            <option value='regularly'>Regularly</option>
          </select>
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Drinking</label>
          <select
            value={drinking}
            onChange={(e) => {
              const val = e.target.value;
              setDrinking(val);
              triggerLivePreview({ drinking: val });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value=''>Select</option>
            <option value='never'>Never 🧃</option>
            <option value='occasionally'>Occasionally 🍻</option>
            <option value='regularly'>Regularly 🍷</option>
          </select>
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Guests Policy</label>
          <select
            value={guests}
            onChange={(e) => {
              const val = e.target.value;
              setGuests(val);
              triggerLivePreview({ guests: val });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value=''>Select</option>
            <option value='never'>Never 🚪</option>
            <option value='occasionally'>Occasionally 👥</option>
            <option value='frequently'>Frequently 🎉</option>
          </select>
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Music / Volume</label>
          <select
            value={music}
            onChange={(e) => {
              const val = e.target.value;
              setMusic(val);
              triggerLivePreview({ music: val });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value=''>Select</option>
            <option value='quiet'>Quiet / Headphones 🎧</option>
            <option value='occasionally'>Occasionally 🎵</option>
            <option value='frequently'>Frequently 🔊</option>
          </select>
        </div>
      </div>

      {/* Row 4: Pets & Cooking (Toggles & Checkboxes) */}
      <div className='p-3.5 mt-8 bg-base-200/60 rounded-2xl border border-base-300/80 space-y-3'>
        <div className='text-xs font-bold uppercase tracking-wider opacity-70'>
          Pets & Cooking Preferences
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {/* Cooking Toggle */}
          <label className='label cursor-pointer justify-start gap-3 bg-base-100 p-2.5 rounded-xl border border-base-200 shadow-xs'>
            <input
              type='checkbox'
              checked={cooking}
              onChange={(e) => {
                const val = e.target.checked;
                setCooking(val);
                triggerLivePreview({ cooking: val });
              }}
              className='checkbox checkbox-primary checkbox-sm'
            />
            <div className='flex flex-col'>
              <span className='label-text text-xs font-semibold'>Cooks at Home 🍳</span>
              <span className='text-[10px] opacity-60'>Prepares meals regularly</span>
            </div>
          </label>

          {/* Has Pets Toggle */}
          <label className='label cursor-pointer justify-start gap-3 bg-base-100 p-2.5 rounded-xl border border-base-200 shadow-xs'>
            <input
              type='checkbox'
              checked={hasPets}
              onChange={(e) => {
                const val = e.target.checked;
                setHasPets(val);
                triggerLivePreview({ pets: { hasPets: val, petFriendly } });
              }}
              className='checkbox checkbox-primary checkbox-sm'
            />
            <div className='flex flex-col'>
              <span className='label-text text-xs font-semibold'>I Own Pets 🐾</span>
              <span className='text-[10px] opacity-60'>Have a dog, cat, etc.</span>
            </div>
          </label>

          {/* Pet Friendly Toggle */}
          <label className='label cursor-pointer justify-start gap-3 bg-base-100 p-2.5 rounded-xl border border-base-200 shadow-xs'>
            <input
              type='checkbox'
              checked={petFriendly}
              onChange={(e) => {
                const val = e.target.checked;
                setPetFriendly(val);
                triggerLivePreview({ pets: { hasPets, petFriendly: val } });
              }}
              className='checkbox checkbox-primary checkbox-sm'
            />
            <div className='flex flex-col'>
              <span className='label-text text-xs font-semibold'>Pet Friendly 🐶</span>
              <span className='text-[10px] opacity-60'>Comfortable with pets</span>
            </div>
          </label>
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
            'Save Lifestyle Habits'
          )}
        </button>
      </div>
    </form>
  );
}

export default LifestyleForm;
