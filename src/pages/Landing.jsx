import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Tick from '../assets/icon/TickIcon';

function Landing() {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  // const [activeTab, setActiveTab] = useState('lifestyle');

  const demoProfiles = [
    {
      name: 'Aarav Sharma',
      age: 24,
      occupation: 'Software Engineer @ TechCorp',
      location: 'Koramangala, Bangalore',
      photoUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      lifestyle: {
        sleep: 'Early Bird (10 PM - 6 AM)',
        food: 'Vegetarian',
        work: 'Hybrid',
        cleanliness: 'High',
        pets: 'Pet Friendly 🐶',
        smoking: 'Non-Smoker 🚭',
      },
      matchScore: 96,
      bio: 'Looking for a calm, friendly flatmate around Koramangala. I love weekend cooking and morning runs.',
    },
    {
      name: 'Priya Patel',
      age: 23,
      occupation: 'Product Designer @ StudioX',
      location: 'Indiranagar, Bangalore',
      photoUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
      lifestyle: {
        sleep: 'Night Owl (1 AM - 9 AM)',
        food: 'Flexible',
        work: 'Remote',
        cleanliness: 'Moderate',
        pets: 'Love Cats 🐱',
        smoking: 'Non-Smoker 🚭',
      },
      matchScore: 92,
      bio: 'Enjoys good coffee, music, and quiet work hours. Looking for a neat 2BHK flatmate.',
    },
  ];

  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const activeProfile = demoProfiles[currentDemoIndex];

  return (
    <div className='flex flex-col min-h-screen text-base-content'>
      {/* 1. HERO SECTION */}
      <section className='relative overflow-hidden bg-linear-to-b from-base-200/60 via-base-100 to-base-100 py-16 md:py-24'>
        <div className='absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none'></div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
            {/* Left Content */}
            <div className='lg:col-span-7 space-y-6 text-center lg:text-left'>
              <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide'>
                <span className='w-2 h-2 rounded-full bg-primary animate-pulse'></span>
                Smart Roommate Matching Platform
              </div>

              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight'>
                Find the{' '}
                <span className='text-primary underline decoration-wavy decoration-primary/40'>
                  right roommate
                </span>
                , not just an empty room.
              </h1>

              <p className='text-base sm:text-lg opacity-80 max-w-2xl mx-auto lg:mx-0 leading-relaxed'>
                RoomieG connects you with compatible roommates based on lifestyle habits, sleep
                schedules, cleanliness, food preferences, and daily routines.
              </p>

              <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2'>
                {user ? (
                  <Link
                    to='/profile'
                    className='btn btn-primary btn-lg shadow-lg shadow-primary/25 rounded-2xl w-full sm:w-auto font-bold'
                  >
                    Go to Your Feed 🚀
                  </Link>
                ) : (
                  <>
                    <Link
                      to='/login?mode=register'
                      className='btn btn-primary btn-lg shadow-lg shadow-primary/25 rounded-2xl w-full sm:w-auto font-bold text-base'
                    >
                      Find Your Roommate Free
                    </Link>
                    <Link
                      to='/login?mode=login'
                      className='btn btn-outline btn-lg rounded-2xl w-full sm:w-auto font-medium text-base'
                    >
                      Login to Account
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className='pt-6 border-t border-base-300/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs opacity-75'>
                <div className='flex items-center gap-1.5'>
                  <span className='text-success text-base'>✓</span> Verified Profiles
                </div>
                <div className='flex items-center gap-1.5'>
                  <span className='text-success text-base'>✓</span> Privacy-First Photos
                </div>
                <div className='flex items-center gap-1.5'>
                  <span className='text-success text-base'>✓</span> Real-Time Messaging
                </div>
                <div className='flex items-center gap-1.5'>
                  <span className='text-success text-base'>✓</span> No Middleman Brokerage
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup */}
            <div className='lg:col-span-5 flex justify-center'>
              <div className='card bg-base-100 border border-base-300 shadow-2xl rounded-3xl w-full max-w-sm overflow-hidden hover:shadow-primary/10 transition-all'>
                {/* Mock Card Header */}
                <div className='p-3 bg-base-200 border-b border-base-300 flex items-center justify-between text-xs font-semibold'>
                  <span className='badge badge-primary badge-sm font-bold'>
                    {activeProfile.matchScore}% Match Compatibility
                  </span>
                  <button
                    onClick={() => setCurrentDemoIndex((prev) => (prev === 0 ? 1 : 0))}
                    className='btn btn-ghost btn-xs text-primary font-bold'
                  >
                    Next Profile ↻
                  </button>
                </div>

                {/* Profile Photo */}
                <div className='relative h-64 w-full bg-base-300 overflow-hidden'>
                  <img
                    src={activeProfile.photoUrl}
                    alt={activeProfile.name}
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 text-white'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-bold text-xl'>
                          {activeProfile.name}, {activeProfile.age}
                        </h3>
                        <p className='text-xs opacity-90'>{activeProfile.occupation}</p>
                      </div>
                      <span className='badge badge-success text-white badge-xs'>Active</span>
                    </div>
                    <p className='text-[11px] opacity-80 mt-1'>📍 {activeProfile.location}</p>
                  </div>
                </div>

                {/* Card Body - Lifestyle Pills */}
                <div className='card-body p-4 space-y-3 bg-base-100'>
                  <p className='text-xs opacity-80 italic line-clamp-2'>"{activeProfile.bio}"</p>

                  <div className='space-y-1.5'>
                    <div className='text-[11px] font-bold uppercase tracking-wider opacity-60'>
                      Lifestyle Highlights
                    </div>
                    <div className='flex flex-wrap gap-1.5 text-xs'>
                      <span className='badge badge-neutral badge-sm'>
                        {activeProfile.lifestyle.sleep}
                      </span>
                      <span className='badge badge-neutral badge-sm'>
                        {activeProfile.lifestyle.food}
                      </span>
                      <span className='badge badge-neutral badge-sm'>
                        {activeProfile.lifestyle.pets}
                      </span>
                      <span className='badge badge-neutral badge-sm'>
                        {activeProfile.lifestyle.smoking}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className='grid grid-cols-2 gap-2 pt-2 border-t border-base-200'>
                    <button
                      onClick={() => setCurrentDemoIndex((prev) => (prev === 0 ? 1 : 0))}
                      className='btn btn-outline btn-sm rounded-xl'
                    >
                      👎 Pass
                    </button>
                    <button
                      onClick={() => navigate('/login?mode=register')}
                      className='btn btn-primary btn-sm rounded-xl shadow-md'
                    >
                      ❤️ Interested
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS / USER JOURNEY */}
      <section className='py-16 bg-base-200/50 border-y border-base-300'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto space-y-3 mb-12'>
            <div className='badge badge-primary badge-outline font-semibold'>
              Simple 4-Step Process
            </div>
            <h2 className='text-3xl sm:text-4xl font-extrabold'>How RoomieG Works</h2>
            <p className='opacity-70 text-sm sm:text-base'>
              From simple registration to instant real-time chats with compatible flatmates in your
              favorite city.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Step 1 */}
            <div className='card bg-base-100 border border-base-300 shadow-md p-6 rounded-2xl hover:border-primary/50 transition-all'>
              <div className='w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4'>
                1
              </div>
              <h3 className='font-bold text-lg mb-2'>Create Quick Profile</h3>
              <p className='text-xs opacity-75 leading-relaxed'>
                Sign up with your basic details, profile photo, and college or workplace.
              </p>
            </div>

            {/* Step 2 */}
            <div className='card bg-base-100 border border-base-300 shadow-md p-6 rounded-2xl hover:border-primary/50 transition-all'>
              <div className='w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4'>
                2
              </div>
              <h3 className='font-bold text-lg mb-2'>Set Lifestyle & Habits</h3>
              <p className='text-xs opacity-75 leading-relaxed'>
                Specify sleep schedules, food habits, cleanliness, pets, and work mode for
                high-accuracy matching.
              </p>
            </div>

            {/* Step 3 */}
            <div className='card bg-base-100 border border-base-300 shadow-md p-6 rounded-2xl hover:border-primary/50 transition-all'>
              <div className='w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4'>
                3
              </div>
              <h3 className='font-bold text-lg mb-2'>Browse & Connect</h3>
              <p className='text-xs opacity-75 leading-relaxed'>
                Swipe through tailored recommendations on your Feed. Send "Interested" requests
                securely.
              </p>
            </div>

            {/* Step 4 */}
            <div className='card bg-base-100 border border-base-300 shadow-md p-6 rounded-2xl hover:border-primary/50 transition-all'>
              <div className='w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4'>
                4
              </div>
              <h3 className='font-bold text-lg mb-2'>Instant Live Chat</h3>
              <p className='text-xs opacity-75 leading-relaxed'>
                Once connected, chat in real-time with instant notifications, read receipts, and
                arrange visits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section className='py-16 bg-base-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto space-y-3 mb-12'>
            <div className='badge badge-secondary badge-outline font-semibold'>
              Why Choose RoomieG
            </div>
            <h2 className='text-3xl sm:text-4xl font-extrabold'>
              Designed for Modern Roommate Discovery
            </h2>
            <p className='opacity-70 text-sm sm:text-base'>
              Traditional flatmate finding is chaotic. RoomieG solves compatibility before you sign
              any lease.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Feature 1 */}
            <div className='card bg-base-200/60 border border-base-300 p-6 rounded-2xl space-y-3'>
              <div className='text-3xl'>🎯</div>
              <h3 className='text-lg font-bold'>Lifestyle Compatibility</h3>
              <p className='text-xs opacity-75 leading-relaxed'>
                Filter potential roommates based on smoking, drinking, pet tolerance, cooking
                habits, and quiet hours to prevent living conflicts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='card bg-base-200/60 border border-base-300 p-6 rounded-2xl space-y-3'>
              <div className='text-3xl'>🔒</div>
              <h3 className='text-lg font-bold'>Privacy-First Controls</h3>
              <p className='text-xs opacity-75 leading-relaxed'>
                Photo blurring and secure location protections ensure you only share detailed
                personal info with accepted mutual connections.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='card bg-base-200/60 border border-base-300 p-6 rounded-2xl space-y-3'>
              <div className='text-3xl'>💬</div>
              <h3 className='text-lg font-bold'>Real-time Chat</h3>
              <p className='text-xs opacity-75 leading-relaxed'>
                Lightning-fast messaging with instant audio notification alerts, online status, and
                delivered/seen receipt indicators.
              </p>
            </div>

            {/* Feature 4 */}
            <div className='card bg-base-200/60 border border-base-300 p-6 rounded-2xl space-y-3'>
              <div className='text-3xl'>🎓</div>
              <h3 className='text-lg font-bold'>Students & Working Pros</h3>
              <p className='text-xs opacity-75 leading-relaxed'>
                Verified college badges for students and company organization badges for working
                professionals living in tech hubs.
              </p>
            </div>

            {/* Feature 5 */}
            <div className='card bg-base-200/60 border border-base-300 p-6 rounded-2xl space-y-3'>
              <div className='text-3xl'>⚡</div>
              <h3 className='text-lg font-bold'>Seamless Light & Dark Themes</h3>
              <p className='text-xs opacity-75 leading-relaxed'>
                Personalize your experience with curated DaisyUI themes like Light, Dark, Cupcake,
                Dracula, Emerald, and Synthwave.
              </p>
            </div>

            {/* Feature 6 */}
            <div className='card bg-base-200/60 border border-base-300 p-6 rounded-2xl space-y-3'>
              <div className='text-3xl'>👑</div>
              <h3 className='text-lg font-bold'>Premium Perks</h3>
              <p className='text-xs opacity-75 leading-relaxed'>
                Unlock unlimited daily swipes, advanced lifestyle filters, verified gold badges, and
                profile analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING PREVIEW */}
      <section className='py-16 bg-base-200/50 border-t border-base-300'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto space-y-3 mb-12'>
            <div className='badge badge-primary font-semibold'>Simple Pricing</div>
            <h2 className='text-3xl sm:text-4xl font-extrabold'>Transparent Plans for Everyone</h2>
            <p className='opacity-70 text-sm sm:text-base'>
              Start completely free or upgrade to Silver & Gold for unlimited discovery and verified
              benefits.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
            {/* Free Starter */}
            <div className='card bg-base-100 border border-base-300 shadow-sm rounded-2xl p-6 flex flex-col justify-between'>
              <div>
                <span className='badge badge-sm badge-primary'>Starter</span>
                <div className='flex justify-between items-baseline my-3'>
                  <h3 className='text-2xl font-bold'>Free Plan</h3>
                  <span className='text-lg font-semibold opacity-70'>₹0</span>
                </div>
                <p className='text-xs opacity-75 mb-4'>
                  Essential features to get you started matching with roommates.
                </p>
                <ul className='space-y-2 text-xs'>
                  <li className='flex items-center gap-2'>
                    <Tick className='text-success' /> 10 swipes / day
                  </li>
                  <li className='flex items-center gap-2'>
                    <Tick className='text-success' /> Match & Live Chat
                  </li>
                  <li className='flex items-center gap-2 opacity-40 line-through'>
                    <Tick className='text-base-content/40' /> Advanced Filters
                  </li>
                  <li className='flex items-center gap-2 opacity-40 line-through'>
                    <Tick className='text-base-content/40' /> Verified Badge
                  </li>
                </ul>
              </div>
              <div className='pt-6'>
                <Link
                  to='/login?mode=register'
                  className='btn btn-outline btn-block btn-sm rounded-xl'
                >
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Silver */}
            <div className='card bg-base-100 border-2 border-slate-400 shadow-md rounded-2xl p-6 flex flex-col justify-between relative'>
              <span className='badge badge-sm bg-slate-400 text-white absolute -top-3 right-6 shadow-sm'>
                Popular
              </span>
              <div>
                <span className='badge badge-sm bg-slate-400 text-white'>Silver</span>
                <div className='flex justify-between items-baseline my-3'>
                  <h3 className='text-2xl font-bold'>Silver Plan</h3>
                  <span className='text-lg font-semibold text-primary'>
                    ₹99<span className='text-xs font-normal opacity-70'>/mo</span>
                  </span>
                </div>
                <p className='text-xs opacity-75 mb-4'>
                  Ideal for active apartment seekers who want advanced discovery.
                </p>
                <ul className='space-y-2 text-xs'>
                  <li className='flex items-center gap-2'>
                    <Tick className='text-success' /> 10 swipes / day
                  </li>
                  <li className='flex items-center gap-2'>
                    <Tick className='text-success' /> Advanced Lifestyle Filters
                  </li>
                  <li className='flex items-center gap-2'>
                    <Tick className='text-success' /> See who liked your profile
                  </li>
                  <li className='flex items-center gap-2'>
                    <Tick className='text-success' /> Early feature access
                  </li>
                </ul>
              </div>
              <div className='pt-6'>
                <Link
                  to='/premium'
                  className='btn bg-slate-400 text-white hover:bg-slate-500 btn-block btn-sm rounded-xl'
                >
                  View Silver
                </Link>
              </div>
            </div>

            {/* Gold */}
            <div className='card bg-base-100 border-2 border-amber-400 shadow-lg rounded-2xl p-6 flex flex-col justify-between relative'>
              <span className='badge badge-sm badge-warning text-white absolute -top-3 right-6 shadow-sm'>
                Best Value
              </span>
              <div>
                <span className='badge badge-sm badge-warning text-white'>Gold</span>
                <div className='flex justify-between items-baseline my-3'>
                  <h3 className='text-2xl font-bold'>Gold Plan</h3>
                  <span className='text-lg font-semibold text-amber-500'>
                    ₹199<span className='text-xs font-normal opacity-70'>/mo</span>
                  </span>
                </div>
                <p className='text-xs opacity-75 mb-4'>
                  Unlimited discovery, verified badge, and priority placement.
                </p>
                <ul className='space-y-2 text-xs'>
                  <li className='flex items-center gap-2'>
                    <Tick className='text-success' /> <strong>Unlimited swipes</strong>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Tick className='text-success' /> Verified Gold Badge
                  </li>
                  <li className='flex items-center gap-2'>
                    <Tick className='text-success' /> Rewind last swipe
                  </li>
                  <li className='flex items-center gap-2'>
                    <Tick className='text-success' /> Profile analytics & Boost
                  </li>
                </ul>
              </div>
              <div className='pt-6'>
                <Link
                  to='/premium'
                  className='btn bg-amber-500 hover:bg-amber-600 text-white btn-block btn-sm rounded-xl shadow-md'
                >
                  View Gold
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION */}
      <section className='py-16 bg-base-100'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-3 mb-10'>
            <h2 className='text-3xl font-extrabold'>Frequently Asked Questions</h2>
            <p className='opacity-70 text-sm'>
              Everything you need to know about roommate search on RoomieG.
            </p>
          </div>

          <div className='space-y-3'>
            <div className='collapse collapse-plus bg-base-200 rounded-2xl border border-base-300'>
              <input type='radio' name='faq-accordion' defaultChecked />
              <div className='collapse-title font-semibold text-sm sm:text-base'>
                How does RoomieG calculate compatibility?
              </div>
              <div className='collapse-content text-xs sm:text-sm opacity-80 leading-relaxed'>
                We match you based on comprehensive lifestyle dimensions: sleep schedules, dietary
                habits (vegetarian, vegan, non-veg), cleanliness standards, work habits (WFO, WFH,
                Hybrid), pet preferences, and guest policies.
              </div>
            </div>

            <div className='collapse collapse-plus bg-base-200 rounded-2xl border border-base-300'>
              <input type='radio' name='faq-accordion' />
              <div className='collapse-title font-semibold text-sm sm:text-base'>
                Is my photo and location safe?
              </div>
              <div className='collapse-content text-xs sm:text-sm opacity-80 leading-relaxed'>
                Yes. RoomieG gives you full privacy controls including photo blurring and broad
                location display to protect your privacy until mutual interest is established.
              </div>
            </div>

            <div className='collapse collapse-plus bg-base-200 rounded-2xl border border-base-300'>
              <input type='radio' name='faq-accordion' />
              <div className='collapse-title font-semibold text-sm sm:text-base'>
                Can students and working professionals connect?
              </div>
              <div className='collapse-content text-xs sm:text-sm opacity-80 leading-relaxed'>
                Yes! You can filter profiles based on student or employment status, preferred
                housing budget, and move-in timelines.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className='py-16 bg-linear-to-r from-primary to-secondary text-primary-content text-center'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6'>
          <h2 className='text-3xl sm:text-4xl font-extrabold tracking-tight'>
            Ready to find your ideal roommate?
          </h2>
          <p className='text-base sm:text-lg opacity-90 max-w-xl mx-auto'>
            Join thousands of students and working professionals finding comfortable, compatible
            homes together.
          </p>
          <div className='pt-2'>
            <Link
              to='/login?mode=register'
              className='btn bg-base-100 text-base-content hover:bg-base-200 btn-lg rounded-2xl shadow-xl font-bold px-8'
            >
              Get Started for Free 🏡
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
