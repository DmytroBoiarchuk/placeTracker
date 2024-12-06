import classes from "./NavBar.module.scss";
import Search from "./Components/Search/Search.tsx";
import Logo from "./Components/Logo/Logo.tsx";
import SavedPlaces from "./Components/SavedPlaces/SavedPlaces.tsx";
const NavBar = (): JSX.Element => {
  return (
    <div className={classes.navBarContainer}>
      <Logo />
      <Search />
      <SavedPlaces />
    </div>
  );
};

export default NavBar;
