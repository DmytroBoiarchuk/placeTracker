import classes from "./Error.module.scss";
import { useNavigate } from "react-router";
import {Dispatch, SetStateAction} from "react";

const Error = ({ error, setShowError }: { error: Error | null , setShowError: Dispatch<SetStateAction<boolean>> | undefined}): JSX.Element => {
  const navigate = useNavigate();
  function handleClose() {
    if(setShowError)
    setShowError(false);
    navigate("/");
  }
  return (
    <div className={classes.errorBlock}>
      <div className={classes.error}>
        <h1>OoPs!! Something went wrong</h1>
        <p>{error?.message}</p>
        <button
          onClick={() => {
            handleClose();
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Error;
