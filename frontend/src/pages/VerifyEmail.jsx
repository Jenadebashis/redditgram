import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');
    axios
      .get(`http://localhost:9000/api/verify-email/?uid=${uid}&token=${token}`)
      .then(() => setMessage('Email verified. You can now log in.'))
      .catch(() => setMessage('Verification failed.'));
  }, []);

  return <p>{message}</p>;
};

export default VerifyEmail;
