import notfound from "../images/404.gif"
import { Outlet, NavLink } from "react-router-dom";

const NoPage = () => {
  return <div className="NotFound">
    <img src={notfound} alt="not found 404" />
    <div className="NotFoundText">NOT FOUND</div>
    <p1 className="NotFoundLink"><NavLink to="/login">Back to log in?</NavLink></p1>
    <Outlet/>
    </div>;
};

export default NoPage;