import classes from "./Logo.module.scss";
import logo from "../../../../assets/logo.svg";
import {Link} from "react-router";

const Logo = () => {
    return (
        <Link to={'/'} className={classes.logo}>
            <img src={logo} alt="logo"/>
            <h1>Place Tracker</h1>
        </Link>
    );
};

export default Logo;