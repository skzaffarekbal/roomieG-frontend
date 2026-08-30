import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import { updateOccupationApi } from '../../api/profileApi';

function OccupationForm({ user, onUpdateLivePreview }) {
  const dispatch = useDispatch();

  const occObj =
    typeof user?.occupation === 'object' && user?.occupation !== null ? user.occupation : {};

  const [type, setType] = useState(occObj.type || '');
  const [title, setTitle] = useState(occObj.title || '');
  const [organization, setOrganization] = useState(occObj.organization || user?.company || '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFieldChange = (field, value) => {
    let updated = { type, title, organization, [field]: value };
    if (onUpdateLivePreview) {
      onUpdateLivePreview({ occupation: updated });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      setSaving(true);
      const payload = {
        type,
        title: title || undefined,
        organization: organization || undefined,
      };

      const res = await updateOccupationApi(payload);
      if (res?.data) {
        dispatch(addUser(res.data));
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save occupation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className='space-y-4 text-base-content'>
      <div className='flex items-center justify-between border-b border-base-300 pb-2'>
        <div>
          <h3 className='font-bold text-lg'>Occupation Details</h3>
          <p className='text-xs opacity-70'>
            Help roommates know if you are a student or working professional.
          </p>
        </div>
        {success && (
          <span className='badge badge-success text-white badge-sm font-semibold animate-pulse'>
            Saved ✓
          </span>
        )}
      </div>

      <div className='form-control'>
        <label className='label py-1 text-xs font-semibold'>Occupation Type *</label>
        <select
          value={type}
          required
          onChange={(e) => {
            setType(e.target.value);
            handleFieldChange('type', e.target.value);
          }}
          className='select select-bordered select-sm rounded-xl bg-base-200/90 text-xs'
        >
          <option value='' disabled>
            Select Occupation Type
          </option>
          <option value='student'>Student (College / University)</option>
          <option value='employed'>Employed (Company / Corporate)</option>
          <option value='self_employed'>Self Employed / Freelancer</option>
          <option value='other'>Other</option>
        </select>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>
            {type === 'student' ? 'Course / Major' : 'Job Title / Role'}
          </label>
          <input
            type='text'
            placeholder={type === 'student' ? 'Computer Science' : 'Software Engineer'}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleFieldChange('title', e.target.value);
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/50'
          />
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>
            {type === 'student' ? 'College / University' : 'Company / Organization'}
          </label>
          <input
            type='text'
            placeholder={type === 'student' ? 'IIT / NIT / University' : 'TechCorp Inc.'}
            value={organization}
            onChange={(e) => {
              setOrganization(e.target.value);
              handleFieldChange('organization', e.target.value);
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/50'
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
            'Save Occupation'
          )}
        </button>
      </div>
    </form>
  );
}

export default OccupationForm;
