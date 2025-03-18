import axios from "axios"
import { toast } from 'react-toastify';
import CryptoJS from "crypto-js";

export const loginCall = async (userCredentials, dispatch) => {
    const apiUrl = import.meta.env.VITE_API_KEY;
    dispatch({type: "LOGIN_START"});

    try{
        const res = await axios.post(apiUrl + "/api/auth/login", userCredentials);
        if (res.data){
            try{
                dispatch({type: "LOGIN_SUCCESS", payload: {userInfo: res.data, accessToken: res.data._id}});
                const encryptedAccessToken = CryptoJS.AES.encrypt(res.data._id, import.meta.env.VITE_SECRET_ENCRYPTION_KEY).toString();
                localStorage.setItem("accessToken", encryptedAccessToken);
                toast.success("Logged in successfully!");
            }
            catch(err){
                dispatch({type: "LOGIN_FAILURE", payload: err});
                toast.error(err.response.data);
            }
        }
    }
    catch(err){
        dispatch({type: "LOGIN_FAILURE", payload: err});
        if (err.response.status === 401){
            toast.error("Wrong password!");
        }
        else if(err.response.status === 404){
            toast.error(err.response.data);
        }
    }
}

export const logoutCall = async (dispatch) => {
    const apiUrl = import.meta.env.VITE_API_KEY;
    try{
        const res = await axios.get(apiUrl + "/api/auth/logout");
        if (res.status === 200){
            localStorage.removeItem("accessToken");
            dispatch({type: "LOGOUT"});
            window.location.href = "/"
        }
    }
    catch(err){
        toast.error(err.response.data);
    }
}