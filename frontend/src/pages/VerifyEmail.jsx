import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');
    axios
      .get(`${API_BASE_URL}/verify-email/?uid=${uid}&token=${token}`)
      .then(() => setMessage('Email verified. You can now log in.'))
      .catch(() => setMessage('Verification failed.'));
  }, []);

  return <p>{message}</p>;
};

export default VerifyEmail;
