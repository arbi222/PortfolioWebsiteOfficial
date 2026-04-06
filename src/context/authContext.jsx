import { createContext, useReducer, useEffect } from "react";
import AuthReducer from "./authReducer";
import axiosInstance from "../axios";

const INITIAL_STATE = {
    user: null,
    isAuthenticated: false,
    loading: false,
    isFetching: false,
    error: false
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    
    useEffect(() => {
        getUser();
    },[])

    const getUser = async () => {
        dispatch({type: "GETTING_USER_READY"});
        try{
            const res = await axiosInstance.get(`/api/users/me`);
            dispatch({type: "LOGIN_SUCCESS", payload: {userInfo: res.data}});
        }
        catch(err){
            try{
                const publicUser = await axiosInstance.get("/api/users/publicUser");
                dispatch({type: "PUBLIC_USER", payload: {userInfo: publicUser.data}});
            }
            catch(error){
                dispatch({type: "LOGOUT"});
            }
        }
    }

    return (
        <AuthContext.Provider 
            value={{
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                isFetching: state.isFetching,
                error: state.error,
                loading: state.loading,
                dispatch,
                }}
        >
        {children}
        </AuthContext.Provider>
    )
}