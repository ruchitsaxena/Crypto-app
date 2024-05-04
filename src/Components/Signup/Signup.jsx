import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { auth } from "../../firebase";
import { toast } from 'react-hot-toast';
import { CircularProgress } from '@mui/material';

import styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
    confirmPass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmission = () => {
    if (!values.name || !values.email || !values.pass || values.pass !== values.confirmPass) {
      toast.error("Fill all fields s.t. passwords match.");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        const user = res.user;
        await updateProfile(user, {
          displayName: values.name,
        });
        toast.success('Success!');
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        toast.error(err.message);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerBox}>
        <h1 className={styles.heading}>Signup</h1>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { width: '100%', marginBottom: "15px" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Name"
            variant="outlined"
            value={values.name}
            onChange={handleChange('name')}
            placeholder="Enter your name"
            fullWidth
            InputLabelProps={{
              style: { color: 'white' },
            }}
            InputProps={{
              sx: {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'red',
                },
              },
            }}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
            }}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={values.email}
            onChange={handleChange('email')}
            placeholder="Enter email address"
            fullWidth
            InputLabelProps={{
              style: { color: 'white' },
            }}
            InputProps={{
              sx: {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'red',
                },
              },
            }}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={values.pass}
            onChange={handleChange('pass')}
            placeholder="Enter Password"
            fullWidth
            InputLabelProps={{
              style: { color: 'white' },
            }}
            InputProps={{
              sx: {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'red',
                },
              },
            }}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
            }}
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={values.confirmPass}
            onChange={handleChange('confirmPass')}
            placeholder="Confirm Password"
            fullWidth
            InputLabelProps={{
              style: { color: 'white' },
            }}
            InputProps={{
              sx: {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'red',
                },
              },
            }}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
            }}
          />
        </Box>
        <div className={styles.footer}>
          <b className={styles.error}>{errorMsg}</b>
          <button onClick={handleSubmission} disabled={submitButtonDisabled}>
            {submitButtonDisabled ? (
              <CircularProgress size={24} style={{ color: 'white' }} />
            ) : (
              "Signup"
            )}
          </button>
          <p>
            Already have an account?{" "}
            <span>
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
