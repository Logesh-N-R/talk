import React, { useEffect, useState } from 'react';
import Talk from "./components/Talk/Talk"
import Login from "./components/ManageUser/Login"
import Home from "./components/Home/Home"
import Signup from "./components/ManageUser/Signup"
import NoPage from "./components/NoPage"
import Apicall from "./components/Apicall"

import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom"
import { CSSTransition, TransitionGroup, SwitchTransition } from 'react-transition-group';

// toaster
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function App() {
  const navigate = useLocation();
  const redirect = useNavigate();
  const [user, setUser] = useState({});
  const [session, setSession] = useState(true)
  useEffect(() => {
    console.log(navigate.pathname)
    {
      if (navigate.pathname != '/signup') {
        checkSession()
      }
    }
  }, [])

  // if (session) {
  //   if (navigate.pathname != '/signup'){
  //     checkSession()
  //   }
  // }

  function checkSession() {
    console.log("session")
    Apicall('auth', {}).then((res) => {
      if (res?.data) {
        setUser(res.data)
        setSession(true);
      } else {
        setSession(false);
      }
    })
  }
  function talk(val){
    console.log(val);

  }
  return (<div className="appContainter">
    <SwitchTransition>
      <CSSTransition
        key={navigate.pathname}
        classNames="pageAnimate"
        timeout={500}
      >{
          !session ?
            <Routes location={navigate}>
              <Route index element={<Login redirect={(val) => redirect(val)} successLogin={checkSession} />} />
              <Route path="/login" exact element={<Login redirect={(val) => redirect(val)} successLogin={checkSession} />} />
              <Route path="/signup" exact element={<Signup />} />
              <Route path="*" element={<NoPage />} />
            </Routes> : <Routes location={navigate}>
              <Route index element={<Login redirect={(val) => redirect(val)} successLogin={checkSession} />} />
              <Route path="/login" exact element={<Login redirect={(val) => redirect(val)} successLogin={checkSession} />} />
              <Route path="/signup" exact element={<Signup />} />
              <Route path="/home" exact element={<Home redirect={(val) => redirect(val)} user={user} talk={talk}/>} />
              <Route path="/talk" exact element={<Talk redirect={(val) => redirect(val)} user={user} />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
        }

      </CSSTransition>
    </SwitchTransition>
    <ToastContainer position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark" />
  </div>)
}