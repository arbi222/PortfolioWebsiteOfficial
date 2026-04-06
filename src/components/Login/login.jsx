import { useContext, useEffect, useRef, useState } from "react";
import "./login.css";
import { CircularProgress } from "@mui/material";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import axiosInstance from "../../axios";

const Login = () => {

    const email = useRef();
    const password = useRef();
    const {dispatch, loading} = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    const [forgotPass, setForgotPass] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        loginCall({username: email.current.value, password: password.current.value}, dispatch);
    }

    const handleReset = async (e) => {
        e.preventDefault();
        setLoader(true);

        try{
            const res = await axiosInstance.post("/api/reset/forgotPassword", {email: email.current.value});
            toast.success(res.data.message);
            setLoader(false);
            setForgotPass(false);
        }
        catch(err){
            toast.error(err.response.data);
            setLoader(false);
        }
    }

    useEffect(() => {
        email.current.value = "";
    }, [forgotPass])

    return <>
        <div className="login-container">
            {forgotPass ? 
                <form className="login-form resetPass-form" onSubmit={handleReset}>
                    <h1>Reset Password</h1>

                    <div>
                        <label htmlFor="username">Email</label>
                        <input type="email" autoFocus required id="username" ref={email} disabled={loader}/>
                    </div>

                    <button type="button" className="forgot-pass-btn" onClick={() => setForgotPass(false)}>Back to Login</button>

                    <button className="login-btn" type="submit" disabled={loader}>
                        {loader ? <CircularProgress color='#000' size="25px" /> : "Send Email"}
                    </button>
                </form>
            :
                <form className="login-form" onSubmit={handleLogin}>
                    <h1>Admin Login Pannel</h1>

                    <div>
                        <label htmlFor="username">Email</label>
                        <input type="email" autoFocus required id="username" ref={email} disabled={loading} />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" required id="password" minLength="6" ref={password} disabled={loading} />
                    </div>

                    <button type="button" className="forgot-pass-btn" onClick={() => setForgotPass(true)}>Forgot password?</button>

                    <button className="login-btn" type="submit" disabled={loading}>
                        {loading ? <CircularProgress color='#000' size="25px" /> : "Log in"}
                    </button>
                </form>
            }  
        </div>
    </>
}

export default Login;