import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import Apicall from "../Apicall";
import { useDispatch, useSelector } from "react-redux";
import { appTypeSettings, loaderSetting, setUserData } from "../../redux/actions/talkActions";

export default function Login(props) {
    const userData = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const redirect = useNavigate();
    
    useEffect(() => {
        function getWindowDimensions() {
            const { innerWidth: width, innerHeight: height } = window;
            return {
              width,
              height
            };
          }
        dispatch(appTypeSettings({current:"HOME",screen:getWindowDimensions()}))
        if (!userData.username) {
            dispatch(loaderSetting(false));
            Apicall('auth', {}).then((res) => {
                dispatch(setUserData(res.data))
                if (res?.redirect) {
                    redirect(res.redirectTo)
                }
            })
        }
    }, [])

    const [formInfo, setFormInfo] = useState({ 'email': '', password: '' })
    function handleChange(e) {
        setFormInfo(preForm => (
            { ...preForm, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }
        ))
    }
    function handleOnSubmit(event) {
        event.preventDefault();
        if (formInfo.email.length <= 0 || formInfo.password.length <= 0) {
            toast.warn('Hey, fill all the fields!');
        } else if (formInfo.password.length < 8) {
            toast.warn('Are you sure? password seems too short!');
        } else {
            Apicall('logIn', formInfo).then((res) => {
                dispatch(setUserData(res.data))
                if (res?.redirect) {
                    redirect(res.redirectTo)
                }
            })
        }
    }

    return (

        <form className="UserForm logIn" onSubmit={handleOnSubmit}>
            <div className="UserFormCont">
                <div className="UserInputTitleCont">
                    <label className="UserTitleLable">Log In</label>
                </div>
                <div className="UserInputCont">
                    <label className="UserLable" htmlFor="email">Email</label>
                    <input className="UserInputText" id='email' type='email' value={formInfo.email} name='email' onChange={handleChange} />
                </div>
                <div className="UserInputCont">
                    <label className="UserLable" htmlFor="password">Password</label>
                    <input className="UserInputText" id='password' type='password' value={formInfo.password} name='password' onChange={handleChange} />
                </div>
                <div className="UserInputTitleCont">
                    <button type="submit" className="UserInputBtn">Log In</button>
                </div>
                <div className="UserInputCont">
                    <p>Not a user?<NavLink to="/signup"> Sign up</NavLink></p>
                </div>

            </div>
            <Outlet />

        </form>
    )
}