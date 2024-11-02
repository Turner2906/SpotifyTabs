import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SongPopup } from './utils.js';

export const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userTopArtists, setUserTopArtists] = useState(null);
  const [userTopTracks, setUserTopTracks] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [timeRange, setTimeRange] = useState(() => {
    return searchParams.get('timeRange') || 'medium_term';
  });
  const navigate = useNavigate();

  const [selectedSong, setSelectedSong] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const songClick = (song) => {
    setSelectedSong(song);
    setShowPopup(true);
  }
  const songExit = () => {
    setShowPopup(false);
  }
  const nodeRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const user = await axios.get(`https://localhost:44461/api/spotify/user-top?accessToken=${accessToken}&timeRange=${timeRange}`);
          const check = JSON.parse(user.data.userInfo);
          if (check.error) {
            alert("You must be signed in to view your profile");
            navigate('/signin');
          }
          setUserInfo(JSON.parse(user.data.userInfo));
          setUserTopArtists(JSON.parse(user.data.topArtists).items);
          setUserTopTracks(JSON.parse(user.data.topTracks).items);
          localStorage.setItem('userImage', JSON.parse(user.data.userInfo).images[1].url);
        } catch (error) {
          alert("Sign in to view your profile");
          navigate('/signin');
        }
      }
      else {
        alert("Sign in to view your profile");
        navigate('/signin');
      }
    };

    fetchUserInfo();
  }, [searchParams, timeRange]);


  const timeRangeChange = (time) => {
    setTimeRange(time);
    navigate(`/profile?timeRange=${time}`);
  };

  return (
    <div>
      {userInfo ? (
        <div>
          <div className="profile-header">
            <img src={userInfo.images[0].url} alt="Profile" />
            <h1 style={{ fontWeight: "bold" }}>{userInfo.display_name}</h1>
            <div className="dropdown">
              <button className="btn time-drop dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                {timeRange === 'short_term' && 'Short Term'}
                {timeRange === 'medium_term' && 'Medium Term'}
                {timeRange === 'long_term' && 'Long Term'}
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li><a className="dropdown-item" onClick={() => timeRangeChange('short_term')}>Short Term</a></li>
                <li><a className="dropdown-item" onClick={() => timeRangeChange('medium_term')}>Medium Term</a></li>
                <li><a className="dropdown-item" onClick={() => timeRangeChange('long_term')}>Long Term</a></li>
              </ul>
            </div>
          </div>
          <div className="spotify-list-wrapper">
            <div className="top-artists-container">
              <h2>Your Top Artists</h2>
              <ul className="top-artists-list">
                {userTopArtists.map((artist, index) => (
                  <li key={artist.id} className="top-artist-item">
                    <img 
                    src={artist.images[0].url} 
                    alt={artist.name} 
                    className="artist-image"
                    onClick={() => {
                        navigate(`/artist/${artist.id}`);
                    }}/>
                    <span className="artist-rank">{index + 1}</span>
                    <span className="song-name">{artist.name}</span>
                  </li>
                ))}
              </ul>
              <span
                className="see-more"
                onClick={() => {
                  navigate(`/profile/artists?timeRange=${timeRange}`);
                }}
              > See more</span>
            </div>
            <div className="top-artists-container">
              <h2>Your Top Songs</h2>
              <ul className="top-artists-list">
                {userTopTracks.map((song, index) => (
                  <li key={song.id} className="top-artist-item">
                    <img src={song.album.images[0].url} alt={song.name} className="album-image" onClick={() => songClick(song)}/>
                    <span className="artist-rank">{index + 1}</span>
                    <span className="song-name">{song.name}</span>
                    <span className="artist-name">{song.artists[0].name}</span>
                  </li>
                ))}
              </ul>
              <span 
                className="see-more" 
                onClick={() => {
                navigate(`/profile/songs?timeRange=${timeRange}`);
              }}
              > See more</span>
            </div>
          </div>
          <SongPopup
            showPopup={showPopup}
            songExit={songExit}
            selectedSong={selectedSong}
            nodeRef={nodeRef}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
