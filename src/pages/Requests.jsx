import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constant';
import { useEffect } from 'react';
import { addRequest, removeRequest } from '../utils/requestSlice';

function Requests() {
  const request = useSelector((state) => state.request);
  const dispatch = useDispatch();

  const fetchRequest = async () => {
    try {
      let resRequest = await axios.get(BASE_URL + '/user/request/received', {
        withCredentials: true,
      });

      dispatch(addRequest(resRequest.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      axios.post(BASE_URL + '/request/review/' + status + '/' + _id, {}, { withCredentials: true });
      dispatch(removeRequest(_id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (!request?.length)
    return (
      <div className='flex grow items-center justify-center'>
        <div className='w-full max-w-xs'>No requests found!</div>
      </div>
    );

  return (
    <div className='flex grow'>
      <div className='w-full text-center my-10'>
        <h1 className='text-bold text-white text-3xl'>Requests</h1>

        {request?.map((req) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = req.fromUserId;

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
                <div className='mx-0, my-2 flex gap-4'>
                  <button
                    className='btn btn-primary'
                    onClick={() => reviewRequest('rejected', req._id)}
                  >
                    Reject
                  </button>
                  <button
                    className='btn btn-secondary'
                    onClick={() => reviewRequest('accepted', req._id)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Requests;
