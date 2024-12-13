import classes from "./Logo.module.scss";
import LogoSVG from "../../../../assets/logo.svg";

const Logo = () => {
    return (
        <div className={classes.logo}>
            <LogoSVG />
            <h1>Place Tracker</h1>
        </div>
    );
};

export default Logo;
