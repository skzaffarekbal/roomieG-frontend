import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../redux/feedSlice';
import UserCard from '../components/UserCard';
import { getFeedApi } from '../api/feedApi';
import { Link } from 'react-router-dom';

function Feed() {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getFeed = useCallback(async () => {
    try {
      setLoading(true);
      const feedRes = await getFeedApi();
      dispatch(addFeed(feedRes?.data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;
    if (!feed?.length) {
      (async () => {
        try {
          setLoading(true);
          const feedRes = await getFeedApi();
          if (isMounted) {
            dispatch(addFeed(feedRes?.data));
          }
        } catch (error) {
          console.error(error);
        } finally {
          if (isMounted) setLoading(false);
        }
      })();
    }
    return () => {
      isMounted = false;
    };
  }, [dispatch, feed?.length]);

  if (loading && !feed?.length) {
    return (
      <div className='flex flex-1 items-center justify-center p-6'>
        <div className='flex flex-col items-center gap-3'>
          <span className='loading loading-spinner loading-lg text-primary'></span>
          <p className='text-xs opacity-70'>Finding matching roommates near you...</p>
        </div>
      </div>
    );
  }

  if (!feed?.length) {
    return (
      <div className='flex flex-1 items-center justify-center p-6 my-10'>
        <div className='card bg-base-200 border border-base-300 p-8 rounded-3xl max-w-sm text-center space-y-4 shadow-sm'>
          <div className='text-5xl'>🎉</div>
          <h2 className='text-2xl font-bold text-base-content'>You're All Caught Up!</h2>
          <p className='text-xs sm:text-sm opacity-70 leading-relaxed'>
            You've reviewed all available profiles for now. Check back soon for new roommates moving to your city!
          </p>
          <div className='pt-2 flex flex-col gap-2'>
            <button onClick={getFeed} className='btn btn-primary btn-sm rounded-xl font-semibold shadow-sm'>
              Refresh Recommendations ↻
            </button>
            <Link to='/connections' className='btn btn-ghost btn-sm rounded-xl font-medium text-xs'>
              View Your Connections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-1 items-center justify-center p-4 sm:p-8'>
      <UserCard user={feed[0]} />
    </div>
  );
}

export default Feed;
