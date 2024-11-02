import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SongPopup } from './utils.js';

export const UserSongs = () => {
  const [userTopTracks, setUserTopTracks] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [timeRange, setTimeRange] = useState(() => {
    return searchParams.get('timeRange') || 'medium_term';
  });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 10;
  const totalPages = 10;

  const startIndex = (currentPage - 1) * songsPerPage;
  const [currentSongs, setCurrentSongs] = useState(null);

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
          const user = await axios.get(`https://localhost:44461/api/spotify/user-top?accessToken=${accessToken}&timeRange=${timeRange}&limit=50`);
          const user_half = await axios.get(`https://localhost:44461/api/spotify/user-top?accessToken=${accessToken}&timeRange=${timeRange}&limit=50&offset=50`);
          const topHalfSongs = JSON.parse(user.data.topTracks).items;
          const bottomHalfSongs = JSON.parse(user_half.data.topTracks).items;
          if (topHalfSongs.error) {
            alert("You must be signed in to view your profile");
            navigate('/signin');
          }
          setUserTopTracks(topHalfSongs.concat(bottomHalfSongs));
          setCurrentSongs(topHalfSongs.slice(0, 10));
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

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      const newStartIndex = (newPage - 1) * songsPerPage;
      const newEndIndex = newStartIndex + songsPerPage;
      setCurrentSongs(userTopTracks.slice(newStartIndex, newEndIndex));
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      const newStartIndex = (newPage - 1) * songsPerPage;
      const newEndIndex = newStartIndex + songsPerPage;
      setCurrentSongs(userTopTracks.slice(newStartIndex, newEndIndex));
    }
  };

  const timeRangeChange = (time) => {
    setCurrentPage(1);
    setCurrentSongs(userTopTracks.slice(0, 10));
    setTimeRange(time);
    window.location.href = `/profile/songs?timeRange=${time}`;
  };

  return (
    <div>
      {currentSongs ? (
        <div>
          <div className="profile-header">
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
          <div className="top-list-container">
            <h2>Your Top Songs</h2>
            <ul className="top-songs-list">
              {currentSongs.map((song, index) => {
                return (
                  <li key={song.id} className="top-song-item">
                    <img src={song.album.images[0].url} alt={song.name} className="album-image" onClick={() => songClick(song)}/>
                    <span className="artist-rank">{startIndex + index + 1}</span>
                    <span className="song-name">{song.name}</span>
                    <span className="artist-name">{song.artists[0].name}</span>
                  </li>
                );
              })}
            </ul>
            <div className="pagination-buttons">
              <button className="btn btn-info" onClick={handlePrevious} disabled={currentPage === 1}>
                Previous
              </button>
              <button className="btn btn-info" onClick={handleNext} disabled={currentPage === totalPages}>
                Next
              </button>
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
        <div>Loading...</div>
      )}
    </div>
  );
};

export default UserSongs;
