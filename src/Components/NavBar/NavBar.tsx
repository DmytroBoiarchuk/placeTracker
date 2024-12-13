import classes from "./NavBar.module.scss";
import Search from "./Components/Search/Search.tsx";
import Logo from "./Components/Logo/Logo.tsx";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation } from "react-router";
import { motion } from "motion/react";

const NavBar = (): JSX.Element => {
  const location = useLocation();

  //is "/wishlist" current path? to show different stiles and animate them
  const isWishlist = location.pathname === "/wishlist";

  return (
    <motion.div
      animate={
        isWishlist ? { background: "#7fb9cf" } : { background: "#246780" }
      }
      transition={{ duration: 1 }}
      className={classes.navBarContainer}
    >
      <Logo />
      <Search />
      <Link to={"/wishlist"} className={classes.savedButton}>
        <p>Saved</p> <FaHeart />
      </Link>
    </motion.div>
  );
};

export default NavBar;
