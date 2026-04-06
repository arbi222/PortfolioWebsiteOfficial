import axiosInstance from './axios';
import { toast } from 'react-toastify';

export const loginCall = async (userCredentials, dispatch) => {
    try{
        const res = await axiosInstance.post("/api/auth/login", userCredentials);
        if (res.data){
            dispatch({type: "LOGIN_SUCCESS", payload: {userInfo: res.data.user}});
            toast.success("Logged in successfully!");
        }
    }
    catch(err){
        dispatch({type: "LOGIN_FAILURE", payload: err});
        toast.error(err?.response?.data);
    }
}

export const logoutCall = async (dispatch) => {
    try{
        const res = await axiosInstance.get("/api/auth/logout");
        if (res.status === 200){
            dispatch({type: "LOGOUT"});
            window.location.href = "/";
        }
    }
    catch(err){
        toast.error(err.response.data);
    }
}