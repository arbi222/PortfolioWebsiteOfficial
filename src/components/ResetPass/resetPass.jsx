import React, { useRef } from "react";
import "./resetPass.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPass = () => {
    const apiUrl = import.meta.env.VITE_API_KEY;
    const resetPassToken = useParams().token;

    const newPassword = useRef(); 
    const confirmPassword = useRef(); 

    const changePassword = async (e) => {
        e.preventDefault();

        const updatePass = {
            newPassword: newPassword.current.value,
            confirmPassword: confirmPassword.current.value
        }

        try{
            if (resetPassToken){
                const res = await axios.post(apiUrl + "/api/reset/resetPassword/" + resetPassToken, updatePass);
                newPassword.current.value = "";
                confirmPassword.current.value = "";
                toast.success(res.data);
                setTimeout(() => {
                    window.location.href = "/admin";
                },3500)
            }
            else{
                toast.error("No token is found!");
                setTimeout(() => {
                    window.location.href = "/";
                },3500)
            }
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

    return <div className="reset-pass-container">
        <nav className="navbar reset-pass-nav">
            <div className="main-nav-btns" id="home">
                <div className="nav-logo">
                    <a href="/">HomePage</a>
                </div>
            </div>

            <div className="nav-links">
                <a href="/admin">Admin</a>
            </div>
        </nav>
        
        <form className="reset-pass-form" onSubmit={changePassword}>
            <h1>Reset Password</h1>

            <div>
                <label htmlFor="password">New Password</label>
                <input type="password" required id="password" autoFocus minLength="6" ref={newPassword} />
            </div>

            <div>
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" required id="confirm-password" minLength="6" ref={confirmPassword} />
            </div>

            <button className="save-pass-btn" type="submit">
                Save New Password
            </button>
        </form>
    </div>
        
}

export default ResetPass;