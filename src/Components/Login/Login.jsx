import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { auth } from "../../firebase";
import { toast } from 'react-hot-toast';

import styles from "./Login.module.css";
import { CircularProgress } from "@mui/material";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleSubmission = () => {
    if (!values.email || !values.pass) {
      toast.error("Error!");
      return; 
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        toast.success("Success!")
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        toast.error(err.message || 'Failed');
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.innerBox}>
        <h1 className={styles.heading}>Login</h1>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '100%' },
          }}
          noValidate
          autoComplete="off"
        >
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
        </Box>
        <div className={styles.footer}>
          <b className={styles.error}>{errorMsg}</b>
          <button disabled={submitButtonDisabled} onClick={handleSubmission}>
            {submitButtonDisabled ? (
              <CircularProgress size={24} style={{ color: 'white' }} />
            ) : (
              "Login"
            )}
          </button>
          <p>
            Create a new account?{" "}
            <span>
              <Link to="/signup">Sign up</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
