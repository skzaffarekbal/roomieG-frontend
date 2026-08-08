import axios from 'axios';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';
import { BASE_URL } from '../utils/constant';

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + '/request/send/' + status + '/' + userId,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='card bg-base-300 w-96 h-1/2 md:h-full shadow-xl'>
      <figure>
        <img className='w-96' src={photoUrl} alt='photo' />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{firstName + ' ' + lastName}</h2>
        {age && gender && <p>{age + ', ' + gender}</p>}
        <p>{about}</p>
        <div className='card-actions justify-center my-4'>
          <button className='btn btn-primary' onClick={() => handleSendRequest('ignored', _id)}>
            Ignore
          </button>
          <button
            className='btn btn-secondary'
            onClick={() => handleSendRequest('interested', _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserCard;
