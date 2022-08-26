import classNames from "classnames";
import React, { useEffect } from "react";
import "./index.scss";

type Props = {
  visible: boolean; // 外部传入当前的组件的显隐状态
};

const Transition: React.FC<Props> = (props) => {
  const { children, visible } = props;

  return (
    <div
      className={classNames("transiton_wrap", {
        transiton_wrap_hidden: !visible,
      })}
    >
      {children}
    </div>
  );
};
export default Transition;
