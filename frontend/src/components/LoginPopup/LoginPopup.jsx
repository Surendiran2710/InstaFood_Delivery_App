import React, { useContext, useState, useEffect } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);

    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setData({ name: "", email: "", password: "" });
    }, [currState]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const onLogin = async (event) => {
        event.preventDefault();

        if (!isChecked) {
            alert("You must agree to the terms and conditions.");
            return;
        }

        setLoading(true);
        let newUrl = url + (currState === "Login" ? "/api/user/login" : "/api/user/register");

        try {
            const response = await axios.post(newUrl, data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error during authentication:", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} autoComplete="off" noValidate className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input 
                            name='name' 
                            onChange={onChangeHandler} 
                            value={data.name} 
                            type="text" 
                            placeholder='Your Name' 
                            required 
                            autoComplete="off" 
                        />
                    )}

                    <input 
                        name='email' 
                        onChange={onChangeHandler} 
                        value={data.email} 
                        type="email" 
                        placeholder='Your Email' 
                        required 
                        autoComplete="off"
                        onFocus={(e) => e.target.type = "email"}
                        onBlur={(e) => e.target.type = "text"} 
                    />
                    
                    <input 
                        name='password' 
                        onChange={onChangeHandler} 
                        value={data.password} 
                        type="password" 
                        placeholder='Password' 
                        required 
                        autoComplete="new-password" 
                    />
                </div>
                <button type='submit' disabled={loading}>
                    {loading ? "Processing..." : currState === "Sign Up" ? "Create account" : "Login"}
                </button>
                <div className="login-popup-condition">
                    <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={onCheckboxChange} 
                        required 
                    />
                    <p>By continuing, I agree to terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                }
            </form>
        </div>
    );
};

export default LoginPopup;
