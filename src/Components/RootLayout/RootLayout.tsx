import { Outlet } from "react-router";
import NavBar from "../NavBar/NavBar.tsx";

function RootLayout(): JSX.Element {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default RootLayout;
