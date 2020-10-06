import React, { useState } from 'react';
import { Link } from "react-router-dom";

import axios from "axios";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState("");

  const onChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const newUser = { email, password };
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(newUser);

      const res = await axios.post("/api/auth", body, config);
      console.log(res);
    } catch (err) {
      console.dir(err);
      setError(err.response.data.errors[0].msg);
    };
  };

  const { email, password } = formData;

  return (
    <section className="container">
      {/* <div className="alert alert-danger">
        Invalid credentials
      </div> */}
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            required
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
      {error && <span className="invalid-credentials">{error}</span>}
    </section>
  )
}
export default Login;
