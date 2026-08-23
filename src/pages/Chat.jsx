import { useState, useRef, useEffect } from 'react';
import { createSocketConnection } from '../utils/socket';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';
import { format } from 'date-fns';
import { resetUnreadCount } from '../utils/unreadCountSlice';

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
        const targetUserRes = await axios.get(BASE_URL + '/user/profile/' + targetUserId, {
          withCredentials: true,
        });
        setTargetUser(targetUserRes?.data?.data);
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
        const prevScrollHeight = chatContainerRef.current.scrollHeight;

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
      socketRef.current.emit('fetchOldMessages', {
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
    <>
      {error && (
        <div className='toast toast-top toast-center'>
          <div className='alert alert-error'>
            <span>{error}</span>
          </div>
        </div>
      )}
      <div className='w-full max-w-md h-[85vh] flex flex-col bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden'>
        {/* 1. HEADER */}
        <div className='p-4 bg-base-100 border-b border-base-300 flex items-center justify-between shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='avatar online'>
              <div className='w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
                <img
                  src={targetUser?.photoUrl}
                  alt={(targetUser?.firstName[0] || '') + (targetUser?.lastName[0] || '') || 'User'}
                />
              </div>
            </div>
            <div>
              <h3 className='font-bold text-base-content text-sm md:text-base leading-none'>
                {targetUser?.firstName + ' ' + targetUser?.lastName}
              </h3>
            </div>
          </div>
        </div>

        {/* 2. CHAT HISTORY CONTAINER */}
        <div
          className='flex-1 overflow-y-auto p-4 space-y-3 bg-base-200/50'
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          {isFetchingOld && (
            <div className='flex justify-center my-2'>
              <span className='loading loading-spinner loading-sm text-primary'></span>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat ${msg.senderId == loginUserId ? 'chat-end' : 'chat-start'}`}
            >
              <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                  <img
                    alt={
                      (msg.senderId == loginUserId
                        ? loginUser?.firstName[0] || ''
                        : targetUser?.firstName[0] || '') +
                        (msg.senderId == loginUserId
                          ? loginUser?.lastName[0] || ''
                          : targetUser?.lastName[0] || '') || 'User'
                    }
                    src={msg.senderId == loginUserId ? loginUser?.photoUrl : targetUser?.photoUrl}
                  />
                </div>
              </div>
              <div className='chat-header'>
                {msg.senderId == loginUserId
                  ? loginUser?.firstName + ' ' + loginUser?.lastName
                  : targetUser?.firstName + ' ' + targetUser?.lastName}
                <time className='chat-footer opacity-50'>
                  {format(new Date(msg.createdAt), 'd MMM yy, h:mm a')}
                </time>
              </div>
              <div
                className={`chat-bubble text-sm min-h-0 shadow-sm ${
                  msg.senderId == loginUserId ? 'chat-bubble-primary' : 'chat-bubble-neutral'
                }`}
              >
                {msg.text}
              </div>
              {msg.senderId == loginUserId ? (
                <div className='chat-footer opacity-50'>
                  {msg.seen
                    ? `Seen at ${format(new Date(msg.seenAt), 'd MMM yy, h:mm a')}`
                    : 'Delivered'}
                </div>
              ) : (
                ''
              )}
            </div>
          ))}
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
            className='input input-bordered input-md flex-1 rounded-xl bg-base-200/50 focus:outline-none text-sm'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type='submit'
            className='btn btn-primary btn-md rounded-xl font-medium px-4 shadow-md'
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
export default Chat;
