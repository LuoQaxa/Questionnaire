import React from "react";
import styles from "./index.module.scss";

interface SpaceProps {
  align?: "start" | "end" | "center" | "baseline";
}

const Space: React.FC<SpaceProps> = ({ children }) => {
  return <div className={styles.wrap}>{children}</div>;
};

export default Space;
