import { useSelector } from 'react-redux';
import EditProfile from '../components/EditProfile';

function Profile() {
  const user = useSelector((state) => state.user);
  return (
    user && (
      <div className='flex grow'>
        <EditProfile user={user} />
      </div>
    )
  );
}

export default Profile;
