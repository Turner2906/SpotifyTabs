import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { SongPopup } from './utils.js';

export const ArtistsSongs = () => {
  const [artistTopTracks, setArtistTopTracks] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const songId = useParams().id;
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
          const response = await axios.get(`https://localhost:44461/api/spotify/artist-top/${songId}?accessToken=${accessToken}`);
          if (response.status !== 200) {
            alert("You must be signed in to view artists");
            navigate('/signin');
          }
          console.log(response.data.tracks[0]);
          setArtistTopTracks(response.data.tracks);
        } catch (error) {
          console.error('Error fetching artist information', error);
        }
      }
      else {
        alert("You must be signed in to view artists");
        navigate('/signin');
      }
    };

    fetchUserInfo();
  }, [searchParams]);

  return (
    <div>
      {artistTopTracks ? (
        <div>
          <div className="profile-header">
          </div>
          <div className="top-list-container">
            <h2>{artistTopTracks[0].artists[0].name}'s Top Songs</h2>
            <ul className="top-songs-list">
              {artistTopTracks.map((song, index) => {
                return (
                  <li key={song.id} className="top-song-item">
                    <img src={song.album.images[0].url} alt={song.name} className="album-image" onClick={() => songClick(song)} />
                    <span className="artist-rank">{index + 1}</span>
                    <span className="song-name">{song.name}</span>
                    <span className="artist-name">{song.album.name}</span>
                  </li>
                );
              })}
            </ul>
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

export default ArtistsSongs;
