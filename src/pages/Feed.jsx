import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constant';
import { addFeed } from '../utils/feedSlice';
import UserCard from '../components/UserCard';

function Feed() {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed?.length) return;

    try {
      const feedRes = await axios.get(BASE_URL + '/feed', { withCredentials: true });
      dispatch(addFeed(feedRes?.data?.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed?.length)
    return (
      <div className='flex grow items-center justify-center'>
        <div className='w-full max-w-xs'>No new user found!</div>
      </div>
    );

  return (
    feed && (
      <div className='flex grow items-center justify-center'>
        <UserCard user={feed[0]} />
      </div>
    )
  );
}

export default Feed;
