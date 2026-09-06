import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { addRequest, removeRequest } from '../redux/requestSlice';
import { getReceivedRequestsApi, reviewRequestApi } from '../api/requestApi';
import { Link } from 'react-router-dom';
import PremiumBadge from '../components/PremiumBadge';

function Requests() {
  const request = useSelector((state) => state.request);
  const dispatch = useDispatch();
  const [processingId, setProcessingId] = useState(null);

  const fetchRequest = useCallback(async () => {
    try {
      const resRequest = await getReceivedRequestsApi();
      dispatch(addRequest(resRequest.data));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  const reviewRequest = async (status, _id) => {
    try {
      setProcessingId(_id);
      await reviewRequestApi(status, _id);
      dispatch(removeRequest(_id));
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  if (!request?.length) {
    return (
      <div className='flex grow items-center justify-center p-6 my-12'>
        <div className='card bg-base-200 border border-base-300 p-8 rounded-3xl max-w-md text-center space-y-4 shadow-sm'>
          <div className='text-5xl'>📬</div>
          <h2 className='text-2xl font-bold text-base-content'>No Pending Requests</h2>
          <p className='text-xs sm:text-sm opacity-70 leading-relaxed'>
            You're all caught up! When other potential roommates swipe "Interested" on your profile,
            you'll review them here.
          </p>
          <div className='pt-2'>
            <Link to='/' className='btn btn-primary btn-sm rounded-xl font-semibold'>
              Browse Potential Roommates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6'>
      <div className='text-center space-y-1'>
        <div className='inline-flex items-center gap-1.5 badge badge-primary badge-outline text-xs font-semibold'>
          {request.length} Pending {request.length === 1 ? 'Request' : 'Requests'}
        </div>
        <h1 className='text-2xl sm:text-3xl font-extrabold text-base-content'>Roommate Requests</h1>
        <p className='text-xs opacity-70'>
          Review incoming roommate requests. Accepting adds them to your connections for live chat.
        </p>
      </div>

      <div className='space-y-4'>
        {request?.map((req) => {
          const fromUser = req.fromUserId || {};
          const { _id, firstName, lastName, photo, age, gender, bio, subscription } = fromUser;
          const isProcessing = processingId === req._id;

          return (
            <div
              key={req._id || _id}
              className='card bg-base-200/80 border border-base-300 shadow-sm hover:border-primary/40 transition-all p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'
            >
              <div className='flex items-start gap-4'>
                <div className='avatar shrink-0'>
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
                </div>

                <div className='space-y-1 text-left'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <h2 className='font-bold text-base sm:text-lg text-base-content'>
                      {firstName} {lastName}
                    </h2>
                    <PremiumBadge subscription={subscription} size='xs' />
                    {gender && (
                      <span className='badge badge-xs badge-outline capitalize opacity-75'>
                        {gender} {age ? `• ${age} yrs` : ''}
                      </span>
                    )}
                  </div>
                  {bio && (
                    <p className='text-xs opacity-75 line-clamp-2 leading-relaxed max-w-lg'>
                      {bio}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex items-center gap-2.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-base-300/60'>
                <button
                  className='btn btn-outline btn-error btn-sm rounded-xl px-4 font-semibold'
                  disabled={isProcessing}
                  onClick={() => reviewRequest('rejected', req._id)}
                >
                  Reject
                </button>
                <button
                  className='btn btn-primary btn-sm rounded-xl px-5 font-semibold shadow-sm'
                  disabled={isProcessing}
                  onClick={() => reviewRequest('accepted', req._id)}
                >
                  {isProcessing ? (
                    <span className='loading loading-spinner loading-xs'></span>
                  ) : (
                    'Accept Match ❤️'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Requests;
