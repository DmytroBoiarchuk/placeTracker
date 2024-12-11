import classes from "./PlaceTips.module.scss";
import { format } from "date-fns";
import { motion } from "motion/react";

const PlaceTips = ({
  tips,
  isTipsShown,
}: {
  tips: { created_at: string; text: string }[] | undefined;
  isTipsShown: boolean;
}):JSX.Element => {
  return (
    <motion.div
      data-testid="place-tips"
      initial={{ display: "none", opacity: 0, y: -200 }}
      animate={
        isTipsShown
          ? { display: "flex", opacity: 1, y: 0 }
          : { display: "none", opacity: 0, y: -200 }
      }
      transition={{ duration: 0.5 }}
      className={classes.tips}
    >
      {tips?.map((tip) => (
        <div key={tip.text} className={classes.tipBox}>
          <p className={classes.tipDate}>
            {format(new Date(tip.created_at), "dd.MM.yyyy HH:mm")}
          </p>
          <p className={classes.tipText}>{tip.text}</p>
        </div>
      ))}
    </motion.div>
  );
};

export default PlaceTips;
