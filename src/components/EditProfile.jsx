import { useState } from 'react';
import UserCard from './UserCard';
import BasicProfileForm from './profile/BasicProfileForm';
import OccupationForm from './profile/OccupationForm';
import LocationForm from './profile/LocationForm';
import PhotoForm from './profile/PhotoForm';
import LifestyleForm from './profile/LifestyleForm';
import HousingForm from './profile/HousingForm';
import PreferencesPrivacyForm from './profile/PreferencesPrivacyForm';
import PasswordForm from './profile/PasswordForm';
import { useSelector } from 'react-redux';
// import { getProfileCompletionApi } from '../api/profileApi';

const SECTIONS = [
  { id: 'basic', label: 'Basic Info', icon: '👤' },
  { id: 'occupation', label: 'Occupation', icon: '💼' },
  { id: 'location', label: 'Location', icon: '📍' },
  { id: 'photo', label: 'Photo', icon: '📷' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '✨' },
  { id: 'housing', label: 'Housing & Budget', icon: '🏠' },
  { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  { id: 'password', label: 'Password', icon: '🔒' },
];

const EditProfile = ({ user }) => {
  const [activeSection, setActiveSection] = useState('basic');
  const [livePreviewUser, setLivePreviewUser] = useState(user);

  const { completionData, loading } = useSelector((state) => state.profileCompletion);

  const handleUpdateLivePreview = (updatedFields) => {
    setLivePreviewUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      // Deep merge for nested objects
      if (updatedFields.occupation) {
        updated.occupation = { ...(prev.occupation || {}), ...updatedFields.occupation };
      }
      if (updatedFields.location) {
        updated.location = { ...(prev.location || {}), ...updatedFields.location };
      }
      if (updatedFields.lifestyle) {
        updated.lifestyle = { ...(prev.lifestyle || {}), ...updatedFields.lifestyle };
      }
      if (updatedFields.housing) {
        updated.housing = { ...(prev.housing || {}), ...updatedFields.housing };
      }
      return updated;
    });
  };

  const renderActiveSectionForm = () => {
    switch (activeSection) {
      case 'basic':
        return <BasicProfileForm user={user} onUpdateLivePreview={handleUpdateLivePreview} />;
      case 'occupation':
        return <OccupationForm user={user} onUpdateLivePreview={handleUpdateLivePreview} />;
      case 'location':
        return <LocationForm user={user} onUpdateLivePreview={handleUpdateLivePreview} />;
      case 'photo':
        return <PhotoForm user={user} onUpdateLivePreview={handleUpdateLivePreview} />;
      case 'lifestyle':
        return <LifestyleForm user={user} onUpdateLivePreview={handleUpdateLivePreview} />;
      case 'housing':
        return <HousingForm user={user} onUpdateLivePreview={handleUpdateLivePreview} />;
      case 'preferences':
        return <PreferencesPrivacyForm user={user} />;
      case 'password':
        return <PasswordForm />;
      default:
        return <BasicProfileForm user={user} onUpdateLivePreview={handleUpdateLivePreview} />;
    }
  };

  const completionPercentage =
    user?.profileCompleted || completionData?.profileCompleted
      ? 100
      : completionData?.completionPercentage;

  return (
    <div className='flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8'>
      {/* Header & Completion Status */}
      <div className='space-y-3'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-black text-base-content'>Profile Settings</h1>
            <p className='text-xs opacity-70'>
              Manage your roommate preferences, lifestyle habits, and discoverability.
            </p>
          </div>

          <div className='flex items-center gap-3 bg-base-200 p-2.5 px-4 rounded-2xl border border-base-300 shadow-xs'>
            <div className='text-right'>
              <div className='text-[11px] font-bold uppercase tracking-wider opacity-60'>
                Profile Status
              </div>
              {loading ? (
                <div className='text-xs font-extrabold text-primary'>Calculating...</div>
              ) : (
                <div className='text-xs font-extrabold text-primary'>
                  {completionPercentage}% Completed
                </div>
              )}
            </div>
            {loading ? (
              <progress className='progress progress-primary w-24'></progress>
            ) : (
              <progress
                className='progress progress-primary w-24'
                value={completionPercentage}
                max='100'
              ></progress>
            )}
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className='flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none'>
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`btn btn-sm rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  isActive
                    ? 'btn-primary shadow-md'
                    : 'btn-ghost bg-base-200/80 text-base-content opacity-75 hover:opacity-100'
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Form Left, Real-Time Preview Right */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
        {/* Active Form Card */}
        <div className='lg:col-span-7 card bg-base-100 border border-base-300 shadow-xl rounded-3xl p-6 sm:p-7'>
          {renderActiveSectionForm()}
        </div>

        {/* Live Card Preview Column */}
        <div className='lg:col-span-5 flex flex-col items-center space-y-3 sticky top-24'>
          <div className='flex items-center justify-between w-full max-w-sm px-1'>
            <span className='text-xs font-bold uppercase tracking-wider opacity-60'>
              Live Roommate Preview
            </span>
            <span className='badge badge-xs badge-success text-white font-semibold'>
              Real-Time Feed Card
            </span>
          </div>

          <UserCard user={livePreviewUser} isPreview={true} />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
