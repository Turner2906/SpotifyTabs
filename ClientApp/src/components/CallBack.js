import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const CallBack = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const getAccessToken = async (code) => {
      try {
        const response = await axios.get(`/api/spotify/callback?code=${code}`);
        localStorage.setItem('accessToken', response.data);
        // localStorage.setItem('timeRange', 'medium_term');
        navigate('/profile');
      } catch (error) {
        console.error('Error fetching access token', error);
      }
    };

    const code = searchParams.get('code');
    if (code) {
      getAccessToken(code);
    }
  }, [navigate, searchParams]);

  return <div>Loading...</div>;
};

export default CallBack;
