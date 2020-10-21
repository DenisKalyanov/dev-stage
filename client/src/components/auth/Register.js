import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";


import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";

function Register({ setAlert, register }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const { name, email, password, confirmPassword } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("here");
    if (password !== confirmPassword) {
      setAlert("Password do not match", "danger", 3000);
    } else {
      register({ name, email, password });
      //here
    };

  };

  return (<section className="container">
    <h1 className="large text-primary">Sign Up</h1>
    <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
    <form className="form" onSubmit={onSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={onChange}
        />
        <small className="form-text">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
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
      <div className="form-group">
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
        />
      </div>
      <input type="submit" className="btn btn-primary" value="Register" />
    </form>
    <p className="my-1"> Already have an account? <Link to="/login">Sign In</Link>
    </p>
  </section>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setAlert,
  register,
};

export default connect(null, mapDispatchToProps)(Register);
