import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import { updateHousingApi } from '../../api/profileApi';

function HousingForm({ user, onUpdateLivePreview }) {
  const dispatch = useDispatch();

  const houseObj = typeof user?.housing === 'object' && user?.housing !== null ? user.housing : {};

  // Status: 'looking_for_room' | 'has_room' | 'both'
  const [status, setStatus] = useState(houseObj.status || 'looking_for_room');

  // Budget: { min, max }
  const [budgetMin, setBudgetMin] = useState(
    houseObj.budget?.min !== undefined ? houseObj.budget.min : '',
  );
  const [budgetMax, setBudgetMax] = useState(
    houseObj.budget?.max !== undefined
      ? houseObj.budget.max
      : typeof houseObj.budget === 'number'
      ? houseObj.budget
      : '',
  );

  // Move in date
  const [moveInDate, setMoveInDate] = useState(
    houseObj.moveInDate ? new Date(houseObj.moveInDate).toISOString().split('T')[0] : '',
  );

  // Preferred Locations: [{ city, areas: [] }]
  const initialCity = houseObj.preferredLocations?.[0]?.city || user?.location?.city || '';
  const initialAreas = Array.isArray(houseObj.preferredLocations?.[0]?.areas)
    ? houseObj.preferredLocations[0].areas.join(', ')
    : typeof houseObj.preferredLocations === 'string'
    ? houseObj.preferredLocations
    : '';

  const [city, setCity] = useState(initialCity);
  const [areas, setAreas] = useState(initialAreas);

  // Preferences: roomType ('private' | 'shared' | 'any'), furnished (boolean), genderPreference ('male' | 'female' | 'any')
  const [roomType, setRoomType] = useState(
    houseObj.roomType === 'Private Room'
      ? 'private'
      : houseObj.roomType === 'Shared Room'
      ? 'shared'
      : houseObj.roomType || 'any',
  );
  const [furnished, setFurnished] = useState(
    houseObj.furnished !== undefined ? Boolean(houseObj.furnished) : true,
  );
  const [genderPreference, setGenderPreference] = useState(
    houseObj.genderPreference ? houseObj.genderPreference.toLowerCase() : 'any',
  );

  // Preferred Age: { min, max }
  const [ageMin, setAgeMin] = useState(
    houseObj.preferredAge?.min !== undefined ? houseObj.preferredAge.min : 18,
  );
  const [ageMax, setAgeMax] = useState(
    houseObj.preferredAge?.max !== undefined ? houseObj.preferredAge.max : 40,
  );

  // Room details (when status is 'has_room' or 'both'): { rent, deposit, availableBeds }
  const [roomRent, setRoomRent] = useState(houseObj.room?.rent || '');
  const [roomDeposit, setRoomDeposit] = useState(houseObj.room?.deposit || '');
  const [availableBeds, setAvailableBeds] = useState(houseObj.room?.availableBeds || 1);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const triggerLivePreview = (overrides = {}) => {
    if (!onUpdateLivePreview) return;
    const parsedAreas = areas
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const currentHousing = {
      status,
      budget: {
        min: budgetMin !== '' ? Number(budgetMin) : undefined,
        max: budgetMax !== '' ? Number(budgetMax) : undefined,
      },
      moveInDate: moveInDate || undefined,
      preferredLocations: city ? [{ city, areas: parsedAreas }] : [],
      roomType,
      furnished: Boolean(furnished),
      genderPreference,
      preferredAge: {
        min: ageMin !== '' ? Number(ageMin) : undefined,
        max: ageMax !== '' ? Number(ageMax) : undefined,
      },
      room: {
        rent: roomRent !== '' ? Number(roomRent) : undefined,
        deposit: roomDeposit !== '' ? Number(roomDeposit) : undefined,
        availableBeds: availableBeds !== '' ? Number(availableBeds) : 1,
      },
      ...overrides,
    };
    onUpdateLivePreview({ housing: currentHousing });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setSaving(true);
      const parsedAreas = areas
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const payload = {
        status: status || undefined,
        budget:
          budgetMin !== '' || budgetMax !== ''
            ? {
                min: budgetMin !== '' ? Number(budgetMin) : undefined,
                max: budgetMax !== '' ? Number(budgetMax) : undefined,
              }
            : undefined,
        moveInDate: moveInDate || undefined,
        preferredLocations:
          city || parsedAreas.length > 0
            ? [
                {
                  city: city.trim(),
                  areas: parsedAreas,
                },
              ]
            : undefined,
        roomType: roomType || undefined,
        furnished: Boolean(furnished),
        genderPreference: genderPreference || undefined,
        preferredAge:
          ageMin !== '' || ageMax !== ''
            ? {
                min: ageMin !== '' ? Number(ageMin) : 18,
                max: ageMax !== '' ? Number(ageMax) : 40,
              }
            : undefined,
        room:
          status === 'has_room' || status === 'both'
            ? {
                rent: roomRent !== '' ? Number(roomRent) : undefined,
                deposit: roomDeposit !== '' ? Number(roomDeposit) : undefined,
                availableBeds: availableBeds !== '' ? Number(availableBeds) : 1,
              }
            : undefined,
      };

      const res = await updateHousingApi(payload);
      if (res?.data) {
        dispatch(addUser(res.data));
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to save housing info');
    } finally {
      setSaving(false);
    }
  };

  const showRoomDetails = status === 'has_room' || status === 'both';
  const showBudget = status === 'looking_for_room' || status === 'both';

  return (
    <form onSubmit={handleSave} className='space-y-5 text-base-content'>
      <div className='flex items-center justify-between border-b border-base-300 pb-2'>
        <div>
          <h3 className='font-bold text-lg'>Housing & Budget Preferences</h3>
          <p className='text-xs opacity-70'>Budget, room type, location, and room details.</p>
        </div>
        {success && (
          <span className='badge badge-success text-white badge-sm font-semibold animate-pulse'>
            Saved ✓
          </span>
        )}
      </div>

      {/* Row 1: Housing Status & Gender Preference */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Housing Status</label>
          <select
            value={status}
            onChange={(e) => {
              const val = e.target.value;
              setStatus(val);
              triggerLivePreview({ status: val });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value='looking_for_room'>Looking for a Room / Flat 🔍</option>
            <option value='has_room'>Have a Room, Need Flatmate 🏠</option>
            <option value='both'>Open to Both (Have Room or Ready to Move) 🔄</option>
          </select>
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Roommate Gender Preference</label>
          <select
            value={genderPreference}
            onChange={(e) => {
              const val = e.target.value;
              setGenderPreference(val);
              triggerLivePreview({ genderPreference: val });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value='any'>Any Gender 🌈</option>
            <option value='male'>Male Roommates Only 👨</option>
            <option value='female'>Female Roommates Only 👩</option>
          </select>
        </div>
      </div>

      {/* Row 2: Budget (Min / Max) for seekers */}
      {showBudget && (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-base-200/40 rounded-2xl border border-base-200'>
          <div className='form-control'>
            <label className='label py-1 text-xs font-semibold'>Min Budget (₹ / mo)</label>
            <input
              type='number'
              min='0'
              placeholder='5000'
              value={budgetMin}
              onChange={(e) => {
                const val = e.target.value;
                setBudgetMin(val);
                triggerLivePreview({
                  budget: {
                    min: val !== '' ? Number(val) : undefined,
                    max: budgetMax !== '' ? Number(budgetMax) : undefined,
                  },
                });
              }}
              className='input input-bordered input-sm rounded-xl bg-base-100 text-xs'
            />
          </div>

          <div className='form-control'>
            <label className='label py-1 text-xs font-semibold'>Max Budget (₹ / mo)</label>
            <input
              type='number'
              min='0'
              placeholder='18000'
              value={budgetMax}
              onChange={(e) => {
                const val = e.target.value;
                setBudgetMax(val);
                triggerLivePreview({
                  budget: {
                    min: budgetMin !== '' ? Number(budgetMin) : undefined,
                    max: val !== '' ? Number(val) : undefined,
                  },
                });
              }}
              className='input input-bordered input-sm rounded-xl bg-base-100 text-xs'
            />
          </div>
        </div>
      )}

      {/* Row 3: Room Provider Details (if user has a room) */}
      {showRoomDetails && (
        <div className='p-3.5 bg-primary/5 rounded-2xl border border-primary/20 space-y-3'>
          <div className='text-xs font-bold uppercase tracking-wider text-primary'>
            Your Available Room Details
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            <div className='form-control'>
              <label className='label py-1 text-xs font-semibold'>Rent (₹ / month)</label>
              <input
                type='number'
                min='0'
                placeholder='12000'
                value={roomRent}
                onChange={(e) => {
                  const val = e.target.value;
                  setRoomRent(val);
                  triggerLivePreview({
                    room: {
                      rent: val !== '' ? Number(val) : undefined,
                      deposit: roomDeposit !== '' ? Number(roomDeposit) : undefined,
                      availableBeds: availableBeds !== '' ? Number(availableBeds) : 1,
                    },
                  });
                }}
                className='input input-bordered input-sm rounded-xl bg-base-100 text-xs'
              />
            </div>

            <div className='form-control'>
              <label className='label py-1 text-xs font-semibold'>Security Deposit (₹)</label>
              <input
                type='number'
                min='0'
                placeholder='25000'
                value={roomDeposit}
                onChange={(e) => {
                  const val = e.target.value;
                  setRoomDeposit(val);
                  triggerLivePreview({
                    room: {
                      rent: roomRent !== '' ? Number(roomRent) : undefined,
                      deposit: val !== '' ? Number(val) : undefined,
                      availableBeds: availableBeds !== '' ? Number(availableBeds) : 1,
                    },
                  });
                }}
                className='input input-bordered input-sm rounded-xl bg-base-100 text-xs'
              />
            </div>

            <div className='form-control'>
              <label className='label py-1 text-xs font-semibold'>Available Beds</label>
              <input
                type='number'
                min='1'
                placeholder='1'
                value={availableBeds}
                onChange={(e) => {
                  const val = e.target.value;
                  setAvailableBeds(val);
                  triggerLivePreview({
                    room: {
                      rent: roomRent !== '' ? Number(roomRent) : undefined,
                      deposit: roomDeposit !== '' ? Number(roomDeposit) : undefined,
                      availableBeds: val !== '' ? Number(val) : 1,
                    },
                  });
                }}
                className='input input-bordered input-sm rounded-xl bg-base-100 text-xs'
              />
            </div>
          </div>
        </div>
      )}

      {/* Row 4: Room Type, Move-In Date, Furnished */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Room Type</label>
          <select
            value={roomType}
            onChange={(e) => {
              const val = e.target.value;
              setRoomType(val);
              triggerLivePreview({ roomType: val });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value='any'>Any Room Type</option>
            <option value='private'>Private Room 🛏️</option>
            <option value='shared'>Shared Room 👥</option>
          </select>
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Target Move-In Date</label>
          <input
            type='date'
            value={moveInDate}
            onChange={(e) => {
              const val = e.target.value;
              setMoveInDate(val);
              triggerLivePreview({ moveInDate: val });
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/90 text-xs'
          />
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Furnished</label>
          <select
            value={furnished ? 'true' : 'false'}
            onChange={(e) => {
              const val = e.target.value === 'true';
              setFurnished(val);
              triggerLivePreview({ furnished: val });
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value='true'>Furnished ✨</option>
            <option value='false'>Unfurnished / Semi 📦</option>
          </select>
        </div>
      </div>

      {/* Row 5: Preferred City & Areas */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Target City</label>
          <input
            type='text'
            placeholder='Bengaluru, Mumbai, Delhi'
            value={city}
            onChange={(e) => {
              const val = e.target.value;
              setCity(val);
              const parsedAreas = areas
                .split(',')
                .map((a) => a.trim())
                .filter(Boolean);
              triggerLivePreview({ preferredLocations: [{ city: val, areas: parsedAreas }] });
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/90 text-xs'
          />
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>
            Preferred Areas (comma-separated)
          </label>
          <input
            type='text'
            placeholder='Koramangala, HSR Layout, Indiranagar'
            value={areas}
            onChange={(e) => {
              const val = e.target.value;
              setAreas(val);
              const parsedAreas = val
                .split(',')
                .map((a) => a.trim())
                .filter(Boolean);
              triggerLivePreview({ preferredLocations: [{ city, areas: parsedAreas }] });
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/90 text-xs'
          />
        </div>
      </div>

      {/* Row 6: Preferred Age Range */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-base-200/40 rounded-2xl border border-base-200'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Preferred Roommate Min Age</label>
          <input
            type='number'
            min='18'
            max='100'
            placeholder='18'
            value={ageMin}
            onChange={(e) => {
              const val = e.target.value;
              setAgeMin(val);
              triggerLivePreview({
                preferredAge: {
                  min: val !== '' ? Number(val) : 18,
                  max: ageMax !== '' ? Number(ageMax) : 40,
                },
              });
            }}
            className='input input-bordered input-sm rounded-xl bg-base-100 text-xs'
          />
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Preferred Roommate Max Age</label>
          <input
            type='number'
            min='18'
            max='100'
            placeholder='35'
            value={ageMax}
            onChange={(e) => {
              const val = e.target.value;
              setAgeMax(val);
              triggerLivePreview({
                preferredAge: {
                  min: ageMin !== '' ? Number(ageMin) : 18,
                  max: val !== '' ? Number(val) : 40,
                },
              });
            }}
            className='input input-bordered input-sm rounded-xl bg-base-100 text-xs'
          />
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
            'Save Housing Info'
          )}
        </button>
      </div>
    </form>
  );
}

export default HousingForm;
