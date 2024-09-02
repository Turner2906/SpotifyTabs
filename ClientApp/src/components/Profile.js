import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { tabLink } from './utils.js';

export const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userTopArtists, setUserTopArtists] = useState(null);
  const [userTopTracks, setUserTopTracks] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [timeRange, setTimeRange] = useState(() => {
    return searchParams.get('timeRange') || 'medium_term';
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const user = await axios.get(`https://localhost:44461/api/spotify/usertop?accessToken=${accessToken}&timeRange=${timeRange}`);
          const check = JSON.parse(user.data.userInfo);
          if (check.error) {
            alert("You must be signed in to view your profile");
            navigate('/signin');
          }
          setUserInfo(JSON.parse(user.data.userInfo));
          setUserTopArtists(JSON.parse(user.data.topArtists).items);
          setUserTopTracks(JSON.parse(user.data.topTracks).items);
        } catch (error) {
          console.error('Error fetching user information', error);
        }
      }
      else {
        alert("Sign in to view your profile");
        navigate('/signin');
      }
    };

    fetchUserInfo();
  }, [searchParams, timeRange]);


  const timeRangeChange = (event) => {
    const current_time = event.target.value;
    setTimeRange(current_time);
    navigate(`/profile?timeRange=${current_time}`);
  };

  const fullSongs = () => {
    navigate(`/profile/songs?timeRange=${timeRange}`);
  };

  return (
    <div>
      {userInfo ? (
        <div>
          <div className="profile-header">
            <img src={userInfo.images[1].url} alt="Profile" />
            <h1 style={{ fontWeight: "bold" }}>{userInfo.display_name}</h1>
            <select className="time-range" value={timeRange} onChange={timeRangeChange}>
              <option value="short_term">Short Term</option>
              <option value="medium_term">Medium Term</option>
              <option value="long_term">Long Term</option>
            </select>
          </div>
          <div className="spotify-list-wrapper">
            <div className="top-artists-container">
              <h2>Your Top Artists</h2>
              <ul className="top-artists-list">
                {userTopArtists.map((artist, index) => (
                  <li key={artist.id} className="top-artist-item">
                    <img src={artist.images[0].url} alt={artist.name} className="artist-image" />
                    <span className="artist-rank">{index + 1}</span>
                    <span className="artist-name">{artist.name}</span>
                  </li>
                ))}
              </ul>
              <span className="see-more" onClick={fullSongs}>See more</span>
            </div>
            <div className="top-artists-container">
              <h2>Your Top Tracks</h2>
              <ul className="top-artists-list">
                {userTopTracks.map((track, index) => (
                  <li key={track.id} className="top-artist-item">
                    <img src={track.album.images[0].url} alt={track.name} className="album-image" onClick={() => tabLink(track.name, track.artists[0].name)}/>
                    <span className="artist-rank">{index + 1}</span>
                    <span className="artist-name">{track.name}</span>
                    <span className="song-name">{track.artists[0].name}</span>
                  </li>
                ))}
              </ul>
              <span className="see-more" onClick={fullSongs}>See more</span>
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
