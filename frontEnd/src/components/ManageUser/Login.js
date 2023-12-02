import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import Apicall from "../Apicall";

export default function Login(props) {
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
            Apicall('logIn', formInfo).then((res)=>{
                if(res?.data){
                    console.log(props)
                    props.successLogin(res.data)
                }
                if(res?.redirect){
                    props.redirect(res.redirectTo)
                }
            })
        }
    }

    return (

        <form className="UserForm logIn" onSubmit={handleOnSubmit}>
            <div className="UserFormCont">
                <div className="UserInputTitleCont">
                    <lable className="UserTitleLable">Log In</lable>
                </div>
                <div className="UserInputCont">
                    <label className="UserLable" htmlFor="email">Email</label>
                    <input className="UserInputText" id='email' type='email' value={formInfo.email} name='email' onChange={handleChange} />
                </div>
                <div className="UserInputCont">
                    <lable className="UserLable" htmlFor="password">Password</lable>
                    <input className="UserInputText" id='password' type='password' value={formInfo.password} name='password' onChange={handleChange} />
                </div>
                <div className="UserInputTitleCont">
                    <button type="submit" className="UserInputBtn">Log In</button>
                </div>
                <div className="UserInputCont">
                    <p1>Not a user?<NavLink to="/signup"> Sign up</NavLink></p1>
                </div>

            </div>
            <Outlet />

        </form>
    )
}