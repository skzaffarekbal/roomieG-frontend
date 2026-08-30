import { useState } from 'react';
import { updatePasswordApi } from '../../api/profileApi';

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    try {
      setSaving(true);
      await updatePasswordApi({
        currentPassword,
        newPassword,
      });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className='space-y-4 text-base-content'>
      <div className='flex items-center justify-between border-b border-base-300 pb-2'>
        <div>
          <h3 className='font-bold text-lg'>Change Password</h3>
          <p className='text-xs opacity-70'>Update your account password securely.</p>
        </div>
        {success && (
          <span className='badge badge-success text-white badge-sm font-semibold animate-pulse'>
            Password Updated ✓
          </span>
        )}
      </div>

      <div className='form-control'>
        <label className='label py-1 text-xs font-semibold'>Current Password *</label>
        <input
          type='password'
          required
          placeholder='••••••••'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className='input input-bordered input-sm rounded-xl bg-base-200/50 text-sm'
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>New Password *</label>
          <input
            type='password'
            required
            placeholder='At least 8 chars'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='input input-bordered input-sm rounded-xl bg-base-200/50 text-sm'
          />
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Confirm New Password *</label>
          <input
            type='password'
            required
            placeholder='••••••••'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='input input-bordered input-sm rounded-xl bg-base-200/50 text-sm'
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
          {saving ? <span className='loading loading-spinner loading-xs'></span> : 'Update Password'}
        </button>
      </div>
    </form>
  );
}

export default PasswordForm;
