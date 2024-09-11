import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { tabLink, downloadLink} from './utils.js';
import { CSSTransition } from 'react-transition-group';

export const UserSongs = () => {
  const [userInfo, setUserInfo] = useState(null);
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
          const user = await axios.get(`https://localhost:44461/api/spotify/usertop?accessToken=${accessToken}&timeRange=${timeRange}&limit=50`);
          const user_half = await axios.get(`https://localhost:44461/api/spotify/usertop?accessToken=${accessToken}&timeRange=${timeRange}&limit=50&offset=50`);
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

  const timeRangeChange = (event) => {
    const current_time = event.target.value;
    setCurrentPage(1);
    setCurrentSongs(userTopTracks.slice(0, 10));
    setTimeRange(current_time);
    window.location.href = `/profile/songs?timeRange=${current_time}`;
  };

  return (
    <div>
      {currentSongs ? (
        <div>
          <div className="profile-header">
            <select className="time-range" value={timeRange} onChange={timeRangeChange}>
              <option value="short_term">Short Term</option>
              <option value="medium_term">Medium Term</option>
              <option value="long_term">Long Term</option>
            </select>
          </div>
          <div className="top-list-container">
            <h2>Your Top Songs</h2>
            <ul className="top-songs-list">
              {currentSongs.map((song, index) => (
                <li key={song.id} className="top-song-item">
                  <img src={song.album.images[0].url} alt={song.name} className="album-image" onClick={() => songClick(song)} />
                  <span className="artist-rank">{startIndex + index + 1}</span>
                  <span className="song-name">{song.name}</span>
                  <span className="artist-name">{song.artists[0].name}</span>
                </li>
              ))}
            </ul>
            <div className="pagination-buttons">
              <button onClick={handlePrevious} disabled={currentPage === 1}>
                Previous
              </button>
              <button onClick={handleNext} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </div>
          <CSSTransition
            nodeRef={nodeRef}
            in={showPopup}
            timeout={300}
            classNames="popup"
            unmountOnExit
          >
            <>
              <div className="popup-overlay" onClick={songExit}></div>
              {showPopup && (
                <>
                  <div className="popup-overlay" onClick={songExit}></div>
                  <div className="song-popup">
                    <div className="popup-content" ref={nodeRef}>
                      <img
                        src={selectedSong.album.images[0].url}
                        alt={selectedSong.name}
                        className="popup-album-image"
                      />
                      <h3 className="popup-song-name">{selectedSong.name}</h3>
                      <p className="popup-artist-name">{selectedSong.artists[0].name}</p>
                      <div className="popup-buttons">
                        <button onClick={() => downloadLink(selectedSong.name, selectedSong.artists[0].name)}>Download Tabs</button>
                        <button onClick={() => tabLink(selectedSong.name, selectedSong.artists[0].name)}>View Tabs</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          </CSSTransition>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default UserSongs;
