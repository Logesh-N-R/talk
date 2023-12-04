import React, { useEffect, useState } from 'react';
import Talk from "./components/Talk/Talk"
import Login from "./components/ManageUser/Login"
import Home from "./components/Home/Home"
import Signup from "./components/ManageUser/Signup"
import NoPage from "./components/NoPage"
import Apicall from "./components/Apicall"

import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import { CSSTransition, SwitchTransition } from 'react-transition-group';

// toaster
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';

export default function App() {
  const navigate = useLocation();
  const redirect = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
 

  return (<div className="appContainter">
    <SwitchTransition>
      <CSSTransition
        key={navigate.pathname}
        classNames="pageAnimate"
        timeout={500}
      >{
          <Routes location={navigate}>
              <Route index exact element={<Login />} />
              <Route path="/login" exact element={<Login/>} />
              <Route path="/signup" exact element={<Signup />} />
              <Route path="/home" exact element={<Home/>} />
              {/* <Route path="/talk" exact element={<Home />} /> */}
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