import axios from 'axios';

export const tabLink = async (song, artist) => {
  console.log(artist);
  console.log(song);
  const song_url = await axios.get(`https://localhost:44461/api/songsterr/search?query=${artist} ${song}`);
  console.log(song_url.data);
  // if (song_url.data.href.length > 0) {
  //   window.location.href = "https://www.songsterr.com" + song_url.data.href;
  // } else {
  //   alert("No tabs for your song found");
  // }
  // TODO: if the search isn't correct, call backup search
};
