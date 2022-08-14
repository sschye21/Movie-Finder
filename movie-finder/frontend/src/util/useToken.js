// custom useToken hook

import { useState } from 'react';

export default function useToken() {
  const [token, setToken] = useState(getToken());

  const saveToken = token => {
    sessionStorage.setItem('token', token);
    setToken(token);
  };

  return {
    setToken: saveToken,
    token
  }
}

export const getToken = () => {
    return sessionStorage.getItem('token')
  };