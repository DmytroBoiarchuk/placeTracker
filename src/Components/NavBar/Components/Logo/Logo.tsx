import classes from "./Logo.module.scss";
import logo from "../../../../assets/logo.svg";

const Logo = () => {
    return (
        <div className={classes.logo}>
            <img src={logo} alt="logo"/>
            <h1>Place Tracker</h1>
        </div>
    );
};

export default Logo;