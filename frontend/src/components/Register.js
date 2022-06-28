import React from "react";
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    onRegister(userData);
  }
  return (
    <div className="login-form">
      <form className="login-form__form" onSubmit={handleSubmit}>
        <div className="login-form__content">
          <h3 className="login-form__title">Sign up</h3>
          <input
            className="login-form__input"
            name="name"
            placeholder="email"
            id="email"
            type="text"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="login-form__input"
            name="password"
            placeholder="password"
            id="password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login-form__content">
          <button className="login-form__button" type="submit">
            Sign up
          </button>
          <p className="login-form__text">
            Already a member?{" "}
            <Link className="login-form__link" to="/signin">
              Log in here!
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
