import Tick from '../assets/icon/Tick';
import { addUser } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { verifyPremiumApi, createPaymentOrderApi } from '../api/paymentApi';

function Premium() {
  const dispatch = useDispatch();
  const loginUser = useSelector((state) => state.user);
  const [showToast, setShowToast] = useState(false);

  const verifyPremiumUser = async () => {
    try {
      const res = await verifyPremiumApi();

      if (res?.data?.isPremium) {
        dispatch(addUser(res?.data));
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const handleBuy = async (membershipType) => {
    if (loginUser?.isPremium) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return;
    }
    try {
      const order = await createPaymentOrderApi(membershipType);

      const { amount, keyId, currency, notes, orderId } = order;
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'RoomieG',
        description: 'Find the right roommate, not just an empty room.',
        order_id: orderId,
        prefill: {
          name: notes.firstName + ' ' + notes.lastName,
          email: notes.emailId,
          contact: '9999999999',
        },
        theme: {
          color: membershipType === 'gold' ? '#D4AF37' : '#C0C0C0',
        },
        handler: () => {
          verifyPremiumUser();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error?.response?.data?.error);
    }
  };

  return (
    <>
      <div className='flex flex-col lg:flex-row gap-4 grow items-center justify-center m-10'>
        <div className='card w-96 bg-base-100 shadow-sm border-[0.5px] border-primary'>
          <div className='card-body'>
            <span className='badge badge-xs badge-primary'>Free</span>
            <div className='flex justify-between'>
              <h2 className='text-3xl font-bold'>Starter</h2>
              <span className='text-xl'>Free</span>
            </div>
            <ul className='mt-6 flex flex-col gap-2 text-xs'>
              <li>
                <Tick className='text-success' />
                <span>10 swipes/day</span>
              </li>
              <li>
                <Tick className='text-success' />
                <span>Match & chat</span>
              </li>
              <li className='opacity-50'>
                <Tick className='text-base-content/50' />
                <span className='line-through'>Advanced filters</span>
              </li>
              <li className='opacity-50'>
                <Tick className='text-base-content/50' />
                <span className='line-through'>See who liked you</span>
              </li>
              <li className='opacity-50'>
                <Tick className='text-base-content/50' />
                <span className='line-through'>Verified badge</span>
              </li>
              <li className='opacity-50'>
                <Tick className='text-base-content/50' />
                <span className='line-through'>Profile analytics</span>
              </li>
            </ul>
            <div className='mt-6'>
              <button className='btn btn-block btn-primary'>Free Plan</button>
            </div>
          </div>
        </div>

        <div className='card w-96 bg-base-100 shadow-sm border-[0.5px] border-slate-400'>
          <div className='card-body'>
            <span className='badge badge-xs bg-slate-400'>Most Popular</span>
            <div className='flex justify-between'>
              <h2 className='text-3xl font-bold'>Silver</h2>
              <span className='text-xl'>₹99/month</span>
            </div>
            <ul className='mt-6 flex flex-col gap-2 text-xs'>
              <li>
                <Tick className='text-success' />
                <span>10 swipes/day</span>
              </li>
              <li>
                <Tick className='text-success' />
                <span>Advanced filters</span>
              </li>
              <li>
                <Tick className='text-success' />
                <span>See who liked you</span>
              </li>
              <li className='opacity-50'>
                <Tick className='text-base-content/50' />
                <span className='line-through'>Verified badge</span>
              </li>
              <li className='opacity-50'>
                <Tick className='text-base-content/50' />
                <span className='line-through'>Profile analytics</span>
              </li>
              <li className='opacity-50'>
                <Tick className='text-base-content/50' />
                <span className='line-through'>Early access to new features</span>
              </li>
            </ul>
            <div className='mt-6'>
              <button className='btn bg-slate-400 btn-block' onClick={() => handleBuy('silver')}>
                {loginUser?.isPremium && loginUser?.membershipType === 'silver'
                  ? 'Active Plan'
                  : 'Buy Silver'}
              </button>
            </div>
          </div>
        </div>

        <div className='card w-96 bg-base-100 shadow-sm border-[0.5px] border-amber-400'>
          <div className='card-body'>
            <span className='badge badge-xs badge-warning text-white'>Most Effective</span>
            <div className='flex justify-between'>
              <h2 className='text-3xl font-bold'>Gold</h2>
              <span className='text-xl'>₹199/month</span>
            </div>
            <ul className='mt-6 flex flex-col gap-2 text-xs'>
              <li>
                <Tick className='text-success' />
                <span>Unlimited swipes</span>
              </li>
              <li>
                <Tick className='text-success' />
                <span>Advanced filters</span>
              </li>
              <li>
                <Tick className='text-success' />
                <span>See who liked you</span>
              </li>
              <li>
                <Tick className='text-success' />
                <span>Verified badge</span>
              </li>
              <li>
                <Tick className='text-success' />
                <span>Profile analytics</span>
              </li>
              <li>
                <Tick className='text-success' />
                <span>Early access to new features (Rewind last swipe)</span>
              </li>
            </ul>
            <div className='mt-6'>
              <button className='btn btn-block bg-amber-500' onClick={() => handleBuy('gold')}>
                {loginUser?.isPremium && loginUser?.membershipType === 'gold'
                  ? 'Active Plan'
                  : 'Buy Gold'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showToast && (
        <div className='toast toast-top toast-center'>
          <div className='alert alert-success'>
            <span>
              You have{' '}
              {loginUser?.isPremium && loginUser?.membershipType === 'gold' ? 'Gold' : 'Silver'}{' '}
              Premium.
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default Premium;
