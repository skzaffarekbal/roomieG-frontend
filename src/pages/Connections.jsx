import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addConnection } from '../redux/connectionSlice';
import { Link } from 'react-router-dom';
import { getConnectionsApi } from '../api/connectionApi';
import PremiumBadge from '../components/PremiumBadge';

function Connections() {
  const connection = useSelector((state) => state.connection);
  const unreadCount = useSelector((state) => state.unreadCount);
  const { userWiseUnreadCounts = {} } = unreadCount || {};
  const dispatch = useDispatch();

  const fetchConnection = useCallback(async () => {
    try {
      const connectionRes = await getConnectionsApi();
      dispatch(addConnection(connectionRes?.data));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchConnection();
  }, [fetchConnection]);

  if (!connection?.length) {
    return (
      <div className='flex grow items-center justify-center p-6 my-12'>
        <div className='card bg-base-200 border border-base-300 p-8 rounded-3xl max-w-md text-center space-y-4 shadow-sm'>
          <div className='text-5xl'>🤝</div>
          <h2 className='text-2xl font-bold text-base-content'>No Connections Yet</h2>
          <p className='text-xs sm:text-sm opacity-70 leading-relaxed'>
            When you and another roommate match by sending mutual "Interested" requests, they'll
            appear here for direct chatting.
          </p>
          <div className='pt-2'>
            <Link to='/' className='btn btn-primary btn-sm rounded-xl font-semibold'>
              Explore Feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6'>
      <div className='text-center space-y-1'>
        <h1 className='text-2xl sm:text-3xl font-extrabold text-base-content'>My Connections</h1>
        <p className='text-xs opacity-70'>
          You can start conversations with your accepted roommate matches.
        </p>
      </div>

      <div className='space-y-4'>
        {connection.map((conn) => {
          const { _id, firstName, lastName, photo, age, gender, bio, subscription } = conn;
          const unread = userWiseUnreadCounts[_id] || 0;

          return (
            <div
              key={_id}
              className='card card-side bg-base-200/80 border border-base-300 shadow-sm hover:border-primary/40 transition-all p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4'
            >
              <div className='flex items-center gap-4 w-full sm:w-auto'>
                <div className='avatar relative shrink-0'>
                  <div className='w-16 h-16 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100 overflow-hidden bg-base-300 flex items-center justify-center text-primary font-bold text-xl'>
                    {photo?.exactPhoto ? (
                      <img
                        alt={`${firstName} ${lastName}`}
                        src={photo?.exactPhoto}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <span>{firstName?.[0] || 'U'}</span>
                    )}
                  </div>
                  {unread > 0 && (
                    <span className='badge badge-xs badge-error absolute -top-1 -right-1 text-white font-bold animate-bounce'>
                      {unread}
                    </span>
                  )}
                </div>

                <div className='text-left space-y-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <h2 className='font-bold text-base sm:text-lg text-base-content truncate'>
                      {firstName} {lastName}
                    </h2>
                    <PremiumBadge subscription={subscription} size='xs' />
                    {gender && (
                      <span className='badge badge-xs badge-outline capitalize opacity-75'>
                        {gender} {age ? `• ${age}` : ''}
                      </span>
                    )}
                  </div>
                  {bio && <p className='text-xs opacity-75 line-clamp-2 leading-relaxed'>{bio}</p>}
                </div>
              </div>

              <div className='flex items-center gap-2 w-full sm:w-auto justify-end'>
                <Link
                  to={'/chat/' + _id}
                  className='btn btn-primary btn-sm rounded-xl px-5 font-semibold shadow-sm w-full sm:w-auto'
                >
                  Chat 💬
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Connections;
