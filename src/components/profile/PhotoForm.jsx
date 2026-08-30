import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import { updatePhotoApi, editProfileApi } from '../../api/profileApi';

function PhotoForm({ user, onUpdateLivePreview }) {
  const dispatch = useDispatch();

  const initialPhoto =
    user?.photo?.exactPhoto ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  const [photoUrl, setPhotoUrl] = useState(initialPhoto);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUrlChange = (val) => {
    setPhotoUrl(val);
    if (onUpdateLivePreview) {
      onUpdateLivePreview({ photoUrl: val, photo: { exactPhoto: val, blurPhoto: val } });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      setSaving(true);
      const payload = {
        exactPhoto: photoUrl,
        blurPhoto: photoUrl,
      };

      let res;
      try {
        res = await updatePhotoApi(payload);
      } catch (err) {
        if (err?.response?.status === 404) {
          res = await editProfileApi({ photoUrl });
        } else {
          throw err;
        }
      }

      if (res?.data) {
        dispatch(addUser(res.data));
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save photo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className='space-y-5 text-base-content'>
      <div className='flex items-center justify-between border-b border-base-300 pb-2'>
        <div>
          <h3 className='font-bold text-lg'>Profile Photo</h3>
          <p className='text-xs opacity-70'>
            RoomieG allows 1 verified profile photo. Privacy blur is backend-controlled.
          </p>
        </div>
        {success && (
          <span className='badge badge-success text-white badge-sm font-semibold animate-pulse'>
            Saved ✓
          </span>
        )}
      </div>

      <div className='flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-base-200/60 border border-base-300'>
        <div className='avatar relative'>
          <div className='w-24 h-24 rounded-full ring-4 ring-primary/40 ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300 shadow-lg'>
            <img src={photoUrl} alt='Profile preview' className='w-full h-full object-cover' />
          </div>
        </div>

        <div className='flex-1 space-y-2 w-full'>
          <div className='form-control'>
            <label className='label py-1 text-xs font-semibold'>Image Web URL *</label>
            <input
              type='url'
              required
              placeholder='https://images.unsplash.com/...'
              value={photoUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className='input input-bordered input-sm rounded-xl bg-base-100 text-xs w-full'
            />
          </div>
          <p className='text-[11px] opacity-70'>
            Tip: Use a clear portrait photo showing your face.
          </p>
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
          {saving ? <span className='loading loading-spinner loading-xs'></span> : 'Update Photo'}
        </button>
      </div>
    </form>
  );
}

export default PhotoForm;
