import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constant';
import { addConnection } from '../utils/connectionSlice';

function Connections() {
  const connection = useSelector((state) => state.connection);
  const dispatch = useDispatch();

  const fetchConnection = async () => {
    try {
      const connectionRes = await axios.get(BASE_URL + '/user/connections', {
        withCredentials: true,
      });
      dispatch(addConnection(connectionRes?.data?.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, []);

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
              className='flex flex-row items-start gap-4 m-4 p-4 rounded-lg bg-base-300 w-full max-w-2xl mx-auto'
            >
              <div className='flex-shrink-0 w-20 h-20'>
                <img alt='photo' className='w-20 h-20 rounded-full object-cover' src={photoUrl} />
              </div>
              <div className='text-left'>
                <h2 className='font-bold text-xl'>{firstName + ' ' + lastName}</h2>
                {age && gender && <p>{age + ', ' + gender}</p>}
                <p className='h-48px line-clamp-2 overflow-hidden'>{about}</p>
              </div>
              {/* <Link to={"/chat/" + _id}>
              <button className="btn btn-primary">Chat</button>
            </Link> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Connections;
