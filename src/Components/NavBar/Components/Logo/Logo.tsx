import classes from "./Logo.module.scss";
import LogoSVG from "../../../../assets/logo.svg";
import {Link} from "react-router";

const Logo = () => {
    return (
        <Link to={'/'} className={classes.logo}>
            <LogoSVG />
            <h1>Place Tracker</h1>
        </Link>
    );
};

export default Logo;
