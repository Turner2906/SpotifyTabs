import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = searchParams.get('accessToken');
      if (accessToken) {
        try {
          const response = await axios.get(`https://localhost:44461/api/spotify/userinfo?accessToken=${accessToken}`);
          setUserInfo(response.data);
        } catch (error) {
          console.error('Error fetching user information', error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      {userInfo ? (
        <div>
          <p>Name: {userInfo.display_name}</p>
          <p>Email: {userInfo.email}</p>
          {userInfo.images && userInfo.images.length > 0 && (
            <img src={userInfo.images[0].url} alt="Profile" />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
