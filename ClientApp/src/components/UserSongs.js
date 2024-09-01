import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const totalPages = 5;

  const startIndex = (currentPage - 1) * songsPerPage;
  const [currentSongs, setCurrentSongs] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const user = await axios.get(`https://localhost:44461/api/spotify/usertop?accessToken=${accessToken}&timeRange=${timeRange}&limit=50`);
          const topSongs = JSON.parse(user.data.topTracks);
          setUserTopTracks(topSongs);
          setCurrentSongs(topSongs.items.slice(0, 10));
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
      setCurrentSongs(userTopTracks.items.slice(newStartIndex, newEndIndex));
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      const newStartIndex = (newPage - 1) * songsPerPage;
      const newEndIndex = newStartIndex + songsPerPage;
      setCurrentSongs(userTopTracks.items.slice(newStartIndex, newEndIndex));
    }
  };

  const tabLink = async (song, artist) => {
    const song_url = await axios.get(`https://localhost:44461/api/songsterr/search?query=${artist} ${song}`);
    console.log("https://www.songsterr.com" + song_url.data.href);
    console.log(song);
    if (song_url.data.href.length > 0) {
      window.location.href = "https://www.songsterr.com" + song_url.data.href;
    }
    else {
      alert("No tabs for your song found");
    }
  };

  const timeRangeChange = (event) => {
    const current_time = event.target.value;
    setTimeRange(current_time);
    navigate(`/profile/songs?timeRange=${current_time}`);
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
            <h2>Your Top Artists</h2>
            <ul className="top-songs-list">
              {currentSongs.map((song, index) => (
                <li key={song.id} className="top-song-item">
                  <img src={song.album.images[0].url} alt={song.name} className="album-image" onClick={() => tabLink(song.name, song.artists[0].name)} />
                  <span className="artist-rank">{startIndex + index + 1}</span>
                  <span className="artist-name">{song.name}</span>
                  <span className="song-name">{song.artists[0].name}</span>
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
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default UserSongs;
