import TickIcon from '../assets/icon/TickIcon';
import { addUser } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { verifyPremiumApi, createPaymentOrderApi } from '../api/paymentApi';

function Premium() {
  const dispatch = useDispatch();
  const loginUser = useSelector((state) => state.user);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
      setIsProcessing(true);
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
          name: notes
            ? `${notes.firstName} ${notes.lastName}`
            : `${loginUser?.firstName || ''} ${loginUser?.lastName || ''}`,
          email: notes?.emailId || loginUser?.emailId || '',
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
      console.error(error?.response?.data?.error || error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='flex-1 max-w-6xl w-full mx-auto px-4 py-12 space-y-10'>
      <div className='text-center space-y-2 max-w-2xl mx-auto'>
        <div className='inline-flex items-center gap-1.5 badge badge-primary badge-outline text-xs font-semibold'>
          👑 RoomieG Membership
        </div>
        <h1 className='text-3xl sm:text-4xl font-extrabold text-base-content'>
          Upgrade Your Roommate Discovery
        </h1>
        <p className='text-xs sm:text-sm opacity-70'>
          Get unlimited daily matches, advanced lifestyle filtering, verified badges, and priority
          profile placement.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch'>
        {/* Free Starter */}
        <div className='card bg-base-200/60 border border-base-300 shadow-md rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 transition-all'>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <span className='badge badge-sm badge-primary font-bold'>Starter</span>
              <span className='text-xs font-semibold opacity-60'>Standard</span>
            </div>
            <div>
              <h2 className='text-3xl font-extrabold text-base-content'>Free</h2>
              <p className='text-xs opacity-70 mt-1'>
                Basic discovery features to find flatmates in your city.
              </p>
            </div>
            <ul className='space-y-3 text-xs'>
              <li className='flex items-center gap-2.5'>
                <TickIcon className='text-success' /> <span>10 swipes per day</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <TickIcon className='text-success' /> <span>Mutual match & live chat</span>
              </li>
              <li className='flex items-center gap-2.5 opacity-40 line-through'>
                <TickIcon className='text-base-content/40' />{' '}
                <span>Advanced lifestyle filters</span>
              </li>
              <li className='flex items-center gap-2.5 opacity-40 line-through'>
                <TickIcon className='text-base-content/40' />{' '}
                <span>See who liked your profile</span>
              </li>
              <li className='flex items-center gap-2.5 opacity-40 line-through'>
                <TickIcon className='text-base-content/40' /> <span>Verified badge & rewind</span>
              </li>
            </ul>
          </div>
          <div className='pt-8'>
            <button className='btn btn-outline btn-block rounded-2xl font-bold' disabled>
              {loginUser?.isPremium ? 'Free Tier' : 'Current Plan'}
            </button>
          </div>
        </div>

        {/* Silver Plan */}
        <div className='card bg-base-100 border-2 border-slate-400 shadow-xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative hover:shadow-2xl transition-all'>
          <span className='badge badge-sm bg-slate-400 text-white font-bold absolute -top-3 right-8 shadow-sm'>
            Most Popular
          </span>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <span className='badge badge-sm bg-slate-400 text-white font-bold'>Silver</span>
              <span className='text-xs font-semibold opacity-60'>Monthly</span>
            </div>
            <div>
              <div className='flex items-baseline gap-1'>
                <h2 className='text-3xl font-black text-base-content'>₹99</h2>
                <span className='text-xs opacity-70'>/ month</span>
              </div>
              <p className='text-xs opacity-70 mt-1'>
                Essential power features for active apartment searchers.
              </p>
            </div>
            <ul className='space-y-3 text-xs'>
              <li className='flex items-center gap-2.5'>
                <TickIcon className='text-success' /> <span>10 swipes per day</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <TickIcon className='text-success' />{' '}
                <span>Advanced lifestyle & habit filters</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <TickIcon className='text-success' /> <span>See who sent you requests</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <TickIcon className='text-success' /> <span>Profile boost & views</span>
              </li>
              <li className='flex items-center gap-2.5 opacity-40 line-through'>
                <TickIcon className='text-base-content/40' /> <span>Unlimited swipes</span>
              </li>
            </ul>
          </div>
          <div className='pt-8'>
            <button
              className='btn bg-slate-400 hover:bg-slate-500 text-white btn-block rounded-2xl font-bold shadow-md'
              disabled={isProcessing}
              onClick={() => handleBuy('silver')}
            >
              {loginUser?.isPremium && loginUser?.membershipType === 'silver'
                ? 'Active Plan ✓'
                : 'Get Silver Plan'}
            </button>
          </div>
        </div>

        {/* Gold Plan */}
        <div className='card bg-base-100 border-2 border-amber-400 shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative hover:shadow-amber-500/20 transition-all'>
          <span className='badge badge-sm badge-warning text-white font-bold absolute -top-3 right-8 shadow-sm'>
            Best Value
          </span>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <span className='badge badge-sm badge-warning text-white font-bold'>Gold VIP</span>
              <span className='text-xs font-semibold opacity-60'>Monthly</span>
            </div>
            <div>
              <div className='flex items-baseline gap-1'>
                <h2 className='text-3xl font-black text-amber-500'>₹199</h2>
                <span className='text-xs opacity-70'>/ month</span>
              </div>
              <p className='text-xs opacity-70 mt-1'>
                Unlimited discovery with verified VIP status and rewind.
              </p>
            </div>
            <ul className='space-y-3 text-xs'>
              <li className='flex items-center gap-2.5'>
                <TickIcon className='text-success' /> <strong>Unlimited daily swipes</strong>
              </li>
              <li className='flex items-center gap-2.5'>
                <TickIcon className='text-success' /> <span>Verified VIP Gold Badge</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <TickIcon className='text-success' /> <span>Rewind accidental passes</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <TickIcon className='text-success' />{' '}
                <span>Advanced filters & priority visibility</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <TickIcon className='text-success' />{' '}
                <span>Profile analytics & direct chat boosts</span>
              </li>
            </ul>
          </div>
          <div className='pt-8'>
            <button
              className='btn bg-amber-500 hover:bg-amber-600 text-white btn-block rounded-2xl font-bold shadow-lg shadow-amber-500/30'
              disabled={isProcessing}
              onClick={() => handleBuy('gold')}
            >
              {loginUser?.isPremium && loginUser?.membershipType === 'gold'
                ? 'Active Plan ✓'
                : 'Get Gold VIP'}
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className='toast toast-top toast-center z-50'>
          <div className='alert alert-success text-white font-semibold text-xs shadow-lg'>
            <span>
              You already have active {loginUser?.membershipType === 'gold' ? 'Gold' : 'Silver'}{' '}
              Premium.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Premium;
