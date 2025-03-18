import { createContext, useReducer, useEffect } from "react";
import AuthReducer from "./authReducer";
import axios from "axios";
import CryptoJS from "crypto-js";
import { toast } from 'react-toastify'

const INITIAL_STATE = {
    user: null,
    accessToken: localStorage.getItem("accessToken") || null,
    isFetching: false,
    error: false
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const apiUrl = import.meta.env.VITE_API_KEY;
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    
    useEffect(() => {
        if (state.accessToken){
            const bytes = CryptoJS.AES.decrypt(state.accessToken, import.meta.env.VITE_SECRET_ENCRYPTION_KEY);
            const decryptedAccessToken = bytes.toString(CryptoJS.enc.Utf8);

            fetchUserData(decryptedAccessToken)
                .then(userData => {
                    dispatch({type: "LOGIN_SUCCESS", payload: {userInfo: userData, accessToken: state.accessToken}});
                })
                .catch(err => {
                    toast.error("Error! Something went wrong!")
                    dispatch({type: "LOGOUT"})
                })
        }
    },[])

    const fetchUserData = async (accessToken) => {
        try{
            const res = await axios.get(`${apiUrl}/api/users/getUser/${accessToken}`)
            return res.data;
        }
        catch(err){
            toast.error("Error! Could not get the user!")
        }
    }

    return (
        <AuthContext.Provider 
            value={{
                user: state.user,
                accessToken: state.accessToken,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
                }}
        >
        {children}
        </AuthContext.Provider>
    )
}