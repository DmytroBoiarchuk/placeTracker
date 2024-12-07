import classes from "./NavBar.module.scss";
import Search from "./Components/Search/Search.tsx";
import Logo from "./Components/Logo/Logo.tsx";
import {FaHeart} from "react-icons/fa";
import {Link} from "react-router";
const NavBar = (): JSX.Element => {
  return (
    <div className={classes.navBarContainer}>
      <Logo />
      <Search />
      <Link to={'/wishlist'} className={classes.savedButton}><p>Saved</p> <FaHeart /></Link>
    </div>
  );
};

export default NavBar;
