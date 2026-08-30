import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import { updateBasicProfileApi } from '../../api/profileApi';
import { calculateAge } from '../../utils/profileHelpers';

function BasicProfileForm({ user, onUpdateLivePreview }) {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
  );
  const [gender, setGender] = useState(user?.gender || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [languages, setLanguages] = useState(
    Array.isArray(user?.languages) ? user.languages.join(', ') : user?.languages || '',
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const calculatedAge = calculateAge(dateOfBirth);

  const handleFieldChange = (field, value) => {
    let updated = { firstName, lastName, dateOfBirth, gender, bio, languages, [field]: value };
    if (onUpdateLivePreview) {
      onUpdateLivePreview(updated);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      setSaving(true);
      const parsedLanguages = languages
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean);

      const payload = {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
        bio,
        languages: parsedLanguages,
      };

      const res = await updateBasicProfileApi(payload);

      if (res?.data) {
        dispatch(addUser(res.data));
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save basic info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className='space-y-4 text-base-content'>
      <div className='flex items-center justify-between border-b border-base-300 pb-2'>
        <div>
          <h3 className='font-bold text-lg'>Basic Details</h3>
          <p className='text-xs opacity-70'>Name, age calculation, gender, languages, and bio.</p>
        </div>
        {success && (
          <span className='badge badge-success text-white badge-sm font-semibold animate-pulse'>
            Saved ✓
          </span>
        )}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>First Name *</label>
          <input
            type='text'
            required
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              handleFieldChange('firstName', e.target.value);
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/50'
          />
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Last Name *</label>
          <input
            type='text'
            required
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              handleFieldChange('lastName', e.target.value);
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/50'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>
            <span>Date of Birth *</span>
            {calculatedAge !== null && (
              <span className='text-primary font-bold text-xs'>Age: {calculatedAge}</span>
            )}
          </label>
          <input
            type='date'
            required
            value={dateOfBirth}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setDateOfBirth(e.target.value);
              handleFieldChange('dateOfBirth', e.target.value);
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/50'
          />
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Gender *</label>
          <select
            value={gender}
            required
            onChange={(e) => {
              setGender(e.target.value);
              handleFieldChange('gender', e.target.value);
            }}
            className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
          >
            <option value='' disabled>
              Select Gender
            </option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='others'>Other</option>
          </select>
        </div>
      </div>

      <div className='form-control'>
        <label className='label py-1 text-xs font-semibold'>Languages Spoken</label>
        <input
          type='text'
          placeholder='English, Hindi, Kannada'
          value={languages}
          onChange={(e) => {
            setLanguages(e.target.value);
            handleFieldChange('languages', e.target.value);
          }}
          className='input input-bordered input-sm rounded-xl bg-base-200/50 text-xs w-full'
        />
      </div>

      <div className='form-control'>
        <label className='label py-1 text-xs font-semibold'>Bio *</label>
        <textarea
          rows={3}
          required
          placeholder='Tell potential flatmates about your routine, hobbies, and vibe...'
          value={bio}
          onChange={(e) => {
            setBio(e.target.value);
            handleFieldChange('bio', e.target.value);
          }}
          className='textarea textarea-bordered rounded-xl bg-base-200/50 text-xs sm:text-sm w-full h-42'
        ></textarea>
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
            'Save Basic Info'
          )}
        </button>
      </div>
    </form>
  );
}

export default BasicProfileForm;
