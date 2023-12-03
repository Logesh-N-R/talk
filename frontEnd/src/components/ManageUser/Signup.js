import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';
import Apicall from "../Apicall";



export default function Signup() {
    const navigate = useNavigate();
    const [formInfo, setFormInfo] = useState({ username: '', 'email': '', password: '', cpw: '' })
    function handleChange(e) {
        setFormInfo(preForm => (
            { ...preForm, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }
        ))

    }
    function handleOnSubmit(event) {
        event.preventDefault();
        if (formInfo.username.length <= 0 || formInfo.email.length <= 0 || formInfo.password.length <= 0 || formInfo.cpw.length <= 0) {
            // toast.success('🦄 Wow so easy!');
            // toast.warn('🦄 Wow so easy!');
            // toast.info('🦄 Wow so easy!');
            // toast('🦄 Wow so easy!');
            toast.warn('Empty fields found!');
        } else if (formInfo.password.length < 8) {
            toast.warn('Use stronger password');
        } else if (formInfo.password !== formInfo.cpw) {
            toast.warn('Password mismatch');
        } else if (formInfo.username.length <= 3) {
            toast.warn('Too short name!');
        } else {
            if (formInfo.newslettersub) {
                console.log('thanks for subs');
            } else {
                Apicall('signUp', formInfo).then((res) => {
                    if (res?.redirect) {
                        navigate(res.redirectTo)
                    };
                })
            }
        }
    }
    return (

        <form className="UserForm signUP" onSubmit={handleOnSubmit}>
            <div className="UserFormCont">
                <div className="UserInputTitleCont">
                    <label className="UserTitleLable">Sign Up</label>
                </div>
                <div className="UserInputCont">
                    <label className="UserLable" htmlFor="username">Name</label>
                    <input className="UserInputText" id='username' type='text' value={formInfo.username} name='username' onChange={handleChange} />
                </div>
                <div className="UserInputCont">
                    <label className="UserLable" htmlFor="email">Email</label>
                    <input className="UserInputText" id='email' type='email' value={formInfo.email} name='email' onChange={handleChange} />
                </div>
                <div className="UserInputCont">
                    <label className="UserLable" htmlFor="password">Password</label>
                    <input className="UserInputText" id='password' type='password' value={formInfo.password} name='password' onChange={handleChange} />
                </div>

                <div className="UserInputCont">
                    <label className="UserLable" htmlFor="cpassword">Confirm Password</label>
                    <input className="UserInputText" id='cpassword' type='password' value={formInfo.cp} name='cpw' onChange={handleChange} />
                </div>
                <div className="UserInputTitleCont">
                    <button type="submit" className="UserInputBtn">Sign Up</button>
                </div>
                <div className="UserInputCont">
                    <p>Already a user?<NavLink to="/login">  Log in</NavLink></p>
                </div>

            </div>
            <Outlet />

        </form>

    )
}