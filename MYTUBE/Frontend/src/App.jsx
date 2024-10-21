import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom';
import sidebarToggle from '../utils/sidebarToggle';
import loggedInUser from '../utils/loggedInUser';
import channelContext from '../utils/channelContext';
import { jwtDecode } from "jwt-decode";

function App() {
  const [sideBarToggle, setSideBarToggle] = useState(false);
  const [channel, setChannel] = useState({});
  const [user, setUser] = useState({});
  const [videos, setVideos] = useState([]);
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token){
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const isExpired = decodedToken.exp < currentTime;
      if (isExpired) {
        localStorage.removeItem('token')
      } else {
        setUser(decodedToken.user);
      }
    }
  },[])
  return (
    <sidebarToggle.Provider value={{sideBarToggle : sideBarToggle, setSideBarToggle}}>
    <loggedInUser.Provider value={{user: user, setUser}}>
    <channelContext.Provider value={{channel : channel, setChannel}}>
    <Navbar/>
    <Outlet />
    </channelContext.Provider>
    </loggedInUser.Provider>
    </sidebarToggle.Provider>
  )
}

export default App
