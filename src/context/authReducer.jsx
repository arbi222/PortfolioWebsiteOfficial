const AuthReducer = (state, action) => {
    switch(action.type){
        case "GETTING_USER_READY":
            return {
                user: null,
                isAuthenticated: false,
                isFetching: true,
                error: false,
            };
        case "PUBLIC_USER":
            return {
                user: action.payload.userInfo,
                isAuthenticated: false,
                isFetching: false,
                error: false,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload.userInfo,
                isAuthenticated: true,
                isFetching: false,
                error: false,
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                isAuthenticated: false,
                isFetching: false,
                error: action.payload,
            };
        case "LOGOUT":
            return {
                user: null,
                isAuthenticated: false,
                isFetching : false,
                error: false
            };    
        default:
            return state
    }
}

export default AuthReducer;