import React from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';

export const tabLink = async (song, artist) => {
  const song_url = await axios.get(`https://localhost:44461/api/songsterr/search?query=${artist} ${song}`);
  // * If search doesn't go through properly, it defaults to the number 1 song on the site
  // * in this case, Master of Puppets by Metallica
  if (song_url.data.text !== "Master of PuppetsMetallica" && (artist !== "Metallica" || song !== "Master of Puppets")) {
    window.location.href = "https://www.songsterr.com" + song_url.data.href;
  } else if (song_url.data.href.length > 0){
    const backup_url = await axios.get(`https://localhost:44461/api/songsterr/backup-search?query=${artist} ${song}`);
    // console.log(backup_url.data);
    window.location.href = backup_url.data.href;
  }
  else {
    alert("No tabs for your song found");
  }
};

export const downloadLink = async (song, artist) => {
  const id_url = await axios.get(`https://localhost:44461/api/songsterr/song-id?query=${artist} ${song}`);
  const song_id = id_url.data[0].songId;
  const download_url = await axios.get(`https://localhost:44461/api/songsterr/download/${song_id}`);
  const download_link = download_url.data[0].source;
  const a = document.createElement('a');
  a.href = download_link;
  a.download = artist + " - " + song + ".gp";
  document.body.appendChild(a);
  a.click(); 
  document.body.removeChild(a);
};

export const SongPopup = ({ showPopup, songExit, selectedSong, nodeRef}) => {
  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={showPopup}
      timeout={300}
      classNames="popup"
      unmountOnExit
    >
      <>
        {showPopup && (
          <>
            <div className="popup-overlay" onClick={songExit}></div>
            <div className="song-popup">
              <button className="close-button" onClick={songExit}>×</button>
              <div className="popup-content" ref={nodeRef}>
                <img
                  src={selectedSong.album.images[0].url}
                  alt={selectedSong.name}
                  className="popup-album-image"
                />
                <h3 className="popup-song-name">{selectedSong.name}</h3>
                <p className="popup-artist-name">{selectedSong.artists[0].name}</p>
                <div className="popup-buttons">
                  <button onClick={() => downloadLink(selectedSong.name, selectedSong.artists[0].name)}>Download Tab</button>
                  <button onClick={() => tabLink(selectedSong.name, selectedSong.artists[0].name)}>View Tab</button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </CSSTransition>
  );
};

export default SongPopup;


