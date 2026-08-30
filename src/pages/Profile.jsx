import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EditProfile from '../components/EditProfile';
import { fetchProfileCompletion } from '../redux/profileCompletionSlice';

function Profile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchProfileCompletion(user._id));
    }
  }, [user, dispatch]);

  return (
    user && (
      <div className='flex grow'>
        <EditProfile key={user._id} user={user} />
      </div>
    )
  );
}

export default Profile;
