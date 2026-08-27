import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../redux/feedSlice';
import UserCard from '../components/UserCard';
import { getFeedApi } from '../api/feedApi';

function Feed() {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();

  const getFeed = useCallback(async () => {
    if (feed?.length) return;

    try {
      const feedRes = await getFeedApi();
      dispatch(addFeed(feedRes?.data));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, feed?.length]);

  useEffect(() => {
    getFeed();
  }, [getFeed]);

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
