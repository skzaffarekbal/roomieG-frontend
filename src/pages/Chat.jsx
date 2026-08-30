import { useState, useRef, useEffect } from 'react';
import { createSocketConnection } from '../utils/socket';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { resetUnreadCount } from '../redux/unreadCountSlice';
import { getTargetUserProfileApi } from '../api/feedApi';

function Chat() {
  const { targetUserId } = useParams();
  const loginUser = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const loginUserId = loginUser?._id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const [error, setError] = useState('');
  const [isFetchingOld, setIsFetchingOld] = useState(false);
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        const targetUserRes = await getTargetUserProfileApi(targetUserId);
        setTargetUser(targetUserRes?.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (targetUserId) {
      fetchTargetUser();
    }
  }, [targetUserId]);

  useEffect(() => {
    if (!loginUserId || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit('joinChat', { loginUserId, targetUserId });

    socket.on('chatError', (message) => {
      setError(message);
      setTimeout(() => {
        setError('');
      }, 3000);
    });

    socket.on('chatHistory', (chatHistory) => {
      shouldAutoScroll.current = true;
      setMessages([...chatHistory]);

      dispatch(resetUnreadCount(targetUserId));

      const hasUnseen = chatHistory.some((msg) => msg.senderId === targetUserId && !msg.seen);
      if (hasUnseen) {
        socket.emit('markAsSeen', { loginUserId, targetUserId });
      }
    });

    socket.on('olderMessages', (olderMessages) => {
      if (olderMessages.length > 0) {
        shouldAutoScroll.current = false;
        // Save scroll position before updating messages
        const prevScrollHeight = chatContainerRef.current?.scrollHeight || 0;

        setMessages((prevMessages) => [...olderMessages, ...prevMessages]);

        // Restore scroll position after DOM updates
        setTimeout(() => {
          if (chatContainerRef.current) {
            const newScrollHeight = chatContainerRef.current.scrollHeight;
            chatContainerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
          }
          setIsFetchingOld(false);
        }, 0);
      } else {
        setIsFetchingOld(false); // No more messages to fetch
      }
    });

    socket.on('receivedMessage', (newMessage) => {
      shouldAutoScroll.current = true;
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (newMessage.senderId === targetUserId) {
        socket.emit('markAsSeen', { loginUserId, targetUserId });
      }
    });

    socket.on('messagesSeen', ({ seenBy }) => {
      if (seenBy === targetUserId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === loginUserId && !msg.seen
              ? { ...msg, seen: true, seenAt: new Date().toISOString() }
              : msg,
          ),
        );
      }
    });

    return () => {
      socket.off('chatHistory');
      socket.off('olderMessages');
      socket.off('receivedMessage');
      socket.off('messagesSeen');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [loginUserId, targetUserId, dispatch]);

  // Automatically scrolls to the newest message conditionally
  useEffect(() => {
    if (shouldAutoScroll.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && !isFetchingOld) {
      setIsFetchingOld(true);
      socketRef.current?.emit('fetchOldMessages', {
        loginUserId,
        targetUserId,
        skip: messages.length,
      });
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (socketRef.current) {
      shouldAutoScroll.current = true;
      socketRef.current.emit('sendMessage', {
        firstName: loginUser?.firstName,
        loginUserId,
        targetUserId,
        text: input,
      });
      setInput('');
    }
  };

  return (
    <div className='flex-1 flex flex-col items-center justify-center p-2 sm:p-4'>
      {error && (
        <div className='toast toast-top toast-center z-50'>
          <div className='alert alert-error text-white font-semibold text-xs shadow-lg'>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className='w-full max-w-2xl h-[82vh] flex flex-col bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden'>
        {/* 1. HEADER */}
        <div className='p-3.5 sm:p-4 bg-base-200/80 border-b border-base-300 flex items-center justify-between shadow-xs'>
          <div className='flex items-center gap-3'>
            <Link
              to='/connections'
              className='btn btn-ghost btn-circle btn-sm text-base-content'
              title='Back to Connections'
            >
              ←
            </Link>
            <div className='avatar online'>
              <div className='w-10 h-10 rounded-full ring-2 ring-primary/40 ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300'>
                {targetUser?.photo?.exactPhoto ? (
                  <img
                    src={targetUser?.photo?.exactPhoto}
                    alt={`${targetUser?.firstName} ${targetUser?.lastName}`}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-primary font-bold'>
                    {targetUser?.firstName?.[0] || 'U'}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className='font-bold text-base-content text-sm sm:text-base leading-tight'>
                {targetUser
                  ? `${targetUser.firstName} ${targetUser.lastName || ''}`
                  : 'Connecting...'}
              </h3>
              <p className='text-[11px] opacity-70 text-success font-medium'>Online • Live Chat</p>
            </div>
          </div>
        </div>

        {/* 2. CHAT HISTORY CONTAINER */}
        <div
          className='flex-1 overflow-y-auto p-4 space-y-3 bg-base-200/30'
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          {isFetchingOld && (
            <div className='flex justify-center my-2'>
              <span className='loading loading-spinner loading-sm text-primary'></span>
            </div>
          )}

          {messages.length === 0 ? (
            <div className='h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-70'>
              <div className='text-4xl'>👋</div>
              <p className='text-sm font-semibold text-base-content'>Start the conversation!</p>
              <p className='text-xs max-w-xs'>
                Say hi to {targetUser?.firstName || 'your match'} to break the ice and discuss flat
                preferences.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === loginUserId;
              return (
                <div
                  key={msg._id || msg.createdAt}
                  className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}
                >
                  <div className='chat-image avatar'>
                    <div className='w-8 h-8 rounded-full overflow-hidden bg-base-300 flex items-center justify-center text-xs font-bold text-primary'>
                      {(isMe ? loginUser?.photo?.exactPhoto : targetUser?.photo?.exactPhoto) ? (
                        <img
                          alt='avatar'
                          src={isMe ? loginUser?.photo?.exactPhoto : targetUser?.photo?.exactPhoto}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <span>
                          {(isMe ? loginUser?.firstName : targetUser?.firstName)?.[0] || 'U'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='chat-header text-[11px] opacity-70 mb-0.5 space-x-1.5'>
                    <span className='font-semibold text-base-content'>
                      {isMe ? 'You' : targetUser?.firstName}
                    </span>
                    <time className='opacity-60'>{format(new Date(msg.createdAt), 'h:mm a')}</time>
                  </div>
                  <div
                    className={`chat-bubble text-sm min-h-0 shadow-sm rounded-2xl ${
                      isMe ? 'chat-bubble-primary font-medium' : 'chat-bubble-neutral'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {isMe && (
                    <div className='chat-footer text-[10px] opacity-60 mt-0.5'>
                      {msg.seen ? `Seen at ${format(new Date(msg.seenAt), 'h:mm a')}` : 'Delivered'}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* 3. BOTTOM INPUT FOOTER */}
        <form
          onSubmit={handleSend}
          className='p-3 bg-base-100 border-t border-base-300 flex gap-2 items-center'
        >
          <input
            type='text'
            placeholder='Type a message...'
            className='input input-bordered input-md flex-1 rounded-2xl bg-base-200/60 focus:outline-none text-sm border-base-300'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type='submit'
            disabled={!input.trim()}
            className='btn btn-primary btn-md rounded-2xl font-bold px-5 shadow-md shadow-primary/20'
          >
            Send ✈️
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
