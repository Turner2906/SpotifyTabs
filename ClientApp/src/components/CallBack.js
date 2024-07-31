import React, { useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Callback = () => {
  const history = useHistory();

  useEffect(() => {
    const getAccessToken = async (code) => {
      try {
        const response = await axios.get(`/api/spotify/callback?code=${code}`);
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        history.push('/profile');
      } catch (error) {
        console.error('Error fetching access token', error);
      }
    };

    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');
    if (code) {
      getAccessToken(code);
    }
  }, [history]);

  return <div>Loading...</div>;
};

export default Callback;
