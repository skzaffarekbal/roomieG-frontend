import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constant';
import { addConnection } from '../redux/connectionSlice';
import { Link } from 'react-router-dom';

function Connections() {
  const connection = useSelector((state) => state.connection);
  const unreadCount = useSelector((state) => state.unreadCount);
  const { userWiseUnreadCounts } = unreadCount;
  const dispatch = useDispatch();

  const fetchConnection = useCallback(async () => {
    try {
      const connectionRes = await axios.get(BASE_URL + '/user/connections', {
        withCredentials: true,
      });
      dispatch(addConnection(connectionRes?.data?.data));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchConnection();
  }, [fetchConnection]);

  if (!connection?.length)
    return (
      <div className='flex grow items-center justify-center'>
        <div className='w-full max-w-xs'>No connections found!</div>
      </div>
    );
  return (
    <div className='flex grow'>
      <div className='w-full text-center my-10'>
        <h1 className='text-bold text-white text-3xl'>Connections</h1>

        {connection.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;

          return (
            <div
              key={_id}
              className='m-4 p-4 flex flex-row justify-between gap-4 rounded-lg bg-base-300 w-full max-w-2xl mx-auto'
            >
              <div className='flex flex-row items-start gap-4'>
                <div className='flex-shrink-0 w-20 h-20'>
                  <img alt='photo' className='w-20 h-20 rounded-full object-cover' src={photoUrl} />
                </div>
                <div className='text-left'>
                  <h2 className='font-bold text-xl'>
                    {firstName + ' ' + lastName}{' '}
                    {userWiseUnreadCounts[_id] ? (
                      <span className='badge badge-xs badge-error'>
                        {userWiseUnreadCounts[_id]}
                      </span>
                    ) : (
                      ''
                    )}
                  </h2>
                  {age && gender && <p>{age + ', ' + gender}</p>}
                  <p className='h-48px line-clamp-2 overflow-hidden'>{about}</p>
                </div>
              </div>
              <Link to={'/chat/' + _id}>
                <button className='btn btn-primary'>Chat</button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Connections;
