const AuthReducer = (state, action) => {
    switch(action.type){
        case "LOGIN_START":
            return {
                user: null,
                accessToken: null,
                isFetching: true,
                error: false,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload.userInfo,
                accessToken: action.payload.accessToken,
                isFetching: false,
                error: false,
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                accessToken: null,
                isFetching: false,
                error: action.payload,
            };
        case "LOGOUT":
            return {
                user: null,
                accessToken: null,
                isFetching : false,
                error: false
            };    
        default:
            return state
    }
}

export default AuthReducer;