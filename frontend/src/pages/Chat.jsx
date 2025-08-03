import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import API from '../api';
import { WS_BASE_URL } from '../config';

const Chat = () => {
  const { username } = useParams();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const ws = useRef(null);
  const { register, handleSubmit, reset } = useForm();

  const connectSocket = () => {
    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) return;
    const token = localStorage.getItem('access');
    const socket = new WebSocket(`${WS_BASE_URL}/ws/chat/${username}/?token=${token}`);
    ws.current = socket;
    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setMessages((prev) => [...prev, msg]);
    };
    socket.onopen = () => setError('');

    const isDev = import.meta.env.DEV;

    const getMessage = (event, fallback) => {
      if (event.code === 4401) return 'Authentication failed';
      if (event.code === 1006) return 'Server unavailable';
      return fallback;
    };

    socket.onerror = (event) => {
      if (isDev) {
        console.error('WebSocket error', {
          code: event.code,
          reason: event.reason,
          readyState: socket.readyState
        });
      }
      setError(getMessage(event, 'Unable to connect to chat.'));
    };

    socket.onclose = (event) => {
      if (isDev) {
        console.warn('WebSocket closed', {
          code: event.code,
          reason: event.reason,
          readyState: socket.readyState
        });
      }
      setError(getMessage(event, 'Connection lost. Reconnecting...'));
      ws.current = null;
      setTimeout(() => {
        if (!ws.current) connectSocket();
      }, 1000);
    };
  };

  useEffect(() => {
    API.get(`/messages/${username}/`).then((res) => {
      const data = res.data.results || res.data;
      setMessages(data.reverse());
    });
    connectSocket();
    return () => ws.current && ws.current.close();
  }, [username]);

  const onSubmit = (data) => {
    if (!ws.current) return;
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ message: data.message }));
      reset();
    } else {
      setError('Connection lost. Reconnecting...');
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        connectSocket();
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Chat with {username}</h2>
      <ul className="border h-64 overflow-y-auto p-2 mb-4">
        {messages.map((m) => (
          <li key={m.id || Math.random()} className="mb-1">
            <strong>{m.sender}</strong>: {m.content}
          </li>
        ))}
      </ul>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2">
        <input
          {...register('message', { required: true })}
          className="flex-1 border p-2"
          placeholder="Type a message"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
