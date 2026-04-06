import { useContext } from 'react'
import {BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './components/HomePage/home';
import Login from './components/Login/login';
import ToastNotification from './components/ReactNotifications/ToastNotification';
import { AuthContext } from './context/authContext';
import ResetPass from './components/ResetPass/resetPass';
import { RiseLoader } from "react-spinners";

function App() {

  const {isAuthenticated, isFetching} = useContext(AuthContext);

  if (isFetching){
    return (
      <div className="app-loader">
        <RiseLoader color="#0da2b8" size={35} speedMultiplier={1.1}/>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={isAuthenticated ? <Navigate to="/" replace={true} /> : <Login />} />
        <Route path="/reset-password/:token" element={isAuthenticated ? <Navigate to="/" replace={true} /> : <ResetPass />}></Route>

        <Route path="*" element={<Home />}></Route>
      </Routes>

      <ToastNotification />
    </Router>
  )
}

export default App;