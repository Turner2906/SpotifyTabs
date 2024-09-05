import axios from 'axios';

export const tabLink = async (song, artist) => {
  console.log(artist);
  console.log(song);
  const song_url = await axios.get(`https://localhost:44461/api/songsterr/search?query=${artist} ${song}`);
  // console.log(song_url.data);
  // * If search doesn't go through properly, it defaults to the number 1 song on the site
  // * in this case, Master of Puppets by Metallica
  if (song_url.data.text !== "Master of PuppetsMetallica" && (artist !== "Metallica" || song !== "Master of Puppets")) {
    window.location.href = "https://www.songsterr.com" + song_url.data.href;
  } else if (song_url.data.href.length > 0){
    const backup_url = await axios.get(`https://localhost:44461/api/songsterr/backup_search?query=${artist} ${song}`);
    // console.log(backup_url.data);
    window.location.href = backup_url.data.href;
  }
  else {
    alert("No tabs for your song found");
  }
};
