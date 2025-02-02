import React from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';


const findSongUrl = async (song, artist) => {
  var song_url = await axios.get(`https://localhost:44461/api/songsterr/search?query=${artist} ${song}`);
  
  if (song_url.data.artist !== artist) {
    song_url = await axios.get(`https://localhost:44461/api/songsterr/search?query=${song}`);
  } else if (song_url.data.song !== song) {
    const parse_song = song.includes('-') ? song.split('-')[0].trim() : song;
    song_url = await axios.get(`https://localhost:44461/api/songsterr/search?query=${artist} ${parse_song}`);
  }
  const newSong = song_url.data.song;
  const newArtist = song_url.data.artist;
  const id_url = await axios.get(`https://localhost:44461/api/songsterr/song-id?query=${newArtist} ${newSong}`);
  return {song_url, newSong, newArtist};
};

// TODO: Find a way to do backup search WITHOUT selenium (takes too long and too cheesy)
// * (Possible fix) Change it so we ONLY search the artist and look at all their songs and see if their song matches the one we're looking for
// * tho this is under the assumption that the artist name is a language that is similiar typing of english

export const tabLink = async (song, artist) => {
  const { song_url, newSong, newArtist } = await findSongUrl(song, artist);

  // * If search doesn't go through properly, it defaults to the number 1 song on the site
  // * in this case, Master of Puppets by Metallica
  if (song_url.data.song !== "Master of Puppets" && (song !== "Master of Puppets")) {
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
  var { song_url, newSong, newArtist } = await findSongUrl(song, artist);
  newSong = newSong.toLowerCase().replace(/ /g, '_');
  const id_url = await axios.get(`https://localhost:44461/api/songsterr/song-id?query=${newArtist} ${newSong}`);
  const song_id = id_url.data[0].songId;

  const metadata = await axios.get(`https://localhost:44461/api/songsterr/download/${song_id}`);
  const download_link = metadata.data[0].source;
  const fileResponse = await axios.get(download_link, {
    responseType: 'blob'
  });

  const blob = new Blob([fileResponse.data], { type: 'application/json' });
  const fileDownloadLink = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = fileDownloadLink;
  a.download = `${newSong}.gp`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  window.URL.revokeObjectURL(fileDownloadLink);
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
              <button className="btn close-button" onClick={songExit}>×</button>
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


