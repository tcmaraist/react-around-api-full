import React from "react";
import logo from "../images/header_logo.svg";
import { Route, Link } from "react-router-dom";

function Header({ onSignOut, email }) {
  function handleSignOut() {
    onSignOut();
  }
  return (
    <header className="header">
      <img src={logo} alt="Around The U.S. logo" className="header__logo" />
      <Route exact path="/">
        <div className="header__auth-wrapper">
          <p className="header__user">{email}</p>
          <button
            className="header__logout-button button"
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
      </Route>
      <Route path="/signup">
        <Link className="header__auth-link" to="signin">
          Login
        </Link>
      </Route>
      <Route path="/signin">
        <Link className="header__auth-link" to="signup">
          Sign up
        </Link>
      </Route>
    </header>
  );
}

export default Header;
