import React, { useEffect, useState } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

const NavMenu = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [signIn, setsignIn] = useState(null);
  const [userImage, setUserImage] = useState(null);

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogin = () => {
    const params = new URLSearchParams();
    params.append("client_id", "4ee1d4f325ef4976811bbcdf1562b8da");
    params.append("response_type", "code");
    params.append("redirect_uri", "https://localhost:44461/callback");
    params.append("scope", "user-read-private user-read-email user-top-read");
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;

  };
  
  useEffect(() => {
    const signedIn = localStorage.getItem('accessToken');
    if (signedIn) {
      setUserImage(localStorage.getItem('userImage'));
    }
    setsignIn(signedIn);
  });

  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white box-shadow mb-3 top-bar" container light>
        <NavbarBrand tag={Link} to="/">spotifyTabApp</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
          <ul className="navbar-nav flex-grow">
            {!signIn && (
              <NavItem>
                <NavLink onClick={handleLogin} style={{ cursor: "pointer" }} >Sign In</NavLink>
              </NavItem>
            )}
            {signIn && (
              <NavItem>
                <NavLink tag={Link} to="/profile">
                  <img className="profile-image"
                    src={userImage}
                    alt="Profile"
                  />
                </NavLink>
              </NavItem>
            )}
          </ul>
        </Collapse>
      </Navbar>
    </header>
  );
};

export default NavMenu;
