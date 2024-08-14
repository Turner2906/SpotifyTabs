import React from 'react';

export const SignIn = () => {

  const handleLogin = () => {
    const params = new URLSearchParams();
    params.append("client_id", "4ee1d4f325ef4976811bbcdf1562b8da");
    params.append("response_type", "code");
    params.append("redirect_uri", "https://localhost:44461/callback");
    params.append("scope", "user-read-private user-read-email user-top-read");
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  return (
    <div>
      <h1 id="tabelLabel">Sign into your Spotify!</h1>
      <button onClick={handleLogin}>Sign In with Spotify</button>
    </div>
  );
};

export default SignIn;
