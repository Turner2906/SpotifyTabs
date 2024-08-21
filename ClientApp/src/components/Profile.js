import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userTopArtists, setUserTopArtists] = useState(null);
  const [userTopTracks, setUserTopTracks] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const query = "Everlong"
      if (accessToken) {
        try {
          const user = await axios.get(`https://localhost:44461/api/spotify/userdata?accessToken=${accessToken}`);
          const song_test = await axios.get(`https://localhost:44461/api/songsterr/search?query=${query}`);
          setUserInfo(JSON.parse(user.data.userInfo));
          setUserTopArtists(JSON.parse(user.data.topArtists));
          setUserTopTracks(JSON.parse(user.data.topTracks));
        } catch (error) {
          console.error('Error fetching user information', error);
        }
      }
      else {
        navigate('/signin');
      }
    };

    fetchUserInfo();
  }, [searchParams]);

  return (
    <div>
      {userInfo ? (
        <div>
          <div className="profile-header">
            <img src={userInfo.images[0].url} alt="Profile" />
            <h1 style={{ fontWeight: "bold" }}>{userInfo.display_name}</h1>
          </div>
          <div className="spotify-list-wrapper">
            <div className="top-artists-container">
              <h2>Your Top Artists</h2>
              <ul className="top-artists-list">
                {userTopArtists.items.map((artist, index) => (
                  <li key={artist.id} className="top-artist-item">
                    <img src={artist.images[0].url} alt={artist.name} className="artist-image" />
                    <span className="artist-rank">{index + 1}</span>
                    <span className="artist-name">{artist.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="top-artists-container">
              <h2>Your Top Tracks</h2>
              <ul className="top-artists-list">
                {userTopTracks.items.map((track, index) => (
                  <li key={track.id} className="top-artist-item">
                    <img src={track.album.images[0].url} alt={track.name} className="album-image" />
                    <span className="artist-rank">{index + 1}</span>
                    <span className="artist-name">{track.name}</span>
                    <span className="song-name">{track.artists[0].name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
