import { useContext, useEffect, useState } from 'react'
import {BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './components/HomePage/home';
import Login from './components/Login/login';
import ToastNotification from './components/ReactNotifications/ToastNotification';
import { AuthContext } from './context/authContext';
import ResetPass from './components/ResetPass/resetPass';

function App() {

  const {user, accessToken, dispatch} = useContext(AuthContext);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (user && accessToken){
      setAuthenticated(true);
    }
    else{
      setAuthenticated(false);
    }
  }, [user, accessToken]);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home authenticated={authenticated} dispatch={dispatch} />} />
        <Route path='/admin' element={user && accessToken ? <Navigate to="/" replace={true} /> : <Login />} />
        <Route path="/reset-password/:token" element={user && accessToken ? <Navigate to="/" replace={true} /> : <ResetPass />}></Route>

        <Route path="*" element={<Home authenticated={authenticated} dispatch={dispatch} />}></Route>
      </Routes>

      <ToastNotification />
    </Router>
  )
}

export default App;