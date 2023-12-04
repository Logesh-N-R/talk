import notfound from "../images/404.gif"
import { Outlet, NavLink } from "react-router-dom";

const NoPage = () => {
  return <div className="NotFound">
    <img src={notfound} alt="not found 404" />
    <div className="NotFoundText">NOT FOUND</div>
    <p className="NotFoundLink"><NavLink to="/login">Back to log in?</NavLink></p>
    <Outlet/>
    </div>;
};

export default NoPage;