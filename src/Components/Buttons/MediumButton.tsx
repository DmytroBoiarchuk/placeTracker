import classes from "./MediumButton.module.scss";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface MediumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  classNames?: string;
}

function MediumButton({
  children,
  classNames = "",
  ...props
}: MediumButtonProps): JSX.Element {
  return (
    <button className={`${classNames} ${classes.button}`} {...props}>
      {children}
    </button>
  );
}

export default MediumButton;
