import React, { useState } from 'react'
import logo from "../images/logo.png"
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; 


const Login = () => {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/")
            window.location.reload();
        } catch (err) {
            setErr(true);
        }
    };

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <img src={logo} alt='' className='logo_img'></img>
                <span className='logo'> Chat App</span>
                <span className='title'> Log In</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='Enter your email'></input>
                    <input type="password" placeholder='Create a password'></input>

                    <button>Sign In</button>
                    {err && <span  className='error_msg'> Something went wrong!</span>}
                </form>

                <p>You don't have an account? <Link to = "/register"> <span>Register!</span> </Link></p>
            </div>
        </div>
    )
}

export default Login