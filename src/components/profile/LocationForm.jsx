import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/userSlice';
import { updateLocationApi } from '../../api/profileApi';

function LocationForm({ user, onUpdateLivePreview }) {
  const dispatch = useDispatch();

  const locObj = typeof user?.location === 'object' && user?.location !== null ? user.location : {};

  const [city, setCity] = useState(
    locObj.city || (typeof user?.location === 'string' ? user.location : ''),
  );
  const [area, setArea] = useState(locObj.area || '');
  const [state, setState] = useState(locObj.state || '');
  const [country, setCountry] = useState(locObj.country || 'India');

  // Coordinates: GeoJSON [longitude, latitude]
  const existingCoords = Array.isArray(locObj.coordinates?.coordinates)
    ? locObj.coordinates.coordinates
    : null;

  const [longitude, setLongitude] = useState(
    existingCoords && typeof existingCoords[0] === 'number' ? existingCoords[0] : '',
  );
  const [latitude, setLatitude] = useState(
    existingCoords && typeof existingCoords[1] === 'number' ? existingCoords[1] : '',
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [locating, setLocating] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const triggerLivePreview = (overrides = {}) => {
    if (!onUpdateLivePreview) return;
    const currentLoc = {
      city,
      area,
      state,
      country,
      coordinates:
        longitude !== '' && latitude !== ''
          ? {
              type: 'Point',
              coordinates: [Number(longitude), Number(latitude)],
            }
          : undefined,
      ...overrides,
    };
    onUpdateLivePreview({ location: currentLoc });
  };

  // Search places using OpenStreetMap Nominatim (Free, no API key needed)
  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      setError('');
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery,
        )}&addressdetails=1&limit=5`,
      );
      const data = await res.json();
      setSearchResults(data || []);
      if (!data || data.length === 0) {
        setError('No locations found for this query');
      }
    } catch {
      setError('Failed to search location. Please enter manually.');
    } finally {
      setSearching(false);
    }
  };

  // Select place from search results
  const handleSelectPlace = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const address = place.address || {};

    const detectedCity =
      address.city ||
      address.town ||
      address.village ||
      address.county ||
      address.state_district ||
      '';
    const detectedArea =
      address.suburb || address.neighbourhood || address.residential || address.road || '';
    const detectedState = address.state || '';
    const detectedCountry = address.country || 'India';

    if (detectedCity) setCity(detectedCity);
    if (detectedArea) setArea(detectedArea);
    if (detectedState) setState(detectedState);
    if (detectedCountry) setCountry(detectedCountry);
    setLatitude(lat);
    setLongitude(lon);
    setSearchResults([]);
    setSearchQuery('');

    triggerLivePreview({
      city: detectedCity || city,
      area: detectedArea || area,
      state: detectedState || state,
      country: detectedCountry || country,
      coordinates: {
        type: 'Point',
        coordinates: [lon, lat],
      },
    });
  };

  // Use browser GPS geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);

        try {
          // Reverse geocode to get city and area
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
          );
          const data = await res.json();
          const address = data?.address || {};

          const detectedCity =
            address.city || address.town || address.village || address.county || '';
          const detectedArea =
            address.suburb || address.neighbourhood || address.residential || address.road || '';
          const detectedState = address.state || '';
          const detectedCountry = address.country || 'India';

          if (detectedCity) setCity(detectedCity);
          if (detectedArea) setArea(detectedArea);
          if (detectedState) setState(detectedState);
          if (detectedCountry) setCountry(detectedCountry);

          triggerLivePreview({
            city: detectedCity || city,
            area: detectedArea || area,
            state: detectedState || state,
            country: detectedCountry || country,
            coordinates: {
              type: 'Point',
              coordinates: [lon, lat],
            },
          });
        } catch {
          triggerLivePreview({
            coordinates: {
              type: 'Point',
              coordinates: [lon, lat],
            },
          });
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setError(err.message || 'Unable to retrieve your location');
      },
      { timeout: 10000 },
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setSaving(true);
      const payload = {
        city: city.trim(),
        area: area.trim() || undefined,
        state: state.trim() || undefined,
        country: country.trim() || 'India',
        coordinates:
          longitude !== '' && latitude !== ''
            ? {
                type: 'Point',
                coordinates: [Number(longitude), Number(latitude)],
              }
            : undefined,
      };

      const res = await updateLocationApi(payload);
      if (res?.data) {
        dispatch(addUser(res.data));
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.response?.data?.message || 'Failed to save location',
      );
    } finally {
      setSaving(false);
    }
  };

  const hasCoords = latitude !== '' && longitude !== '';

  return (
    <form onSubmit={handleSave} className='space-y-5 text-base-content'>
      <div className='flex items-center justify-between border-b border-base-300 pb-2'>
        <div>
          <h3 className='font-bold text-lg'>Location & Map Coordinates</h3>
          <p className='text-xs opacity-70'>
            Where you live or look for flatmates. Coordinates enable distance-based matching.
          </p>
        </div>
        {success && (
          <span className='badge badge-success text-white badge-sm font-semibold animate-pulse'>
            Saved ✓
          </span>
        )}
      </div>

      {/* Map Search & Auto Detect Tool */}
      <div className='p-3.5 bg-base-200/60 rounded-2xl border border-base-300/80 space-y-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <span className='text-xs font-bold uppercase tracking-wider opacity-70'>
            Find on Map / Auto-Detect
          </span>
          <button
            type='button'
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className='btn btn-xs btn-outline btn-primary rounded-lg gap-1.5'
          >
            {locating ? (
              <span className='loading loading-spinner loading-xs'></span>
            ) : (
              <span>🎯 Use My Current GPS Location</span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className='relative'>
          <div className='join w-full'>
            <input
              type='text'
              placeholder='Search address, neighborhood or landmark (e.g. Sony Signal Koramangala)...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchLocation(e);
                }
              }}
              className='input input-bordered input-sm join-item w-full bg-base-100 text-xs'
            />
            <button
              type='button'
              onClick={handleSearchLocation}
              disabled={searching}
              className='btn btn-primary btn-sm join-item'
            >
              {searching ? <span className='loading loading-spinner loading-xs'></span> : 'Search'}
            </button>
          </div>

          {/* Search suggestions dropdown */}
          {searchResults.length > 0 && (
            <ul className='absolute z-50 mt-1 w-full bg-base-100 rounded-xl shadow-xl border border-base-300 max-h-52 overflow-y-auto divide-y text-xs'>
              {searchResults.map((result, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelectPlace(result)}
                  className='p-2.5 hover:bg-base-200 cursor-pointer flex items-center gap-2 transition-colors'
                >
                  <span className='text-sm'>📍</span>
                  <span className='line-clamp-1'>{result.display_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Coordinates Preview / Map Link */}
        {hasCoords && (
          <div className='flex flex-wrap items-center justify-between gap-2 p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-xs'>
            <div className='flex items-center gap-2'>
              <span className='badge badge-primary badge-xs'>GeoJSON Point</span>
              <span className='font-mono text-[11px] opacity-80'>
                Lat: {Number(latitude).toFixed(5)}, Lng: {Number(longitude).toFixed(5)}
              </span>
            </div>
            <a
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target='_blank'
              rel='noreferrer'
              className='btn btn-ghost btn-xs text-primary font-bold gap-1'
            >
              <span>🗺️ View on Google Maps</span> ↗
            </a>
          </div>
        )}
      </div>

      {/* Manual Input Fields */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>City *</label>
          <input
            type='text'
            required
            placeholder='Bengaluru, Mumbai, Delhi...'
            value={city}
            onChange={(e) => {
              const val = e.target.value;
              setCity(val);
              triggerLivePreview({ city: val });
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/90 text-xs'
          />
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Area / Locality</label>
          <input
            type='text'
            placeholder='Koramangala, Indiranagar, HSR Layout...'
            value={area}
            onChange={(e) => {
              const val = e.target.value;
              setArea(val);
              triggerLivePreview({ area: val });
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/90 text-xs'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>State</label>
          <input
            type='text'
            placeholder='Karnataka, Maharashtra...'
            value={state}
            onChange={(e) => {
              const val = e.target.value;
              setState(val);
              triggerLivePreview({ state: val });
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/90 text-xs'
          />
        </div>

        <div className='form-control'>
          <label className='label py-1 text-xs font-semibold'>Country</label>
          <input
            type='text'
            value={country}
            onChange={(e) => {
              const val = e.target.value;
              setCountry(val);
              triggerLivePreview({ country: val });
            }}
            className='input input-bordered input-sm rounded-xl bg-base-200/90 text-xs'
          />
        </div>
      </div>

      {/* Direct coordinate overrides (optional for user) */}
      <div className='collapse collapse-arrow bg-base-200/40 rounded-2xl border border-base-200'>
        <input type='checkbox' />
        <div className='collapse-title text-xs font-bold py-2 min-h-0'>
          Advanced: Custom Coordinates (Latitude & Longitude)
        </div>
        <div className='collapse-content space-y-2 pt-0'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <div className='form-control'>
              <label className='label py-1 text-[11px] font-semibold'>Latitude</label>
              <input
                type='number'
                step='any'
                placeholder='12.9352'
                value={latitude}
                onChange={(e) => {
                  const val = e.target.value;
                  setLatitude(val);
                  triggerLivePreview({
                    coordinates:
                      val !== '' && longitude !== ''
                        ? { type: 'Point', coordinates: [Number(longitude), Number(val)] }
                        : undefined,
                  });
                }}
                className='input input-bordered input-sm rounded-xl bg-base-100 text-xs'
              />
            </div>
            <div className='form-control'>
              <label className='label py-1 text-[11px] font-semibold'>Longitude</label>
              <input
                type='number'
                step='any'
                placeholder='77.6245'
                value={longitude}
                onChange={(e) => {
                  const val = e.target.value;
                  setLongitude(val);
                  triggerLivePreview({
                    coordinates:
                      latitude !== '' && val !== ''
                        ? { type: 'Point', coordinates: [Number(val), Number(latitude)] }
                        : undefined,
                  });
                }}
                className='input input-bordered input-sm rounded-xl bg-base-100 text-xs'
              />
            </div>
          </div>
          <p className='text-[10px] opacity-60'>
            GeoJSON format expects <code>[longitude, latitude]</code> in order.
          </p>
        </div>
      </div>

      {error && (
        <div className='alert alert-error text-white text-xs rounded-xl p-2.5 shadow-xs'>
          <span>{error}</span>
        </div>
      )}

      <div className='pt-2 flex justify-end'>
        <button
          type='submit'
          disabled={saving}
          className='btn btn-primary btn-sm rounded-xl font-bold px-6 shadow-md shadow-primary/20'
        >
          {saving ? <span className='loading loading-spinner loading-xs'></span> : 'Save Location'}
        </button>
      </div>
    </form>
  );
}

export default LocationForm;
