import React, { useState } from 'react'
import Add from "../images/Add_Avatar.png"
import logo from "../images/logo.png"

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {

  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {

      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, `${displayName}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {

            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/login");
          } catch (err) {
            setErr(true);
          }
        });
      });
    } catch (err) {
      setErr(true);
    }
  };


  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <img src={logo} alt='' className='logo_img'></img>
        <span className='logo'> Chat App</span>
        <span className='title'> Sign Up</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder='Enter your name'></input>
          <input type="email" placeholder='Enter your email'></input>
          <input type="password" placeholder='Create a password'></input>
          <input style={{ display: "none" }} type="file" id='file'></input>
          <label htmlFor="file">
            <img src={Add} alt='' />
            <span>Choose a profile picture</span>
          </label>

          <button>Sign Up</button>
          {err && <span  className='error_msg'> Something went wrong!</span>}
        </form>

        <p>Do you have an account already?  <Link to ="/login"> <span>Log-in!</span> </Link></p>
      </div>
    </div>
  )
}

export default Register